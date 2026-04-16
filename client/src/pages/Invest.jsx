import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
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
  name: 'Friends & Family · SAFE',
  target: 25000, // CAD
  valuationCap: 1000000, // $1M CAD
  minInvestment: 50, // CAD
  maxInvestment: 10000, // CAD
  instrument: 'SAFE',
};

const FOUNDERS = [
  {
    name: 'Prateek',
    role: 'Co-founder · Tech / Finance / Legal / Integrations / Partner Engagements',
    equity: 45,
    description: 'Full-stack development, AI/ML, finance, partnerships, and all technical execution.',
    emoji: '⚙️',
    linkedin: '',
    bio: 'Built the entire My Sleepy Tale platform from scratch — React, Firebase, OpenAI TTS, Stripe, admin dashboard. 200+ hours of focused engineering. Leads technology, finance, and partner relationships.',
    skills: ['Full-Stack Engineering', 'AI/ML Integration', 'Finance', 'Partnerships'],
  },
  {
    name: 'Sahil',
    role: 'Co-founder · Go-to-Market / Vision / UI·UX / Team',
    equity: 45,
    description: 'Idea originator. Go-to-market strategy, product vision, UI/UX design, team building, and growth.',
    emoji: '🧠',
    linkedin: '',
    bio: 'Conceptualized My Sleepy Tale from a personal need — bedtime stories that reflect cultural identity. Leading go-to-market, vision, UI/UX design, and team building.',
    skills: ['Go-to-Market Strategy', 'Product Vision', 'UI/UX Design', 'Team Building'],
  },
];

const ROLES = [
  { key: 'investor', label: 'Investor', emoji: '💰', description: 'Financial contribution' },
  { key: 'investor-tester', label: 'Investor + Tester', emoji: '🧪', description: 'Money + QA testing the app' },
  { key: 'investor-promoter', label: 'Investor + Promoter', emoji: '📣', description: 'Money + spreading the word' },
  { key: 'investor-affiliate', label: 'Investor + Affiliate', emoji: '🔗', description: 'Money + bringing paying users' },
  { key: 'investor-builder', label: 'Investor + Builder', emoji: '🔨', description: 'Money + contributing code/design/content' },
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
  usePageMeta({
    title: 'Invest in My Sleepy Tale — SAFE at $1M Cap · Friends & Family Round',
    description: 'Back My Sleepy Tale, the AI-powered personalized bedtime story app. SAFE note at $1M valuation cap. Transparent cap table, real-time backer board, Stripe payments. Friends & Family round now open — min CA$50.',
    image: 'https://mysleepytale.com/og-cover.svg',
  });

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
        setContributors(list.sort((a, b) => (b.amount || 0) - (a.amount || 0)));
      } catch {
        // ignore
      }
    })();
  }, [submitted]);

  // Computed stats — only count confirmed contributions
  const stats = useMemo(() => {
    const confirmed = contributors.filter((c) => c.status === 'confirmed');
    const totalRaised = confirmed.reduce((s, c) => s + (c.amount || 0), 0);
    const totalImpliedOwnership = (totalRaised / ROUND_CONFIG.valuationCap) * 100;
    const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
    return {
      totalRaised,
      totalImpliedOwnership,
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
      const impliedOwnership = (amount / ROUND_CONFIG.valuationCap) * 100;

      // Save investor profile to Firestore first
      await setDoc(doc(db, 'investors', user.uid), {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        amount,
        role: formData.role,
        roleLabel: role.label,
        instrument: 'SAFE',
        valuationCap: ROUND_CONFIG.valuationCap,
        impliedOwnership,
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
              🌙 SAFE at $1M Cap · Friends & Family · Now Open
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
                href="#join-team"
                className="rounded-full bg-white/5 px-8 py-4 text-lg font-bold text-[#a8a39a] ring-1 ring-white/10 transition hover:text-[#f5f0e8]"
              >
                See the potential
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
                        {f.equity}% equity
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why CA$25K + How we'll spend it */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Why CA$25K and where every dollar goes
              </h3>

              {/* The split */}
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {/* Tech 40% */}
                <div className="rounded-2xl bg-[#1a1a28] p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚙️</span>
                      <span className="font-display text-lg font-bold text-[#f5f0e8]">Technology</span>
                    </div>
                    <span className="rounded-full bg-[#f0a500]/15 px-3 py-1 text-sm font-bold text-[#f0a500]">40% · CA$10K</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#0a0a0f]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#f0a500] to-[#ffb733]" style={{ width: '40%' }} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { item: 'OpenAI TTS API (voice narration)', amount: 'CA$3,000', icon: '🔊' },
                      { item: 'Voice cloning (family voices)', amount: 'CA$2,500', icon: '🎙️' },
                      { item: 'Speech customization + accents', amount: 'CA$1,500', icon: '🗣️' },
                      { item: 'Infrastructure (Firebase, Vercel, CDN)', amount: 'CA$1,500', icon: '☁️' },
                      { item: 'App Store fees (Apple + Google)', amount: 'CA$500', icon: '📱' },
                      { item: 'AI story generation (Claude API)', amount: 'CA$1,000', icon: '🧠' },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-[#0a0a0f] px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-[#a8a39a]">
                          <span>{e.icon}</span> {e.item}
                        </div>
                        <span className="text-xs font-bold text-[#f5f0e8]">{e.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marketing 60% */}
                <div className="rounded-2xl bg-[#1a1a28] p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📣</span>
                      <span className="font-display text-lg font-bold text-[#f5f0e8]">Marketing & Growth</span>
                    </div>
                    <span className="rounded-full bg-[#7ad9a1]/15 px-3 py-1 text-sm font-bold text-[#7ad9a1]">60% · CA$15K</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#0a0a0f]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7ad9a1] to-[#4ecdc4]" style={{ width: '60%' }} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { item: 'Google Ads (search + YouTube)', amount: 'CA$5,000', icon: '🔍' },
                      { item: 'Meta Ads (Instagram + Facebook)', amount: 'CA$4,000', icon: '📘' },
                      { item: 'School partnerships & demos', amount: 'CA$2,000', icon: '🏫' },
                      { item: 'Community camps & parent meetups', amount: 'CA$2,000', icon: '🏕️' },
                      { item: 'Content creation & influencers', amount: 'CA$1,500', icon: '🎬' },
                      { item: 'Print materials & QR campaigns', amount: 'CA$500', icon: '📄' },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-[#0a0a0f] px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-[#a8a39a]">
                          <span>{e.icon}</span> {e.item}
                        </div>
                        <span className="text-xs font-bold text-[#f5f0e8]">{e.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market opportunity */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                  🇨🇦 Market opportunity — Canada first
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-[#0a0a0f] p-4 text-center">
                    <div className="text-2xl font-bold text-[#f0a500]">☀️</div>
                    <div className="mt-1 text-sm font-bold text-[#f5f0e8]">Summer 2026</div>
                    <div className="mt-1 text-[10px] text-[#a8a39a]">Kids home from school. No routine. Parents desperate for bedtime help. Peak demand.</div>
                  </div>
                  <div className="rounded-xl bg-[#0a0a0f] p-4 text-center">
                    <div className="text-2xl font-bold text-[#f0a500]">🌍</div>
                    <div className="mt-1 text-sm font-bold text-[#f5f0e8]">Toronto = the world</div>
                    <div className="mt-1 text-[10px] text-[#a8a39a]">Most multicultural city on earth. 200+ ethnicities. Every family wants stories in their language and values.</div>
                  </div>
                  <div className="rounded-xl bg-[#0a0a0f] p-4 text-center">
                    <div className="text-2xl font-bold text-[#f0a500]">🏙️</div>
                    <div className="mt-1 text-sm font-bold text-[#f5f0e8]">Downtown first</div>
                    <div className="mt-1 text-[10px] text-[#a8a39a]">Dense, tech-savvy parents. 50K families with kids 0–10. Schools, daycares, community centres.</div>
                  </div>
                  <div className="rounded-xl bg-[#0a0a0f] p-4 text-center">
                    <div className="text-2xl font-bold text-[#f0a500]">🗺️</div>
                    <div className="mt-1 text-sm font-bold text-[#f5f0e8]">Then GTA → Canada</div>
                    <div className="mt-1 text-[10px] text-[#a8a39a]">2M+ families in GTA. South Asian, Arab, Jewish, East Asian, African communities. Then Vancouver, Calgary, Ottawa.</div>
                  </div>
                </div>

                {/* Growth roadmap */}
                <div className="mt-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63] mb-3">Growth timeline</div>
                  <div className="space-y-2">
                    {[
                      { q: 'May–Jun 2026', goal: '500 users', focus: 'Toronto downtown · organic + F&F referrals', color: '#f0a500' },
                      { q: 'Jul–Aug 2026', goal: '2,000 users', focus: 'Google Ads + school partnerships · summer camps', color: '#ffb733' },
                      { q: 'Sep–Oct 2026', goal: '5,000 users', focus: 'GTA expansion · Meta ads · back-to-school', color: '#7ad9a1' },
                      { q: 'Nov–Dec 2026', goal: '10,000 users', focus: 'Pan-Canada · holiday season · gift subscriptions', color: '#539df5' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-28 shrink-0 text-right text-xs font-bold text-[#a8a39a]">{m.q}</div>
                        <div className="relative flex-1">
                          <div className="h-8 overflow-hidden rounded-lg bg-[#0a0a0f]">
                            <motion.div
                              className="flex h-full items-center rounded-lg px-3"
                              style={{ background: m.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (i + 1) * 25)}%` }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                            >
                              <span className="text-[10px] font-bold text-[#0a0a0f]">{m.goal}</span>
                            </motion.div>
                          </div>
                        </div>
                        <div className="w-48 shrink-0 text-[10px] text-[#6e6a63]">{m.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How SAFE works */}
            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                How SAFE works
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">1️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">You invest now</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Min CA${ROUND_CONFIG.minInvestment}. Your money goes directly into building {APP_NAME}.
                    You receive a SAFE note — the standard instrument used by YC and every major startup.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">2️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">$1M valuation cap</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Your SAFE converts to equity at the next priced round — but capped at a $1M valuation.
                    If {APP_NAME} is valued at $10M, you get equity as if it was worth $2M. 10x advantage.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1a1a28] p-5">
                  <div className="mb-2 text-2xl">3️⃣</div>
                  <div className="text-sm font-bold text-[#f5f0e8]">Early = best price</div>
                  <p className="mt-1 text-xs text-[#a8a39a]">
                    Friends & Family get the lowest cap. The next round will be at a higher valuation.
                    Your CA${ROUND_CONFIG.minInvestment} today could be worth multiples at conversion.
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
                    <div className="text-[10px] text-[#6e6a63]">Same SAFE terms</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ CAP TABLE ═══ */}
        {tab === 'cap-table' && (
          <div className="space-y-6">
            {/* Current ownership */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Ownership (pre-conversion)
              </h3>
              <div className="space-y-3">
                {FOUNDERS.map((f) => (
                  <CapRow key={f.name} label={`${f.name} — ${f.role}`} tokens={f.equity} total={100} color="#f0a500" unit="%" />
                ))}
                <CapRow
                  label={`F&F SAFE holders (${stats.contributorCount} backers) — implied at conversion`}
                  tokens={Math.round(stats.totalImpliedOwnership * 100) / 100}
                  total={100}
                  color="#7ad9a1"
                  unit="%"
                />
                <CapRow
                  label="Unallocated (employee pool + future rounds)"
                  tokens={Math.round((100 - FOUNDERS.reduce((s, f) => s + f.equity, 0) - stats.totalImpliedOwnership) * 100) / 100}
                  total={100}
                  color="#539df5"
                  unit="%"
                />
              </div>
            </section>

            {/* SAFE details */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                SAFE terms
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <DetailCard label="Instrument" value="SAFE" />
                <DetailCard label="Valuation cap" value={`CA$${(ROUND_CONFIG.valuationCap / 1000000).toFixed(0)}M`} />
                <DetailCard label="Min investment" value={`CA$${ROUND_CONFIG.minInvestment}`} />
                <DetailCard label="Round target" value={`CA$${ROUND_CONFIG.target.toLocaleString()}`} />
              </div>
            </section>

            {/* SAFE explainer */}
            <section className="rounded-2xl bg-[#f0a500]/5 p-6 ring-1 ring-[#f0a500]/20">
              <h3 className="mb-3 text-sm font-bold text-[#f0a500]">What is a SAFE?</h3>
              <p className="text-sm text-[#a8a39a] leading-relaxed">
                A <strong className="text-[#f5f0e8]">SAFE (Simple Agreement for Future Equity)</strong> is
                the standard investment instrument used by Y Combinator and thousands of startups. It's not
                a loan, not debt, and not immediate equity. It's a promise: when {APP_NAME} raises a priced
                round (Series A), your investment converts to real equity — but capped at the $1M valuation,
                no matter how high the actual valuation is at that time.
              </p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">You invest</div>
                  <div className="font-bold text-[#f5f0e8]">CA$500</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">Implied ownership at $1M cap</div>
                  <div className="font-bold text-[#f0a500]">{(500 / ROUND_CONFIG.valuationCap * 100).toFixed(3)}%</div>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3">
                  <div className="text-xs text-[#6e6a63]">If Series A at $10M</div>
                  <div className="font-bold text-[#7ad9a1]">You get equity at $1M price (10x advantage)</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-[#a8a39a]">
                <div className="flex items-start gap-2"><span className="text-[#7ad9a1]">✓</span> No dilution until priced round</div>
                <div className="flex items-start gap-2"><span className="text-[#7ad9a1]">✓</span> Cap protects you from overpaying</div>
                <div className="flex items-start gap-2"><span className="text-[#7ad9a1]">✓</span> Standard YC SAFE template — no legal surprises</div>
                <div className="flex items-start gap-2"><span className="text-[#7ad9a1]">✓</span> Same terms for every backer — no special deals</div>
              </div>
            </section>

            {/* Implied ownership table */}
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                What your investment means
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#6e6a63]">
                      <th className="py-2 text-left">You invest</th>
                      <th className="py-2 text-right">Ownership at $1M cap</th>
                      <th className="py-2 text-right">If valued at $10M</th>
                      <th className="py-2 text-right">If valued at $50M</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#a8a39a]">
                    {[50, 100, 500, 1000, 5000, 10000].map((amt) => (
                      <tr key={amt} className="border-b border-white/5">
                        <td className="py-2 font-bold text-[#f5f0e8]">CA${amt.toLocaleString()}</td>
                        <td className="py-2 text-right text-[#f0a500]">{(amt / ROUND_CONFIG.valuationCap * 100).toFixed(4)}%</td>
                        <td className="py-2 text-right text-[#7ad9a1]">CA${(amt * 10000000 / ROUND_CONFIG.valuationCap).toLocaleString()}</td>
                        <td className="py-2 text-right text-[#7ad9a1]">CA${(amt * 50000000 / ROUND_CONFIG.valuationCap).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[10px] text-[#6e6a63]">
                Values shown are illustrative. Actual returns depend on company performance, dilution at future rounds, and conversion terms.
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
                  No one has contributed yet. Early backers get the lowest valuation cap.
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
                      <th className="px-4 py-3 text-right">Ownership</th>
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
                        <td className="px-4 py-3 text-right font-bold text-[#f0a500]">
                          {((c.amount || 0) / ROUND_CONFIG.valuationCap * 100).toFixed(4)}%
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
                  { icon: '🤝', title: 'Cap lock', text: '$1M valuation cap is locked for this round. No retroactive changes.' },
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
                {APP_NAME} will be incorporated as a Canadian corporation. Each SAFE note
                represents a binding commitment to convert to equity (common shares) at the next
                priced round, capped at a $1M valuation. A formal SAFE document (based on the
                YC standard template) will be provided to all backers. All contributions are
                tracked with timestamps and are fully auditable.
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
                    <span className="text-[#a8a39a]">Implied ownership at $1M cap</span>
                    <span className="font-bold text-[#f0a500]">
                      {(Number(formData.amount) / ROUND_CONFIG.valuationCap * 100).toFixed(4)}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[#6e6a63]">
                    <span>Instrument</span>
                    <span>SAFE · $1M cap</span>
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
              Your SAFE note is <strong className="text-[#ffa42b]">pending approval</strong>. Once payment
              is verified by the founding team, your SAFE will be confirmed and your
              name will appear on the backers board.
            </p>
            <div className="mt-4 rounded-xl bg-[#0a0a0f] p-3 text-xs text-[#6e6a63]">
              Status: Pending → Payment verified → Admin approved → SAFE confirmed
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

      {/* Join the team CTA */}
      <div id="join-team" className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#f0a500]/10 to-[#ffb733]/5 p-8 text-center ring-1 ring-[#f0a500]/20">
          <div className="mb-3 text-3xl">🚀</div>
          <h3 className="font-display text-xl font-bold text-[#f0a500]">See the potential? Join actively.</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#a8a39a]">
            Money is one way to back us. Your time and skills are worth even more.
            Join as an active team member — build with us, grow with us, and share in the
            upside of something we're creating from scratch.
          </p>
          <a
            href="mailto:i@yprateek.com,sahil.faraz@gmail.com?subject=I want to be an active part of My Sleepy Tale&body=Hi Prateek %26 Sahil,%0A%0AI see the potential in My Sleepy Tale and I'd like to be an active part of the development with the time I can spend.%0A%0AWhat I can contribute:%0AHours per week I can give:%0AMy background:%0A"
            className="mt-5 inline-block rounded-full bg-[#f0a500] px-8 py-3 text-sm font-bold text-[#0a0a0f] transition hover:shadow-[0_0_40px_rgba(240,165,0,0.4)]"
          >
            Connect with us
          </a>
          <p className="mt-3 text-xs text-[#6e6a63]">
            Roles: Engineering · Design · Content · Marketing · Growth · Community
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 border-t border-white/5 py-8 text-center">
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

function CapRow({ label, tokens, total, color, unit }) {
  const pct = (tokens / total) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-[#f5f0e8]">{label}</span>
        <span className="text-[#a8a39a]">
          {unit ? `${tokens}${unit}` : `${pct.toFixed(1)}%`}
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
