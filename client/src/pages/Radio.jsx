import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { useRadio } from '../hooks/useRadio.jsx';

export default function Radio() {
  const { stationId, playing, loading, error, togglePlayPause, volume, setVolume } = useRadio();

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-2">
        <p className="ui-label">Radio</p>
        <h1 className="display-title mt-1 text-ink">
          Bedtime <span className="text-gold">stations</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Three free streams curated for the wind-down hour. One ambient global channel,
          two from India.
        </p>
      </header>

      {/* Volume slider — sticky-feel */}
      {stationId && (
        <div className="my-5 flex items-center gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
          <span className="text-lg">🔉</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="kahaniyo-range flex-1"
            aria-label="Volume"
          />
          <span className="w-8 text-right text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            {Math.round(volume * 100)}
          </span>
        </div>
      )}

      {/* Stations */}
      <div className="mt-4 space-y-4">
        {RADIO_STATIONS.map((s) => {
          const isActive = stationId === s.id;
          const isPlaying = isActive && playing;
          const isLoading = isActive && loading;
          return (
            <motion.article
              key={s.id}
              layout
              className={`overflow-hidden rounded-3xl ring-1 transition ${
                isActive
                  ? 'bg-bg-elevated shadow-lift ring-gold/40'
                  : 'bg-bg-surface shadow-card ring-white/5'
              }`}
            >
              <div className="flex items-stretch gap-4 p-4">
                {/* Cover art */}
                <div
                  className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-4xl"
                  style={{
                    background: `linear-gradient(135deg, ${s.accent}aa, ${s.accent}22 60%, transparent)`,
                  }}
                >
                  {s.icon}
                </div>

                {/* Meta */}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    {s.tagline}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                    {s.description}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-bg-base/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
                    Best for · {s.bestFor}
                  </div>
                </div>
              </div>

              {/* Play strip */}
              <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {isLoading ? (
                    <>
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold" />
                      Connecting…
                    </>
                  ) : isPlaying ? (
                    <>
                      <SoundBars />
                      Live
                    </>
                  ) : isActive && error ? (
                    <span className="text-warning">{error}</span>
                  ) : (
                    'Tap play to tune in'
                  )}
                </div>
                <button
                  onClick={() => togglePlayPause(s)}
                  aria-label={isPlaying ? `Pause ${s.name}` : `Play ${s.name}`}
                  className={`grid h-12 w-12 place-items-center rounded-full transition active:scale-95 ${
                    isActive
                      ? 'bg-gold text-bg-base shadow-glow'
                      : 'bg-bg-card text-gold hover:bg-gold hover:text-bg-base'
                  }`}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Note */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl bg-warning/10 p-3 text-[11px] leading-relaxed text-warning ring-1 ring-warning/20"
          >
            Some streams may be blocked by your network or browser. Try another station, or
            connect over a different network.
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-[10px] text-ink-dim">
        Streams provided by SomaFM and Zeno.fm — free and ad-supported.
      </p>

      <VersionFooter />
    </PageTransition>
  );
}

function SoundBars() {
  return (
    <span className="inline-flex items-end gap-[2px]">
      <span className="block h-2 w-[2px] animate-[twinkle_1s_ease-in-out_infinite] bg-gold" />
      <span className="block h-3 w-[2px] animate-[twinkle_0.8s_ease-in-out_infinite] bg-gold" style={{ animationDelay: '0.15s' }} />
      <span className="block h-1.5 w-[2px] animate-[twinkle_1.2s_ease-in-out_infinite] bg-gold" style={{ animationDelay: '0.3s' }} />
    </span>
  );
}
