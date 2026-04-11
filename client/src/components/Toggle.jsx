// Reusable Shopify-style toggle. Big, clear, obviously tappable.
export default function Toggle({ checked, onChange, label, description, id }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5 transition active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <div className="font-ui text-sm font-bold text-ink">{label}</div>
        {description && (
          <div className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{description}</div>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/15'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-bg-base shadow-card transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}
