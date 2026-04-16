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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { useTheme } from '../hooks/useTheme.jsx';
import { useFamilyVoices } from '../hooks/useFamilyVoices.jsx';
import { RELIGIONS } from '../utils/constants.js';
import { TIERS, storiesThisWeek } from '../utils/tierGate.js';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, profiles, activeIndex, update, clear, switchKid } = useFamilyProfile();
  const { user, logout, loginGoogle, isConfigured } = useAuth();
  const { isAdmin } = useAdmin();
  const { theme, toggle: toggleTheme } = useTheme();
  const { voices } = useFamilyVoices();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!feedbackText.trim() || !user) return;
    setFeedbackSubmitting(true);
    try {
      await setDoc(doc(db, 'feedback', user.uid + '_' + Date.now()), {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        text: feedbackText.trim(),
        createdAt: new Date().toISOString(),
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => { setFeedbackSent(false); setFeedbackOpen(false); }, 3000);
    } catch (e) {
      alert('Could not send feedback: ' + e.message);
    }
    setFeedbackSubmitting(false);
  };
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

  // Not signed in — show sign-in prompt with direct Google sign-in
  if (!user && isConfigured) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 text-5xl">🌙</div>
          <h1 className="font-display text-2xl font-bold text-gold">Welcome to My Sleepy Tale</h1>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Sign in to set up your child's profile, customize characters, and start creating personalized bedtime stories.
          </p>
          <button
            onClick={async () => {
              try {
                await loginGoogle();
                navigate('/');
              } catch {}
            }}
            className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-pill bg-white px-6 py-4 font-ui text-sm font-bold text-gray-800 shadow-card transition active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <div className="mt-10 w-full space-y-3">
            <Tile icon="🤝" title="Invest" sub="Back this project" onClick={() => navigate('/invest')} />
          <Tile icon="🪨" title="Kid slept?" sub="Stoned Age awaits" onClick={() => window.location.href = 'https://stonedage.mysleepytale.com'} />
            <Tile icon="✨" title="Guides" sub="Learn how it works" onClick={() => navigate('/guides')} />
          </div>
        </div>
        <VersionFooter />
      </PageTransition>
    );
  }

  if (!profile) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 text-5xl">👶</div>
          <h1 className="font-display text-xl font-bold text-gold">Set up your child's profile</h1>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Complete onboarding to start creating personalized bedtime stories.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="btn-primary mt-6 px-8 py-4"
          >
            Start onboarding
          </button>
        </div>
        <VersionFooter />
      </PageTransition>
    );
  }

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
            Welcome to My Sleepy Tale {upgradeSuccess.charAt(0).toUpperCase() + upgradeSuccess.slice(1)}!
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

      {/* Share your thoughts */}
      {user && (
        <button
          onClick={() => setFeedbackOpen(true)}
          className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-gold/10 p-4 text-left ring-1 ring-gold/20 transition active:scale-[0.99]"
        >
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-gold">Share your thoughts</div>
            <div className="text-[11px] text-ink-muted">Your feedback shapes what we build next</div>
          </div>
          <span className="text-ink-muted">→</span>
        </button>
      )}

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}>
          <div className="w-full rounded-t-3xl bg-bg-elevated p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            {feedbackSent ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-4xl">💛</div>
                <h2 className="font-display text-xl font-bold text-gold">Thank you!</h2>
                <p className="mt-2 text-sm text-ink-muted">Your words mean more than you know.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-gold">Share your thoughts</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  What do you love? What's missing? What would make this perfect for your family?
                </p>
                <textarea
                  autoFocus
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Your honest feedback helps us build something better..."
                  rows={4}
                  className="mt-4 w-full rounded-2xl bg-bg-surface px-4 py-3 font-story text-[15px] leading-relaxed text-ink placeholder:text-ink-dim outline-none ring-1 ring-white/5 focus:ring-gold"
                />
                <button
                  onClick={submitFeedback}
                  disabled={feedbackSubmitting || !feedbackText.trim()}
                  className="btn-primary mt-4 w-full py-4 disabled:opacity-40"
                >
                  {feedbackSubmitting ? 'Sending...' : 'Send feedback'}
                </button>
                <button onClick={() => setFeedbackOpen(false)} className="mt-3 w-full text-center text-sm text-ink-muted">
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
          <Tile icon="🤝" title="Invest" sub="Back this project" onClick={() => navigate('/invest')} />
          <Tile icon="🪨" title="Kid slept?" sub="Stoned Age awaits" onClick={() => window.location.href = 'https://stonedage.mysleepytale.com'} />
          {isAdmin && (
            <Tile icon="🔑" title="Admin" sub="Dashboard" onClick={() => navigate('/admin')} />
          )}
        </div>
      </SectionCard>

      {/* Releases */}
      <SectionCard title="What's new">
        <div className="space-y-2">
          {[
            { v: 'v0.0.9', date: 'Apr 16', badge: 'LATEST', title: '🧠 Claude AI stories + your feedback shipped', detail: 'After community feedback: stories are now fun, silly, and kid-appropriate. Powered by Claude AI — every story is fresh. 5-min generation fully validated.' },
            { v: 'v0.0.8', date: 'Apr 15', title: '🔊 OpenAI voice + cloud sync', detail: 'AI narrator voices. Profile syncs to cloud. Gender pronouns. Character tags.' },
            { v: 'v0.0.7', date: 'Apr 14', title: '👨‍👩‍👧 Cast stories + multi-kid', detail: 'Choose characters for tonight. Multiple kids. Pet sounds (bhau bhau!).' },
            { v: 'v0.0.5', date: 'Apr 13', title: '🔐 Auth + admin dashboard', detail: 'Google sign-in. Admin panel. Usage analytics. Team roles.' },
            { v: 'v0.0.3', date: 'Apr 12', title: '🪷 Wisdom stories + radio', detail: '8 traditions, 15 stories. Bedtime radio. Sleep sounds.' },
            { v: 'v0.0.1', date: 'Apr 11', title: '🌙 First build', detail: 'Story engine, Spotify-style UI, onboarding, player.' },
          ].map((r) => (
            <div key={r.v} className="rounded-xl bg-bg-surface p-3 ring-1 ring-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gold">{r.v}</span>
                <span className="text-[9px] text-ink-dim">{r.date}</span>
                {r.badge && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">{r.badge}</span>}
              </div>
              <div className="mt-1 text-[12px] font-bold text-ink">{r.title}</div>
              <div className="mt-0.5 text-[10px] text-ink-muted">{r.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ─── ABOUT ─── */}
      <section className="mb-6 rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📖</span>
          <div>
            <h3 className="font-display text-lg font-bold text-gold">My Sleepy Tale</h3>
            <p className="mt-1 font-story text-[13px] leading-relaxed text-ink-muted">
              Every child deserves a bedtime story that sounds like home — with their name,
              their family, their values, and the warm voice of someone who loves them.
            </p>
            <p className="mt-2 font-story text-[13px] leading-relaxed text-ink-muted">
              <strong className="text-ink">My Sleepy Tale</strong> is personalized AI bedtime
              storytelling — rooted in your culture, narrated in a voice that feels familiar,
              and woven fresh every single night. One story. One child. One gentle slide into sleep.
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
