import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { defaultCharactersFromProfile } from '../utils/constants.js';

const PROFILES_KEY = 'qissaa:profiles';
const ACTIVE_KEY = 'qissaa:activeProfile';
// Legacy key from the single-profile era
const LEGACY_KEY = 'kahaniyo:familyProfile';

function migrate(profile) {
  if (!profile) return profile;
  let next = { ...profile };
  if (!next.characters || next.characters.length === 0) {
    next.characters = defaultCharactersFromProfile(next);
  }
  if (!next.beliefs && next.religion) {
    next.beliefs = next.religion === 'all' ? [] : [next.religion];
  }
  if (!next.beliefs) next.beliefs = [];
  return next;
}

function loadAll() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw).map(migrate);
    // Migrate from legacy single-profile
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const p = migrate(JSON.parse(legacy));
      const all = [p];
      localStorage.setItem(PROFILES_KEY, JSON.stringify(all));
      localStorage.setItem(ACTIVE_KEY, '0');
      return all;
    }
  } catch {
    // ignore
  }
  return [];
}

function loadActiveIndex() {
  try {
    return parseInt(localStorage.getItem(ACTIVE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function persist(profiles, activeIndex) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(ACTIVE_KEY, String(activeIndex));
  } catch {
    // ignore quota errors
  }
}

const FamilyProfileCtx = createContext(null);

export function FamilyProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const all = loadAll();
    const idx = Math.min(loadActiveIndex(), Math.max(0, all.length - 1));
    setProfiles(all);
    setActiveIndex(all.length > 0 ? idx : 0);
    setReady(true);
  }, []);

  const profile = profiles[activeIndex] || null;

  const save = useCallback((p) => {
    const migrated = migrate(p);
    setProfiles((prev) => {
      const next = [...prev];
      next[activeIndex] = migrated;
      persist(next, activeIndex);
      return next;
    });
  }, [activeIndex]);

  const update = useCallback((patch) => {
    setProfiles((prev) => {
      const next = [...prev];
      next[activeIndex] = { ...(next[activeIndex] || {}), ...patch };
      persist(next, activeIndex);
      return next;
    });
  }, [activeIndex]);

  const clear = useCallback(() => {
    setProfiles((prev) => {
      const next = prev.filter((_, i) => i !== activeIndex);
      const newIdx = Math.min(activeIndex, Math.max(0, next.length - 1));
      setActiveIndex(newIdx);
      persist(next, newIdx);
      return next;
    });
  }, [activeIndex]);

  const addKid = useCallback((p) => {
    const migrated = migrate(p);
    setProfiles((prev) => {
      const next = [...prev, migrated];
      const newIdx = next.length - 1;
      setActiveIndex(newIdx);
      persist(next, newIdx);
      return next;
    });
  }, []);

  const switchKid = useCallback((idx) => {
    setActiveIndex(idx);
    try {
      localStorage.setItem(ACTIVE_KEY, String(idx));
    } catch {
      // ignore
    }
  }, []);

  return createElement(
    FamilyProfileCtx.Provider,
    { value: { profile, profiles, activeIndex, ready, save, update, clear, addKid, switchKid } },
    children
  );
}

export function useFamilyProfile() {
  const ctx = useContext(FamilyProfileCtx);
  if (!ctx) throw new Error('useFamilyProfile must be used inside FamilyProfileProvider');
  return ctx;
}
