// Netflix-style category shelves for series + collections.
// Each series/collection can belong to multiple categories.

export const SERIES_CATEGORIES = {
  // Series → categories
  'fire-truck-academy': ['adventure', 'life-skills'],
  'panchatantra-tales': ['history', 'life-skills'],
  'lightning-wheels': ['adventure', 'sports'],
  'rocket-adventures': ['sci-fi', 'universe'],
  'kindness-squad': ['adventure', 'life-skills'],
  'planet-explorers': ['sci-fi', 'universe', 'science'],
  'rainbow-kindergarten-jlps-yr25-26': ['life-skills', 'geography'],
  'dr-spock-parenting': ['science', 'life-skills'],
  'little-astronaut': ['sci-fi', 'universe', 'adventure'],
  'who-would-win-series': ['adventure', 'science'],
  'camping-outdoors': ['adventure', 'geography', 'life-skills'],
  'music-lessons': ['music', 'life-skills'],
  'water-and-swim': ['sports', 'adventure', 'life-skills'],
  'maths-adventures': ['maths', 'life-skills'],
  'planets-and-stars': ['universe', 'sci-fi', 'science'],
  'geometry-shapes': ['maths', 'life-skills'],
  'rocket-adventures-team': ['sci-fi', 'adventure', 'science'],
};

// Collections → categories
export const COLLECTION_CATEGORIES = {
  'pets-animals': ['life-skills', 'science'],
  'vehicles': ['adventure', 'science'],
  'superheroes': ['adventure', 'life-skills'],
  'who-would-win': ['adventure', 'science'],
  'sports': ['sports'],
  'family': ['life-skills'],
  'planets': ['universe', 'sci-fi', 'science'],
  'countries': ['geography', 'history'],
};

export const CATEGORIES = [
  { key: 'adventure', label: '🏔️ Adventure', gradient: 'from-orange-900/30 to-red-900/20' },
  { key: 'sci-fi', label: '🚀 Sci-Fi & Space', gradient: 'from-indigo-900/30 to-purple-900/20' },
  { key: 'universe', label: '🪐 Universe & Cosmos', gradient: 'from-violet-900/30 to-blue-900/20' },
  { key: 'maths', label: '🔢 Maths & Geometry', gradient: 'from-emerald-900/30 to-teal-900/20' },
  { key: 'science', label: '🔬 Science & Nature', gradient: 'from-cyan-900/30 to-blue-900/20' },
  { key: 'history', label: '📜 History & Folklore', gradient: 'from-amber-900/30 to-yellow-900/20' },
  { key: 'geography', label: '🌍 Geography & Places', gradient: 'from-green-900/30 to-emerald-900/20' },
  { key: 'sports', label: '⚽ Sports & Fitness', gradient: 'from-red-900/30 to-orange-900/20' },
  { key: 'music', label: '🎵 Music & Arts', gradient: 'from-pink-900/30 to-purple-900/20' },
  { key: 'life-skills', label: '💛 Life Skills & Values', gradient: 'from-yellow-900/30 to-amber-900/20' },
];

// Get all series IDs in a category
export function getSeriesInCategory(categoryKey) {
  return Object.entries(SERIES_CATEGORIES)
    .filter(([, cats]) => cats.includes(categoryKey))
    .map(([id]) => id);
}

// Get all collection IDs in a category
export function getCollectionsInCategory(categoryKey) {
  return Object.entries(COLLECTION_CATEGORIES)
    .filter(([, cats]) => cats.includes(categoryKey))
    .map(([id]) => id);
}
