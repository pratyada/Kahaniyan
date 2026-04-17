import { Component, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSharedStory } from '../utils/shareStory.js';

// Error boundary to catch crashes and show them instead of blank screen
class PlayerErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[My Sleepy Tale:Player] CRASH:', error.message, info.componentStack?.slice(0, 300)); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="font-display text-xl font-bold text-gold">Player error</h1>
          <p className="mt-2 text-sm text-ink-muted">{this.state.error?.message || 'Unknown error'}</p>
          <pre className="mt-3 max-w-sm overflow-auto rounded-xl bg-bg-surface p-3 text-[10px] text-ink-dim">
            {this.state.error?.stack?.slice(0, 500)}
          </pre>
          <button onClick={() => window.location.href = '/'} className="btn-primary mt-6">
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { useElevenLabs } from '../hooks/useElevenLabs.js';
import { useWhiteNoise, NOISE_TYPES } from '../hooks/useWhiteNoise.jsx';
import { valueMeta } from '../utils/constants.js';
import StoryLoading from '../components/StoryLoading.jsx';

const SPEEDS = [0.8, 1, 1.2];

export default function Player() {
  return (
    <PlayerErrorBoundary>
      <PlayerInner />
    </PlayerErrorBoundary>
  );
}

function PlayerInner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { current, clear, isPlaying, setIsPlaying, reloadLast, load } = usePlayer();
  const { profile } = useFamilyProfile();
  const webSpeech = useSpeech();
  const elevenLabs = useElevenLabs();
  const noise = useWhiteNoise();
  const [loadingShared, setLoadingShared] = useState(false);
  const [liked, setLiked] = useState(false);

  // Load shared story from URL if ?storyId= is present
  const sharedIdRef = useRef(null);
  useEffect(() => {
    const storyId = searchParams.get('storyId');
    if (!storyId || current || sharedIdRef.current === storyId) return;
    sharedIdRef.current = storyId;
    setLoadingShared(true);
    loadSharedStory(storyId).then((story) => {
      if (story) {
        load(story);
      }
      setLoadingShared(false);
    });
  }, [searchParams, current, load]);

  const [speed, setSpeed] = useState(0.8);
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
  const startedRef = useRef(false);

  // Reset startedRef when story changes so auto-play fires for new stories
  const currentIdRef = useRef(null);
  if (current && current.id !== currentIdRef.current) {
    currentIdRef.current = current.id;
    startedRef.current = false;
    dialogueFadeRef.current = null;
  }

  // Auto-play when current story is available
  useEffect(() => {
    if (!current) {
      console.warn('[My Sleepy Tale:Player] Waiting for story...');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    console.log('[My Sleepy Tale:Player] Starting playback:', current.title);

    // Start ambient noise if enabled
    if (profile?.whiteNoiseEnabled) {
      const initial = profile?.preferredNoise || 'rain';
      setNoiseType(initial);
      noise.start(initial);
      noise.setVolume(0.25);
    }

    const lang = current.language || profile?.language || 'English';
    const narratorName = current.voice || 'AI Narrator';
    const chars = profile?.characters || [];
    const matchedChar = chars.find((c) => c.name === narratorName || c.relation === narratorName.toLowerCase());
    const customVoiceId = matchedChar?.elevenLabsVoiceId || null;

    // Try OpenAI TTS. Don't set isPlaying until audio actually starts.
    const startPlayback = async () => {
      try {
        const audio = await elevenLabs.generate({
          text: current.text,
          narrator: narratorName,
          language: lang,
          customVoiceId,
          country: profile?.country || 'OTHER',
          beliefs: profile?.beliefs || [],
        });
        setUsingTTS(true);
        setTtsReady(true);
        audio.playbackRate = speed;

        // Listen for actual playback start
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);

        try {
          await audio.play();
        } catch {
          // Autoplay blocked — show play button, user taps to start
          setIsPlaying(false);
        }
      } catch (e) {
        console.warn('[My Sleepy Tale:Player] TTS failed, using browser voice:', e.message);
        setUsingTTS(false);
        webSpeech.speak({
          text: current.text,
          language: lang,
          rate: speed * 0.92,
          volume: 1,
          preferredVoiceName: profile?.preferredVoiceName || null,
        });
        setIsPlaying(true);
      }
    };

    startPlayback();
    return () => {};
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
    try {
      const { shareStoryToFirestore } = await import('../utils/shareStory.js');
      const url = await shareStoryToFirestore(current, {
        beliefs: profile?.beliefs || [],
        country: profile?.country || '',
      });
      const text = `Listen to "${current.title}" — a bedtime story on My Sleepy Tale`;
      if (navigator.share) {
        await navigator.share({ title: 'My Sleepy Tale story', text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Story link copied!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.warn('Share failed:', e);
    }
  };

  // When story ends, stop everything and go back to home
  useEffect(() => {
    let ended = false;
    if (!usingTTS) {
      if (progress > 0 && progress >= 0.999) ended = true;
    } else {
      if (progress >= 1 && !elevenLabs.playing && !elevenLabs.loading && ttsReady) ended = true;
    }
    if (ended) {
      setIsPlaying(false);
      noise.stop();
      elevenLabs.stop();
      webSpeech.stop();
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, setIsPlaying, usingTTS, elevenLabs.playing, elevenLabs.loading, ttsReady]);

  if (!current) {
    // Loading a shared story from URL
    if (loadingShared) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-sm text-ink-muted">Loading shared story...</p>
        </div>
      );
    }
    // Try recovering from localStorage
    const lastStory = reloadLast();
    if (lastStory) return null;

    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-4xl mb-4">📖</div>
        <h1 className="font-display text-xl font-bold text-gold">No story loaded</h1>
        <p className="mt-2 text-sm text-ink-muted">The story may not have generated. Please go back and try again.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">Back to home</button>
      </div>
    );
  }

  const meta = valueMeta(current.value);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (usingTTS) {
        // TTS audio loaded — play or resume
        elevenLabs.play();
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
      // ElevenLabs: changes speed in real-time, no restart
      elevenLabs.setRate(newSpeed);
    } else {
      // Web Speech: can't change speed mid-utterance, just update for next play
      // Don't restart — keep playing at current speed
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
                  onClick={async () => {
                    const { toggleLike } = await import('../utils/shareStory.js');
                    const result = await toggleLike(current.id);
                    if (result) setLiked(result.liked);
                  }}
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm transition ${liked ? 'bg-red-500/20' : 'bg-white/5'}`}
                  title="Like story"
                >
                  {liked ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={shareStory}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm"
                  title="Share story"
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

            {/* Cover art — compact on mobile */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl shadow-lift"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${meta.color}aa, ${meta.color}22 60%, transparent)`,
                }}
              >
                <span className="text-4xl">{meta.emoji}</span>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-xl font-bold text-ink">{current.title}</h1>
              <p className="mt-1 text-xs text-ink-muted">
                For {profile?.childName} · {current.estimatedMinutes} min · {current.voice}
              </p>
              {current.cast && current.cast.length > 0 && (
                <p className="mt-1 truncate text-[10px] text-gold">
                  {current.cast.join(' · ')}
                </p>
              )}
              </div>
            </div>

            {/* Story text — scrolls in sync */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 max-h-[45vh] overflow-y-auto rounded-2xl bg-black/30 p-4 font-story text-[15px] leading-relaxed text-ink-muted ring-1 ring-white/5"
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
              {elevenLabs.duration > 0 && (
                <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-ink-dim">
                  <span>{Math.floor(progress * elevenLabs.duration / 60)}:{String(Math.floor(progress * elevenLabs.duration % 60)).padStart(2,'0')}</span>
                  <span>{Math.floor(elevenLabs.duration / 60)}:{String(Math.floor(elevenLabs.duration % 60)).padStart(2,'0')}</span>
                </div>
              )}
            </div>

            {/* Controls — large, obvious, mobile-first */}
            <div className="mt-5 flex flex-col items-center gap-3">
              {/* Big play / pause / loading */}
              <button
                onClick={handleTogglePlay}
                disabled={elevenLabs.loading}
                aria-label={elevenLabs.loading ? 'Loading audio' : isPlaying ? 'Pause story' : 'Play story'}
                className={`group relative grid h-20 w-20 place-items-center rounded-full transition active:scale-95 ${
                  elevenLabs.loading
                    ? 'bg-bg-elevated ring-2 ring-gold/30'
                    : 'bg-gold text-bg-base shadow-glow'
                }`}
              >
                {elevenLabs.loading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                ) : isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1.5" />
                    <rect x="14" y="4" width="4" height="16" rx="1.5" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                  </svg>
                )}
              </button>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                {elevenLabs.loading ? 'Preparing voice…' : isPlaying ? 'Tap to pause' : 'Tap to play'}
              </div>

              {/* Secondary controls — speed + restart */}
              <div className="mt-2 grid w-full grid-cols-2 gap-2">
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


            {/* Sleep sounds — below controls, always visible */}
            <div className="mt-4 -mx-6 flex gap-2 overflow-x-auto px-6 pb-2">
              {NOISE_TYPES.map((n) => {
                const active = noiseType === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => toggleNoise(n.key)}
                    className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-bold transition ${
                      active
                        ? 'bg-gold text-bg-base shadow-glow'
                        : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                    }`}
                  >
                    {n.icon} {n.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HighlightedText({ text, progress }) {
  // Audio progress doesn't map linearly to text characters — narration
  // speeds up/slows down. Apply a slight lead so the highlight stays
  // with or slightly ahead of the voice, never behind.
  const lead = 0.06; // 6% ahead for tighter sync
  const adjusted = Math.min(1, progress + lead);
  // Use a power curve — text reads faster at start, slows toward end
  const curved = Math.pow(adjusted, 0.92);
  const cutoff = Math.floor(text.length * curved);
  const read = text.slice(0, cutoff);
  const rest = text.slice(cutoff);
  return (
    <>
      <span className="text-yellow-300">{read}</span>
      <span>{rest}</span>
    </>
  );
}

