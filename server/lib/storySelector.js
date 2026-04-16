// ─────────────────────────────────────────────────────────────
// Story selector — tries Claude first, falls back to templates.
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
import { detectTheme, weaveWhisper } from './whisperWeaver.js';
import { buildCastStory } from './castStoryBuilder.js';
import { generateWithClaude } from './claudeStoryGenerator.js';

const WORDS_PER_MINUTE = 150;

function pickWeighted(stories, recentPlotTypes = [], preferredSlots = []) {
  const fresh = stories.filter((s) => !recentPlotTypes.includes(s.plotType));
  const pool = fresh.length > 0 ? fresh : stories;

  // Bias toward stories that actually USE the slots the user filled
  // by counting how many of those tokens appear in the story body.
  if (preferredSlots.length > 0) {
    const scored = pool.map((s) => {
      let score = 0;
      for (const slot of preferredSlots) {
        const token = `{${slot}}`;
        const count = (s.body.match(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g')) || []).length;
        score += count;
      }
      return { s, score };
    });
    const maxScore = Math.max(...scored.map((x) => x.score));
    if (maxScore > 0) {
      const top = scored.filter((x) => x.score === maxScore);
      return top[Math.floor(Math.random() * top.length)].s;
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function ageBandFor(age) {
  if (age <= 4) return '2-4';
  if (age <= 7) return '5-7';
  if (age <= 10) return '8-10';
  return '11-13';
}

function fillTokens(text, family, childName, gender) {
  const tokens = {
    childName: childName || 'little one',
    sibling: family?.sibling || 'their friend',
    grandfather: family?.grandfather || 'Dada ji',
    grandmother: family?.grandmother || 'Nani ma',
    pet: family?.pet || 'their puppy',
  };
  let filled = text.replace(/\{(\w+)\}/g, (_, k) => tokens[k] ?? `{${k}}`);

  // Fix pronouns based on gender
  if (gender === 'boy') {
    filled = filled.replace(/\btheir\b(?= friend| puppy| eyes| face| heart| hands| chest| back| head| tummy| mouth| voice| pocket| bed| name| room| house| window| school| class| seat)/gi, 'his');
    filled = filled.replace(/\bthey\b(?= loved| walked| ran| sat| stood| looked| thought| said| felt| held| took| went| came| opened| closed| put| pulled| understood| began| knew| asked| watched| tried| heard| smiled| laughed| cried| climbed| whispered| slept| woke| remembered| noticed| decided| promised| learned)/gi, 'he');
    filled = filled.replace(/\bthem\b(?= tight| close| gently| softly| in| up| down| back| away| together)/gi, 'him');
    filled = filled.replace(/\bthemselves\b/gi, 'himself');
    filled = filled.replace(/\btheirs\b/gi, 'his');
  } else if (gender === 'girl') {
    filled = filled.replace(/\btheir\b(?= friend| puppy| eyes| face| heart| hands| chest| back| head| tummy| mouth| voice| pocket| bed| name| room| house| window| school| class| seat)/gi, 'her');
    filled = filled.replace(/\bthey\b(?= loved| walked| ran| sat| stood| looked| thought| said| felt| held| took| went| came| opened| closed| put| pulled| understood| began| knew| asked| watched| tried| heard| smiled| laughed| cried| climbed| whispered| slept| woke| remembered| noticed| decided| promised| learned)/gi, 'she');
    filled = filled.replace(/\bthem\b(?= tight| close| gently| softly| in| up| down| back| away| together)/gi, 'her');
    filled = filled.replace(/\bthemselves\b/gi, 'herself');
    filled = filled.replace(/\btheirs\b/gi, 'hers');
  }

  return filled;
}

function fitToDuration(text, durationMinutes) {
  const targetWords = durationMinutes * WORDS_PER_MINUTE;
  const words = text.split(/\s+/);

  const GENTLE_ENDING = '\n\nAnd as the night grew softer, sleep came gently, like a warm wave. Eyes grew heavy. The world was peaceful. Very, very peaceful. Goodnight.';

  if (words.length >= targetWords) {
    // Don't cut mid-sentence — find the nearest sentence end before the target
    const rough = words.slice(0, targetWords).join(' ');
    // Find the last sentence-ending punctuation within the target
    const lastPeriod = Math.max(
      rough.lastIndexOf('. '),
      rough.lastIndexOf('.\n'),
      rough.lastIndexOf('." '),
      rough.lastIndexOf('? '),
      rough.lastIndexOf('! ')
    );
    if (lastPeriod > rough.length * 0.6) {
      // Cut at the last complete sentence + add gentle ending
      return rough.slice(0, lastPeriod + 1) + GENTLE_ENDING;
    }
    // Fallback: use full rough cut + ending
    return rough + '.' + GENTLE_ENDING;
  }

  // Story is shorter than target — add a wind-down
  if (words.length >= targetWords * 0.7) {
    // Close enough — just add the gentle ending
    return text + GENTLE_ENDING;
  }

  // Need to stretch — add calming paragraphs
  const windDown = '\n\nThe stars hummed their quiet song. The wind rustled the leaves like an old lullaby. Sleep came slowly, like a warm wave. Eyes grew heavy. Hearts grew still.';
  let out = text;
  while (out.split(/\s+/).length < targetWords * 0.85) {
    out += windDown;
  }
  return out + GENTLE_ENDING;
}

export async function selectStory({
  childName,
  age = 6,
  value = 'kindness',
  duration = 15,
  language = 'English',
  voice = 'AI Narrator',
  familyMembers = {},
  recentPlotTypes = [],
  preferredSlots = [],
  castNames = [],
  selectedCast = [],
  gender: req_gender = '',
  whisper = '',
  whisperOverridesValue = false,
  beliefs = [],
  country = '',
}) {
  // ─── TRY CLAUDE FIRST ───
  try {
    const claudeStory = await generateWithClaude({
      childName,
      age,
      gender: req_gender,
      value,
      duration,
      language,
      familyMembers,
      selectedCast,
      whisper,
      beliefs,
      country,
    });
    if (claudeStory) {
      return {
        id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        templateId: 'claude-generated',
        title: claudeStory.title,
        text: claudeStory.text,
        wordCount: claudeStory.wordCount,
        estimatedMinutes: duration,
        value,
        plotType: 'claude-' + value,
        language,
        voice,
        cast: (selectedCast || []).filter((c) => c.relation !== 'self').map((c) => c.name),
        whisper: whisper?.trim() || null,
        generatedBy: 'claude',
        createdAt: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Claude generation failed, falling back to templates:', e.message);
  }

  // ─── FALLBACK TO TEMPLATES ───
  const ageBand = ageBandFor(age);

  // ─── CAST MODE ───
  // If the request includes a real selected cast, build a fresh
  // story scaffolded around those characters instead of picking
  // a fixed template. Every cast member gets a real beat.
  if (selectedCast && selectedCast.length > 0) {
    const built = buildCastStory({
      childName: childName || 'little one',
      gender,
      cast: selectedCast,
      value,
      recentPlotTypes,
    });
    if (built) {
      const fitted = fitToDuration(built.body, duration);
      return {
        id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        templateId: built.templateId,
        title: built.title,
        text: fitted,
        wordCount: fitted.split(/\s+/).length,
        estimatedMinutes: duration,
        value,
        plotType: built.plotType,
        language,
        voice,
        cast: (castNames && castNames.length > 0) ? castNames : selectedCast.filter((c) => c.relation !== 'self').map((c) => c.name),
        whisper: null,
        whisperTheme: null,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // 0. Detect a theme from the whisper, if any.
  const theme = detectTheme(whisper);

  // If parent didn't lock the value (whisperOverridesValue), and the
  // whisper detected a strong theme, gently steer the value selection.
  const effectiveValue =
    whisperOverridesValue && theme.value ? theme.value : value;

  // 1. Try value + age band match
  const candidates = STORIES_BY_VALUE[effectiveValue] || STORY_BANK;
  const ageMatched = candidates.filter((s) => s.ageBand === ageBand);
  const pool = ageMatched.length > 0 ? ageMatched : candidates;

  const template = pickWeighted(pool, recentPlotTypes, preferredSlots);

  const gender = req_gender || '';
  const filledTitle = fillTokens(template.title, familyMembers, childName, gender);
  const filledBody = fillTokens(template.body, familyMembers, childName, gender);

  // 2. Weave the whisper into the body (opening + closing frame)
  const woven = weaveWhisper({
    storyText: filledBody,
    whisper,
    childName: childName || 'little one',
    theme,
  });

  const fitted = fitToDuration(woven, duration);

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
    whisper: whisper?.trim() || null,
    whisperTheme: whisper?.trim() ? theme.key : null,
    cast: castNames || [],
    createdAt: new Date().toISOString(),
  };
}
