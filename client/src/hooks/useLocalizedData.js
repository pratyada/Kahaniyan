// Hook that returns the correct language version of story data.
// Lazy-loads FR translations only when French is selected.

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CULTURAL_LESSONS } from '../data/culturalLessons.js';
import { COLLECTIONS } from '../data/collections.js';
import { SERIES } from '../data/series.js';

let frCache = null;

function useFrData() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [data, setData] = useState(frCache);

  useEffect(() => {
    if (isFr && !frCache) {
      Promise.all([
        import('../data/culturalLessons.fr.js'),
        import('../data/collections.fr.js'),
        import('../data/series.fr.js'),
      ]).then(([l, c, s]) => {
        frCache = { lessons: l.CULTURAL_LESSONS, collections: c.COLLECTIONS, series: s.SERIES };
        setData(frCache);
      });
    }
  }, [isFr]);

  return { isFr, fr: data };
}

export function useLocalizedLessons() {
  const { isFr, fr } = useFrData();
  return useMemo(() => (isFr && fr?.lessons) ? fr.lessons : CULTURAL_LESSONS, [isFr, fr]);
}

export function useLocalizedCollections() {
  const { isFr, fr } = useFrData();
  return useMemo(() => (isFr && fr?.collections) ? fr.collections : COLLECTIONS, [isFr, fr]);
}

export function useLocalizedSeries() {
  const { isFr, fr } = useFrData();
  return useMemo(() => (isFr && fr?.series) ? fr.series : SERIES, [isFr, fr]);
}
