import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';

// ─────────────────────────────────────────────────────────────
// Qissaa Crowdfunding — Friends & Family Round
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
  target: 50000, // CAD
  tokenPrice: 0.10, // CAD per token
  totalTokens: 10000000, // 10M total supply
  founderTokens: 6000000, // 60% founders
  roundTokens: 2000000, // 20% this round
  reserveTokens: 2000000, // 20% future rounds + employees
  minInvestment: 100, // CAD
  maxInvestment: 10000, // CAD
};

const FOUNDERS = [
  {
    name: 'Sahil',
    role: 'Co-founder · Vision & Strategy',
    tokens: 3000000,
    description: 'Idea originator. Product vision, market strategy, and business development.',
    emoji: '🧠',
  },
  {
    name: 'Prateek',
    role: 'Co-founder · Technology & Development',
    tokens: 3000000,
    description: 'Full-stack development, AI/ML integration, infrastructure, and all technical execution.',
    emoji: '⚙️',
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
  { label: 'OpenAI TTS API', amount: 50, icon: '🔊' },
  { label: 'ElevenLabs (voice cloning)', amount: 45, icon: '🎙️' },
  { label: 'Firebase (auth + database)', amount: 0, icon: '🔥' },
  { label: 'Vercel (hosting)', amount: 0, icon: '▲' },
  { label: 'Domain (future)', amount: 20, icon: '🌐' },
  { label: 'Apple Developer Program', amount: 130, icon: '🍎' },
  { label: 'Google Play Developer', amount: 35, icon: '🤖' },
];

export default function Invest() {
  const { user } = useAuth();
  const [contributors, setContributors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', role: 'investor', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState('overview');

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

  // Computed stats
  const stats = useMemo(() => {
    const totalRaised = contributors.reduce((s, c) => s + (c.amount || 0), 0);
    const totalContributorTokens = contributors.reduce((s, c) => s + (c.tokens || 0), 0);
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
      contributorCount: contributors.length,
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
      const data = {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        amount,
        role: formData.role,
        roleLabel: role.label,
        multiplier: role.multiplier,
        tokens,
        message: formData.message.trim(),
        status: 'pledged',
        createdAt: new Date().toISOString(),
        uid: user.uid,
      };
      await setDoc(doc(db, 'investors', user.uid), data);
      setSubmitted(true);
      setShowForm(false);
    } catch (e) {
      alert('Failed to submit: ' + e.message);
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
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f0e8]">
      {/* ─── HERO ─── */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0a500]/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
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
                onClick={() => { if (user) setShowForm(true); else alert('Please sign in first'); }}
                className="rounded-full bg-[#f0a500] px-8 py-4 text-lg font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(240,165,0,0.3)] transition hover:shadow-[0_0_60px_rgba(240,165,0,0.5)]"
              >
                Back this project
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
            {/* What is Qissaa */}
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
                  onClick={() => { if (user) setShowForm(true); else alert('Please sign in first'); }}
                  className="mt-6 rounded-full bg-[#f0a500] px-6 py-3 text-sm font-bold text-[#0a0a0f]"
                >
                  Back this project
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
          <div id="transparency" className="space-y-6">
            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Where the money goes
              </h3>
              <div className="space-y-2">
                {EXPENSES.map((e, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-[#0a0a0f] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{e.icon}</span>
                      <span className="text-sm text-[#f5f0e8]">{e.label}</span>
                    </div>
                    <span className="text-sm font-bold text-[#f0a500]">
                      {e.amount > 0 ? `CA$${e.amount}/mo` : 'Free tier'}
                    </span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f0a500]/10 px-4 py-3 ring-1 ring-[#f0a500]/20">
                  <span className="text-sm font-bold text-[#f5f0e8]">Monthly burn rate</span>
                  <span className="text-sm font-bold text-[#f0a500]">
                    ~CA${EXPENSES.reduce((s, e) => s + e.amount, 0)}/mo
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6e6a63]">
                Our promises
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '🔍', text: 'Every dollar raised is visible on this page. No hidden spending.' },
                  { icon: '📊', text: 'Cap table is public. Every backer sees exactly what they own.' },
                  { icon: '🤝', text: 'Token price is locked for this round. No dilution without notice.' },
                  { icon: '📝', text: 'Monthly updates to all backers. Product progress, finances, decisions.' },
                  { icon: '🗳️', text: 'Backers with 1%+ equity get a voice in major product decisions.' },
                  { icon: '💸', text: 'If we fail, remaining funds are returned proportionally.' },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-[#0a0a0f] p-4">
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-sm text-[#a8a39a]">{p.text}</span>
                  </div>
                ))}
              </div>
            </section>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
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
                  Message (optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Why you believe in this project..."
                  rows={2}
                  className="w-full rounded-xl bg-[#0a0a0f] px-4 py-3 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/10 focus:ring-[#f0a500]"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.amount || Number(formData.amount) < ROUND_CONFIG.minInvestment}
                className="w-full rounded-xl bg-[#f0a500] py-4 text-lg font-bold text-[#0a0a0f] disabled:opacity-40"
              >
                {submitting ? 'Submitting...' : 'Pledge my contribution'}
              </button>
              <p className="text-center text-[10px] text-[#6e6a63]">
                This is a pledge. Payment details will be shared after confirmation.
              </p>
            </div>
          </motion.div>
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
            <h2 className="font-display text-2xl font-bold text-[#f0a500]">Thank you!</h2>
            <p className="mt-3 text-sm text-[#a8a39a]">
              Your pledge has been recorded. You'll receive a confirmation email with
              payment instructions and your SAFE agreement.
            </p>
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
