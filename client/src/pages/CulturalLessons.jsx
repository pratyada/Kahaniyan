// Wisdom Stories — shelf-based layout grouped by tradition.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import StoryTile from '../components/cards/StoryTile.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { TRADITIONS, THEMES } from '../data/culturalLessons.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { playLesson } from '../utils/storyHelpers.js';
import { buildTraditionShelves, buildThemeShelves } from '../utils/shelfBuilder.js';

export default function CulturalLessons() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons } = useWisdomData();
  const [activeTheme, setActiveTheme] = useState(null);

  const beliefs = profile?.beliefs || [];

  // Build shelves by tradition
  const traditionShelves = useMemo(
    () => buildTraditionShelves(allLessons, beliefs),
    [allLessons, beliefs]
  );

  // Build shelves by theme
  const themeShelves = useMemo(
    () => buildThemeShelves(allLessons, beliefs),
    [allLessons, beliefs]
  );

  // If a theme is selected, filter to just that theme's shelf
  const displayShelves = useMemo(() => {
    if (!activeTheme) return traditionShelves;
    const themeShelf = themeShelves.find((s) => s.id === `theme-${activeTheme}`);
    if (!themeShelf) return traditionShelves;
    // Group the theme's stories by tradition
    const byTradition = {};
    themeShelf.stories.forEach((l) => {
      if (!byTradition[l.tradition]) byTradition[l.tradition] = [];
      byTradition[l.tradition].push(l);
    });
    return Object.entries(byTradition)
      .filter(([, stories]) => stories.length >= 1)
      .map(([tradition, stories]) => {
        const meta = TRADITIONS.find((t) => t.key === tradition);
        return {
          id: `theme-tradition-${tradition}`,
          title: `${meta?.icon || ''} ${meta?.label || tradition}`,
          stories,
        };
      });
  }, [activeTheme, traditionShelves, themeShelves]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back
        </button>
        <p className="ui-label">Wisdom Stories</p>
        <h1 className="display-title mt-1 text-ink">
          Stories from <span className="text-gold">your beliefs</span>
        </h1>
      </header>

      {/* Theme tabs */}
      <div className="mb-5 -mx-5 flex gap-2 overflow-x-auto px-5 scrollbar-hide">
        <button
          onClick={() => setActiveTheme(null)}
          className={`btn-pill shrink-0 px-4 py-2 text-sm font-bold ${
            !activeTheme ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'
          }`}
        >
          All
        </button>
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTheme(activeTheme === t.key ? null : t.key)}
            className={`btn-pill shrink-0 px-4 py-2 text-sm font-bold ${
              activeTheme === t.key ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Shelf rows grouped by tradition */}
      {displayShelves.length === 0 ? (
        <div className="card-elevated mt-8 text-center">
          <div className="mb-2 text-3xl">🌱</div>
          <p className="text-sm text-ink-muted">No stories for this filter.</p>
        </div>
      ) : (
        displayShelves.map((shelf) => (
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
        ))
      )}

      <VersionFooter />
    </PageTransition>
  );
}
