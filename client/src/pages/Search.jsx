// Search — find stories, series, and episodes by keyword.

import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { useLocalizedCollections, useLocalizedSeries } from '../hooks/useLocalizedData.js';
import { useSearch } from '../hooks/useSearch.js';
import { playLesson } from '../utils/storyHelpers.js';
import { TRADITIONS, THEMES } from '../data/culturalLessons.js';
import StoryTile from '../components/cards/StoryTile.jsx';
import SeriesCard from '../components/cards/SeriesCard.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { load } = usePlayer();
  const { profile } = useFamilyProfile();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons } = useWisdomData();
  const collections = useLocalizedCollections();
  const series = useLocalizedSeries();
  const inputRef = useRef(null);
  const [recentList, setRecentList] = useState([]);

  const beliefs = profile?.beliefs || [];

  const {
    query, setQuery,
    traditionFilter, toggleTradition,
    themeFilter, toggleTheme,
    results,
    getRecent, addRecent, clearRecent,
  } = useSearch({ allLessons, series, collections, beliefs });

  // Auto-focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Load recent searches on mount
  useEffect(() => { setRecentList(getRecent()); }, [getRecent]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  const handleSearch = (q) => {
    setQuery(q);
    if (q.trim()) {
      addRecent(q.trim());
      setRecentList(getRecent());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      addRecent(query.trim());
      setRecentList(getRecent());
    }
  };

  const handleRecentTap = (q) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  const handleClearRecent = () => {
    clearRecent();
    setRecentList([]);
  };

  const hasQuery = query.trim().length > 0;
  const hasFilters = traditionFilter || themeFilter;
  const showResults = hasQuery || hasFilters;

  return (
    <PageTransition className="page-scroll">
      <div className="px-4 pt-4 max-w-3xl mx-auto">

        {/* Search bar */}
        <div className="sticky top-0 z-20 bg-bg-base/95 backdrop-blur-xl pb-3 -mx-4 px-4 pt-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search stories, series, themes..."
              className="w-full rounded-2xl bg-bg-surface pl-11 pr-10 py-3.5 text-sm text-ink-base ring-1 ring-white/5 outline-none focus:ring-gold/30 placeholder:text-ink-muted"
            />
            {hasQuery && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink-base">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="space-y-2 mb-4">
          {/* Traditions */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TRADITIONS.map(t => (
              <button
                key={t.key}
                onClick={() => toggleTradition(t.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${
                  traditionFilter === t.key
                    ? 'bg-gold/20 text-gold ring-gold/30'
                    : 'bg-bg-surface text-ink-muted ring-white/5 hover:text-ink-base'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          {/* Themes */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {THEMES.map(t => (
              <button
                key={t.key}
                onClick={() => toggleTheme(t.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${
                  themeFilter === t.key
                    ? 'bg-gold/20 text-gold ring-gold/30'
                    : 'bg-bg-surface text-ink-muted ring-white/5 hover:text-ink-base'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches (when no query/filters) */}
        {!showResults && recentList.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-ink-base">Recent Searches</h3>
              <button onClick={handleClearRecent} className="flex items-center gap-1 text-[10px] text-ink-muted hover:text-ink-base">
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <div className="space-y-1">
              {recentList.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentTap(q)}
                  className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink-muted hover:bg-bg-surface hover:text-ink-base transition"
                >
                  <Clock size={14} className="shrink-0 opacity-40" />
                  <span className="truncate">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Browse prompt (when no query/filters and no recent) */}
        {!showResults && recentList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-ink-muted">Search for any story, series, or theme</p>
            <p className="text-xs text-ink-muted/60 mt-1">Or tap a tradition or theme above to browse</p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <>
            {/* Result count */}
            <p className="text-xs text-ink-muted mb-4">
              {results.total === 0 ? 'No results' : `${results.total} result${results.total !== 1 ? 's' : ''}`}
              {hasQuery && <span className="text-gold"> for "{query.trim()}"</span>}
            </p>

            {/* Stories */}
            {results.stories.length > 0 && (
              <ShelfSection title={`Stories (${results.stories.length})`}>
                <ShelfRow>
                  {results.stories.map(lesson => (
                    <StoryTile
                      key={lesson.id}
                      lesson={lesson}
                      imageUrl={wisdomImageUrls?.[lesson.id]}
                      onPlay={handlePlay}
                    />
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {/* Series */}
            {results.series.length > 0 && (
              <ShelfSection title={`Series (${results.series.length})`}>
                <ShelfRow>
                  {results.series.map(s => (
                    <SeriesCard
                      key={s.id}
                      series={s}
                      onClick={() => navigate(`/series/${s.id}`)}
                    />
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {/* Episodes */}
            {results.episodes.length > 0 && (
              <ShelfSection title={`Episodes (${results.episodes.length})`}>
                <ShelfRow>
                  {results.episodes.map(ep => (
                    <div key={ep.id} className="shrink-0">
                      <StoryTile
                        lesson={ep}
                        imageUrl={wisdomImageUrls?.[ep.id]}
                        onPlay={handlePlay}
                      />
                      <p className="text-[10px] text-ink-muted mt-1 w-40 truncate text-center">
                        {ep.seriesIcon} {ep.seriesTitle}
                      </p>
                    </div>
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {/* Empty state */}
            {results.total === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🌙</p>
                <p className="text-sm text-ink-base font-bold">No stories found</p>
                <p className="text-xs text-ink-muted mt-1">Try a different search or browse by tradition</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
