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
    personalizedAudio: false,
    personalizedPerDay: 0,
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
    personalizedAudio: true,
    personalizedPerDay: 3,
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

const USAGE_KEY = 'mst:usage';

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

// Mother's Day promo: free unlimited until May 20, 2026
const PROMO_END = new Date('2026-05-21T00:00:00').getTime();
function isPromoActive() { return Date.now() < PROMO_END; }

export function canGenerate(tierKey, isAdmin = false) {
  if (isAdmin || isPromoActive()) return true;
  const tier = TIERS[tierKey] || TIERS.free;
  return storiesThisWeek() < tier.storiesPerWeek;
}

export function maxDurationFor(tierKey, isAdmin = false) {
  if (isAdmin || isPromoActive()) return 30;
  return (TIERS[tierKey] || TIERS.free).maxDuration;
}

export { isPromoActive };

export function archiveDaysFor(tierKey) {
  return (TIERS[tierKey] || TIERS.free).archiveDays;
}

// Personalized audio tracking
const PERSONALIZE_KEY = 'mst:personalizeUsage';

function loadPersonalizeUsage() {
  try {
    const raw = JSON.parse(localStorage.getItem(PERSONALIZE_KEY) || '{"date":"","count":0}');
    const today = new Date().toISOString().slice(0, 10);
    if (raw.date !== today) return { date: today, count: 0 };
    return raw;
  } catch { return { date: new Date().toISOString().slice(0, 10), count: 0 }; }
}

export function personalizedToday() {
  return loadPersonalizeUsage().count;
}

export function canPersonalize(tierKey) {
  const tier = TIERS[tierKey] || TIERS.free;
  if (!tier.personalizedAudio) return false;
  return loadPersonalizeUsage().count < tier.personalizedPerDay;
}

export function recordPersonalized() {
  const u = loadPersonalizeUsage();
  u.count++;
  localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(u));
  return u;
}

export function personalizeLimit(tierKey) {
  return (TIERS[tierKey] || TIERS.free).personalizedPerDay;
}
