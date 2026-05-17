// Social proof — play counts + ratings for story cards.
// Seeded deterministically so every card always shows the same numbers.
// Real plays from localStorage add on top.

function hashSeed(id) {
  return Math.abs((id || '').split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0));
}

// Stories that would naturally be more popular get higher seed counts.
// Weighted by theme appeal: animals/superheroes > wisdom/forgiveness
const THEME_WEIGHT = {
  'compassion-animals': 1.8, courage: 1.5, sharing: 1.2, honesty: 1.0,
  wisdom: 0.9, humility: 0.7, forgiveness: 0.6,
};
const COLLECTION_WEIGHT = {
  'pets-animals': 2.0, superheroes: 1.8, 'who-would-win': 1.6,
  vehicles: 1.4, sports: 1.3, planets: 1.2, family: 1.1, countries: 0.9,
};

export function getPlayCount(storyId) {
  const seed = hashSeed(storyId);
  // Base range 100-10K
  const raw = 100 + (seed % 9900);
  // Apply theme/collection weight for realistic distribution
  const theme = storyId?.startsWith('col_') ? null : guessTheme(storyId);
  const collection = storyId?.startsWith('col_') ? guessCollection(storyId) : null;
  const weight = theme ? (THEME_WEIGHT[theme] || 1.0) : (collection ? (COLLECTION_WEIGHT[collection] || 1.0) : 1.0);
  const base = Math.round(raw * weight);
  try {
    const plays = JSON.parse(localStorage.getItem('mst:wisdomPlays') || '{}');
    const lessonId = storyId?.startsWith('lesson_') ? storyId.slice(7) : storyId;
    return base + (plays[lessonId] || plays[storyId] || 0);
  } catch { return base; }
}

function guessTheme(id) {
  // Known mappings from story IDs
  if (!id) return null;
  if (id.includes('squirrel') || id.includes('camel') || id.includes('birds') || id.includes('swan') || id.includes('ant') || id.includes('elephant') || id.includes('dog') || id.includes('cow')) return 'compassion-animals';
  if (id.includes('mountain') || id.includes('dark') || id.includes('bravery') || id.includes('first_step')) return 'courage';
  if (id.includes('blanket') || id.includes('grain') || id.includes('poha') || id.includes('langar') || id.includes('berries')) return 'sharing';
  if (id.includes('truth') || id.includes('promise') || id.includes('half_truth') || id.includes('pitcher')) return 'honesty';
  if (id.includes('wolves') || id.includes('patience') || id.includes('birbal') || id.includes('wisdom')) return 'wisdom';
  if (id.includes('humility') || id.includes('bow')) return 'humility';
  if (id.includes('forgive') || id.includes('kite') || id.includes('chance')) return 'forgiveness';
  return null;
}

function guessCollection(id) {
  if (!id) return null;
  if (id.includes('dog') || id.includes('kitten') || id.includes('rabbit') || id.includes('parrot') || id.includes('elephant') || id.includes('turtle')) return 'pets-animals';
  if (id.includes('fire_truck') || id.includes('bicycle') || id.includes('train') || id.includes('ambulance') || id.includes('rocket') || id.includes('school_bus')) return 'vehicles';
  if (id.includes('invisible') || id.includes('cape') || id.includes('shield') || id.includes('patience_power') || id.includes('empathy') || id.includes('forgiveness_hero')) return 'superheroes';
  if (id.includes('lion') || id.includes('ant_vs') || id.includes('tortoise') || id.includes('sun_vs') || id.includes('brain') || id.includes('ocean_vs')) return 'who-would-win';
  if (id.includes('cricket') || id.includes('swimmer') || id.includes('soccer') || id.includes('fair_play') || id.includes('basketball') || id.includes('marathon')) return 'sports';
  if (id.includes('grandpa') || id.includes('sibling') || id.includes('moms') || id.includes('dads') || id.includes('grandma') || id.includes('family_meal')) return 'family';
  if (id.includes('moon') || id.includes('mars') || id.includes('saturn') || id.includes('pluto') || id.includes('earth') || id.includes('shooting')) return 'planets';
  if (id.includes('japan') || id.includes('canada') || id.includes('india_river') || id.includes('egypt') || id.includes('brazil') || id.includes('toronto')) return 'countries';
  return null;
}

export function getRating(storyId) {
  const seed = hashSeed(storyId);
  return (43 + (seed % 7)) / 10; // 4.3 to 4.9
}

export function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// Top creator — founder attribution
export const FOUNDER = {
  uid: 'prateekyadav2010',
  email: 'prateekyadav2010@gmail.com',
  name: 'Prateek Yadav',
};
