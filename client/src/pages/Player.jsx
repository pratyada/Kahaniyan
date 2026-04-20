import { Component, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSharedStory } from '../utils/shareStory.js';
import { storage, db, auth } from '../lib/firebase.js';

import { getCachedAudio, setCachedAudio, pruneAudioCache } from '../utils/audioCache.js';

// Upload audio blob to Firebase Storage and save URL back to story
async function cacheAudioToStorage(storyId, blob) {
  if (!storage || !blob || !storyId) return;
  try {
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { doc, setDoc } = await import('firebase/firestore');
    const storageRef = ref(storage, `audio/${storyId}.opus`);
    await uploadBytes(storageRef, blob, { contentType: 'audio/ogg' });
    const audioUrl = await getDownloadURL(storageRef);

    // Save URL to sharedStories (so shared links play instantly)
    if (db) {
      setDoc(doc(db, 'sharedStories', storyId), { audioUrl }, { merge: true }).catch(() => {});
    }
    // Save URL to user's library in Firestore
    const uid = auth?.currentUser?.uid;
    if (db && uid) {
      const { getDoc: gd } = await import('firebase/firestore');
      const userSnap = await gd(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const lib = userSnap.data().library || [];
        const updated = lib.map((s) => s.id === storyId ? { ...s, audioUrl } : s);
        if (JSON.stringify(lib) !== JSON.stringify(updated)) {
          setDoc(doc(db, 'users', uid), { library: updated }, { merge: true }).catch(() => {});
        }
      }
    }
    // Update localStorage library too
    try {
      const raw = localStorage.getItem('mst:library');
      if (raw) {
        const lib = JSON.parse(raw);
        const updated = lib.map((s) => s.id === storyId ? { ...s, audioUrl } : s);
        localStorage.setItem('mst:library', JSON.stringify(updated));
      }
    } catch {}
    console.log('[My Sleepy Tale:Player] Audio cached to Storage:', storyId);
  } catch (e) {
    console.warn('[My Sleepy Tale:Player] Audio cache failed (non-fatal):', e.message);
  }
}

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
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useNarrator } from '../hooks/useNarrator.js';
import { valueMeta } from '../utils/constants.js';

const SPEEDS = [0.8, 1, 1.2];

// Request notification permission early (non-blocking)
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

// Show notification when audio is ready (user may have backgrounded)
function notifyAudioReady(title) {
  if ('Notification' in window && Notification.permission === 'granted' && document.visibilityState === 'hidden') {
    try {
      const n = new Notification('Your story is ready!', {
        body: `"${title}" is ready to play`,
        icon: '/favicon.svg',
        tag: 'story-ready',
        requireInteraction: true,
      });
      n.onclick = () => { window.focus(); n.close(); };
    } catch {}
  }
}

// Set up Media Session for lock screen / notification bar controls
function setupMediaSession(story, meta, handlers) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: story.title,
    artist: story.voice || 'AI Narrator',
    album: 'My Sleepy Tale',
    artwork: [{ src: '/favicon.svg', sizes: '192x192', type: 'image/png' }],
  });
  navigator.mediaSession.setActionHandler('play', handlers.play);
  navigator.mediaSession.setActionHandler('pause', handlers.pause);
  navigator.mediaSession.setActionHandler('seekbackward', handlers.seekBackward);
  navigator.mediaSession.setActionHandler('seekforward', handlers.seekForward);
  navigator.mediaSession.setActionHandler('stop', handlers.stop);
}

// Wrapper that handles shared story loading BEFORE mounting the heavy PlayerInner
export default function Player() {
  return (
    <PlayerErrorBoundary>
      <SharedStoryGate />
    </PlayerErrorBoundary>
  );
}

function SharedStoryGate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { current, load } = usePlayer();
  const sharedStoryId = searchParams.get('storyId') || '';
  const [status, setStatus] = useState(sharedStoryId ? 'loading' : 'ready'); // 'loading' | 'ready' | 'failed'

  useEffect(() => {
    if (!sharedStoryId || current) { setStatus('ready'); return; }
    let cancelled = false;
    loadSharedStory(sharedStoryId).then(async (story) => {
      if (cancelled) return;
      if (!story) { setStatus('failed'); return; }
      load(story);
      setStatus('ready');
      try {
        const { recordListen } = await import('../utils/shareStory.js');
        recordListen(sharedStoryId);
      } catch {}
    }).catch(() => {
      if (!cancelled) setStatus('failed');
    });
    return () => { cancelled = true; };
  }, [sharedStoryId, current, load]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="text-sm text-ink-muted">Loading story...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-4xl mb-4">😔</div>
        <h1 className="font-display text-xl font-bold text-gold">Story not found</h1>
        <p className="mt-2 text-sm text-ink-muted">This story link may have expired or doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">Go to home</button>
      </div>
    );
  }

  return <PlayerInner />;
}

function PlayerInner() {
  const navigate = useNavigate();
  const { current, clear, isPlaying, setIsPlaying, reloadLast, load, setAudio, audioRef: globalAudioRef } = usePlayer();
  const { profile } = useFamilyProfile();
  const narrator = useNarrator();
  const { user } = useAuth();

  const [speed, setSpeed] = useState(1);
  const [showText, setShowText] = useState(true);
  const [done, setDone] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const startedRef = useRef(false);

  // Request notification permission on mount
  useEffect(() => { requestNotificationPermission(); }, []);

  // Reset startedRef when story changes so auto-play fires for new stories
  const currentIdRef = useRef(null);
  if (current && current.id !== currentIdRef.current) {
    currentIdRef.current = current.id;
    startedRef.current = false;
  }

  // Auto-play when current story is available
  useEffect(() => {
    if (!current) {
      console.warn('[My Sleepy Tale:Player] Waiting for story...');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    // If there's already a playing audio in global context (user navigated back),
    // reconnect the narrator to it instead of creating a new one
    const existingAudio = globalAudioRef?.current;
    if (existingAudio && existingAudio.src && !existingAudio.ended && existingAudio.currentTime > 0) {
      console.log('[My Sleepy Tale:Player] Reconnecting to existing audio');
      narrator.reconnect(existingAudio);
      setTtsReady(true);
      return;
    }

    console.log('[My Sleepy Tale:Player] Starting playback:', current.title);

    const lang = current.language || profile?.language || 'English';
    const narratorName = current.voice || 'AI Narrator';
    const chars = profile?.characters || [];
    const matchedChar = chars.find((c) => c.name === narratorName || c.relation === narratorName.toLowerCase());
    const customVoiceId = matchedChar?.narratorVoiceId || null;

    const startPlayback = async () => {
      try {
        let audio;

        // Priority 1: Check IndexedDB for locally cached blob (instant)
        const localBlob = current.id ? await getCachedAudio(current.id) : null;
        if (localBlob) {
          console.log('[My Sleepy Tale:Player] Playing from local cache (instant)');
          const url = URL.createObjectURL(localBlob);
          audio = narrator.loadCached(url);
        }
        // Priority 2: Firebase Storage cached URL (fast download)
        else if (current.audioUrl) {
          console.log('[My Sleepy Tale:Player] Playing from Firebase cached URL');
          audio = narrator.loadCached(current.audioUrl);
          // Also save to local IDB for next time (fire & forget)
          fetch(current.audioUrl).then(r => r.blob()).then(blob => {
            setCachedAudio(current.id, blob);
          }).catch(() => {});
        }
        // Priority 3: Generate fresh audio via TTS
        else {
          audio = await narrator.generate({
            text: current.text,
            narrator: narratorName,
            language: lang,
            customVoiceId,
            country: profile?.country || 'OTHER',
            beliefs: profile?.beliefs || [],
          });

          // Cache locally + to Firebase Storage (fire and forget)
          if (audio && current.id) {
            const blob = narrator.getBlob();
            if (blob) {
              setCachedAudio(current.id, blob);
              pruneAudioCache(20);
            }
            cacheAudioToStorage(current.id, blob).then(() => {
              try {
                const raw = localStorage.getItem('mst:lastStory');
                if (raw) {
                  const saved = JSON.parse(raw);
                  if (saved.id === current.id) {
                    const lib = JSON.parse(localStorage.getItem('mst:library') || '[]');
                    const fromLib = lib.find((s) => s.id === current.id);
                    if (fromLib?.audioUrl) {
                      saved.audioUrl = fromLib.audioUrl;
                      localStorage.setItem('mst:lastStory', JSON.stringify(saved));
                    }
                  }
                }
              } catch {}
            });
          }
        }

        if (!audio) return; // aborted
        setTtsReady(true);
        setAudio(audio); // register with global context so clear() can stop it
        audio.playbackRate = speed;

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);

        notifyAudioReady(current.title);

        try {
          await audio.play();
        } catch {
          setIsPlaying(false);
        }
      } catch (e) {
        console.warn('[My Sleepy Tale:Player] TTS failed:', e.message);
        setIsPlaying(false);
      }
    };

    startPlayback();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const progress = narrator.progress;

  // Only stop audio on unmount if user explicitly closed (X button)
  const closedRef = useRef(false);
  useEffect(() => {
    return () => {
      if (closedRef.current) {
        narrator.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // When story ends, show done state then go back after a pause
  useEffect(() => {
    if (!current || !ttsReady) return;
    const ended = progress >= 1 && !narrator.playing && !narrator.loading;
    if (ended && !done) {
      setDone(true);
      setIsPlaying(false);
      setTimeout(() => {
        narrator.stop();
        navigate('/');
      }, 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, narrator.playing, narrator.loading, ttsReady, done]);

  // Recover story from localStorage if current is null (e.g. navigated from library)
  const recoveredRef = useRef(false);
  useEffect(() => {
    if (current || recoveredRef.current) return;
    recoveredRef.current = true;
    setTimeout(() => reloadLast(), 0);
  }, [current, reloadLast]);

  if (!current) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="text-sm text-ink-muted">Loading story...</p>
      </div>
    );
  }

  const meta = valueMeta(current.value);

  // If story has no text, show error
  if (!current.text) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-4xl mb-4">😔</div>
        <h1 className="font-display text-xl font-bold text-gold">{current.title || 'Story'}</h1>
        <p className="mt-2 text-sm text-ink-muted">This story doesn't have any content to play.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">Back to home</button>
      </div>
    );
  }

  const handleTogglePlay = () => {
    if (!isPlaying) {
      narrator.play();
      setIsPlaying(true);
    } else {
      narrator.pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    narrator.setRate(newSpeed);
  };

  const handleClose = () => {
    closedRef.current = true;
    narrator.stop();
    clear();
    navigate('/');
  };

  // Media Session — lock screen / notification bar controls
  useEffect(() => {
    if (!current) return;
    setupMediaSession(current, meta, {
      play: () => { narrator.play(); setIsPlaying(true); },
      pause: () => { narrator.pause(); setIsPlaying(false); },
      seekBackward: () => narrator.seekBy(-10),
      seekForward: () => narrator.seekBy(10),
      stop: handleClose,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

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
              <div className="flex items-center gap-2">
                {/* Back — keep audio playing, go explore the app */}
                <button
                  onClick={() => navigate(-1)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm"
                  title="Keep playing & go back"
                >
                  ←
                </button>
                {/* Close — stop audio and clear story */}
                <button
                  onClick={handleClose}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xs text-ink-dim"
                  title="Stop & close"
                >
                  ✕
                </button>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  Now Playing
                </div>
                <div className="text-xs font-bold text-ink">{meta.label}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={shareStory}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5"
                  title="Share with community"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
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
                <h1 className="font-display text-xl font-bold text-ink">{current.title || 'Bedtime Story'}</h1>
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

            {/* Story text — always visible, scrolls in sync */}
            {current.text && <HighlightedText text={current.text} progress={progress} />}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Progress bar — tappable + draggable to seek */}
            <div className="mt-4">
              <div
                className="relative h-6 w-full cursor-pointer flex items-center"
                onClick={(e) => {
                  if (!ttsReady) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  narrator.seek(fraction);
                }}
                onTouchMove={(e) => {
                  if (!ttsReady) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                  narrator.seek(fraction);
                }}
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gold pointer-events-none rounded-full"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                {/* Seek thumb */}
                {ttsReady && (
                  <div
                    className="absolute h-4 w-4 rounded-full bg-gold shadow-glow pointer-events-none"
                    style={{ left: `calc(${Math.round(progress * 100)}% - 8px)` }}
                  />
                )}
              </div>
              {narrator.duration > 0 && (
                <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-dim">
                  <span>{Math.floor(progress * narrator.duration / 60)}:{String(Math.floor(progress * narrator.duration % 60)).padStart(2,'0')}</span>
                  <span>-{Math.floor((1 - progress) * narrator.duration / 60)}:{String(Math.floor((1 - progress) * narrator.duration % 60)).padStart(2,'0')}</span>
                </div>
              )}
            </div>

            {/* Controls — large, obvious, mobile-first */}
            <div className="mt-5 flex flex-col items-center gap-3">
              {/* Rewind / Play / Forward */}
              <div className="flex items-center gap-6">
                {/* Rewind 15s */}
                <button
                  onClick={() => { narrator.seekBy(-10); }}
                  disabled={narrator.loading || !ttsReady}
                  aria-label="Rewind 10 seconds"
                  className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/5 text-ink-muted transition active:scale-95 disabled:opacity-30"
                >
                  <span className="text-[10px] font-bold leading-none">-10</span>
                  <span className="text-[8px] leading-none mt-0.5">sec</span>
                </button>

                {/* Big play / pause / loading */}
                <button
                  onClick={handleTogglePlay}
                  disabled={narrator.loading}
                  aria-label={narrator.loading ? 'Loading audio' : isPlaying ? 'Pause story' : 'Play story'}
                  className={`group relative grid h-20 w-20 place-items-center rounded-full transition active:scale-95 ${
                    narrator.loading
                      ? 'bg-bg-elevated ring-2 ring-gold/30'
                      : 'bg-gold text-bg-base shadow-glow'
                  }`}
                >
                  {narrator.loading ? (
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

                {/* Forward 15s */}
                <button
                  onClick={() => { narrator.seekBy(10); }}
                  disabled={narrator.loading || !ttsReady}
                  aria-label="Forward 10 seconds"
                  className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/5 text-ink-muted transition active:scale-95 disabled:opacity-30"
                >
                  <span className="text-[10px] font-bold leading-none">+10</span>
                  <span className="text-[8px] leading-none mt-0.5">sec</span>
                </button>
              </div>
              {narrator.loading && (
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                  Preparing voice…
                </div>
              )}

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
                  onClick={() => {
                    const audio = narrator.audioRef?.current;
                    if (audio) {
                      audio.currentTime = 0;
                      audio.volume = 1;
                      audio.play().catch(() => {});
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


          </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HighlightedText({ text, progress }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  // Split into words, preserving whitespace
  const words = (text || '').split(/(\s+)/);
  const totalLen = text.length;

  // No offset — highlight matches audio position exactly
  const adjusted = Math.min(1, progress);
  const cutoff = Math.floor(totalLen * adjusted);

  // Auto-scroll to keep active word visible
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      // Scroll if active word is below the visible area
      if (activeRect.top > containerRect.bottom - 60 || activeRect.bottom < containerRect.top + 20) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [cutoff]);

  let charCount = 0;
  let foundActive = false;

  return (
    <div ref={containerRef} className="mt-4 max-h-[45vh] overflow-y-auto rounded-2xl bg-black/30 p-4 font-story text-[15px] leading-[1.9] text-ink-muted/60 ring-1 ring-white/5">
      {words.map((word, i) => {
        const start = charCount;
        charCount += word.length;

        // Whitespace — render as-is
        if (/^\s+$/.test(word)) {
          return <span key={i}>{word}</span>;
        }

        const isRead = charCount <= cutoff;
        const isActive = !foundActive && start < cutoff && charCount > cutoff;
        if (isActive) foundActive = true;

        if (isActive) {
          return (
            <span
              key={i}
              ref={activeRef}
              className="rounded px-0.5 text-bg-base font-bold"
              style={{ backgroundColor: '#f0a500', boxShadow: '0 0 8px rgba(240,165,0,0.4)' }}
            >
              {word}
            </span>
          );
        }

        if (isRead) {
          return <span key={i} className="text-ink">{word}</span>;
        }

        return <span key={i}>{word}</span>;
      })}
    </div>
  );
}

