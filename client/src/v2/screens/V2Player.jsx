// V2 Player — night-sky playback screen. Plays current.audioUrl DIRECTLY via
// loadCached (instant, no hash check, no Firebase skip = the audio fix), and only
// falls back to /api/tts when there is no stored audio. Driven by useNarrator.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, RotateCcw, RotateCw, Moon, Mic, Timer } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useNarrator } from '../../hooks/useNarrator.js';
import { getStoryArt, getTraditionArt } from '../../utils/storyArt.js';
import { TRADITIONS } from '../../data/culturalLessons.js';
import { GOLD } from '../ui.js';

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function V2Player() {
  const navigate = useNavigate();
  const { current } = usePlayer();
  const nar = useNarrator();
  const startedRef = useRef(null);
  const [sleepMin, setSleepMin] = useState(0);
  const sleepRef = useRef(null);

  // Start playback when the story changes
  useEffect(() => {
    if (!current) return;
    if (startedRef.current === current.id) return;
    startedRef.current = current.id;

    let cancelled = false;
    (async () => {
      let audio = null;
      if (current.audioUrl) {
        audio = nar.loadCached(current.audioUrl); // instant — stored audio
      } else if (current.text) {
        try {
          audio = await nar.generate({
            text: current.text, narrator: current.voice || 'AI Narrator', language: current.language || 'English',
          });
        } catch { /* error surfaced by nar.error */ }
      }
      if (audio && !cancelled) {
        const go = () => { audio.play?.().catch(() => {}); };
        audio.addEventListener('canplay', go, { once: true });
        go(); // try immediately (works if user-gesture context survived)
      }
    })();

    return () => { cancelled = true; nar.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  // Sleep timer
  useEffect(() => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    if (sleepMin > 0) sleepRef.current = setTimeout(() => nar.pause(), sleepMin * 60000);
    return () => { if (sleepRef.current) clearTimeout(sleepRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepMin]);

  if (!current) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="text-[#B8AAC8]">Nothing playing yet.</p>
        <button onClick={() => navigate('/v2')} className="mt-4 rounded-full px-6 py-3 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Browse stories</button>
      </div>
    );
  }

  const cleanId = (current.id || '').replace(/^lesson_/, '');
  const art = getStoryArt(cleanId) || {};
  const cover = current.coverImage || art.image || null;
  const tradition = TRADITIONS.find((t) => t.key === current.tradition);
  const tradArt = getTraditionArt(current.tradition);
  const dur = nar.duration || 0;
  const cur = nar.progress * dur;

  return (
    <div className="px-5 lg:px-8 pt-6 pb-28 max-w-[560px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8] active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A6B8A]">Now Playing</p>
        <button onClick={() => navigate('/v2/profile')} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#B8AAC8] active:scale-95">
          <Mic size={16} />
        </button>
      </div>

      {/* Cover */}
      <div className="mt-6 mx-auto w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden ring-1 ring-white/10 relative" style={{ background: art.gradient || 'linear-gradient(135deg,#243349,#0D1B2A)' }}>
        {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <span className="absolute inset-0 grid place-items-center"><Moon size={40} className="text-white/25" /></span>}
      </div>

      {/* Meta */}
      <div className="mt-6 text-center">
        {tradition && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white/90 mb-2" style={{ background: `${tradArt.color}33` }}>
            {tradition.icon} {tradition.label}
          </span>
        )}
        <h1 className="font-display text-2xl text-[#F7F1E8] leading-snug">{current.title}</h1>
        {current.source && <p className="text-[12px] text-[#7A6B8A] mt-1">{current.source}</p>}
      </div>

      {/* Scrubber */}
      <div className="mt-7">
        <div
          className="h-2 rounded-full bg-white/10 cursor-pointer relative"
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); nar.seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}
        >
          <div className="h-full rounded-full" style={{ width: `${(nar.progress || 0) * 100}%`, background: GOLD }} />
        </div>
        <div className="flex justify-between text-[11px] text-[#7A6B8A] mt-1.5">
          <span>{fmt(cur)}</span>
          <span>{dur ? fmt(dur) : (nar.loading ? 'Loading…' : '—:—')}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="mt-6 flex items-center justify-center gap-7">
        <button onClick={() => nar.seekBy(-15)} className="grid h-12 w-12 place-items-center rounded-full text-[#B8AAC8] hover:text-[#F7F1E8] active:scale-95 relative">
          <RotateCcw size={26} strokeWidth={1.8} />
          <span className="absolute text-[8px] font-bold">15</span>
        </button>
        <button
          onClick={() => (nar.playing ? nar.pause() : nar.resume())}
          className="grid h-[72px] w-[72px] place-items-center rounded-full text-[#0D1B2A] active:scale-95"
          style={{ background: GOLD, boxShadow: '0 10px 34px rgba(246,196,83,0.35)' }}
        >
          {nar.playing ? <Pause size={30} fill="#0D1B2A" /> : <Play size={30} fill="#0D1B2A" className="ml-1" />}
        </button>
        <button onClick={() => nar.seekBy(15)} className="grid h-12 w-12 place-items-center rounded-full text-[#B8AAC8] hover:text-[#F7F1E8] active:scale-95 relative">
          <RotateCw size={26} strokeWidth={1.8} />
          <span className="absolute text-[8px] font-bold">15</span>
        </button>
      </div>

      {nar.error && <p className="mt-4 text-center text-[12px] text-[#f3727f]">{nar.error}</p>}

      {/* Sleep timer */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <Timer size={14} className="text-[#7A6B8A]" />
        <span className="text-[12px] text-[#7A6B8A] mr-1">Sleep timer</span>
        {[0, 5, 10, 20].map((m) => (
          <button
            key={m}
            onClick={() => setSleepMin(m)}
            className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${sleepMin === m ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10'}`}
            style={sleepMin === m ? { background: GOLD } : undefined}
          >
            {m === 0 ? 'Off' : `${m}m`}
          </button>
        ))}
      </div>
    </div>
  );
}
