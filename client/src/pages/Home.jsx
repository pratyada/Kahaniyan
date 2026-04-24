import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ChevronDown, ChevronUp, Users, PenLine } from 'lucide-react';
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

// Pick tonight's featured story — rotates daily based on date
function pickTonightStory(beliefs) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  let pool = CULTURAL_LESSONS;
  if (beliefs?.length > 0) {
    const matched = pool.filter((l) => beliefs.includes(l.tradition));
    if (matched.length > 0) pool = [...matched, ...pool.filter((l) => !beliefs.includes(l.tradition))];
  }
  return pool[dayOfYear % pool.length];
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

  // Pre-generated wisdom audio + images
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState({});
  const [wisdomImageUrls, setWisdomImageUrls] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'config', 'wisdomAudio'));
        if (snap.exists()) setWisdomAudioUrls(snap.data());
        const imgSnap = await fget(fdoc(fireDb, 'config', 'wisdomImages'));
        if (imgSnap.exists()) setWisdomImageUrls(imgSnap.data());
      } catch {}
    })();
  }, []);

  const maxDuration = maxDurationFor(tier, isUnlimited);
  const remaining = isUnlimited ? Infinity : tier === 'free' ? Math.max(0, 3 - storiesThisWeek()) : Infinity;

  // Tonight's featured story
  const tonightStory = useMemo(() => pickTonightStory(profile?.beliefs), [profile?.beliefs]);
  const tonightTradition = TRADITIONS.find((t) => t.key === tonightStory?.tradition);

  // All wisdom stories for carousel (shuffled by user's beliefs)
  const allWisdom = useMemo(() => {
    let list = [...CULTURAL_LESSONS];
    const beliefs = profile?.beliefs || [];
    if (beliefs.length > 0) {
      const matched = list.filter((l) => beliefs.includes(l.tradition));
      const others = list.filter((l) => !beliefs.includes(l.tradition));
      list = [...matched, ...others];
    }
    return list;
  }, [profile?.beliefs]);

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

  return (
    <PageTransition className="relative page-scroll px-5 pt-10 safe-top">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(240,165,0,0.25) 0%, transparent 70%)' }} />

      {/* ═══ HEADER ═══ */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {greeting}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          A story for <span className="text-gold">{profile?.childName || 'your child'}</span>
        </h1>
      </motion.header>

      {/* ═══ THE MOON — Tonight's Featured Story ═══ */}
      <AnimatePresence>
      {!writeOpen && !castOpen && (
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 overflow-hidden"
      >
        {(() => {
          const featuredArt = getStoryArt(tonightStory?.id);
          return (
        <div
          className="relative mx-auto flex flex-col items-center rounded-3xl p-6 overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Background image: Firestore DALL-E > hardcoded > gradient */}
          {(wisdomImageUrls[tonightStory?.id] || featuredArt.image) ? (
            <img src={wisdomImageUrls[tonightStory?.id] || featuredArt.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0" style={{ background: featuredArt.gradient }} />
          )}
          {/* Dark overlay — stronger so text stays readable over DALL-E images */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

          {/* Moon play button */}
          <motion.button
            onClick={() => playLesson(tonightStory)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="relative mb-4 grid h-28 w-28 place-items-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffd98a, #f0a500 50%, #b87f00)',
              boxShadow: '0 0 60px rgba(240,165,0,0.35), 0 0 120px rgba(240,165,0,0.15), inset 0 -4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Moon shadow */}
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle at 65% 40%, transparent 35%, rgba(10,10,15,0.7) 75%)' }} />
            <Play size={36} fill="rgba(10,10,15,0.9)" stroke="none" className="relative z-10 ml-1" />
          </motion.button>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Tonight's Story
          </p>
          <h2 className="mt-1 text-center text-lg font-bold text-white" style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {tonightStory?.title}
          </h2>
          <p className="mt-1 text-xs text-white/60">
            {tonightTradition?.label} · {tonightStory?.durationMinutes} min
          </p>
        </div>
          );
        })()}
      </motion.section>
      )}
      </AnimatePresence>

      {/* ═══ WISDOM STORY CAROUSEL ═══ */}
      <AnimatePresence>
      {!writeOpen && !castOpen && (
      <motion.section
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 overflow-hidden"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Wisdom Stories
          </h3>
          {/* Theme filter */}
          <select
            value={traditionTheme}
            onChange={(e) => setTraditionTheme(e.target.value)}
            className="rounded-lg bg-bg-surface px-2 py-1 text-[10px] font-bold text-gold outline-none ring-1 ring-white/5"
          >
            {THEMES.map((t) => (
              <option key={t.key} value={t.key}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>

        {/* Horizontal scroll cards */}
        <div className="-mx-5 overflow-x-auto px-5 pb-2">
          <div className="flex w-max gap-3">
            {(() => {
              const filtered = CULTURAL_LESSONS.filter((l) => l.theme === traditionTheme);
              const beliefs = profile?.beliefs || [];
              let list = filtered;
              if (beliefs.length > 0 && !profile?.onlyMyTradition) {
                const matched = list.filter((l) => beliefs.includes(l.tradition));
                const others = list.filter((l) => !beliefs.includes(l.tradition));
                list = [...matched, ...others];
              } else if (beliefs.length > 0 && profile?.onlyMyTradition) {
                list = list.filter((l) => beliefs.includes(l.tradition));
              }
              return list.map((lesson) => {
                const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
                const art = getStoryArt(lesson.id);
                const tradArt = getTraditionArt(lesson.tradition);
                return (
                  <motion.button
                    key={lesson.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => playLesson(lesson)}
                    className="group relative flex w-48 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-3 text-left"
                    style={{ minHeight: '11rem' }}
                  >
                    {/* Background image: Firestore DALL-E > hardcoded > gradient */}
                    {(wisdomImageUrls[lesson.id] || art.image) ? (
                      <img src={wisdomImageUrls[lesson.id] || art.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: art.gradient }} />
                    )}
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
                    {/* Play button */}
                    <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur-sm text-white/80 transition group-hover:bg-white/20 group-hover:text-white">
                      <Play size={14} fill="currentColor" />
                    </div>
                    {/* Tradition badge */}
                    <div className="relative z-10 mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5"
                      style={{ background: `${tradArt.color}33` }}>
                      <span className="text-[9px] font-bold text-white/90">{tradition?.label}</span>
                    </div>
                    {/* Title */}
                    <p className="relative z-10 line-clamp-2 text-sm font-bold leading-snug text-white" style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      {lesson.title}
                    </p>
                    <p className="relative z-10 mt-1 text-[10px] text-white/60">{lesson.durationMinutes} min</p>
                  </motion.button>
                );
              });
            })()}
          </div>
        </div>
      </motion.section>
      )}
      </AnimatePresence>

      {/* ═══ WRITE YOUR OWN — Expandable ═══ */}
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
          onClick={() => { setWriteOpen(!writeOpen); setCastOpen(false); }}
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

                {!(whisper.trim() && whisperOverridesValue) && (
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
