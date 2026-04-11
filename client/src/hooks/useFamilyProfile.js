import { useEffect, useState, useCallback } from 'react';

const KEY = 'kahaniyo:familyProfile';

const DEFAULT_PROFILE = null;

export function useFamilyProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
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
    localStorage.setItem(KEY, JSON.stringify(p));
  }, []);

  const update = useCallback(
    (patch) => {
      const next = { ...(profile || {}), ...patch };
      save(next);
    },
    [profile, save]
  );

  const clear = useCallback(() => {
    setProfile(null);
    localStorage.removeItem(KEY);
  }, []);

  return { profile, ready, save, update, clear };
}
