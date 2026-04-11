// ─────────────────────────────────────────────────────────────
// Whisper Weaver — turns "what your child is thinking" into a
// gentle story thread that feels intentional, not pasted-on.
//
// Without a real LLM, we do three things deterministically:
//   1. Sentiment + theme detection from simple keyword sets.
//   2. Map theme → best-fit core value (overrides parent choice
//      ONLY if parent didn't explicitly pick — Home passes a flag).
//   3. Generate a warm "opening whisper" paragraph that names the
//      child's feeling and gently reframes it through cultural
//      and home values, then weaves it in front of the chosen
//      story body. Closing wind-down also acknowledges it.
// ─────────────────────────────────────────────────────────────

const THEMES = [
  {
    key: 'fear-dark',
    value: 'courage',
    keywords: ['dark', 'scared', 'afraid', 'monster', 'shadow', 'night', 'noise', 'alone in room'],
    framing: (childName) =>
      `Tonight, ${childName}'s heart had a small worry curled up inside it — a soft, dark feeling about the shadows the night sometimes makes. So this story is a quiet little lantern, just for them.`,
    closing: (childName) =>
      `And ${childName}, remember — the dark is only the day resting. The light always comes back, and so does morning, and so do the people who love you.`,
  },
  {
    key: 'fear-school',
    value: 'bravery',
    keywords: ['school', 'teacher', 'first day', 'class', 'exam', 'test', 'presentation', 'shy in class'],
    framing: (childName) =>
      `Today felt big, didn't it, ${childName}? Bigger than usual. So this story is for the brave little drum that lives inside every child who walks into a new place with shaky hands.`,
    closing: (childName) =>
      `${childName}, tomorrow is just another sunrise. Your family will be right there, behind you and in front of you, all at the same time.`,
  },
  {
    key: 'friend-trouble',
    value: 'kindness',
    keywords: ['friend', 'fight', 'bully', 'mean', 'left out', 'lonely', 'no one to play', 'angry at'],
    framing: (childName) =>
      `Friendships can wobble sometimes, like a kite in a strong wind. Tonight's story is about how kindness — the kind grown in our family — can steady almost anything.`,
    closing: (childName) =>
      `${childName}, the kindest hearts are the ones that keep their door open even after a hard day. Yours is one of them.`,
  },
  {
    key: 'loss-pet-toy',
    value: 'patience',
    keywords: ['lost', 'broke', 'broken', 'missing', 'gone', 'died', 'puppy gone', 'toy'],
    framing: (childName) =>
      `When something we love goes quiet, the heart sits with it for a while. So tonight's story is a slow, soft one — a story for the things we hold close.`,
    closing: (childName) =>
      `${childName}, missing something is a kind of love that has nowhere to land yet. Let it rest. Tomorrow will give it new places to go.`,
  },
  {
    key: 'big-feelings',
    value: 'patience',
    keywords: ['angry', 'upset', 'crying', 'tantrum', 'frustrated', 'mad', 'sad'],
    framing: (childName) =>
      `Big feelings are not bad feelings, ${childName}. They are just rivers that have not yet found the right path. Tonight's story walks beside them.`,
    closing: (childName) =>
      `${childName}, every river finds the sea eventually. So will every feeling. You don't have to push it — only walk with it.`,
  },
  {
    key: 'sibling',
    value: 'sharing',
    keywords: ['sister', 'brother', 'sibling', 'jealous', 'baby', 'unfair'],
    framing: (childName) =>
      `When a family has more than one heart, sometimes those hearts bump into each other. That's not bad — it just means love is busy that day. Tonight's story is for that busy love.`,
    closing: (childName) =>
      `${childName}, you don't have to share your feelings to share your love. Both fit, and both are yours.`,
  },
  {
    key: 'wish-curiosity',
    value: 'courage',
    keywords: ['wants to be', 'wants to', 'wish', 'astronaut', 'doctor', 'pilot', 'engineer', 'dancer', 'singer', 'why', 'how does'],
    framing: (childName) =>
      `${childName}'s mind is full of questions tonight — the kind that grow into futures. So this story is a little doorway, opened just a crack, to show what happens when a question is brave enough to walk through.`,
    closing: (childName) =>
      `${childName}, every dreamer in our family started exactly where you are tonight — with one good question, and a heart willing to listen for the answer.`,
  },
  {
    key: 'gratitude-celebration',
    value: 'gratitude',
    keywords: ['happy', 'fun', 'birthday', 'festival', 'diwali', 'eid', 'christmas', 'holi', 'cake', 'celebration', 'gift'],
    framing: (childName) =>
      `Today had a sparkle in it, didn't it, ${childName}? So tonight's story is a thank-you note, written in the soft language only sleep understands.`,
    closing: (childName) =>
      `${childName}, the days that shine the brightest are the ones we remember to thank. And tonight, you remembered.`,
  },
];

const DEFAULT_THEME = {
  key: 'general',
  value: null, // don't override parent's choice
  framing: (childName) =>
    `Tonight, here is a quiet little story made just for you, ${childName} — woven slowly, the way a grandmother folds a soft shawl.`,
  closing: (childName) =>
    `${childName}, sleep gently. The world is waiting, but it can wait until morning.`,
};

export function detectTheme(whisper = '') {
  const text = whisper.toLowerCase().trim();
  if (!text) return DEFAULT_THEME;
  let best = null;
  let bestScore = 0;
  for (const t of THEMES) {
    const score = t.keywords.reduce((s, k) => (text.includes(k) ? s + 1 : s), 0);
    if (score > bestScore) {
      best = t;
      bestScore = score;
    }
  }
  return best || DEFAULT_THEME;
}

export function weaveWhisper({ storyText, whisper, childName, theme }) {
  if (!whisper || !whisper.trim()) return storyText;
  const opening = theme.framing(childName);
  const closing = theme.closing(childName);
  return `${opening}\n\n${storyText}\n\n${closing}`;
}
