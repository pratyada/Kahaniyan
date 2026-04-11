import { createContext, createElement, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext(null);
const KEY = 'dreemo:theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || 'night';
    } catch {
      return 'night';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'night' ? 'day' : 'night'));

  return createElement(ThemeCtx.Provider, { value: { theme, setTheme, toggle } }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
