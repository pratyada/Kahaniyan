// CRUD for post-story reflection answers in localStorage.

import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'mst:reflections';

let listeners = new Set();
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function notify() { listeners.forEach((cb) => cb()); }

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  snapshotCache = data;
  notify();
}

let snapshotCache = readStore();
function getSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (JSON.stringify(parsed) !== JSON.stringify(snapshotCache)) {
        snapshotCache = parsed;
      }
    }
  } catch {}
  return snapshotCache;
}

export function useReflections() {
  const reflections = useSyncExternalStore(subscribe, getSnapshot);

  const saveReflection = useCallback((storyId, data) => {
    const store = readStore();
    store[storyId] = { ...store[storyId], ...data, storyId };
    writeStore(store);
  }, []);

  const getReflection = useCallback((storyId) => {
    return reflections[storyId] || null;
  }, [reflections]);

  const getDeferredReflections = useCallback(() => {
    const cutoff = Date.now() - 12 * 60 * 60 * 1000; // last 12 hours
    return Object.values(reflections)
      .filter((r) => r.deferred && r.completedAt && new Date(r.completedAt).getTime() > cutoff)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }, [reflections]);

  const getAllReflections = useCallback(() => {
    return Object.values(reflections)
      .filter((r) => r.answers?.length > 0)
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  }, [reflections]);

  const markComplete = useCallback((storyId) => {
    const store = readStore();
    if (store[storyId]) {
      store[storyId].deferred = false;
      writeStore(store);
    }
  }, []);

  return { reflections, saveReflection, getReflection, getDeferredReflections, getAllReflections, markComplete };
}
