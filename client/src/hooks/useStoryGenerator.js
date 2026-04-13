import { useState, useCallback } from 'react';
import { buildStoryRequest } from '../utils/promptBuilder.js';
import { getRecentPlotTypes, pushPlotType, saveToLibrary } from '../utils/storyCache.js';
import { recordStoryGenerated, getUsageStats } from '../utils/tierGate.js';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase.js';

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
      const usage = recordStoryGenerated(story.estimatedMinutes || 0);

      // Sync usage stats to Firestore so admin can see them
      if (db && auth?.currentUser) {
        try {
          await setDoc(
            doc(db, 'users', auth.currentUser.uid),
            {
              usage: {
                totalStories: usage.totalStories || 0,
                totalMinutes: usage.totalMinutes || 0,
                lastStoryAt: new Date().toISOString(),
              },
            },
            { merge: true }
          );
        } catch {
          // non-critical
        }
      }

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
