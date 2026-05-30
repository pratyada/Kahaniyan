// Share a story via Firestore — creates a public link anyone can play.
// Also handles likes and top stories discovery.
import { db, auth } from '../lib/firebase.js';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';

export async function shareStoryToFirestore(story, { beliefs, country } = {}) {
  if (!db || !story?.id) throw new Error('Cannot share');

  const shareId = story.id;
  const ref = doc(db, 'sharedStories', shareId);

  // If already shared, update any missing fields
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const data = existing.data();
    const updates = {};
    if (!data.text && story.text) updates.text = story.text;
    if (!data.title && story.title) updates.title = story.title;
    if (!data.value && story.value) updates.value = story.value;
    if (!data.audioUrl && story.audioUrl) updates.audioUrl = story.audioUrl;
    if (!data.tradition && story.tradition) updates.tradition = story.tradition;
    if (Object.keys(updates).length > 0) {
      await setDoc(ref, updates, { merge: true });
    }
    return `${window.location.origin}/player?storyId=${shareId}`;
  }

  // Save story for public access
  await setDoc(ref, {
    id: story.id,
    title: story.title,
    text: story.text,
    value: story.value,
    estimatedMinutes: story.estimatedMinutes,
    language: story.language || 'English',
    voice: story.voice || 'AI Narrator',
    cast: story.cast || [],
    wordCount: story.wordCount || story.text?.split(/\s+/).length || 0,
    generatedBy: story.generatedBy || 'claude',
    createdAt: story.createdAt || new Date().toISOString(),
    sharedBy: auth?.currentUser?.uid || 'anonymous',
    sharedAt: new Date().toISOString(),
    // Audio URL so recipients can play instantly
    ...(story.audioUrl ? { audioUrl: story.audioUrl } : {}),
    // Tradition + theme for wisdom stories
    ...(story.tradition ? { tradition: story.tradition } : {}),
    ...(story.source ? { source: story.source } : {}),
    ...(story.isWisdom ? { isWisdom: true } : {}),
    // Metadata for discovery
    beliefs: beliefs || [],
    country: country || '',
    // Like tracking
    likes: 0,
    likedBy: [],
  });

  return `${window.location.origin}/player?storyId=${shareId}`;
}

export async function loadSharedStory(storyId) {
  if (!storyId) return null;

  const lessonId = storyId.startsWith('lesson_') ? storyId.slice(7) : storyId;

  // Check series episodes FIRST — local data is always complete
  try {
    const { SERIES } = await import('../data/series.js');
    for (const series of SERIES) {
      const ep = series.episodes.find(e => e.id === storyId || e.id === lessonId);
      if (ep) {
        let audioUrl = null;
        if (db) {
          try {
            const audioSnap = await getDoc(doc(db, 'config', 'wisdomAudio'));
            if (audioSnap.exists()) audioUrl = audioSnap.data()[ep.id] || null;
          } catch {}
        }
        return {
          id: ep.id,
          title: ep.title,
          text: ep.body,
          wordCount: (ep.body || '').split(/\s+/).length,
          estimatedMinutes: ep.durationMinutes,
          value: ep.value || 'courage',
          language: 'English',
          voice: 'AI Narrator',
          tradition: ep.tradition,
          source: ep.source,
          createdAt: new Date().toISOString(),
          isWisdom: true,
          seriesId: series.id,
          episodeId: ep.id,
          audioUrl,
        };
      }
    }
  } catch {}

  // Check wisdom stories — local data is always complete

  try {
    const { CULTURAL_LESSONS } = await import('../data/culturalLessons.js');
    const lesson = CULTURAL_LESSONS.find((l) => l.id === lessonId || l.id === storyId);
    if (lesson) {
      // Also try to get pre-gen audio URL
      let audioUrl = null;
      if (db) {
        try {
          const audioSnap = await getDoc(doc(db, 'config', 'wisdomAudio'));
          if (audioSnap.exists()) audioUrl = audioSnap.data()[lesson.id] || null;
        } catch {}
      }
      return {
        id: `lesson_${lesson.id}`,
        title: lesson.title,
        text: lesson.body,
        wordCount: lesson.body.split(/\s+/).length,
        estimatedMinutes: lesson.durationMinutes,
        value: 'kindness',
        language: 'English',
        voice: 'AI Narrator',
        tradition: lesson.tradition,
        source: lesson.source,
        createdAt: new Date().toISOString(),
        isWisdom: true,
        audioUrl,
      };
    }
  } catch {}

  // Check collection stories
  try {
    const { COLLECTIONS } = await import('../data/collections.js');
    for (const col of COLLECTIONS) {
      const story = col.stories.find(s => s.id === storyId || s.id === lessonId);
      if (story) {
        let audioUrl = null;
        if (db) {
          try {
            const audioSnap = await getDoc(doc(db, 'config', 'wisdomAudio'));
            if (audioSnap.exists()) audioUrl = audioSnap.data()[story.id] || null;
          } catch {}
        }
        return {
          id: story.id,
          title: story.title,
          text: story.body,
          wordCount: (story.body || '').split(/\s+/).length,
          estimatedMinutes: story.durationMinutes,
          value: story.theme || 'kindness',
          language: 'English',
          voice: 'AI Narrator',
          tradition: story.tradition,
          source: story.source || col.title,
          createdAt: new Date().toISOString(),
          isWisdom: true,
          audioUrl,
        };
      }
    }
  } catch {}

  // Last resort: check Firestore shared stories (user-generated stories)
  if (db) {
    try {
      const ref = doc(db, 'sharedStories', storyId);
      const snap = await getDoc(ref);
      if (snap.exists()) return { id: storyId, ...snap.data() };
    } catch {}
  }

  return null;
}

// Like / unlike a shared story
export async function toggleLike(storyId) {
  if (!db || !storyId) return null;
  const uid = auth?.currentUser?.uid;
  if (!uid) return null;

  const ref = doc(db, 'sharedStories', storyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  const alreadyLiked = (data.likedBy || []).includes(uid);

  if (alreadyLiked) {
    await updateDoc(ref, {
      likes: increment(-1),
      likedBy: arrayRemove(uid),
    });
    return { liked: false, likes: (data.likes || 1) - 1 };
  } else {
    await updateDoc(ref, {
      likes: increment(1),
      likedBy: arrayUnion(uid),
    });
    return { liked: true, likes: (data.likes || 0) + 1 };
  }
}

// Check if current user liked a story
export function isLikedByMe(story) {
  const uid = auth?.currentUser?.uid;
  if (!uid || !story?.likedBy) return false;
  return story.likedBy.includes(uid);
}

// Record a listen on a shared story (anonymous — no auth required)
export async function recordListen(storyId) {
  if (!db || !storyId) return;
  try {
    const ref = doc(db, 'sharedStories', storyId);
    await updateDoc(ref, { listens: increment(1) });
  } catch {}
}

// Fetch top stories — optionally filtered by belief/country
export async function getTopStories({ belief, country, max = 20 } = {}) {
  if (!db) return [];
  try {
    const col = collection(db, 'sharedStories');
    // Firestore doesn't support multiple inequality filters,
    // so we fetch top-liked and filter client-side
    const q = query(col, orderBy('likes', 'desc'), limit(100));
    const snap = await getDocs(q);
    let results = [];
    snap.forEach((d) => results.push({ id: d.id, ...d.data() }));

    // Client-side filter
    if (belief && belief !== 'all') {
      results = results.filter((s) => (s.beliefs || []).includes(belief));
    }
    if (country && country !== 'all') {
      results = results.filter((s) => s.country === country);
    }

    return results.slice(0, max);
  } catch (e) {
    console.error('Failed to load top stories:', e);
    return [];
  }
}
