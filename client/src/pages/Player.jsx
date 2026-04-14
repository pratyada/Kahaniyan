import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { useElevenLabs } from '../hooks/useElevenLabs.js';
import { useWhiteNoise, NOISE_TYPES } from '../hooks/useWhiteNoise.jsx';
import { valueMeta } from '../utils/constants.js';

const SPEEDS = [0.7, 1, 1.3];
const SLEEP_OPTIONS = [0, 5, 10, 15, 30, 45];

export default function Player() {
  const navigate = useNavigate();
  const { current, clear, isPlaying, setIsPlaying } = usePlayer();
  const { profile } = useFamilyProfile();
  const webSpeech = useSpeech();
  const elevenLabs = useElevenLabs();
  const noise = useWhiteNoise();

  const [speed, setSpeed] = useState(1);
  const [sleepMin, setSleepMin] = useState(0);
  const [showText, setShowText] = useState(true);
  const [done, setDone] = useState(false);
  const [noiseType, setNoiseType] = useState(null);
  const [usingTTS, setUsingTTS] = useState(false); // true = ElevenLabs, false = Web Speech
  const [ttsReady, setTtsReady] = useState(false);
  const dialogueFadeRef = useRef(null);

  // Unified interface — picks ElevenLabs or Web Speech
  const voice = usingTTS ? {
    speaking: elevenLabs.playing,
    paused: !elevenLabs.playing && ttsReady && !done,
    progress: elevenLabs.progress,
    supported: true,
  } : {
    speaking: webSpeech.speaking,
    paused: webSpeech.paused,
    progress: webSpeech.progress,
    supported: webSpeech.supported,
  };
  const sleepTimerRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const startedRef = useRef(false);

  // Auto-play on mount — try ElevenLabs first, fall back to Web Speech
  useEffect(() => {
    if (!current) {
      navigate('/');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    // Start ambient noise if enabled
    if (profile?.whiteNoiseEnabled) {
      const initial = profile?.preferredNoise || 'rain';
      setNoiseType(initial);
      noise.start(initial);
      noise.setVolume(0.25);
    }

    const startPlayback = async () => {
      // Try ElevenLabs TTS first
      try {
        const audio = await elevenLabs.generate({
          text: current.text,
          narrator: current.voice || 'AI Narrator',
          language: current.language || profile?.language || 'English',
        });
        setUsingTTS(true);
        setTtsReady(true);
        audio.playbackRate = speed;
        audio.play();
        setIsPlaying(true);
        return;
      } catch (e) {
        console.warn('ElevenLabs TTS failed, falling back to Web Speech:', e.message);
      }

      // Fallback to Web Speech
      setUsingTTS(false);
      webSpeech.speak({
        text: current.text,
        language: current.language || profile?.language || 'English',
        rate: speed * 0.92,
        volume: 1,
        preferredVoiceName: profile?.preferredVoiceName || null,
      });
      setIsPlaying(true);
    };

    const t = setTimeout(startPlayback, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Dialogue fade — narration ramps down while noise grows in second half
  const progress = voice.progress;
  useEffect(() => {
    if (!profile?.dialogueFade || !noiseType) return;
    if (progress < 0.5) return;
    if (dialogueFadeRef.current) return; // only once
    dialogueFadeRef.current = true;

    // Speech volume → 0 over the next ~30s (handled by setVolume on next utterances)
    const target = 0.2;
    const fadeMs = 30000;
    const startedAt = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(1, elapsed / fadeMs);
      const speechVol = 1 - (1 - target) * t;
      if (usingTTS) elevenLabs.setVolume(speechVol);
      else webSpeech.setVolume(speechVol);
      const noiseVol = 0.25 + (0.55 * t);
      noise.setVolume(noiseVol);
      if (t >= 1) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, profile?.dialogueFade, noiseType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      noise.stop();
      elevenLabs.stop();
      webSpeech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNoise = (type) => {
    if (noiseType === type) {
      noise.stop();
      setNoiseType(null);
    } else {
      noise.start(type);
      setNoiseType(type);
    }
  };

  const shareStory = async () => {
    const url = `${window.location.origin}/player?storyId=${encodeURIComponent(current.id)}`;
    const text = `${current.title} — a Qissaa bedtime story for ${profile?.childName}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Qissaa story', text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Story link copied to clipboard');
      }
    } catch {
      // user cancelled
    }
  };

  // Sleep timer + fade-out in final 2 minutes
  useEffect(() => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (!sleepMin) return;

    const totalMs = sleepMin * 60 * 1000;
    const fadeStart = Math.max(totalMs - 2 * 60 * 1000, totalMs * 0.6);

    sleepTimerRef.current = setTimeout(() => {
      if (usingTTS) elevenLabs.stop();
      else webSpeech.stop();
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

  // Mark "done" when progress reaches end
  useEffect(() => {
    if (progress >= 0.999 && (voice.speaking || ttsReady)) {
      setDone(true);
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  if (!current) return null;

  const meta = valueMeta(current.value);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (usingTTS) {
        elevenLabs.resume();
      } else {
        if (webSpeech.paused) webSpeech.resume();
        else webSpeech.speak({
          text: current.text,
          language: current.language || profile?.language || 'English',
          rate: speed * 0.92,
          volume: 1,
          preferredVoiceName: profile?.preferredVoiceName || null,
        });
      }
      setIsPlaying(true);
    } else {
      if (usingTTS) elevenLabs.pause();
      else webSpeech.pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (usingTTS) {
      elevenLabs.setRate(newSpeed);
    } else {
      webSpeech.stop();
      webSpeech.speak({
        text: current.text,
        language: current.language || profile?.language || 'English',
        rate: newSpeed * 0.92,
        volume: 1,
        preferredVoiceName: profile?.preferredVoiceName || null,
      });
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    if (usingTTS) elevenLabs.stop();
    else webSpeech.stop();
    noise.stop();
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
              <div className="flex items-center gap-2">
                <button
                  onClick={shareStory}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm"
                  title="Share story"
                  aria-label="Share story"
                >
                  ↗
                </button>
                <button
                  onClick={() => setShowText((s) => !s)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm"
                  title="Toggle text"
                >
                  {showText ? '🅣' : '☾'}
                </button>
              </div>
            </div>

            {/* White noise picker — small chip strip */}
            <div className="mb-3 -mx-6 flex gap-2 overflow-x-auto px-6">
              {NOISE_TYPES.map((n) => {
                const active = noiseType === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => toggleNoise(n.key)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                      active
                        ? 'bg-gold text-bg-base shadow-glow'
                        : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                    }`}
                    title={n.description}
                  >
                    {n.icon} {n.label}
                  </button>
                );
              })}
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
              {current.cast && current.cast.length > 0 && (
                <p className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  Cast · {current.cast.join(' · ')}
                </p>
              )}
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

            {/* Controls — large, obvious, mobile-first */}
            <div className="mt-5 flex flex-col items-center gap-3">
              {/* Big play / pause */}
              <button
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause story' : 'Play story'}
                className="group relative grid h-24 w-24 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95"
              >
                <span className="absolute inset-0 rounded-full ring-4 ring-gold/20" />
                {isPlaying ? (
                  // Pause icon (two bars)
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1.5" />
                    <rect x="14" y="4" width="4" height="16" rx="1.5" />
                  </svg>
                ) : (
                  // Play icon (triangle)
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                  </svg>
                )}
              </button>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                {isPlaying ? 'Tap to pause' : voice.paused ? 'Tap to resume' : 'Tap to play'}
              </div>

              {/* Secondary controls — speed, sleep timer, restart */}
              <div className="mt-2 grid w-full grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    handleSpeedChange(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])
                  }
                  aria-label="Change speed"
                  className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 py-3 ring-1 ring-white/10 transition active:scale-95"
                >
                  <span className="text-lg font-bold text-gold">{speed}x</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
                    Speed
                  </span>
                </button>

                <SleepButton sleepMin={sleepMin} setSleepMin={setSleepMin} />

                <button
                  onClick={async () => {
                    if (usingTTS) {
                      elevenLabs.stop();
                      elevenLabs.seek(0);
                      elevenLabs.play();
                    } else {
                      webSpeech.stop();
                      setTimeout(() => {
                        webSpeech.speak({
                          text: current.text,
                          language: current.language || profile?.language || 'English',
                          rate: speed * 0.92,
                          volume: 1,
                          preferredVoiceName: profile?.preferredVoiceName || null,
                        });
                      }, 100);
                    }
                    setIsPlaying(true);
                  }}
                  aria-label="Restart story"
                  className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 py-3 ring-1 ring-white/10 transition active:scale-95"
                >
                  <span className="text-lg">↺</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
                    Restart
                  </span>
                </button>
              </div>
            </div>

            {elevenLabs.loading && (
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gold">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold" />
                Generating voice… this may take a moment
              </div>
            )}
            {elevenLabs.error && !usingTTS && (
              <p className="mt-3 text-center text-[10px] text-ink-dim">
                Using browser voice (AI voice unavailable)
              </p>
            )}
            {usingTTS && (
              <p className="mt-3 text-center text-[10px] text-gold/60">
                AI narrator voice
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

function SleepButton({ sleepMin, setSleepMin }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Sleep timer"
        className="flex w-full flex-col items-center gap-1 rounded-2xl bg-white/5 py-3 ring-1 ring-white/10 transition active:scale-95"
      >
        <span className="text-lg text-gold">{sleepMin ? `${sleepMin}m` : '⏱'}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
          Sleep
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-[calc(100%+8px)] left-1/2 z-20 grid w-44 -translate-x-1/2 grid-cols-3 gap-1 rounded-2xl bg-bg-elevated p-2 shadow-lift"
          >
            {SLEEP_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSleepMin(m);
                  setOpen(false);
                }}
                className={`rounded-xl px-2 py-2 text-xs font-bold transition ${
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
