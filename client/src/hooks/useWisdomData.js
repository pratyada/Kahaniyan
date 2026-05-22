// Shared hook for fetching wisdom audio URLs, image URLs, and custom stories from Firestore.
// Caches to localStorage for instant display on remount (no image flash).
// Language-aware: loads FR story data when French is selected.

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CULTURAL_LESSONS } from '../data/culturalLessons.js';

const CACHE_KEYS = {
  audio: 'mst:cache:wisdomAudio',
  images: 'mst:cache:wisdomImages',
  custom: 'mst:cache:customStories',
};

function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

let frLessonsCache = null;

export function useWisdomData() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  // Initialize from localStorage cache — instant, no flash
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState(() => readCache(CACHE_KEYS.audio) || {});
  const [wisdomImageUrls, setWisdomImageUrls] = useState(() => readCache(CACHE_KEYS.images) || {});
  const [customWisdomStories, setCustomWisdomStories] = useState(() => readCache(CACHE_KEYS.custom) || []);
  const [frLessons, setFrLessons] = useState(frLessonsCache);
  const [loading, setLoading] = useState(true);

  // Load FR lessons lazily when French is selected
  useEffect(() => {
    if (isFr && !frLessonsCache) {
      import('../data/culturalLessons.fr.js').then(mod => {
        frLessonsCache = mod.CULTURAL_LESSONS;
        setFrLessons(frLessonsCache);
      });
    }
  }, [isFr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb || cancelled) { setLoading(false); return; }
        const { doc: fdoc, getDoc: fget, collection, getDocs } = await import('firebase/firestore');

        const [audioSnap, imgSnap, customSnap] = await Promise.all([
          fget(fdoc(fireDb, 'config', 'wisdomAudio')),
          fget(fdoc(fireDb, 'config', 'wisdomImages')),
          getDocs(collection(fireDb, 'wisdomStories')),
        ]);

        if (cancelled) return;

        if (audioSnap.exists()) {
          const data = audioSnap.data();
          setWisdomAudioUrls(data);
          writeCache(CACHE_KEYS.audio, data);
        }
        if (imgSnap.exists()) {
          const data = imgSnap.data();
          setWisdomImageUrls(data);
          writeCache(CACHE_KEYS.images, data);
        }

        const custom = [];
        customSnap.forEach((d) => custom.push({ id: d.id, ...d.data() }));
        setCustomWisdomStories(custom);
        writeCache(CACHE_KEYS.custom, custom);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const baseLessons = (isFr && frLessons) ? frLessons : CULTURAL_LESSONS;

  const allLessons = useMemo(() => {
    const merged = new Map();
    baseLessons.forEach((l) => merged.set(l.id, l));
    customWisdomStories.forEach((l) => merged.set(l.id, l));
    return [...merged.values()];
  }, [baseLessons, customWisdomStories]);

  return { wisdomAudioUrls, wisdomImageUrls, allLessons, loading };
}
