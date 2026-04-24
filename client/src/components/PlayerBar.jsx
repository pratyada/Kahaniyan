import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { valueMeta } from '../utils/constants.js';
import { Play, Pause, X } from 'lucide-react';

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
      className="absolute left-3 right-3 z-20 mx-auto flex max-w-2xl items-center gap-3 rounded-2xl bg-bg-elevated/95 px-3 py-2 shadow-lift backdrop-blur-xl active:scale-[0.99] cursor-pointer"
      style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px) + 8px)' }}
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
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="grid h-11 w-11 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
      <button
        onClick={handleClose}
        className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-ink-dim transition hover:text-ink active:scale-95"
        aria-label="Stop"
      >
        <X size={14} />
      </button>
    </div>
  );
}
