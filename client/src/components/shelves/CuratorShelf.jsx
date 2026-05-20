// Our Creators shelf — coming soon placeholder for now.

import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';

export default function CuratorShelf() {
  return (
    <ShelfSection title="✍️ Our Creators" subtitle="Stories & series created by the community">
      <ShelfRow>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shrink-0 snap-start relative overflow-hidden rounded-2xl ring-1 ring-white/5 flex flex-col items-center justify-center"
            style={{ width: 160, height: 220, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 mb-2">
              <span className="text-white/30 text-lg">🔒</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Coming Soon</p>
            <p className="text-[8px] text-white/20 mt-1 px-4 text-center">
              {i === 1 ? 'Community stories' : i === 2 ? 'Creator series' : 'Your tradition'}
            </p>
          </div>
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
