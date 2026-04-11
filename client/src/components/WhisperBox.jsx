import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  'They are scared of the dark tonight',
  'First day of school tomorrow',
  'Had a fight with their best friend',
  'Lost their favourite toy',
  'Wants to be an astronaut',
  'Festival was today and they are very happy',
];

export default function WhisperBox({ value, onChange, overrideValue, onToggleOverride }) {
  const [open, setOpen] = useState(false);
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
              : 'Share a worry, a dream, a feeling — we\'ll weave a story around it.'}
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

              {/* Quick suggestions */}
              <div className="mt-4">
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
              </div>

              {/* Override toggle */}
              <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-base p-3">
                <div className="min-w-0 flex-1">
                  <div className="font-ui text-xs font-bold text-ink">
                    Let the whisper choose the value
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    Dreemo will pick the best value (courage, kindness, patience…) based on what you wrote.
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
