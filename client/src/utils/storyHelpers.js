// Shared story helpers — extracted from Home.jsx to prevent inline definitions.

import { CULTURAL_LESSONS, TRADITIONS } from '../data/culturalLessons.js';
import { mapCharactersToFamilyMembers } from './constants.js';
import { trackWisdomStoryPlayed } from './analytics.js';

export function recommendedValueFor(age) {
  if (age <= 4) return ['sharing', 'kindness'];
  if (age <= 7) return ['honesty', 'respect', 'gratitude'];
  if (age <= 10) return ['courage', 'patience', 'bravery'];
  return ['respect', 'gratitude', 'courage'];
}

export function fillTokens(text, profile, characters) {
  const familyMembers = characters?.length ? mapCharactersToFamilyMembers(characters) : null;
  const tokens = {
    childName: profile?.childName || 'little one',
    sibling: familyMembers?.sibling || profile?.sibling || 'their friend',
    grandfather: familyMembers?.grandfather || profile?.grandfather || 'Dada ji',
    grandmother: familyMembers?.grandmother || profile?.grandmother || 'Nani ma',
    pet: familyMembers?.pet || profile?.pet || 'their puppy',
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => tokens[k] ?? `{${k}}`);
}

export function pickTonightStory(beliefs, lessons) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  let pool = lessons || CULTURAL_LESSONS;
  if (beliefs?.length > 0) {
    const matched = pool.filter((l) => beliefs.includes(l.tradition) || l.tradition === 'universal');
    if (matched.length > 0) pool = matched;
  } else {
    const universal = pool.filter((l) => l.tradition === 'universal');
    if (universal.length > 0) pool = universal;
  }
  return pool.length > 0 ? pool[dayOfYear % pool.length] : null;
}

// Guest play gate — allows 2 free plays per device, then requires sign-in.
// Returns true if the guest can play, false if they need to sign in.
const GUEST_PLAYS_KEY = 'mst:guestPlays';
const FREE_PLAYS = 2;

export function getGuestPlaysUsed() {
  try {
    return parseInt(localStorage.getItem(GUEST_PLAYS_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementGuestPlays() {
  try {
    const count = getGuestPlaysUsed() + 1;
    localStorage.setItem(GUEST_PLAYS_KEY, String(count));
  } catch {}
}

export function canGuestPlay() {
  return getGuestPlaysUsed() < FREE_PLAYS;
}

export function playLesson(lesson, profile, wisdomAudioUrls, loadPlayer, navigate, user) {
  // If no user signed in, check guest play limit
  if (!user) {
    if (!canGuestPlay()) {
      if (window.__triggerLogin) window.__triggerLogin();
      return false;
    }
    incrementGuestPlays();
  }

  const filledText = fillTokens(lesson.body, profile);
  const pregenUrl = wisdomAudioUrls?.[lesson.id] || null;
  const story = {
    id: `lesson_${lesson.id}`,
    title: lesson.title,
    text: filledText,
    wordCount: filledText.split(/\s+/).length,
    estimatedMinutes: lesson.durationMinutes,
    value: 'kindness',
    language: profile?.language || 'English',
    voice: 'AI Narrator',
    tradition: lesson.tradition,
    source: lesson.source,
    createdAt: new Date().toISOString(),
    isWisdom: true,
    audioUrl: pregenUrl,
  };
  try {
    const key = 'mst:wisdomPlays';
    const plays = JSON.parse(localStorage.getItem(key) || '{}');
    plays[lesson.id] = (plays[lesson.id] || 0) + 1;
    plays._total = (plays._total || 0) + 1;
    localStorage.setItem(key, JSON.stringify(plays));
  } catch {}
  trackWisdomStoryPlayed(lesson.id, lesson.tradition);
  loadPlayer(story);
  navigate('/player');
}

export function getPlayCounts() {
  try {
    return JSON.parse(localStorage.getItem('mst:wisdomPlays') || '{}');
  } catch {
    return {};
  }
}

export function formatPlays(count) {
  if (!count) return '';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}
