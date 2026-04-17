// Share a story via Firestore — creates a public link anyone can play.
// Also handles likes and top stories discovery.
import { db, auth } from '../lib/firebase.js';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';

export async function shareStoryToFirestore(story, { beliefs, country } = {}) {
  if (!db || !story?.id) throw new Error('Cannot share');

  const shareId = story.id;
  const ref = doc(db, 'sharedStories', shareId);

  // Check if already shared
  const existing = await getDoc(ref);
  if (existing.exists()) {
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
  if (!db || !storyId) return null;
  try {
    const ref = doc(db, 'sharedStories', storyId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data();
  } catch {
    return null;
  }
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
