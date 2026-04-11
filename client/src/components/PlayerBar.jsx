import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { valueMeta } from '../utils/constants.js';

// Spotify-style mini player bar — sits above the bottom nav.
export default function PlayerBar() {
  const navigate = useNavigate();
  const { current, isPlaying, setIsPlaying } = usePlayer();
  if (!current) return null;
  const meta = valueMeta(current.value);

  return (
    <button
      onClick={() => navigate('/player')}
      className="absolute bottom-[72px] left-3 right-3 z-20 flex items-center gap-3 rounded-2xl bg-bg-elevated/95 px-3 py-2 shadow-lift backdrop-blur-xl active:scale-[0.99]"
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
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying((p) => !p);
        }}
        className="grid h-10 w-10 place-items-center rounded-full bg-gold text-bg-base"
      >
        {isPlaying ? '❚❚' : '▶'}
      </span>
    </button>
  );
}
