import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { db } from '../lib/firebase.js';

const DEFAULT_SUGGESTIONS = [
  { text: 'They are scared of the dark tonight', key: 'scared_dark', bg: 'linear-gradient(135deg, #1a1a3e, #2d2d5e)' },
  { text: 'First day of school tomorrow', key: 'first_school', bg: 'linear-gradient(135deg, #1e3a5f, #2980b9)' },
  { text: 'Had a fight with their best friend', key: 'friend_fight', bg: 'linear-gradient(135deg, #4a1942, #c0392b)' },
  { text: 'Lost their favourite toy', key: 'lost_toy', bg: 'linear-gradient(135deg, #3d2b1f, #8b6914)' },
  { text: 'Wants to be an astronaut', key: 'astronaut', bg: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  { text: 'Festival was today and they are happy', key: 'festival', bg: 'linear-gradient(135deg, #614385, #516395)' },
];

// Fetch idea images from Firestore
let _ideaImagesCache = null;
let _ideaFetchPromise = null;
function useIdeaImages() {
  const [images, setImages] = useState(_ideaImagesCache || {});
  useEffect(() => {
    if (_ideaImagesCache) { setImages(_ideaImagesCache); return; }
    if (!_ideaFetchPromise) {
      _ideaFetchPromise = (async () => {
        try {
          const { db: fireDb } = await import('../lib/firebase.js');
          if (!fireDb) return {};
          const { doc, getDoc } = await import('firebase/firestore');
          const snap = await getDoc(doc(fireDb, 'config', 'ideaImages'));
          _ideaImagesCache = snap.exists() ? snap.data() : {};
          return _ideaImagesCache;
        } catch { return {}; }
      })();
    }
    _ideaFetchPromise.then((imgs) => setImages(imgs));
  }, []);
  return images;
}

function useQuickWhispers() {
  const { profile } = useFamilyProfile();
  const [whispers, setWhispers] = useState(DEFAULT_SUGGESTIONS);

  useEffect(() => {
    if (!db || !profile) return;
    const belief = profile.beliefs?.[0] || 'secular';
    const country = profile.country || 'OTHER';
    (async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'storyLab'));
        if (snap.exists()) {
          const qw = snap.data().quickWhispers || {};
          const exact = qw[`${belief}_${country}`]?.filter(Boolean);
          if (exact?.length) {
            setWhispers(exact.slice(0, 6).map((t, i) => ({
              text: t,
              icon: DEFAULT_SUGGESTIONS[i]?.icon || '✨',
              bg: DEFAULT_SUGGESTIONS[i]?.bg || 'linear-gradient(135deg, #1a1a2e, #16213e)',
            })));
            return;
          }
          const beliefKeys = Object.keys(qw).filter((k) => k.startsWith(belief + '_'));
          for (const k of beliefKeys) {
            const vals = qw[k]?.filter(Boolean);
            if (vals?.length) {
              setWhispers(vals.slice(0, 6).map((t, i) => ({
                text: t,
                icon: DEFAULT_SUGGESTIONS[i]?.icon || '✨',
                bg: DEFAULT_SUGGESTIONS[i]?.bg || 'linear-gradient(135deg, #1a1a2e, #16213e)',
              })));
              return;
            }
          }
        }
      } catch {}
    })();
  }, [profile?.beliefs, profile?.country]);

  return whispers;
}

const RECENT_KEY = 'mst:recentWhispers';
function getRecentWhispers() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 3); } catch { return []; }
}
function saveRecentWhisper(whisper) {
  if (!whisper?.trim()) return;
  try {
    const list = getRecentWhispers().filter((w) => w !== whisper);
    list.unshift(whisper);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 3)));
  } catch {}
}
function removeRecentWhisper(whisper) {
  try {
    const list = getRecentWhispers().filter((w) => w !== whisper);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

export { saveRecentWhisper };

export default function WhisperBox({ value, onChange, overrideValue, onToggleOverride }) {
  const SUGGESTIONS = useQuickWhispers();
  const ideaImages = useIdeaImages();
  const [recents, setRecents] = useState(getRecentWhispers);
  const charCount = value.length;
  const max = 1000;

  return (
    <section className="mb-8">
      {/* Always-open textarea */}
      <textarea
        data-whisper-textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        onFocus={(e) => { setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }}
        placeholder="Tell us what happened today — a worry, a win, a feeling — and we'll weave tonight's story around it."
        rows={3}
        className="w-full min-h-[80px] resize-none rounded-2xl px-4 py-3 font-story leading-relaxed text-bg-base placeholder:text-bg-base/40 outline-none ring-1 ring-gold/30"
        style={{ background: '#fef9e7', fontSize: '16px' }}
      />
      <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-dim">
        <span>Stays on this device</span>
        <span>{charCount}/{max}</span>
      </div>

      {/* Recent whispers */}
      {!value.trim() && recents.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            Recent
          </div>
          <div className="space-y-1.5">
            {recents.map((w) => (
              <div key={w} className="flex items-center gap-2 rounded-xl bg-bg-base px-3 py-2 ring-1 ring-white/5">
                <button type="button" onClick={() => onChange(w)}
                  className="flex-1 text-left text-[12px] text-ink-muted truncate">{w}</button>
                <button type="button" onClick={() => { onChange(w); }}
                  className="shrink-0 text-[11px] text-gold" title="Edit">✏️</button>
                <button type="button" onClick={() => { removeRecentWhisper(w); setRecents(getRecentWhispers()); }}
                  className="shrink-0 text-[11px] text-ink-dim" title="Remove">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick ideas — visual cards */}
      {!value.trim() && (
        <div className="mt-4">
          <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            Quick ideas
          </div>
          <div className="relative -mx-5">
            <div className="overflow-x-auto px-5 pb-1 scrollbar-hide">
              <div className="flex w-max gap-3 pr-8">
                {SUGGESTIONS.map((s) => {
                  const text = typeof s === 'string' ? s : s.text;
                  const key = typeof s === 'string' ? '' : s.key;
                  const bg = typeof s === 'string' ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : s.bg;
                  const imgSrc = ideaImages[key];
                  return (
                    <button key={text} type="button" onClick={() => onChange(text)}
                      className="group relative flex w-36 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-3 text-left transition active:scale-95"
                      style={{ minHeight: '8rem' }}
                    >
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0" style={{ background: bg }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <p className="relative text-[11px] font-bold leading-snug text-white line-clamp-3" style={{ fontFamily: 'Nunito, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                        {text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-base to-transparent" />
          </div>
        </div>
      )}

      {value && (
        <button type="button" onClick={() => onChange('')}
          className="mt-2 text-[11px] uppercase tracking-wider text-ink-dim">
          Clear
        </button>
      )}
    </section>
  );
}
