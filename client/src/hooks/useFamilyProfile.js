import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth as firebaseAuth, hasConfig } from '../lib/firebase.js';
import { registerOnUserChange } from './useAuth.jsx';
import { defaultCharactersFromProfile } from '../utils/constants.js';

// ─────────────────────────────────────────────────────────────
// useFamilyProfile — dual-layer persistence.
//
// When a Firebase user is logged in + Firestore is available:
//   Read/write: Firestore → users/{uid}
//   Also mirror to localStorage as offline cache.
//
// When no Firebase / no user:
//   Read/write: localStorage only (same as before).
//
// Data shape in Firestore:
//   users/{uid} → { profiles: [...], activeIndex: 0 }
//
// Migration:
//   - Legacy single-profile (kahaniyo:familyProfile) → profiles[0]
//   - Old multi-profile (dreemo:profiles) → profiles[]
//   - Missing characters/beliefs → auto-populated
// ─────────────────────────────────────────────────────────────

const LS_PROFILES = 'mst:profiles';
const LS_ACTIVE = 'mst:activeProfile';
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

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_PROFILES);
    if (raw) return JSON.parse(raw).map(migrate);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const p = migrate(JSON.parse(legacy));
      return [p];
    }
  } catch {
    // ignore
  }
  return [];
}

function loadActiveFromLS() {
  try {
    return parseInt(localStorage.getItem(LS_ACTIVE) || '0', 10);
  } catch {
    return 0;
  }
}

function persistLS(profiles, activeIndex) {
  try {
    localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
    localStorage.setItem(LS_ACTIVE, String(activeIndex));
  } catch {
    // ignore
  }
}

// Firestore doc ref for a given uid
function userDocRef(uid) {
  if (!db || !uid) return null;
  return doc(db, 'users', uid);
}

const FamilyProfileCtx = createContext(null);

export function FamilyProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState(null);
  const savingRef = useRef(false);

  // Called by useAuth when user changes
  const attachUser = useCallback(async (user) => {
    const newUid = user?.uid || null;
    setUid(newUid);
    // Don't set ready=false if already ready — prevents Shell from unmounting
    // children (Player) during auth state transitions, which causes #310

    if (newUid && db) {
      // Try loading from Firestore
      try {
        const snap = await getDoc(userDocRef(newUid));
        if (snap.exists()) {
          const data = snap.data();
          const cloudProfiles = (data.profiles || []).map(migrate);
          const cloudIdx = Math.min(data.activeIndex || 0, Math.max(0, cloudProfiles.length - 1));

          if (data.accountStatus) setAccountStatus(data.accountStatus);

          // Always update auth metadata on login so admin can see emails
          try {
            const cu = firebaseAuth?.currentUser;
            if (cu) {
              await setDoc(userDocRef(newUid), {
                email: cu.email || '',
                displayName: cu.displayName || '',
                photoURL: cu.photoURL || '',
                lastActiveAt: new Date().toISOString(),
                geo: {
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                  language: navigator.language || '',
                  updatedAt: new Date().toISOString(),
                },
              }, { merge: true });
            }
          } catch {
            // non-critical
          }

          if (cloudProfiles.length > 0) {
            console.log('[My Sleepy Tale:profile] Loaded from Firestore:', cloudProfiles.length, 'profiles, name:', cloudProfiles[cloudIdx]?.childName);
            setProfiles(cloudProfiles);
            setActiveIndex(cloudIdx);
            persistLS(cloudProfiles, cloudIdx);
            setReady(true);
            return;
          }
        }
      } catch (e) {
        console.warn('Firestore read failed, using localStorage', e);
      }

      // Firestore empty for this user.
      // Check if localStorage has data from pre-login browsing/onboarding.
      // If yes, carry it over to Firestore (seamless signup experience).
      const local = loadFromLS();
      const localIdx = loadActiveFromLS();
      const cu = firebaseAuth?.currentUser;

      if (local.length > 0 && local[0]?.childName) {
        // User onboarded before signing in — migrate local data to Firestore
        console.log('[My Sleepy Tale:profile] Migrating local profile to Firestore:', local[0]?.childName);
        try {
          if (cu) {
            await setDoc(userDocRef(newUid), stripUndefined({
              email: cu.email || '',
              displayName: cu.displayName || '',
              photoURL: cu.photoURL || '',
              lastActiveAt: new Date().toISOString(),
              profiles: local,
              activeIndex: localIdx,
              geo: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                language: navigator.language || '',
                updatedAt: new Date().toISOString(),
              },
            }));
          }
        } catch {
          // non-critical — data still in localStorage
        }
        setProfiles(local);
        setActiveIndex(Math.min(localIdx, local.length - 1));
        setReady(true);
      } else {
        // Truly new user — no local data either
        try {
          if (cu) {
            await setDoc(userDocRef(newUid), {
              email: cu.email || '',
              displayName: cu.displayName || '',
              photoURL: cu.photoURL || '',
              lastActiveAt: new Date().toISOString(),
              profiles: [],
              activeIndex: 0,
              geo: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                language: navigator.language || '',
                updatedAt: new Date().toISOString(),
              },
            });
          }
        } catch {
          // non-critical
        }
        setProfiles([]);
        setActiveIndex(0);
        setReady(true);
      }
    } else {
      // No Firebase user — localStorage only
      const local = loadFromLS();
      const localIdx = Math.min(loadActiveFromLS(), Math.max(0, local.length - 1));
      setProfiles(local);
      setActiveIndex(local.length > 0 ? localIdx : 0);
      setReady(true);
    }
  }, []);

  // Initial load + register for auth state changes
  useEffect(() => {
    const local = loadFromLS();
    const localIdx = Math.min(loadActiveFromLS(), Math.max(0, local.length - 1));
    setProfiles(local);
    setActiveIndex(local.length > 0 ? localIdx : 0);
    if (!hasConfig) setReady(true);
    // Register callback so AuthProvider can notify us on user change
    registerOnUserChange((user) => attachUser(user));
  }, [attachUser]);

  // Strip undefined values recursively — Firestore rejects them
  function stripUndefined(obj) {
    if (Array.isArray(obj)) return obj.map(stripUndefined);
    if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
      const clean = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) clean[k] = stripUndefined(v);
      }
      return clean;
    }
    return obj;
  }

  // Persist helper — writes to both LS and Firestore
  const persist = useCallback(
    async (nextProfiles, nextIdx) => {
      persistLS(nextProfiles, nextIdx);
      if (uid && db && !savingRef.current) {
        savingRef.current = true;
        try {
          console.log('[My Sleepy Tale:profile] Syncing to Firestore...');
          // Include auth metadata so admin can see emails + last activity
          const cu = firebaseAuth?.currentUser;
          const authMeta = cu
            ? {
                email: cu.email || '',
                displayName: cu.displayName || '',
                photoURL: cu.photoURL || '',
                lastActiveAt: new Date().toISOString(),
              }
            : {};
          await setDoc(userDocRef(uid), stripUndefined({
            profiles: nextProfiles,
            activeIndex: nextIdx,
            ...authMeta,
          }));
          console.log('[My Sleepy Tale:profile] Firestore sync done');
        } catch (e) {
          console.error('[My Sleepy Tale:profile] Firestore write FAILED:', e.message);
        } finally {
          savingRef.current = false;
        }
      }
    },
    [uid]
  );

  const [accountStatus, setAccountStatus] = useState('active');

  const profile = profiles[activeIndex] || null;

  const save = useCallback(
    (p) => {
      const migrated = migrate(p);
      const doSave = (prev) => {
        const next = [...prev];
        next[activeIndex] = migrated;
        return next;
      };
      setProfiles((prev) => {
        const next = doSave(prev);
        // Fire persist outside state updater so async works properly
        setTimeout(() => persist(next, activeIndex), 0);
        return next;
      });
    },
    [activeIndex, persist]
  );

  const update = useCallback(
    (patch) => {
      setProfiles((prev) => {
        const next = [...prev];
        next[activeIndex] = { ...(next[activeIndex] || {}), ...patch };
        // Fire persist outside state updater so async works properly
        setTimeout(() => persist(next, activeIndex), 0);
        return next;
      });
    },
    [activeIndex, persist]
  );

  const clear = useCallback(() => {
    setProfiles((prev) => {
      const next = prev.filter((_, i) => i !== activeIndex);
      const newIdx = Math.min(activeIndex, Math.max(0, next.length - 1));
      setActiveIndex(newIdx);
      persist(next, newIdx);
      return next;
    });
  }, [activeIndex, persist]);

  const addKid = useCallback(
    (p) => {
      // Enforce child profile limit based on tier
      const currentTier = profiles[0]?.tier || 'free';
      const LIMITS = { free: 1, pro: 3, enterprise: 10, family: 3, annual: 10 };
      const max = LIMITS[currentTier] || 1;
      if (profiles.length >= max) {
        throw new Error(`${currentTier === 'free' ? 'Free' : currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} plan allows ${max} child profile${max === 1 ? '' : 's'}. Upgrade to add more.`);
      }
      const migrated = migrate(p);
      setProfiles((prev) => {
        const next = [...prev, migrated];
        const newIdx = next.length - 1;
        setActiveIndex(newIdx);
        persist(next, newIdx);
        return next;
      });
    },
    [persist, profiles]
  );

  const switchKid = useCallback(
    (idx) => {
      setActiveIndex(idx);
      persist(profiles, idx);
    },
    [profiles, persist]
  );

  return createElement(
    FamilyProfileCtx.Provider,
    {
      value: {
        profile,
        profiles,
        activeIndex,
        ready,
        accountStatus,
        save,
        update,
        clear,
        addKid,
        switchKid,
        attachUser,
      },
    },
    children
  );
}

export function useFamilyProfile() {
  const ctx = useContext(FamilyProfileCtx);
  if (!ctx) throw new Error('useFamilyProfile must be used inside FamilyProfileProvider');
  return ctx;
}
