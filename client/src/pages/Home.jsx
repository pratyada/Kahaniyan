import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import ValuePill from '../components/ValuePill.jsx';
import VoiceAvatar from '../components/VoiceAvatar.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useStoryGenerator } from '../hooks/useStoryGenerator.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES, NARRATORS, DURATIONS } from '../utils/constants.js';
import { canGenerate, maxDurationFor, storiesThisWeek } from '../utils/tierGate.js';

// Recommend a value based on age band — mirrors README age mapping.
function recommendedValueFor(age) {
  if (age <= 4) return ['sharing', 'kindness'];
  if (age <= 7) return ['honesty', 'respect', 'gratitude'];
  if (age <= 10) return ['courage', 'patience', 'bravery'];
  return ['respect', 'gratitude', 'courage'];
}

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { generate, loading } = useStoryGenerator();
  const { load } = usePlayer();

  const tier = profile?.tier || 'free';
  const recommended = useMemo(() => recommendedValueFor(profile?.age || 6), [profile?.age]);

  const [value, setValue] = useState(recommended[0]);
  const [duration, setDuration] = useState(15);
  const [voice, setVoice] = useState('AI Narrator');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const maxDuration = maxDurationFor(tier);
  const used = storiesThisWeek();

  const handleStart = async () => {
    if (!canGenerate(tier)) {
      setUpgradeReason(`Free plan allows 3 stories per week. You've used ${used}.`);
      setUpgradeOpen(true);
      return;
    }
    if (duration > maxDuration) {
      setUpgradeReason(`Free plan allows up to ${maxDuration} min stories.`);
      setUpgradeOpen(true);
      return;
    }
    try {
      const story = await generate({
        profile,
        value,
        duration,
        language: profile.language || 'English',
        voice,
      });
      load(story);
      navigate('/player');
    } catch {
      // error swallowed for POC; could surface a toast
    }
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Header */}
      <header className="mb-8">
        <p className="ui-label">{greeting}</p>
        <h1 className="display-title mt-1 text-ink">
          Tonight's story for{' '}
          <span className="text-gold">{profile?.childName}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {used}/{tier === 'free' ? 3 : '∞'} stories this week · {profile?.language}
        </p>
      </header>

      {/* Recommended */}
      <section className="mb-8">
        <h2 className="ui-label mb-3">Suggested for age {profile?.age}</h2>
        <div className="flex flex-wrap gap-2">
          {recommended.map((v) => (
            <ValuePill key={v} value={v} active={value === v} onClick={() => setValue(v)} />
          ))}
        </div>
      </section>

      {/* All values */}
      <section className="mb-8">
        <h2 className="ui-label mb-3">All values</h2>
        <div className="flex flex-wrap gap-2">
          {VALUES.map((v) => (
            <ValuePill
              key={v.key}
              value={v.key}
              size="sm"
              active={value === v.key}
              onClick={() => setValue(v.key)}
            />
          ))}
        </div>
      </section>

      {/* Duration */}
      <section className="mb-8">
        <h2 className="ui-label mb-3">Length</h2>
        <div className="grid grid-cols-2 gap-2">
          {DURATIONS.map((d) => {
            const locked = d.minutes > maxDuration;
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
                className={`relative rounded-2xl p-4 text-left transition ${
                  active
                    ? 'bg-gold text-bg-base shadow-glow'
                    : 'bg-bg-surface text-ink ring-1 ring-white/5'
                }`}
              >
                <div className="font-display text-2xl font-bold">{d.label}</div>
                <div
                  className={`text-xs ${
                    active ? 'text-bg-base/70' : 'text-ink-muted'
                  }`}
                >
                  {d.sub}
                </div>
                {locked && (
                  <span className="absolute right-3 top-3 text-xs text-gold">🔒</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Narrator */}
      <section className="mb-10">
        <h2 className="ui-label mb-3">Narrator</h2>
        <div className="grid grid-cols-5 gap-2">
          {NARRATORS.map((n) => (
            <VoiceAvatar
              key={n.key}
              narrator={n}
              active={voice === n.key}
              onClick={() => setVoice(n.key)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        disabled={loading}
        className="btn-primary w-full py-4 text-base disabled:opacity-60"
      >
        {loading ? 'Weaving your story…' : '✨ Start Tonight\u2019s Story'}
      </motion.button>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />

      <VersionFooter />
    </PageTransition>
  );
}
