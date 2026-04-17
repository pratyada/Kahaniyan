import { useCallback, useRef, useState } from 'react';

// Narrator voice hook — calls /api/tts (OpenAI TTS), returns an <audio>
// element that plays the streamed MP3. Supports cached audio URLs to
// skip TTS generation for previously played or shared stories.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
    setPlaying(false);
    setProgress(0);
    setLoading(false);
  }, []);

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
    audio.onplay = () => setPlaying(true);
    audio.onpause = () => setPlaying(false);
    audio.onended = () => { setPlaying(false); setProgress(1); };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && audio.paused && !audio.ended && audio.currentTime > 0) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    audio._cleanupVisibility = () => document.removeEventListener('visibilitychange', handleVisibility);
    audio.onerror = () => { setError('Audio playback failed'); setPlaying(false); };

    return audio;
  }, []);

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
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      setupAudio(audio);
      setLoading(false);
      return audio;
    } catch (e) {
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

  const play = useCallback(() => { audioRef.current?.play(); }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); }, []);
  const resume = useCallback(() => { audioRef.current?.play(); }, []);
  const stop = useCallback(() => { cleanup(); }, [cleanup]);

  const seek = useCallback((fraction) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = fraction * audioRef.current.duration;
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
