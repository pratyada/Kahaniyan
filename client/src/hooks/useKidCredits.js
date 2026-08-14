// Kid Credits hook — balance, level, streak, transactions
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.jsx';
import { useFamilyProfile } from './useFamilyProfile.js';

const API = import.meta.env.VITE_API_BASE_URL || '';

export function useKidCredits() {
  const { user } = useAuth();
  const { profile, activeIndex } = useFamilyProfile();
  const [credits, setCredits] = useState({ balance: 0, totalEarned: 0, streak: 0, level: 1, title: 'Little Storyteller', icon: '🌱' });
  const [loading, setLoading] = useState(false);

  const kidId = user ? `${user.uid}_${activeIndex || 0}` : null;

  const fetchBalance = useCallback(async () => {
    if (!kidId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/kid-credits`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'balance', kidId, parentUid: user?.uid }),
      });
      const data = await res.json();
      setCredits(data);
    } catch {}
    setLoading(false);
  }, [kidId, user?.uid]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  const award = useCallback(async (type, storyId) => {
    if (!kidId) return null;
    try {
      const res = await fetch(`${API}/api/kid-credits`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'award', kidId, parentUid: user?.uid, type, storyId }),
      });
      const data = await res.json();
      if (data.awarded) {
        setCredits(prev => ({ ...prev, ...data }));
      }
      return data;
    } catch { return null; }
  }, [kidId, user?.uid]);

  return { credits, loading, fetchBalance, award, kidId };
}
