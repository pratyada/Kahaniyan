import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { LANGUAGES, NARRATORS } from '../utils/constants.js';
import { TIERS, storiesThisWeek } from '../utils/tierGate.js';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, update, clear } = useFamilyProfile();
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
        <h1 className="display-title mt-1 text-ink">Family</h1>
      </header>

      {/* Profile card */}
      <section className="card-elevated mb-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-3xl">
            🌙
          </div>
          <div className="flex-1">
            <div className="font-display text-xl font-bold text-ink">{profile.childName}</div>
            <div className="text-xs text-ink-muted">Age {profile.age}</div>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {profile.sibling && (
            <Row label="Sibling" value={profile.sibling} />
          )}
          {profile.grandfather && (
            <Row label="Grandfather" value={profile.grandfather} />
          )}
          {profile.grandmother && (
            <Row label="Grandmother" value={profile.grandmother} />
          )}
          {profile.pet && <Row label="Pet" value={profile.pet} />}
        </dl>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h2 className="ui-label mb-3">Language</h2>
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
              <div className={`text-[10px] ${profile.language === l.key ? 'text-bg-base/70' : 'text-ink-muted'}`}>
                {l.key}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Device voice picker — biggest free quality win */}
      <section className="mb-6">
        <h2 className="ui-label mb-3">Narrator voice (device)</h2>
        <p className="mb-3 text-xs text-ink-muted">
          {availableVoices.length === 0
            ? 'Loading voices… (some browsers take a moment)'
            : `${availableVoices.length} voices available for ${profile.language}. Tap to preview.`}
        </p>
        <div className="space-y-2">
          {availableVoices.slice(0, 8).map((v, idx) => {
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
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    {v.lang} · {v.localService ? 'On device' : 'Cloud'}
                  </div>
                </div>
                {active && <span className="text-xs font-bold text-gold">✓</span>}
              </button>
            );
          })}
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-ink-dim">
            Why does the voice still sound robotic?
          </summary>
          <div className="mt-2 space-y-2 rounded-2xl bg-bg-base/60 p-3 text-[11px] leading-relaxed text-ink-muted">
            <p>
              Browser voices vary wildly. To get a real "narrator" voice for free:
            </p>
            <p>
              <strong className="text-ink">macOS / iOS:</strong> System Settings → Accessibility →
              Spoken Content → System Voice → Manage Voices. Download a "Premium" or "Enhanced"
              voice (Samantha, Daniel, Karen, Serena). Then come back and pick it here.
            </p>
            <p>
              <strong className="text-ink">Chrome:</strong> Voices labelled "Google" or "Natural" are
              the highest quality. They appear automatically.
            </p>
            <p>
              For studio-quality narration, the next step is wiring up ElevenLabs (paid) — the
              architecture is ready for it.
            </p>
          </div>
        </details>
      </section>

      {/* Default narrator */}
      <section className="mb-6">
        <h2 className="ui-label mb-3">Default narrator</h2>
        <div className="grid grid-cols-5 gap-1">
          {NARRATORS.map((n) => (
            <button
              key={n.key}
              onClick={() => update({ defaultVoice: n.key })}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition ${
                profile.defaultVoice === n.key ? 'bg-bg-elevated' : ''
              }`}
            >
              <span className="text-2xl">{n.emoji}</span>
              <span className="text-[10px] text-ink-muted">{n.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Subscription */}
      <section className="mb-6">
        <h2 className="ui-label mb-3">Subscription</h2>
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
      </section>

      {/* Danger */}
      <section className="mt-10">
        <button onClick={handleReset} className="text-xs uppercase tracking-wider text-negative/80">
          Reset family profile
        </button>
      </section>

      <p className="mt-10 text-center text-[10px] text-ink-dim">
        Kahaniyo POC · in-house build · no external APIs
      </p>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <VersionFooter />
    </PageTransition>
  );
}

function Row({ label, value }) {
  return (
    <div className="rounded-xl bg-bg-base/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-dim">{label}</div>
      <div className="mt-0.5 font-ui text-sm text-ink">{value}</div>
    </div>
  );
}
