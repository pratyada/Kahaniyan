import { useEffect, useRef, useState, useCallback } from 'react';
import { LANGUAGES } from '../utils/constants.js';

// ─────────────────────────────────────────────────────────────
// useSpeech — narrator-quality wrapper around Web Speech API.
//
// Robotic defaults are mostly the browser's fault: the API picks
// the lowest-quality fallback voice unless you explicitly hand it
// a better one. This hook does three things to fight that:
//
//   1. Enumerates all installed voices on the device and ranks
//      them. Premium/Enhanced/Natural/Neural/Google voices win.
//   2. Splits the story into sentences and queues each as its own
//      utterance, so the synthesizer pauses naturally between them
//      (like a real narrator catching their breath).
//   3. Slightly slower rate (0.92) and lower pitch (0.95) for the
//      "soothing storyteller" feel — the defaults are too perky.
// ─────────────────────────────────────────────────────────────

const QUALITY_HINTS = [
  'premium',
  'enhanced',
  'neural',
  'natural',
  'studio',
  'wavenet',
  'siri',
  'google',
  'samantha',
  'daniel',
  'karen',
  'serena',
  'tessa',
  'alex',
];

function rankVoice(v, langCode) {
  const name = (v.name || '').toLowerCase();
  let score = 0;
  // Language match is the biggest factor
  if (v.lang === langCode) score += 100;
  else if (v.lang?.split('-')[0] === langCode.split('-')[0]) score += 60;
  // Quality hints in name
  for (const hint of QUALITY_HINTS) {
    if (name.includes(hint)) score += 15;
  }
  // Local voices are higher quality than cloud-fallback ones
  if (v.localService) score += 8;
  // Avoid obvious low-quality "compact" / "novelty" voices
  if (name.includes('compact')) score -= 20;
  if (name.includes('novelty')) score -= 50;
  if (name.includes('whisper')) score -= 50;
  return score;
}

function pickBestVoice(voices, langCode, preferredName) {
  if (!voices || voices.length === 0) return null;
  if (preferredName) {
    const exact = voices.find((v) => v.name === preferredName);
    if (exact) return exact;
  }
  return [...voices].sort((a, b) => rankVoice(b, langCode) - rankVoice(a, langCode))[0];
}

// Split into sentences while preserving punctuation. Handles
// common abbreviations only loosely — POC quality is enough.
function splitIntoSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g)
    ?.map((s) => s.trim())
    .filter(Boolean) || [text];
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState([]);

  const cancelledRef = useRef(false);
  const sentenceIndexRef = useRef(0);
  const totalSentencesRef = useRef(0);
  const currentVolumeRef = useRef(1);

  // Enumerate voices (async on Chrome — fires onvoiceschanged later)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices((prev) => prev.length === v.length ? prev : v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    ({ text, language = 'English', rate = 0.92, volume = 1, preferredVoiceName = null }) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      cancelledRef.current = false;
      currentVolumeRef.current = volume;

      const langCode = LANGUAGES.find((l) => l.key === language)?.voice || 'en-US';
      const allVoices = window.speechSynthesis.getVoices();
      const chosen = pickBestVoice(allVoices, langCode, preferredVoiceName);

      const sentences = splitIntoSentences(text);
      sentenceIndexRef.current = 0;
      totalSentencesRef.current = sentences.length;
      setProgress(0);
      setSpeaking(true);
      setPaused(false);

      const speakNext = (i) => {
        if (cancelledRef.current) return;
        if (i >= sentences.length) {
          setSpeaking(false);
          setProgress(1);
          return;
        }
        const u = new SpeechSynthesisUtterance(sentences[i]);
        u.lang = langCode;
        if (chosen) u.voice = chosen;
        u.rate = rate; // slower than default for storytelling warmth
        u.pitch = 0.95; // slightly lower than default
        u.volume = currentVolumeRef.current;

        u.onend = () => {
          sentenceIndexRef.current = i + 1;
          setProgress((i + 1) / sentences.length);
          // Tiny gap between sentences feels like a real narrator
          setTimeout(() => speakNext(i + 1), 180);
        };
        u.onerror = () => {
          if (cancelledRef.current) return;
          // skip the broken sentence and continue
          setTimeout(() => speakNext(i + 1), 100);
        };
        window.speechSynthesis.speak(u);
      };

      speakNext(0);
    },
    []
  );

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
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setProgress(0);
    }
  }, []);

  const setVolume = useCallback((v) => {
    currentVolumeRef.current = v;
  }, []);

  // Voices grouped + ranked for the Settings picker
  const voicesForLanguage = useCallback(
    (language) => {
      const langCode = LANGUAGES.find((l) => l.key === language)?.voice || 'en-US';
      const langPrefix = langCode.split('-')[0];
      return voices
        .filter((v) => v.lang === langCode || v.lang?.startsWith(langPrefix))
        .map((v) => ({ ...v, _score: rankVoice(v, langCode) }))
        .sort((a, b) => b._score - a._score);
    },
    [voices]
  );

  return {
    speak,
    pause,
    resume,
    stop,
    setVolume,
    speaking,
    paused,
    progress,
    supported,
    voices,
    voicesForLanguage,
  };
}
