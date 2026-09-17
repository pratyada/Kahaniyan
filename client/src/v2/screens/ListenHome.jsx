// V2 Listen — DATA CONTAINER. Wires real data (search, filters, category shelves,
// played state) and hands plain props to <ListenView>. Free/generic audio.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useSearch } from '../../hooks/useSearch.js';
import { buildTraditionShelves, buildAgeShelf } from '../../utils/shelfBuilder.js';
import { SERIES } from '../../data/series.js';
import { COLLECTIONS } from '../../data/collections.js';
import { buildStory } from '../play.js';
import { loadPlayed } from '../played.js';
import ListenView from './ListenView.jsx';

export default function ListenHome() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { allLessons, wisdomImageUrls, wisdomAudioUrls, loading } = useWisdomData();
  const { load } = usePlayer();

  const childName = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;
  const streak = Number((typeof localStorage !== 'undefined' && localStorage.getItem('mst:streak')) || 1);
  const beliefs = profile?.beliefs || [];

  const img = (id) => wisdomImageUrls?.[id] || null;
  const cover = (s) => (s.episodes || []).map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean) || null;
  const toCards = (arr) => (arr || []).map((l) => ({ lesson: l, imageUrl: img(l.id) }));

  const seriesRaw = useMemo(() => (SERIES || []).filter((s) => !s.comingSoon && s.episodes?.length), []);
  const lessonsRaw = useMemo(() => (allLessons || []).filter((l) => l && l.body && l.title), [allLessons]);

  const { query, setQuery, results, traditionFilter, toggleTradition, themeFilter, toggleTheme } =
    useSearch({ allLessons: lessonsRaw, series: seriesRaw, collections: COLLECTIONS, beliefs });

  // Browse feed — built with a GLOBAL de-dup set so no story (or series) repeats
  // across the carousel + shelves (matches production's variation). Prefer tradition
  // + age shelves (not theme, which double-counts every story).
  const browse = useMemo(() => {
    const seen = new Set();
    const seenSeries = new Set();

    // Featured carousel (6 diverse stories) — reserved so they don't repeat below
    const heroLessons = lessonsRaw.slice(0, 6);
    heroLessons.forEach((l) => seen.add(l.id));
    const heroImages = {}; heroLessons.forEach((l) => { if (img(l.id)) heroImages[l.id] = img(l.id); });

    // Top of the Week series (reserved from the All-Series shelf)
    const topWeekRaw = seriesRaw.slice(0, 6);
    topWeekRaw.forEach((s) => seenSeries.add(s.id));

    // Story shelves: "for your age" first, then by tradition — each de-duped
    const ageShelf = buildAgeShelf(lessonsRaw, profile?.age || 6, beliefs);
    const raw = [...(ageShelf ? [ageShelf] : []), ...buildTraditionShelves(lessonsRaw, beliefs)];
    const shelves = raw
      .map((sh) => {
        const fresh = (sh.stories || []).filter((s) => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
        return { id: sh.id, title: sh.title, stories: toCards(fresh.slice(0, 14)) };
      })
      .filter((sh) => sh.stories.length >= 2);

    return {
      heroLessons,
      heroImages,
      topWeek: topWeekRaw.map((s) => ({ series: s, coverImage: cover(s) })),
      seriesList: seriesRaw.filter((s) => !seenSeries.has(s.id)).map((s) => ({ series: s, coverImage: cover(s) })),
      shelves,
    };
  }, [lessonsRaw, seriesRaw, beliefs, wisdomImageUrls, profile?.age]);

  const searchStories = useMemo(() => toCards([...(results.stories || []), ...(results.episodes || [])]), [results, wisdomImageUrls]);
  const searchSeries = useMemo(() => (results.series || []).map((s) => ({ series: s, coverImage: cover(s) })), [results, wisdomImageUrls]);

  const playedSet = loadPlayed();

  return (
    <ListenView
      childName={childName}
      streak={streak}
      loading={loading && lessonsRaw.length === 0}
      playedSet={playedSet}
      // search + filters
      query={query}
      onSearch={setQuery}
      traditionFilter={traditionFilter}
      themeFilter={themeFilter}
      onToggleTradition={toggleTradition}
      onToggleTheme={toggleTheme}
      onClearFilters={() => { if (traditionFilter) toggleTradition(traditionFilter); if (themeFilter) toggleTheme(themeFilter); }}
      results={{ stories: searchStories, series: searchSeries, total: results.total }}
      // browse (de-duped)
      heroLessons={browse.heroLessons}
      heroImages={browse.heroImages}
      topWeek={browse.topWeek}
      shelves={browse.shelves}
      seriesList={browse.seriesList}
      // actions
      onPlay={(lesson) => { load(buildStory(lesson, wisdomAudioUrls || {}, wisdomImageUrls || {})); navigate(`/v2/player/${lesson.id}`); }}
      onOpenSeries={(id) => navigate(`/v2/series/${id}`)}
      onOpenVoice={() => navigate('/v2/voices')}
    />
  );
}
