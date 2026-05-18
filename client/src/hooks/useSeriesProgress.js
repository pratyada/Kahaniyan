// Track series episode completion in localStorage.

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'mst:seriesProgress';

let listeners = new Set();
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function notify() { listeners.forEach((cb) => cb()); }

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function writeStore(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); snapshotCache = data; notify(); }

let snapshotCache = readStore();
function getSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const p = JSON.parse(raw); if (JSON.stringify(p) !== JSON.stringify(snapshotCache)) snapshotCache = p; }
  } catch {}
  return snapshotCache;
}

export function useSeriesProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot);

  const getSeriesProgress = useCallback((seriesId) => {
    return progress[seriesId] || { currentEpisode: 1, completed: [], startedAt: null, lastPlayedAt: null };
  }, [progress]);

  const markEpisodeComplete = useCallback((seriesId, episodeId) => {
    const store = readStore();
    const sp = store[seriesId] || { currentEpisode: 1, completed: [], startedAt: new Date().toISOString() };
    if (!sp.completed.includes(episodeId)) {
      sp.completed.push(episodeId);
    }
    sp.currentEpisode = sp.completed.length + 1;
    sp.lastPlayedAt = new Date().toISOString();
    store[seriesId] = sp;
    writeStore(store);
  }, []);

  const isEpisodeComplete = useCallback((seriesId, episodeId) => {
    const sp = progress[seriesId];
    return sp?.completed?.includes(episodeId) || false;
  }, [progress]);

  return { progress, getSeriesProgress, markEpisodeComplete, isEpisodeComplete };
}
