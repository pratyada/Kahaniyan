import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { putVoice, getAllVoices, deleteVoice } from '../utils/idb.js';

const VoicesCtx = createContext(null);

export function FamilyVoicesProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAllVoices()
      .then((list) => {
        setVoices(list);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const addVoice = useCallback(async ({ name, relation, blob, durationSeconds }) => {
    const record = {
      id: `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      relation,
      blob,
      durationSeconds,
      createdAt: new Date().toISOString(),
    };
    await putVoice(record);
    setVoices((prev) => [record, ...prev]);
    return record;
  }, []);

  const removeVoice = useCallback(async (id) => {
    await deleteVoice(id);
    setVoices((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return createElement(
    VoicesCtx.Provider,
    { value: { voices, ready, addVoice, removeVoice } },
    children
  );
}

export function useFamilyVoices() {
  const ctx = useContext(VoicesCtx);
  if (!ctx) throw new Error('useFamilyVoices must be used inside FamilyVoicesProvider');
  return ctx;
}
