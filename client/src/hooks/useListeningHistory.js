// Track per-story listening progress for "Continue Listening" shelf.
// Stores in localStorage — no Firestore writes needed.

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'mst:listeningProgress';

let listeners = new Set();
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function notify() {
  listeners.forEach((cb) => cb());
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notify();
}

let snapshotCache = readStore();
function getSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '{}';
    const parsed = JSON.parse(raw);
    if (JSON.stringify(parsed) !== JSON.stringify(snapshotCache)) {
      snapshotCache = parsed;
    }
  } catch {}
  return snapshotCache;
}

export function useListeningHistory() {
  const progress = useSyncExternalStore(subscribe, getSnapshot);

  const updateProgress = useCallback((storyId, position, meta = {}) => {
    if (!storyId || typeof position !== 'number') return;
    const store = readStore();
    const existing = store[storyId] || {};
    // Only update if position moved by at least 5%
    if (existing.position && Math.abs(position - existing.position) < 0.05) return;
    store[storyId] = {
      ...existing,
      ...meta,
      storyId,
      position,
      updatedAt: Date.now(),
    };
    writeStore(store);
  }, []);

  const markComplete = useCallback((storyId) => {
    const store = readStore();
    if (store[storyId]) {
      store[storyId].position = 1;
      store[storyId].updatedAt = Date.now();
      writeStore(store);
    }
  }, []);

  const getInProgress = useCallback(() => {
    const entries = Object.values(progress);
    return entries
      .filter((e) => e.position > 0.05 && e.position < 0.95)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }, [progress]);

  return { progress, updateProgress, markComplete, getInProgress };
}
