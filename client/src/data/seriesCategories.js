// Netflix-style category shelves for series + collections.
// Each series/collection can belong to multiple categories.
// Rule: no two categories should have the exact same content.

export const SERIES_CATEGORIES = {
  'fire-truck-academy': ['adventure', 'life-skills'],
  'panchatantra-tales': ['history', 'life-skills'],
  'lightning-wheels': ['adventure', 'sports'],
  'rocket-adventures': ['space'],
  'kindness-squad': ['life-skills'],
  'planet-explorers': ['space'],
  'rainbow-kindergarten-jlps-yr25-26': ['life-skills', 'geography'],
  'dr-spock-parenting': ['life-skills'],
  'little-astronaut': ['space'],
  'who-would-win-series': ['science'],
  'camping-outdoors': ['adventure'],
  'music-lessons': ['music'],
  'water-and-swim': ['sports'],
  'maths-adventures': ['maths'],
  'planets-and-stars': ['science'],
  'geometry-shapes': ['maths'],
  'rocket-adventures-team': ['adventure'],
  'who-would-win-animals': ['science'],
  'discover-india': ['geography'],
  'discover-canada': ['geography'],
  'discover-united-states': ['geography'],
  'discover-united-kingdom': ['geography'],
  'discover-japan': ['geography'],
  'discover-china': ['geography'],
  'discover-australia': ['geography'],
  'discover-brazil': ['geography'],
  'discover-france': ['geography'],
  'discover-egypt': ['geography'],
  'discover-mexico': ['geography'],
  'discover-italy': ['geography'],
  'discover-germany': ['geography'],
  'discover-southkorea': ['geography'],
  'discover-russia': ['geography'],
  'discover-southafrica': ['geography'],
  'discover-turkey': ['geography'],
  'discover-uae': ['geography'],
  'discover-spain': ['geography'],
  'discover-newzealand': ['geography'],
  'tallest-towers': ['geography', 'science'],
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
