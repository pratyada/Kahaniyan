export const VALUES = [
  { key: 'kindness', label: 'Kindness', emoji: '🤲', color: '#f0a500' },
  { key: 'courage', label: 'Courage', emoji: '🦁', color: '#ff7a59' },
  { key: 'honesty', label: 'Honesty', emoji: '🌿', color: '#7ad9a1' },
  { key: 'patience', label: 'Patience', emoji: '🌱', color: '#9cb3ff' },
  { key: 'gratitude', label: 'Gratitude', emoji: '🙏', color: '#e8b4ff' },
  { key: 'sharing', label: 'Sharing', emoji: '🍪', color: '#ffd166' },
  { key: 'respect', label: 'Respect', emoji: '🌳', color: '#9ad7c4' },
  { key: 'bravery', label: 'Bravery', emoji: '⭐', color: '#ffb733' },
];

export const LANGUAGES = [
  { key: 'English', label: 'English', voice: 'en-US' },
  { key: 'Hindi', label: 'हिन्दी', voice: 'hi-IN' },
  { key: 'Tamil', label: 'தமிழ்', voice: 'ta-IN' },
  { key: 'Spanish', label: 'Español', voice: 'es-ES' },
  { key: 'Arabic', label: 'العربية', voice: 'ar-SA' },
];

export const NARRATORS = [
  { key: 'Mummy', label: 'Mummy', emoji: '👩' },
  { key: 'Daddy', label: 'Daddy', emoji: '👨' },
  { key: 'Dada ji', label: 'Dada ji', emoji: '👴' },
  { key: 'Nani ma', label: 'Nani ma', emoji: '👵' },
  { key: 'AI Narrator', label: 'AI Narrator', emoji: '✨' },
];

export const DURATIONS = [
  { minutes: 2, label: '2 min', sub: 'quick' },
  { minutes: 5, label: '5 min', sub: 'short' },
  { minutes: 10, label: '10 min', sub: 'classic', locked: true },
  { minutes: 15, label: '15 min', sub: 'bedtime', locked: true },
];

export const valueMeta = (key) => VALUES.find((v) => v.key === key) || VALUES[0];

// ─── Cultural & demographic onboarding constants ───
export const COUNTRIES = [
  { key: 'IN', label: 'India', flag: '🇮🇳' },
  { key: 'US', label: 'United States', flag: '🇺🇸' },
  { key: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { key: 'AE', label: 'UAE', flag: '🇦🇪' },
  { key: 'CA', label: 'Canada', flag: '🇨🇦' },
  { key: 'AU', label: 'Australia', flag: '🇦🇺' },
  { key: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { key: 'OTHER', label: 'Somewhere else', flag: '🌍' },
];

export const RELIGIONS = [
  { key: 'hindu', label: 'Hinduism', icon: '🕉️' },
  { key: 'muslim', label: 'Islam', icon: '☪️' },
  { key: 'christian', label: 'Christianity', icon: '✝️' },
  { key: 'sikh', label: 'Sikhism', icon: '☬' },
  { key: 'buddhist', label: 'Buddhism', icon: '☸️' },
  { key: 'jain', label: 'Jainism', icon: '🪷' },
  { key: 'jewish', label: 'Judaism', icon: '✡️' },
  { key: 'secular', label: 'Secular / Spiritual', icon: '🌿' },
  { key: 'all', label: 'Open to all', icon: '🌏' },
];

// Family member relationships used in voice studio
export const FAMILY_RELATIONS = [
  { key: 'mummy', label: 'Mother', emoji: '👩' },
  { key: 'daddy', label: 'Father', emoji: '👨' },
  { key: 'dada', label: 'Paternal grandfather', emoji: '👴' },
  { key: 'dadi', label: 'Paternal grandmother', emoji: '👵' },
  { key: 'nana', label: 'Maternal grandfather', emoji: '👴' },
  { key: 'nani', label: 'Maternal grandmother', emoji: '👵' },
  { key: 'sibling', label: 'Sibling', emoji: '🧒' },
  { key: 'uncle', label: 'Uncle', emoji: '🧔' },
  { key: 'aunt', label: 'Aunt', emoji: '👩' },
  { key: 'cousin', label: 'Cousin', emoji: '🧒' },
  { key: 'friend', label: 'Friend', emoji: '🧒' },
  { key: 'relative', label: 'Relative', emoji: '👤' },
  { key: 'other', label: 'Other', emoji: '✨' },
];

// The training paragraph from product spec — used by voice cloning models.
// Contains the full phonetic + emotional range needed for a good voice clone.
export const VOICE_TRAINING_PARAGRAPH = `From the moment I saw you, everything changed. Listen carefully — this is not a drill. I need you to breathe, stay calm, and trust me. Why would anyone leave behind something so beautiful? Don't you dare give up now. Whisper it softly... tell me the story of how we got here. One day, all of this will make perfect sense.`;

// ─── Character system ───
// "Characters" are the cast available to appear in tonight's story.
// Bucket maps a free-form relation to which template slot it fills.
export const CHARACTER_BUCKETS = {
  self: 'self',
  sibling: 'sibling',
  bhaiya: 'sibling',
  didi: 'sibling',
  cousin: 'sibling',
  friend: 'sibling',
  dada: 'grandfather',
  nana: 'grandfather',
  grandfather: 'grandfather',
  uncle: 'grandfather',
  relative: 'grandfather',
  dadi: 'grandmother',
  nani: 'grandmother',
  grandmother: 'grandmother',
  aunt: 'grandmother',
  mummy: 'grandmother',
  daddy: 'grandfather',
  chacha: 'grandfather',
  chachi: 'grandmother',
  mama: 'grandfather',
  mami: 'grandmother',
  pet: 'pet',
  imaginary: 'sibling',
  other: 'sibling',
};

export const PET_TYPES = [
  { key: 'dog', label: 'Dog', emoji: '🐶', sound: 'bhau bhau', move: 'wagged its tail' },
  { key: 'cat', label: 'Cat', emoji: '🐱', sound: 'meow', move: 'arched its back softly' },
  { key: 'bird', label: 'Bird', emoji: '🐦', sound: 'chirp chirp', move: 'fluttered its wings' },
  { key: 'rabbit', label: 'Rabbit', emoji: '🐰', sound: 'thump thump', move: 'twitched its little nose' },
  { key: 'fish', label: 'Fish', emoji: '🐠', sound: 'blub blub', move: 'swirled in its bowl' },
  { key: 'hamster', label: 'Hamster', emoji: '🐹', sound: 'squeak', move: 'ran in its tiny wheel' },
];

export const SKIN_TONES = [
  { key: 'default', emoji: '🧒' },
  { key: 'light', emoji: '🧒🏻' },
  { key: 'medium-light', emoji: '🧒🏼' },
  { key: 'medium', emoji: '🧒🏽' },
  { key: 'medium-dark', emoji: '🧒🏾' },
  { key: 'dark', emoji: '🧒🏿' },
];

export const RELATION_EMOJI = {
  self: '🌟',
  sibling: '🧒',
  bhaiya: '🧑',
  didi: '👧',
  dada: '👴',
  dadi: '👵',
  nana: '👴',
  nani: '👵',
  mummy: '👩',
  daddy: '👨',
  chacha: '🧔',
  chachi: '👩',
  mama: '🧔',
  mami: '👩',
  pet: '🐶',
  imaginary: '🦄',
  friend: '🧒',
  other: '✨',
};

// Map a character into the template slot it fills.
// Falls back to first empty slot if relation has no canonical bucket.
export function mapCharactersToFamilyMembers(characters) {
  const slots = { sibling: '', grandfather: '', grandmother: '', pet: '' };
  const orderedFallback = ['sibling', 'grandfather', 'grandmother', 'pet'];
  const nonProtagonist = characters.filter((c) => c.relation !== 'self');
  for (const c of nonProtagonist) {
    const bucket = CHARACTER_BUCKETS[c.relation] || 'sibling';
    // Mix name and nickname for variation — use nickname ~40% of the time
    const useName = c.nickname && Math.random() < 0.4 ? c.nickname : c.name;
    if (bucket !== 'self' && !slots[bucket]) {
      slots[bucket] = useName;
    } else {
      const open = orderedFallback.find((s) => !slots[s]);
      if (open) slots[open] = useName;
    }
  }
  return slots;
}

// Build the default character list from a legacy onboarding profile.
// Used to auto-migrate users who completed onboarding before the
// Characters feature existed.
export function defaultCharactersFromProfile(profile) {
  const list = [];
  if (profile?.childName) {
    list.push({ id: 'char_self', name: profile.childName, relation: 'self', emoji: '🌟', traits: '' });
  }
  if (profile?.motherName) {
    list.push({ id: 'char_mummy', name: profile.motherName, relation: 'mummy', emoji: RELATION_EMOJI.mummy, traits: '' });
  }
  if (profile?.fatherName) {
    list.push({ id: 'char_daddy', name: profile.fatherName, relation: 'daddy', emoji: RELATION_EMOJI.daddy, traits: '' });
  }
  if (profile?.sibling) {
    list.push({ id: 'char_sibling', name: profile.sibling, relation: 'sibling', emoji: RELATION_EMOJI.sibling, traits: '' });
  }
  if (profile?.grandfather) {
    list.push({ id: 'char_dada', name: profile.grandfather, relation: 'dada', emoji: RELATION_EMOJI.dada, traits: '' });
  }
  if (profile?.grandmother) {
    list.push({ id: 'char_nani', name: profile.grandmother, relation: 'nani', emoji: RELATION_EMOJI.nani, traits: '' });
  }
  if (profile?.pet) {
    list.push({ id: 'char_pet', name: profile.pet, relation: 'pet', emoji: RELATION_EMOJI.pet, traits: '' });
  }
  return list;
}
