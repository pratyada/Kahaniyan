// V2 Kids Build helpers — sparkle daily quota (client display; server enforces cost)
// and one-time parental (COPPA) consent flag.
const SPARKLE_KEY = 'mst:sparkles';
const FREE_PER_DAY = 3;
const CONSENT_KEY = 'mst:coppaConsent';

const today = () => new Date().toISOString().slice(0, 10);

export function sparklesLeft(isPaid) {
  if (isPaid) return Infinity;
  try {
    const d = JSON.parse(localStorage.getItem(SPARKLE_KEY) || '{}');
    if (d.date !== today()) return FREE_PER_DAY;
    return Math.max(0, FREE_PER_DAY - (d.used || 0));
  } catch { return FREE_PER_DAY; }
}
export function useSparkle(isPaid) {
  if (isPaid) return;
  try {
    const d = JSON.parse(localStorage.getItem(SPARKLE_KEY) || '{}');
    const used = d.date === today() ? (d.used || 0) : 0;
    localStorage.setItem(SPARKLE_KEY, JSON.stringify({ date: today(), used: used + 1 }));
  } catch {}
}
export function hasConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === '1'; } catch { return false; }
}
export function grantConsent() {
  try { localStorage.setItem(CONSENT_KEY, '1'); } catch {}
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
