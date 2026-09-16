// V2 active-voice selection (which cloned voice, if any, playback uses).
// Stored in localStorage; null/absent = the default narrator.
const KEY = 'mst:activeVoice';

export function getActiveVoice() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function setActiveVoice(v) {
  try {
    if (v && v.id) localStorage.setItem(KEY, JSON.stringify({ id: v.id, name: v.name }));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event('mst:voice-changed'));
  } catch {}
}
