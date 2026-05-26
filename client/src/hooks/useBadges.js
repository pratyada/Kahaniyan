// Badge / Achievement system — tracks and awards badges based on activity.
// localStorage-first. Checks conditions on every call and unlocks new badges.

import { useMemo, useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'mst:badges';

let listeners = new Set();
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function notify() { listeners.forEach(cb => cb()); }

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

// ── Badge Definitions ──
export const BADGES = [
  // Streak badges
  { id: 'streak_2', category: 'streak', emoji: '🌱', title: 'Seedling', desc: '2-day streak', condition: (ctx) => ctx.streak >= 2 },
  { id: 'streak_3', category: 'streak', emoji: '🌿', title: 'Sprout', desc: '3-day streak', condition: (ctx) => ctx.streak >= 3 },
  { id: 'streak_7', category: 'streak', emoji: '🌟', title: 'Story Star', desc: '7-day streak', condition: (ctx) => ctx.streak >= 7 },
  { id: 'streak_14', category: 'streak', emoji: '🏆', title: 'Champion', desc: '14-day streak', condition: (ctx) => ctx.streak >= 14 },
  { id: 'streak_30', category: 'streak', emoji: '👑', title: 'Legendary', desc: '30-day streak', condition: (ctx) => ctx.streak >= 30 },
  { id: 'streak_60', category: 'streak', emoji: '🔥', title: 'Unstoppable', desc: '60-day streak', condition: (ctx) => ctx.streak >= 60 },
  { id: 'streak_100', category: 'streak', emoji: '💎', title: 'Diamond', desc: '100-day streak', condition: (ctx) => ctx.streak >= 100 },

  // Play milestones
  { id: 'first_story', category: 'play', emoji: '🎧', title: 'First Listen', desc: 'Played your first story', condition: (ctx) => ctx.totalPlays >= 1 },
  { id: 'plays_10', category: 'play', emoji: '📚', title: 'Bookworm', desc: '10 stories played', condition: (ctx) => ctx.totalPlays >= 10 },
  { id: 'plays_25', category: 'play', emoji: '🦉', title: 'Night Owl', desc: '25 stories played', condition: (ctx) => ctx.totalPlays >= 25 },
  { id: 'plays_50', category: 'play', emoji: '🧙', title: 'Story Wizard', desc: '50 stories played', condition: (ctx) => ctx.totalPlays >= 50 },
  { id: 'plays_100', category: 'play', emoji: '🌙', title: 'Dream Master', desc: '100 stories played', condition: (ctx) => ctx.totalPlays >= 100 },

  // Series completion
  { id: 'series_first', category: 'series', emoji: '📖', title: 'Series Starter', desc: 'Completed your first series', condition: (ctx) => ctx.seriesCompleted >= 1 },
  { id: 'series_3', category: 'series', emoji: '🎬', title: 'Binge Listener', desc: 'Completed 3 series', condition: (ctx) => ctx.seriesCompleted >= 3 },

  // Tradition explorer
  { id: 'tradition_1', category: 'explore', emoji: '🌍', title: 'Explorer', desc: 'Listened to stories from 2 traditions', condition: (ctx) => ctx.traditionsExplored >= 2 },
  { id: 'tradition_3', category: 'explore', emoji: '🗺️', title: 'World Traveler', desc: 'Explored 4 traditions', condition: (ctx) => ctx.traditionsExplored >= 4 },
  { id: 'tradition_all', category: 'explore', emoji: '🌈', title: 'Rainbow Listener', desc: 'Explored all traditions', condition: (ctx) => ctx.traditionsExplored >= 6 },

  // Collection completion
  { id: 'collection_first', category: 'collection', emoji: '🎯', title: 'Completionist', desc: 'Finished a whole collection', condition: (ctx) => ctx.collectionsCompleted >= 1 },

  // Special
  { id: 'voice_recorded', category: 'special', emoji: '🎤', title: 'My Voice', desc: 'Recorded your voice in a story', condition: (ctx) => ctx.hasVoiceClip },
  { id: 'shared_story', category: 'special', emoji: '💌', title: 'Storyteller', desc: 'Shared a story with someone', condition: (ctx) => ctx.hasShared },
  { id: 'weekend_warrior', category: 'special', emoji: '🛋️', title: 'Weekend Warrior', desc: 'Listened on both Saturday and Sunday', condition: (ctx) => ctx.weekendListened },
];

export const BADGE_CATEGORIES = [
  { key: 'streak', label: 'Streaks', emoji: '🔥' },
  { key: 'play', label: 'Listening', emoji: '🎧' },
  { key: 'series', label: 'Series', emoji: '📖' },
  { key: 'explore', label: 'Explorer', emoji: '🌍' },
  { key: 'collection', label: 'Collections', emoji: '🎯' },
  { key: 'special', label: 'Special', emoji: '⭐' },
];

// ── Build context from localStorage data ──
function buildContext() {
  const streak = (() => {
    try { return JSON.parse(localStorage.getItem('mst:streakData') || '{}'); } catch { return {}; }
  })();
  const series = (() => {
    try { return JSON.parse(localStorage.getItem('mst:seriesProgress') || '{}'); } catch { return {}; }
  })();
  const plays = (() => {
    try { return JSON.parse(localStorage.getItem('mst:playHistory') || '[]'); } catch { return []; }
  })();

  // Count unique traditions played
  const traditions = new Set(plays.map(p => p.tradition).filter(Boolean));

  // Count completed series (all episodes done)
  let seriesCompleted = 0;
  for (const [, sp] of Object.entries(series)) {
    if (sp.completed?.length >= 3) seriesCompleted++; // rough: 3+ episodes = done
  }

  // Check voice clips
  let hasVoiceClip = false;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('mst:voiceclips:')) { hasVoiceClip = true; break; }
  }

  // Check shares
  const hasShared = !!localStorage.getItem('mst:hasShared');

  // Check weekend listening
  const wh = streak.weekHistory || {};
  const dates = Object.keys(wh);
  let weekendListened = false;
  for (const d of dates) {
    const day = new Date(d).getDay();
    if (day === 0 || day === 6) {
      const otherDay = day === 0 ? 6 : 0;
      if (dates.some(dd => new Date(dd).getDay() === otherDay)) {
        weekendListened = true;
        break;
      }
    }
  }

  return {
    streak: streak.currentStreak || 0,
    longestStreak: streak.longestStreak || 0,
    totalPlays: plays.length,
    seriesCompleted,
    traditionsExplored: traditions.size,
    collectionsCompleted: 0, // TODO: track collection completion
    hasVoiceClip,
    hasShared,
    weekendListened,
  };
}

// ── Hook ──
export function useBadges() {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot);

  const checkBadges = useCallback(() => {
    const ctx = buildContext();
    const store = readStore();
    const newBadges = [];

    for (const badge of BADGES) {
      if (store[badge.id]) continue; // already unlocked
      if (badge.condition(ctx)) {
        store[badge.id] = { unlockedAt: new Date().toISOString(), seen: false };
        newBadges.push(badge);
      }
    }

    if (newBadges.length > 0) {
      writeStore(store);
    }

    return newBadges;
  }, []);

  const markSeen = useCallback((badgeId) => {
    const store = readStore();
    if (store[badgeId]) {
      store[badgeId].seen = true;
      writeStore(store);
    }
  }, []);

  const allBadges = useMemo(() => {
    return BADGES.map(b => ({
      ...b,
      unlocked: !!unlocked[b.id],
      unlockedAt: unlocked[b.id]?.unlockedAt || null,
      seen: unlocked[b.id]?.seen || false,
    }));
  }, [unlocked]);

  const unlockedCount = allBadges.filter(b => b.unlocked).length;
  const newBadges = allBadges.filter(b => b.unlocked && !b.seen);

  return { badges: allBadges, unlockedCount, totalBadges: BADGES.length, newBadges, checkBadges, markSeen };
}
