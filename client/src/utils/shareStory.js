// Share a story via Firestore — creates a public link anyone can play.
import { db, auth } from '../lib/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function shareStoryToFirestore(story) {
  if (!db || !story?.id) throw new Error('Cannot share');

  const shareId = story.id;
  const ref = doc(db, 'sharedStories', shareId);

  // Check if already shared
  const existing = await getDoc(ref);
  if (existing.exists()) {
    return `${window.location.origin}/player?storyId=${shareId}`;
  }

  // Save story for public access (strip any sensitive data)
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
