import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { defaultCharactersFromProfile } from '../utils/constants.js';

const KEY = 'kahaniyo:familyProfile';

function migrate(profile) {
  if (!profile) return profile;
  let next = profile;
  if (!next.characters || next.characters.length === 0) {
    next = { ...next, characters: defaultCharactersFromProfile(next) };
  }
  // Migrate single religion → beliefs array
  if (!next.beliefs && next.religion) {
    next = { ...next, beliefs: next.religion === 'all' ? [] : [next.religion] };
  }
  if (!next.beliefs) {
    next = { ...next, beliefs: [] };
  }
  return next;
}

const FamilyProfileCtx = createContext(null);

export function FamilyProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const migrated = migrate(JSON.parse(raw));
        setProfile(migrated);
        try {
          localStorage.setItem(KEY, JSON.stringify(migrated));
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const save = useCallback((p) => {
    const migrated = migrate(p);
    setProfile(migrated);
    try {
      localStorage.setItem(KEY, JSON.stringify(migrated));
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
