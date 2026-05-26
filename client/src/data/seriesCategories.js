// Netflix-style category shelves for series + collections.
// Each series/collection can belong to multiple categories.
// Rule: no two categories should have the exact same content.

export const SERIES_CATEGORIES = {
  'fire-truck-academy': ['adventure', 'life-skills'],
  'panchatantra-tales': ['history', 'life-skills'],
  'lightning-wheels': ['adventure', 'sports'],
  'rocket-adventures': ['space'],
  'kindness-squad': ['life-skills'],
  'planet-explorers': ['space', 'science'],
  'rainbow-kindergarten-jlps-yr25-26': ['geography', 'life-skills'],
  'dr-spock-parenting': ['science', 'life-skills'],
  'little-astronaut': ['space', 'adventure'],
  'who-would-win-series': ['adventure', 'science'],
  'camping-outdoors': ['adventure', 'geography'],
  'music-lessons': ['music'],
  'water-and-swim': ['sports', 'adventure'],
  'maths-adventures': ['maths'],
  'planets-and-stars': ['space', 'science'],
  'geometry-shapes': ['maths'],
  'rocket-adventures-team': ['space', 'adventure'],
  'who-would-win-animals': ['science', 'adventure'],
};

export const COLLECTION_CATEGORIES = {
  'pets-animals': ['science', 'life-skills'],
  'vehicles': ['adventure'],
  'superheroes': ['adventure', 'life-skills'],
  'who-would-win': ['science'],
  'sports': ['sports'],
  'family': ['life-skills'],
  'planets': ['space'],
  'countries': ['geography', 'history'],
};

export const CATEGORIES = [
  { key: 'adventure', label: '🏔️ Adventure', gradient: 'from-orange-900/30 to-red-900/20' },
  { key: 'space', label: '🚀 Space & Universe', gradient: 'from-indigo-900/30 to-purple-900/20' },
  { key: 'maths', label: '🔢 Maths & Geometry', gradient: 'from-emerald-900/30 to-teal-900/20' },
  { key: 'science', label: '🔬 Science & Nature', gradient: 'from-cyan-900/30 to-blue-900/20' },
  { key: 'history', label: '📜 History & Folklore', gradient: 'from-amber-900/30 to-yellow-900/20' },
  { key: 'geography', label: '🌍 Geography & Places', gradient: 'from-green-900/30 to-emerald-900/20' },
  { key: 'sports', label: '⚽ Sports & Fitness', gradient: 'from-red-900/30 to-orange-900/20' },
  { key: 'music', label: '🎵 Music & Arts', gradient: 'from-pink-900/30 to-purple-900/20' },
  { key: 'life-skills', label: '💛 Life Skills & Values', gradient: 'from-yellow-900/30 to-amber-900/20' },
];

export function getSeriesInCategory(categoryKey) {
  return Object.entries(SERIES_CATEGORIES)
    .filter(([, cats]) => cats.includes(categoryKey))
    .map(([id]) => id);
}

export function getCollectionsInCategory(categoryKey) {
  return Object.entries(COLLECTION_CATEGORIES)
    .filter(([, cats]) => cats.includes(categoryKey))
    .map(([id]) => id);
}
