// Tier feature gates — pure functions, no UI.
export const TIERS = {
  free: {
    label: 'Free',
    storiesPerWeek: 3,
    maxDuration: 30,
    languageCount: 2,
    archiveDays: 7,
    customVoices: 0,
    childProfiles: 1,
    festivalPacks: false,
    offline: false,
  },
  family: {
    label: 'Family',
    storiesPerWeek: Infinity,
    maxDuration: 60,
    languageCount: Infinity,
    archiveDays: 90,
    customVoices: 2,
    childProfiles: 3,
    festivalPacks: false,
    offline: false,
  },
  annual: {
    label: 'Annual',
    storiesPerWeek: Infinity,
    maxDuration: 60,
    languageCount: Infinity,
    archiveDays: Infinity,
    customVoices: Infinity,
    childProfiles: 5,
    festivalPacks: true,
    offline: true,
  },
};

const USAGE_KEY = 'kahaniyo:usage';

function loadUsage() {
  try {
    return JSON.parse(localStorage.getItem(USAGE_KEY) || '{"timestamps":[]}');
  } catch {
    return { timestamps: [] };
  }
}

function saveUsage(u) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(u));
}

export function recordStoryGenerated() {
  const u = loadUsage();
  u.timestamps.push(Date.now());
  saveUsage(u);
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
