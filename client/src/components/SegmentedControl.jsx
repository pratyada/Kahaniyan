// Shopify-style segmented control. Replaces multi-button grids.
export default function SegmentedControl({ options, value, onChange, lockedKey }) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
      {options.map((opt) => {
        const active = value === opt.value;
        const locked = lockedKey && opt.value === lockedKey;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative rounded-xl px-3 py-2.5 text-center text-sm font-bold transition ${
              active
                ? 'bg-gold text-bg-base shadow-glow'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {opt.label}
            {opt.sub && (
              <div
                className={`mt-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  active ? 'text-bg-base/70' : 'text-ink-dim'
                }`}
              >
                {opt.sub}
              </div>
            )}
            {locked && !active && (
              <span className="absolute right-1.5 top-1.5 text-[10px] text-gold">🔒</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
