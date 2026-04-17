import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Lightweight global player context — holds the currently loaded
// story so the mini PlayerBar can render across routes.
// Persists last story to localStorage so it's never lost.
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

  const load = useCallback((story) => {
    setCurrent(story);
    saveStory(story);
    setIsPlaying(true);
  }, []);

  const clear = useCallback(() => {
    setCurrent(null);
    setIsPlaying(false);
    try { localStorage.removeItem(LAST_STORY_KEY); } catch {}
  }, []);

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
    <PlayerCtx.Provider value={{ current, isPlaying, setIsPlaying, load, clear, reloadLast }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
