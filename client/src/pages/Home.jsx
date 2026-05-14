// Home — Netflix/Pocket FM style content browser.
// Thin orchestrator: all UI lives in dedicated component files.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import CreateFAB from '../components/CreateFAB.jsx';
import CreateSheet from '../components/CreateSheet.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import StoryTile from '../components/cards/StoryTile.jsx';
import ContinueListeningShelf from '../components/shelves/ContinueListeningShelf.jsx';
import TrendingShelf from '../components/shelves/TrendingShelf.jsx';
import SkeletonShelf from '../components/SkeletonShelf.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { pickTonightStory, playLesson, recommendedValueFor } from '../utils/storyHelpers.js';
import { buildTraditionShelves, buildThemeShelves, buildAgeShelf } from '../utils/shelfBuilder.js';

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons, loading: dataLoading } = useWisdomData();

  const [createOpen, setCreateOpen] = useState(false);

  const beliefs = profile?.beliefs || [];
  const age = profile?.age || 6;

  // Tonight's featured story
  const tonightStory = useMemo(
    () => pickTonightStory(beliefs, allLessons),
    [beliefs, allLessons]
  );

  // Build all shelves
  const traditionShelves = useMemo(
    () => buildTraditionShelves(allLessons, beliefs),
    [allLessons, beliefs]
  );
  const themeShelves = useMemo(
    () => buildThemeShelves(allLessons, beliefs),
    [allLessons, beliefs]
  );
  const ageShelf = useMemo(
    () => buildAgeShelf(allLessons, age, beliefs),
    [allLessons, age, beliefs]
  );

  // Recommended picks for the child
  const recommended = useMemo(() => recommendedValueFor(age), [age]);
  const tonightPicks = useMemo(() => {
    let pool = allLessons.filter(
      (l) => beliefs.length > 0
        ? beliefs.includes(l.tradition) || l.tradition === 'universal'
        : l.tradition === 'universal' || true
    );
    // Shuffle deterministically by day, pick 10
    const day = Math.floor(Date.now() / 86400000);
    return pool
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 7) >>> 0) % 1000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 10);
  }, [allLessons, beliefs]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  const handleContinuePlay = (entry) => {
    const lesson = allLessons.find((l) => `lesson_${l.id}` === entry.storyId || l.id === entry.storyId);
    if (lesson) {
      playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
    } else {
      navigate('/player');
    }
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <PageTransition className="relative page-scroll px-5 pt-10 safe-top">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center lg:text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {greeting}
        </p>
        <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          A story for <span className="text-gold">{profile?.childName || 'your child'}</span>
        </h1>
      </motion.header>

      {/* Hero — Tonight's Featured Story */}
      <HeroBanner
        story={tonightStory}
        imageUrl={wisdomImageUrls[tonightStory?.id]}
        onPlay={handlePlay}
      />

      {/* Continue Listening */}
      <ContinueListeningShelf
        wisdomImageUrls={wisdomImageUrls}
        onPlay={handleContinuePlay}
      />

      {/* Loading skeletons while Firestore data loads */}
      {dataLoading && (
        <>
          <SkeletonShelf />
          <SkeletonShelf />
          <SkeletonShelf count={3} />
        </>
      )}

      {/* Tonight's Picks */}
      {!dataLoading && tonightPicks.length > 0 && (
        <ShelfSection title={`✨ Tonight's Picks for ${profile?.childName || 'You'}`}>
          <ShelfRow>
            {tonightPicks.map((lesson) => (
              <StoryTile
                key={lesson.id}
                lesson={lesson}
                imageUrl={wisdomImageUrls[lesson.id]}
                onPlay={handlePlay}
              />
            ))}
          </ShelfRow>
        </ShelfSection>
      )}

      {/* Trending */}
      <TrendingShelf
        allLessons={allLessons}
        wisdomImageUrls={wisdomImageUrls}
        onPlay={handlePlay}
      />

      {/* Age-based shelf */}
      {ageShelf && (
        <ShelfSection title={ageShelf.title}>
          <ShelfRow>
            {ageShelf.stories.map((lesson) => (
              <StoryTile
                key={lesson.id}
                lesson={lesson}
                imageUrl={wisdomImageUrls[lesson.id]}
                onPlay={handlePlay}
              />
            ))}
          </ShelfRow>
        </ShelfSection>
      )}

      {/* Tradition shelves */}
      {traditionShelves.map((shelf) => (
        <ShelfSection key={shelf.id} title={shelf.title}>
          <ShelfRow>
            {shelf.stories.map((lesson) => (
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

      {/* Theme shelves */}
      {themeShelves.map((shelf) => (
        <ShelfSection key={shelf.id} title={shelf.title}>
          <ShelfRow>
            {shelf.stories.map((lesson) => (
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

      {/* Create Story FAB + Sheet */}
      <CreateFAB onClick={() => setCreateOpen(true)} />
      <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Bottom padding for nav + player bar */}
      <div className="h-40" />
    </PageTransition>
  );
}
