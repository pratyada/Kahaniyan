// Home — Netflix/Pocket FM style content browser.

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import CreateFAB from '../components/CreateFAB.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import StoryTile from '../components/cards/StoryTile.jsx';
import TrendingShelf from '../components/shelves/TrendingShelf.jsx';
import StreakBadge from '../components/StreakBadge.jsx';
import MilestoneCelebration from '../components/MilestoneCelebration.jsx';
import MorningRecapShelf from '../components/shelves/MorningRecapShelf.jsx';
import SEOHead from '../components/SEOHead.jsx';
import SeriesShelf from '../components/shelves/SeriesShelf.jsx';
import CuratorShelf from '../components/shelves/CuratorShelf.jsx';
import CategoryShelves from '../components/shelves/CategoryShelves.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { THEMES } from '../data/culturalLessons.js';
import { useLocalizedCollections, useLocalizedSeries } from '../hooks/useLocalizedData.js';
import { useSearch } from '../hooks/useSearch.js';
import SeriesCard from '../components/cards/SeriesCard.jsx';
import { playLesson, recommendedValueFor } from '../utils/storyHelpers.js';
import { buildTraditionShelves, buildAgeShelf } from '../utils/shelfBuilder.js';
import { fillTokens } from '../utils/storyHelpers.js';
import CulturePage from './CulturePage.jsx';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { wisdomAudioUrls, wisdomImageUrls, allLessons, loading: dataLoading } = useWisdomData();
  const COLLECTIONS = useLocalizedCollections();
  const SERIES_BUILTIN = useLocalizedSeries();
  const [firestoreSeries, setFirestoreSeries] = useState([]);
  const [firestoreStories, setFirestoreStories] = useState([]);
  const [searchParams] = useSearchParams();
  const cultureFilter = searchParams.get('culture'); // e.g. ?culture=muslim
  const beliefs = profile?.beliefs || [];

  // Load published user-created series from Firestore
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, getDocs } = await import('firebase/firestore');
        const [serSnap, storySnap] = await Promise.all([
          getDocs(collection(db, 'creatorSeries')),
          getDocs(collection(db, 'creatorStories')),
        ]);
        // Exclude Prat's bulk-imported content from community section
        const isBuiltIn = (data) => {
          const email = (data.authorEmail || '').toLowerCase();
          const name = (data.authorName || '').toLowerCase();
          return email === 'prateekyadav2010@gmail.com' || (name === 'prateek yadav' && !email);
        };
        const publishedSeries = [];
        serSnap.forEach(d => {
          const data = d.data();
          if (data.status === 'published' && data.episodes?.length > 0) {
            publishedSeries.push({ id: d.id, ...data, totalEpisodes: data.episodes.length, _isBuiltIn: isBuiltIn(data) });
          }
        });
        setFirestoreSeries(publishedSeries);
        const publishedStories = [];
        storySnap.forEach(d => {
          const data = d.data();
          if (data.status === 'published' && data.body && !isBuiltIn(data)) {
            publishedStories.push({ id: d.id, ...data, durationMinutes: Math.max(1, Math.round((data.body || '').split(/\s+/).length / 150)) });
          }
        });
        setFirestoreStories(publishedStories);
      } catch {}
    })();
  }, []);

  // Merge built-in + Firestore series (deduped)
  const SERIES = useMemo(() => {
    const builtInIds = new Set(SERIES_BUILTIN.map(s => s.id));
    return [...SERIES_BUILTIN, ...firestoreSeries.filter(s => !builtInIds.has(s.id))];
  }, [SERIES_BUILTIN, firestoreSeries]);

  // Merge built-in lessons + Firestore user stories for search
  const allLessonsWithFirestore = useMemo(() => {
    const builtInIds = new Set(allLessons.map(l => l.id));
    return [...allLessons, ...firestoreStories.filter(s => !builtInIds.has(s.id))];
  }, [allLessons, firestoreStories]);

  // Culture filter → dedicated page
  if (cultureFilter) return <CulturePage />;

  // Unified view — no more toggle

  // FIFA banner — show once per session
  const [showFifaBanner, setShowFifaBanner] = useState(() => {
    try { return !sessionStorage.getItem('mst:fifa-series-banner-dismissed'); } catch { return true; }
  });
  useEffect(() => {
    if (!showFifaBanner) return;
    const timer = setTimeout(() => {
      setShowFifaBanner(false);
      try { sessionStorage.setItem('mst:fifa-series-banner-dismissed', '1'); } catch {}
    }, 5000);
    return () => clearTimeout(timer);
  }, [showFifaBanner]);
  const dismissFifaBanner = () => {
    setShowFifaBanner(false);
    try { sessionStorage.setItem('mst:fifa-series-banner-dismissed', '1'); } catch {}
  };

  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults } = useSearch({
    allLessons: allLessonsWithFirestore, series: SERIES, collections: COLLECTIONS, beliefs,
  });
  const [activeTheme, setActiveTheme] = useState('compassion-animals');
  const [visibleCollections, setVisibleCollections] = useState(8);

  // Shared with me
  const [sharedSeries, setSharedSeries] = useState([]);
  const [sharedLoading, setSharedLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) { setSharedSeries([]); return; }
    setSharedLoading(true);
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        if (!db) { setSharedLoading(false); return; }
        const q = query(collection(db, 'creatorSeries'), where('sharedWith', 'array-contains', user.email.toLowerCase()));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => {
          const data = d.data();
          if (data.authorUid !== user.uid) items.push({ id: d.id, ...data });
        });
        setSharedSeries(items);
      } catch {}
      setSharedLoading(false);
    })();
  }, [user]);

  // Onboarding popup state
  const needsOnboarding = user && !profile?.childName;
  const [obName, setObName] = useState('');
  const [obAge, setObAge] = useState('');
  const [obStep, setObStep] = useState(0); // 0=name, 1=age, 2=language

  // Load more collections as user scrolls
  useEffect(() => {
    if (collectionId) return;
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom > docHeight - 800 && visibleCollections < COLLECTIONS.length) {
        setVisibleCollections(v => Math.min(v + 2, COLLECTIONS.length));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCollections, collectionId]);

  const age = profile?.age || 6;

  // Filter: URL culture param overrides profile beliefs
  const effectiveBeliefs = cultureFilter ? [cultureFilter] : beliefs;
  const filterByBelief = (lesson) => {
    // URL culture filter — show ONLY that culture's stories
    if (cultureFilter) {
      return lesson.tradition === cultureFilter;
    }
    if (beliefs.length > 0 && !beliefs.includes('universal')) {
      return beliefs.includes(lesson.tradition) || lesson.tradition === 'universal';
    }
    // No beliefs or universal only — show ONLY universal (no religious stories)
    return lesson.tradition === 'universal' || !lesson.tradition;
  };

  // Featured stories for hero slider
  const featuredStories = useMemo(() => {
    const pinIds = ['fifa26_ep1_history', 'multilingual_lion_mouse'];
    let pool = allLessons.filter(filterByBelief);
    if (pool.length < 5) pool = allLessons.filter(l => l.tradition === 'universal');
    const day = Math.floor(Date.now() / 86400000);
    const shuffled = pool
      .filter(l => !pinIds.includes(l.id))
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 3) >>> 0) % 10000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 3);
    // Pin FIFA first, multilingual second, then 3 rotating
    // FIFA episodes are in SERIES data, not allLessons — find them there
    const allSeriesEps = SERIES.flatMap(s => s.episodes.map(ep => ({ ...ep, seriesId: s.id, seriesTitle: s.title })));
    const pinned = pinIds.map(id =>
      allLessons.find(l => l.id === id) || allSeriesEps.find(ep => ep.id === id)
    ).filter(Boolean);
    return [...pinned, ...shuffled];
  }, [allLessons, beliefs]);

  // Tonight's picks
  const tonightPicks = useMemo(() => {
    let pool = allLessons.filter(filterByBelief);
    const day = Math.floor(Date.now() / 86400000);
    return pool
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 7) >>> 0) % 1000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 10);
  }, [allLessons, beliefs]);

  // Wisdom stories grouped by user's selected beliefs (or URL culture filter)
  const traditionShelves = useMemo(
    () => buildTraditionShelves(allLessons, effectiveBeliefs),
    [allLessons, effectiveBeliefs]
  );

  // Theme-filtered stories
  const themeStories = useMemo(() => {
    if (!activeTheme) return [];
    return allLessons
      .filter((l) => l.theme === activeTheme)
      .filter(filterByBelief);
  }, [activeTheme, allLessons, beliefs]);

  const handlePlay = (lesson) => {
    playLesson(lesson, profile, wisdomAudioUrls, load, navigate, user);
  };

  const handlePlayCollection = (story) => {
    // Collection stories are inline objects — load directly
    // Guest: use generic name, not cached profile name
    const filledText = fillTokens(story.body || '', user ? profile : null);
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
    if (h < 12) return t('home.goodMorning');
    if (h < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  })();

  return (
    <PageTransition className="relative page-scroll px-5 pt-10 safe-top">
      {/* FIFA Series Banner */}
      <AnimatePresence>
        {showFifaBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={dismissFifaBanner}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg lg:max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#0a2e0a] via-[#0a0a0f] to-[#1a0a2e]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8 text-center">
                <div className="text-5xl sm:text-6xl mb-3">⚽</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gold mb-2">FIFA World Cup 2026</h2>
                <p className="text-sm sm:text-base text-white/80 mb-1 leading-relaxed">All episodes now available!</p>
                <p className="text-xs sm:text-sm text-white/60 mb-5 leading-relaxed">History, geography, sportsmanship & life lessons — told as bedtime stories for kids.</p>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center gap-3">
                <button
                  onClick={() => { dismissFifaBanner(); navigate('/series/fifa-world-cup-2026'); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-bg-base shadow-glow transition active:scale-95"
                >
                  <Play size={16} fill="currentColor" />
                  Listen Now
                </button>
                <button
                  onClick={dismissFifaBanner}
                  className="rounded-xl bg-white/20 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white/90 backdrop-blur-sm transition active:scale-95"
                >
                  Skip
                </button>
              </div>
              {/* Auto-dismiss countdown bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-gold"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SEOHead
        title="Bedtime Stories for Kids — Personalized & Cultural"
        description="The #1 bedtime story app for multicultural families in Toronto."
        path="/"
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)' }} />

      {/* Collection focus — show ONLY this collection, skip everything else */}
      {collectionId && (() => {
        const focusCol = COLLECTIONS.find((c) => c.id === collectionId);
        if (!focusCol) return <div className="text-center py-12"><p className="text-ink-muted">Collection not found</p><button onClick={() => navigate('/')} className="mt-3 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Go Home</button></div>;
        return (
          <>
            <button onClick={() => navigate('/')} className="mb-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink">
              ← Back to Home
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>{focusCol.title}</h2>
              <p className="mt-1 text-xs text-ink-muted">{focusCol.subtitle} · {focusCol.stories.length} {t('home.stories')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {focusCol.stories.map((story) => (
                <StoryTile key={story.id} lesson={story} imageUrl={wisdomImageUrls[story.id]} onPlay={() => handlePlayCollection(story)} />
              ))}
            </div>
            <div className="h-40" />
          </>
        );
      })()}

      {/* Normal home — only when no collection is focused */}
      {!collectionId && (<>
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="mb-6 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {greeting}
        </p>
        <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          A story for <span className="text-gold">{user ? (profile?.childName || 'your child') : 'your child'}</span>
        </h1>
      </motion.header>

      {/* Culture filter banner */}
      {cultureFilter && (
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-gold/10 px-4 py-3 ring-1 ring-gold/20">
          <div>
            <p className="text-xs font-bold text-gold capitalize">{cultureFilter} Stories</p>
            <p className="text-[10px] text-ink-muted">Showing stories from {cultureFilter} tradition</p>
          </div>
          <button onClick={() => navigate('/')} className="rounded-full bg-bg-surface px-3 py-1 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">
            Show All
          </button>
        </div>
      )}

      {/* Streak + Badges */}
      <StreakBadge />

      {/* Summer Adventure — Today's adventure card (if active) */}
      {user && (() => {
        try {
          const raw = localStorage.getItem('mst:summerAdventure');
          const adv = raw ? JSON.parse(raw) : null;
          if (!adv || adv.status !== 'active') return null;
          return (
            <button onClick={() => navigate('/summer')}
              className="w-full mb-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-gold/20 ring-1 ring-gold/30 p-4 text-left active:scale-98 transition">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌟</span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Summer Adventure</p>
                  <p className="text-sm font-bold text-ink">Continue {adv.childName}'s journey</p>
                  <p className="text-[10px] text-ink-muted mt-0.5">{adv.stats?.daysCompleted || 0} days completed · {adv.stats?.totalXP || 0} XP</p>
                </div>
                <span className="text-gold">→</span>
              </div>
            </button>
          );
        } catch { return null; }
      })()}

      {/* Product Hunt Launch + Sell With Boost */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <a href="https://www.producthunt.com/products/my-sleepy-tale-personalized-audio-book?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-my-sleepy-tale-personalized-audio-book" target="_blank" rel="noopener noreferrer">
          <img alt="My Sleepy Tale on Product Hunt" width="250" height="54" src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1174662&theme=${document.documentElement.dataset.theme === 'day' ? 'light' : 'dark'}&t=1781731481591`} />
        </a>
        <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" aria-label="Listed on Sell With Boost">
          <img alt="Listed on Sell With Boost" height="54" style={{ height: '54px', width: 'auto' }} src="https://sellwithboost.com/badge/listing.svg" />
        </a>
      </div>

      {/* Shared with me — inline pill (when available) */}
      {user && sharedSeries.length > 0 && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => {
              const el = document.getElementById('shared-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full bg-blue-500/15 px-4 py-1.5 text-[11px] font-bold text-blue-400 ring-1 ring-blue-500/30 transition active:scale-95"
          >
            📬 {sharedSeries.length} shared with you
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search stories, series, traditions..."
          className="w-full rounded-xl bg-bg-surface px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/8 outline-none focus:ring-gold/50 transition"
        />
      </div>

      {/* Morning recap */}
      {!searchQuery && <MorningRecapShelf />}

      {/* ═══ SEARCH RESULTS ═══ */}
      {searchQuery.trim().length >= 2 && (() => {
        const { stories, series: matchedSeries, episodes, total } = searchResults;
        return (
          <div className="mb-6">
            <p className="text-xs text-ink-dim mb-3">
              {total === 0 ? 'No results' : `${total} result${total !== 1 ? 's' : ''}`} for "{searchQuery}"
            </p>

            {/* Series matches */}
            {matchedSeries.length > 0 && (
              <ShelfSection title={`Series (${matchedSeries.length})`}>
                <ShelfRow>
                  {matchedSeries.map(s => (
                    <SeriesCard key={s.id} series={s} onClick={() => navigate(`/series/${s.id}`)} />
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {/* Story matches */}
            {stories.length > 0 && (
              <ShelfSection title={`Stories (${stories.length})`}>
                <ShelfRow>
                  {stories.map(lesson => (
                    <StoryTile key={lesson.id} lesson={lesson} imageUrl={wisdomImageUrls[lesson.id]} onPlay={handlePlay} />
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {/* Episode matches */}
            {episodes.length > 0 && (
              <ShelfSection title={`Episodes (${episodes.length})`}>
                <ShelfRow>
                  {episodes.map(ep => (
                    <div key={ep.id} className="shrink-0">
                      <StoryTile lesson={ep} imageUrl={wisdomImageUrls?.[ep.id]} onPlay={handlePlay} />
                      <p className="text-[10px] text-ink-muted mt-1 w-40 truncate text-center">
                        {ep.seriesIcon} {ep.seriesTitle}
                      </p>
                    </div>
                  ))}
                </ShelfRow>
              </ShelfSection>
            )}

            {total === 0 && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🌙</p>
                <p className="text-sm text-ink-base font-bold">No stories found</p>
                <p className="text-xs text-ink-muted mt-1">Try a different keyword</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══ UNIFIED VIEW — Hero → Picks → Categories → Trending → Shared ═══ */}
      {!searchQuery && (() => {
        const shownIds = new Set();
        const dedupe = (stories) => stories.filter(s => { if (shownIds.has(s.id)) return false; shownIds.add(s.id); return true; });
        const featuredDeduped = dedupe(featuredStories);
        const tonightDeduped = dedupe(tonightPicks);
        return (<>
          {/* Hero slider */}
          <HeroSlider stories={featuredDeduped} wisdomImageUrls={wisdomImageUrls} onPlay={handlePlay} />

          {/* 1. Tonight's Picks */}
          {tonightDeduped.length > 0 && (
            <ShelfSection title={`✨ Tonight's Picks for ${user ? (profile?.childName || 'You') : 'You'}`}>
              <ShelfRow>
                {tonightDeduped.map((lesson) => (
                  <StoryTile key={lesson.id} lesson={lesson} imageUrl={wisdomImageUrls[lesson.id]} onPlay={handlePlay} />
                ))}
              </ShelfRow>
            </ShelfSection>
          )}

          {/* 2. Series by Category — Netflix-style shelves */}
          <CategoryShelves wisdomImageUrls={wisdomImageUrls} cultureFilter={cultureFilter} />

          {/* 3. Trending */}
          <TrendingShelf allLessons={allLessons} wisdomImageUrls={wisdomImageUrls} onPlay={handlePlay} shownIds={shownIds} />
        </>);
      })()}

      {/* ═══ SHARED WITH ME ═══ */}
      {!searchQuery && user && sharedSeries.length > 0 && (
        <div id="shared-section" className="space-y-6 mb-8">
          <ShelfSection title="📬 Shared with Me">
            <ShelfRow>
              {sharedSeries.map(s => (
                <SeriesCard key={s.id} series={s} onClick={() => navigate(`/series/${s.id}`)} />
              ))}
            </ShelfRow>
          </ShelfSection>
        </div>
      )}

      {!searchQuery && (<>
      {/* Wisdom stories by belief (or culture filter) — shown first when filtered */}
      {traditionShelves.length > 0 && traditionShelves.map((shelf) => (
        <ShelfSection key={shelf.id} title={shelf.title}>
          <ShelfRow>
            {shelf.stories.slice(0, 12).map((lesson) => (
              <StoryTile key={lesson.id} lesson={lesson} imageUrl={wisdomImageUrls[lesson.id]} onPlay={handlePlay} />
            ))}
          </ShelfRow>
        </ShelfSection>
      ))}

      {/* Browse by Value — hidden when culture filter active */}
      {!cultureFilter && (
      <section className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
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
      )}

      {/* Collections — hidden when culture filter active */}
      {!cultureFilter && COLLECTIONS.slice(0, visibleCollections).map((col) => (
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

      {/* Series shelf at bottom (episodes view) */}
      <SeriesShelf cultureFilter={cultureFilter} />
      </>)}

      {/* Community Creations — user-created stories & series */}
      {(() => {
        const communitySeries = firestoreSeries.filter(s => !s._isBuiltIn);
        const communityStories = firestoreStories;
        if (communitySeries.length === 0 && communityStories.length === 0) return null;
        return (
        <ShelfSection title="✍️ Community Creations" subtitle="Stories & series by our creators" onSeeAll={() => navigate('/creators')}>
          <ShelfRow>
            {communitySeries.map(ser => (
              <StoryTile key={ser.id} lesson={{ ...ser, title: `${ser.icon || '📚'} ${ser.title}`, source: `${ser.totalEpisodes} episodes · by ${ser.authorName || 'Creator'}` }} imageUrl={ser.episodes?.[0]?.coverImage} onPlay={() => navigate(`/series/${ser.id}`)} />
            ))}
            {communityStories.map(story => (
              <StoryTile key={story.id} lesson={story} imageUrl={story.coverImage} onPlay={() => {
                load({ id: story.id, title: story.title, text: story.body || '', tradition: story.tradition, source: story.source || '', language: 'English', voice: 'AI Narrator', isWisdom: true, createdAt: story.submittedAt || new Date().toISOString() });
                navigate('/player');
              }} />
            ))}
          </ShelfRow>
        </ShelfSection>
        );
      })()}

      {/* Create Story FAB — goes to Creation tab */}
      <CreateFAB onClick={() => navigate('/creation')} />

      {/* SEO Footer — internal links for crawlers */}
      {!searchQuery && (
        <nav className="mt-10 mb-4 border-t border-white/5 pt-6 px-2" aria-label="Explore More">
          <p className="text-[10px] font-bold text-ink-dim mb-3" style={{ fontFamily: 'Lora, serif' }}>Explore More</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-4">
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">Bedtime Stories</p>
              <div className="flex flex-col gap-0.5">
                <a href="/blog/why-bedtime-stories-matter" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Bedtime Stories Matter</a>
                <a href="/blog/screen-free-bedtime-routines" className="text-[9px] text-ink-dim hover:text-ink-muted">Screen-Free Bedtime Routines</a>
                <a href="/blog/why-family-stories-matter" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Family Stories Matter</a>
                <a href="/blog/become-a-creator" className="text-[9px] text-ink-dim hover:text-ink-muted">Become a Creator</a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">World Cup 2026</p>
              <div className="flex flex-col gap-0.5">
                <a href="/blog/fifa-world-cup-kids-audiobook" className="text-[9px] text-ink-dim hover:text-ink-muted">FIFA World Cup Kids Audiobook</a>
                <a href="/blog/fifa-world-cup-dallas-kids-audiobook" className="text-[9px] text-ink-dim hover:text-ink-muted">FIFA Dallas Kids Audiobook</a>
                <a href="/fifa-world-cup-kids.html" className="text-[9px] text-ink-dim hover:text-ink-muted">World Cup Kids Stories</a>
                <a href="/fifa-world-cup-dallas-kids.html" className="text-[9px] text-ink-dim hover:text-ink-muted">World Cup Dallas Stories</a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">Cultural Stories</p>
              <div className="flex flex-col gap-0.5">
                <a href="/blog/indian-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Indian Bedtime Stories</a>
                <a href="/blog/islamic-stories-for-kids" className="text-[9px] text-ink-dim hover:text-ink-muted">Islamic Stories for Kids</a>
                <a href="/blog/hispanic-bedtime-stories-for-kids" className="text-[9px] text-ink-dim hover:text-ink-muted">Hispanic Bedtime Stories</a>
                <a href="/blog/belief-stories-for-kids" className="text-[9px] text-ink-dim hover:text-ink-muted">Belief Stories for Kids</a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">Child Psychology</p>
              <div className="flex flex-col gap-0.5">
                <a href="/blog/why-kids-love-who-would-win" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Love Who Would Win</a>
                <a href="/blog/why-kids-love-cars-buses" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Love Cars & Buses</a>
                <a href="/blog/why-kids-love-planets" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Love Planets</a>
                <a href="/blog/why-kids-love-sports-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Love Sports Stories</a>
                <a href="/blog/why-kids-need-superhero-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Need Superhero Stories</a>
                <a href="/blog/why-kids-love-countries" className="text-[9px] text-ink-dim hover:text-ink-muted">Why Kids Love Countries</a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">Landing Pages</p>
              <div className="flex flex-col gap-0.5">
                <a href="/bedtime-stories-for-kids" className="text-[9px] text-ink-dim hover:text-ink-muted">Bedtime Stories for Kids</a>
                <a href="/bedtime-story-app" className="text-[9px] text-ink-dim hover:text-ink-muted">Bedtime Story App</a>
                <a href="/hindu-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Hindu Bedtime Stories</a>
                <a href="/islamic-stories-for-kids" className="text-[9px] text-ink-dim hover:text-ink-muted">Islamic Stories for Kids</a>
                <a href="/catholic-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Catholic Bedtime Stories</a>
                <a href="/hispanic-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Hispanic Bedtime Stories</a>
                <a href="/sikh-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Sikh Bedtime Stories</a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ink-dim mb-1">Series & More</p>
              <div className="flex flex-col gap-0.5">
                <a href="/blog/best-bedtime-story-app-2026" className="text-[9px] text-ink-dim hover:text-ink-muted">Best Bedtime Story App 2026</a>
                <a href="/blog/best-bedtime-story-app-toronto" className="text-[9px] text-ink-dim hover:text-ink-muted">Best App Toronto</a>
                <a href="/blog/multilingual-bedtime-stories" className="text-[9px] text-ink-dim hover:text-ink-muted">Multilingual Bedtime Stories</a>
                <a href="/blog/technology-stack" className="text-[9px] text-ink-dim hover:text-ink-muted">Technology Stack</a>
                <a href="/demo/multilingual/" className="text-[9px] text-ink-dim hover:text-ink-muted">Multilingual Demo</a>
                <a href="/blog/" className="text-[9px] text-ink-dim hover:text-ink-muted">All Blog Posts</a>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Bottom padding */}
      <div className="h-40" />

      {/* Milestone celebration overlay */}
      <MilestoneCelebration />
      </>)}  {/* end !collectionId */}

      {/* Quick onboarding popup — shown when logged in but no profile */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-3xl bg-bg-elevated p-6 text-center shadow-lift ring-1 ring-white/10"
            >
              {obStep === 0 && (
                <>
                  <div className="text-3xl mb-3">👶</div>
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                    {t('onboarding.childName')}
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">Every story will use this name</p>
                  <input
                    value={obName}
                    onChange={(e) => setObName(e.target.value)}
                    placeholder="e.g. Arjun"
                    autoFocus
                    className="mt-4 w-full rounded-xl bg-bg-surface px-4 py-3 text-center text-lg font-bold text-ink ring-1 ring-white/10 outline-none focus:ring-gold/50"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={!obName.trim()}
                    onClick={() => setObStep(1)}
                    className="mt-4 w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-bg-base shadow-glow disabled:opacity-40"
                  >
                    {t('common.next')}
                  </motion.button>
                  <button
                    onClick={async () => {
                      // Skip onboarding — save minimal profile so they can browse
                      const payload = { childName: 'little one', age: 6, language: 'English', gender: 'boy', country: 'CA', beliefs: [], tier: 'free', createdAt: Date.now(), skippedOnboarding: true };
                      try {
                        localStorage.setItem('mst:familyProfile', JSON.stringify(payload));
                        localStorage.setItem('mst:profiles', JSON.stringify([payload]));
                      } catch {}
                      try {
                        const { db, auth: fbAuth } = await import('../lib/firebase.js');
                        if (db && fbAuth?.currentUser) {
                          const { doc, setDoc } = await import('firebase/firestore');
                          await setDoc(doc(db, 'users', fbAuth.currentUser.uid), { profiles: [payload] }, { merge: true });
                        }
                      } catch {}
                      window.location.reload();
                    }}
                    className="mt-3 text-xs text-ink-dim hover:text-ink-muted transition"
                  >
                    Skip — I just want to listen
                  </button>
                </>
              )}

              {obStep === 1 && (
                <>
                  <div className="text-3xl mb-3">🎂</div>
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                    {t('onboarding.childAge')}
                  </h3>
                  <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                      <button
                        key={age}
                        onClick={() => setObAge(String(age))}
                        className={`grid h-12 w-12 place-items-center rounded-xl text-sm font-bold transition ${
                          obAge === String(age)
                            ? 'bg-gold text-bg-base shadow-glow'
                            : 'bg-bg-surface text-ink ring-1 ring-white/10'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={!obAge}
                    onClick={() => setObStep(2)}
                    className="mt-4 w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-bg-base shadow-glow disabled:opacity-40"
                  >
                    {t('common.next')}
                  </motion.button>
                </>
              )}

              {obStep === 2 && (
                <>
                  <div className="text-3xl mb-3">🌍</div>
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                    {t('onboarding.selectLanguage')}
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="rounded-xl bg-gold py-4 text-sm font-bold text-bg-base shadow-glow">
                      English
                    </button>
                    {['Hindi', 'Tamil', 'Spanish'].map((lang) => (
                      <button key={lang} disabled
                        className="rounded-xl bg-bg-surface py-4 text-sm font-bold text-ink-dim ring-1 ring-white/5 opacity-40">
                        {lang} <span className="text-[8px] block text-ink-dim">{t('home.comingSoon')}</span>
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={async () => {
                      const { save, addKid, profiles } = await import('../hooks/useFamilyProfile.js').then(m => {
                        // Can't use hook here, use direct localStorage save
                        return { save: null, addKid: null, profiles: [] };
                      });
                      // Direct save to profile
                      const payload = {
                        childName: obName.trim(),
                        age: Number(obAge) || 6,
                        language: 'English',
                        gender: 'boy',
                        country: 'CA',
                        beliefs: [],
                        showCrossCulture: false,
                        tier: 'free',
                        createdAt: Date.now(),
                      };
                      // Save via the hook's save function
                      if (typeof save === 'function') {
                        save(payload);
                      } else {
                        // Fallback: save directly to localStorage + Firestore
                        try {
                          localStorage.setItem('mst:familyProfile', JSON.stringify(payload));
                          localStorage.setItem('mst:profiles', JSON.stringify([payload]));
                        } catch {}
                        try {
                          const { db, auth: fbAuth } = await import('../lib/firebase.js');
                          if (db && fbAuth?.currentUser) {
                            const { doc, setDoc } = await import('firebase/firestore');
                            await setDoc(doc(db, 'users', fbAuth.currentUser.uid), {
                              profiles: [payload],
                              email: fbAuth.currentUser.email,
                              updatedAt: new Date().toISOString(),
                            }, { merge: true });
                          }
                        } catch {}
                      }
                      window.location.reload();
                    }}
                    className="mt-4 w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-bg-base shadow-glow"
                  >
                    Start {obName}'s bedtime stories
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
