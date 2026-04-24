// Non-repetition engine: tracks the last 10 plot types per child
// so the selector can avoid serving the same shape twice in a row.
import { db, auth } from '../lib/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const KEY = (childName) => `mst:plotHistory:${childName || 'default'}`;
const MAX = 10;

export function getRecentPlotTypes(childName) {
  try {
    const raw = localStorage.getItem(KEY(childName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushPlotType(childName, plotType) {
  if (!plotType) return;
  const list = getRecentPlotTypes(childName);
  const next = [plotType, ...list.filter((p) => p !== plotType)].slice(0, MAX);
  localStorage.setItem(KEY(childName), JSON.stringify(next));
}

const LIB_KEY = 'mst:library';
const MAX_STORIES = 200;

// ─── Local storage (fast, offline) ───

export function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
  } catch {
    return [];
  }
}

function setLibraryLocal(stories) {
  localStorage.setItem(LIB_KEY, JSON.stringify(stories.slice(0, MAX_STORIES)));
}

export function saveToLibrary(story) {
  const list = getLibrary();
  // Dedupe by id
  const next = [story, ...list.filter((s) => s.id !== story.id)].slice(0, MAX_STORIES);
  setLibraryLocal(next);
  // Fire-and-forget sync to Firestore
  syncLibraryToFirestore(next);
}

export function updateStoryInLibrary(storyId, updates) {
  const list = getLibrary();
  const next = list.map((s) => (s.id === storyId ? { ...s, ...updates } : s));
  setLibraryLocal(next);
  syncLibraryToFirestore(next);
}

export function removeFromLibrary(storyId) {
  const next = getLibrary().filter((s) => s.id !== storyId);
  setLibraryLocal(next);
  syncLibraryToFirestore(next);
}

export function pruneArchive(maxDays) {
  if (!maxDays || maxDays === Infinity) return;
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
  const next = getLibrary().filter(
    (s) => new Date(s.createdAt).getTime() >= cutoff
  );
  setLibraryLocal(next);
}

// ─── One-time audio cache clear (TTS upgrade) ───
const AUDIO_CLEAR_KEY = 'mst:audioClearedV2';
if (!localStorage.getItem(AUDIO_CLEAR_KEY)) {
  try {
    const lib = getLibrary();
    if (lib.length > 0) {
      const cleaned = lib.map((s) => { const { audioUrl, ...rest } = s; return rest; });
      setLibraryLocal(cleaned);
    }
    localStorage.setItem(AUDIO_CLEAR_KEY, '1');
  } catch {}
}

// ─── Firestore sync (cross-device) ───

function syncLibraryToFirestore(stories) {
  const uid = auth?.currentUser?.uid;
  if (!db || !uid) return;
  // Save lightweight version — strip full text to save space,
  // keep enough to display cards and replay
  const lightweight = stories.slice(0, 100).map((s) => ({
    id: s.id,
    title: s.title,
    text: s.text,
    value: s.value,
    estimatedMinutes: s.estimatedMinutes,
    language: s.language || 'English',
    voice: s.voice || '',
    cast: s.cast || [],
    wordCount: s.wordCount || 0,
    generatedBy: s.generatedBy || '',
    createdAt: s.createdAt || '',
    whisper: s.whisper || null,
    plotType: s.plotType || '',
    coverImage: s.coverImage || null,
  }));
  setDoc(doc(db, 'users', uid), { library: lightweight }, { merge: true }).catch(() => {});
}

// Load from Firestore and merge with local — called once on app load
export async function loadAndMergeLibrary() {
  const uid = auth?.currentUser?.uid;
  if (!db || !uid) return getLibrary();

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const cloudLib = snap.exists() ? (snap.data().library || []) : [];
    const localLib = getLibrary();

    if (cloudLib.length === 0) {
      // Nothing in cloud — push local up
      if (localLib.length > 0) syncLibraryToFirestore(localLib);
      return localLib;
    }

    // Merge: dedupe by id, combine fields (cloud coverImage wins), sort by createdAt desc
    const merged = new Map();
    for (const s of [...cloudLib, ...localLib]) {
      if (!s.id) continue;
      if (merged.has(s.id)) {
        // Merge fields — keep existing but fill in missing ones (especially coverImage from cloud)
        const existing = merged.get(s.id);
        merged.set(s.id, { ...s, ...existing, coverImage: existing.coverImage || s.coverImage || null });
      } else {
        merged.set(s.id, s);
      }
    }
    const result = [...merged.values()]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, MAX_STORIES);

    setLibraryLocal(result);
    // Sync merged result back if cloud was behind
    if (result.length > cloudLib.length) syncLibraryToFirestore(result);

    return result;
  } catch {
    return getLibrary();
  }
}
