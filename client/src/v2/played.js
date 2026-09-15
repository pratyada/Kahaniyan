// V2 "already played" tracking. Reads the app's existing play map
// (localStorage 'mst:wisdomPlays') AND a V2 set, so cards can show a played
// outline. Ids are normalized (strip the `lesson_` prefix, lowercase).
const V2KEY = 'mst:v2played';

const norm = (id) => String(id || '').replace(/^lesson_/, '').toLowerCase();

export function loadPlayed() {
  const set = new Set();
  try { JSON.parse(localStorage.getItem(V2KEY) || '[]').forEach((x) => set.add(norm(x))); } catch {}
  try {
    const wp = JSON.parse(localStorage.getItem('mst:wisdomPlays') || '{}');
    Object.keys(wp).forEach((k) => { if (k !== '_total' && wp[k] > 0) set.add(norm(k)); });
  } catch {}
  return set;
}

export function markPlayed(id) {
  if (!id) return;
  try {
    const arr = JSON.parse(localStorage.getItem(V2KEY) || '[]');
    const s = new Set(arr.map(norm));
    s.add(norm(id));
    localStorage.setItem(V2KEY, JSON.stringify([...s]));
  } catch {}
}

export function isPlayed(set, id) {
  return !!set && set.has(norm(id));
}

// A story offers multiple languages if its id/flags mark it multilingual/translatable
export function isMultiLang(item) {
  if (!item) return false;
  return /multilingual|fifa26/i.test(item.id || '') || !!item.multilingual || !!item.enableTranslation;
}
