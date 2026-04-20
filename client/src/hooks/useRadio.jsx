import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Global radio context — single <audio> element shared across the app.
// Lets a station keep playing as the user navigates between tabs.
const RadioCtx = createContext(null);

export function RadioProvider({ children }) {
  const audioRef = useRef(null);
  const [stationId, setStationId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolumeState] = useState(0.7);

  // Lazy-create the audio element
  useEffect(() => {
    if (!audioRef.current && typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none';
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.volume = volume;

      audioRef.current.onplaying = () => {
        setPlaying(true);
        setLoading(false);
        setError(null);
      };
      audioRef.current.onpause = () => setPlaying(false);
      audioRef.current.onwaiting = () => setLoading(true);
      audioRef.current.onerror = () => {
        setError("This stream isn't responding right now.");
        setLoading(false);
        setPlaying(false);
      };
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback((station) => {
    if (!audioRef.current) return;
    setError(null);
    setLoading(true);
    setStationId(station.id);
    audioRef.current.src = station.stream;
    const promise = audioRef.current.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        // Try fallback if defined
        if (station.fallback) {
          audioRef.current.src = station.fallback;
          audioRef.current.play().catch(() => {
            setError("This stream isn't responding right now.");
            setLoading(false);
          });
        } else {
          setError("This stream isn't responding right now.");
          setLoading(false);
        }
      });
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {
      setError("Couldn't resume playback.");
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setStationId(null);
    setPlaying(false);
    setLoading(false);
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const togglePlayPause = useCallback(
    (station) => {
      if (stationId === station.id && playing) {
        pause();
      } else if (stationId === station.id && !playing) {
        resume();
      } else {
        play(station);
        import('../utils/analytics.js').then(({ trackRadioPlay }) => trackRadioPlay(station.id)).catch(() => {});
      }
    },
    [stationId, playing, play, pause, resume]
  );

  return createElement(
    RadioCtx.Provider,
    {
      value: {
        stationId,
        playing,
        loading,
        error,
        volume,
        setVolume,
        play,
        pause,
        resume,
        stop,
        togglePlayPause,
      },
    },
    children
  );
}

export function useRadio() {
  const ctx = useContext(RadioCtx);
  if (!ctx) throw new Error('useRadio must be used inside RadioProvider');
  return ctx;
}
