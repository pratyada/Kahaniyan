// V2 Listen — DATA CONTAINER. Wires real data (search, filters, category shelves,
// played state) and hands plain props to <ListenView>. Free/generic audio.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useSearch } from '../../hooks/useSearch.js';
import { buildTraditionShelves, buildThemeShelves } from '../../utils/shelfBuilder.js';
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

  // Featured carousel (6 stories) — needs raw lessons + an image map
  const heroLessons = useMemo(() => lessonsRaw.slice(0, 6), [lessonsRaw]);
  const heroImages = useMemo(() => {
    const m = {}; heroLessons.forEach((l) => { if (img(l.id)) m[l.id] = img(l.id); }); return m;
  }, [heroLessons, wisdomImageUrls]);

  const topWeek = useMemo(() => seriesRaw.slice(0, 6).map((s) => ({ series: s, coverImage: cover(s) })), [seriesRaw, wisdomImageUrls]);
  const seriesList = useMemo(() => seriesRaw.map((s) => ({ series: s, coverImage: cover(s) })), [seriesRaw, wisdomImageUrls]);

  // Category shelves — by tradition, then by value/theme (makes Listen full & browsable)
  const shelves = useMemo(() => {
    const trad = buildTraditionShelves(lessonsRaw, beliefs);
    const theme = buildThemeShelves(lessonsRaw, beliefs);
    return [...trad, ...theme]
      .filter((sh) => sh.stories?.length >= 2)
      .map((sh) => ({ id: sh.id, title: sh.title, stories: toCards(sh.stories.slice(0, 14)) }));
  }, [lessonsRaw, beliefs, wisdomImageUrls]);

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
      // browse
      heroLessons={heroLessons}
      heroImages={heroImages}
      topWeek={topWeek}
      shelves={shelves}
      seriesList={seriesList}
      // actions
      onPlay={(lesson) => { load(buildStory(lesson, wisdomAudioUrls || {}, wisdomImageUrls || {})); navigate(`/v2/player/${lesson.id}`); }}
      onOpenSeries={(id) => navigate(`/v2/series/${id}`)}
      onOpenVoice={() => navigate('/v2/profile')}
    />
  );
}
