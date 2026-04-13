import { useState, useCallback } from 'react';
import { buildStoryRequest } from '../utils/promptBuilder.js';
import { getRecentPlotTypes, pushPlotType, saveToLibrary } from '../utils/storyCache.js';
import { recordStoryGenerated, getUsageStats } from '../utils/tierGate.js';
import { auth } from '../lib/firebase.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useStoryGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async ({
      profile,
      value,
      duration,
      language,
      voice,
      whisper,
      whisperOverridesValue,
      selectedCharacters,
    }) => {
    setLoading(true);
    setError(null);
    try {
      const recentPlotTypes = getRecentPlotTypes(profile.childName);
      const body = buildStoryRequest({
        profile,
        value,
        duration,
        language,
        voice,
        recentPlotTypes,
        whisper,
        whisperOverridesValue,
        selectedCharacters,
      });

      // Include uid so server can enforce tier limits
      const uid = auth?.currentUser?.uid || null;
      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, uid }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      const story = await res.json();

      pushPlotType(profile.childName, story.plotType);
      saveToLibrary(story);
      recordStoryGenerated(story.estimatedMinutes || 0);
      // Usage is now tracked server-side in api/generate-story.js
      return story;
    } catch (e) {
      setError(e.message || 'Could not generate story');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}
