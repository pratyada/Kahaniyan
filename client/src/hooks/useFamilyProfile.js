import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';

const KEY = 'kahaniyo:familyProfile';

const FamilyProfileCtx = createContext(null);

export function FamilyProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const save = useCallback((p) => {
    setProfile(p);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      // ignore quota errors
    }
  }, []);

  const update = useCallback(
    (patch) => {
      setProfile((prev) => {
        const next = { ...(prev || {}), ...patch };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const clear = useCallback(() => {
    setProfile(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }, []);

  return createElement(
    FamilyProfileCtx.Provider,
    { value: { profile, ready, save, update, clear } },
    children
  );
}

export function useFamilyProfile() {
  const ctx = useContext(FamilyProfileCtx);
  if (!ctx) throw new Error('useFamilyProfile must be used inside FamilyProfileProvider');
  return ctx;
}
