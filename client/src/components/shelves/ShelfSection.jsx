// Section wrapper with title + optional subtitle + "See All" link above a ShelfRow.

export default function ShelfSection({ title, subtitle, onSeeAll, children }) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-bold text-ink"
            style={{ fontFamily: 'Lora, serif' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[10px] text-ink-muted">{subtitle}</p>
          )}
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-[11px] font-bold text-gold"
          >
            See All
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
