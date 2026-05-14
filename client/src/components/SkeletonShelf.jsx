// Loading skeleton for shelf rows — pulsing grey rectangles matching StoryTile dimensions.

export default function SkeletonShelf({ count = 4 }) {
  return (
    <section className="mb-6">
      {/* Title skeleton */}
      <div className="mb-3 h-4 w-40 animate-pulse rounded-lg bg-white/5" />
      {/* Cards */}
      <div className="-mx-5 flex gap-3 overflow-hidden px-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-40 shrink-0 animate-pulse rounded-2xl bg-white/5"
            style={{ aspectRatio: '2/3', animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
