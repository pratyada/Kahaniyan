// Home — Netflix/Pocket FM style content browser.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import CreateFAB from '../components/CreateFAB.jsx';
import CreateSheet from '../components/CreateSheet.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import StoryTile from '../components/cards/StoryTile.jsx';
import TrendingShelf from '../components/shelves/TrendingShelf.jsx';
import SkeletonShelf from '../components/SkeletonShelf.jsx';
import StreakBadge from '../components/StreakBadge.jsx';
import MilestoneCelebration from '../components/MilestoneCelebration.jsx';
import MorningRecapShelf from '../components/shelves/MorningRecapShelf.jsx';
import SEOHead from '../components/SEOHead.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { THEMES } from '../data/culturalLessons.js';
import { COLLECTIONS } from '../data/collections.js';
import { playLesson, recommendedValueFor } from '../utils/storyHelpers.js';
import { buildTraditionShelves, buildAgeShelf } from '../utils/shelfBuilder.js';
import { fillTokens } from '../utils/storyHelpers.js';

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons, loading: dataLoading } = useWisdomData();

  const [createOpen, setCreateOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(null);

  const beliefs = profile?.beliefs || [];
  const age = profile?.age || 6;

  // Featured stories for hero slider
  const featuredStories = useMemo(() => {
    let pool = allLessons.filter(
      (l) => beliefs.length > 0 ? beliefs.includes(l.tradition) || l.tradition === 'universal' : true
    );
    if (pool.length < 5) pool = allLessons;
    const day = Math.floor(Date.now() / 86400000);
    return pool
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 3) >>> 0) % 10000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 5);
  }, [allLessons, beliefs]);

  // Tonight's picks
  const tonightPicks = useMemo(() => {
    let pool = allLessons.filter(
      (l) => beliefs.length > 0 ? beliefs.includes(l.tradition) || l.tradition === 'universal' : true
    );
    const day = Math.floor(Date.now() / 86400000);
    return pool
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 7) >>> 0) % 1000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 10);
  }, [allLessons, beliefs]);

  // Theme-filtered stories
  const themeStories = useMemo(() => {
    if (!activeTheme) return [];
    return allLessons
      .filter((l) => l.theme === activeTheme)
      .filter((l) => beliefs.length > 0 ? beliefs.includes(l.tradition) || l.tradition === 'universal' : true);
  }, [activeTheme, allLessons, beliefs]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  const handlePlayCollection = (story) => {
    // Collection stories are inline objects — load directly
    const filledText = fillTokens(story.body || '', profile);
    const storyObj = {
      id: story.id,
      title: story.title,
      text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: story.durationMinutes,
      value: 'kindness',
      language: profile?.language || 'English',
      voice: 'AI Narrator',
      tradition: story.tradition,
      source: story.source,
      createdAt: new Date().toISOString(),
      isWisdom: true,
    };
    load(storyObj);
    navigate('/player');
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <PageTransition className="relative page-scroll px-5 pt-10 safe-top">
      <SEOHead
        title="Bedtime Stories for Kids — Personalized & Cultural"
        description="The #1 bedtime story app for multicultural families in Toronto."
        path="/"
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)' }} />

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="mb-6 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {greeting}
        </p>
        <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          A story for <span className="text-gold">{profile?.childName || 'your child'}</span>
        </h1>
      </motion.header>

      {/* Streak */}
      <StreakBadge />

      {/* Morning recap */}
      <MorningRecapShelf />

      {/* Hero slider */}
      <HeroSlider stories={featuredStories} wisdomImageUrls={wisdomImageUrls} onPlay={handlePlay} />

      {/* Loading skeletons */}
      {dataLoading && <><SkeletonShelf /><SkeletonShelf /><SkeletonShelf count={3} /></>}

      {/* 1. Tonight's Picks */}
      {!dataLoading && tonightPicks.length > 0 && (
        <ShelfSection title={`✨ Tonight's Picks for ${profile?.childName || 'You'}`}>
          <ShelfRow>
            {tonightPicks.map((lesson) => (
              <StoryTile key={lesson.id} lesson={lesson} imageUrl={wisdomImageUrls[lesson.id]} onPlay={handlePlay} />
            ))}
          </ShelfRow>
        </ShelfSection>
      )}

      {/* 2. Trending */}
      <TrendingShelf allLessons={allLessons} wisdomImageUrls={wisdomImageUrls} onPlay={handlePlay} />

      {/* 3. Browse by Value — interactive filter */}
      <section className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          Browse by Value
        </h3>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
          {THEMES.map((t) => (
            <button key={t.key} onClick={() => setActiveTheme(activeTheme === t.key ? null : t.key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${
                activeTheme === t.key ? 'bg-gold text-bg-base shadow-glow' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
              }`}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
        {activeTheme && themeStories.length > 0 && (
          <ShelfRow>
            {themeStories.map((lesson) => (
              <StoryTile key={lesson.id} lesson={lesson} imageUrl={wisdomImageUrls[lesson.id]} onPlay={handlePlay} />
            ))}
          </ShelfRow>
        )}
      </section>

      {/* 4-11. Collections */}
      {COLLECTIONS.map((col) => (
        <ShelfSection key={col.id} title={col.title} subtitle={col.subtitle}>
          <ShelfRow>
            {col.stories.map((story) => (
              <StoryTile
                key={story.id}
                lesson={story}
                imageUrl={wisdomImageUrls[story.id]}
                onPlay={() => handlePlayCollection(story)}
              />
            ))}
          </ShelfRow>
        </ShelfSection>
      ))}

      {/* Create Story FAB + Sheet */}
      <CreateFAB onClick={() => setCreateOpen(true)} />
      <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Bottom padding */}
      <div className="h-40" />

      {/* Milestone celebration overlay */}
      <MilestoneCelebration />
    </PageTransition>
  );
}
