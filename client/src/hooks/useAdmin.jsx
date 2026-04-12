import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { useAuth } from './useAuth.jsx';

const AdminCtx = createContext(null);

const CONFIG_DOC = 'config/app';

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    if (!user || !db) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, CONFIG_DOC));
        if (snap.exists()) {
          const emails = snap.data().adminEmails || [];
          setAdminEmails(emails);
          setIsAdmin(emails.includes(user.email));
        } else {
          // First time — no config doc exists. Make the current user admin.
          const emails = [user.email];
          await setDoc(doc(db, CONFIG_DOC), { adminEmails: emails });
          setAdminEmails(emails);
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn('Admin check failed', e);
        setIsAdmin(false);
      }
      setLoading(false);
    })();
  }, [user]);

  // Load all users from Firestore
  const loadUsers = useCallback(async () => {
    if (!db) return;
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = [];
      snap.forEach((d) => {
        users.push({ uid: d.id, ...d.data() });
      });
      setAllUsers(users);

      // Compute stats
      const totalKids = users.reduce((s, u) => s + (u.profiles?.length || 0), 0);
      const totalChars = users.reduce(
        (s, u) =>
          s +
          (u.profiles || []).reduce((c, p) => c + (p.characters?.length || 0), 0),
        0
      );
      const tiers = { free: 0, family: 0, annual: 0 };
      users.forEach((u) => {
        (u.profiles || []).forEach((p) => {
          const t = p.tier || 'free';
          tiers[t] = (tiers[t] || 0) + 1;
        });
      });
      const beliefs = {};
      users.forEach((u) => {
        (u.profiles || []).forEach((p) => {
          (p.beliefs || []).forEach((b) => {
            beliefs[b] = (beliefs[b] || 0) + 1;
          });
        });
      });

      setStats({
        totalUsers: users.length,
        totalKids,
        totalChars,
        tiers,
        beliefs,
      });
    } catch (e) {
      console.warn('Failed to load users', e);
    }
  }, []);

  const addAdmin = useCallback(
    async (email) => {
      if (!db || !email.trim()) return;
      const next = [...new Set([...adminEmails, email.trim().toLowerCase()])];
      await setDoc(doc(db, CONFIG_DOC), { adminEmails: next }, { merge: true });
      setAdminEmails(next);
    },
    [adminEmails]
  );

  const removeAdmin = useCallback(
    async (email) => {
      if (!db) return;
      const next = adminEmails.filter((e) => e !== email);
      await setDoc(doc(db, CONFIG_DOC), { adminEmails: next }, { merge: true });
      setAdminEmails(next);
    },
    [adminEmails]
  );

  // Block / unblock / pause a user
  const setUserStatus = useCallback(async (uid, status) => {
    // status: 'active' | 'blocked' | 'paused'
    if (!db || !uid) return;
    await setDoc(doc(db, 'users', uid), { accountStatus: status }, { merge: true });
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, accountStatus: status } : u))
    );
  }, []);

  // Update a user's subscription tier
  const setUserTier = useCallback(async (uid, profileIndex, tier) => {
    if (!db || !uid) return;
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const profiles = [...(data.profiles || [])];
    if (profiles[profileIndex]) {
      profiles[profileIndex] = { ...profiles[profileIndex], tier };
      await setDoc(doc(db, 'users', uid), { profiles }, { merge: true });
      setAllUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, profiles } : u))
      );
    }
  }, []);

  return createElement(
    AdminCtx.Provider,
    { value: { isAdmin, loading, allUsers, stats, adminEmails, loadUsers, addAdmin, removeAdmin, setUserStatus, setUserTier } },
    children
  );
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}
