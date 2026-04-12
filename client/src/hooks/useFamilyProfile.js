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

const LS_PROFILES = 'qissaa:profiles';
const LS_ACTIVE = 'qissaa:activeProfile';
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

    if (newUid && db) {
      // Try loading from Firestore
      try {
        const snap = await getDoc(userDocRef(newUid));
        if (snap.exists()) {
          const data = snap.data();
          const cloudProfiles = (data.profiles || []).map(migrate);
          const cloudIdx = Math.min(data.activeIndex || 0, Math.max(0, cloudProfiles.length - 1));

          if (data.accountStatus) setAccountStatus(data.accountStatus);

          if (cloudProfiles.length > 0) {
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

      // Firestore empty — check localStorage for existing data to migrate up
      const local = loadFromLS();
      const localIdx = loadActiveFromLS();
      if (local.length > 0) {
        setProfiles(local);
        setActiveIndex(Math.min(localIdx, local.length - 1));
        // Push local data to Firestore
        try {
          await setDoc(userDocRef(newUid), { profiles: local, activeIndex: localIdx }, { merge: true });
        } catch {
          // offline — will sync next time
        }
      }
      setReady(true);
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

  // Persist helper — writes to both LS and Firestore
  const persist = useCallback(
    async (nextProfiles, nextIdx) => {
      persistLS(nextProfiles, nextIdx);
      if (uid && db && !savingRef.current) {
        savingRef.current = true;
        try {
          // Include auth metadata so admin can see emails + last activity
          const authMeta = firebaseAuth?.currentUser
            ? {
                email: auth.currentUser.email || '',
                displayName: auth.currentUser.displayName || '',
                photoURL: auth.currentUser.photoURL || '',
                lastActiveAt: new Date().toISOString(),
              }
            : {};
          await setDoc(userDocRef(uid), {
            profiles: nextProfiles,
            activeIndex: nextIdx,
            ...authMeta,
          });
        } catch (e) {
          console.warn('Firestore write failed', e);
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
      setProfiles((prev) => {
        const next = [...prev];
        next[activeIndex] = migrated;
        persist(next, activeIndex);
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
        persist(next, activeIndex);
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
      const migrated = migrate(p);
      setProfiles((prev) => {
        const next = [...prev, migrated];
        const newIdx = next.length - 1;
        setActiveIndex(newIdx);
        persist(next, newIdx);
        return next;
      });
    },
    [persist]
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
