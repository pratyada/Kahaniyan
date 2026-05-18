// Stacked card design for series — front card visible, episodes peek from behind.

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSeriesProgress } from '../../hooks/useSeriesProgress.js';

export default function SeriesCard({ series, onClick }) {
  const { getSeriesProgress } = useSeriesProgress();
  const sp = getSeriesProgress(series.id);
  const completedCount = sp.completed.length;
  const total = series.totalEpisodes;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative shrink-0 snap-start"
      style={{ width: 200, height: 280 }}
    >
      {/* Back card 2 (peeking right) */}
      <div
        className="absolute rounded-2xl"
        style={{
          top: 8, left: 16, right: -16, bottom: 16,
          background: series.gradient,
          opacity: 0.3,
          transform: 'rotate(3deg)',
          filter: 'blur(1px)',
        }}
      />

      {/* Back card 1 (peeking left) */}
      <div
        className="absolute rounded-2xl"
        style={{
          top: 4, left: -8, right: 8, bottom: 8,
          background: series.gradient,
          opacity: 0.5,
          transform: 'rotate(-2deg)',
        }}
      />

      {/* Front card */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl shadow-lift"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Background */}
        <div className="absolute inset-0" style={{ background: series.gradient }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Series icon (large, centered top) */}
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-black/30 text-3xl backdrop-blur-sm ring-1 ring-white/10">
            {series.icon}
          </div>
        </div>

        {/* Play badge */}
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-gold backdrop-blur-sm ring-1 ring-gold/30 transition group-hover:bg-gold/30">
          <Play size={12} fill="currentColor" />
        </div>

        {/* Episode count badge */}
        <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[9px] font-bold text-white/80">{total} episodes</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold/70 mb-0.5">Series</p>
          <h3 className="text-sm font-bold text-white leading-tight mb-1.5"
            style={{ fontFamily: 'Fraunces, serif' }}>
            {series.title}
          </h3>
          <p className="text-[10px] text-white/50 line-clamp-1 mb-2">{series.description}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${
                  i < completedCount ? 'bg-gold' : 'bg-white/15'
                }`} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-white/50">
              {completedCount === 0 ? 'New' : `${completedCount}/${total}`}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
