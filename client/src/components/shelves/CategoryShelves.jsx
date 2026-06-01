// Netflix-style category shelves — horizontal rows of series + collection cards.
// Each category (Sci-Fi, Adventure, Maths, etc.) gets its own sliding shelf.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import SeriesCard from '../cards/SeriesCard.jsx';
import { useLocalizedSeries } from '../../hooks/useLocalizedData.js';
import { CATEGORIES, SERIES_CATEGORIES, COLLECTION_CATEGORIES } from '../../data/seriesCategories.js';
import { COLLECTIONS } from '../../data/collections.js';

export default function CategoryShelves({ wisdomImageUrls }) {
  const SERIES = useLocalizedSeries();
  const navigate = useNavigate();
  const [coverImages, setCoverImages] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomImages'));
        if (snap.exists()) setCoverImages(snap.data());
      } catch {}
    })();
  }, []);

  // Build category data
  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      // Get series in this category
      const seriesIds = Object.entries(SERIES_CATEGORIES)
        .filter(([, cats]) => cats.includes(cat.key))
        .map(([id]) => id);
      const series = seriesIds
        .map(id => SERIES.find(s => s.id === id))
        .filter(Boolean);

      // Get collections in this category
      const colIds = Object.entries(COLLECTION_CATEGORIES)
        .filter(([, cats]) => cats.includes(cat.key))
        .map(([id]) => id);
      const collections = colIds
        .map(id => COLLECTIONS.find(c => c.id === id))
        .filter(Boolean);

      return { ...cat, series, collections, total: series.length + collections.length };
    }).filter(cat => cat.total > 0);
  }, [SERIES]);

  const getSeriesCover = (series) => {
    for (const ep of series.episodes) {
      const img = coverImages[ep.id] || (wisdomImageUrls || {})[ep.id];
      if (img) return img;
    }
    return null;
  };

  // Deduplicate series/collections across categories (rebuilt each render)
  const { deduped } = useMemo(() => {
    const seenSeries = new Set();
    const seenCols = new Set();
    const result = categoryData.map(cat => {
      const uniqueSeries = cat.series.filter(s => { if (seenSeries.has(s.id)) return false; seenSeries.add(s.id); return true; });
      const uniqueCollections = cat.collections.filter(c => { if (seenCols.has(c.id)) return false; seenCols.add(c.id); return true; });
      return { ...cat, uniqueSeries, uniqueCollections };
    }).filter(cat => cat.uniqueSeries.length + cat.uniqueCollections.length > 0);
    return { deduped: result };
  }, [categoryData]);

  return (
    <>
      {deduped.map(cat => {
        const { uniqueSeries, uniqueCollections } = cat;
        if (uniqueSeries.length + uniqueCollections.length === 0) return null;
        return (
        <ShelfSection key={cat.key} title={cat.label}>
          <ShelfRow>
            {/* Series cards */}
            {uniqueSeries.map(s => (
              <SeriesCard
                key={s.id}
                series={s}
                coverImage={getSeriesCover(s)}
                onClick={() => navigate(`/series/${s.id}`)}
              />
            ))}
            {/* Collection cards */}
            {uniqueCollections.map(col => (
              <button
                key={col.id}
                onClick={() => navigate(`/collection/${col.id}`)}
                className="shrink-0"
                style={{ width: 200, height: 280 }}
              >
                <div className="relative h-full w-full rounded-2xl overflow-hidden ring-1 ring-white/10 transition hover:ring-gold/30 active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg, rgba(240,165,0,0.15) 0%, rgba(30,30,50,0.9) 100%)' }}>
                  {/* Collection icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-5xl mb-3">{col.icon}</span>
                    <p className="text-sm font-bold text-ink leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                      {col.title.replace(/^[^\s]+\s/, '')}
                    </p>
                    <p className="text-[10px] text-ink-muted mt-1.5">{col.stories.length} stories</p>
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent" />
                </div>
              </button>
            ))}
          </ShelfRow>
        </ShelfSection>
        );
      })}
    </>
  );
}
