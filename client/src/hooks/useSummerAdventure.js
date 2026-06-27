// Summer Adventure hook — localStorage + Firestore dual-layer.
// Mirrors useFamilyProfile.js pattern.

import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase.js';
import { doc, collection, query, where, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth.jsx';

const LS_KEY = 'mst:summerAdventure';
const API = import.meta.env.VITE_API_URL || '';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; }
}
function saveLocal(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

export function useSummerAdventure() {
  const { user } = useAuth();
  const [adventure, setAdventure] = useState(loadLocal);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from Firestore
  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }

    // Single where to avoid composite index requirement
    const q = query(
      collection(db, 'summerAdventures'),
      where('uid', '==', user.uid),
      limit(5)
    );

    let unsub;
    try {
      unsub = onSnapshot(q, (snap) => {
        const activeDoc = snap.docs.find(d => d.data().status === 'active');
        if (activeDoc) {
          const data = { id: activeDoc.id, ...activeDoc.data() };
          setAdventure(data);
          saveLocal(data);
          // Days are stored in the adventure document itself
          setDays((data.days || []).sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0)));
        } else {
          setAdventure(null);
          saveLocal(null);
          setDays([]);
        }
        setLoading(false);
      }, (err) => {
        console.warn('[SummerAdventure] Firestore query failed:', err.message);
        setLoading(false);
      });
    } catch (err) {
      console.warn('[SummerAdventure] Query setup failed:', err.message);
      setLoading(false);
    }

    return () => { if (unsub) unsub(); };
  }, [user]);

  // Get current day (first available day)
  const currentDay = days.find(d => d.status === 'available') || days.find(d => d.status === 'in_progress');
  const completedDays = days.filter(d => d.status === 'completed');
  const currentWeek = currentDay ? Math.ceil(currentDay.dayNumber / 7) : 1;
  const totalXP = adventure?.stats?.totalXP || 0;

  // Actions
  const createAdventure = useCallback(async (data) => {
    if (!user) return null;
    const res = await fetch(`${API}/api/summer/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, action: 'create', data }),
    });
    const result = await res.json();
    return result.adventureId;
  }, [user]);

  const parseReportCard = useCallback(async (imageBase64, contentType) => {
    if (!user) return null;
    const res = await fetch(`${API}/api/summer/parse-report-card`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, image: imageBase64, contentType }),
    });
    return res.json();
  }, [user]);

  const generateCurriculum = useCallback(async (growthProfile, adventureId) => {
    if (!user) return null;
    const res = await fetch(`${API}/api/summer/generate-curriculum`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid, adventureId,
        growthProfile,
        childName: adventure?.childName,
        childAge: adventure?.childAge,
      }),
    });
    return res.json();
  }, [user, adventure]);

  const completeMission = useCallback(async (dayNumber) => {
    if (!user || !adventure) return;
    return fetch(`${API}/api/summer/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, action: 'complete-mission', adventureId: adventure.id, data: { dayNumber } }),
    }).then(r => r.json());
  }, [user, adventure]);

  const completeReflection = useCallback(async (dayNumber, feeling, answer) => {
    if (!user || !adventure) return;
    return fetch(`${API}/api/summer/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, action: 'complete-reflection', adventureId: adventure.id, data: { dayNumber, feeling, answer } }),
    }).then(r => r.json());
  }, [user, adventure]);

  const completeDay = useCallback(async (dayNumber) => {
    if (!user || !adventure) return;
    return fetch(`${API}/api/summer/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, action: 'complete-day', adventureId: adventure.id, data: { dayNumber } }),
    }).then(r => r.json());
  }, [user, adventure]);

  return {
    adventure, days, loading,
    currentDay, currentWeek, completedDays, totalXP,
    createAdventure, parseReportCard, generateCurriculum,
    completeMission, completeReflection, completeDay,
    hasAdventure: !!adventure,
  };
}
