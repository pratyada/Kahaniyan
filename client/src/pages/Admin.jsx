import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { RELIGIONS, COUNTRIES, VALUES, DURATIONS, LANGUAGES } from '../utils/constants.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';
import { GA_MEASUREMENT_ID, db } from '../lib/firebase.js';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const STATUS_COLORS = {
  active: '#7ad9a1',
  paused: '#ffa42b',
  blocked: '#f3727f',
};

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isAdmin,
    loading,
    allUsers,
    stats,
    adminEmails,
    loadUsers,
    addAdmin,
    removeAdmin,
    setUserStatus,
    setUserTier,
    team,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
  } = useAdmin();

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('tester');
  const [investors, setInvestors] = useState([]);

  // Load investors
  useEffect(() => {
    if (!isAdmin || !db) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'investors'));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setInvestors(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      } catch { /* ignore */ }
    })();
  }, [isAdmin]);

  const updateInvestorStatus = async (uid, status) => {
    if (!db) return;
    await setDoc(doc(db, 'investors', uid), { status }, { merge: true });
    setInvestors((prev) => prev.map((i) => i.id === uid ? { ...i, status } : i));
  };
  const [tab, setTab] = useState('overview');
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin, loadUsers]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f17]">
        <div className="text-gold text-lg font-bold">Loading admin…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f17] text-center">
        <div className="mb-4 text-5xl">🔒</div>
        <h1 className="font-display text-2xl font-bold text-[#f5f0e8]">Access denied</h1>
        <p className="mt-2 text-sm text-[#a8a39a]">You are not an admin.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-[#f0a500] px-6 py-3 text-sm font-bold text-[#0f0f17]"
        >
          Back to app
        </button>
      </div>
    );
  }

  const filteredUsers = searchQuery.trim()
    ? allUsers.filter(
        (u) =>
          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.profiles || []).some((p) =>
            (p.childName || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : allUsers;

  const allEmails = allUsers
    .map((u) => u.email)
    .filter(Boolean)
    .sort();

  // Usage aggregates
  const totalStoriesAll = allUsers.reduce((s, u) => s + (u.usage?.totalStories || 0), 0);
  const totalMinutesAll = allUsers.reduce((s, u) => s + (u.usage?.totalMinutes || 0), 0);
  // Cost estimates in CAD
  // ElevenLabs: ~$0.30 USD / 1K chars ≈ ~$0.42 CAD/1K chars
  // ~4500 words ≈ 27K chars per 30 min → ~$11.34 CAD for 30 min TTS
  // With ElevenLabs Scale plan: ~$0.18 USD / 1K chars → ~$7.00 CAD / 30 min
  // Claude Sonnet story gen: ~$0.03 CAD / story
  // Blended per minute (Scale plan): ~$0.25 CAD / min
  const COST_PER_MINUTE_CAD = 0.25;
  const estimatedCost = (totalMinutesAll * COST_PER_MINUTE_CAD).toFixed(2);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'storylab', label: 'Story Lab', icon: '🧪' },
    { key: 'users', label: `Users (${allUsers.length})`, icon: '👤' },
    { key: 'usage', label: 'Usage & Costs', icon: '💰' },
    { key: 'team', label: `Team (${team.length})`, icon: '👥' },
    { key: 'emails', label: `Emails (${allEmails.length})`, icon: '📧' },
    { key: 'investors', label: 'Investors', icon: '🤝' },
    { key: 'admins', label: 'Admins', icon: '🔑' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f17] text-[#f5f0e8]">
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0f0f17]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <span className="font-display text-lg font-bold text-[#f0a500]">{APP_NAME}</span>
              <span className="ml-2 rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f0a500]">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-[#a8a39a] sm:block">{user?.email}</span>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-[#a8a39a] hover:text-[#f5f0e8]"
            >
              ← Back to app
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ─── TABS ─── */}
        <div className="mb-6 flex gap-1 rounded-2xl bg-[#1a1a28] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                tab === t.key
                  ? 'bg-[#f0a500] text-[#0f0f17]'
                  : 'text-[#a8a39a] hover:text-[#f5f0e8]'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {tab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stat grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <BigStat label="Total users" value={stats.totalUsers} icon="👤" />
              <BigStat label="Kid profiles" value={stats.totalKids} icon="🧒" />
              <BigStat label="Characters" value={stats.totalChars} icon="👨‍👩‍👧" />
              <BigStat label="Stories generated" value={totalStoriesAll} icon="📖" />
              <BigStat label="Minutes listened" value={Math.round(totalMinutesAll)} icon="⏱️" />
              <BigStat label="Est. API cost" value={`CA$${estimatedCost}`} icon="💰" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Subscriptions */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  Subscriptions
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.tiers).map(([tier, count]) => {
                    const pct = stats.totalKids > 0 ? Math.round((count / stats.totalKids) * 100) : 0;
                    return (
                      <div key={tier}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-bold capitalize text-[#f5f0e8]">{tier}</span>
                          <span className="text-[#a8a39a]">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#0f0f17]">
                          <div
                            className="h-full rounded-full bg-[#f0a500]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Beliefs */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  Beliefs
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.beliefs)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, count]) => {
                      const r = RELIGIONS.find((x) => x.key === key);
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-[#f5f0e8]">
                            <span>{r?.icon}</span>
                            {r?.label || key}
                          </span>
                          <span className="text-sm font-bold text-[#f0a500]">{count}</span>
                        </div>
                      );
                    })}
                  {Object.keys(stats.beliefs).length === 0 && (
                    <p className="text-sm text-[#6e6a63]">No belief data yet.</p>
                  )}
                </div>
              </div>

              {/* Account statuses */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  Account status
                </h3>
                <div className="space-y-3">
                  {['active', 'paused', 'blocked'].map((s) => {
                    const count = allUsers.filter(
                      (u) => (u.accountStatus || 'active') === s
                    ).length;
                    return (
                      <div key={s} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm capitalize text-[#f5f0e8]">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: STATUS_COLORS[s] }}
                          />
                          {s}
                        </span>
                        <span className="text-sm font-bold text-[#f0a500]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Geo / Regions */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Countries */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  🌍 Users by country
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.countries || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, count]) => {
                      const c = COUNTRIES.find((x) => x.key === key);
                      const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
                      return (
                        <div key={key}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-[#f5f0e8]">
                              <span>{c?.flag || '🌍'}</span>
                              {c?.label || key}
                            </span>
                            <span className="text-[#a8a39a]">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#0f0f17]">
                            <div className="h-full rounded-full bg-[#f0a500]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  {Object.keys(stats.countries || {}).length === 0 && (
                    <p className="text-sm text-[#6e6a63]">No country data yet.</p>
                  )}
                </div>
              </div>

              {/* Timezones */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  🕐 Timezones
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.tzCities || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([tz, count]) => (
                      <div key={tz} className="flex items-center justify-between">
                        <span className="truncate text-sm text-[#f5f0e8]">{tz}</span>
                        <span className="shrink-0 text-sm font-bold text-[#f0a500]">{count}</span>
                      </div>
                    ))}
                  {Object.keys(stats.tzCities || {}).length === 0 && (
                    <p className="text-sm text-[#6e6a63]">No timezone data yet.</p>
                  )}
                </div>
              </div>

              {/* Browser languages */}
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  🗣️ Browser languages
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.languages || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, count]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="text-sm text-[#f5f0e8]">{lang}</span>
                        <span className="text-sm font-bold text-[#f0a500]">{count}</span>
                      </div>
                    ))}
                  {Object.keys(stats.languages || {}).length === 0 && (
                    <p className="text-sm text-[#6e6a63]">No language data yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Google Analytics — deployment timeline + reports */}
            {GA_MEASUREMENT_ID && (
              <div className="space-y-4">
                {/* Deployment timeline */}
                <div className="rounded-2xl bg-[#1a1a28] p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                    📊 Analytics since mysleepytale.com launch
                  </h3>
                  <div className="mb-4 space-y-2">
                    {[
                      { date: 'Apr 11', event: 'First commit · POC scaffolded', icon: '🔨' },
                      { date: 'Apr 12', event: 'Vercel deployed · kahaniyan-sage.vercel.app', icon: '▲' },
                      { date: 'Apr 13', event: 'Firebase Auth + Firestore live', icon: '🔥' },
                      { date: 'Apr 14', event: 'OpenAI TTS · AI narration live', icon: '🔊' },
                      { date: 'Apr 15', event: 'mysleepytale.com domain live · GA tracking on', icon: '🌐' },
                      { date: 'Apr 15', event: 'Stripe live · F&F round open', icon: '💳' },
                      { date: 'Apr 15', event: 'Invest page · crowdfunding dashboard', icon: '🤝' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg">{m.icon}</span>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="shrink-0 text-xs text-[#6e6a63]">{m.date}</span>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="shrink-0 text-xs text-[#a8a39a]">{m.event}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-[#f0a500]/10 p-3 ring-1 ring-[#f0a500]/20">
                    <div className="text-xs font-bold text-[#f0a500]">Key metrics to track post-launch</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3 text-[11px] text-[#a8a39a]">
                      <div>📈 <strong className="text-[#f5f0e8]">Sessions</strong> — are people visiting?</div>
                      <div>⏱️ <strong className="text-[#f5f0e8]">Avg session</strong> — are they staying?</div>
                      <div>🔁 <strong className="text-[#f5f0e8]">Returning users</strong> — are they coming back?</div>
                      <div>🌍 <strong className="text-[#f5f0e8]">Countries</strong> — where are they from?</div>
                      <div>📱 <strong className="text-[#f5f0e8]">Device split</strong> — mobile vs desktop?</div>
                      <div>🚪 <strong className="text-[#f5f0e8]">Bounce rate</strong> — leaving immediately?</div>
                    </div>
                  </div>
                </div>

                {/* GA report links */}
                <div className="rounded-2xl bg-[#1a1a28] p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                    Open in Google Analytics
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { icon: '⚡', title: 'Real-time', sub: 'Who is on the site right now', path: 'reports/realtime' },
                      { icon: '📈', title: 'Overview', sub: 'Sessions, users, pageviews', path: 'reports/dashboard' },
                      { icon: '🌍', title: 'Geography', sub: 'Countries, cities', path: 'reports/explorer-user?params=_u..nav%3Dmaui&irl=all' },
                      { icon: '🔗', title: 'Acquisition', sub: 'How people find us', path: 'reports/acquisition-overview' },
                      { icon: '📱', title: 'Tech', sub: 'Devices, browsers, OS', path: 'reports/tech-overview' },
                      { icon: '🔄', title: 'Retention', sub: 'Are they coming back?', path: 'reports/retention' },
                      { icon: '🎯', title: 'Engagement', sub: 'Pages, events, scroll', path: 'reports/engagement-overview' },
                      { icon: '💰', title: 'Monetization', sub: 'Revenue events', path: 'reports/monetization-overview' },
                      { icon: '🗺️', title: 'User flow', sub: 'Journey through the app', path: 'reports/exploration' },
                    ].map((r, i) => (
                      <a
                        key={i}
                        href={`https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID.replace('G-', '')}/${r.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-[#0f0f17] p-3 transition hover:bg-white/[0.03]"
                      >
                        <span className="text-xl">{r.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-[#f5f0e8]">{r.title}</div>
                          <div className="text-[10px] text-[#6e6a63]">{r.sub}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-[#6e6a63]">
                    ID: {GA_MEASUREMENT_ID} · Domain: mysleepytale.com · Tracking since Apr 15, 2026
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {tab === 'users' && (
          <div>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or kid name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-[#1a1a28] px-5 py-3 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
              />
            </div>

            {/* Full data table */}
            <div className="overflow-x-auto rounded-2xl bg-[#1a1a28]">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-center">Kids</th>
                    <th className="px-4 py-3 text-center">Stories</th>
                    <th className="px-4 py-3 text-center">Minutes</th>
                    <th className="px-4 py-3 text-center">Tier</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Last active</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-[#6e6a63]">
                        {searchQuery ? 'No users match your search.' : 'No users yet.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => {
                      const status = u.accountStatus || 'active';
                      const kids = u.profiles || [];
                      const stories = u.usage?.totalStories || 0;
                      const minutes = u.usage?.totalMinutes || 0;
                      const tiers = [...new Set(kids.map((p) => p.tier || 'free'))];
                      const lastActive = u.lastActiveAt
                        ? new Date(u.lastActiveAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—';
                      const expanded = expandedUser === u.uid;

                      return (
                        <tr
                          key={u.uid}
                          className={`border-b border-white/5 transition hover:bg-white/[0.02] ${
                            expanded ? 'bg-white/[0.03]' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-[#6e6a63]">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f0a500]/15">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <span className="text-sm">👤</span>
                                )}
                              </div>
                              <span className="font-bold text-[#f5f0e8]">
                                {u.displayName || u.email?.split('@')[0] || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-[#a8a39a]">
                            {u.email || '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-xs font-bold text-[#f0a500]">
                              {kids.length}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-[#a8a39a]">{stories}</td>
                          <td className="px-4 py-3 text-center text-xs text-[#a8a39a]">{Math.round(minutes)}</td>
                          <td className="px-4 py-3 text-center">
                            {tiers.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold capitalize text-[#f0a500]"
                              >
                                {t}
                              </span>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                              style={{
                                background: `${STATUS_COLORS[status]}22`,
                                color: STATUS_COLORS[status],
                              }}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#6e6a63]">{lastActive}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {status !== 'active' && (
                                <button
                                  onClick={() => setUserStatus(u.uid, 'active')}
                                  className="rounded-lg bg-[#7ad9a1]/10 px-2 py-1 text-[9px] font-bold text-[#7ad9a1]"
                                  title="Activate"
                                >
                                  ✓
                                </button>
                              )}
                              {status !== 'paused' && (
                                <button
                                  onClick={() => setUserStatus(u.uid, 'paused')}
                                  className="rounded-lg bg-[#ffa42b]/10 px-2 py-1 text-[9px] font-bold text-[#ffa42b]"
                                  title="Pause"
                                >
                                  ⏸
                                </button>
                              )}
                              {status !== 'blocked' && (
                                <button
                                  onClick={() => setUserStatus(u.uid, 'blocked')}
                                  className="rounded-lg bg-[#f3727f]/10 px-2 py-1 text-[9px] font-bold text-[#f3727f]"
                                  title="Block"
                                >
                                  ✕
                                </button>
                              )}
                              <button
                                onClick={() => setExpandedUser(expanded ? null : u.uid)}
                                className="rounded-lg bg-white/5 px-2 py-1 text-[9px] font-bold text-[#a8a39a]"
                                title="Details"
                              >
                                ⋯
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Expanded detail panel (below table) */}
            <AnimatePresence>
              {expandedUser && (() => {
                const u = allUsers.find((x) => x.uid === expandedUser);
                if (!u) return null;
                return (
                  <motion.div
                    key={expandedUser}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 rounded-2xl bg-[#1a1a28] p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f5f0e8]">
                        {u.displayName || u.email} — full details
                      </h3>
                      <button
                        onClick={() => setExpandedUser(null)}
                        className="text-xs text-[#6e6a63] hover:text-[#f5f0e8]"
                      >
                        Close ✕
                      </button>
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <MetaItem label="UID" value={u.uid} mono />
                      <MetaItem label="Email" value={u.email || '—'} mono />
                      <MetaItem label="Display name" value={u.displayName || '—'} />
                      <MetaItem label="Last active" value={u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString() : '—'} />
                    </div>

                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                      Kid profiles ({(u.profiles || []).length})
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(u.profiles || []).map((kid, i) => (
                        <div key={i} className="rounded-xl bg-[#0f0f17] p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#f5f0e8]">
                              {kid.childName || `Kid ${i + 1}`}
                            </span>
                            <select
                              value={kid.tier || 'free'}
                              onChange={(e) => setUserTier(u.uid, i, e.target.value)}
                              className="rounded-lg bg-[#1a1a28] px-2 py-1 text-[10px] font-bold text-[#f0a500] outline-none"
                            >
                              <option value="free">Free</option>
                              <option value="family">Family</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                          <div className="space-y-1 text-[11px] text-[#6e6a63]">
                            <div>Age: <span className="text-[#a8a39a]">{kid.age || '?'}</span></div>
                            {kid.motherName && <div>Mother: <span className="text-[#a8a39a]">{kid.motherName}</span></div>}
                            {kid.fatherName && <div>Father: <span className="text-[#a8a39a]">{kid.fatherName}</span></div>}
                            {kid.sibling && <div>Sibling: <span className="text-[#a8a39a]">{kid.sibling}</span></div>}
                            {kid.grandfather && <div>Grandfather: <span className="text-[#a8a39a]">{kid.grandfather}</span></div>}
                            {kid.grandmother && <div>Grandmother: <span className="text-[#a8a39a]">{kid.grandmother}</span></div>}
                            {kid.pet && <div>Pet: <span className="text-[#a8a39a]">{kid.pet}</span></div>}
                            <div>Language: <span className="text-[#a8a39a]">{kid.language || 'English'}</span></div>
                            <div>Beliefs: <span className="text-[#a8a39a]">{(kid.beliefs || []).map(b => RELIGIONS.find(r => r.key === b)?.label || b).join(', ') || 'None'}</span></div>
                            <div>Characters: <span className="text-[#a8a39a]">{kid.characters?.length || 0}</span></div>
                            {kid.characters && kid.characters.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {kid.characters.map((c, ci) => (
                                  <span key={ci} className="rounded-full bg-[#1a1a28] px-2 py-0.5 text-[9px] text-[#a8a39a]">
                                    {c.emoji || '👤'} {c.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="mt-1">
                              Auto-play: <span className="text-[#a8a39a]">{kid.autoplayNext ? 'On' : 'Off'}</span> ·
                              Sleep sounds: <span className="text-[#a8a39a]">{kid.whiteNoiseEnabled ? 'On' : 'Off'}</span> ·
                              Dialogue fade: <span className="text-[#a8a39a]">{kid.dialogueFade ? 'On' : 'Off'}</span>
                            </div>
                            <div>
                              Cross-culture: <span className="text-[#a8a39a]">{kid.showCrossCulture ? 'On' : 'Off'}</span> ·
                              Only my beliefs: <span className="text-[#a8a39a]">{kid.onlyMyTradition ? 'On' : 'Off'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        )}

        {/* ═══ USAGE & COSTS ═══ */}
        {tab === 'usage' && (
          <div className="space-y-6">
            {/* Top-line metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <BigStat label="Total stories" value={totalStoriesAll} icon="📖" />
              <BigStat label="Total minutes" value={Math.round(totalMinutesAll)} icon="⏱️" />
              <BigStat label="Avg min / user" value={allUsers.length ? Math.round(totalMinutesAll / allUsers.length) : 0} icon="📊" />
              <BigStat label="Est. API cost" value={`CA$${estimatedCost}`} icon="💰" />
            </div>

            {/* Cost breakdown note */}
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Cost estimation basis
              </h3>
              <div className="grid gap-4 text-xs text-[#a8a39a] sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">ElevenLabs Starter</div>
                  <div className="mt-1 font-bold text-[#f5f0e8]">CA$0.42 / 1K chars</div>
                  <div className="text-[9px] text-[#6e6a63]">~CA$11.34 / 30 min story</div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">ElevenLabs Scale</div>
                  <div className="mt-1 font-bold text-[#f5f0e8]">CA$0.25 / 1K chars</div>
                  <div className="text-[9px] text-[#6e6a63]">~CA$6.75 / 30 min story</div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Claude Sonnet (story gen)</div>
                  <div className="mt-1 font-bold text-[#f5f0e8]">CA$0.03 / story</div>
                  <div className="text-[9px] text-[#6e6a63]">~4K tokens in, ~2K out</div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Blended per minute</div>
                  <div className="mt-1 font-bold text-[#f0a500]">~CA$0.25 / min</div>
                  <div className="text-[9px] text-[#6e6a63]">Scale plan + Claude</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-[#0f0f17] p-3">
                <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">ElevenLabs plan comparison (CAD)</div>
                <table className="mt-2 w-full text-xs">
                  <thead>
                    <tr className="text-[9px] uppercase tracking-wider text-[#6e6a63]">
                      <th className="pb-1 text-left">Plan</th>
                      <th className="pb-1 text-right">Monthly</th>
                      <th className="pb-1 text-right">Characters</th>
                      <th className="pb-1 text-right">Per 1K chars</th>
                      <th className="pb-1 text-right">~Stories / mo</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#a8a39a]">
                    <tr><td>Free</td><td className="text-right">CA$0</td><td className="text-right">10K</td><td className="text-right">—</td><td className="text-right">~0.4</td></tr>
                    <tr><td>Starter</td><td className="text-right">CA$7</td><td className="text-right">30K</td><td className="text-right">CA$0.42</td><td className="text-right">~1</td></tr>
                    <tr><td>Creator</td><td className="text-right">CA$31</td><td className="text-right">100K</td><td className="text-right">CA$0.31</td><td className="text-right">~4</td></tr>
                    <tr><td>Pro</td><td className="text-right">CA$137</td><td className="text-right">500K</td><td className="text-right">CA$0.27</td><td className="text-right">~18</td></tr>
                    <tr className="font-bold text-[#f0a500]"><td>Scale</td><td className="text-right">CA$415</td><td className="text-right">2M</td><td className="text-right">CA$0.21</td><td className="text-right">~74</td></tr>
                    <tr><td>Business</td><td className="text-right">Custom</td><td className="text-right">Custom</td><td className="text-right">~CA$0.14</td><td className="text-right">—</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-[#6e6a63]">
                All prices in CAD (1 USD ≈ 1.38 CAD). Actual costs depend on voice quality tier,
                story caching (repeat plays = zero cost), and pre-written cultural stories (zero API cost).
              </p>
            </div>

            {/* Per-user usage table */}
            <div className="rounded-2xl bg-[#1a1a28]">
              <div className="border-b border-white/5 px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  Per-user usage
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-center">Stories</th>
                      <th className="px-4 py-3 text-center">Minutes</th>
                      <th className="px-4 py-3 text-center">Est. cost</th>
                      <th className="px-4 py-3">Last story</th>
                      <th className="px-4 py-3 text-center">Tier</th>
                      <th className="px-4 py-3 text-center">Paying?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...allUsers]
                      .sort((a, b) => (b.usage?.totalMinutes || 0) - (a.usage?.totalMinutes || 0))
                      .map((u, idx) => {
                        const stories = u.usage?.totalStories || 0;
                        const minutes = u.usage?.totalMinutes || 0;
                        const cost = (minutes * COST_PER_MINUTE_CAD).toFixed(2);
                        const tier = (u.profiles || []).map((p) => p.tier || 'free').join(', ') || 'free';
                        const isPaid = tier.includes('family') || tier.includes('annual');
                        const lastStory = u.usage?.lastStoryAt
                          ? new Date(u.usage.lastStoryAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—';
                        return (
                          <tr key={u.uid} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-[#6e6a63]">{idx + 1}</td>
                            <td className="px-4 py-3 font-bold text-[#f5f0e8]">
                              {u.displayName || u.email?.split('@')[0] || '—'}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-[#a8a39a]">{u.email || '—'}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-xs font-bold text-[#f0a500]">
                                {stories}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-[#a8a39a]">{Math.round(minutes)}</td>
                            <td className="px-4 py-3 text-center text-xs font-bold text-[#f0a500]">CA${cost}</td>
                            <td className="px-4 py-3 text-xs text-[#6e6a63]">{lastStory}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold capitalize text-[#f0a500]">
                                {tier}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isPaid ? (
                                <span className="text-[#7ad9a1]">✓</span>
                              ) : (
                                <span className="text-[#6e6a63]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10 font-bold">
                      <td className="px-4 py-3" colSpan={3}>
                        <span className="text-xs uppercase tracking-wider text-[#a8a39a]">Total</span>
                      </td>
                      <td className="px-4 py-3 text-center text-[#f0a500]">{totalStoriesAll}</td>
                      <td className="px-4 py-3 text-center text-[#a8a39a]">{Math.round(totalMinutesAll)}</td>
                      <td className="px-4 py-3 text-center text-[#f0a500]">CA${estimatedCost}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pricing helper */}
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Pricing decision helper
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg = 10 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    CA${(10 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-[#6e6a63]">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#7ad9a1]">
                    CA$4.99/mo → CA${(4.99 - 10 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg = 30 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    CA${(30 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-[#6e6a63]">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#ffa42b]">
                    CA$4.99/mo → CA${(4.99 - 30 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg = 60 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    CA${(60 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-[#6e6a63]">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#f3727f]">
                    CA$9.99/mo → CA${(9.99 - 60 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg = 120 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    CA${(120 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-[#6e6a63]">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#f3727f]">
                    CA$14.99/mo → CA${(14.99 - 120 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#6e6a63]">
                All CAD. Margins improve significantly with story caching (repeat plays = zero
                regen cost) and pre-written cultural stories (zero API cost). At scale, negotiate
                ElevenLabs Business tier (~CA$0.14/1K chars) for 40% cost reduction.
              </p>
            </div>
          </div>
        )}

        {/* ═══ TEAM ═══ */}
        {tab === 'team' && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Add team member
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newTeamEmail}
                  onChange={(e) => setNewTeamEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-[#0f0f17] px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                />
                <select
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  className="rounded-xl bg-[#0f0f17] px-3 py-3 text-sm text-[#f0a500] outline-none ring-1 ring-white/5"
                >
                  <option value="tester">🧪 Tester</option>
                  <option value="marketing">📣 Marketing</option>
                </select>
                <button
                  onClick={() => {
                    if (newTeamEmail.trim()) {
                      addTeamMember(newTeamEmail, newTeamRole);
                      setNewTeamEmail('');
                    }
                  }}
                  className="rounded-xl bg-[#f0a500] px-5 py-3 text-sm font-bold text-[#0f0f17]"
                >
                  Add
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#6e6a63]">
                Testers get full app access for QA. Marketing gets analytics + sharing features.
                You can pause or stop access anytime.
              </p>
            </div>

            {/* Team list */}
            <div className="overflow-x-auto rounded-2xl bg-[#1a1a28]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Added by</th>
                    <th className="px-4 py-3">Added</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#6e6a63]">
                        No team members yet.
                      </td>
                    </tr>
                  ) : (
                    team.map((t) => {
                      const statusColor = t.status === 'active' ? '#7ad9a1' : t.status === 'paused' ? '#ffa42b' : '#f3727f';
                      return (
                        <tr key={t.email} className="border-b border-white/5">
                          <td className="px-4 py-3 font-mono text-xs text-[#f5f0e8]">{t.email}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                              t.role === 'tester'
                                ? 'bg-[#539df5]/15 text-[#539df5]'
                                : 'bg-[#e8b4ff]/15 text-[#e8b4ff]'
                            }`}>
                              {t.role === 'tester' ? '🧪 Tester' : '📣 Marketing'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                              style={{ background: `${statusColor}22`, color: statusColor }}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#a8a39a]">{t.addedBy?.split('@')[0] || '—'}</td>
                          <td className="px-4 py-3 text-xs text-[#6e6a63]">
                            {t.addedAt ? new Date(t.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {t.status !== 'active' && (
                                <button
                                  onClick={() => updateTeamMember(t.email, { status: 'active' })}
                                  className="rounded-lg bg-[#7ad9a1]/10 px-2 py-1 text-[9px] font-bold text-[#7ad9a1]"
                                  title="Activate"
                                >✓</button>
                              )}
                              {t.status !== 'paused' && (
                                <button
                                  onClick={() => updateTeamMember(t.email, { status: 'paused' })}
                                  className="rounded-lg bg-[#ffa42b]/10 px-2 py-1 text-[9px] font-bold text-[#ffa42b]"
                                  title="Pause"
                                >⏸</button>
                              )}
                              {t.status !== 'stopped' && (
                                <button
                                  onClick={() => updateTeamMember(t.email, { status: 'stopped' })}
                                  className="rounded-lg bg-[#f3727f]/10 px-2 py-1 text-[9px] font-bold text-[#f3727f]"
                                  title="Stop"
                                >⏹</button>
                              )}
                              <button
                                onClick={() => { if (confirm(`Remove ${t.email}?`)) removeTeamMember(t.email); }}
                                className="rounded-lg bg-white/5 px-2 py-1 text-[9px] font-bold text-[#6e6a63]"
                                title="Remove"
                              >✕</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ EMAILS ═══ */}
        {tab === 'emails' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                  All user emails ({allEmails.length})
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(allEmails.join('\n'));
                    alert(`${allEmails.length} emails copied to clipboard`);
                  }}
                  className="rounded-full bg-[#f0a500] px-4 py-2 text-xs font-bold text-[#0f0f17]"
                >
                  Copy all
                </button>
              </div>
              <p className="mb-4 text-xs text-[#6e6a63]">
                Use for newsletters, promotions, and updates. One email per line.
              </p>
              <div className="max-h-96 overflow-y-auto rounded-xl bg-[#0f0f17] p-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-[#6e6a63]">
                      <th className="pb-2">#</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Kids</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers
                      .filter((u) => u.email)
                      .sort((a, b) => (a.email || '').localeCompare(b.email || ''))
                      .map((u, i) => {
                        const status = u.accountStatus || 'active';
                        const kids = (u.profiles || [])
                          .map((p) => p.childName)
                          .filter(Boolean)
                          .join(', ');
                        return (
                          <tr key={u.uid} className="border-b border-white/5">
                            <td className="py-2 pr-3 text-[#6e6a63]">{i + 1}</td>
                            <td className="py-2 pr-3 font-mono text-xs text-[#f5f0e8]">
                              {u.email}
                            </td>
                            <td className="py-2 pr-3 text-[#a8a39a]">
                              {u.displayName || '—'}
                            </td>
                            <td className="py-2 pr-3 text-[#a8a39a]">{kids || '—'}</td>
                            <td className="py-2">
                              <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                                style={{
                                  background: `${STATUS_COLORS[status]}22`,
                                  color: STATUS_COLORS[status],
                                }}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* CSV export */}
              <button
                onClick={() => {
                  const csv = [
                    'Email,Name,Kids,Status,Last Active',
                    ...allUsers
                      .filter((u) => u.email)
                      .map((u) => {
                        const kids = (u.profiles || [])
                          .map((p) => p.childName)
                          .filter(Boolean)
                          .join('; ');
                        return `${u.email},${(u.displayName || '').replace(/,/g, '')},${kids},${u.accountStatus || 'active'},${u.lastActiveAt || ''}`;
                      }),
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `mst-users-${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-4 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-[#a8a39a] hover:text-[#f5f0e8]"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
        )}

        {/* ═══ ADMINS ═══ */}
        {/* ═══ INVESTORS ═══ */}
        {tab === 'investors' && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#1a1a28] p-4 text-center">
                <div className="text-2xl font-bold text-[#f0a500]">{investors.filter((i) => i.status === 'confirmed').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Confirmed</div>
              </div>
              <div className="rounded-2xl bg-[#1a1a28] p-4 text-center">
                <div className="text-2xl font-bold text-[#ffa42b]">{investors.filter((i) => i.status !== 'confirmed' && i.status !== 'rejected').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Pending</div>
              </div>
              <div className="rounded-2xl bg-[#1a1a28] p-4 text-center">
                <div className="text-2xl font-bold text-[#f0a500]">
                  CA${investors.filter((i) => i.status === 'confirmed').reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">Confirmed raised</div>
              </div>
            </div>

            <div className="space-y-3">
              {investors.length === 0 ? (
                <div className="rounded-2xl bg-[#1a1a28] p-8 text-center text-[#6e6a63]">No investors yet.</div>
              ) : investors.map((inv) => {
                const statusColor = inv.status === 'confirmed' ? '#7ad9a1' : inv.status === 'rejected' ? '#f3727f' : '#ffa42b';
                return (
                  <div key={inv.id} className="rounded-2xl bg-[#1a1a28] p-4">
                    <div className="flex items-center gap-3">
                      {inv.photoURL ? (
                        <img src={inv.photoURL} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
                      ) : <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f0a500]/15 text-lg">👤</div>}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#f5f0e8]">{inv.displayName || '—'}</span>
                          <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ background: `${statusColor}22`, color: statusColor }}>
                            {inv.status || 'pledged'}
                          </span>
                        </div>
                        <div className="truncate text-xs text-[#a8a39a]">{inv.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#f5f0e8]">CA${inv.amount?.toLocaleString()}</div>
                        <div className="text-[10px] text-[#f0a500]">{((inv.amount || 0) / 1000000 * 100).toFixed(4)}% SAFE</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-[#6e6a63]">
                        <span>{inv.roleLabel || inv.role}</span>
                        <span>·</span>
                        <span>{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
                      </div>
                      <div className="flex gap-1">
                        {inv.status !== 'confirmed' && (
                          <button
                            onClick={() => { if (confirm(`Confirm ${inv.displayName || inv.email}'s CA$${inv.amount} contribution?`)) updateInvestorStatus(inv.id, 'confirmed'); }}
                            className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1]"
                          >✓ Confirm</button>
                        )}
                        {inv.status !== 'rejected' && inv.status !== 'confirmed' && (
                          <button
                            onClick={() => { if (confirm(`Reject ${inv.displayName || inv.email}'s contribution?`)) updateInvestorStatus(inv.id, 'rejected'); }}
                            className="rounded-lg bg-[#f3727f]/10 px-3 py-1.5 text-[10px] font-bold text-[#f3727f]"
                          >✕ Reject</button>
                        )}
                        {inv.status === 'confirmed' && (
                          <button
                            onClick={() => { if (confirm(`Revert ${inv.displayName || inv.email} back to pending?`)) updateInvestorStatus(inv.id, 'pending-payment'); }}
                            className="rounded-lg bg-[#ffa42b]/10 px-3 py-1.5 text-[10px] font-bold text-[#ffa42b]"
                          >↩ Revert</button>
                            )}
                          </div>
                    </div>
                    {inv.message && (
                      <div className="mt-2 text-[11px] italic text-[#6e6a63]">"{inv.message}"</div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {tab === 'admins' && (
          <div className="max-w-xl space-y-4">
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Admin users
              </h3>
              <div className="space-y-2">
                {adminEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-xl bg-[#0f0f17] px-4 py-3"
                  >
                    <span className="font-mono text-sm text-[#f5f0e8]">{email}</span>
                    {adminEmails.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${email} as admin?`)) removeAdmin(email);
                        }}
                        className="text-xs text-[#f3727f]/80 hover:text-[#f3727f]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Add admin email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAdminEmail.trim()) {
                      addAdmin(newAdminEmail);
                      setNewAdminEmail('');
                    }
                  }}
                  className="flex-1 rounded-xl bg-[#0f0f17] px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                />
                <button
                  onClick={() => {
                    if (newAdminEmail.trim()) {
                      addAdmin(newAdminEmail);
                      setNewAdminEmail('');
                    }
                  }}
                  className="rounded-xl bg-[#f0a500] px-5 py-3 text-sm font-bold text-[#0f0f17]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STORY LAB ═══ */}
        {tab === 'storylab' && <StoryLab />}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6 text-center text-[10px] uppercase tracking-[0.2em] text-[#6e6a63]">
        {APP_NAME} Admin · v{APP_VERSION}
      </footer>
    </div>
  );
}

// ─── Sub-components ───

function BigStat({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-[#1a1a28] p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="text-3xl font-bold text-[#f0a500]">{value}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#a8a39a]">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ u, expanded, onToggle, setUserStatus, setUserTier }) {
  const status = u.accountStatus || 'active';
  const kids = u.profiles || [];
  const lastActive = u.lastActiveAt
    ? new Date(u.lastActiveAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <motion.div layout className="overflow-hidden rounded-2xl bg-[#1a1a28]">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.02]"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f0a500]/15">
          {u.photoURL ? (
            <img src={u.photoURL} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="text-lg">👤</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-[#f5f0e8]">
              {u.displayName || u.email?.split('@')[0] || u.uid.slice(0, 8)}
            </span>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase"
              style={{
                background: `${STATUS_COLORS[status]}22`,
                color: STATUS_COLORS[status],
              }}
            >
              {status}
            </span>
          </div>
          <div className="truncate text-xs text-[#a8a39a]">{u.email || 'No email'}</div>
        </div>

        <div className="hidden items-center gap-6 text-xs text-[#a8a39a] lg:flex">
          <span>{kids.length} {kids.length === 1 ? 'kid' : 'kids'}</span>
          <span>{lastActive}</span>
        </div>

        <span className={`text-[#a8a39a] transition ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4">
              {/* Meta */}
              <div className="mb-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <MetaItem label="UID" value={u.uid} mono />
                <MetaItem label="Email" value={u.email || '—'} mono />
                <MetaItem label="Last active" value={lastActive} />
                <MetaItem label="Status" value={status} />
              </div>

              {/* Kid profiles */}
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                Kid profiles
              </h4>
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {kids.length === 0 ? (
                  <p className="text-xs text-[#6e6a63]">No profiles yet.</p>
                ) : (
                  kids.map((kid, i) => (
                    <div key={i} className="rounded-xl bg-[#0f0f17] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#f5f0e8]">
                          {kid.childName || `Kid ${i + 1}`}
                        </span>
                        <select
                          value={kid.tier || 'free'}
                          onChange={(e) => setUserTier(u.uid, i, e.target.value)}
                          className="rounded-lg bg-[#1a1a28] px-2 py-1 text-[10px] font-bold text-[#f0a500] outline-none"
                        >
                          <option value="free">Free</option>
                          <option value="family">Family</option>
                          <option value="annual">Annual</option>
                        </select>
                      </div>
                      <div className="mt-1 text-[10px] text-[#6e6a63]">
                        Age {kid.age || '?'} · {(kid.beliefs || []).join(', ') || 'No beliefs'} ·{' '}
                        {kid.characters?.length || 0} chars · {kid.language || 'English'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {status !== 'active' && (
                  <button
                    onClick={() => setUserStatus(u.uid, 'active')}
                    className="rounded-xl bg-[#7ad9a1]/10 px-4 py-2 text-xs font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20"
                  >
                    Activate
                  </button>
                )}
                {status !== 'paused' && (
                  <button
                    onClick={() => setUserStatus(u.uid, 'paused')}
                    className="rounded-xl bg-[#ffa42b]/10 px-4 py-2 text-xs font-bold text-[#ffa42b] hover:bg-[#ffa42b]/20"
                  >
                    Pause
                  </button>
                )}
                {status !== 'blocked' && (
                  <button
                    onClick={() => setUserStatus(u.uid, 'blocked')}
                    className="rounded-xl bg-[#f3727f]/10 px-4 py-2 text-xs font-bold text-[#f3727f] hover:bg-[#f3727f]/20"
                  >
                    Block
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetaItem({ label, value, mono }) {
  return (
    <div className="rounded-lg bg-[#0f0f17] px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">{label}</div>
      <div
        className={`mt-0.5 truncate text-xs text-[#f5f0e8] ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Story Lab ───

const DEFAULT_ARCHETYPES = [
  { key: 'grandfather', callOptions: ['Dadu', 'Grandpa', 'Grandfather', 'Dada ji', 'Nana ji', 'Thatha', 'Abuelo', 'Baba'], defaultCall: 'Grandpa', traits: 'wise, tells old tales, adventurous spirit, gentle humor', activities: 'gardening, stargazing, woodworking, painting, telling riddles, cooking chai, playing chess, flying kites' },
  { key: 'grandmother', callOptions: ['Dadi', 'Grandma', 'Grandmother', 'Nani', 'Naani ma', 'Paati', 'Abuela', 'Bibi'], defaultCall: 'Grandma', traits: 'adventurous, inventive, strong, warm-hearted, funny', activities: 'building things, painting, astronomy, gardening, singing, making potions, solving puzzles, racing, teaching magic tricks' },
  { key: 'mother', callOptions: ['Mummy', 'Mom', 'Mama', 'Amma', 'Ammi', 'Ma'], defaultCall: 'Mummy', traits: 'brave, creative, nurturing, clever, playful', activities: 'fixing things, exploring, inventing, dancing, reading maps, climbing trees, building forts' },
  { key: 'father', callOptions: ['Daddy', 'Dad', 'Papa', 'Baba', 'Abba', 'Appa'], defaultCall: 'Daddy', traits: 'gentle, silly, caring, creative, musical', activities: 'cooking, singing lullabies, drawing, telling jokes, sewing, braiding hair, making breakfast' },
  { key: 'sibling', callOptions: ['Bhaiya', 'Didi', 'Brother', 'Sister', 'Bhai', 'Akka'], defaultCall: 'Sibling', traits: 'playful, curious, mischievous, loyal', activities: 'playing, exploring, building, imagining, competing, teamwork' },
  { key: 'uncle', callOptions: ['Uncle', 'Chacha', 'Mama ji', 'Tau ji', 'Kaku'], defaultCall: 'Uncle', traits: 'funny, energetic, surprising, kind', activities: 'magic tricks, sports, storytelling, pranks, teaching new games' },
  { key: 'aunt', callOptions: ['Aunt', 'Chachi', 'Mami', 'Bua', 'Mausi', 'Athai'], defaultCall: 'Aunt', traits: 'adventurous, clever, artistic, warm', activities: 'painting, traveling, cooking exotic food, science experiments, singing' },
  { key: 'pet', callOptions: ['Pet', 'Buddy', 'Best friend'], defaultCall: 'Pet', traits: 'loyal, playful, sometimes naughty, brave', activities: 'following around, finding clues, causing funny trouble, protecting, snuggling' },
];

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';

function StoryLab() {
  const [subTab, setSubTab] = useState('playground');
  const [archetypes, setArchetypes] = useState(DEFAULT_ARCHETYPES);
  const [editingArch, setEditingArch] = useState(null);
  const [cachedStories, setCachedStories] = useState([]);
  const [saving, setSaving] = useState(false);

  // Playground state
  const [pgChildName, setPgChildName] = useState('Aria');
  const [pgAge, setPgAge] = useState(5);
  const [pgGender, setPgGender] = useState('girl');
  const [pgValue, setPgValue] = useState('kindness');
  const [pgDuration, setPgDuration] = useState(5);
  const [pgLanguage, setPgLanguage] = useState('English');
  const [pgWhisper, setPgWhisper] = useState('');
  const [pgBeliefs, setPgBeliefs] = useState('hindu');
  const [pgCountry, setPgCountry] = useState('IN');
  const [pgCast, setPgCast] = useState('Dadu (grandfather, wise and funny), Nani (grandmother, builds rockets)');
  const [pgGenerating, setPgGenerating] = useState(false);
  const [pgResult, setPgResult] = useState(null);
  const [pgError, setPgError] = useState(null);

  // Load config from Firestore
  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const { getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'storyLab'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.archetypes?.length) setArchetypes(data.archetypes);
        }
        // Load cached stories
        const storiesSnap = await getDocs(collection(db, 'storyCache'));
        const list = [];
        storiesSnap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setCachedStories(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } catch (e) {
        console.error('Failed to load story lab config:', e);
      }
    })();
  }, []);

  const saveArchetypes = async (updated) => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'storyLab'), { archetypes: updated }, { merge: true });
      setArchetypes(updated);
    } catch (e) {
      console.error('Failed to save archetypes:', e);
    }
    setSaving(false);
  };

  const saveStoryToCache = async (story) => {
    if (!db || !story) return;
    try {
      const id = `story_${Date.now()}`;
      const entry = {
        ...story,
        createdAt: Date.now(),
        childName: pgChildName,
        age: pgAge,
        gender: pgGender,
        value: pgValue,
        duration: pgDuration,
        language: pgLanguage,
        beliefs: pgBeliefs,
        country: pgCountry,
      };
      await setDoc(doc(db, 'storyCache', id), entry);
      setCachedStories((prev) => [{ id, ...entry }, ...prev]);
    } catch (e) {
      console.error('Failed to cache story:', e);
    }
  };

  const deleteFromCache = async (id) => {
    if (!db) return;
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'storyCache', id));
      setCachedStories((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error('Failed to delete cached story:', e);
    }
  };

  const generateTestStory = async () => {
    setPgGenerating(true);
    setPgError(null);
    setPgResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: pgChildName,
          age: pgAge,
          gender: pgGender,
          value: pgValue,
          duration: pgDuration,
          language: pgLanguage,
          whisper: pgWhisper || undefined,
          beliefs: [pgBeliefs],
          country: pgCountry,
          selectedCast: pgCast.split(',').map((s) => {
            const match = s.trim().match(/^(.+?)\s*\((.+)\)$/);
            if (match) {
              const [, name, rest] = match;
              const parts = rest.split(',').map((p) => p.trim());
              return { name: name.trim(), relation: parts[0] || 'friend', traits: parts.slice(1).join(', ') };
            }
            return { name: s.trim(), relation: 'friend', traits: '' };
          }),
          narrator: 'AI Narrator',
          _adminTest: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setPgResult(data);
    } catch (e) {
      setPgError(e.message);
    }
    setPgGenerating(false);
  };

  const SUB_TABS = [
    { key: 'playground', label: 'Playground', icon: '🎮' },
    { key: 'archetypes', label: 'Character Archetypes', icon: '👥' },
    { key: 'cache', label: `Story Cache (${cachedStories.length})`, icon: '📦' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              subTab === t.key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-[#1a1a28] text-[#a8a39a] hover:text-[#f5f0e8]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── PLAYGROUND ── */}
      {subTab === 'playground' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Config */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Story Parameters
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <LabInput label="Child name" value={pgChildName} onChange={setPgChildName} />
                <LabInput label="Age" value={pgAge} onChange={(v) => setPgAge(Number(v))} type="number" />
                <LabSelect label="Gender" value={pgGender} onChange={setPgGender} options={[
                  { value: 'girl', label: 'Girl' }, { value: 'boy', label: 'Boy' }, { value: 'other', label: 'Other' },
                ]} />
                <LabSelect label="Value/Lesson" value={pgValue} onChange={setPgValue} options={
                  VALUES.map((v) => ({ value: v.key, label: `${v.emoji} ${v.label}` }))
                } />
                <LabSelect label="Duration" value={pgDuration} onChange={(v) => setPgDuration(Number(v))} options={
                  DURATIONS.map((d) => ({ value: d.minutes, label: d.label }))
                } />
                <LabSelect label="Language" value={pgLanguage} onChange={setPgLanguage} options={
                  LANGUAGES.map((l) => ({ value: l.key, label: l.label }))
                } />
                <LabSelect label="Belief" value={pgBeliefs} onChange={setPgBeliefs} options={
                  RELIGIONS.map((r) => ({ value: r.key, label: `${r.icon} ${r.label}` }))
                } />
                <LabSelect label="Country" value={pgCountry} onChange={setPgCountry} options={
                  COUNTRIES.map((c) => ({ value: c.key, label: `${c.flag} ${c.label}` }))
                } />
              </div>

              <div className="mt-3">
                <LabInput label="Cast (Name (relation, traits), ...)" value={pgCast} onChange={setPgCast} full />
              </div>
              <div className="mt-3">
                <LabInput label="Whisper (optional parent note)" value={pgWhisper} onChange={setPgWhisper} full />
              </div>

              <button
                onClick={generateTestStory}
                disabled={pgGenerating}
                className="mt-4 w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] transition active:scale-95 disabled:opacity-50"
              >
                {pgGenerating ? 'Generating...' : 'Generate Test Story'}
              </button>
              {pgError && (
                <div className="mt-3 rounded-xl bg-[#f3727f]/10 p-3 text-xs text-[#f3727f]">{pgError}</div>
              )}
            </div>
          </div>

          {/* Right: Result */}
          <div className="space-y-4">
            {pgGenerating && (
              <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#f0a500] border-t-transparent" />
                  <p className="text-sm text-[#a8a39a]">Generating story with Claude...</p>
                </div>
              </div>
            )}
            {pgResult && (
              <div className="rounded-2xl bg-[#1a1a28] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#f0a500]">{pgResult.title}</h3>
                    <p className="mt-1 text-xs text-[#a8a39a]">
                      {pgResult.wordCount} words · {pgResult.generatedBy || 'claude'} · {pgDuration} min target
                    </p>
                  </div>
                  <button
                    onClick={() => saveStoryToCache(pgResult)}
                    className="rounded-xl bg-[#7ad9a1]/10 px-4 py-2 text-xs font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20"
                  >
                    Save to cache
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-[#0f0f17] p-4 font-story text-sm leading-relaxed text-[#f5f0e8]/80">
                  {pgResult.text}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-[#a8a39a]">
                  <div className="rounded-lg bg-[#0f0f17] p-2">
                    <div className="font-bold text-[#f0a500]">{pgResult.wordCount}</div>
                    words
                  </div>
                  <div className="rounded-lg bg-[#0f0f17] p-2">
                    <div className="font-bold text-[#f0a500]">{Math.round(pgResult.wordCount / 130)}</div>
                    est. minutes
                  </div>
                  <div className="rounded-lg bg-[#0f0f17] p-2">
                    <div className="font-bold text-[#f0a500]">{pgResult.generatedBy}</div>
                    engine
                  </div>
                </div>
              </div>
            )}
            {!pgGenerating && !pgResult && (
              <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
                <div className="text-center">
                  <div className="mb-3 text-4xl">🧪</div>
                  <p className="text-sm text-[#a8a39a]">Configure parameters and generate a test story</p>
                  <p className="mt-1 text-xs text-[#6e6a63]">Test different combos to see how Claude handles them</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHARACTER ARCHETYPES ── */}
      {subTab === 'archetypes' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#1a1a28] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Character Archetypes — define how each role appears in stories
              </h3>
              {saving && <span className="text-xs text-[#f0a500]">Saving...</span>}
            </div>
            <p className="mb-4 text-xs text-[#6e6a63]">
              Set what to call each character type, their personality traits, and activities they do in stories.
              This prevents stereotypes and adds variety.
            </p>
            <div className="space-y-3">
              {archetypes.map((arch, i) => (
                <div key={arch.key} className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {arch.key === 'grandfather' ? '👴' : arch.key === 'grandmother' ? '👵' :
                         arch.key === 'mother' ? '👩' : arch.key === 'father' ? '👨' :
                         arch.key === 'sibling' ? '🧒' : arch.key === 'uncle' ? '🧔' :
                         arch.key === 'aunt' ? '👩' : '🐶'}
                      </span>
                      <div>
                        <div className="font-bold text-[#f5f0e8] capitalize">{arch.key}</div>
                        <div className="text-xs text-[#a8a39a]">
                          Called: {arch.callOptions.slice(0, 4).join(', ')}{arch.callOptions.length > 4 ? ` +${arch.callOptions.length - 4} more` : ''}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingArch(editingArch === i ? null : i)}
                      className="rounded-lg bg-[#1a1a28] px-3 py-1.5 text-xs font-bold text-[#f0a500]"
                    >
                      {editingArch === i ? 'Close' : 'Edit'}
                    </button>
                  </div>

                  {editingArch === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                          What can they be called? (comma separated)
                        </label>
                        <input
                          value={arch.callOptions.join(', ')}
                          onChange={(e) => {
                            const updated = [...archetypes];
                            updated[i] = { ...arch, callOptions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                            setArchetypes(updated);
                          }}
                          className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                          Default name to use in stories
                        </label>
                        <select
                          value={arch.defaultCall}
                          onChange={(e) => {
                            const updated = [...archetypes];
                            updated[i] = { ...arch, defaultCall: e.target.value };
                            setArchetypes(updated);
                          }}
                          className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5"
                        >
                          {arch.callOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                          Personality traits (comma separated — NOT stereotypical!)
                        </label>
                        <input
                          value={arch.traits}
                          onChange={(e) => {
                            const updated = [...archetypes];
                            updated[i] = { ...arch, traits: e.target.value };
                            setArchetypes(updated);
                          }}
                          className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                          Activities they do in stories (comma separated — be creative, break stereotypes!)
                        </label>
                        <input
                          value={arch.activities}
                          onChange={(e) => {
                            const updated = [...archetypes];
                            updated[i] = { ...arch, activities: e.target.value };
                            setArchetypes(updated);
                          }}
                          className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => saveArchetypes(archetypes)}
              disabled={saving}
              className="mt-4 w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Archetypes'}
            </button>
          </div>
        </div>
      )}

      {/* ── STORY CACHE ── */}
      {subTab === 'cache' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#1a1a28] p-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
              Cached Stories — pre-generated, no credits needed
            </h3>
            <p className="mb-4 text-xs text-[#6e6a63]">
              Stories saved here can be served to users without calling Claude API. Generate in Playground, then save.
            </p>
          </div>
          {cachedStories.length === 0 ? (
            <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
              <div className="text-center">
                <div className="mb-3 text-4xl">📦</div>
                <p className="text-sm text-[#a8a39a]">No cached stories yet</p>
                <p className="mt-1 text-xs text-[#6e6a63]">Generate stories in the Playground and save them here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cachedStories.map((story) => (
                <CachedStoryCard key={story.id} story={story} onDelete={() => deleteFromCache(story.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CachedStoryCard({ story, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const meta = VALUES.find((v) => v.key === story.value);
  return (
    <div className="rounded-xl bg-[#1a1a28] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{meta?.emoji || '📖'}</span>
          <div className="min-w-0">
            <div className="font-bold text-[#f5f0e8] truncate">{story.title}</div>
            <div className="text-xs text-[#a8a39a]">
              {story.childName} · {story.age}y · {story.wordCount}w · {story.duration}min · {meta?.label} · {story.language}
            </div>
            <div className="text-[10px] text-[#6e6a63]">
              {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown date'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs font-bold text-[#f0a500]"
          >
            {expanded ? 'Hide' : 'Read'}
          </button>
          <button
            onClick={() => { if (confirm('Delete this cached story?')) onDelete(); }}
            className="rounded-lg bg-[#f3727f]/10 px-3 py-1.5 text-xs font-bold text-[#f3727f]"
          >
            Delete
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 max-h-[40vh] overflow-y-auto rounded-lg bg-[#0f0f17] p-4 font-story text-sm leading-relaxed text-[#f5f0e8]/80">
              {story.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LabInput({ label, value, onChange, type = 'text', full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-[#0f0f17] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
      />
    </div>
  );
}

function LabSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-[#0f0f17] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
