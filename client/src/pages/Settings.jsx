import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import SectionCard from '../components/SectionCard.jsx';
import Toggle from '../components/Toggle.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useTheme } from '../hooks/useTheme.jsx';
import { useFamilyVoices } from '../hooks/useFamilyVoices.jsx';
import { RELIGIONS } from '../utils/constants.js';
import { TIERS, storiesThisWeek } from '../utils/tierGate.js';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, profiles, activeIndex, update, clear, switchKid } = useFamilyProfile();
  const { user, logout, isConfigured } = useAuth();
  const { isAdmin } = useAdmin();
  const { theme, toggle: toggleTheme } = useTheme();
  const { voices } = useFamilyVoices();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [upgradeSuccess, setUpgradeSuccess] = useState(null);

  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    if (upgraded) {
      setUpgradeSuccess(upgraded);
      // Clear the query param
      setSearchParams({}, { replace: true });
      // Auto-dismiss after 5 seconds
      setTimeout(() => setUpgradeSuccess(null), 5000);
    }
  }, [searchParams, setSearchParams]);

  if (!profile) return null;

  const tier = TIERS[profile.tier || 'free'];
  const used = storiesThisWeek();
  const beliefs = profile.beliefs || [];

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* ─── KID SWITCHER ─── */}
      {profiles.length > 1 && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {profiles.map((p, i) => (
            <button
              key={i}
              onClick={() => switchKid(i)}
              className={`shrink-0 rounded-pill px-4 py-2 text-sm font-bold transition ${
                i === activeIndex
                  ? 'bg-gold text-bg-base shadow-glow'
                  : 'bg-bg-surface text-ink-muted ring-1 ring-white/5'
              }`}
            >
              {p.childName || `Kid ${i + 1}`}
            </button>
          ))}
          <button
            onClick={() => navigate('/onboarding')}
            className="shrink-0 rounded-pill bg-bg-surface px-4 py-2 text-sm font-bold text-gold ring-1 ring-gold/30"
          >
            + Add kid
          </button>
        </div>
      )}

      {/* Success banner */}
      {upgradeSuccess && (
        <div className="mb-4 rounded-2xl bg-green-900/30 p-4 text-center ring-1 ring-green-400/30">
          <div className="text-2xl">🎉</div>
          <div className="mt-1 text-sm font-bold text-green-400">
            Welcome to Qissaa {upgradeSuccess.charAt(0).toUpperCase() + upgradeSuccess.slice(1)}!
          </div>
          <div className="mt-1 text-xs text-green-400/70">
            Your account is being upgraded. It may take a moment to reflect.
          </div>
        </div>
      )}

      {/* ─── HERO CARD — compact ─── */}
      <section className="card-elevated mb-5 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-3xl">
          {profile.characters?.find((c) => c.relation === 'self')?.emoji || '🌙'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-bold text-ink">{profile.childName}</div>
          <div className="text-[11px] text-ink-muted">
            {beliefs.length > 0
              ? beliefs.map((b) => RELIGIONS.find((r) => r.key === b)?.label).filter(Boolean).join(', ')
              : 'All traditions'}
          </div>
        </div>
        <button
          onClick={() => navigate('/family')}
          className="shrink-0 rounded-pill bg-bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold"
        >
          Edit
        </button>
      </section>

      {(() => {
        const currentTier = profile?.tier || 'free';
        const limits = { free: 1, pro: 3, enterprise: 10, family: 3, annual: 10 };
        const max = limits[currentTier] || 1;
        const canAdd = profiles.length < max;
        return canAdd ? (
          <button
            onClick={() => navigate('/onboarding')}
            className="mb-5 w-full rounded-2xl bg-bg-surface p-3 text-center text-[11px] font-bold text-gold ring-1 ring-gold/20"
          >
            + Add another kid ({profiles.length}/{max})
          </button>
        ) : profiles.length <= 1 ? null : (
          <div className="mb-5 w-full rounded-2xl bg-bg-surface p-3 text-center text-[11px] text-ink-muted ring-1 ring-white/5">
            {max} / {max} kids — upgrade to add more
          </div>
        );
      })()}

      {/* ─── CUSTOMIZE ─── */}
      <SectionCard title="Customize">
        <div className="grid grid-cols-2 gap-2">
          <Tile icon="👨‍👩‍👧" title="Story cast" sub={`${profile.characters?.length || 0} chars`} onClick={() => navigate('/characters')} />
          <Tile icon="🪷" title="Wisdom Stories" sub="By belief" onClick={() => navigate('/lessons')} />
          <Tile icon="🎙️" title="Voices" sub={`${voices.length} saved`} onClick={() => navigate('/voices')} />
          <Tile icon="🏠" title="Edit family" sub="Name, age, belief" onClick={() => navigate('/family')} />
        </div>
      </SectionCard>

      {/* ─── TOGGLES — compact stack ─── */}
      <SectionCard title="Playback">
        <div className="space-y-1.5">
          <MiniToggle
            checked={theme === 'day'}
            onChange={toggleTheme}
            label={theme === 'day' ? '☀️ Day mode' : '🌙 Night mode'}
          />
          <MiniToggle
            checked={!!profile.autoplayNext}
            onChange={(v) => update({ autoplayNext: v })}
            label="🔁 Autoplay next story"
          />
          <MiniToggle
            checked={!!profile.whiteNoiseEnabled}
            onChange={(v) => update({ whiteNoiseEnabled: v })}
            label="🌧️ Sleep sounds behind stories"
          />
          <MiniToggle
            checked={!!profile.dialogueFade}
            onChange={(v) => update({ dialogueFade: v })}
            label="🌙 Story voice fades into sleep sounds"
          />
        </div>
      </SectionCard>

      <SectionCard title="Content">
        <div className="space-y-1.5">
          <MiniToggle
            checked={!!profile.onlyMyTradition}
            onChange={(v) => update({ onlyMyTradition: v })}
            label="Only stories from my beliefs"
          />
          <MiniToggle
            checked={!!profile.showCrossCulture}
            onChange={(v) => update({ showCrossCulture: v })}
            label="Also show similar stories from other cultures"
          />
        </div>
      </SectionCard>

      {/* ─── MORE ─── */}
      <SectionCard title="More">
        <div className="grid grid-cols-2 gap-2">
          <Tile icon="✨" title="Guides" sub="5 reads" onClick={() => navigate('/guides')} />
          <Tile icon="🛣️" title="Roadmap" sub="Build status" onClick={() => navigate('/roadmap')} />
          {isAdmin && (
            <Tile icon="🔑" title="Admin" sub="Dashboard" onClick={() => navigate('/admin')} />
          )}
        </div>
      </SectionCard>

      {/* ─── ABOUT ─── */}
      <section className="mb-6 rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📖</span>
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Qissaa</h3>
            <p className="mt-1 font-story text-[13px] leading-relaxed text-ink-muted">
              <strong className="text-ink">Qissaa</strong> (قصّہ / क़िस्सा) — from the Arabic
              "qissa," meaning a tale, a narrative, a story. In Urdu and Hindi, it's the word
              grandmothers use at bedtime: <em>"Ek qissa sunao na..."</em> — "Tell me a story."
            </p>
            <p className="mt-2 font-story text-[13px] leading-relaxed text-ink-muted">
              Every culture has this word. Arabic: qissa. Hindi: kahani. Tamil: kathai.
              Swahili: hadithi. Qissaa is built for all of them — personalized bedtime stories
              rooted in your family's values, voices, and beliefs.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PLAN ─── */}
      <div className="mt-2 flex items-center justify-between rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
        <div>
          <div className="text-sm font-bold text-ink">{tier.label}</div>
          <div className="text-[11px] text-ink-muted">
            {used}/{tier.storiesPerWeek === Infinity ? '∞' : tier.storiesPerWeek} this week
          </div>
        </div>
        <button onClick={() => setUpgradeOpen(true)} className="btn-primary">
          Upgrade
        </button>
      </div>

      {/* ─── ACCOUNT ─── */}
      {isConfigured && user && (
        <SectionCard title="Account">
          <div className="flex items-center justify-between rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-ink">
                {user.displayName || user.email}
              </div>
              {user.displayName && (
                <div className="truncate text-[11px] text-ink-muted">{user.email}</div>
              )}
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="shrink-0 rounded-pill bg-bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted"
            >
              Log out
            </button>
          </div>
        </SectionCard>
      )}

      {/* ─── DANGER ─── */}
      <button
        onClick={() => {
          if (confirm('Remove this profile?')) {
            clear();
            if (profiles.length <= 1) navigate('/onboarding');
          }
        }}
        className="mt-6 text-[10px] uppercase tracking-wider text-negative/70"
      >
        Remove profile
      </button>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <VersionFooter />
    </PageTransition>
  );
}

function Tile({ icon, title, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-2xl bg-bg-surface p-3 text-left ring-1 ring-white/5 transition active:scale-[0.98]"
    >
      <span className="text-xl">{icon}</span>
      <div className="min-w-0">
        <div className="text-[12px] font-bold text-ink">{title}</div>
        <div className="text-[10px] text-ink-muted">{sub}</div>
      </div>
    </button>
  );
}

function MiniToggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-bg-surface px-3 py-2.5 ring-1 ring-white/5"
    >
      <span className="text-[12px] font-bold text-ink">{label}</span>
      <span
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/15'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-bg-base shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}
