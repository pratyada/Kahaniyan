// Culture-filtered page — shows ONLY stories + series for one belief.
// Used by shareable links like /?culture=muslim or /culture/muslim

import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import StoryTile from '../components/cards/StoryTile.jsx';
import SeriesCard from '../components/cards/SeriesCard.jsx';
import { TRADITIONS } from '../data/culturalLessons.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { useLocalizedSeries } from '../hooks/useLocalizedData.js';
import { playLesson } from '../utils/storyHelpers.js';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function CulturePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const culture = searchParams.get('culture') || '';
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons } = useWisdomData();
  const SERIES = useLocalizedSeries();
  const [coverImages, setCoverImages] = useState({});

  const meta = TRADITIONS.find(t => t.key === culture) || { label: culture, icon: '🌙' };

  // Load series cover images from Firestore
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomImages'));
        if (snap.exists()) setCoverImages(snap.data());
      } catch {}
    })();
  }, []);

  // Filter stories — ONLY this belief
  const stories = useMemo(() => {
    return allLessons.filter(l => l.tradition === culture);
  }, [allLessons, culture]);

  // Filter series — ONLY this belief
  const series = useMemo(() => {
    return SERIES.filter(s => s.episodes?.[0]?.tradition === culture);
  }, [SERIES, culture]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  const getSeriesCover = (s) => {
    for (const ep of s.episodes) {
      const img = coverImages[ep.id] || wisdomImageUrls[ep.id];
      if (img) return img;
    }
    return null;
  };

  // Group stories by theme
  const storyGroups = useMemo(() => {
    const groups = {};
    stories.forEach(s => {
      const theme = s.theme || 'other';
      if (!groups[theme]) groups[theme] = [];
      groups[theme].push(s);
    });
    return Object.entries(groups)
      .filter(([, arr]) => arr.length > 0)
      .sort((a, b) => b[1].length - a[1].length);
  }, [stories]);

  const ogImage = culture === 'muslim' ? 'https://mysleepytale.com/og/islamic.png' : 'https://mysleepytale.com/og/cover.jpg';

  return (
    <PageTransition className="page-scroll safe-top">
      <Helmet>
        <title>{meta.label} Bedtime Stories for Kids | My Sleepy Tale</title>
        <meta name="description" content={`${stories.length} stories + ${series.length} series — ${meta.label} bedtime stories personalized with your child's name. Free on My Sleepy Tale.`} />
        <meta property="og:title" content={`${meta.label} Bedtime Stories for Kids | My Sleepy Tale`} />
        <meta property="og:description" content={`${stories.length} stories + ${series.length} series — ${meta.label} bedtime stories personalized with your child's name. Free.`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://mysleepytale.com/?culture=${culture}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Hero header */}
      <div className="relative px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-[11px] font-bold text-gold uppercase tracking-wider"
          >
            See All Stories
          </button>
        </div>

        <div className="text-center mb-2">
          <span className="text-5xl mb-3 block">{meta.icon}</span>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
            {meta.label} Stories
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            {stories.length} stories + {series.length} series
          </p>
        </div>
      </div>

      {/* Series section */}
      {series.length > 0 && (
        <ShelfSection title={`${meta.icon} ${meta.label} Series`} subtitle={`${series.length} series to explore`}>
          <ShelfRow>
            {series.map(s => (
              <SeriesCard
                key={s.id}
                series={s}
                coverImage={getSeriesCover(s)}
                onClick={() => navigate(`/series/${s.id}`)}
              />
            ))}
          </ShelfRow>
        </ShelfSection>
      )}

      {/* Stories grouped by theme */}
      {storyGroups.map(([theme, themeStories]) => (
        <ShelfSection key={theme} title={`${theme.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`}>
          <ShelfRow>
            {themeStories.map(lesson => (
              <StoryTile
                key={lesson.id}
                lesson={lesson}
                imageUrl={wisdomImageUrls[lesson.id]}
                onPlay={handlePlay}
              />
            ))}
          </ShelfRow>
        </ShelfSection>
      ))}

      {/* Empty state */}
      {stories.length === 0 && series.length === 0 && (
        <div className="px-5 py-20 text-center">
          <p className="text-4xl mb-3">{meta.icon}</p>
          <p className="text-sm text-ink-muted">No {meta.label} stories yet. Coming soon!</p>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-40" />
    </PageTransition>
  );
}
