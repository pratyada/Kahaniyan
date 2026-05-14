// Duration selector strip (2m / 5m / 10m / 15m).
// Extracted from Home.jsx to its own file.

import { DURATIONS } from '../utils/constants.js';

export default function LengthStrip({ duration, setDuration, maxDuration, setUpgradeReason, setUpgradeOpen }) {
  return (
    <section className="mb-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted block mb-2">
        Story length
      </span>
      <div className="flex gap-1.5 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
        {DURATIONS.map((d) => {
          const locked = !!d.locked;
          const active = duration === d.minutes;
          return (
            <button
              key={d.minutes}
              onClick={() => {
                if (locked) {
                  setUpgradeReason(`${d.minutes} min stories require a paid plan.`);
                  setUpgradeOpen(true);
                } else {
                  setDuration(d.minutes);
                }
              }}
              className={`relative flex-1 rounded-xl py-2.5 text-center text-xs font-bold transition ${
                active
                  ? 'bg-gold text-bg-base shadow-glow'
                  : locked
                  ? 'text-ink-dim'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {d.minutes}m
              {locked && !active && <span className="ml-0.5 text-[8px] text-gold">🔒</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
