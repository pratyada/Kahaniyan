import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ChevronDown, ChevronUp, ChevronRight, Users, PenLine, Headphones, TrendingUp, Clock } from 'lucide-react';
import { getStoryArt, getTraditionArt } from '../utils/storyArt.js';
import PageTransition from '../components/PageTransition.jsx';
import ValuePill from '../components/ValuePill.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import WhisperBox, { saveRecentWhisper } from '../components/WhisperBox.jsx';
import { trackStoryGenerated, trackWisdomStoryPlayed } from '../utils/analytics.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useStoryGenerator } from '../hooks/useStoryGenerator.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useRadio } from '../hooks/useRadio.jsx';
import { VALUES, DURATIONS, RELATION_EMOJI, RELIGIONS, mapCharactersToFamilyMembers } from '../utils/constants.js';
import { CULTURAL_LESSONS, TRADITIONS, THEMES } from '../data/culturalLessons.js';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { canGenerate, maxDurationFor, storiesThisWeek } from '../utils/tierGate.js';
import { useAdmin } from '../hooks/useAdmin.jsx';

function recommendedValueFor(age) {
  if (age <= 4) return ['sharing', 'kindness'];
  if (age <= 7) return ['honesty', 'respect', 'gratitude'];
  if (age <= 10) return ['courage', 'patience', 'bravery'];
  return ['respect', 'gratitude', 'courage'];
}

function fillTokens(text, profile, characters) {
  const familyMembers = characters?.length ? mapCharactersToFamilyMembers(characters) : null;
  const tokens = {
    childName: profile?.childName || 'little one',
    sibling: familyMembers?.sibling || profile?.sibling || 'their friend',
    grandfather: familyMembers?.grandfather || profile?.grandfather || 'Dada ji',
    grandmother: familyMembers?.grandmother || profile?.grandmother || 'Nani ma',
    pet: familyMembers?.pet || profile?.pet || 'their puppy',
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => tokens[k] ?? `{${k}}`);
}

// Simulated play counts — deterministic per story ID, looks realistic
function getPlayCount(storyId) {
  let hash = 0;
  for (let i = 0; i < storyId.length; i++) hash = ((hash << 5) - hash + storyId.charCodeAt(i)) | 0;
  const base = Math.abs(hash) % 900 + 100; // 100-999
  const multiplier = (Math.abs(hash >> 8) % 10) + 1; // 1-10
  const count = base * multiplier;
  return count;
}

function formatPlays(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

// Pick tonight's featured story — rotates daily based on date
function pickTonightStory(beliefs, lessons) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  let pool = lessons || CULTURAL_LESSONS;
  if (beliefs?.length > 0) {
    // Show stories matching user's beliefs + universal stories
    const matched = pool.filter((l) => beliefs.includes(l.tradition) || l.tradition === 'universal');
    if (matched.length > 0) pool = matched;
  } else {
    // No beliefs selected — show universal stories, fallback to all
    const universal = pool.filter((l) => l.tradition === 'universal');
    if (universal.length > 0) pool = universal;
  }
  return pool.length > 0 ? pool[dayOfYear % pool.length] : null;
}

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { generate, loading } = useStoryGenerator();
  const { load, clear } = usePlayer();
  const radio = useRadio();
  const { isUnlimited } = useAdmin();

  const tier = profile?.tier || 'free';
  const recommended = useMemo(() => recommendedValueFor(profile?.age || 6), [profile?.age]);
  const characters = profile?.characters || [];
  const nonProtagonist = characters.filter((c) => c.relation !== 'self');

  const [value, setValue] = useState(recommended[0]);
  const [duration, setDuration] = useState(2);
  const [whisper, setWhisper] = useState('');
  const [whisperOverridesValue, setWhisperOverridesValue] = useState(true);
  const [selectedCharIds, setSelectedCharIds] = useState([]);
  const [traditionTheme, setTraditionTheme] = useState('compassion-animals');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [storyError, setStoryError] = useState(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [castOpen, setCastOpen] = useState(false);

  // Pre-generated wisdom audio + images + custom stories from Firestore
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState({});
  const [wisdomImageUrls, setWisdomImageUrls] = useState({});
  const [customWisdomStories, setCustomWisdomStories] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget, collection, getDocs } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'config', 'wisdomAudio'));
        if (snap.exists()) setWisdomAudioUrls(snap.data());
        const imgSnap = await fget(fdoc(fireDb, 'config', 'wisdomImages'));
        if (imgSnap.exists()) setWisdomImageUrls(imgSnap.data());
        // Load custom wisdom stories from Firestore
        const customSnap = await getDocs(collection(fireDb, 'wisdomStories'));
        const custom = [];
        customSnap.forEach(d => custom.push({ id: d.id, ...d.data() }));
        setCustomWisdomStories(custom);
      } catch {}
    })();
  }, []);

  const maxDuration = maxDurationFor(tier, isUnlimited);
  const remaining = isUnlimited ? Infinity : tier === 'free' ? Math.max(0, 3 - storiesThisWeek()) : Infinity;

  // Merge hardcoded + custom wisdom stories
  const allLessons = useMemo(() => {
    const merged = new Map();
    CULTURAL_LESSONS.forEach(l => merged.set(l.id, l));
    customWisdomStories.forEach(l => merged.set(l.id, l));
    return [...merged.values()];
  }, [customWisdomStories]);

  // Tonight's featured story
  const tonightStory = useMemo(() => pickTonightStory(profile?.beliefs, allLessons), [profile?.beliefs, allLessons]);
  const tonightTradition = TRADITIONS.find((t) => t.key === tonightStory?.tradition);

  const toggleChar = (id) => {
    setSelectedCharIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const playLesson = (lesson) => {
    const filledText = fillTokens(lesson.body, profile);
    const pregenUrl = wisdomAudioUrls[lesson.id] || null;
    const story = {
      id: `lesson_${lesson.id}`,
      title: lesson.title,
      text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: lesson.durationMinutes,
      value: 'kindness',
      language: profile?.language || 'English',
      voice: 'AI Narrator',
      tradition: lesson.tradition,
      source: lesson.source,
      createdAt: new Date().toISOString(),
      isWisdom: true,
      audioUrl: pregenUrl,
    };
    try {
      const key = 'mst:wisdomPlays';
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      plays[lesson.id] = (plays[lesson.id] || 0) + 1;
      plays._total = (plays._total || 0) + 1;
      localStorage.setItem(key, JSON.stringify(plays));
    } catch {}
    trackWisdomStoryPlayed(lesson.id, lesson.tradition);
    load(story);
    navigate('/player');
  };

  const handleStart = async () => {
    setStoryError(null);
    if (window.__triggerLogin) {
      window.__triggerLogin();
      const { auth } = await import('../lib/firebase.js');
      if (auth && !auth.currentUser) return;
    }
    if (!profile) { setStoryError('Profile not loaded.'); return; }

    const selectedCharacters = characters.filter((c) => selectedCharIds.includes(c.id) || c.relation === 'self');
    clear();
    navigate('/player');

    const raagNidra = RADIO_STATIONS.find(s => s.id === 'raag-nidra') || RADIO_STATIONS[0];
    try { radio.play(raagNidra); } catch {}

    if (whisper.trim()) saveRecentWhisper(whisper.trim());
    generate({
      profile, value, duration,
      language: profile.language || 'English',
      voice: profile.defaultVoice || 'AI Narrator',
      whisper: writeOpen ? whisper : '',
      whisperOverridesValue: writeOpen ? whisperOverridesValue : false,
      selectedCharacters: castOpen ? selectedCharacters : undefined,
    }).then((story) => {
      trackStoryGenerated(writeOpen ? 'whisper' : castOpen ? 'cast' : 'quick', value, duration);
      radio.stop();
      load(story);
      try { navigator.vibrate?.([200, 100, 200]); } catch {}
    }).catch((e) => {
      radio.stop();
      setStoryError(e.message || 'Could not generate story.');
      navigate('/');
    });
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Filter lessons by user's beliefs
  const userLessons = useMemo(() => {
    const beliefs = profile?.beliefs || [];
    if (beliefs.length > 0) {
      return allLessons.filter((l) => beliefs.includes(l.tradition) || l.tradition === 'universal');
    }
    const universal = allLessons.filter((l) => l.tradition === 'universal');
    return universal.length > 0 ? universal : allLessons;
  }, [allLessons, profile?.beliefs]);

  // Group stories by theme for shelves
  const shelves = useMemo(() => {
    return THEMES.map((theme) => ({
      ...theme,
      stories: userLessons.filter((l) => l.theme === theme.key),
    })).filter((s) => s.stories.length > 0);
  }, [userLessons]);

  // Trending = sorted by simulated play count
  const trending = useMemo(() => {
    return [...userLessons].sort((a, b) => getPlayCount(b.id) - getPlayCount(a.id)).slice(0, 10);
  }, [userLessons]);

  return (
    <PageTransition className="relative page-scroll pt-10 safe-top">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)' }} />

      {/* ═══ HEADER ═══ */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center px-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {greeting}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          A story for <span className="text-gold">{profile?.childName || 'your child'}</span>
        </h1>
      </motion.header>

      {/* ═══ FEATURED BANNER — Tonight's Story ═══ */}
      <AnimatePresence>
      {!writeOpen && !castOpen && tonightStory && (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 px-5 overflow-hidden"
      >
        {(() => {
          const featuredArt = getStoryArt(tonightStory?.id);
          const imgSrc = wisdomImageUrls[tonightStory?.id] || featuredArt.image;
          const plays = getPlayCount(tonightStory?.id || 'default');
          return (
        <motion.button
          onClick={() => playLesson(tonightStory)}
          whileTap={{ scale: 0.98 }}
          className="relative w-full overflow-hidden rounded-3xl text-left"
          style={{ minHeight: '13rem' }}
        >
          <div className="absolute inset-0" style={{ background: featuredArt.gradient }} />
          {imgSrc && <img src={imgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

          <div className="relative z-10 flex h-full flex-col justify-end p-5" style={{ minHeight: '13rem' }}>
            {/* Plays badge */}
            <div className="mb-auto flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1">
                <Headphones size={10} className="text-bg-base" />
                <span className="text-[10px] font-bold text-bg-base">{formatPlays(plays)} plays</span>
              </div>
              <div className="rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-1">
                <span className="text-[10px] font-bold text-white/80">{tonightTradition?.label}</span>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Tonight's Story
            </p>
            <h2 className="mt-1 text-xl font-bold text-white leading-snug" style={{ fontFamily: 'Fraunces, serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {tonightStory?.title}
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/60">
                <Clock size={11} />
                <span className="text-[11px]">{tonightStory?.durationMinutes} min</span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold shadow-glow">
                <Play size={16} fill="rgba(10,10,15,0.9)" stroke="none" className="ml-0.5" />
              </div>
            </div>
          </div>
        </motion.button>
          );
        })()}
      </motion.section>
      )}
      </AnimatePresence>

      {/* ═══ TRENDING NOW ═══ */}
      <AnimatePresence>
      {!writeOpen && !castOpen && trending.length > 0 && (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 overflow-hidden"
      >
        <div className="mb-3 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-gold" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-ink" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Trending Now
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto px-5 pb-2 scrollbar-hide">
          <div className="flex w-max gap-3 pr-5">
            {trending.map((lesson, i) => (
              <StoryShelfCard key={lesson.id} lesson={lesson} rank={i + 1} wisdomImageUrls={wisdomImageUrls} onPlay={playLesson} />
            ))}
          </div>
        </div>
      </motion.section>
      )}
      </AnimatePresence>

      {/* ═══ THEME SHELVES ═══ */}
      <AnimatePresence>
      {!writeOpen && !castOpen && shelves.map((shelf, si) => (
      <motion.section
        key={shelf.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, delay: si * 0.05 }}
        className="mb-6 overflow-hidden"
      >
        <div className="mb-3 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-sm">{shelf.icon}</span>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-ink" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {shelf.label} Stories
            </h3>
          </div>
          <span className="text-[10px] font-bold text-ink-dim">{shelf.stories.length}</span>
        </div>
        <div className="overflow-x-auto px-5 pb-2 scrollbar-hide">
          <div className="flex w-max gap-3 pr-5">
            {shelf.stories.map((lesson) => (
              <StoryShelfCard key={lesson.id} lesson={lesson} wisdomImageUrls={wisdomImageUrls} onPlay={playLesson} />
            ))}
          </div>
        </div>
      </motion.section>
      ))}
      </AnimatePresence>

      {/* px-5 wrapper for the sections below */}
      <div className="px-5">

      {/* ═══ WRITE YOUR OWN — Button on top, content below, scroll to textarea ═══ */}
      <AnimatePresence>
      {!castOpen && (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 overflow-hidden"
      >
        <button
          onClick={() => {
            const opening = !writeOpen;
            setWriteOpen(opening);
            setCastOpen(false);
            if (opening) {
              setTimeout(() => {
                const ta = document.querySelector('[data-whisper-textarea]');
                if (ta) ta.focus({ preventScroll: true });
              }, 400);
            }
          }}
          className="flex w-full items-center justify-between rounded-2xl p-4 transition"
          style={{
            background: writeOpen ? 'linear-gradient(135deg, rgba(240,165,0,0.1), rgba(240,165,0,0.03))' : 'rgba(255,255,255,0.02)',
            border: writeOpen ? '1px solid rgba(240,165,0,0.2)' : '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
              <PenLine size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Write my story</p>
              <p className="text-[10px] text-ink-muted">Describe your child's day</p>
            </div>
          </div>
          {writeOpen ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-ink-dim" />}
        </button>

        <AnimatePresence>
          {writeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 px-1">
                <WhisperBox
                  value={whisper}
                  onChange={setWhisper}
                  overrideValue={whisperOverridesValue}
                  onToggleOverride={setWhisperOverridesValue}
                />

                {/* Auto-pick toggle */}
                <label className="mb-5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
                  <div className="min-w-0 flex-1">
                    <div className="font-ui text-xs font-bold text-ink">Auto-pick the lesson</div>
                    <div className="mt-0.5 text-[11px] text-ink-muted">
                      {whisperOverridesValue ? 'We\'ll choose the best value for you' : 'Pick a value below'}
                    </div>
                  </div>
                  <span onClick={(e) => { e.preventDefault(); setWhisperOverridesValue(!whisperOverridesValue); }}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${whisperOverridesValue ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/10'}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-bg-base transition ${whisperOverridesValue ? 'translate-x-6' : 'translate-x-1'}`} />
                  </span>
                </label>

                {!whisperOverridesValue && (
                  <section className="mb-6">
                    <h2 className="ui-label mb-3">What should the story teach?</h2>
                    <div className="relative -mx-5">
                      <div className="overflow-x-auto px-5 py-1 scrollbar-hide">
                        <div className="flex w-max gap-2.5 pr-8">
                          {recommended.map((v) => (
                            <ValuePill key={`rec-${v}`} value={v} active={value === v} onClick={() => setValue(v)} />
                          ))}
                          {VALUES.filter((v) => !recommended.includes(v.key)).map((v) => (
                            <ValuePill key={v.key} value={v.key} active={value === v.key} onClick={() => setValue(v.key)} />
                          ))}
                        </div>
                      </div>
                      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-base to-transparent" />
                    </div>
                  </section>
                )}

                <LengthStrip duration={duration} setDuration={setDuration} maxDuration={maxDuration} setUpgradeReason={setUpgradeReason} setUpgradeOpen={setUpgradeOpen} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gold py-4 text-center text-base font-bold text-bg-base shadow-[0_4px_24px_rgba(240,165,0,0.3)] transition disabled:opacity-40"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {loading ? 'Weaving...' : 'Start Tonight\'s Story'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
      )}
      </AnimatePresence>

      {/* ═══ CHOOSE CAST — Expandable ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-8"
      >
        <button
          onClick={() => { setCastOpen(!castOpen); setWriteOpen(false); }}
          className="flex w-full items-center justify-between rounded-2xl p-4 transition"
          style={{
            background: castOpen ? 'linear-gradient(135deg, rgba(240,165,0,0.1), rgba(240,165,0,0.03))' : 'rgba(255,255,255,0.02)',
            border: castOpen ? '1px solid rgba(240,165,0,0.2)' : '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
              <Users size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Choose the cast</p>
              <p className="text-[10px] text-ink-muted">Pick characters for tonight</p>
            </div>
          </div>
          {castOpen ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-ink-dim" />}
        </button>

        <AnimatePresence>
          {castOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 px-1">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-muted">{selectedCharIds.length}/5 selected</span>
                  <button onClick={() => navigate('/characters')} className="text-[11px] font-bold text-gold">+ Manage</button>
                </div>

                {nonProtagonist.length === 0 ? (
                  <div className="rounded-2xl bg-bg-surface p-6 text-center ring-1 ring-white/5">
                    <p className="text-sm font-bold text-ink">No characters yet</p>
                    <p className="mt-1 text-[11px] text-ink-muted">Add family members to personalize stories</p>
                    <button onClick={() => navigate('/characters')} className="mt-3 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Add characters</button>
                  </div>
                ) : (
                  <div className="-mx-5 overflow-x-auto px-5 mb-4">
                    <div className="flex w-max gap-2">
                      {nonProtagonist.map((c) => {
                        const active = selectedCharIds.includes(c.id);
                        return (
                          <button key={c.id} onClick={() => toggleChar(c.id)} disabled={!active && selectedCharIds.length >= 5}
                            className={`flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl p-3 text-center transition disabled:opacity-40 ${
                              active ? 'bg-gold text-bg-base shadow-glow' : 'bg-bg-surface text-ink ring-1 ring-white/5'
                            }`}
                          >
                            <span className="text-2xl">{c.emoji || RELATION_EMOJI[c.relation]}</span>
                            <span className="text-[11px] font-bold leading-tight">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <section className="mb-6">
                  <h2 className="ui-label mb-3">What should the story teach?</h2>
                  <div className="relative -mx-5">
                    <div className="overflow-x-auto px-5 py-1 scrollbar-hide">
                      <div className="flex w-max gap-2.5 pr-8">
                        {recommended.map((v) => (
                          <ValuePill key={`rec2-${v}`} value={v} active={value === v} onClick={() => setValue(v)} />
                        ))}
                        {VALUES.filter((v) => !recommended.includes(v.key)).map((v) => (
                          <ValuePill key={v.key} value={v.key} active={value === v.key} onClick={() => setValue(v.key)} />
                        ))}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-base to-transparent" />
                  </div>
                </section>

                <LengthStrip duration={duration} setDuration={setDuration} maxDuration={maxDuration} setUpgradeReason={setUpgradeReason} setUpgradeOpen={setUpgradeOpen} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  disabled={loading || selectedCharIds.length === 0}
                  className="w-full rounded-2xl bg-gold py-4 text-center text-base font-bold text-bg-base shadow-[0_4px_24px_rgba(240,165,0,0.3)] transition disabled:opacity-40"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {loading ? 'Weaving...' : 'Start Tonight\'s Story'}
                </motion.button>
                {selectedCharIds.length === 0 && (
                  <p className="mt-2 text-center text-[10px] text-ink-dim">Pick at least one character</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Error banner */}
      {storyError && (
        <div className="mb-6 rounded-2xl bg-negative/10 p-4 ring-1 ring-negative/20">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-negative mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-bold text-negative">Story failed</div>
              <div className="mt-1 text-xs text-ink-muted">{storyError}</div>
            </div>
            <button onClick={() => setStoryError(null)} className="text-ink-dim text-xs">✕</button>
          </div>
        </div>
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason={upgradeReason} />

      </div>{/* close px-5 wrapper */}

      {/* Bottom padding for nav + player bar */}
      <div className="h-40" />
    </PageTransition>
  );
}

function LengthStrip({ duration, setDuration, maxDuration, setUpgradeReason, setUpgradeOpen }) {
  return (
    <section className="mb-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted block mb-2">Story length</span>
      <div className="flex gap-1.5 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
        {DURATIONS.map((d) => {
          const locked = !!d.locked;
          const active = duration === d.minutes;
          return (
            <button
              key={d.minutes}
              onClick={() => {
                if (locked) { setUpgradeReason(`${d.minutes} min stories require a paid plan.`); setUpgradeOpen(true); }
                else setDuration(d.minutes);
              }}
              className={`relative flex-1 rounded-xl py-2.5 text-center text-xs font-bold transition ${
                active ? 'bg-gold text-bg-base shadow-glow' : locked ? 'text-ink-dim' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {d.minutes}m
              {locked && !active && <span className="ml-0.5 text-[8px] text-gold">🔒</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Pocket FM-style story card for shelf carousels
function StoryShelfCard({ lesson, rank, wisdomImageUrls, onPlay }) {
  const art = getStoryArt(lesson.id);
  const tradArt = getTraditionArt(lesson.tradition);
  const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
  const imgSrc = wisdomImageUrls[lesson.id] || art.image;
  const plays = getPlayCount(lesson.id);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onPlay(lesson)}
      className="group relative flex w-36 shrink-0 flex-col overflow-hidden rounded-2xl text-left ring-1 ring-white/5"
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
        <div className="absolute inset-0" style={{ background: art.gradient }} />
        {imgSrc && <img src={imgSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rank badge (for trending) */}
        {rank && (
          <div className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-gold text-[10px] font-bold text-bg-base shadow-lg">
            {rank}
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/90 shadow-glow">
            <Play size={14} fill="rgba(10,10,15,0.9)" stroke="none" className="ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2.5 bg-[#12121a]">
        <p className="line-clamp-2 text-[11px] font-bold leading-snug text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold" style={{ color: tradArt.color }}>{tradition?.label}</span>
          <span className="text-[#6e6a63]">·</span>
          <span className="text-[9px] text-ink-dim">{lesson.durationMinutes}m</span>
        </div>
        <div className="flex items-center gap-1 text-ink-dim">
          <Headphones size={9} />
          <span className="text-[9px] font-bold">{formatPlays(plays)} plays</span>
        </div>
      </div>
    </motion.button>
  );
}
