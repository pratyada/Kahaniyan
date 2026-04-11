import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { valueMeta } from '../utils/constants.js';

const SPEEDS = [0.7, 1, 1.3];
const SLEEP_OPTIONS = [0, 5, 10, 15, 30, 45];

export default function Player() {
  const navigate = useNavigate();
  const { current, clear, isPlaying, setIsPlaying } = usePlayer();
  const { profile } = useFamilyProfile();
  const { speak, pause, resume, stop, setVolume, paused, progress, supported } = useSpeech();

  const [speed, setSpeed] = useState(1);
  const [sleepMin, setSleepMin] = useState(0);
  const [showText, setShowText] = useState(true);
  const [done, setDone] = useState(false);
  const sleepTimerRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const startedRef = useRef(false);

  // Auto-play on mount (the "1-second auto-play" promise)
  useEffect(() => {
    if (!current) {
      navigate('/');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setTimeout(() => {
      speak({
        text: current.text,
        language: current.language || profile?.language || 'English',
        rate: speed,
        volume: 1,
      });
      setIsPlaying(true);
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Sleep timer + fade-out in final 2 minutes
  useEffect(() => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (!sleepMin) return;

    const totalMs = sleepMin * 60 * 1000;
    const fadeStart = Math.max(totalMs - 2 * 60 * 1000, totalMs * 0.6);

    sleepTimerRef.current = setTimeout(() => {
      stop();
      setIsPlaying(false);
      setDone(true);
    }, totalMs);

    // Volume fade in the last stretch
    fadeIntervalRef.current = setTimeout(() => {
      let v = 1;
      fadeIntervalRef.current = setInterval(() => {
        v = Math.max(0, v - 0.05);
        setVolume(v);
        if (v <= 0) clearInterval(fadeIntervalRef.current);
      }, (totalMs - fadeStart) / 20);
    }, fadeStart);

    return () => {
      clearTimeout(sleepTimerRef.current);
      clearInterval(fadeIntervalRef.current);
    };
  }, [sleepMin, stop, setVolume, setIsPlaying]);

  // Mark "done" when speech progress reaches end
  useEffect(() => {
    if (progress >= 0.999) {
      setDone(true);
      setIsPlaying(false);
    }
  }, [progress, setIsPlaying]);

  if (!current) return null;

  const meta = valueMeta(current.value);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (paused) resume();
      else
        speak({
          text: current.text,
          language: current.language || profile?.language || 'English',
          rate: speed,
          volume: 1,
        });
      setIsPlaying(true);
    } else {
      pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    // Restart at new speed from current position is non-trivial w/ Web Speech;
    // for POC, simply restart utterance.
    stop();
    speak({
      text: current.text,
      language: current.language || profile?.language || 'English',
      rate: newSpeed,
      volume: 1,
    });
    setIsPlaying(true);
  };

  const handleClose = () => {
    stop();
    clear();
    navigate('/');
  };

  return (
    <div className="absolute inset-0 z-40 overflow-hidden bg-bg-base">
      <div className="aurora" />
      <div className="starfield" />

      <AnimatePresence>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-6 text-6xl"
            >
              🌙
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-gold">Sweet dreams</h1>
            <p className="mt-3 text-sm text-ink-muted">
              {profile?.childName}, may your night be soft and warm.
            </p>
            <button onClick={handleClose} className="btn-secondary mt-12">
              Back to home
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col px-6 pt-6 pb-8 safe-top safe-bottom"
          >
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleClose}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  Now Playing
                </div>
                <div className="text-xs font-bold text-ink">{meta.label}</div>
              </div>
              <button
                onClick={() => setShowText((s) => !s)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm"
                title="Toggle text"
              >
                {showText ? '🅣' : '☾'}
              </button>
            </div>

            {/* Cover art (gradient + emoji) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto my-2 grid h-48 w-48 place-items-center rounded-3xl shadow-lift"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${meta.color}aa, ${meta.color}22 60%, transparent)`,
              }}
            >
              <span className="text-7xl">{meta.emoji}</span>
            </motion.div>

            {/* Title */}
            <div className="mt-6 text-center">
              <h1 className="font-display text-2xl font-bold text-ink">{current.title}</h1>
              <p className="mt-1 text-xs text-ink-muted">
                For {profile?.childName} · {current.estimatedMinutes} min · {current.voice}
              </p>
            </div>

            {/* Story text — scrolls in sync */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 max-h-[28vh] overflow-y-auto rounded-2xl bg-black/30 p-4 font-story text-[15px] leading-relaxed text-ink-muted ring-1 ring-white/5"
                >
                  <HighlightedText text={current.text} progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gold"
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-ink-dim">
                <span>{Math.round(progress * current.estimatedMinutes)} min</span>
                <span>{current.estimatedMinutes} min</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                onClick={() => handleSpeedChange(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
                className="text-xs font-bold uppercase tracking-wider text-ink-muted"
              >
                {speed}x
              </button>

              <button
                onClick={handleTogglePlay}
                className="grid h-16 w-16 place-items-center rounded-full bg-gold text-bg-base shadow-glow active:scale-95"
              >
                {isPlaying && !paused ? <span className="text-xl">❚❚</span> : <span className="text-xl">▶</span>}
              </button>

              <SleepMenu sleepMin={sleepMin} setSleepMin={setSleepMin} />
            </div>

            {!supported && (
              <p className="mt-3 text-center text-[10px] text-warning">
                Your browser doesn't support Web Speech — text only.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HighlightedText({ text, progress }) {
  const cutoff = Math.floor(text.length * progress);
  const read = text.slice(0, cutoff);
  const rest = text.slice(cutoff);
  return (
    <>
      <span className="text-ink">{read}</span>
      <span>{rest}</span>
    </>
  );
}

function SleepMenu({ sleepMin, setSleepMin }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-bold uppercase tracking-wider text-ink-muted"
      >
        {sleepMin ? `${sleepMin}m` : '⏱'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute -right-2 bottom-10 z-20 grid grid-cols-2 gap-1 rounded-2xl bg-bg-elevated p-2 shadow-lift"
          >
            {SLEEP_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSleepMin(m);
                  setOpen(false);
                }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  sleepMin === m ? 'bg-gold text-bg-base' : 'text-ink hover:bg-bg-card'
                }`}
              >
                {m === 0 ? 'Off' : `${m}m`}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
