import { Component, useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Share2, Play, Pause, RotateCcw, Loader2, Timer } from 'lucide-react';
import { getStoryArt, getGenericStoryImage } from '../utils/storyArt.js';
import { loadSharedStory } from '../utils/shareStory.js';
import { storage, db, auth } from '../lib/firebase.js';

import { getCachedAudio, setCachedAudio, pruneAudioCache, getCachedAudioHash, deleteCachedAudio } from '../utils/audioCache.js';
import StoryLoading from '../components/StoryLoading.jsx';
import { useTheme } from '../hooks/useTheme.jsx';

// Simple hash of story text — used to detect when text changes so cached audio is invalidated
function textHash(text) {
  if (!text) return '';
  let h = 0;
  for (let i = 0; i < text.length; i++) { h = ((h << 5) - h + text.charCodeAt(i)) | 0; }
  return 'h' + Math.abs(h).toString(36);
}

// Upload audio blob to S3 via Lambda and save URL back to caches
async function cacheAudioToStorage(storyId, blob, storyText) {
  if (!blob || !storyId) return;
  try {
    // Convert blob to base64
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const hash = textHash(storyText);

    const API = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${API}/api/upload-audio`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        storyId,
        audio: base64,
        contentType: blob.type || 'audio/ogg',
        textHash: hash,
      }),
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const { audioUrl } = await res.json();

    // Save URL to user's library in Firestore
    const uid = auth?.currentUser?.uid;
    if (db && uid) {
      const { doc, setDoc, getDoc: gd } = await import('firebase/firestore');
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
    console.log('[My Sleepy Tale:Player] Audio cached to S3:', audioUrl);
  } catch (e) {
    console.warn('[My Sleepy Tale:Player] Audio cache failed (non-fatal):', e.message);
  }
}

// Error boundary to catch crashes and show them instead of blank screen
class PlayerErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error('[My Sleepy Tale:Player] CRASH:', error.message, info.componentStack?.slice(0, 300));
    import('../utils/analytics.js').then(({ trackError }) => trackError('player_crash', error.message)).catch(() => {});
  }
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
import { useStreak } from '../hooks/useStreak.js';
import { canPersonalize, recordPersonalized, personalizedToday, personalizeLimit } from '../utils/tierGate.js';
import PostStoryReflection from '../components/PostStoryReflection.jsx';
import ShareCardSheet from '../components/ShareCardSheet.jsx';
import { useSeriesProgress } from '../hooks/useSeriesProgress.js';
import { useLocalizedSeries } from '../hooks/useLocalizedData.js';
import StoryGallery from '../components/StoryGallery.jsx';
import VoiceClipRecorder from '../components/VoiceClipRecorder.jsx';
import { hasVoicePrompts, getVoicePrompts } from '../data/voicePrompts.js';
import { fillTokens } from '../utils/storyHelpers.js';

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
    artwork: [{ src: story.coverImage || '/favicon.svg', sizes: '512x512', type: 'image/png' }],
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
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { current, load, clear } = usePlayer();
  const sharedStoryId = searchParams.get('storyId') || '';
  const [status, setStatus] = useState(sharedStoryId ? 'loading' : 'ready');
  const loadedRef = useRef(false);

  // If storyId is actually a series slug, redirect to series page
  useEffect(() => {
    if (!sharedStoryId) return;
    import('../data/series.js').then(({ SERIES }) => {
      const match = SERIES.find(s => s.id === sharedStoryId);
      if (match) navigate(`/series/${match.id}`, { replace: true });
    }).catch(() => {});
  }, [sharedStoryId, navigate]);

  useEffect(() => {
    if (!sharedStoryId || loadedRef.current) return;
    loadedRef.current = true;
    loadSharedStory(sharedStoryId).then(async (story) => {
      if (!story) { setStatus('failed'); return; }
      load(story);
      setStatus('ready');
      try {
        const { recordListen } = await import('../utils/shareStory.js');
        const { trackSharedLinkOpened } = await import('../utils/analytics.js');
        recordListen(sharedStoryId);
        trackSharedLinkOpened(sharedStoryId);
      } catch {}
    }).catch(() => {
      setStatus('failed');
    });
  }, [sharedStoryId, load]);

  // Voice clips state — MUST be before any early returns (React hooks rule)
  const episodeId = current?.id || '';
  const voicePrompts = getVoicePrompts(episodeId);
  const [voiceStep, setVoiceStep] = useState(() => {
    if (!voicePrompts) return 'play';
    const cached = localStorage.getItem(`mst:voiceclips:${episodeId}`);
    if (cached) return 'play';
    return 'ask';
  });

  // Early returns AFTER all hooks
  if (status === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="text-sm text-ink-muted">{t('player.loading')}</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-4xl mb-4">😔</div>
        <h1 className="font-display text-xl font-bold text-gold">Story not found</h1>
        <p className="mt-2 text-sm text-ink-muted">This story link may have expired or doesn't exist.</p>
        <button onClick={() => { clear(); navigate('/'); }} className="btn-primary mt-6">{t('player.backToHome')}</button>
      </div>
    );
  }

  if (voiceStep === 'ask' && voicePrompts) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-5xl mb-4">🎙️</div>
        <h2 className="font-display text-2xl font-bold text-gold mb-2">Add your voice!</h2>
        <p className="text-sm text-ink-muted mb-1 max-w-xs">
          Record {current?.childName || 'your'} voice into this story — just 3 quick clips about what you remember.
        </p>
        <p className="text-[11px] text-ink-dim mb-6">Takes about 1 minute. Totally optional!</p>
        <button
          onClick={() => setVoiceStep('record')}
          className="btn-primary px-8 py-4 text-base mb-3"
        >
          🎤 Let's Record!
        </button>
        <button
          onClick={() => setVoiceStep('play')}
          className="text-sm text-ink-muted"
        >
          Skip — just play the story
        </button>
      </div>
    );
  }

  if (voiceStep === 'record' && voicePrompts) {
    return (
      <div className="flex h-screen flex-col bg-bg-base safe-top">
        <VoiceClipRecorder
          prompts={voicePrompts}
          episodeId={episodeId}
          childName={current?.childName || 'your child'}
          onDone={() => setVoiceStep('play')}
          onSkip={() => setVoiceStep('play')}
        />
      </div>
    );
  }

  return <PlayerInner />;
}

function PlayerInner() {
  const { t } = useTranslation();
  const SERIES = useLocalizedSeries();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDay = theme === 'day';
  const { current, clear, isPlaying, setIsPlaying, reloadLast, load, setAudio, audioRef: globalAudioRef } = usePlayer();
  const { profile } = useFamilyProfile();
  const narrator = useNarrator();
  const { user } = useAuth();
  const { recordPlay } = useStreak();
  const { markEpisodeComplete } = useSeriesProgress();

  const [speed, setSpeed] = useState(1);
  const [showText, setShowText] = useState(true);
  const [done, setDone] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  // Language override — persist across re-mounts using sessionStorage
  const [langOverride, setLangOverride] = useState(() => {
    try { return sessionStorage.getItem('mst:player-lang') || null; } catch { return null; }
  });
  const [translatedText, setTranslatedText] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showInlineFeedback, setShowInlineFeedback] = useState(false);
  const [sleepMode, setSleepMode] = useState(false);

  // Play next story — series next episode OR random matching story
  const playNext = useCallback(async () => {
    narrator.stop();
    try {
      const { SERIES } = await import('../data/series.js');
      const { CULTURAL_LESSONS } = await import('../data/culturalLessons.js');
      const beliefs = profile?.beliefs || [];

      // 1. If in a series, play next episode
      if (current?.seriesId) {
        const series = SERIES.find(s => s.id === current.seriesId);
        if (series?.episodes) {
          const currentEpNum = current.episodeNumber || series.episodes.findIndex(e => e.id === current.id || e.id === current.episodeId) + 1;
          const nextEp = series.episodes.find(e => e.episodeNumber === currentEpNum + 1);
          if (nextEp) {
            const { fillTokens } = await import('../utils/storyHelpers.js');
            const filledText = fillTokens(nextEp.body || '', user ? profile : null);
            load({
              id: nextEp.id, title: nextEp.title, text: filledText,
              subtitle: nextEp.subtitle, tradition: nextEp.tradition,
              value: nextEp.theme || nextEp.value, source: nextEp.source,
              seriesId: current.seriesId, episodeNumber: nextEp.episodeNumber,
              episodeId: nextEp.id, isWisdom: true,
              coverImage: nextEp.coverImage || null,
              gallery: nextEp.gallery || [],
              durationMinutes: nextEp.durationMinutes,
              estimatedMinutes: nextEp.durationMinutes,
              multilingual: nextEp.multilingual || false,
              enableTranslation: nextEp.enableTranslation || false,
            });
            navigate(`/player?storyId=${nextEp.id}`);
            return;
          }
        }
      }

      // 2. Random story matching beliefs — from wisdom stories + series episodes
      const allStories = [
        ...CULTURAL_LESSONS.filter(s => s?.body && s?.id),
        ...SERIES.flatMap(s => (s.episodes || []).filter(e => e?.body && e?.id).map(e => ({ ...e, seriesId: s.id, tradition: e.tradition || s.tradition || 'universal' }))),
      ];

      const eligible = allStories.filter(s => {
        if (s.visibility === 'private') return false;
        if (s.id === current?.id) return false;
        if (beliefs.length === 0) return s.tradition === 'universal';
        return beliefs.includes(s.tradition) || s.tradition === 'universal';
      });

      if (eligible.length === 0) return;
      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      const { fillTokens } = await import('../utils/storyHelpers.js');
      const filledText = fillTokens(pick.body || '', user ? profile : null);
      load({
        id: pick.id, title: pick.title, text: filledText,
        tradition: pick.tradition, value: pick.value || pick.theme,
        source: pick.source, isWisdom: true,
        seriesId: pick.seriesId || null,
        episodeId: pick.id,
        episodeNumber: pick.episodeNumber,
        coverImage: pick.coverImage || null,
        gallery: pick.gallery || [],
        durationMinutes: pick.durationMinutes,
        estimatedMinutes: pick.durationMinutes,
      });
      window.history.replaceState(null, '', `/player?storyId=${pick.id}`);
    } catch (e) {
      console.warn('[Player] playNext failed:', e.message);
    }
  }, [current, profile, user, narrator, load, navigate]);
  // Track which language the current audio is playing in
  const audioLangRef = useRef(null);
  const startedRef = useRef(false);
  const [wisdomImageUrls, setWisdomImageUrls] = useState({});
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState({});
  const [audioHashes, setAudioHashes] = useState({});

  // Fetch wisdom images + audio URLs + audio hashes for cache invalidation
  useEffect(() => {
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const [imgSnap, audioSnap, hashSnap] = await Promise.all([
          fget(fdoc(fireDb, 'config', 'wisdomImages')),
          fget(fdoc(fireDb, 'config', 'wisdomAudio')),
          fget(fdoc(fireDb, 'config', 'audioHashes')),
        ]);
        if (imgSnap.exists()) setWisdomImageUrls(imgSnap.data());
        if (audioSnap.exists()) setWisdomAudioUrls(audioSnap.data());
        if (hashSnap.exists()) setAudioHashes(hashSnap.data());
      } catch {}
    })();
  }, []);

  // Request notification permission on mount
  useEffect(() => { requestNotificationPermission(); }, []);

  // Reset startedRef + done when story changes so auto-play fires for new stories
  const currentIdRef = useRef(null);
  if (current && current.id !== currentIdRef.current) {
    currentIdRef.current = current.id;
    startedRef.current = false;
    if (done) setDone(false);
  }

  // Timeout: if no story after 35s, show error
  const [waitTimeout, setWaitTimeout] = useState(false);
  useEffect(() => {
    if (current) return;
    const t = setTimeout(() => setWaitTimeout(true), 35000);
    return () => clearTimeout(t);
  }, [current]);

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
      // Restore language state — don't regenerate
      if (audioLangRef.current && audioLangRef.current !== 'English') {
        setLangOverride(audioLangRef.current);
      }
      return;
    }

    console.log('[My Sleepy Tale:Player] Starting playback:', current.title);
    // Kill any orphaned audio elements before starting fresh
    document.querySelectorAll('audio').forEach(a => { try { a.pause(); a.src = ''; } catch {} });

    // For multilingual/FIFA stories, always default to English (not profile language)
    const storyId = current.id || '';
    const isMultiLangStory = storyId.includes('multilingual') || storyId.includes('fifa26') || current.multilingual || current.enableTranslation || publishedFlags?.multilingual;

    // Clear language override when switching to a non-multilingual story
    if (!isMultiLangStory && langOverride) {
      setLangOverride(null);
      setTranslatedText(null);
      try { sessionStorage.removeItem('mst:player-lang'); } catch {}
      audioLangRef.current = null;
    }

    const lang = (isMultiLangStory ? langOverride : null) || (isMultiLangStory ? 'English' : (current.language || profile?.language || 'English'));
    const narratorName = current.voice || 'AI Narrator';
    const chars = profile?.characters || [];
    const matchedChar = chars.find((c) => c.name === narratorName || c.relation === narratorName.toLowerCase());
    const customVoiceId = matchedChar?.narratorVoiceId || null;

    const startPlayback = async () => {
      try {
        let audio;

        // Priority 0: Check for personalized cached audio (child-name specific)
        const childName = profile?.childName;
        const hasPersonalizedName = childName && childName !== 'little one' && current?.text?.includes(childName);
        if (hasPersonalizedName && current.id) {
          const personalBlob = await getCachedAudio(`${current.id}_${childName}`);
          if (personalBlob) {
            console.log(`[My Sleepy Tale:Player] Playing personalized cache for ${childName}`);
            const url = URL.createObjectURL(personalBlob);
            audio = narrator.loadCached(url);
            setPersonalized(true);
          }
        }

        // Priority 1: Check IndexedDB for locally cached blob (instant)
        // But first verify text hasn't changed since caching
        const cacheKey = isMultiLangStory ? `${current.id}_lang_${lang}` : current.id;
        let localBlob = (!audio && cacheKey) ? await getCachedAudio(cacheKey) : null;
        if (localBlob && current.text) {
          const localHash = await getCachedAudioHash(cacheKey);
          const currentHash = textHash(current.text);
          // No hash stored = old cache from before hash system — don't trust it, regenerate
          if (!localHash || localHash !== currentHash) {
            console.log('[My Sleepy Tale:Player] Text changed or no hash — deleting stale local audio cache');
            await deleteCachedAudio(cacheKey);
            localBlob = null;
          }
        }
        if (localBlob) {
          console.log('[My Sleepy Tale:Player] Playing from local cache (instant)');
          const url = URL.createObjectURL(localBlob);
          audio = narrator.loadCached(url);
        }
        // Priority 2: Firebase Storage cached URL (skip if text changed or non-English multilingual)
        else if (current.audioUrl && !(isMultiLangStory && lang !== 'English')) {
          const currentHash = textHash(current.text);
          const cachedHash = audioHashes[current.id];
          const hashMismatch = cachedHash ? cachedHash !== currentHash : false;
          // If no hash stored yet, save it now for future comparison
          if (!cachedHash && current.text && db) {
            import('firebase/firestore').then(({ doc, setDoc }) => {
              setDoc(doc(db, 'config', 'audioHashes'), { [current.id]: currentHash }, { merge: true }).catch(() => {});
            }).catch(() => {});
          }
          if (hashMismatch) {
            console.log('[My Sleepy Tale:Player] Text changed — skipping cached audio, will regenerate TTS');
            // Delete stale audio from storage so it doesn't persist
            if (db) {
              import('firebase/firestore').then(({ doc, setDoc }) => {
                setDoc(doc(db, 'config', 'wisdomAudio'), { [current.id]: '' }, { merge: true }).catch(() => {});
                setDoc(doc(db, 'config', 'audioHashes'), { [current.id]: currentHash }, { merge: true }).catch(() => {});
              }).catch(() => {});
            }
            // Don't use cached audio — fall through to TTS
          } else {
          console.log('[My Sleepy Tale:Player] Playing cached audio from Firebase');
          audio = narrator.loadCached(current.audioUrl);
          // Wait briefly to see if audio actually loads, fallback to TTS if not
          const loadedOk = await new Promise((resolve) => {
            let resolved = false;
            audio.oncanplay = () => { if (!resolved) { resolved = true; resolve(true); } };
            audio.onerror = () => { if (!resolved) { resolved = true; resolve(false); } };
            setTimeout(() => { if (!resolved) { resolved = true; resolve(false); } }, 5000);
          });
          if (!loadedOk) {
            console.warn('[My Sleepy Tale:Player] Cached audio failed, falling back to TTS');
            // CRITICAL: stop and discard the failed audio element before TTS fallback
            try { audio.pause(); audio.src = ''; audio.load(); } catch {}
            audio = null;
          }
          } // close hash-check else
        }

        // Priority 3: Generate via TTS API (fallback if cached audio failed or no pre-gen)
        if (!audio && current.text) {
          // For multilingual/FIFA stories, always use "little one" instead of child's name
          let ttsText = current.text;
          if (isMultiLangStory) {
            const childName = profile?.childName;
            if (childName && childName !== 'little one') {
              ttsText = ttsText.replace(new RegExp(childName, 'g'), 'little one');
            }
          }

          // For non-English: translate first, then send translated text to TTS
          if (isMultiLangStory && lang !== 'English') {
            try {
              const translateRes = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ttsText, language: lang }),
              });
              if (translateRes.ok) {
                const { translated } = await translateRes.json();
                if (translated) ttsText = translated;
              }
            } catch (e) {
              console.warn('[Player] Translation failed, using English for TTS:', e.message);
            }
          }

          audio = await narrator.generate({
            text: ttsText,
            narrator: narratorName,
            language: 'English', // TTS just speaks — translation already done above
            customVoiceId,
            country: profile?.country || 'OTHER',
            beliefs: profile?.beliefs || [],
          });
          audioLangRef.current = lang;

          // Cache locally + to Firebase Storage (fire and forget)
          if (audio && current.id) {
            const blob = narrator.getBlob();
            if (blob) {
              setCachedAudio(cacheKey, blob, textHash(current.text));
              pruneAudioCache(20);
            }
            // Only upload to Firebase Storage for default language (not translated versions)
            const shouldUploadToStorage = !isMultiLangStory || lang === 'English';
            (shouldUploadToStorage ? cacheAudioToStorage(current.id, blob, current.text) : Promise.resolve()).then(() => {
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
        setTtsReady(true); // unblock UI so user sees the story text at least
        narrator.setError?.(e.message || 'Audio generation failed. You can still read the story.');
      }
    };

    startPlayback();
    return () => {
      // Clear language override when leaving this story
      if (!isMultiLangStory) {
        try { sessionStorage.removeItem('mst:player-lang'); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, langOverride]);

  // Translate story text when language changes
  useEffect(() => {
    if (!langOverride || langOverride === 'English' || !current?.text) {
      setTranslatedText(null);
      return;
    }
    let cancelled = false;
    setTranslating(true);
    (async () => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: current.text, language: langOverride }),
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.translated) setTranslatedText(data.translated);
        }
      } catch (e) {
        console.warn('Translation failed:', e.message);
      }
      if (!cancelled) setTranslating(false);
    })();
    return () => { cancelled = true; };
  }, [langOverride, current?.id]);

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
      const { trackShareStory } = await import('../utils/analytics.js');
      trackShareStory(current?.id);

      // Always use /api/share — returns OG tags for all stories (hardcoded, published, creator)
      const storyId = current?.episodeId || current?.id?.replace('lesson_', '') || current?.id;
      const url = `https://mysleepytale.com/api/share?id=${storyId}`;

      // Also save to Firestore for user-generated stories (so share API can find them)
      if (!current?.isWisdom && !current?.seriesId) {
        try {
          const { shareStoryToFirestore } = await import('../utils/shareStory.js');
          await shareStoryToFirestore(current, { beliefs: profile?.beliefs || [], country: profile?.country || '' });
        } catch {}
      }
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

  // When story ends, show reflection → share card → feedback (or next episode for series)
  const [showReflection, setShowReflection] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalized, setPersonalized] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nextSeriesEpisode, setNextSeriesEpisode] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [showSignupNudge, setShowSignupNudge] = useState(false);

  useEffect(() => {
    if (!current || !ttsReady) return;
    // Only mark done when audio has truly ended (not just paused near end)
    const audioElement = globalAudioRef?.current;
    const audioActuallyEnded = audioElement ? audioElement.ended : false;
    const ended = progress >= 0.99 && !narrator.playing && !narrator.loading && audioActuallyEnded;
    if (ended && !done) {
      setDone(true);
      setIsPlaying(false);
      recordPlay(); // increment learning streak
      // Log to play history for badge system
      try {
        const history = JSON.parse(localStorage.getItem('mst:playHistory') || '[]');
        history.push({ id: current?.id, tradition: current?.tradition, ts: Date.now() });
        if (history.length > 500) history.splice(0, history.length - 500); // keep last 500
        localStorage.setItem('mst:playHistory', JSON.stringify(history));
      } catch {}
      // Mark series episode complete if applicable
      if (current?.seriesId && current?.episodeId) {
        markEpisodeComplete(current.seriesId, current.episodeId);
      }
      // Record play in Firestore (server-side tracking)
      import('../utils/playTracker.js').then(({ recordStoryPlay }) => recordStoryPlay(current)).catch(() => {});
      import('../utils/analytics.js').then(({ trackAudioCompleted }) => trackAudioCompleted(current?.id, current?.estimatedMinutes)).catch(() => {});

      // Sleep mode → auto-play next story
      if (sleepMode) {
        setTimeout(() => playNext(), 2000); // 2 sec pause between stories
        return;
      }

      // Series episode → show next episode prompt (+ signup nudge for guests)
      if (current?.seriesId) {
        const seriesData = SERIES.find(s => s.id === current.seriesId);
        const currentIdx = seriesData?.episodes.findIndex(e => e.id === current.episodeId);
        const nextEp = seriesData?.episodes[currentIdx + 1];
        if (nextEp) {
          // Guest on series → show signup nudge first, then next episode
          if (!user) {
            setTimeout(() => setShowSignupNudge(true), 800);
          } else {
            setTimeout(() => setNextSeriesEpisode(nextEp), 800);
          }
          return;
        }
      }
      // Guest → show signup nudge instead of reflection
      if (!user) {
        setTimeout(() => setShowSignupNudge(true), 800);
        return;
      }
      setTimeout(() => setShowReflection(true), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, narrator.playing, narrator.loading, ttsReady, done]);

  const submitFeedback = async (rating) => {
    setFeedbackRating(rating);
    try {
      const { db: fireDb } = await import('../lib/firebase.js');
      const { auth: fireAuth } = await import('../lib/firebase.js');
      if (!fireDb) return;
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(fireDb, 'voiceFeedback'), {
        storyId: current?.id || '',
        storyTitle: current?.title || '',
        voice: current?.voice || 'AI Narrator',
        tradition: current?.tradition || '',
        language: current?.language || 'English',
        country: profile?.country || '',
        beliefs: profile?.beliefs || [],
        rating,
        uid: fireAuth?.currentUser?.uid || '',
        createdAt: new Date().toISOString(),
      });
    } catch {}
    // Go home after a short pause
    setTimeout(() => {
      narrator.stop();
      navigate('/');
    }, 1200);
  };

  const skipFeedback = () => {
    narrator.stop();
    navigate('/');
  };

  // Recover story on page refresh only
  const recoveredRef = useRef(false);
  useEffect(() => {
    if (current || recoveredRef.current) return;
    recoveredRef.current = true;

    // Try localStorage
    const recovered = reloadLast();
    if (recovered) return;

    // If URL has storyId, try loading from data
    const urlStoryId = new URLSearchParams(window.location.search).get('storyId');
    if (!urlStoryId) return;

    (async () => {
      try {
        // Hardcoded series
        const { SERIES } = await import('../data/series.js');
        for (const s of SERIES) {
          const ep = (s.episodes || []).find(e => e.id === urlStoryId);
          if (ep?.body) {
            load({ id: ep.id, title: ep.title, text: ep.body, subtitle: ep.subtitle, tradition: ep.tradition, value: ep.theme || ep.value, source: ep.source, seriesId: s.id, episodeId: ep.id, episodeNumber: ep.episodeNumber, isWisdom: true, coverImage: ep.coverImage || null, gallery: ep.gallery || [], estimatedMinutes: ep.durationMinutes, multilingual: ep.multilingual || false, enableTranslation: ep.enableTranslation || false });
            return;
          }
        }
        // Hardcoded wisdom
        const { CULTURAL_LESSONS } = await import('../data/culturalLessons.js');
        const lid = urlStoryId.replace('lesson_', '');
        const lesson = CULTURAL_LESSONS.find(l => l?.id === lid || l?.id === urlStoryId);
        if (lesson?.body) {
          load({ id: lesson.id, title: lesson.title, text: lesson.body, tradition: lesson.tradition, value: lesson.value, source: lesson.source, isWisdom: true, estimatedMinutes: lesson.durationMinutes });
          return;
        }
        // Firestore
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'publishedContent', urlStoryId));
        if (snap.exists()) {
          const pub = snap.data();
          load({ id: pub.id, title: pub.title, text: pub.body, subtitle: pub.subtitle, tradition: pub.tradition, value: pub.theme, source: pub.source, audioUrl: pub.audioUrl || null, coverImage: pub.coverImage, gallery: (pub.images || []).slice(1), estimatedMinutes: pub.durationMinutes, seriesId: pub.seriesId || null, multilingual: pub.multilingual || false, enableTranslation: pub.enableTranslation || false });
        }
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Two-phase overlay:
  // Phase 1: no story text yet → full overlay (70%)
  // Phase 2: text arrived, audio generating → light overlay (30%), text readable
  // Done: audio ready → overlay gone
  const noStoryYet = !current;
  const audioGenerating = current && !ttsReady && !narrator.playing;
  const showOverlay = noStoryYet; // only block screen when NO story text yet
  const overlayPhase = noStoryYet ? 'generating' : 'done';
  const meta = valueMeta(current?.value);

  // Fetch published flags (multilingual, etc.) from Firestore — runs for all stories
  const [publishedFlags, setPublishedFlags] = useState(null);
  useEffect(() => {
    if (!current?.id) return;
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'publishedContent', current.id));
        if (snap.exists()) {
          const d = snap.data();
          setPublishedFlags({ multilingual: d.multilingual, enableTranslation: d.enableTranslation });
        }
      } catch {}
    })();
  }, [current?.id]);

  // Check Firestore publishedContent if current story has no text
  const [checkedPublished, setCheckedPublished] = useState(false);
  useEffect(() => {
    if (!current || current.text || checkedPublished) return;
    setCheckedPublished(true);
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'publishedContent', current.id));
        if (snap.exists()) {
          const pub = snap.data();
          load({
            ...current,
            text: pub.body,
            title: pub.title,
            subtitle: pub.subtitle,
            tradition: pub.tradition,
            value: pub.theme,
            source: pub.source,
            audioUrl: pub.audioUrl || current.audioUrl,
            coverImage: pub.coverImage,
            gallery: (pub.images || []).slice(1),
            estimatedMinutes: pub.durationMinutes,
          });
        }
      } catch {}
    })();
  }, [current, checkedPublished, load]);

  // Stories without text — wait for publishedContent check before showing error
  const [loadTimeout, setLoadTimeout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoadTimeout(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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
    try { window.speechSynthesis?.cancel(); } catch {}
    const seriesId = current?.seriesId;
    clear();
    // Go back to series page if episode belongs to a series, otherwise home
    navigate(seriesId ? `/series/${seriesId}` : '/');
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

  // Resolve the best image for this story
  const lessonKey = current?.id?.startsWith('lesson_') ? current.id.slice(7) : '';
  const storyArtData = current?.id ? getStoryArt(lessonKey) : null;
  const bgImage = current?.coverImage || wisdomImageUrls[lessonKey] || storyArtData?.image || getGenericStoryImage(current?.id);

  // === All hooks are above this line. Conditional returns below. ===

  // Loading states
  if (current && !current.text && !current.audioUrl) {
    if (!loadTimeout) {
      return (<div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center"><div className="text-3xl mb-3 animate-pulse">🌙</div><p className="text-sm text-ink-muted">Loading story...</p></div>);
    }
    return (<div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center"><div className="text-4xl mb-4">😔</div><h1 className="font-display text-xl font-bold text-gold">{current.title || 'Story'}</h1><p className="mt-2 text-sm text-ink-muted">This story doesn't have any content to play.</p><button onClick={() => { clear(); navigate('/'); }} className="btn-primary mt-6">{t('player.backToHome')}</button></div>);
  }

  if (!current) {
    const urlStoryId = new URLSearchParams(window.location.search).get('storyId');
    if (!urlStoryId && loadTimeout) { navigate('/'); return null; }
    if (!loadTimeout) {
      return (<div className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center"><div className="text-3xl mb-3 animate-pulse">🌙</div><p className="text-sm text-ink-muted">Loading story...</p></div>);
    }
  }

  const isGenerating = !current;

  // Sleep Mode — full black screen with minimal controls
  if (sleepMode) {
    return (
      <div className="absolute inset-0 z-50 bg-black flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Black screen — tap anywhere does nothing (kid-proof) */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="text-center select-none"
          >
            <span className="text-6xl">🌙</span>
          </motion.div>
        </div>

        {/* Minimal controls at bottom */}
        <div className="safe-bottom px-6 pb-6">
          {/* Progress bar */}
          <div className="mb-4">
            {narrator.duration > 0 && (
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-white/30 rounded-full transition-all" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
              </div>
            )}
          </div>

          {/* Transport controls */}
          <div className="flex items-center justify-center gap-8 mb-4">
            {/* Rewind 15s */}
            <button onClick={() => { if (narrator.audio) narrator.audio.currentTime = Math.max(0, narrator.audio.currentTime - 15); }}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/5 text-white/50 active:scale-90 transition">
              <RotateCcw size={18} />
            </button>

            {/* Play/Pause/Loading */}
            <button onClick={ttsReady ? handleTogglePlay : undefined}
              disabled={!ttsReady}
              className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-white active:scale-90 transition disabled:opacity-50">
              {!ttsReady ? <Loader2 size={24} className="animate-spin" /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Next story/episode */}
            <button onClick={playNext}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/5 text-white/50 active:scale-90 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5v14l11-7L5 5z"/><rect x="17" y="5" width="2" height="14" rx="1"/></svg>
            </button>
          </div>

          {/* Story title + exit */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-white/30 truncate">{current?.title}</p>
            </div>
            <button onClick={() => setSleepMode(false)}
              className="text-[10px] font-bold text-white/20 px-3 py-1.5 rounded-full bg-white/5 active:bg-white/10 transition">
              Exit Sleep Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 overflow-hidden bg-bg-base" style={{ touchAction: 'pan-y' }}>
      {/* Dreamy blurred background image */}
      {/* Aurora/starfield always present as base, image overlays when available */}
      <div className="aurora" />
      <div className="starfield" />
      {bgImage && (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: isDay ? 'blur(40px) saturate(1.2) brightness(1.1)' : 'blur(40px) saturate(1.4) brightness(0.35)', transform: 'scale(1.2)' }} onError={(e) => { e.target.style.display = 'none'; }} />
          <div className={`absolute inset-0 ${isDay ? 'bg-gradient-to-b from-white/60 via-white/70 to-white/85' : 'bg-gradient-to-b from-black/40 via-black/60 to-black/80'}`} />
        </>
      )}

      {/* Two-phase overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 pointer-events-none"
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              data-theme="night"
              style={{ backgroundColor: 'rgba(10,10,15,0.90)', backdropFilter: 'blur(12px)' }}
            >
              <StoryLoading />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col overflow-hidden px-5 pt-4 pb-6 safe-top safe-bottom"
          >
            {/* Top bar — minimal */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => navigate(current?.seriesId ? `/series/${current.seriesId}` : '/')}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-ink-muted transition hover:text-ink active:scale-95"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSleepMode(true)}
                  className="flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1.5 text-[10px] font-bold text-purple-400 transition hover:bg-purple-500/20 active:scale-95"
                >
                  🌙 Sleep
                </button>
                <button
                  onClick={() => setShowInlineFeedback(true)}
                  className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1.5 text-[10px] font-bold text-gold transition hover:bg-gold/20 active:scale-95"
                >
                  💬
                </button>
                <button onClick={shareStory} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-ink-muted transition hover:text-ink active:scale-95">
                  <Share2 size={15} />
                </button>
                <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-ink-dim transition hover:text-ink active:scale-95">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Inline feedback overlay */}
            <AnimatePresence>
              {showInlineFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-x-4 top-16 z-50 rounded-2xl bg-bg-elevated ring-1 ring-gold/20 p-5 shadow-lift"
                >
                  {feedbackSent ? (
                    <div className="text-center py-4">
                      <p className="text-2xl mb-2">💛</p>
                      <p className="text-sm font-bold text-ink">Thank you!</p>
                      <p className="text-xs text-ink-muted mt-1">Your feedback helps us make better stories.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-ink">💬 Quick Feedback</h3>
                        <button onClick={() => setShowInlineFeedback(false)} className="text-ink-dim text-xs">✕</button>
                      </div>
                      <p className="text-[10px] text-ink-muted mb-2">
                        About: <span className="text-gold">{current?.title}</span>
                      </p>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="What did you think? Too long? Too short? Loved it? Any changes?"
                        className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-y min-h-[80px] max-h-[200px] placeholder:text-ink-dim"
                        autoFocus
                      />
                      <button
                        onClick={async () => {
                          if (!feedbackText.trim()) return;
                          try {
                            const { db: fireDb, auth: fireAuth } = await import('../lib/firebase.js');
                            if (fireDb) {
                              const { collection, addDoc } = await import('firebase/firestore');
                              await addDoc(collection(fireDb, 'feedback'), {
                                storyId: current?.id || '',
                                storyTitle: current?.title || '',
                                seriesId: current?.seriesId || '',
                                text: feedbackText.trim(),
                                uid: fireAuth?.currentUser?.uid || '',
                                email: fireAuth?.currentUser?.email || '',
                                source: 'player',
                                createdAt: new Date().toISOString(),
                              });
                            }
                          } catch {}
                          setFeedbackSent(true);
                          setTimeout(() => { setShowInlineFeedback(false); setFeedbackSent(false); setFeedbackText(''); }, 2000);
                        }}
                        disabled={!feedbackText.trim()}
                        className="w-full mt-3 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-40"
                      >
                        Send Feedback
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title + meta — centered (or generating message) */}
            <div className="mb-3 text-center">
              {isGenerating ? (
                <>
                  {waitTimeout ? (
                    <>
                      <div className="text-4xl mb-2">😔</div>
                      <h1 className="text-xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>Story took too long</h1>
                      <p className="mt-1 text-xs text-ink-muted">The server might be busy.</p>
                      <button onClick={() => navigate(-1)} className="btn-primary mt-4 px-6 py-2 text-sm">Go Back</button>
                    </>
                  ) : (
                    <>
                      <div className="mb-3 inline-block h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                      <h1 className="text-xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>Creating your story...</h1>
                      <p className="mt-1 text-xs text-ink-muted">
                        Writing a bedtime story for {profile?.childName || 'you'}. ~20 seconds.
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-ink-dim">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        Weaving magic...
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-lg sm:text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                    {current?.title || 'Bedtime Story'}
                  </h1>
                  <p className="mt-1 text-xs text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    For {profile?.childName}{current?.text ? ` · ${Math.max(1, Math.round(current.text.split(/\s+/).length / 150))} min` : ''}
                  </p>
              {/* Language selector — for multilingual stories and FIFA series */}
              {(() => {
                const storyId = current?.id || '';
                const isMultilingual = storyId === 'multilingual_lion_mouse' || storyId === 'lesson_multilingual_lion_mouse';
                const isFifa = storyId.includes('fifa26') || storyId.includes('lesson_fifa26');
                const isPublished = current?.multilingual || current?.enableTranslation || publishedFlags?.multilingual;
                if (!isMultilingual && !isFifa && !isPublished) return null;

                const languages = isMultilingual
                  ? [['English','🇬🇧'],['French','🇫🇷'],['Hindi','🇮🇳'],['Arabic','🇸🇦'],['Spanish','🇪🇸'],['Chinese','🇨🇳'],['Polish','🇵🇱'],['Hungarian','🇭🇺'],['Tamil','🇮🇳']]
                  : [['English','🇬🇧'],['Spanish','🇪🇸'],['French','🇫🇷'],['Hindi','🇮🇳'],['Arabic','🇸🇦'],['Tamil','🇮🇳'],['Hungarian','🇭🇺']];

                return (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">🌍 Language:</span>
                    <select
                      value={langOverride || 'English'}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        // Don't regenerate if same language as current audio
                        if (newLang === audioLangRef.current) { setLangOverride(newLang); return; }
                        narrator.stop();
                        document.querySelectorAll('audio').forEach(a => { try { a.pause(); a.src = ''; } catch {} });
                        setTtsReady(false);
                        setIsPlaying(false);
                        startedRef.current = false;
                        setLangOverride(newLang);
                        try { sessionStorage.setItem('mst:player-lang', newLang); } catch {}
                      }}
                      className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-bold text-gold ring-1 ring-white/10 outline-none cursor-pointer"
                    >
                      {languages.map(([lang, flag]) => (
                        <option key={lang} value={lang}>{flag} {lang}</option>
                      ))}
                    </select>
                  </div>
                );
              })()}
              {current?.cast?.length > 0 && (
                <p className="mt-0.5 text-[10px] text-gold/70">{current.cast.join(' · ')}</p>
              )}
              {/* Series badge — shows which series this episode belongs to */}
              {(() => {
                const seriesData = current?.seriesId ? SERIES.find(s => s.id === current.seriesId) : null;
                const epNum = seriesData?.episodes.findIndex(e => e.id === current?.episodeId) + 1;
                return seriesData ? (
                  <button
                    onClick={() => navigate(`/series/${seriesData.id}`)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 ring-1 ring-white/10 transition active:scale-95"
                  >
                    <span className="text-xs">{seriesData.icon}</span>
                    <span className="text-[10px] font-bold text-gold">{seriesData.title}</span>
                    <span className="text-[10px] text-ink-muted">Ep {epNum}/{seriesData.totalEpisodes}</span>
                    <span className="text-[10px] text-ink-dim">→</span>
                  </button>
                ) : null;
              })()}
                </>
              )}
            </div>

            {/* Story text — always visible, scrolls in sync */}
            {/* Photo gallery — swipe through story images */}
            <StoryGallery
              storyId={current?.id?.startsWith('lesson_') ? current.id.slice(7) : current?.id}
              coverImage={current?.coverImage || wisdomImageUrls[current?.id?.startsWith('lesson_') ? current.id.slice(7) : current?.id]}
              extraImages={current?.gallery || []}
            />

            {current?.text && langOverride && langOverride !== 'English' ? (
              translating ? (
                <div className={`mt-4 rounded-2xl p-6 text-center ${isDay ? 'bg-white/60 ring-1 ring-black/10' : 'bg-black/30 ring-1 ring-white/5'}`}>
                  <p className="text-2xl mb-2">🌍</p>
                  <p className="text-sm font-bold text-ink">Translating to {langOverride}...</p>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
              ) : translatedText ? (
                <HighlightedText text={translatedText} progress={progress} isDay={isDay} />
              ) : (
                <div className={`mt-4 rounded-2xl p-6 text-center ${isDay ? 'bg-white/60 ring-1 ring-black/10' : 'bg-black/30 ring-1 ring-white/5'}`}>
                  <p className="text-2xl mb-2">🌍</p>
                  <p className="text-sm font-bold text-ink">Listening in {langOverride}</p>
                  <p className="text-xs text-ink-muted mt-1">Close your eyes and enjoy the story.</p>
                </div>
              )
            ) : current?.text && (() => {
              const stId = current.id || '';
              const isML = stId.includes('multilingual') || stId.includes('fifa26');
              const childName = profile?.childName;
              const displayText = (isML && childName && childName !== 'little one')
                ? current.text.replace(new RegExp(childName, 'g'), 'little one')
                : current.text;
              return <HighlightedText text={displayText} progress={progress} isDay={isDay} />;
            })()}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Preparing voice indicator — shown when text is ready but audio still loading */}
            {audioGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 mb-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 ring-1 ${isDay ? 'bg-gold/15 ring-gold/30' : 'bg-gold/10 ring-gold/20'}`}
              >
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <span className="text-[11px] font-bold text-gold">Preparing voice… read the story while you wait</span>
              </motion.div>
            )}

            {/* Progress bar — tappable + draggable to seek */}
            <div className="mt-4">
              <div
                className="relative h-10 w-full cursor-pointer flex items-center"
                style={{ touchAction: 'none' }}
                onClick={(e) => {
                  if (!ttsReady) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  narrator.seek(fraction);
                }}
                onMouseDown={(e) => {
                  if (!ttsReady) return;
                  e.preventDefault();
                  const bar = e.currentTarget;
                  const seek = (ev) => {
                    const rect = bar.getBoundingClientRect();
                    narrator.seek(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)));
                  };
                  seek(e);
                  const onMove = (ev) => { ev.preventDefault(); seek(ev); };
                  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
                onTouchStart={(e) => {
                  if (!ttsReady) return;
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                  narrator.seek(fraction);
                }}
                onTouchMove={(e) => {
                  if (!ttsReady) return;
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                  narrator.seek(fraction);
                }}
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gold pointer-events-none rounded-full will-change-[width]"
                    style={{ width: `${(progress * 100).toFixed(2)}%`, transition: 'width 0.25s linear' }}
                  />
                </div>
                {/* Seek thumb */}
                {ttsReady && (
                  <div
                    className="absolute h-4 w-4 rounded-full bg-gold shadow-glow pointer-events-none will-change-transform"
                    style={{ left: `${(progress * 100).toFixed(2)}%`, transform: 'translateX(-50%)', transition: 'left 0.25s linear' }}
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
                  aria-label={narrator.loading ? t('player.loading') : isPlaying ? t('player.pause') : t('player.play')}
                  className={`group relative grid h-20 w-20 place-items-center rounded-full transition active:scale-95 ${
                    narrator.loading
                      ? 'bg-bg-elevated ring-2 ring-gold/30'
                      : 'bg-gold text-bg-base shadow-glow'
                  }`}
                >
                  {narrator.loading ? (
                    <Loader2 size={24} className="animate-spin text-gold" />
                  ) : isPlaying ? (
                    <Pause size={28} fill="currentColor" />
                  ) : (
                    <Play size={28} fill="currentColor" className="ml-1" />
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
              {/* Secondary controls — inline row */}
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSpeedChange(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-gold ring-1 ring-white/10 transition active:scale-95"
                >
                  {speed}x
                </button>

                <button
                  onClick={() => {
                    const audio = narrator.audioRef?.current;
                    if (audio) { audio.currentTime = 0; audio.volume = 1; audio.play().catch(() => {}); }
                    setIsPlaying(true);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-ink-muted ring-1 ring-white/10 transition active:scale-95"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Personalize with child's name — Pro feature */}
              {profile?.childName && profile.childName !== 'little one' && current?.text?.includes(profile.childName) && !personalized && (
                <div className="mt-4 flex justify-center">
                  {canPersonalize(profile?.tier) ? (
                    <button
                      disabled={personalizing}
                      onClick={async () => {
                        setPersonalizing(true);
                        try {
                          // Stop current audio
                          narrator.stop();
                          // Generate personalized TTS
                          const audio = await narrator.generate({
                            text: current.text,
                            narrator: narratorName,
                            language: lang,
                            customVoiceId,
                            country: profile?.country || 'OTHER',
                            beliefs: profile?.beliefs || [],
                          });
                          if (audio) {
                            setAudio(audio);
                            audio.playbackRate = speed;
                            audio.onplay = () => setIsPlaying(true);
                            audio.onpause = () => setIsPlaying(false);
                            await audio.play();
                            // Cache with child-name key
                            const blob = narrator.getBlob();
                            if (blob && current.id) {
                              setCachedAudio(`${current.id}_${profile.childName}`, blob, textHash(current.text));
                              pruneAudioCache(20);
                            }
                            recordPersonalized();
                            setPersonalized(true);
                          }
                        } catch (e) {
                          alert('Personalization failed: ' + e.message);
                        }
                        setPersonalizing(false);
                      }}
                      className="rounded-full bg-gold/20 px-5 py-2 text-[11px] font-bold text-gold ring-1 ring-gold/30 transition active:scale-95 disabled:opacity-50"
                    >
                      {personalizing ? '✨ Generating...' : `✨ Personalize for ${profile.childName} (${personalizedToday()}/${personalizeLimit(profile?.tier)} today)`}
                    </button>
                  ) : profile?.tier === 'free' ? (
                    <button
                      onClick={() => navigate('/settings')}
                      className="rounded-full bg-gold/10 px-5 py-2 text-[11px] font-bold text-gold/60 ring-1 ring-gold/20 transition active:scale-95"
                    >
                      🔒 Personalize for {profile.childName} — Pro feature
                    </button>
                  ) : (
                    <span className="text-[10px] text-gold/50">
                      ✨ Personalization limit reached ({personalizeLimit(profile?.tier)}/day)
                    </span>
                  )}
                </div>
              )}
            </div>


          </motion.div>
      </AnimatePresence>

      {/* Episode complete — share + next episode (series only) */}
      <AnimatePresence>
        {nextSeriesEpisode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-3xl bg-bg-elevated p-5 text-center shadow-lift ring-1 ring-white/10"
            >
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Episode Complete!</h3>

              {/* Share this episode */}
              <p className="mt-3 mb-2 text-[11px] text-ink-muted">Share this episode</p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setNextSeriesEpisode(null); setShowShareCard(true); }}
                className="w-full rounded-2xl bg-white/8 py-3 text-sm font-bold text-gold ring-1 ring-white/10 transition"
              >
                Share with friends & family
              </motion.button>

              {/* Divider */}
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-ink-dim">UP NEXT</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Next episode preview */}
              <p className="text-sm font-bold text-gold">Ep {nextSeriesEpisode.episodeNumber}: {nextSeriesEpisode.title}</p>
              <p className="mt-1 text-[10px] text-ink-muted line-clamp-2">{nextSeriesEpisode.subtitle}</p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const ep = nextSeriesEpisode;
                  const sid = current?.seriesId;
                  const audioUrl = wisdomAudioUrls[ep.id];
                  narrator.stop();
                  document.querySelectorAll('audio').forEach(a => { a.pause(); a.src = ''; });
                  setNextSeriesEpisode(null);
                  setDone(false);
                  setTtsReady(false);
                  setShowReflection(false);
                  setShowShareCard(false);
                  setShowFeedback(false);
                  startedRef.current = false;
                  const filledText = fillTokens(ep.body || '', user ? profile : null);
                  load({
                    id: ep.id, title: ep.title, text: filledText,
                    wordCount: filledText.split(/\s+/).length,
                    estimatedMinutes: ep.durationMinutes, value: ep.value || 'courage',
                    language: profile?.language || 'English', voice: 'AI Narrator',
                    tradition: ep.tradition, source: ep.source,
                    createdAt: new Date().toISOString(), isWisdom: true,
                    seriesId: sid, episodeId: ep.id,
                    audioUrl,
                  });
                }}
                className="mt-3 w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow"
              >
                ▶ {t('player.playNext')}
              </motion.button>
              <button onClick={() => { setNextSeriesEpisode(null); narrator.stop(); navigate('/'); }}
                className="mt-3 text-[11px] text-ink-dim">
                {t('player.backToHome')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-story reflection */}
      <AnimatePresence>
        {showReflection && current && (
          <PostStoryReflection
            story={current}
            onComplete={() => {
              setShowReflection(false);
              // Show share card once per day
              const today = new Date().toISOString().slice(0, 10);
              const lastSharePrompt = localStorage.getItem('mst:lastSharePrompt') || '';
              if (lastSharePrompt !== today) {
                localStorage.setItem('mst:lastSharePrompt', today);
                setShowShareCard(true);
              } else {
                narrator.stop();
                navigate('/');
              }
            }}
            onDefer={() => {
              narrator.stop();
              navigate('/');
            }}
          />
        )}
      </AnimatePresence>

      {/* Signup nudge for guests — after story ends */}
      <AnimatePresence>
        {showSignupNudge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-3xl bg-bg-elevated p-6 text-center shadow-lift ring-1 ring-white/10"
            >
              <div className="text-4xl mb-3">🌙</div>
              <h3 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                Loved it?
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Imagine hearing <span className="text-gold font-bold">your child's name</span> in every story — their friends, their pet, their real adventures turned into bedtime magic.
              </p>
              <p className="mt-2 text-xs text-ink-dim">
                Sign up free and we will personalize every story just for your little one.
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowSignupNudge(false); narrator.stop(); navigate('/login'); }}
                className="mt-5 w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow"
              >
                Sign up free — personalize for my child
              </motion.button>

              {/* If series has next episode, show continue option */}
              {(() => {
                if (!current?.seriesId) return null;
                const seriesData = SERIES.find(s => s.id === current.seriesId);
                const currentIdx = seriesData?.episodes.findIndex(e => e.id === current.episodeId);
                const nextEp = seriesData?.episodes[currentIdx + 1];
                if (!nextEp) return null;
                return (
                  <button
                    onClick={() => {
                      setShowSignupNudge(false);
                      setNextSeriesEpisode(nextEp);
                    }}
                    className="mt-3 w-full rounded-xl bg-white/5 py-3 text-xs font-bold text-gold ring-1 ring-white/10"
                  >
                    ▶ Play next: Ep {nextEp.episodeNumber} — {nextEp.title}
                  </button>
                );
              })()}

              <button
                onClick={() => { setShowSignupNudge(false); narrator.stop(); navigate('/'); }}
                className="mt-3 text-[11px] text-ink-dim"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share card — only opened manually via share button, not auto after story */}
      <ShareCardSheet
        open={showShareCard}
        onClose={() => { setShowShareCard(false); narrator.stop(); navigate(current?.seriesId ? `/series/${current.seriesId}` : '/'); }}
        story={current}
      />

      {/* Voice feedback removed — was annoying after every story */}
    </div>
  );
}

function HighlightedText({ text, progress, isDay }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  // Split text into lines (paragraphs/sentences)
  const lines = (text || '').split('\n').filter(l => l.trim());
  const totalChars = text.length;
  const adjusted = Math.min(1, progress);

  // Figure out which line is currently being spoken
  let charsSoFar = 0;
  let activeLine = 0;
  for (let i = 0; i < lines.length; i++) {
    charsSoFar += lines[i].length + 1; // +1 for newline
    if (charsSoFar / totalChars > adjusted) {
      activeLine = i;
      break;
    }
    if (i === lines.length - 1) activeLine = i;
  }

  // Auto-scroll to keep active line visible
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      if (activeRect.top > containerRect.bottom - 80 || activeRect.bottom < containerRect.top + 20) {
        const scrollTarget = active.offsetTop - container.offsetTop - container.clientHeight / 3;
        container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }
  }, [activeLine]);

  return (
    <div ref={containerRef} className={`mt-4 max-h-[40vh] overflow-y-auto rounded-2xl p-3 sm:p-4 font-story text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.9] ring-1 ${isDay ? 'bg-white/60 ring-black/10' : 'bg-black/30 ring-white/5'}`}>
      {lines.map((line, i) => {
        const isPast = i < activeLine;
        const isActive = i === activeLine;
        const isFuture = i > activeLine;

        return (
          <p
            key={i}
            ref={isActive ? activeRef : null}
            className={`mb-3 rounded-lg px-2 py-1 transition-all duration-500 ${
              isActive
                ? 'bg-gold/10 text-ink font-medium ring-2 ring-gold'
                : isPast
                  ? 'text-ink/70'
                  : 'text-ink-muted/40'
            }`}
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

