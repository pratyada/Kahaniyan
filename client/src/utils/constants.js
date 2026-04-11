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
