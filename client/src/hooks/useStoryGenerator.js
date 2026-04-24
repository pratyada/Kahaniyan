import { useState, useCallback } from 'react';
import { buildStoryRequest } from '../utils/promptBuilder.js';
import { getRecentPlotTypes, pushPlotType, saveToLibrary, updateStoryInLibrary } from '../utils/storyCache.js';
import { recordStoryGenerated } from '../utils/tierGate.js';
import { auth, db, storage } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Generate a cover image for a story in the background
async function generateCoverImage(story) {
  try {
    // Build a kid-friendly image prompt from the story title + first line
    const firstLine = (story.text || '').split('\n').find(l => l.trim()) || '';
    const snippet = firstLine.slice(0, 120);
    const prompt = `Scene from "${story.title}": ${snippet}`;

    const res = await fetch(`${API_BASE}/api/generate-story-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const { imageUrl: dalleUrl } = await res.json();
    if (!dalleUrl) return null;

    // Download DALL-E image and upload to Firebase Storage (DALL-E URLs expire)
    const imgRes = await fetch(dalleUrl);
    const imgBlob = await imgRes.blob();

    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storageRef = ref(storage, `story-covers/${story.id}.png`);
    await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
    const permanentUrl = await getDownloadURL(storageRef);

    // Update the story in library with the image
    updateStoryInLibrary(story.id, { coverImage: permanentUrl });

    return permanentUrl;
  } catch (err) {
    console.warn('[My Sleepy Tale:gen] Cover image generation failed (non-fatal):', err.message);
    return null;
  }
}

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
      console.log('[My Sleepy Tale:gen] Building request...');

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
        console.error('[My Sleepy Tale:gen] buildStoryRequest crashed:', buildErr);
        throw new Error('Failed to build story request: ' + buildErr.message);
      }

      const uid = auth?.currentUser?.uid || null;
      console.log('[My Sleepy Tale:gen] Calling API...', { uid: uid?.slice(0, 8), value, duration });

      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, uid }),
      });

      console.log('[My Sleepy Tale:gen] API response:', res.status);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      const story = await res.json();
      console.log('[My Sleepy Tale:gen] Story received:', story.title);

      try {
        pushPlotType(profile?.childName || 'default', story.plotType);
        saveToLibrary(story);
        const usage = recordStoryGenerated(story.estimatedMinutes || 0);

        // Fire-and-forget: generate a DALL-E cover image in background
        generateCoverImage(story).catch(() => {});

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
        console.warn('[My Sleepy Tale:gen] Cache/save error (non-fatal):', cacheErr);
      }

      return story;
    } catch (e) {
      console.error('[My Sleepy Tale:gen] FAILED:', e.message);
      setError(e.message || 'Could not generate story');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}
