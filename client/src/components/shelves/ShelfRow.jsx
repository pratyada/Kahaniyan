// Horizontal snap-scroll container for shelf items.
// Renders children in a flex row with edge-to-edge horizontal scroll.

import { useRef } from 'react';

export default function ShelfRow({ children, className = '' }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={`-mx-5 flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-hide snap-x snap-mandatory ${className}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
        {/* End spacer so last card isn't flush with edge */}
        <div className="w-2 shrink-0" />
      </div>
      {/* Right fade hint */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-bg-base to-transparent" />
    </div>
  );
}
