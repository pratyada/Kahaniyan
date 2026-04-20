import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import ValuePill from '../components/ValuePill.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import WhisperBox, { saveRecentWhisper } from '../components/WhisperBox.jsx';
import CalmParticles from '../components/CalmParticles.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useStoryGenerator } from '../hooks/useStoryGenerator.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useRadio } from '../hooks/useRadio.jsx';
import { VALUES, DURATIONS, RELATION_EMOJI, RELIGIONS, mapCharactersToFamilyMembers } from '../utils/constants.js';
import { CULTURAL_LESSONS, TRADITIONS, THEMES } from '../data/culturalLessons.js';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { canGenerate, maxDurationFor, storiesThisWeek } from '../utils/tierGate.js';
import { useAdmin } from '../hooks/useAdmin.jsx';

const MODES = [
  {
    key: 'tradition',
    icon: '🪷',
    title: 'Wisdom story',
    subtitle: 'Pre-written stories from your tradition. Free, instant, no waiting.',
  },
  {
    key: 'whisper',
    icon: '💭',
    title: 'Today this happened',
    subtitle: 'Tell us how your child is feeling. We weave a story around it.',
  },
  {
    key: 'cast',
    icon: '👨‍👩‍👧',
    title: 'Choose the cast',
    subtitle: 'Pick 2–5 characters to star in tonight\'s story.',
  },
];

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

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { generate, loading } = useStoryGenerator();
  const { load } = usePlayer();
  const radio = useRadio();
  const { isUnlimited } = useAdmin();
  const isAdmin = isUnlimited; // backward compat for logging

  const tier = profile?.tier || 'free';
  const recommended = useMemo(() => recommendedValueFor(profile?.age || 6), [profile?.age]);
  const characters = profile?.characters || [];
  const nonProtagonist = characters.filter((c) => c.relation !== 'self');

  const [mode, setMode] = useState('tradition');
  const [value, setValue] = useState(recommended[0]);
  const [duration, setDuration] = useState(2);
  const [whisper, setWhisper] = useState('');
  const [whisperOverridesValue, setWhisperOverridesValue] = useState(true);
  const [selectedCharIds, setSelectedCharIds] = useState([]);
  const [traditionTheme, setTraditionTheme] = useState('compassion-animals');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [storyError, setStoryError] = useState(null);
  // Load pre-generated wisdom audio URLs from Firestore (one-time)
  const [wisdomAudioUrls, setWisdomAudioUrls] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const snap = await fget(fdoc(fireDb, 'config', 'wisdomAudio'));
        if (snap.exists()) setWisdomAudioUrls(snap.data());
      } catch {}
    })();
  }, []);

  const maxDuration = maxDurationFor(tier, isUnlimited);
  const used = storiesThisWeek();
  const remaining = isUnlimited ? Infinity : tier === 'free' ? Math.max(0, 3 - used) : Infinity;

  const toggleChar = (id) => {
    setSelectedCharIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const lessonsForTradition = useMemo(() => {
    let list = CULTURAL_LESSONS.filter((l) => l.theme === traditionTheme);
    const beliefs = profile?.beliefs || [];
    // If user has selected specific beliefs, prioritize those traditions.
    // If "openToAllCultures" is off, hard-filter to selected beliefs.
    if (beliefs.length > 0) {
      const matched = list.filter((l) => beliefs.includes(l.tradition));
      if (profile?.onlyMyTradition || !profile?.showCrossCulture) {
        list = matched;
      } else {
        // Sort matched first, then the rest
        const others = list.filter((l) => !beliefs.includes(l.tradition));
        list = [...matched, ...others];
      }
    }
    return list;
  }, [traditionTheme, profile?.beliefs, profile?.onlyMyTradition, profile?.showCrossCulture]);

  const handleStart = async () => {
    setStoryError(null);
    // If not signed in, trigger login popup
    if (window.__triggerLogin) {
      window.__triggerLogin();
      // If popup was triggered (user not signed in), stop here
      const { auth } = await import('../lib/firebase.js');
      if (auth && !auth.currentUser) return;
    }
    if (!profile) {
      setStoryError('Profile not loaded. Please try again.');
      return;
    }
    // Client-side limits are soft — server enforces the real limits.
    // Show upgrade modal as a hint but never hard-block generation.
    // Server will return 429 if the user is truly over limit.
    const selectedCharacters = characters.filter((c) => selectedCharIds.includes(c.id) || c.relation === 'self');
    // Start gentle radio while story generates (Raag Nidra — sleep ritual sound)
    const raagNidra = RADIO_STATIONS.find(s => s.id === 'raag-nidra') || RADIO_STATIONS[0];
    try { radio.play(raagNidra); } catch {}

    // Generate in background — user can navigate freely
    console.log('[My Sleepy Tale] Generating story in background...', { value, duration, mode });
    generate({
      profile,
      value,
      duration,
      language: profile.language || 'English',
      voice: profile.defaultVoice || 'AI Narrator',
      whisper: mode === 'whisper' ? whisper : '',
      whisperOverridesValue: mode === 'whisper' ? whisperOverridesValue : false,
      selectedCharacters: mode === 'cast' ? selectedCharacters : undefined,
    }).then((story) => {
      console.log('[My Sleepy Tale] Story generated:', story.title);
      if (mode === 'whisper' && whisper.trim()) saveRecentWhisper(whisper.trim());
      // Stop the ritual radio
      radio.stop();
      // Load story + navigate to player
      load(story);
      try { navigator.vibrate?.([200, 100, 200]); } catch {}
      setTimeout(() => navigate('/player'), 50);
    }).catch((e) => {
      console.error('[My Sleepy Tale] Story generation FAILED:', e);
      radio.stop();
      setStoryError(e.message || 'Could not generate story. Please try again.');
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
      audioUrl: pregenUrl, // pre-generated high-quality audio (if available)
    };
    // Track play count locally (zero cost)
    try {
      const key = 'mst:wisdomPlays';
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      plays[lesson.id] = (plays[lesson.id] || 0) + 1;
      plays._total = (plays._total || 0) + 1;
      localStorage.setItem(key, JSON.stringify(plays));
    } catch {}
    load(story);
    navigate('/player');
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const valueMetaForActive = VALUES.find((v) => v.key === value);
  const ctaDisabled =
    loading ||
    (mode === 'cast' && selectedCharIds.length === 0);

  return (
    <PageTransition className="relative page-scroll px-5 pt-12 safe-top">
      {/* Calm particles background */}
      <CalmParticles />

      {/* Generating banner — non-blocking, user can still browse */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 flex items-center gap-3 rounded-2xl bg-gold/10 p-3 ring-1 ring-gold/20"
          >
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <div className="text-xs font-bold text-gold">Weaving your story...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="display-title text-ink">
              A story for <span className="text-gold">{profile?.childName || 'your child'}</span>
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              What kind of bedtime story tonight?
            </p>
          </div>
          <div className="shrink-0 mt-1 inline-flex items-center gap-1.5 rounded-full bg-bg-surface px-2.5 py-1 ring-1 ring-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              {isUnlimited
                ? 'Unlimited'
                : tier === 'free'
                ? `${remaining} left`
                : 'Unlimited'}
            </span>
          </div>
        </div>
      </header>

      {/* MODE PICKER */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition ${
              mode === m.key
                ? 'bg-gold text-bg-base shadow-glow'
                : 'bg-bg-surface text-ink ring-1 ring-white/5'
            }`}
          >
            <span className="text-3xl">{m.icon}</span>
            <span className="text-[11px] font-bold leading-tight">{m.title}</span>
          </button>
        ))}
      </div>

      <p className="mb-6 text-[13px] text-ink-muted">
        {MODES.find((m) => m.key === mode)?.subtitle}
      </p>

      <AnimatePresence mode="wait">
        {/* ─── MODE 1: WHISPER ─── */}
        {mode === 'whisper' && (
          <motion.div
            key="whisper"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {/* Connection note */}
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
              <span className="mt-0.5 text-lg">💡</span>
              <p className="text-[12px] leading-relaxed text-ink-muted">
                Tell us what happened today — a worry, a win, a feeling — and we'll weave tonight's story around it. The whisper below turns your child's real day into a bedtime lesson.
              </p>
            </div>

            <WhisperBox
              value={whisper}
              onChange={setWhisper}
              overrideValue={whisperOverridesValue}
              onToggleOverride={setWhisperOverridesValue}
            />

            {/* Hide value picker when whisper + override is active — the whisper chooses the value */}
            {!(whisper.trim() && whisperOverridesValue) && (
              <section className="mb-8">
                <h2 className="ui-label mb-4">What should the story teach?</h2>
                <div className="-mx-5 overflow-x-auto px-5">
                  <div className="flex w-max gap-2">
                    {recommended.map((v) => (
                      <ValuePill key={`rec-${v}`} value={v} active={value === v} onClick={() => setValue(v)} />
                    ))}
                    {VALUES.filter((v) => !recommended.includes(v.key)).map((v) => (
                      <ValuePill key={v.key} value={v.key} size="sm" active={value === v.key} onClick={() => setValue(v.key)} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <LengthStrip duration={duration} setDuration={setDuration} maxDuration={maxDuration} setUpgradeReason={setUpgradeReason} setUpgradeOpen={setUpgradeOpen} />
          </motion.div>
        )}

        {/* ─── MODE 2: TRADITION (cultural lessons) ─── */}
        {mode === 'tradition' && (
          <motion.div
            key="tradition"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-gold/10 p-3 ring-1 ring-gold/20">
              <span className="text-xl">
                {(profile?.beliefs?.[0] && RELIGIONS.find((r) => r.key === profile.beliefs[0])?.icon) || '🌏'}
              </span>
              <div className="text-[11px] text-ink-muted">
                {profile?.beliefs?.length > 0
                  ? `Beliefs: ${profile.beliefs
                      .map((b) => RELIGIONS.find((r) => r.key === b)?.label)
                      .filter(Boolean)
                      .join(', ')}${
                      profile?.showCrossCulture
                        ? ' · plus other cultures'
                        : ''
                    }`
                  : 'Showing wisdom from all traditions. Add your beliefs in More → Edit family.'}
              </div>
            </div>

            {/* Theme tabs */}
            <div className="mb-4 -mx-5 flex gap-2 overflow-x-auto px-5">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTraditionTheme(t.key)}
                  className={`btn-pill shrink-0 px-4 py-2 text-sm font-bold ${
                    traditionTheme === t.key
                      ? 'bg-gold text-bg-base'
                      : 'bg-bg-elevated text-ink-muted'
                  }`}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Lessons list */}
            <div className="space-y-2">
              {lessonsForTradition.length === 0 ? (
                <p className="rounded-2xl bg-bg-surface p-4 text-center text-xs text-ink-muted">
                  No lessons yet for this theme.
                </p>
              ) : (
                lessonsForTradition.map((lesson) => {
                  const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => playLesson(lesson)}
                      className="group flex w-full items-center gap-3 rounded-2xl bg-bg-surface p-3 text-left shadow-card ring-1 ring-white/5 transition hover:bg-bg-elevated"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-2xl">
                        {tradition?.icon || '🌟'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                          {tradition?.label}
                        </div>
                        <div className="mt-0.5 truncate font-ui text-sm font-bold text-ink">
                          {lesson.title}
                        </div>
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg-card text-gold transition group-hover:bg-gold group-hover:text-bg-base">
                        ▶
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* ─── MODE 3: CHOOSE CAST ─── */}
        {mode === 'cast' && (
          <motion.div
            key="cast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <section className="mb-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="ui-label">
                  Cast · {selectedCharIds.length}/5 selected
                </h2>
                <button
                  onClick={() => navigate('/characters')}
                  className="text-[11px] font-bold uppercase tracking-wider text-gold hover:text-gold-bright"
                >
                  + Manage
                </button>
              </div>
              {nonProtagonist.length === 0 ? (
                <div className="card-elevated text-center">
                  <div className="mb-2 text-3xl">👥</div>
                  <p className="text-sm font-bold text-ink">No characters yet</p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Add family members or imaginary friends to make stories more personal.
                  </p>
                  <button
                    onClick={() => navigate('/characters')}
                    className="btn-primary mt-4"
                  >
                    Add characters
                  </button>
                </div>
              ) : (
                <div className="-mx-5 overflow-x-auto px-5">
                <div className="flex w-max gap-2">
                  {nonProtagonist.map((c) => {
                    const active = selectedCharIds.includes(c.id);
                    const disabled = !active && selectedCharIds.length >= 5;
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleChar(c.id)}
                        disabled={disabled}
                        className={`flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl p-3 text-center transition disabled:opacity-40 ${
                          active
                            ? 'bg-gold text-bg-base shadow-glow'
                            : 'bg-bg-surface text-ink ring-1 ring-white/5'
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
            </section>

            <section className="mb-8">
              <h2 className="ui-label mb-4">What should the story teach?</h2>
              <div className="-mx-5 overflow-x-auto px-5">
                <div className="flex w-max gap-2">
                  {recommended.map((v) => (
                    <ValuePill key={`rec2-${v}`} value={v} active={value === v} onClick={() => setValue(v)} />
                  ))}
                  {VALUES.filter((v) => !recommended.includes(v.key)).map((v) => (
                    <ValuePill key={v.key} value={v.key} size="sm" active={value === v.key} onClick={() => setValue(v.key)} />
                  ))}
                </div>
              </div>
            </section>

            <LengthStrip duration={duration} setDuration={setDuration} maxDuration={maxDuration} setUpgradeReason={setUpgradeReason} setUpgradeOpen={setUpgradeOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for sticky CTA */}
      {mode !== 'tradition' && <div className="h-24" />}

      {/* CTA — sticky floating button, hidden in tradition mode */}
      {mode !== 'tradition' && (
        <div className="fixed bottom-24 left-0 right-0 z-20 px-5 pointer-events-none">
          <div className="mx-auto max-w-lg pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={ctaDisabled}
              className="btn-primary w-full py-5 text-base disabled:opacity-40 shadow-[0_-4px_20px_rgba(240,165,0,0.3)]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-bg-base/70" />
                  Weaving your story…
                </span>
              ) : (
                <>
                  <span>{valueMetaForActive?.emoji}</span>
                  <span>Start Tonight's Story</span>
                </>
              )}
            </motion.button>
            {mode === 'cast' && selectedCharIds.length === 0 && (
              <p className="mt-2 text-center text-[11px] text-ink-dim">
                Pick at least one character to weave them in
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error banner */}
      {storyError && (
        <div className="mt-4 rounded-2xl bg-negative/10 p-4 ring-1 ring-negative/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-negative">Story failed</div>
              <div className="mt-1 text-xs text-ink-muted">{storyError}</div>
            </div>
            <button onClick={() => setStoryError(null)} className="text-ink-dim">✕</button>
          </div>
        </div>
      )}

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />

      <VersionFooter />
    </PageTransition>
  );
}

function LengthStrip({ duration, setDuration, maxDuration, setUpgradeReason, setUpgradeOpen }) {
  return (
    <section className="mb-8">
      <span className="ui-label mb-3 block">Story length</span>
      <div className="flex gap-1.5 rounded-pill bg-bg-surface p-1 ring-1 ring-white/5">
        {DURATIONS.map((d) => {
          const locked = !!d.locked;
          const active = duration === d.minutes;
          return (
            <button
              key={d.minutes}
              onClick={() => {
                if (locked) {
                  setUpgradeReason(`${d.minutes} min stories require a paid plan.`);
                  setUpgradeOpen(true);
                } else {
                  setDuration(d.minutes);
                }
              }}
              className={`relative flex-1 rounded-pill py-2.5 text-center text-xs font-bold transition ${
                active
                  ? 'bg-gold text-bg-base shadow-glow'
                  : locked
                  ? 'text-ink-dim'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {d.minutes}m
              {locked && !active && (
                <span className="ml-0.5 text-[8px] text-gold">🔒</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
