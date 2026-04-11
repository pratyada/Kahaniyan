import { useState, useCallback } from 'react';
import { buildStoryRequest } from '../utils/promptBuilder.js';
import { getRecentPlotTypes, pushPlotType, saveToLibrary } from '../utils/storyCache.js';
import { recordStoryGenerated } from '../utils/tierGate.js';

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

      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const story = await res.json();

      pushPlotType(profile.childName, story.plotType);
      saveToLibrary(story);
      recordStoryGenerated();
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
