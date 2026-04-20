import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Lightweight global player context — holds the currently loaded
// story so the mini PlayerBar can render across routes.
// Also holds a ref to the active audio element so it can be stopped
// from anywhere (e.g. when user closes player after navigating away).
const LAST_STORY_KEY = 'mst:lastStory';

function saveStory(story) {
  try {
    if (story) localStorage.setItem(LAST_STORY_KEY, JSON.stringify(story));
  } catch {}
}

function loadSavedStory() {
  try {
    const raw = localStorage.getItem(LAST_STORY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const [current, setCurrent] = useState(null); // story object
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // global ref to active audio element

  const load = useCallback((story) => {
    // CRITICAL: stop any currently playing audio before loading new story
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
      audioRef.current = null;
    }
    setCurrent(story);
    saveStory(story);
    setIsPlaying(true);
  }, []);

  const clear = useCallback(() => {
    // Stop any playing audio before clearing
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
      audioRef.current = null;
    }
    // Stop browser speech (wisdom stories)
    try { window.speechSynthesis?.cancel(); } catch {}
    setCurrent(null);
    setIsPlaying(false);
    try { localStorage.removeItem(LAST_STORY_KEY); } catch {}
  }, []);

  // Register/unregister the active audio element
  const setAudio = useCallback((el) => { audioRef.current = el; }, []);

  // Expose method to reload last story if current is lost
  const reloadLast = useCallback(() => {
    const saved = loadSavedStory();
    if (saved) {
      setCurrent(saved);
      return saved;
    }
    return null;
  }, []);

  return (
    <PlayerCtx.Provider value={{ current, isPlaying, setIsPlaying, load, clear, reloadLast, setAudio, audioRef }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
