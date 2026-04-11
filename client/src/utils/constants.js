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
  { minutes: 15, label: '15 min', sub: 'short tale' },
  { minutes: 30, label: '30 min', sub: 'classic' },
  { minutes: 45, label: '45 min', sub: 'long journey' },
  { minutes: 60, label: '60 min', sub: 'epic night' },
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
  { key: 'hindu', label: 'Hindu', icon: '🕉️' },
  { key: 'muslim', label: 'Muslim', icon: '☪️' },
  { key: 'christian', label: 'Christian', icon: '✝️' },
  { key: 'sikh', label: 'Sikh', icon: '☬' },
  { key: 'buddhist', label: 'Buddhist', icon: '☸️' },
  { key: 'jain', label: 'Jain', icon: '🪷' },
  { key: 'jewish', label: 'Jewish', icon: '✡️' },
  { key: 'secular', label: 'Secular / Spiritual', icon: '🌿' },
  { key: 'all', label: 'Open to all traditions', icon: '🌏' },
];

// Family member relationships used in voice studio
export const FAMILY_RELATIONS = [
  { key: 'mummy', label: 'Mummy', emoji: '👩' },
  { key: 'daddy', label: 'Daddy', emoji: '👨' },
  { key: 'dada', label: 'Dada ji', emoji: '👴' },
  { key: 'dadi', label: 'Dadi ma', emoji: '👵' },
  { key: 'nana', label: 'Nana ji', emoji: '👴' },
  { key: 'nani', label: 'Nani ma', emoji: '👵' },
  { key: 'bhaiya', label: 'Bhaiya', emoji: '🧑' },
  { key: 'didi', label: 'Didi', emoji: '👧' },
  { key: 'chacha', label: 'Chacha', emoji: '🧔' },
  { key: 'chachi', label: 'Chachi', emoji: '👩' },
  { key: 'mama', label: 'Mama', emoji: '🧔' },
  { key: 'mami', label: 'Mami', emoji: '👩' },
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
  dada: 'grandfather',
  nana: 'grandfather',
  grandfather: 'grandfather',
  dadi: 'grandmother',
  nani: 'grandmother',
  grandmother: 'grandmother',
  mummy: 'grandmother', // adult woman slot fallback
  daddy: 'grandfather', // adult man slot fallback
  chacha: 'grandfather',
  chachi: 'grandmother',
  mama: 'grandfather',
  mami: 'grandmother',
  pet: 'pet',
  imaginary: 'sibling',
  friend: 'sibling',
  other: 'sibling',
};

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
    if (bucket !== 'self' && !slots[bucket]) {
      slots[bucket] = c.name;
    } else {
      // bucket already filled — overflow to next empty slot
      const open = orderedFallback.find((s) => !slots[s]);
      if (open) slots[open] = c.name;
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
