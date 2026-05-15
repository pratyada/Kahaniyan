// Learning streak tracker — consecutive days a child completed a story.
// localStorage-first, no Firestore dependency.

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'mst:streakData';

const DEFAULT = {
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  weekHistory: {},
  milestones: [],
};

const MILESTONE_DAYS = [3, 7, 14, 30, 60, 100];

let listeners = new Set();
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function notify() { listeners.forEach((cb) => cb()); }

function readStore() {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...DEFAULT }; }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  snapshotCache = data;
  notify();
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}

let snapshotCache = readStore();
function getSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (JSON.stringify(parsed) !== JSON.stringify(snapshotCache)) {
        snapshotCache = { ...DEFAULT, ...parsed };
      }
    }
  } catch {}
  return snapshotCache;
}

export function useStreak() {
  const data = useSyncExternalStore(subscribe, getSnapshot);

  const recordPlay = useCallback(() => {
    const store = readStore();
    const today = todayStr();

    // Already recorded today
    if (store.lastPlayedDate === today) return;

    const yesterday = yesterdayStr();
    if (store.lastPlayedDate === yesterday) {
      // Consecutive day
      store.currentStreak += 1;
    } else if (store.lastPlayedDate === today) {
      // Same day, no-op
      return;
    } else {
      // Gap > 1 day, reset
      store.currentStreak = 1;
    }

    store.lastPlayedDate = today;
    store.longestStreak = Math.max(store.longestStreak, store.currentStreak);

    // Update week history (keep last 7 days)
    store.weekHistory[today] = true;
    const keys = Object.keys(store.weekHistory).sort();
    while (keys.length > 7) {
      delete store.weekHistory[keys.shift()];
    }

    writeStore(store);
  }, []);

  const checkMilestone = useCallback(() => {
    const store = readStore();
    for (const m of MILESTONE_DAYS) {
      if (store.currentStreak >= m && !store.milestones.includes(m)) {
        store.milestones.push(m);
        writeStore(store);
        return m;
      }
    }
    return null;
  }, []);

  const dismissMilestone = useCallback((m) => {
    const store = readStore();
    if (!store.milestones.includes(m)) {
      store.milestones.push(m);
      writeStore(store);
    }
  }, []);

  return {
    streak: data.currentStreak,
    longestStreak: data.longestStreak,
    lastPlayedDate: data.lastPlayedDate,
    weekHistory: data.weekHistory,
    recordPlay,
    checkMilestone,
    dismissMilestone,
  };
}
