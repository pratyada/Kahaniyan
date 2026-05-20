// Server-side play tracking — records every completed play in Firestore.
// Works for both logged-in users and guests.
// Feeds into creator credit system and real play counts.

import { db, auth } from '../lib/firebase.js';

// Record a completed play to Firestore
export async function recordStoryPlay(story) {
  if (!db || !story?.id) return;

  try {
    const { doc, setDoc, increment, getDoc } = await import('firebase/firestore');
    const storyId = story.id;
    const uid = auth?.currentUser?.uid || 'guest';

    // 1. Increment global play counter for this story
    const playRef = doc(db, 'storyPlays', storyId);
    await setDoc(playRef, {
      plays: increment(1),
      lastPlayedAt: new Date().toISOString(),
      title: story.title || '',
      seriesId: story.seriesId || null,
      episodeId: story.episodeId || null,
    }, { merge: true });

    // 2. Also update localStorage for instant local display
    try {
      const key = 'mst:wisdomPlays';
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      plays[storyId] = (plays[storyId] || 0) + 1;
      plays._total = (plays._total || 0) + 1;
      localStorage.setItem(key, JSON.stringify(plays));
    } catch {}

    // 3. Record individual play event (for analytics / credits)
    const eventRef = doc(db, 'playEvents', `${storyId}_${uid}_${Date.now()}`);
    await setDoc(eventRef, {
      storyId,
      seriesId: story.seriesId || null,
      episodeId: story.episodeId || null,
      uid,
      isGuest: uid === 'guest',
      playedAt: new Date().toISOString(),
    }).catch(() => {}); // non-critical

    console.log('[PlayTracker] Recorded play:', storyId);
  } catch (e) {
    console.warn('[PlayTracker] Failed (non-fatal):', e.message);
  }
}

// Get real play count from Firestore for a story
export async function getRealPlayCount(storyId) {
  if (!db || !storyId) return 0;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'storyPlays', storyId));
    return snap.exists() ? (snap.data().plays || 0) : 0;
  } catch { return 0; }
}

// Get all real play counts (batch load for home page)
export async function getAllPlayCounts() {
  if (!db) return {};
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, 'storyPlays'));
    const counts = {};
    snap.forEach((d) => { counts[d.id] = d.data().plays || 0; });
    return counts;
  } catch { return {}; }
}
