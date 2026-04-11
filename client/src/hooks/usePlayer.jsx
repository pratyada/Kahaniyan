import { createContext, useContext, useState, useCallback } from 'react';

// Lightweight global player context — holds the currently loaded
// story so the mini PlayerBar can render across routes.
const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const [current, setCurrent] = useState(null); // story object
  const [isPlaying, setIsPlaying] = useState(false);

  const load = useCallback((story) => {
    setCurrent(story);
    setIsPlaying(true);
  }, []);

  const clear = useCallback(() => {
    setCurrent(null);
    setIsPlaying(false);
  }, []);

  return (
    <PlayerCtx.Provider value={{ current, isPlaying, setIsPlaying, load, clear }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
