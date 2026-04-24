import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRadio } from '../hooks/useRadio.jsx';
import { RADIO_STATIONS } from '../data/radioStations.js';

export default function RadioBar() {
  const navigate = useNavigate();
  const { stationId, playing, loading, togglePlayPause, stop } = useRadio();
  const station = RADIO_STATIONS.find((s) => s.id === stationId);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const nav = document.getElementById('bottom-nav');
      if (nav) setNavHeight(nav.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 200);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  if (!station) return null;

  return (
    <div className="absolute left-3 right-3 z-20 flex items-center gap-3 rounded-2xl bg-bg-elevated/95 px-3 py-2 shadow-lift backdrop-blur-xl"
      style={{ bottom: `${navHeight + 8}px` }}>
      <button
        onClick={() => navigate('/radio')}
        className="flex min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.99]"
      >
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
          style={{ background: `${station.accent}33` }}
        >
          {station.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-ui text-sm font-bold text-ink">{station.name}</div>
          <div className="truncate text-xs text-ink-muted">
            {loading ? 'Connecting…' : playing ? 'Live · Radio' : 'Paused · Radio'}
          </div>
        </div>
      </button>
      <button
        onClick={() => togglePlayPause(station)}
        aria-label={playing ? 'Pause radio' : 'Play radio'}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-bg-base shadow-glow"
      >
        {playing ? (
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
      <button
        onClick={stop}
        aria-label="Stop radio"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg-card text-ink-muted hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
