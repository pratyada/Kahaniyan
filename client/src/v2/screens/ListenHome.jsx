// V2 Listen — DATA CONTAINER. Wires real data (search, filters, category shelves,
// played state) and hands plain props to <ListenView>. Free/generic audio.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useSearch } from '../../hooks/useSearch.js';
import { buildTraditionShelves, buildAgeShelf, buildUniversalLearningPath } from '../../utils/shelfBuilder.js';
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
  // Universal = no specific belief → show ONLY universal stories, no religion filters/shelves.
  const isUniversal = !(beliefs && beliefs.length) || (beliefs.length === 1 && String(beliefs[0]).toLowerCase() === 'universal');

  const img = (id) => wisdomImageUrls?.[id] || null;
  const cover = (s) => (s.episodes || []).map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean) || null;
  const toCards = (arr) => (arr || []).map((l) => ({ lesson: l, imageUrl: img(l.id) || l.coverImage || null }));

  const seriesRaw = useMemo(() => (SERIES || []).filter((s) => !s.comingSoon && s.episodes?.length), []);
  const lessonsAll = useMemo(() => (allLessons || []).filter((l) => l && l.body && l.title), [allLessons]);
  // Story pool — universal users never see religion-tagged stories.
  const lessonsRaw = useMemo(
    () => (isUniversal ? lessonsAll.filter((l) => !l.tradition || l.tradition === 'universal') : lessonsAll),
    [lessonsAll, isUniversal]
  );

  const { query, setQuery, results, traditionFilter, toggleTradition, themeFilter, toggleTheme } =
    useSearch({ allLessons: lessonsRaw, series: seriesRaw, collections: COLLECTIONS, beliefs });

  // Browse feed — built with a GLOBAL de-dup set so no story (or series) repeats
  // across the carousel + shelves (matches production's variation). Prefer tradition
  // + age shelves (not theme, which double-counts every story).
  const browse = useMemo(() => {
    const seen = new Set();
    const seenSeries = new Set();

    // Universal users never see religion-tagged SERIES either (a series is secular
    // only if every episode is universal/untagged — excludes Sikh/Islamic/etc.).
    const seriesPool = isUniversal
      ? seriesRaw.filter((s) => (s.episodes || []).every((e) => !e.tradition || e.tradition === 'universal'))
      : seriesRaw;

    // Category shelves. Universal (no-belief) users get the curated secular
    // "learning path" drawn from universal SERIES episodes (50+ stories, no
    // religion). Belief users get "for your age" + their tradition shelves.
    const rawShelves = isUniversal
      ? buildUniversalLearningPath(seriesRaw, lessonsRaw)
      : [
          ...(buildAgeShelf(lessonsRaw, profile?.age || 6, beliefs) ? [buildAgeShelf(lessonsRaw, profile?.age || 6, beliefs)] : []),
          ...buildTraditionShelves(lessonsRaw, beliefs),
        ];

    // Featured carousel (6 diverse stories). Universal: one from each of the first
    // categories so the hero is varied; belief: first 6 lessons. Reserved so they
    // don't repeat below.
    let heroLessons = [];
    if (isUniversal) {
      for (const sh of rawShelves) {
        if (heroLessons.length >= 6) break;
        const s0 = (sh.stories || []).find((x) => !seen.has(x.id));
        if (s0) { heroLessons.push(s0); seen.add(s0.id); }
      }
    } else {
      heroLessons = lessonsRaw.slice(0, 6);
      heroLessons.forEach((l) => seen.add(l.id));
    }
    const heroImages = {}; heroLessons.forEach((l) => { const u = img(l.id) || l.coverImage; if (u) heroImages[l.id] = u; });

    // Top of the Week series (reserved from the All-Series shelf)
    const topWeekRaw = seriesPool.slice(0, 6);
    topWeekRaw.forEach((s) => seenSeries.add(s.id));

    const shelves = rawShelves
      .map((sh) => {
        const fresh = (sh.stories || []).filter((s) => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
        return { id: sh.id, title: sh.title, stories: toCards(fresh.slice(0, 14)) };
      })
      .filter((sh) => sh.stories.length >= 2);

    return {
      heroLessons,
      heroImages,
      topWeek: topWeekRaw.map((s) => ({ series: s, coverImage: cover(s) })),
      seriesList: seriesPool.filter((s) => !seenSeries.has(s.id)).map((s) => ({ series: s, coverImage: cover(s) })),
      shelves,
    };
  }, [lessonsRaw, seriesRaw, beliefs, wisdomImageUrls, profile?.age, isUniversal]);

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
      showTraditions={!isUniversal}
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
