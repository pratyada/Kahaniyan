import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { db } from '../lib/firebase.js';

const DEFAULT_SUGGESTIONS = [
  'They are scared of the dark tonight',
  'First day of school tomorrow',
  'Had a fight with their best friend',
  'Lost their favourite toy',
  'Wants to be an astronaut',
  'Festival was today and they are very happy',
];

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
          // Try exact match first, then belief-only, then defaults
          const exact = qw[`${belief}_${country}`]?.filter(Boolean);
          if (exact?.length) { setWhispers(exact.slice(0, 6)); return; }
          // Try any country for this belief
          const beliefKeys = Object.keys(qw).filter((k) => k.startsWith(belief + '_'));
          for (const k of beliefKeys) {
            const vals = qw[k]?.filter(Boolean);
            if (vals?.length) { setWhispers(vals.slice(0, 6)); return; }
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
  const [open, setOpen] = useState(false);
  const SUGGESTIONS = useQuickWhispers();
  const [recents, setRecents] = useState(getRecentWhispers);
  const charCount = value.length;
  const max = 200;

  return (
    <section className="card-elevated mb-8 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="-m-4 flex w-[calc(100%+2rem)] items-center gap-3 p-4 text-left"
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-2xl">
          💭
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            Tonight's Whisper
          </div>
          <div className="mt-1 font-ui text-sm font-bold text-ink">
            What's on your child's heart tonight?
          </div>
          <div className="mt-1 line-clamp-1 text-xs text-ink-muted">
            {value
              ? `"${value}"`
              : 'A worry, a win, a feeling — type it here'}
          </div>
        </div>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg-card text-ink-muted transition ${
            open ? 'rotate-180 text-gold' : ''
          }`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, max))}
                placeholder="e.g. They are scared of the thunder tonight, or they keep asking why the moon follows them home…"
                rows={3}
                className="field min-h-[88px] resize-none font-story text-[15px] leading-relaxed"
              />
              <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-dim">
                <span>Stays on this device. Never sent anywhere.</span>
                <span>
                  {charCount}/{max}
                </span>
              </div>

              {/* Recent whispers */}
              {!value.trim() && recents.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                    Recent whispers
                  </div>
                  <div className="space-y-1.5">
                    {recents.map((w) => (
                      <div key={w} className="flex items-center gap-2 rounded-xl bg-bg-base px-3 py-2 ring-1 ring-white/5">
                        <button
                          type="button"
                          onClick={() => onChange(w)}
                          className="flex-1 text-left text-[12px] text-ink-muted truncate"
                        >
                          {w}
                        </button>
                        <button
                          type="button"
                          onClick={() => { onChange(w); }}
                          className="shrink-0 text-[11px] text-gold"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => { removeRecentWhisper(w); setRecents(getRecentWhispers()); }}
                          className="shrink-0 text-[11px] text-ink-dim"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick suggestions — hidden when user is typing their own */}
              {!value.trim() && <div className="mt-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  Quick whispers
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChange(s)}
                      className="rounded-full bg-bg-base px-3 py-1.5 text-[11px] text-ink-muted ring-1 ring-white/5 transition active:scale-95 hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>}

              {/* Override toggle */}
              <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-base p-3">
                <div className="min-w-0 flex-1">
                  <div className="font-ui text-xs font-bold text-ink">
                    Let the whisper choose the value
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    My Sleepy Tale will pick the best value (courage, kindness, patience…) based on what you wrote.
                  </div>
                </div>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleOverride(!overrideValue);
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                    overrideValue ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-bg-base transition ${
                      overrideValue ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </span>
              </label>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="mt-3 text-[11px] uppercase tracking-wider text-ink-dim"
                >
                  Clear whisper
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
