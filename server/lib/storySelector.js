// ─────────────────────────────────────────────────────────────
// Story selector — the in-house stand-in for Claude generation.
//
// Given a request (value, age, language, family members, recent
// plot types) it picks a story from the bank that:
//   1. Matches the requested value when possible.
//   2. Is not in the recent plot type list (non-repetition).
//   3. Falls back gracefully if filters return zero matches.
//
// It then swaps the {tokens} with the family profile values
// and stretches/trims the body to fit the requested duration.
// ─────────────────────────────────────────────────────────────
import { STORY_BANK, STORIES_BY_VALUE } from '../data/storyBank.js';

const WORDS_PER_MINUTE = 150;

function pickWeighted(stories, recentPlotTypes = []) {
  const fresh = stories.filter((s) => !recentPlotTypes.includes(s.plotType));
  const pool = fresh.length > 0 ? fresh : stories;
  return pool[Math.floor(Math.random() * pool.length)];
}

function ageBandFor(age) {
  if (age <= 4) return '2-4';
  if (age <= 7) return '5-7';
  if (age <= 10) return '8-10';
  return '11-13';
}

function fillTokens(text, family, childName) {
  const tokens = {
    childName: childName || 'little one',
    sibling: family?.sibling || 'their friend',
    grandfather: family?.grandfather || 'Dada ji',
    grandmother: family?.grandmother || 'Nani ma',
    pet: family?.pet || 'their puppy',
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => tokens[k] ?? `{${k}}`);
}

function fitToDuration(text, durationMinutes) {
  const targetWords = durationMinutes * WORDS_PER_MINUTE;
  const words = text.split(/\s+/);
  if (words.length >= targetWords) {
    return words.slice(0, targetWords).join(' ');
  }
  // Stretch by repeating a calming wind-down paragraph until we hit target.
  const windDown = `\n\nThe night grew softer. The stars hummed their quiet song. ${
    'The wind rustled the leaves like an old lullaby. '
  }Sleep came slowly, like a warm wave. Eyes grew heavy. Hearts grew still. And the world was peaceful, very peaceful, all the way until morning.`;
  let out = text;
  while (out.split(/\s+/).length < targetWords) {
    out += windDown;
  }
  return out.split(/\s+/).slice(0, targetWords).join(' ');
}

export function selectStory({
  childName,
  age = 6,
  value = 'kindness',
  duration = 15,
  language = 'English',
  voice = 'AI Narrator',
  familyMembers = {},
  recentPlotTypes = [],
}) {
  const ageBand = ageBandFor(age);

  // 1. Try value + age band match
  const candidates = STORIES_BY_VALUE[value] || STORY_BANK;
  const ageMatched = candidates.filter((s) => s.ageBand === ageBand);
  const pool = ageMatched.length > 0 ? ageMatched : candidates;

  const template = pickWeighted(pool, recentPlotTypes);

  const filledTitle = fillTokens(template.title, familyMembers, childName);
  const filledBody = fillTokens(template.body, familyMembers, childName);
  const fitted = fitToDuration(filledBody, duration);

  return {
    id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    templateId: template.id,
    title: filledTitle,
    text: fitted,
    wordCount: fitted.split(/\s+/).length,
    estimatedMinutes: duration,
    value: template.value,
    plotType: template.plotType,
    language,
    voice,
    createdAt: new Date().toISOString(),
  };
}
