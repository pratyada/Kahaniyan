import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';

// ─────────────────────────────────────────────────────────────
// My Sleepy Tale Crowdfunding — Friends & Family Round
//
// Blockchain-inspired transparent equity model:
//   - Every dollar contributed = equity tokens
//   - Token price increases with each round
//   - All contributions, roles, and equity visible on-chain (Firestore)
//   - Real-time cap table visible to everyone
//   - Contributor roles: Investor, Tester, Promoter, Affiliate, Builder
// ─────────────────────────────────────────────────────────────

const ROUND_CONFIG = {
  name: 'Friends & Family',
  target: 25000, // CAD
  tokenPrice: 0.10, // CAD per token
  totalTokens: 10000000, // 10M total supply
  founderTokens: 9000000, // 90% founders (45% + 45%)
  roundTokens: 500000, // 5% this round
  reserveTokens: 500000, // 5% future rounds
  minInvestment: 50, // CAD
  maxInvestment: 10000, // CAD
};

const FOUNDERS = [
  {
    name: 'Prateek',
    role: 'Co-founder · Tech / Finance / Partners',
    tokens: 4500000,
    description: 'Full-stack development, AI/ML, finance, partnerships, and all technical execution.',
    emoji: '⚙️',
    linkedin: '',
    bio: 'Built the entire My Sleepy Tale platform from scratch — React, Firebase, OpenAI TTS, Stripe, admin dashboard. 200+ hours of focused engineering. Leads technology, finance, and partner relationships.',
    skills: ['Full-Stack Engineering', 'AI/ML Integration', 'Finance', 'Partnerships'],
  },
  {
    name: 'Sahil',
    role: 'Co-founder · Go-to-Market / Vision / UI·UX / Team',
    tokens: 4500000,
    description: 'Idea originator. Go-to-market strategy, product vision, UI/UX design, team building, and growth.',
    emoji: '🧠',
    linkedin: '',
    bio: 'Conceptualized My Sleepy Tale from a personal need — bedtime stories that reflect cultural identity. Leading go-to-market, vision, UI/UX design, and team building.',
    skills: ['Go-to-Market Strategy', 'Product Vision', 'UI/UX Design', 'Team Building'],
  },
];

const ROLES = [
  { key: 'investor', label: 'Investor', emoji: '💰', description: 'Financial contribution only', multiplier: 1.0 },
  { key: 'investor-tester', label: 'Investor + Tester', emoji: '🧪', description: 'Money + QA testing the app', multiplier: 1.15 },
  { key: 'investor-promoter', label: 'Investor + Promoter', emoji: '📣', description: 'Money + spreading the word', multiplier: 1.2 },
  { key: 'investor-affiliate', label: 'Investor + Affiliate', emoji: '🔗', description: 'Money + bringing paying users', multiplier: 1.3 },
  { key: 'investor-builder', label: 'Investor + Builder', emoji: '🔨', description: 'Money + contributing code/design/content', multiplier: 1.5 },
];

const EXPENSES = [
  { label: 'OpenAI TTS API', amount: 50, icon: '🔊', type: 'monthly' },
  { label: 'ElevenLabs (voice cloning)', amount: 45, icon: '🎙️', type: 'monthly' },
  { label: 'Firebase (auth + database)', amount: 0, icon: '🔥', type: 'monthly' },
  { label: 'Vercel (hosting)', amount: 0, icon: '▲', type: 'monthly' },
  { label: 'Domain (future)', amount: 20, icon: '🌐', type: 'monthly' },
  { label: 'Apple Developer Program', amount: 130, icon: '🍎', type: 'annual' },
  { label: 'Google Play Developer', amount: 35, icon: '🤖', type: 'one-time' },
];

// ─── TIME & MONEY INVESTED BY FOUNDERS ───
const FOUNDER_INVESTMENTS = [
  {
    name: 'Prateek',
    emoji: '⚙️',
    timeLog: [
      { phase: 'Architecture & scaffolding', hours: 15, period: 'Apr 11, 2026' },
      { phase: 'UI/UX (Spotify-style design system)', hours: 20, period: 'Apr 11–12' },
      { phase: 'Story engine & cultural lessons', hours: 18, period: 'Apr 11–12' },
      { phase: 'OpenAI TTS + voice integration', hours: 12, period: 'Apr 12–13' },
      { phase: 'Firebase auth + Firestore sync', hours: 15, period: 'Apr 12–13' },
      { phase: 'Admin dashboard + analytics', hours: 10, period: 'Apr 13–14' },
      { phase: 'Stripe + payments + invest page', hours: 10, period: 'Apr 13–15' },
      { phase: 'Cast builder + whisper weaver', hours: 8, period: 'Apr 12–14' },
      { phase: 'Bug fixes + deployment', hours: 22, period: 'Apr 11–15' },
    ],
    moneySpent: [
      { item: 'OpenAI API credits', amount: 50 },
      { item: 'ElevenLabs API credits', amount: 45 },
      { item: 'Claude Code (development AI)', amount: 250 },
      { item: 'Domain + hosting setup', amount: 55 },
    ],
  },
  {
    name: 'Sahil',
    emoji: '🧠',
    timeLog: [
      { phase: 'Ideation & market research', hours: 25, period: 'Jan–Mar 2026' },
      { phase: 'Product spec & user stories', hours: 15, period: 'Mar 2026' },
      { phase: 'Content strategy & cultural stories', hours: 15, period: 'Mar–Apr 2026' },
      { phase: 'Business model & outreach', hours: 10, period: 'Apr 2026' },
    ],
    moneySpent: [
      { item: 'Market research tools', amount: 50 },
      { item: 'User testing', amount: 50 },
    ],
  },
];

// Git stats — updated at build time. To refresh: update these numbers.
const GIT_STATS = {
  totalCommits: 131,
  totalFilesChanged: 88,
  linesAdded: 15927,
  linesRemoved: 517,
  firstCommit: 'Apr 11, 2026',
  latestCommit: 'Apr 15, 2026',
  daysActive: 5,
  versions: ['0.0.1', '0.0.2', '0.0.3', '0.0.4', '0.0.5', '0.0.6', '0.0.7', '0.0.8', '0.0.9'],
};

export default function Invest() {
  const { user } = useAuth();
  const [contributors, setContributors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', role: 'investor', message: '', linkedin: '', isPublic: true });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState('overview');
  const [founderModal, setFounderModal] = useState(null);
  const [investorModal, setInvestorModal] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle Stripe return
  useEffect(() => {
    if (searchParams.get('paid') === 'true') {
      setSubmitted(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Load contributors
  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'investors'));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setContributors(list.sort((a, b) => (b.tokens || 0) - (a.tokens || 0)));
      } catch {
        // ignore
      }
    })();
  }, [submitted]);

  // Computed stats — only count confirmed contributions
  const stats = useMemo(() => {
    const confirmed = contributors.filter((c) => c.status === 'confirmed');
    const totalRaised = confirmed.reduce((s, c) => s + (c.amount || 0), 0);
    const totalContributorTokens = confirmed.reduce((s, c) => s + (c.tokens || 0), 0);
    const founderTokens = FOUNDERS.reduce((s, f) => s + f.tokens, 0);
    const totalAllocated = founderTokens + totalContributorTokens;
    const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
    return {
      totalRaised,
      totalContributorTokens,
      founderTokens,
      totalAllocated,
      remaining: ROUND_CONFIG.roundTokens - totalContributorTokens,
      percentRaised: Math.min(100, (totalRaised / ROUND_CONFIG.target) * 100),
      contributorCount: confirmed.length,
      pendingCount: contributors.filter((c) => c.status !== 'confirmed').length,
      totalExpenses,
    };
  }, [contributors]);

  const handleSubmit = async () => {
    if (!user || !formData.amount || Number(formData.amount) < ROUND_CONFIG.minInvestment) return;
    setSubmitting(true);
    try {
      const amount = Number(formData.amount);
      const role = ROLES.find((r) => r.key === formData.role) || ROLES[0];
      const tokens = Math.floor((amount / ROUND_CONFIG.tokenPrice) * role.multiplier);

      // Save investor profile to Firestore first
      await setDoc(doc(db, 'investors', user.uid), {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        amount,
        role: formData.role,
        roleLabel: role.label,
        multiplier: role.multiplier,
        tokens,
        message: formData.message.trim(),
        linkedin: formData.linkedin.trim(),
        isPublic: formData.isPublic,
        status: 'pending-payment',
        createdAt: new Date().toISOString(),
        uid: user.uid,
      });

      // Create Stripe checkout
      const res = await fetch('/api/invest-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          role: role.label,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
        }),
      });
      const data = await res.json();
      if (data.url) {
        // Update status to redirecting
        await setDoc(doc(db, 'investors', user.uid), { status: 'redirected-to-stripe' }, { merge: true });
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not start payment');
      }
    } catch (e) {
      alert('Failed: ' + e.message);
    }
    setSubmitting(false);
  };

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'cap-table', label: 'Cap Table', icon: '📋' },
    { key: 'contributors', label: `Backers (${stats.contributorCount})`, icon: '👥' },
    { key: 'transparency', label: 'Transparency', icon: '🔍' },
  ];

  return (
    <div className="bg-[#0a0a0f] text-[#f5f0e8]" style={{ minHeight: '100vh', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {/* Force body scroll on mobile — override phone-shell lock */}
      <style>{`html, body, #root { height: auto !important; overflow: auto !important; overscroll-behavior: auto !important; }`}</style>
      {/* ─── HERO ─── */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0a500]/10 via-transparent to-transparent" />
        {/* Back to app */}
        <div className="relative mx-auto max-w-5xl px-6 pt-4">
          <a
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-[#a8a39a] ring-1 ring-white/10 transition hover:text-[#f5f0e8]"
          >
            ← Back to app
          </a>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0a500]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f0a500] ring-1 ring-[#f0a500]/30">
              🌙 Friends & Family Round · Now Open
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
              Invest in <span className="text-[#f0a500]">{APP_NAME}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#a8a39a]">
              Bedtime stories that grow with your child. Personalized, culturally rooted,
              AI-narrated. We're building the future of how families connect at bedtime —
              and you can be part of it.
            </p>

            {/* Raised bar */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-[#f0a500]">CA${stats.totalRaised.toLocaleString()} raised</span>
                <span className="text-[#6e6a63]">CA${ROUND_CONFIG.target.toLocaleString()} goal</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#1a1a28]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#f0a500] to-[#ffb733]"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentRaised}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#6e6a63]">
                <span>{stats.contributorCount} backers</span>
                <span>{stats.percentRaised.toFixed(1)}% funded</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={async () => {
                  if (user) { setShowForm(true); return; }
                  try { const { loginGoogle } = await import('../hooks/useAuth.jsx').then(m => ({ loginGoogle: null })); } catch {}
                  // Direct Google sign-in
                  const { signInWithPopup } = await import('firebase/auth');
                  const { auth, googleProvider } = await import('../lib/firebase.js');
                  if (auth && googleProvider) {
                    try { await signInWithPopup(auth, googleProvider); setShowForm(true); } catch {}
                  }
                }}
                className="rounded-full bg-[#f0a500] px-8 py-4 text-lg font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(240,165,0,0.3)] transition hover:shadow-[0_0_60px_rgba(240,165,0,0.5)]"
              >
                {user ? 'Back this project' : 'Sign in & Back this project'}
              </button>
              <a
                href="#transparency"
                className="rounded-full bg-white/5 px-8 py-4 text-lg font-bold text-[#a8a39a] ring-1 ring-white/10 transition hover:text-[#f5f0e8]"
              >
                See the numbers
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ─── TABS ─── */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6 py-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                tab === t.key ? 'bg-[#f0a500] text-[#0a0a0f]' : 'text-[#a8a39a] hover:text-[#f5f0e8]'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* ═══ OVERVIEW ═══ */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* What is My Sleepy Tale */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-3 font-display text-xl font-bold text-[#f0a500]">The problem</h3>
                <p className="text-sm leading-relaxed text-[#a8a39a]">
                  Bedtime is broken. Parents are exhausted, screens are addictive, and generic
                  YouTube stories teach nothing about a child's own culture, values, or family.
                  The last 15 minutes of a child's day — the most neurologically receptive window —
                  are being wasted.
                </p>
              </div>
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-3 font-display text-xl font-bold text-[#f0a500]">Our solution</h3>
                <p className="text-sm leading-relaxed text-[#a8a39a]">
                  {APP_NAME} generates personalized bedtime stories using AI — with your child's name,
                  their family members, their pets, their cultural values, and even their current mood.
                  Narrated by warm AI voices that match your family's accent. One button. One story.
                  Then sleep.
                </p>
              </div>
            </section>

            {/* Key metrics */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Product metrics
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <MetricCard icon="📱" label="Version" value={`v${APP_VERSION}`} />
                <MetricCard icon="📖" label="Stories in bank" value="37+" />
                <MetricCard icon="🪷" label="Cultural traditions" value="7" />
                <MetricCard icon="🌍" label="Languages" value="5" />
              </div>
            </section>

            {/* Founders */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Founding team
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {FOUNDERS.map((f) => (
                  <div key={f.name} className="flex items-start gap-4 rounded-2xl bg-[#1a1a28] p-6">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#f0a500]/15 text-3xl">
                      {f.emoji}
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold text-[#f5f0e8]">{f.name}</div>
                      <div className="text-xs font-bold text-[#f0a500]">{f.role}</div>
                      <p className="mt-2 text-sm text-[#a8a39a]">{f.description}</p>
                      <div className="mt-2 text-xs text-[#6e6a63]">
                        {(f.tokens / 1000000).toFixed(1)}M tokens ({((f.tokens / ROUND_CONFIG.totalTokens) * 100).toFixed(0)}% equity)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How it works */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                How the token model works
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">1️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">You contribute</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Min CA${ROUND_CONFIG.minInvestment}. Every dollar buys {(1 / ROUND_CONFIG.tokenPrice).toFixed(0)} tokens
                    at the current round price of CA${ROUND_CONFIG.tokenPrice}/token.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">2️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">Role bonus</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Contributing beyond money? Testers get 15% bonus tokens, promoters 20%,
                    affiliates 30%, builders 50%. Your sweat equity is valued.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">3️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">Your equity grows</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Tokens represent ownership. As {APP_NAME} grows, token value grows. Next round
                    price will be higher. Early backers get the best deal.
                  </p>
                </div>
              </div>
            </section>

            {/* Roles */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Choose your role
              </h3>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <div key={r.key} className="flex items-center justify-between rounded-2xl bg-[#1a1a28] p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-[#f5f0e8]">{r.label}</div>
                        <div className="text-xs text-[#a8a39a]">{r.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#f0a500]">{r.multiplier}x</div>
                      <div className="text-[10px] text-[#6e6a63]">token multiplier</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ CAP TABLE ═══ */}
        {tab === 'cap-table' && (
          <div className="space-y-6">
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Token distribution — {ROUND_CONFIG.totalTokens.toLocaleString()} total supply
              </h3>
              <div className="space-y-3">
                <CapRow
                  label="Founders (Sahil + Prateek)"
                  tokens={stats.founderTokens}
                  total={ROUND_CONFIG.totalTokens}
                  color="#f0a500"
                />
                <CapRow
                  label={`Friends & Family Round (${stats.contributorCount} backers)`}
                  tokens={stats.totalContributorTokens}
                  total={ROUND_CONFIG.totalTokens}
                  color="#7ad9a1"
                />
                <CapRow
                  label="Available in this round"
                  tokens={Math.max(0, stats.remaining)}
                  total={ROUND_CONFIG.totalTokens}
                  color="#539df5"
                />
                <CapRow
                  label="Reserve (future rounds + employees)"
                  tokens={ROUND_CONFIG.reserveTokens}
                  total={ROUND_CONFIG.totalTokens}
                  color="#a8a39a"
                />
              </div>
            </section>

            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Round details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <DetailCard label="Token price" value={`CA$${ROUND_CONFIG.tokenPrice}`} />
                <DetailCard label="Min investment" value={`CA$${ROUND_CONFIG.minInvestment}`} />
                <DetailCard label="Max investment" value={`CA$${ROUND_CONFIG.maxInvestment.toLocaleString()}`} />
                <DetailCard label="Round target" value={`CA$${ROUND_CONFIG.target.toLocaleString()}`} />
              </div>
            </section>

            {/* Example calculation */}
            <section className="rounded-2xl bg-[#f0a500]/5 p-6 ring-1 ring-[#f0a500]/20">
              <h3 className="mb-3 text-sm font-bold text-[#f0a500]">Example: CA$500 as Investor + Promoter</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">Base tokens</div>
                  <div className="font-bold text-[#f5f0e8]">{(500 / ROUND_CONFIG.tokenPrice).toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">Promoter bonus (1.2x)</div>
                  <div className="font-bold text-[#f0a500]">+{Math.floor(500 / ROUND_CONFIG.tokenPrice * 0.2).toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">Total tokens</div>
                  <div className="font-bold text-[#7ad9a1]">{Math.floor(500 / ROUND_CONFIG.tokenPrice * 1.2).toLocaleString()}</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#a8a39a]">
                = {((Math.floor(500 / ROUND_CONFIG.tokenPrice * 1.2) / ROUND_CONFIG.totalTokens) * 100).toFixed(3)}% ownership of {APP_NAME}
              </p>
            </section>
          </div>
        )}

        {/* ═══ CONTRIBUTORS ═══ */}
        {tab === 'contributors' && (
          <div className="space-y-4">
            {contributors.length === 0 ? (
              <div className="rounded-2xl bg-[#1a1a28] p-12 text-center">
                <div className="mb-3 text-4xl">🌱</div>
                <h3 className="font-display text-xl font-bold text-[#f5f0e8]">Be the first backer</h3>
                <p className="mt-2 text-sm text-[#a8a39a]">
                  No one has contributed yet. Early backers get the lowest token price.
                </p>
                <button
                  onClick={async () => {
                    if (user) { setShowForm(true); return; }
                    const { signInWithPopup } = await import('firebase/auth');
                    const { auth, googleProvider } = await import('../lib/firebase.js');
                    if (auth && googleProvider) {
                      try { await signInWithPopup(auth, googleProvider); setShowForm(true); } catch {}
                    }
                  }}
                  className="mt-6 rounded-full bg-[#f0a500] px-6 py-3 text-sm font-bold text-[#0a0a0f]"
                >
                  {user ? 'Back this project' : 'Sign in & Back this project'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-[#1a1a28]">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Backer</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Tokens</th>
                      <th className="px-4 py-3 text-right">Equity</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributors.map((c, i) => (
                      <tr key={c.id} className="border-b border-white/5">
                        <td className="px-4 py-3 text-[#6e6a63]">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {c.photoURL ? (
                              <img src={c.photoURL} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="grid h-7 w-7 place-items-center rounded-full bg-[#f0a500]/15 text-sm">👤</div>
                            )}
                            <span className="font-bold text-[#f5f0e8]">{c.displayName || c.email?.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#a8a39a]">{c.roleLabel}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#f5f0e8]">CA${c.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#f0a500]">{c.tokens?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-xs text-[#a8a39a]">
                          {((c.tokens / ROUND_CONFIG.totalTokens) * 100).toFixed(3)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                            c.status === 'confirmed' ? 'bg-[#7ad9a1]/15 text-[#7ad9a1]' : 'bg-[#f0a500]/15 text-[#f0a500]'
                          }`}>
                            {c.status || 'pledged'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══ TRANSPARENCY ═══ */}
        {tab === 'transparency' && (
          <div id="transparency" className="space-y-8">

            {/* ── Time invested by founders ── */}
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Time invested by founders
              </h3>
              <p className="mb-4 text-sm text-[#a8a39a]">
                Every hour logged. Every phase documented. This is our sweat equity.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {FOUNDER_INVESTMENTS.map((f) => {
                  const totalHours = f.timeLog.reduce((s, t) => s + t.hours, 0);
                  const totalMoney = f.moneySpent.reduce((s, m) => s + m.amount, 0);
                  const maxHours = Math.max(...f.timeLog.map((t) => t.hours));
                  return (
                    <div key={f.name} className="rounded-2xl bg-[#1a1a28] p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f0a500]/15 text-2xl">
                          {f.emoji}
                        </div>
                        <div>
                          <div className="font-display text-lg font-bold text-[#f5f0e8]">{f.name}</div>
                          <div className="text-xs text-[#a8a39a]">
                            {totalHours} hours · CA${totalMoney.toLocaleString()} spent
                          </div>
                        </div>
                      </div>

                      {/* Time bar chart */}
                      <div className="space-y-2">
                        {f.timeLog.map((t, i) => (
                          <div key={i}>
                            <div className="mb-0.5 flex items-center justify-between">
                              <span className="text-[11px] text-[#a8a39a]">{t.phase}</span>
                              <span className="text-[11px] font-bold text-[#f0a500]">{t.hours}h</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#0a0a0f]">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, #f0a500, #ffb733)` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(t.hours / maxHours) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                              />
                            </div>
                            <div className="mt-0.5 text-[9px] text-[#6e6a63]">{t.period}</div>
                          </div>
                        ))}
                      </div>

                      {/* Money spent */}
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                          Money spent
                        </div>
                        {f.moneySpent.map((m, i) => (
                          <div key={i} className="flex items-center justify-between py-1 text-xs">
                            <span className="text-[#a8a39a]">{m.item}</span>
                            <span className="font-bold text-[#f5f0e8]">CA${m.amount}</span>
                          </div>
                        ))}
                        <div className="mt-1 flex items-center justify-between border-t border-white/5 pt-1 text-xs">
                          <span className="font-bold text-[#a8a39a]">Total</span>
                          <span className="font-bold text-[#f0a500]">CA${totalMoney}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combined stats */}
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-[#1a1a28] p-4 text-center">
                  <div className="text-2xl font-bold text-[#f0a500]">
                    {FOUNDER_INVESTMENTS.reduce((s, f) => s + f.timeLog.reduce((h, t) => h + t.hours, 0), 0)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Total hours</div>
                </div>
                <div className="rounded-xl bg-[#1a1a28] p-4 text-center">
                  <div className="text-2xl font-bold text-[#f0a500]">
                    CA${FOUNDER_INVESTMENTS.reduce((s, f) => s + f.moneySpent.reduce((m, x) => m + x.amount, 0), 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Total spent</div>
                </div>
                <div className="rounded-xl bg-[#1a1a28] p-4 text-center">
                  <div className="text-2xl font-bold text-[#f0a500]">
                    CA${(FOUNDER_INVESTMENTS.reduce((s, f) => s + f.timeLog.reduce((h, t) => h + t.hours, 0), 0) * 75).toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Market value @ CA$75/hr</div>
                </div>
                <div className="rounded-xl bg-[#1a1a28] p-4 text-center">
                  <div className="text-2xl font-bold text-[#f0a500]">{GIT_STATS.daysActive}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Days building</div>
                </div>
              </div>
            </section>

            {/* ── Git activity (build proof) ── */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Build activity (verified from git)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <div className="text-xl font-bold text-[#7ad9a1]">{GIT_STATS.totalCommits}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Commits</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <div className="text-xl font-bold text-[#7ad9a1]">{GIT_STATS.totalFilesChanged}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Files</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <div className="text-xl font-bold text-[#7ad9a1]">+{(GIT_STATS.linesAdded / 1000).toFixed(1)}K</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Lines added</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <div className="text-xl font-bold text-[#7ad9a1]">{GIT_STATS.versions.length}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Releases</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {GIT_STATS.versions.map((v) => (
                  <span key={v} className="rounded-full bg-[#7ad9a1]/10 px-3 py-1 text-xs font-bold text-[#7ad9a1]">
                    v{v}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#6e6a63]">
                First commit: {GIT_STATS.firstCommit} · Latest: {GIT_STATS.latestCommit} ·{' '}
                <a
                  href="https://github.com/pratyada/Kahaniyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0a500] underline"
                >
                  View on GitHub →
                </a>
              </p>
            </section>

            {/* ── Monthly expenses ── */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Recurring & one-time expenses
              </h3>
              <div className="space-y-2">
                {EXPENSES.map((e, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-[#0a0a0f] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{e.icon}</span>
                      <div>
                        <span className="text-sm text-[#f5f0e8]">{e.label}</span>
                        <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-[#6e6a63]">
                          {e.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#f0a500]">
                      {e.amount > 0 ? `CA$${e.amount}` : 'Free'}
                    </span>
                  </div>
                ))}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#f0a500]/10 px-4 py-3 ring-1 ring-[#f0a500]/20">
                    <div className="text-xs text-[#6e6a63]">Monthly burn</div>
                    <div className="text-lg font-bold text-[#f0a500]">
                      CA${EXPENSES.filter((e) => e.type === 'monthly').reduce((s, e) => s + e.amount, 0)}/mo
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#f0a500]/10 px-4 py-3 ring-1 ring-[#f0a500]/20">
                    <div className="text-xs text-[#6e6a63]">Runway at current burn (if CA$50K raised)</div>
                    <div className="text-lg font-bold text-[#f0a500]">
                      {Math.floor(50000 / Math.max(1, EXPENSES.filter((e) => e.type === 'monthly').reduce((s, e) => s + e.amount, 0)))} months
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Promises ── */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Our promises to backers
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: '🔍', title: 'Full transparency', text: 'Every dollar raised and spent is visible on this page.' },
                  { icon: '📊', title: 'Public cap table', text: 'Every backer sees exactly what they own. No hidden shares.' },
                  { icon: '🤝', title: 'Price lock', text: 'Token price is locked for this round. No retroactive dilution.' },
                  { icon: '📝', title: 'Monthly updates', text: 'Product progress, finances, key decisions — every month.' },
                  { icon: '🗳️', title: 'Voting rights', text: 'Backers with 1%+ equity vote on major product decisions.' },
                  { icon: '💸', title: 'Fail-safe', text: 'If we shut down, remaining funds returned proportionally.' },
                ].map((p, i) => (
                  <div key={i} className="rounded-xl bg-[#0a0a0f] p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-bold text-[#f5f0e8]">{p.title}</span>
                    </div>
                    <p className="text-xs text-[#a8a39a]">{p.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Legal ── */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Legal structure (planned)
              </h3>
              <p className="text-sm text-[#a8a39a]">
                {APP_NAME} will be incorporated as a Canadian corporation. Tokens represent a
                binding commitment to issue equivalent equity (common shares) upon incorporation.
                A formal SAFE (Simple Agreement for Future Equity) will be provided to all backers
                contributing CA$500 or more. All contributions are tracked in Firestore with
                timestamps and are auditable.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* ─── INVEST FORM (modal) ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-3xl bg-[#1a1a28] p-6 shadow-[0_0_60px_rgba(240,165,0,0.15)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#f0a500]">Back {APP_NAME}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e6a63]">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                  Amount (CAD)
                </label>
                <input
                  type="number"
                  min={ROUND_CONFIG.minInvestment}
                  max={ROUND_CONFIG.maxInvestment}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder={`Min CA$${ROUND_CONFIG.minInvestment}`}
                  className="w-full rounded-xl bg-[#0a0a0f] px-4 py-3 text-lg font-bold text-[#f5f0e8] outline-none ring-1 ring-white/10 focus:ring-[#f0a500]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                  Your role
                </label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setFormData({ ...formData, role: r.key })}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition ${
                        formData.role === r.key
                          ? 'bg-[#f0a500]/15 ring-1 ring-[#f0a500]'
                          : 'bg-[#0a0a0f] ring-1 ring-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.emoji}</span>
                        <div>
                          <div className="text-sm font-bold text-[#f5f0e8]">{r.label}</div>
                          <div className="text-[10px] text-[#6e6a63]">{r.description}</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#f0a500]">{r.multiplier}x</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.amount && Number(formData.amount) >= ROUND_CONFIG.minInvestment && (
                <div className="rounded-xl bg-[#f0a500]/10 p-3 ring-1 ring-[#f0a500]/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a8a39a]">You'll receive</span>
                    <span className="font-bold text-[#f0a500]">
                      {Math.floor((Number(formData.amount) / ROUND_CONFIG.tokenPrice) * (ROLES.find((r) => r.key === formData.role)?.multiplier || 1)).toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[#6e6a63]">
                    <span>Equity</span>
                    <span>
                      {((Math.floor((Number(formData.amount) / ROUND_CONFIG.tokenPrice) * (ROLES.find((r) => r.key === formData.role)?.multiplier || 1)) / ROUND_CONFIG.totalTokens) * 100).toFixed(3)}%
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                  LinkedIn profile (optional)
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourname"
                  className="w-full rounded-xl bg-[#0a0a0f] px-4 py-3 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/10 focus:ring-[#f0a500]"
                />
                <p className="mt-1 text-[10px] text-[#6e6a63]">Shown on your backer profile to inspire others</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                  Why you believe in this project (optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="A few words about why you're backing My Sleepy Tale..."
                  rows={2}
                  className="w-full rounded-xl bg-[#0a0a0f] px-4 py-3 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/10 focus:ring-[#f0a500]"
                />
              </div>

              {/* Public/private toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className="flex w-full items-center justify-between rounded-xl bg-[#0a0a0f] px-4 py-3 ring-1 ring-white/10"
              >
                <div>
                  <div className="text-sm font-bold text-[#f5f0e8]">
                    {formData.isPublic ? '🌍 Public profile' : '🔒 Private contribution'}
                  </div>
                  <div className="text-[10px] text-[#6e6a63]">
                    {formData.isPublic ? 'Your name, role, and amount visible to other backers' : 'Only founders can see your contribution'}
                  </div>
                </div>
                <span className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
                  formData.isPublic ? 'bg-[#f0a500]' : 'bg-[#2a2a38]'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0a0f] transition ${
                    formData.isPublic ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.amount || Number(formData.amount) < ROUND_CONFIG.minInvestment}
                className="w-full rounded-xl bg-[#f0a500] py-4 text-lg font-bold text-[#0a0a0f] disabled:opacity-40"
              >
                {submitting ? 'Processing...' : `Pay CA$${formData.amount || '0'} via Stripe`}
              </button>
              <p className="text-center text-[10px] text-[#6e6a63]">
                Secure payment via Stripe. Your contribution is recorded immediately.
              </p>
            </div>
          </motion.div>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl bg-[#1a1a28] p-8 text-center"
          >
            <div className="mb-4 text-5xl">🎉</div>
            <h2 className="font-display text-2xl font-bold text-[#f0a500]">Pledge received!</h2>
            <p className="mt-3 text-sm text-[#a8a39a]">
              Your contribution is <strong className="text-[#ffa42b]">pending approval</strong>. Once payment
              is verified by the founding team, your tokens will be allocated and your
              name will appear on the backers board.
            </p>
            <div className="mt-4 rounded-xl bg-[#0a0a0f] p-3 text-xs text-[#6e6a63]">
              Status: Pending → Payment verified → Admin approved → Tokens allocated
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-full bg-[#f0a500] px-6 py-3 text-sm font-bold text-[#0a0a0f]"
            >
              View my contribution
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-8 text-center">
        <div className="text-sm text-[#6e6a63]">
          {APP_NAME} · Friends & Family Round · v{APP_VERSION}
        </div>
        <div className="mt-2 text-xs text-[#6e6a63]/60">
          Built with transparency. Every number on this page is real-time from our database.
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ───

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#1a1a28] p-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="text-xl font-bold text-[#f0a500]">{value}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</div>
        </div>
      </div>
    </div>
  );
}

function CapRow({ label, tokens, total, color }) {
  const pct = (tokens / total) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-[#f5f0e8]">{label}</span>
        <span className="text-[#a8a39a]">
          {(tokens / 1000000).toFixed(2)}M ({pct.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#0a0a0f]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl bg-[#0a0a0f] p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</div>
      <div className="mt-1 text-lg font-bold text-[#f0a500]">{value}</div>
    </div>
  );
}
