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
    keywords: ['happy', 'fun', 'birthday', 'festival', 'diwali', 'eid', 'christmas', 'holi', 'cake', 'celebration', 'gift', 'party', 'won', 'prize', 'excited'],
    framing: (childName) =>
      `Today had a sparkle in it, didn't it, ${childName}? So tonight's story is a thank-you note, written in the soft language only sleep understands.`,
    closing: (childName) =>
      `${childName}, the days that shine the brightest are the ones we remember to thank. And tonight, you remembered.`,
  },
  {
    key: 'health-sick',
    value: 'patience',
    keywords: ['sick', 'ill', 'fever', 'cold', 'cough', 'hospital', 'doctor', 'medicine', 'hurt', 'pain', 'tummy ache', 'headache', 'not feeling well', 'unwell'],
    framing: (childName) =>
      `Sometimes the body asks for a rest day, and that's okay. Tonight's story is a soft blanket made of words, wrapped around ${childName} until morning comes and the world feels a little easier.`,
    closing: (childName) =>
      `${childName}, sleep is the best medicine the world has ever made. Your body knows how to heal — it just needs you to close your eyes and let it work.`,
  },
  {
    key: 'nature-animals',
    value: 'kindness',
    keywords: ['animal', 'dog', 'cat', 'bird', 'fish', 'butterfly', 'insect', 'garden', 'tree', 'flower', 'rain', 'rainbow', 'mountain', 'river', 'ocean', 'nature', 'park', 'zoo'],
    framing: (childName) =>
      `${childName} noticed something beautiful in the world today — a piece of nature that asked to be seen. So tonight's story is about the quiet kindness between children and the living world around them.`,
    closing: (childName) =>
      `${childName}, the world is full of small, living things that notice you back. Be gentle with them, and they will fill your days with wonder.`,
  },
  {
    key: 'adventure-travel',
    value: 'courage',
    keywords: ['travel', 'trip', 'holiday', 'vacation', 'airplane', 'train', 'car ride', 'new place', 'adventure', 'explore', 'camping', 'beach', 'mountain', 'village'],
    framing: (childName) =>
      `New places can feel exciting and a little strange at the same time, can't they, ${childName}? Tonight's story is about a child who walked into somewhere new and found that the best adventures are the ones where you bring your heart.`,
    closing: (childName) =>
      `${childName}, wherever you go tomorrow, remember — home is not a place. Home is the people who love you, and they travel with you everywhere.`,
  },
  {
    key: 'food-eating',
    value: 'gratitude',
    keywords: ['food', 'eat', 'hungry', 'cooking', 'kitchen', 'lunch', 'dinner', 'breakfast', 'vegetables', 'fruit', 'milk', 'chocolate', 'ice cream', 'picky', 'not eating'],
    framing: (childName) =>
      `Food is love that has been cooked. Every meal that arrives at ${childName}'s table was carried there by many hands — the farmer, the rain, the cook, and the person who set the plate down with a smile.`,
    closing: (childName) =>
      `${childName}, tomorrow when you eat, try to taste the love in it. It's always there, hiding between the bites.`,
  },
  {
    key: 'sleep-bedtime',
    value: 'patience',
    keywords: ['sleep', 'can\'t sleep', 'not sleepy', 'nightmare', 'bad dream', 'wake up', 'bedtime', 'tired', 'restless', 'eyes open'],
    framing: (childName) =>
      `Sleep doesn't always come when we call it. Sometimes it waits around the corner, listening for the exact right moment. So tonight's story is the sound that sleep likes best — a slow, warm voice telling ${childName} that everything is safe.`,
    closing: (childName) =>
      `${childName}, you don't have to try to sleep. Just listen. Sleep will find you. It always does.`,
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
