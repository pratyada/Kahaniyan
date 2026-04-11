import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import SectionCard from '../components/SectionCard.jsx';
import Toggle from '../components/Toggle.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useTheme } from '../hooks/useTheme.jsx';
import { useFamilyVoices } from '../hooks/useFamilyVoices.jsx';
import { useSpeech } from '../hooks/useSpeech.js';
import { LANGUAGES, RELIGIONS, COUNTRIES } from '../utils/constants.js';
import { TIERS, storiesThisWeek } from '../utils/tierGate.js';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, update, clear } = useFamilyProfile();
  const { theme, toggle: toggleTheme } = useTheme();
  const { voices } = useFamilyVoices();
  const { voicesForLanguage, speak, stop } = useSpeech();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!profile) return null;

  const tier = TIERS[profile.tier || 'free'];
  const used = storiesThisWeek();
  const availableVoices = voicesForLanguage(profile.language || 'English');

  const previewVoice = (voiceName) => {
    stop();
    setTimeout(() => {
      speak({
        text: `Hello ${profile.childName}. Tonight, I will tell you a beautiful bedtime story.`,
        language: profile.language || 'English',
        rate: 0.92,
        volume: 1,
        preferredVoiceName: voiceName,
      });
    }, 100);
  };

  const handleReset = () => {
    if (confirm('Clear family profile and start over?')) {
      clear();
      navigate('/onboarding');
    }
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Settings</p>
        <h1 className="display-title mt-1 text-ink">Dreemo for {profile.childName}</h1>
      </header>

      {/* Family card */}
      <section className="card-elevated mb-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-3xl">
            🌙
          </div>
          <div className="flex-1">
            <div className="font-display text-xl font-bold text-ink">{profile.childName}</div>
            <div className="text-xs text-ink-muted">
              Age {profile.age} ·{' '}
              {RELIGIONS.find((r) => r.key === profile.religion)?.label || 'Open to all'}
              {profile.country &&
                ` · ${COUNTRIES.find((c) => c.key === profile.country)?.label || profile.country}`}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <SectionCard title="Customize">
        <div className="grid grid-cols-2 gap-3">
          <NavTile
            icon="🎙️"
            title="Voice Studio"
            sub={`${voices.length} ${voices.length === 1 ? 'voice' : 'voices'}`}
            onClick={() => navigate('/voices')}
          />
          <NavTile
            icon="🪷"
            title="Cultural Lessons"
            sub="Many traditions"
            onClick={() => navigate('/lessons')}
          />
          <NavTile icon="✨" title="Guides" sub="5 reads" onClick={() => navigate('/guides')} />
          <NavTile icon="🛣️" title="Roadmap" sub="Build status" onClick={() => navigate('/roadmap')} />
        </div>
      </SectionCard>

      {/* APPEARANCE */}
      <SectionCard title="Appearance">
        <Toggle
          id="theme-toggle"
          checked={theme === 'day'}
          onChange={() => toggleTheme()}
          label={theme === 'day' ? 'Day mode' : 'Night mode'}
          description={
            theme === 'day'
              ? 'Warm cream background. Switch to night for bedtime.'
              : 'Deep night palette. Tap to switch to warm day mode.'
          }
        />
      </SectionCard>

      {/* PLAYBACK */}
      <SectionCard title="Playback">
        <div className="space-y-2">
          <Toggle
            id="autoplay-toggle"
            checked={!!profile.autoplayNext}
            onChange={(v) => update({ autoplayNext: v })}
            label="Autoplay next related story"
            description="When one story ends, automatically queue another using the same value."
          />
          <Toggle
            id="whitenoise-toggle"
            checked={!!profile.whiteNoiseEnabled}
            onChange={(v) => update({ whiteNoiseEnabled: v })}
            label="Layer white noise under stories"
            description="Soft ambient sounds (rain, ocean, fan, drone) play under the narration. Choose from the player."
          />
          <Toggle
            id="dialogue-fade-toggle"
            checked={!!profile.dialogueFade}
            onChange={(v) => update({ dialogueFade: v })}
            label="Dialogue fades as your child sleeps"
            description="Story narration gradually softens while white noise grows over the second half."
          />
        </div>
      </SectionCard>

      {/* CONTENT */}
      <SectionCard title="Content preferences">
        <div className="space-y-2">
          <Toggle
            id="only-tradition-toggle"
            checked={!!profile.onlyMyTradition}
            onChange={(v) => update({ onlyMyTradition: v })}
            label="Only show stories from my tradition"
            description={`Cultural Lessons will only show ${
              RELIGIONS.find((r) => r.key === profile.religion)?.label || 'your tradition'
            } stories.`}
          />
          <Toggle
            id="cross-culture-toggle"
            checked={!!profile.openToAllCultures}
            onChange={(v) => update({ openToAllCultures: v })}
            label="Show similar stories from other cultures"
            description="Help your child grow up open-minded — same lesson, many traditions."
          />
        </div>
      </SectionCard>

      {/* LANGUAGE */}
      <SectionCard title="Language">
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              onClick={() => update({ language: l.key })}
              className={`rounded-2xl px-3 py-3 text-left transition ${
                profile.language === l.key
                  ? 'bg-gold text-bg-base shadow-glow'
                  : 'bg-bg-surface text-ink ring-1 ring-white/5'
              }`}
            >
              <div className="font-display text-lg">{l.label}</div>
              <div
                className={`text-[10px] ${
                  profile.language === l.key ? 'text-bg-base/70' : 'text-ink-muted'
                }`}
              >
                {l.key}
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* DEVICE VOICES */}
      <SectionCard title="Browser narrator voice">
        <p className="mb-3 text-xs text-ink-muted">
          {availableVoices.length === 0
            ? 'Loading voices…'
            : `${availableVoices.length} voices available. Tap to preview.`}
        </p>
        <div className="space-y-2">
          {availableVoices.slice(0, 6).map((v, idx) => {
            const active = profile.preferredVoiceName === v.name;
            const isTop = idx === 0;
            return (
              <button
                key={v.name}
                onClick={() => {
                  update({ preferredVoiceName: v.name });
                  previewVoice(v.name);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  active
                    ? 'bg-gold/15 ring-1 ring-gold'
                    : 'bg-bg-surface ring-1 ring-white/5 hover:bg-bg-elevated'
                }`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                    active ? 'bg-gold text-bg-base' : 'bg-bg-card text-gold'
                  }`}
                >
                  ▶
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-ui text-sm font-bold text-ink">
                    {v.name}
                    {isTop && (
                      <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {v.lang} · {v.localService ? 'On device' : 'Cloud'}
                  </div>
                </div>
                {active && <span className="text-xs font-bold text-gold">✓</span>}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* SUBSCRIPTION */}
      <SectionCard title="Subscription">
        <div className="card flex items-center justify-between">
          <div>
            <div className="font-ui text-sm font-bold text-ink">{tier.label} plan</div>
            <div className="text-xs text-ink-muted">
              {used}/{tier.storiesPerWeek === Infinity ? '∞' : tier.storiesPerWeek} stories this week
            </div>
          </div>
          <button onClick={() => setUpgradeOpen(true)} className="btn-primary">
            Upgrade
          </button>
        </div>
      </SectionCard>

      {/* DANGER */}
      <section className="mt-6">
        <button
          onClick={handleReset}
          className="text-xs uppercase tracking-wider text-negative/80"
        >
          Reset family profile
        </button>
      </section>

      <p className="mt-10 text-center text-[10px] text-ink-dim">
        Dreemo POC · in-house build · no external APIs
      </p>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <VersionFooter />
    </PageTransition>
  );
}

function NavTile({ icon, title, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-2xl bg-bg-surface p-4 text-left shadow-card ring-1 ring-white/5 transition hover:bg-bg-elevated active:scale-[0.98]"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold/15 text-2xl">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-ui text-sm font-bold text-ink">{title}</div>
        <div className="text-[11px] text-ink-muted">{sub}</div>
      </div>
    </button>
  );
}
