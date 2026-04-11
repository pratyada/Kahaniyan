import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import SectionCard from '../components/SectionCard.jsx';
import SegmentedControl from '../components/SegmentedControl.jsx';
import ValuePill from '../components/ValuePill.jsx';
import VoiceAvatar from '../components/VoiceAvatar.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import WhisperBox from '../components/WhisperBox.jsx';
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
  const [voice, setVoice] = useState(profile?.defaultVoice || 'AI Narrator');
  const [whisper, setWhisper] = useState('');
  const [whisperOverridesValue, setWhisperOverridesValue] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const maxDuration = maxDurationFor(tier);
  const used = storiesThisWeek();
  const remaining = tier === 'free' ? Math.max(0, 3 - used) : Infinity;

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
        whisper,
        whisperOverridesValue,
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

  const valueMetaForActive = VALUES.find((v) => v.key === value);

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* ─── HERO ─── */}
      <header className="mb-6">
        <p className="ui-label">{greeting}</p>
        <h1 className="display-title mt-1 text-ink">
          A story for <span className="text-gold">{profile?.childName}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Age {profile?.age} · {profile?.language}
        </p>

        {/* Quota chip */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-bg-surface px-3 py-1.5 ring-1 ring-white/5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            {tier === 'free'
              ? `${remaining} ${remaining === 1 ? 'story' : 'stories'} left this week`
              : 'Unlimited stories'}
          </span>
        </div>
      </header>

      {/* ─── TONIGHT'S WHISPER (headline feature) ─── */}
      <WhisperBox
        value={whisper}
        onChange={setWhisper}
        overrideValue={whisperOverridesValue}
        onToggleOverride={setWhisperOverridesValue}
      />

      {/* ─── VALUE PICKER ─── */}
      <SectionCard
        title="What should the story teach?"
        action={
          <span className="text-[10px] uppercase tracking-wider text-ink-dim">
            Suggested for age {profile?.age}
          </span>
        }
      >
        {/* Recommended row — bigger pills */}
        <div className="mb-2 flex flex-wrap gap-2">
          {recommended.map((v) => (
            <ValuePill key={v} value={v} active={value === v} onClick={() => setValue(v)} />
          ))}
        </div>
        {/* All values — small pills, scroll horizontally on overflow */}
        <details className="group">
          <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink">
            <span className="group-open:hidden">+ Show all 8 values</span>
            <span className="hidden group-open:inline">− Hide</span>
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
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
        </details>
      </SectionCard>

      {/* ─── LENGTH (segmented control) ─── */}
      <SectionCard title="How long?">
        <SegmentedControl
          value={duration}
          onChange={(v) => {
            const locked = v > maxDuration;
            if (locked) {
              setUpgradeReason(`${v} min stories require a paid plan.`);
              setUpgradeOpen(true);
            } else {
              setDuration(v);
            }
          }}
          options={DURATIONS.map((d) => ({
            value: d.minutes,
            label: `${d.minutes}m`,
            sub: d.sub,
          }))}
          lockedKey={DURATIONS.find((d) => d.minutes > maxDuration)?.minutes}
        />
      </SectionCard>

      {/* ─── NARRATOR ─── */}
      <SectionCard title="Narrator voice">
        <div className="grid grid-cols-5 gap-1">
          {NARRATORS.map((n) => (
            <VoiceAvatar
              key={n.key}
              narrator={n}
              active={voice === n.key}
              onClick={() => setVoice(n.key)}
            />
          ))}
        </div>
      </SectionCard>

      {/* ─── CTA ─── */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        disabled={loading}
        className="btn-primary mt-2 w-full py-5 text-base disabled:opacity-60"
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
      <p className="mt-3 text-center text-[11px] text-ink-dim">
        {whisper ? 'Tonight\'s whisper will be woven in' : 'Tap to weave a fresh story'}
      </p>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />

      <VersionFooter />
    </PageTransition>
  );
}
