// Series shelf — horizontal row of stacked series cards.
// Live series first, then "coming soon" cards.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import SeriesCard from '../cards/SeriesCard.jsx';
import { SERIES } from '../../data/series.js';

// Preferred order for live series
const LIVE_ORDER = ['rainbow-kindergarten-jlps-yr25-26', 'dr-spock-parenting'];

export default function SeriesShelf() {
  const navigate = useNavigate();
  const [coverImages, setCoverImages] = useState({});
  const [galleryImages, setGalleryImages] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const [imgSnap, galSnap] = await Promise.all([
          getDoc(doc(db, 'config', 'wisdomImages')),
          getDoc(doc(db, 'config', 'wisdomGallery')),
        ]);
        if (imgSnap.exists()) setCoverImages(imgSnap.data());
        if (galSnap.exists()) setGalleryImages(galSnap.data());
      } catch {}
    })();
  }, []);

  if (SERIES.length === 0) return null;

  // Sort: live series in preferred order first, then coming soon
  const sorted = [...SERIES].sort((a, b) => {
    const aLive = !a.comingSoon;
    const bLive = !b.comingSoon;
    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;
    if (aLive && bLive) {
      return LIVE_ORDER.indexOf(a.id) - LIVE_ORDER.indexOf(b.id);
    }
    return 0;
  });

  const getSeriesCover = (series) => {
    for (const ep of series.episodes) {
      const img = coverImages[ep.id] || (galleryImages[ep.id] || [])[0];
      if (img) return img;
    }
    return null;
  };

  return (
    <ShelfSection title="📺 Series" subtitle="Multi-episode stories — same characters, new adventures">
      <ShelfRow>
        {sorted.map((s) => (
          <SeriesCard
            key={s.id}
            series={s}
            coverImage={getSeriesCover(s)}
            onClick={s.comingSoon ? undefined : () => navigate(`/series/${s.id}`)}
          />
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
