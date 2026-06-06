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
import { useLocalizedCollections } from '../hooks/useLocalizedData.js';
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
  const [searchParams] = useSearchParams();
  const cultureFilter = searchParams.get('culture'); // e.g. ?culture=muslim

  // Culture filter → dedicated page
  if (cultureFilter) return <CulturePage />;

  const [viewMode, setViewMode] = useState(searchParams.get('view') === 'series' ? 'series' : 'episodes');
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

  const beliefs = profile?.beliefs || [];
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
    let pool = allLessons.filter(filterByBelief);
    if (pool.length < 5) pool = allLessons.filter(l => l.tradition === 'universal');
    const day = Math.floor(Date.now() / 86400000);
    return pool
      .map((l, i) => ({ l, sort: ((i * 2654435761 + day * 3) >>> 0) % 10000 }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.l)
      .slice(0, 5);
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
              <h2 className="text-xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>{focusCol.title}</h2>
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
        <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
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

      {/* Episodes / Series toggle */}
      <div className="mb-5 flex items-center justify-center">
        <div className="flex rounded-full bg-bg-surface p-1 ring-1 ring-white/5">
          <button
            onClick={() => setViewMode('episodes')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              viewMode === 'episodes' ? 'bg-gold text-bg-base shadow-glow' : 'text-ink-muted'
            }`}
          >
            Story
          </button>
          <button
            onClick={() => setViewMode('series')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              viewMode === 'series' ? 'bg-gold text-bg-base shadow-glow' : 'text-ink-muted'
            }`}
          >
            Series
          </button>
          {user && sharedSeries.length > 0 && (
            <button
              onClick={() => setViewMode('shared')}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                viewMode === 'shared' ? 'bg-blue-500 text-white shadow-glow' : 'text-ink-muted'
              }`}
            >
              Shared with me ({sharedSeries.length})
            </button>
          )}
        </div>
      </div>

      {/* Morning recap */}
      <MorningRecapShelf />

      {/* ═══ EPISODES VIEW ═══ */}
      {viewMode === 'episodes' && (() => {
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

          {/* 2. Trending */}
          <TrendingShelf allLessons={allLessons} wisdomImageUrls={wisdomImageUrls} onPlay={handlePlay} shownIds={shownIds} />
        </>);
      })()}

      {/* ═══ SERIES VIEW — Netflix-style category shelves ═══ */}
      {viewMode === 'series' && (
        <CategoryShelves wisdomImageUrls={wisdomImageUrls} cultureFilter={cultureFilter} />
      )}

      {/* ═══ SHARED WITH ME VIEW ═══ */}
      {viewMode === 'shared' && (
        <div className="space-y-6 mb-8">
          {sharedLoading ? (
            <p className="text-ink-muted text-sm px-5">Loading...</p>
          ) : sharedSeries.length === 0 ? (
            <p className="text-ink-muted text-sm px-5">Nothing shared with you yet</p>
          ) : (
            sharedSeries.map(s => (
              <div key={s.id}>
                {/* Series header */}
                <ShelfSection title={
                  <motion.span whileTap={{ scale: 0.97 }} onClick={() => navigate(`/series/${s.id}`)}
                    className="flex items-center gap-2 cursor-pointer">
                    <span className="text-lg">{s.icon || '📚'}</span>
                    <span>{s.title}</span>
                    <span className="text-[10px] font-normal text-ink-muted ml-1">by {s.authorName}</span>
                  </motion.span>
                }>
                  <ShelfRow>
                    {(s.episodes || []).map((ep, i) => (
                      <motion.button key={`${s.id}_ep${i}`} whileTap={{ scale: 0.96 }}
                        onClick={() => navigate(`/series/${s.id}`)}
                        className="group relative flex w-40 lg:w-48 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl text-left"
                        style={{ aspectRatio: '2/3', minHeight: 240 }}>
                        {/* Background */}
                        {(ep.coverImage || (ep.gallery || [])[0]) ? (
                          <img src={ep.coverImage || ep.gallery[0]} alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy" onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1040] to-[#0a0a0f]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play button */}
                        <div className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm">
                          <Play size={12} fill="currentColor" />
                        </div>

                        {/* Episode number */}
                        <div className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-[11px] font-bold text-white backdrop-blur-sm">
                          {ep.episodeNumber || i + 1}
                        </div>

                        {/* Bottom content */}
                        <div className="relative z-10 p-3">
                          <p className="text-[11px] font-bold text-white leading-snug line-clamp-2"
                            style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            {ep.title}
                          </p>
                          <p className="text-[9px] text-white/50 mt-1">
                            {Math.max(1, Math.round((ep.wordCount || ep.body?.split?.(/\s+/).length || 200) / 150))} min
                            {ep.contributorName && ` · ${ep.contributorName}`}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </ShelfRow>
                </ShelfSection>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === 'episodes' && (<>
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

      {/* Our Creators — always at bottom */}
      <CuratorShelf />

      {/* Create Story FAB — goes to Creation tab */}
      <CreateFAB onClick={() => navigate('/creation')} />

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
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
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
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
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
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
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
