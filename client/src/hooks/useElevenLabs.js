import { useCallback, useRef, useState } from 'react';

// ElevenLabs TTS hook — calls /api/tts, returns an <audio> element
// that plays the streamed MP3. Falls back gracefully if TTS fails.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useElevenLabs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const urlRef = useRef(null);
  const knownDurationRef = useRef(0);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current._cleanupVisibility) audioRef.current._cleanupVisibility();
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPlaying(false);
    setProgress(0);
  }, []);

  const generate = useCallback(async ({ text, narrator, language, customVoiceId, country, beliefs }) => {
    cleanup();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, narrator, language, customVoiceId, country, beliefs }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `TTS failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      // Set up event listeners
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
          // Fade out volume in the last 2 seconds
          const remaining = dur - audio.currentTime;
          if (remaining < 2 && remaining > 0) {
            audio.volume = Math.max(0, remaining / 2);
          }
        }
      };
      audio.onplay = () => setPlaying(true);
      audio.onpause = () => {
        // Don't mark as not-playing if browser just suspended audio in background
        // Only set false if audio is truly paused (not ended, not mid-playback)
        if (audio.ended || audio.currentTime === 0) {
          setPlaying(false);
        } else {
          // Might be background suspension — keep state, try to resume on visibility change
          setPlaying(false);
        }
      };
      audio.onended = () => {
        setPlaying(false);
        setProgress(1);
      };

      // Resume audio when app comes back to foreground
      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && audio.paused && !audio.ended && audio.currentTime > 0) {
          audio.play().catch(() => {});
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      audio._cleanupVisibility = () => document.removeEventListener('visibilitychange', handleVisibility);
      audio.onerror = () => {
        setError('Audio playback failed');
        setPlaying(false);
      };

      setLoading(false);
      return audio;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, [cleanup]);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

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
