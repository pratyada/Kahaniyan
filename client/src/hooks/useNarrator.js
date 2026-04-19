import { useCallback, useRef, useState } from 'react';

// Narrator voice hook — calls /api/tts (OpenAI TTS), returns an <audio>
// element that plays the streamed opus. Supports cached audio URLs to
// skip TTS generation for previously played or shared stories.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Silent audio keepalive — prevents mobile Chrome from suspending the tab
// during long TTS fetches when user backgrounds the app
function startKeepalive() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0; // completely silent
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return () => { osc.stop(); ctx.close(); };
  } catch { return () => {}; }
}

export function useNarrator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const urlRef = useRef(null);
  const knownDurationRef = useRef(0);
  const abortRef = useRef(null);
  const blobRef = useRef(null); // keep raw blob for upload
  const userPausedRef = useRef(false); // track manual pause to prevent auto-resume
  const keepaliveRef = useRef(null); // persistent keepalive for background playback

  // Persistent keepalive — keeps audio context alive in background
  const ensureKeepalive = useCallback(() => {
    if (keepaliveRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      keepaliveRef.current = { ctx, osc };
    } catch {}
  }, []);

  const stopKeepalive = useCallback(() => {
    if (keepaliveRef.current) {
      try {
        keepaliveRef.current.osc.stop();
        keepaliveRef.current.ctx.close();
      } catch {}
      keepaliveRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      if (audioRef.current._cleanupVisibility) audioRef.current._cleanupVisibility();
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    blobRef.current = null;
    stopKeepalive();
    setPlaying(false);
    setProgress(0);
    setLoading(false);
  }, [stopKeepalive]);

  // Wire up all event listeners on an audio element
  const setupAudio = useCallback((audio) => {
    audioRef.current = audio;

    const updateDuration = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        knownDurationRef.current = audio.duration;
        setDuration(audio.duration);
      }
    };
    audio.onloadedmetadata = updateDuration;
    audio.ondurationchange = updateDuration;
    audio.ontimeupdate = () => {
      const dur = knownDurationRef.current;
      if (dur > 0) {
        const p = Math.min(1, audio.currentTime / dur);
        setProgress(p);
        const remaining = dur - audio.currentTime;
        if (remaining < 2 && remaining > 0) {
          audio.volume = Math.max(0, remaining / 2);
        }
      }
    };
    audio.onplay = () => { setPlaying(true); ensureKeepalive(); };
    audio.onpause = () => setPlaying(false);
    audio.onended = () => { setPlaying(false); setProgress(1); stopKeepalive(); };

    // Do NOT auto-resume on visibility change — let the audio continue in background.
    // Only handle case where browser killed playback while backgrounded.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // If audio was playing but got interrupted by browser (not user pause), resume
        if (audio.paused && !audio.ended && audio.currentTime > 0 && !userPausedRef.current) {
          audio.play().catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    audio._cleanupVisibility = () => document.removeEventListener('visibilitychange', handleVisibility);
    audio.onerror = () => { setError('Audio playback failed'); setPlaying(false); };

    return audio;
  }, [ensureKeepalive, stopKeepalive]);

  // Load from a cached audio URL — no TTS call needed
  const loadCached = useCallback((audioUrl) => {
    cleanup();
    setLoading(true);
    setError(null);

    const audio = new Audio(audioUrl);
    setupAudio(audio);
    setLoading(false);
    return audio;
  }, [cleanup, setupAudio]);

  // Generate fresh audio via TTS API
  const generate = useCallback(async ({ text, narrator, language, customVoiceId, country, beliefs }) => {
    cleanup();
    setLoading(true);
    setError(null);

    // Keep tab alive while fetching (prevents mobile Chrome from suspending)
    const stopKeepalive = startKeepalive();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, narrator, language, customVoiceId, country, beliefs }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `TTS failed (${res.status})`);
      }

      const blob = await res.blob();
      stopKeepalive();
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      setupAudio(audio);
      setLoading(false);
      return audio;
    } catch (e) {
      stopKeepalive();
      if (e.name === 'AbortError') {
        setLoading(false);
        return null;
      }
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, [cleanup, setupAudio]);

  // Get the raw audio blob (for uploading to Storage after generation)
  const getBlob = useCallback(() => blobRef.current, []);

  const play = useCallback(() => { userPausedRef.current = false; audioRef.current?.play(); }, []);
  const pause = useCallback(() => { userPausedRef.current = true; audioRef.current?.pause(); }, []);
  const resume = useCallback(() => { userPausedRef.current = false; audioRef.current?.play(); }, []);
  const stop = useCallback(() => { cleanup(); }, [cleanup]);

  const seek = useCallback((fraction) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = fraction * audioRef.current.duration;
    }
  }, []);

  const seekBy = useCallback((seconds) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
    }
  }, []);

  const setVolume = useCallback((v) => {
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const setRate = useCallback((r) => {
    if (audioRef.current) audioRef.current.playbackRate = r;
  }, []);

  return {
    generate,
    loadCached,
    getBlob,
    play,
    pause,
    resume,
    stop,
    seek,
    seekBy,
    setVolume,
    setRate,
    loading,
    error,
    progress,
    playing,
    duration,
    audioRef,
  };
}
