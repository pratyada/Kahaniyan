import { useEffect, useRef, useState, useCallback } from 'react';
import { LANGUAGES } from '../utils/constants.js';

// Web Speech API wrapper. Free, offline, no key required.
// Falls back gracefully on browsers that don't support it (just emits text scroll).
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);
  const totalCharsRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(({ text, language = 'English', rate = 1, volume = 1 }) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const lang = LANGUAGES.find((l) => l.key === language)?.voice || 'en-US';
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1;
    u.volume = volume;

    totalCharsRef.current = text.length;

    u.onstart = () => {
      setSpeaking(true);
      setPaused(false);
      setProgress(0);
    };
    u.onboundary = (e) => {
      if (totalCharsRef.current > 0) {
        setProgress(Math.min(1, e.charIndex / totalCharsRef.current));
      }
    };
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
      setProgress(1);
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setProgress(0);
    }
  }, []);

  const setVolume = useCallback((v) => {
    if (utteranceRef.current) utteranceRef.current.volume = v;
  }, []);

  return { speak, pause, resume, stop, setVolume, speaking, paused, progress, supported };
}
