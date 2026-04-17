// Non-repetition engine: tracks the last 10 plot types per child
// so the selector can avoid serving the same shape twice in a row.
const KEY = (childName) => `mst:plotHistory:${childName || 'default'}`;
const MAX = 10;

export function getRecentPlotTypes(childName) {
  try {
    const raw = localStorage.getItem(KEY(childName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushPlotType(childName, plotType) {
  if (!plotType) return;
  const list = getRecentPlotTypes(childName);
  const next = [plotType, ...list.filter((p) => p !== plotType)].slice(0, MAX);
  localStorage.setItem(KEY(childName), JSON.stringify(next));
}

const LIB_KEY = 'mst:library';

export function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveToLibrary(story) {
  const list = getLibrary();
  const next = [story, ...list].slice(0, 200);
  localStorage.setItem(LIB_KEY, JSON.stringify(next));
}

export function removeFromLibrary(storyId) {
  const next = getLibrary().filter((s) => s.id !== storyId);
  localStorage.setItem(LIB_KEY, JSON.stringify(next));
}

export function pruneArchive(maxDays) {
  if (!maxDays || maxDays === Infinity) return;
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
  const next = getLibrary().filter(
    (s) => new Date(s.createdAt).getTime() >= cutoff
  );
  localStorage.setItem(LIB_KEY, JSON.stringify(next));
}
