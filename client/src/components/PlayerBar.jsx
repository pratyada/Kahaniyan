import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { valueMeta } from '../utils/constants.js';

// Spotify-style mini player bar — sits above the bottom nav.
export default function PlayerBar() {
  const navigate = useNavigate();
  const { current, isPlaying, setIsPlaying, clear, audioRef } = usePlayer();
  if (!current) return null;
  const meta = valueMeta(current.value);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef?.current;
    if (!audio || !audio.src || audio.ended) {
      // Audio element is stale — open player to re-init from cache
      navigate('/player');
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    clear();
  };

  return (
    <div
      onClick={() => navigate('/player')}
      className="absolute bottom-[72px] left-3 right-3 z-20 mx-auto flex max-w-2xl items-center gap-3 rounded-2xl bg-bg-elevated/95 px-3 py-2 shadow-lift backdrop-blur-xl active:scale-[0.99] cursor-pointer"
    >
      <div
        className="grid h-11 w-11 place-items-center rounded-xl text-xl"
        style={{ background: `${meta.color}33` }}
      >
        <span>{meta.emoji}</span>
      </div>
      <div className="flex-1 truncate text-left">
        <div className="truncate font-ui text-sm font-bold text-ink">{current.title}</div>
        <div className="truncate text-xs text-ink-muted">
          {meta.label} · {current.estimatedMinutes} min
        </div>
      </div>
      <span
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="grid h-12 w-12 place-items-center rounded-full bg-gold text-bg-base shadow-glow"
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
      </span>
      <span
        onClick={handleClose}
        className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-xs text-ink-dim"
        aria-label="Stop"
      >
        ✕
      </span>
    </div>
  );
}
