// Shared hook for fetching wisdom audio URLs, image URLs, and custom stories from Firestore.
// Used by Home, Library, and Lessons pages to avoid duplicate fetches.

import { useEffect, useMemo, useState } from 'react';
import { CULTURAL_LESSONS } from '../data/culturalLessons.js';

export function useWisdomData() {
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState({});
  const [wisdomImageUrls, setWisdomImageUrls] = useState({});
  const [customWisdomStories, setCustomWisdomStories] = useState([]);
  const [loading, setLoading] = useState(true);

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
        if (audioSnap.exists()) setWisdomAudioUrls(audioSnap.data());
        if (imgSnap.exists()) setWisdomImageUrls(imgSnap.data());

        const custom = [];
        customSnap.forEach((d) => custom.push({ id: d.id, ...d.data() }));
        setCustomWisdomStories(custom);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const allLessons = useMemo(() => {
    const merged = new Map();
    CULTURAL_LESSONS.forEach((l) => merged.set(l.id, l));
    customWisdomStories.forEach((l) => merged.set(l.id, l));
    return [...merged.values()];
  }, [customWisdomStories]);

  return { wisdomAudioUrls, wisdomImageUrls, allLessons, loading };
}
