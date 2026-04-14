import { useState, useCallback } from 'react';
import { buildStoryRequest } from '../utils/promptBuilder.js';
import { getRecentPlotTypes, pushPlotType, saveToLibrary } from '../utils/storyCache.js';
import { recordStoryGenerated } from '../utils/tierGate.js';
import { auth, db } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

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
      console.log('[Qissaa:gen] Building request...');

      let body;
      try {
        const recentPlotTypes = getRecentPlotTypes(profile?.childName || 'default');
        body = buildStoryRequest({
          profile: profile || {},
          value,
          duration,
          language,
          voice,
          recentPlotTypes,
          whisper,
          whisperOverridesValue,
          selectedCharacters,
        });
      } catch (buildErr) {
        console.error('[Qissaa:gen] buildStoryRequest crashed:', buildErr);
        throw new Error('Failed to build story request: ' + buildErr.message);
      }

      const uid = auth?.currentUser?.uid || null;
      console.log('[Qissaa:gen] Calling API...', { uid: uid?.slice(0, 8), value, duration });

      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, uid }),
      });

      console.log('[Qissaa:gen] API response:', res.status);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      const story = await res.json();
      console.log('[Qissaa:gen] Story received:', story.title);

      try {
        pushPlotType(profile?.childName || 'default', story.plotType);
        saveToLibrary(story);
        const usage = recordStoryGenerated(story.estimatedMinutes || 0);

        // Sync usage to Firestore so admin dashboard shows it
        if (db && auth?.currentUser) {
          setDoc(
            doc(db, 'users', auth.currentUser.uid),
            {
              usage: {
                totalStories: usage.totalStories || 0,
                totalMinutes: usage.totalMinutes || 0,
                lastStoryAt: new Date().toISOString(),
              },
            },
            { merge: true }
          ).catch(() => {}); // fire and forget
        }
      } catch (cacheErr) {
        console.warn('[Qissaa:gen] Cache/save error (non-fatal):', cacheErr);
      }

      return story;
    } catch (e) {
      console.error('[Qissaa:gen] FAILED:', e.message);
      setError(e.message || 'Could not generate story');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}
