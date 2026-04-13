// Tier feature gates — pure functions, no UI.
export const TIERS = {
  free: {
    label: 'Free',
    price: 'CA$0',
    storiesPerWeek: 3,
    maxDuration: 5,
    languageCount: 2,
    archiveDays: 7,
    customVoices: 0,
    childProfiles: 1,
    festivalPacks: false,
    offline: false,
    voiceCloning: false,
  },
  pro: {
    label: 'Pro',
    price: 'CA$9.99/mo',
    storiesPerWeek: Infinity,
    maxDuration: 30,
    languageCount: Infinity,
    archiveDays: 90,
    customVoices: 3,
    childProfiles: 3,
    festivalPacks: true,
    offline: false,
    voiceCloning: true,
  },
  enterprise: {
    label: 'Enterprise',
    price: 'CA$24.99/mo',
    storiesPerWeek: Infinity,
    maxDuration: 30,
    languageCount: Infinity,
    archiveDays: Infinity,
    customVoices: Infinity,
    childProfiles: 10,
    festivalPacks: true,
    offline: true,
    voiceCloning: true,
  },
  // Legacy tiers — map to new ones
  family: { label: 'Pro', price: 'CA$9.99/mo', storiesPerWeek: Infinity, maxDuration: 30, languageCount: Infinity, archiveDays: 90, customVoices: 3, childProfiles: 3, festivalPacks: true, offline: false, voiceCloning: true },
  annual: { label: 'Enterprise', price: 'CA$24.99/mo', storiesPerWeek: Infinity, maxDuration: 30, languageCount: Infinity, archiveDays: Infinity, customVoices: Infinity, childProfiles: 10, festivalPacks: true, offline: true, voiceCloning: true },
};

const USAGE_KEY = 'qissaa:usage';

function loadUsage() {
  try {
    return JSON.parse(localStorage.getItem(USAGE_KEY) || '{"timestamps":[],"totalStories":0,"totalMinutes":0}');
  } catch {
    return { timestamps: [], totalStories: 0, totalMinutes: 0 };
  }
}

function saveUsage(u) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(u));
}

export function recordStoryGenerated(durationMinutes = 0) {
  const u = loadUsage();
  u.timestamps.push(Date.now());
  u.totalStories = (u.totalStories || 0) + 1;
  u.totalMinutes = (u.totalMinutes || 0) + durationMinutes;
  saveUsage(u);
  return u;
}

export function getUsageStats() {
  return loadUsage();
}

export function storiesThisWeek() {
  const u = loadUsage();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return u.timestamps.filter((t) => t >= cutoff).length;
}

export function canGenerate(tierKey) {
  const tier = TIERS[tierKey] || TIERS.free;
  return storiesThisWeek() < tier.storiesPerWeek;
}

export function maxDurationFor(tierKey) {
  return (TIERS[tierKey] || TIERS.free).maxDuration;
}

export function archiveDaysFor(tierKey) {
  return (TIERS[tierKey] || TIERS.free).archiveDays;
}
