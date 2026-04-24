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

  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoaded, setFeedbackLoaded] = useState(false);

  // Load feedback when tab is selected
  useEffect(() => {
    if (tab !== 'feedback' || feedbackLoaded || !isAdmin || !db) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'feedback'));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setFeedbackList(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
        setFeedbackLoaded(true);
      } catch {}
    })();
  }, [tab, feedbackLoaded, isAdmin]);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'storylab', label: 'Story Lab', icon: '🧪' },
    { key: 'feedback', label: `Feedback (${feedbackLoaded ? feedbackList.length : '…'})`, icon: '💬' },
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
                      { date: 'Apr 14', event: 'Voice narration live', icon: '🔊' },
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

        {/* ═══ FEEDBACK ═══ */}
        {tab === 'feedback' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-1 text-sm font-bold text-[#f5f0e8]">User Feedback</h3>
              <p className="mb-4 text-xs text-[#6e6a63]">
                Thoughts shared by users from the "Share your thoughts" button in Settings. {feedbackList.length} total.
              </p>
            </div>
            {feedbackList.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
                <div className="text-center">
                  <div className="mb-3 text-4xl">💬</div>
                  <p className="text-sm text-[#a8a39a]">No feedback yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="rounded-xl bg-[#1a1a28] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        <div>
                          <div className="text-sm font-bold text-[#f5f0e8]">{fb.displayName || 'Anonymous'}</div>
                          <div className="text-[10px] text-[#6e6a63]">{fb.email || 'No email'}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#6e6a63]">
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0f0f17] p-3 text-sm leading-relaxed text-[#f5f0e8]/80">
                      {fb.text}
                    </div>
                  </div>
                ))}
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
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={newTeamEmail}
                    onChange={(e) => setNewTeamEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#0f0f17] px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                  />
                  {newTeamEmail.length >= 2 && (() => {
                    const q = newTeamEmail.toLowerCase();
                    const matches = allUsers.filter(u =>
                      (u.email || '').toLowerCase().includes(q) ||
                      (u.displayName || '').toLowerCase().includes(q)
                    ).slice(0, 5);
                    if (matches.length === 0 || (matches.length === 1 && matches[0].email === newTeamEmail)) return null;
                    return (
                      <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl bg-[#1a1a28] ring-1 ring-white/10 overflow-hidden">
                        {matches.map(u => (
                          <button key={u.uid} onClick={() => setNewTeamEmail(u.email || '')}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition">
                            {u.photoURL ? (
                              <img src={u.photoURL} className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-[#f0a500]/15 grid place-items-center text-[10px]">👤</div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-[#f5f0e8]">{u.displayName || u.email}</div>
                              <div className="text-[10px] text-[#6e6a63]">{u.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <select
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  className="rounded-xl bg-[#0f0f17] px-3 py-3 text-sm text-[#f0a500] outline-none ring-1 ring-white/5"
                >
                  <option value="tester">🧪 Tester</option>
                  <option value="investor">💰 Investor</option>
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
                Testers get full app access for QA. Investors can see the invest page. Marketing gets analytics + sharing.
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
                              t.role === 'tester' ? 'bg-[#539df5]/15 text-[#539df5]'
                                : t.role === 'investor' ? 'bg-[#f0a500]/15 text-[#f0a500]'
                                : 'bg-[#e8b4ff]/15 text-[#e8b4ff]'
                            }`}>
                              {t.role === 'tester' ? '🧪 Tester' : t.role === 'investor' ? '💰 Investor' : '📣 Marketing'}
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

// ─── Story Lab — Content Engine ───

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

const DEFAULT_CULTURAL_REFS = {
  hindu: {
    foods: ['kheer', 'jalebi', 'puri', 'khichdi', 'halwa', 'poha', 'dosa', 'samosa', 'chaat', 'rasmalai', 'gulab jamun', 'modak', 'peda', 'til gajak'],
    festivals: ['Diwali', 'Holi', 'Raksha Bandhan', 'Ganesh Chaturthi', 'Navratri', 'Makar Sankranti', 'Janmashtami', 'Onam', 'Pongal', 'Baisakhi'],
    traditions: ['lighting diyas', 'drawing rangoli', 'tying rakhi', 'flying kites on Sankranti', 'playing with colours on Holi', 'aarti ceremony', 'tulsi pooja', 'touching elders\' feet', 'sharing prasad'],
    places: ['the mango tree in the courtyard', 'the temple steps', 'the river ghat', 'the village well', 'a chai stall', 'the rooftop under stars', 'a banyan tree', 'the spice market'],
    music: ['tabla beats', 'sitar strings', 'bhajan humming', 'conch shell blowing', 'ghungroo bells', 'flute melodies', 'dholak rhythms'],
    games: ['kabaddi', 'kho-kho', 'gilli-danda', 'marbles', 'hopscotch (stapu)', 'pitthu', 'hide and seek (chhupa chhupai)', 'spinning tops (lattu)'],
    clothing: ['kurta pajama', 'lehenga', 'saree draped like a superhero cape', 'dupatta as a magic scarf', 'mojdi shoes', 'turban', 'bindi'],
    greetings: ['Namaste', 'Ram Ram', 'Pranam', 'Jai Shri Krishna'],
  },
  muslim: {
    foods: ['biryani', 'sheer khurma', 'nihari', 'kebabs', 'dates', 'haleem', 'samosa', 'phirni', 'seviyan', 'falooda', 'kofta curry'],
    festivals: ['Eid ul-Fitr', 'Eid ul-Adha', 'Shab-e-Barat', 'Milad un-Nabi'],
    traditions: ['breaking fast together', 'sharing food with neighbours', 'moon sighting', 'eidi (gifts) from elders', 'praying together', 'wearing new clothes on Eid', 'henna on hands'],
    places: ['the mosque courtyard', 'a rooftop watching the moon', 'a bakery making seviyan', 'the old bazaar', 'under a date palm tree'],
    music: ['qawwali melodies', 'nasheed humming', 'daf drums', 'rubab strings'],
    games: ['flying kites', 'carrom board', 'marbles', 'tag in the courtyard', 'storytelling circles'],
    clothing: ['topi and kurta', 'beautiful dupatta', 'embroidered jubbah', 'sherwani', 'henna-decorated hands'],
    greetings: ['Assalamu Alaikum', 'Khuda Hafiz', 'Eid Mubarak'],
  },
  christian: {
    foods: ['plum cake', 'hot chocolate', 'gingerbread cookies', 'apple pie', 'roast dinner', 'candy canes', 'eggnog', 'cinnamon rolls', 'bread pudding'],
    festivals: ['Christmas', 'Easter', 'Thanksgiving', 'Palm Sunday', 'Epiphany'],
    traditions: ['decorating the Christmas tree', 'singing carols', 'advent calendar countdown', 'Easter egg hunt', 'saying grace before meals', 'church bells ringing', 'nativity play', 'hanging stockings'],
    places: ['the church garden', 'under the Christmas tree', 'a snow-covered village', 'the choir loft', 'a cozy fireplace'],
    music: ['church bells', 'choir singing', 'organ melodies', 'carol humming', 'jingle bells'],
    games: ['snowball fights', 'pin the star on the tree', 'musical chairs at the party', 'Easter egg roll'],
    clothing: ['Sunday best dress', 'Christmas sweater', 'angel costume', 'Easter bonnet'],
    greetings: ['Merry Christmas', 'God bless you', 'Peace be with you', 'Happy Easter'],
  },
  sikh: {
    foods: ['langar (community meal)', 'karah prasad (halwa)', 'makki di roti with sarson da saag', 'lassi', 'chole bhature', 'pinni', 'jalebi'],
    festivals: ['Baisakhi', 'Gurpurab', 'Lohri', 'Hola Mohalla', 'Diwali (Bandi Chhor Divas)'],
    traditions: ['serving langar together', 'listening to kirtan', 'flying kites on Lohri', 'bonfire stories', 'visiting the Gurdwara', 'sharing karah prasad', 'tying a patka'],
    places: ['the Gurdwara kitchen', 'a mustard field', 'the bonfire circle', 'under a mango tree in Punjab', 'the sarovar (holy pool)'],
    music: ['kirtan melodies', 'dhol beats', 'harmonium notes', 'shabad humming'],
    games: ['gatka (martial arts play)', 'pittu garam', 'kite flying', 'kabaddi', 'wrestling'],
    clothing: ['colourful patka', 'turban tied with pride', 'salwar kameez', 'phulkari dupatta'],
    greetings: ['Sat Sri Akal', 'Waheguru ji ka Khalsa'],
  },
  jewish: {
    foods: ['challah bread', 'matzo ball soup', 'latkes', 'sufganiyot (donuts)', 'hamantaschen cookies', 'rugelach', 'apple dipped in honey'],
    festivals: ['Hanukkah', 'Passover', 'Purim', 'Rosh Hashanah', 'Sukkot', 'Shabbat'],
    traditions: ['lighting the menorah', 'spinning the dreidel', 'building a sukkah', 'hiding the afikomen', 'dressing up on Purim', 'Shabbat dinner together'],
    places: ['the synagogue garden', 'under the sukkah', 'by the menorah', 'the bakery making challah', 'a kibbutz field'],
    music: ['klezmer melodies', 'shofar blowing', 'Shabbat songs', 'hora dance music'],
    games: ['dreidel spinning', 'afikomen hunt', 'gaga ball', 'building the tallest sukkah'],
    clothing: ['kippah', 'tallith (prayer shawl)', 'Purim costume'],
    greetings: ['Shalom', 'L\'chaim', 'Shabbat Shalom', 'Chag Sameach'],
  },
  buddhist: {
    foods: ['rice porridge', 'momos', 'butter tea', 'veggie stir fry', 'sticky rice', 'coconut desserts', 'dal bhat'],
    festivals: ['Vesak (Buddha Day)', 'Losar (New Year)', 'Kathina', 'Songkran'],
    traditions: ['lighting butter lamps', 'spinning prayer wheels', 'making sand mandalas', 'offering flowers at the temple', 'meditation under a tree', 'releasing lanterns', 'walking barefoot in the garden'],
    places: ['the temple garden', 'under a Bodhi tree', 'a mountain monastery', 'a lotus pond', 'a peaceful bamboo grove'],
    music: ['temple bells', 'singing bowls', 'chanting monks', 'bamboo flute'],
    games: ['balancing stones', 'mindful walking race', 'find the hidden lotus', 'peaceful hide and seek'],
    clothing: ['orange robes', 'prayer beads', 'lotus flower garland'],
    greetings: ['Namo Buddhaya', 'Om Mani Padme Hum'],
  },
  secular: {
    foods: ['pancakes', 'cookies', 'hot cocoa', 'pizza', 'ice cream sundae', 'fresh fruit salad', 'popcorn', 'sandwiches'],
    festivals: ['New Year', 'birthday parties', 'Earth Day', 'family reunion day', 'first day of school', 'summer solstice'],
    traditions: ['family game night', 'stargazing on the rooftop', 'planting a tree together', 'making a time capsule', 'blanket fort movie night', 'writing letters to future self'],
    places: ['the treehouse', 'a beach at sunset', 'a cozy blanket fort', 'the neighborhood park', 'a secret garden', 'a library corner'],
    music: ['humming a made-up song', 'clapping rhythms', 'whistling', 'ukulele strumming'],
    games: ['treasure hunt', 'building the tallest tower', 'cloud shape guessing', 'the floor is lava', 'hide and seek'],
    clothing: ['favourite pajamas', 'superhero cape (a towel)', 'rain boots for puddle jumping', 'mismatched socks'],
    greetings: ['Hello friend', 'Good morning sunshine', 'Hey there'],
  },
};

const DEFAULT_STORY_OPENERS = [
  { type: 'mystery', text: 'Something strange appeared on the doorstep that morning...', ages: '3-10' },
  { type: 'adventure', text: 'The map was wrong. Or maybe — maybe the map was showing a place that hadn\'t existed... until now.', ages: '5-10' },
  { type: 'funny', text: 'It started with a sneeze. Not a regular sneeze — a sneeze that sent {childName}\'s socks flying clean off.', ages: '3-7' },
  { type: 'magical', text: 'The old tree in the backyard had never glowed before. But tonight, on this exact night, it did.', ages: '4-10' },
  { type: 'animal', text: 'The squirrel was wearing a tiny hat. That was the first clue that today would be... different.', ages: '3-7' },
  { type: 'wonder', text: '{childName} noticed something no one else had seen — the moon had left a trail of sparkly dust across the sky.', ages: '3-8' },
  { type: 'action', text: 'RUN. That was the only word in {childName}\'s head as the giant bubble chased them down the street.', ages: '4-8' },
  { type: 'cozy', text: 'Rain tapped on the window like tiny fingers. Inside, {childName} had the best idea of the whole week.', ages: '3-7' },
];

const DEFAULT_PLOT_TWISTS = [
  'The scary thing turns out to be friendly and needs help',
  'A character who seemed mean was actually protecting everyone',
  'The treasure they were looking for was inside them all along',
  'The animal sidekick saves the day in the silliest way possible',
  'The villain turns out to be someone who just needed a friend',
  'Two characters swap roles and realize how hard the other had it',
  'The magical power runs out at the worst moment — but they solve it without magic',
  'What everyone thought was broken was actually the key to something better',
  'The smallest character solves the biggest problem',
  'The mistake they made turns out to be the best thing that could have happened',
];

const DEFAULT_WINDDOWNS = [
  'Stars come out one by one as {childName} yawns... each star a tiny nightlight just for them',
  'The world gets quieter. Softer. Like the whole night is tucking itself in, just like {childName}',
  'One last firefly blinks goodbye... then another... then everything is warm and still',
  '{childName}\'s eyes grow heavy, like someone filled them with the coziest kind of sleepy-dust',
  'The moon watches over {childName}, humming a song only sleeping children can hear',
  'All the characters from tonight\'s story whisper "goodnight" and tiptoe away, smiling',
];

const DEFAULT_SOUND_FX = [
  { sound: 'WHOOOOSH', when: 'flying, wind, something fast', emoji: '💨' },
  { sound: 'CRASH-BANG-TINKLE', when: 'something falls, breaking something funny', emoji: '💥' },
  { sound: 'tiptoe tiptoe tiptoe...', when: 'sneaking, being quiet', emoji: '🤫' },
  { sound: 'SPLAT', when: 'mud, food fight, slipping', emoji: '💦' },
  { sound: 'creak... creak... CREEEAK', when: 'opening old doors, suspense', emoji: '🚪' },
  { sound: 'BOING BOING BOING', when: 'jumping, bouncing, springs', emoji: '🦘' },
  { sound: 'pssst... pssst...', when: 'whispering, secrets', emoji: '🤐' },
  { sound: 'rumble rumble GRUMBLE', when: 'hungry tummy, thunder', emoji: '⛈️' },
  { sound: 'DING DING DING', when: 'winning, bells, ideas', emoji: '🔔' },
  { sound: 'swish-swoosh-swirl', when: 'magic, wands, potions', emoji: '✨' },
  { sound: 'click-clack click-clack', when: 'footsteps, trains, typing', emoji: '🚂' },
  { sound: 'POP!', when: 'bubbles, surprises, disappearing', emoji: '🫧' },
];

const DEFAULT_SETTINGS = [
  { name: 'Enchanted Forest', description: 'Trees that whisper, glowing mushrooms, paths that change direction', emoji: '🌲', ages: '3-10' },
  { name: 'Cloud Kingdom', description: 'Fluffy cloud houses, rainbow bridges, sky gardens', emoji: '☁️', ages: '3-8' },
  { name: 'Undersea City', description: 'Coral castles, talking fish, pearl streets', emoji: '🐠', ages: '3-8' },
  { name: 'Tiny World', description: '{childName} shrinks down — furniture is mountains, puddles are oceans', emoji: '🔍', ages: '4-9' },
  { name: 'Night Market', description: 'Floating lanterns, magical food stalls, strange and wonderful sellers', emoji: '🏮', ages: '4-10' },
  { name: 'Dream Train', description: 'A train that travels through dreams, each carriage a new world', emoji: '🚂', ages: '3-8' },
  { name: 'Grandparent\'s Village', description: 'A warm village from the past, old houses, big trees, everyone knows everyone', emoji: '🏡', ages: '3-10' },
  { name: 'Flying Library', description: 'A library that floats in the sky, books that come alive when opened', emoji: '📚', ages: '5-10' },
  { name: 'The Upside-Down House', description: 'Everything is flipped — walk on ceilings, sit on chandeliers', emoji: '🏠', ages: '3-7' },
  { name: 'Animal School', description: 'A school where animals teach and kids learn animal things', emoji: '🎒', ages: '3-7' },
];

const DEFAULT_AGE_GUIDES = [
  { range: '2-3', vocab: 'Very simple words. 2-4 word sentences. Lots of animal sounds and repetition. Name objects they know: ball, cat, moon, star', humor: 'Peek-a-boo style. Silly sounds. Things falling down. Unexpected animal noises', themes: 'Familiar routines: bedtime, bath, eating. Animals doing people things', attention: '2-3 minutes max. One simple event.' },
  { range: '4-5', vocab: 'Short sentences. Some new words but explained by context. Rhymes and songs embedded. Sound effects!', humor: 'Potty humor (gentle). Funny names. Things going wrong in silly ways. Characters being dramatic', themes: 'Friendship, sharing, being brave (small fears). Magical helpers. Talking animals', attention: '5-7 minutes. One clear adventure with a problem and solution.' },
  { range: '6-7', vocab: 'Longer sentences ok. Can handle some "big kid" words if context helps. Dialogue between characters', humor: 'Wordplay, misunderstandings, funny comparisons. "As big as a..." exaggeration. Characters being stubborn in cute ways', themes: 'Right vs wrong, teamwork, standing up for others, being different is ok. Mild peril (but always safe)', attention: '7-10 minutes. Can handle subplots. Like cliffhangers between sections.' },
  { range: '8-10', vocab: 'Rich vocabulary welcome. Metaphors ok. Complex sentences. Can handle flashbacks and perspective shifts', humor: 'Irony, clever twists, self-aware humor. Characters knowing something the reader doesn\'t. Smart comebacks', themes: 'Complex feelings, empathy, consequences of actions, gray areas (not everything is black/white), inner strength, identity', attention: '10-15 minutes. Multiple plot threads ok. Character development matters.' },
];

const DEFAULT_VALUE_DELIVERY = [
  { value: 'kindness', doThis: 'Show a character doing something kind without being asked. Show the ripple effect — how one kind act leads to another. The receiver should feel it, not hear about it.', notThis: 'Never say "being kind is important". Never have a character lecture about kindness. Never reward kindness immediately — let it be its own reward.' },
  { value: 'courage', doThis: 'Show the fear FIRST. The child should feel scared too. Then show the small step — not a big heroic moment, but a tiny brave choice. Courage is doing the thing even when you\'re scared.', notThis: 'Don\'t make the hero fearless. Don\'t equate courage with physical strength. Don\'t have another character say "you were so brave!"' },
  { value: 'honesty', doThis: 'Show the temptation to lie. Make it feel real — the lie would be easier. Then show the weight of it. The truth should feel like putting down something heavy.', notThis: 'Don\'t punish the liar. Don\'t make honesty always easy. Don\'t have an adult say "honesty is the best policy".' },
  { value: 'patience', doThis: 'Show the waiting. Make the reader feel the itch of wanting something NOW. Then show how waiting revealed something better that rushing would have missed.', notThis: 'Don\'t make the impatient character look stupid. Don\'t lecture. Don\'t make patience boring — it should be active, noticing things while waiting.' },
  { value: 'gratitude', doThis: 'Show a character noticing something they\'d normally ignore — a view, a sound, a person\'s effort. The "thank you" moment should feel genuine and specific, not generic.', notThis: 'Never have "count your blessings" moment. Don\'t compare to others who have less. Don\'t force a gratitude list into the story.' },
  { value: 'sharing', doThis: 'Show the internal conflict — wanting to keep something for yourself. Then show how sharing created something neither could have alone. The joy should be in the together-ness.', notThis: 'Don\'t make the non-sharer a villain. Don\'t force sharing — show choosing to share. Don\'t reward sharing with getting more stuff back.' },
  { value: 'respect', doThis: 'Show listening. Really listening. Show a character changing their mind after understanding someone else\'s perspective. Respect is seeing others as fully real people.', notThis: 'Don\'t confuse respect with obedience. Don\'t make it about rules. Don\'t show respect only to authority figures — show respect to everyone, including animals and nature.' },
  { value: 'bravery', doThis: 'Show the moment of choice — the character could walk away but doesn\'t. Show that bravery looks different for different people. Sometimes bravery is speaking up. Sometimes it\'s staying quiet.', notThis: 'Don\'t glorify recklessness. Don\'t make bravery about fighting. Don\'t make the brave character special — any character can be brave.' },
];

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';

function StoryLab() {
  const [subTab, setSubTab] = useState('playground');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // All lab data — loaded from Firestore, falls back to defaults
  const [archetypes, setArchetypes] = useState(DEFAULT_ARCHETYPES);
  const [editingArch, setEditingArch] = useState(null);
  const [culturalRefs, setCulturalRefs] = useState(DEFAULT_CULTURAL_REFS);
  const [editingCulture, setEditingCulture] = useState(null);
  const [storyOpeners, setStoryOpeners] = useState(DEFAULT_STORY_OPENERS);
  const [plotTwists, setPlotTwists] = useState(DEFAULT_PLOT_TWISTS);
  const [windDowns, setWindDowns] = useState(DEFAULT_WINDDOWNS);
  const [soundFx, setSoundFx] = useState(DEFAULT_SOUND_FX);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ageGuides, setAgeGuides] = useState(DEFAULT_AGE_GUIDES);
  const [valueDelivery, setValueDelivery] = useState(DEFAULT_VALUE_DELIVERY);
  const [cachedStories, setCachedStories] = useState([]);

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
  const [pgRating, setPgRating] = useState(0);
  const [pgNotes, setPgNotes] = useState('');
  // Cache filters + manual story
  const [cacheFilterBelief, setCacheFilterBelief] = useState('all');
  const [cacheFilterCountry, setCacheFilterCountry] = useState('all');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualStory, setManualStory] = useState({ title: '', text: '', value: 'kindness', duration: 5, language: 'English', beliefs: 'hindu', country: 'IN', age: 5, gender: 'girl', childName: '{childName}' });
  // Global rules state
  const [globalRules, setGlobalRules] = useState([
    'Never create content that could hurt religious sentiments of any faith',
    'Try to include closest cultural references to the story — go beyond famous gods/characters to teach about lesser-known religious figures',
  ]);
  // Quick whispers state
  const [quickWhispers, setQuickWhispers] = useState({});
  const [qwBelief, setQwBelief] = useState('hindu');
  const [qwCountry, setQwCountry] = useState('IN');

  // Load all config from Firestore
  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const { getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'storyLab'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.archetypes?.length) setArchetypes(d.archetypes);
          if (d.culturalRefs) setCulturalRefs({ ...DEFAULT_CULTURAL_REFS, ...d.culturalRefs });
          if (d.storyOpeners?.length) setStoryOpeners(d.storyOpeners);
          if (d.plotTwists?.length) setPlotTwists(d.plotTwists);
          if (d.windDowns?.length) setWindDowns(d.windDowns);
          if (d.soundFx?.length) setSoundFx(d.soundFx);
          if (d.settings?.length) setSettings(d.settings);
          if (d.ageGuides?.length) setAgeGuides(d.ageGuides);
          if (d.valueDelivery?.length) setValueDelivery(d.valueDelivery);
          if (d.quickWhispers) setQuickWhispers(d.quickWhispers);
          if (d.globalRules?.length) setGlobalRules(d.globalRules);
        }
        const storiesSnap = await getDocs(collection(db, 'storyCache'));
        const list = [];
        storiesSnap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setCachedStories(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } catch (e) {
        console.error('Failed to load story lab config:', e);
      }
    })();
  }, []);

  const saveAll = async (section, data) => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'storyLab'), { [section]: data }, { merge: true });
      setLastSaved(section);
      setTimeout(() => setLastSaved(null), 2000);
    } catch (e) {
      console.error('Failed to save:', e);
    }
    setSaving(false);
  };

  const saveStoryToCache = async (story) => {
    if (!db || !story) return;
    try {
      const id = `story_${Date.now()}`;
      const entry = { ...story, createdAt: Date.now(), childName: pgChildName, age: pgAge, gender: pgGender, value: pgValue, duration: pgDuration, language: pgLanguage, beliefs: pgBeliefs, country: pgCountry, rating: pgRating, notes: pgNotes };
      await setDoc(doc(db, 'storyCache', id), entry);
      setCachedStories((prev) => [{ id, ...entry }, ...prev]);
    } catch (e) { console.error('Failed to cache story:', e); }
  };

  const deleteFromCache = async (id) => {
    if (!db) return;
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'storyCache', id));
      setCachedStories((prev) => prev.filter((s) => s.id !== id));
    } catch (e) { console.error('Failed to delete cached story:', e); }
  };

  const generateTestStory = async () => {
    setPgGenerating(true);
    setPgError(null);
    setPgResult(null);
    setPgRating(0);
    setPgNotes('');
    try {
      const res = await fetch(`${API_BASE}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: pgChildName, age: pgAge, gender: pgGender, value: pgValue,
          duration: pgDuration, language: pgLanguage, whisper: pgWhisper || undefined,
          beliefs: [pgBeliefs], country: pgCountry, narrator: 'AI Narrator', _adminTest: true,
          selectedCast: pgCast.split(',').map((s) => {
            const match = s.trim().match(/^(.+?)\s*\((.+)\)$/);
            if (match) { const [, name, rest] = match; const parts = rest.split(',').map((p) => p.trim()); return { name: name.trim(), relation: parts[0] || 'friend', traits: parts.slice(1).join(', ') }; }
            return { name: s.trim(), relation: 'friend', traits: '' };
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setPgResult(data);
    } catch (e) { setPgError(e.message); }
    setPgGenerating(false);
  };

  const SUB_TABS = [
    { key: 'rules', label: 'Global Rules', icon: '🛡️' },
    { key: 'playground', label: 'Playground', icon: '🎮' },
    { key: 'archetypes', label: 'Characters', icon: '👥' },
    { key: 'culture', label: 'Cultural Library', icon: '🌍' },
    { key: 'whispers', label: 'Quick Whispers', icon: '💭' },
    { key: 'ingredients', label: 'Story Ingredients', icon: '🧩' },
    { key: 'values', label: 'Value Delivery', icon: '💡' },
    { key: 'ages', label: 'Age Guides', icon: '🎂' },
    { key: 'wisdom-audio', label: 'Wisdom Stories', icon: '📖' },
    { key: 'cache', label: `Cache (${cachedStories.length})`, icon: '📦' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SUB_TABS.map((t) => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${subTab === t.key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-[#1a1a28] text-[#a8a39a] hover:text-[#f5f0e8]'}`}
          >{t.icon} {t.label}</button>
        ))}
      </div>

      {saving && <div className="rounded-xl bg-[#f0a500]/10 p-3 text-center text-xs font-bold text-[#f0a500]">Saving...</div>}
      {lastSaved && <div className="rounded-xl bg-[#7ad9a1]/10 p-3 text-center text-xs font-bold text-[#7ad9a1]">Saved {lastSaved}!</div>}

      {/* ══════ GLOBAL RULES ══════ */}
      {subTab === 'rules' && (
        <div className="rounded-2xl bg-[#1a1a28] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#f5f0e8]">Mandatory Rules for ALL stories</h3>
            <button onClick={() => saveAll('globalRules', globalRules)} disabled={saving}
              className="rounded-full bg-[#f0a500] px-4 py-1.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Rules'}
            </button>
          </div>
          <p className="mb-4 text-xs text-[#6e6a63]">These rules are injected into every story generation prompt. Claude will never violate them.</p>
          <div className="space-y-2">
            {globalRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <textarea value={rule} onChange={(e) => {
                  const updated = [...globalRules];
                  updated[i] = e.target.value;
                  setGlobalRules(updated);
                }} rows={2}
                className="flex-1 rounded-xl bg-[#0a0a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/10" />
                <button onClick={() => setGlobalRules(globalRules.filter((_, j) => j !== i))}
                  className="mt-1 text-xs text-[#f3727f]">Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => setGlobalRules([...globalRules, ''])}
            className="mt-3 text-xs font-bold text-[#f0a500]">+ Add rule</button>
        </div>
      )}

      {/* ══════ PLAYGROUND ══════ */}
      {subTab === 'playground' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <LabCard title="Story Parameters">
              <div className="grid grid-cols-2 gap-3">
                <LabInput label="Child name" value={pgChildName} onChange={setPgChildName} />
                <LabInput label="Age" value={pgAge} onChange={(v) => setPgAge(Number(v))} type="number" />
                <LabSelect label="Gender" value={pgGender} onChange={setPgGender} options={[{ value: 'girl', label: 'Girl' }, { value: 'boy', label: 'Boy' }, { value: 'other', label: 'Other' }]} />
                <LabSelect label="Value" value={pgValue} onChange={setPgValue} options={VALUES.map((v) => ({ value: v.key, label: `${v.emoji} ${v.label}` }))} />
                <LabSelect label="Duration" value={pgDuration} onChange={(v) => setPgDuration(Number(v))} options={DURATIONS.map((d) => ({ value: d.minutes, label: d.label }))} />
                <LabSelect label="Language" value={pgLanguage} onChange={setPgLanguage} options={LANGUAGES.map((l) => ({ value: l.key, label: l.label }))} />
                <LabSelect label="Belief" value={pgBeliefs} onChange={setPgBeliefs} options={RELIGIONS.map((r) => ({ value: r.key, label: `${r.icon} ${r.label}` }))} />
                <LabSelect label="Country" value={pgCountry} onChange={setPgCountry} options={COUNTRIES.map((c) => ({ value: c.key, label: `${c.flag} ${c.label}` }))} />
              </div>
              <div className="mt-3"><LabInput label="Cast — Name (relation, traits), ..." value={pgCast} onChange={setPgCast} full /></div>
              <div className="mt-3"><LabInput label="Whisper (parent note)" value={pgWhisper} onChange={setPgWhisper} full /></div>
              <button onClick={generateTestStory} disabled={pgGenerating}
                className="mt-4 w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] transition active:scale-95 disabled:opacity-50">
                {pgGenerating ? 'Generating with Claude...' : 'Generate Test Story'}
              </button>
              {pgError && <div className="mt-3 rounded-xl bg-[#f3727f]/10 p-3 text-xs text-[#f3727f]">{pgError}</div>}
            </LabCard>
          </div>

          <div className="space-y-4">
            {pgGenerating && (
              <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#f0a500] border-t-transparent" />
                  <p className="text-sm text-[#a8a39a]">Generating story with Claude...</p>
                  <p className="mt-2 text-[10px] text-[#6e6a63]">This typically takes 10-15 seconds</p>
                </div>
              </div>
            )}
            {pgResult && (
              <LabCard title={pgResult.title} titleColor>
                <p className="text-xs text-[#a8a39a]">{pgResult.wordCount} words · ~{Math.round(pgResult.wordCount / 130)} min · {pgResult.generatedBy}</p>
                <div className="mt-3 max-h-[50vh] overflow-y-auto rounded-xl bg-[#0f0f17] p-4 font-story text-sm leading-relaxed text-[#f5f0e8]/80">{pgResult.text}</div>

                {/* Quality rating */}
                <div className="mt-4 rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63] mb-2">Rate this story</div>
                  <div className="flex gap-2 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setPgRating(star)}
                        className={`text-2xl transition ${star <= pgRating ? 'opacity-100' : 'opacity-20'}`}>
                        {star <= pgRating ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="ml-2 self-center text-xs text-[#a8a39a]">
                      {pgRating === 1 ? 'Bad' : pgRating === 2 ? 'Weak' : pgRating === 3 ? 'OK' : pgRating === 4 ? 'Good' : pgRating === 5 ? 'Amazing' : ''}
                    </span>
                  </div>
                  <textarea value={pgNotes} onChange={(e) => setPgNotes(e.target.value)} placeholder="Notes — what worked, what didn't, what to change..."
                    className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" rows={3} />
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => saveStoryToCache(pgResult)}
                    className="flex-1 rounded-xl bg-[#7ad9a1]/10 py-2.5 text-xs font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20">
                    Save to Cache
                  </button>
                  <button onClick={generateTestStory} disabled={pgGenerating}
                    className="flex-1 rounded-xl bg-[#f0a500]/10 py-2.5 text-xs font-bold text-[#f0a500] hover:bg-[#f0a500]/20">
                    Regenerate
                  </button>
                </div>
              </LabCard>
            )}
            {!pgGenerating && !pgResult && (
              <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
                <div className="text-center">
                  <div className="mb-3 text-4xl">🧪</div>
                  <p className="text-sm text-[#a8a39a]">Configure and generate a test story</p>
                  <p className="mt-1 text-xs text-[#6e6a63]">Test different parameter combos. Rate results. Save the good ones.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ CHARACTER ARCHETYPES ══════ */}
      {subTab === 'archetypes' && (
        <div className="space-y-4">
          <LabCard title="Character Archetypes" subtitle="Define how each role appears in stories. Your team can customize names, traits, and activities to break stereotypes and add variety.">
            <div className="space-y-3">
              {archetypes.map((arch, i) => (
                <div key={arch.key} className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{arch.key === 'grandfather' ? '👴' : arch.key === 'grandmother' ? '👵' : arch.key === 'mother' ? '👩' : arch.key === 'father' ? '👨' : arch.key === 'sibling' ? '🧒' : arch.key === 'uncle' ? '🧔' : arch.key === 'aunt' ? '👩' : '🐶'}</span>
                      <div>
                        <div className="font-bold text-[#f5f0e8] capitalize">{arch.key}</div>
                        <div className="text-xs text-[#a8a39a]">Called: {arch.callOptions.slice(0, 4).join(', ')}{arch.callOptions.length > 4 ? ` +${arch.callOptions.length - 4}` : ''}</div>
                        <div className="mt-1 text-[10px] text-[#6e6a63] truncate max-w-md">{arch.traits}</div>
                      </div>
                    </div>
                    <button onClick={() => setEditingArch(editingArch === i ? null : i)} className="rounded-lg bg-[#1a1a28] px-3 py-1.5 text-xs font-bold text-[#f0a500]">{editingArch === i ? 'Close' : 'Edit'}</button>
                  </div>
                  {editingArch === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 space-y-3 overflow-hidden">
                      <LabField label="What can they be called? (comma separated)" value={arch.callOptions.join(', ')} onChange={(v) => { const u = [...archetypes]; u[i] = { ...arch, callOptions: v.split(',').map((s) => s.trim()).filter(Boolean) }; setArchetypes(u); }} />
                      <LabField label="Default name in stories" value={arch.defaultCall} onChange={(v) => { const u = [...archetypes]; u[i] = { ...arch, defaultCall: v }; setArchetypes(u); }} />
                      <LabField label="Personality traits (NOT stereotypical!)" value={arch.traits} onChange={(v) => { const u = [...archetypes]; u[i] = { ...arch, traits: v }; setArchetypes(u); }} />
                      <LabField label="Activities in stories (creative, break expectations!)" value={arch.activities} onChange={(v) => { const u = [...archetypes]; u[i] = { ...arch, activities: v }; setArchetypes(u); }} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setArchetypes([...archetypes, { key: `custom_${Date.now()}`, callOptions: ['New Character'], defaultCall: 'New Character', traits: '', activities: '', isCustom: true }])}
              className="mt-3 w-full rounded-lg border border-dashed border-white/10 py-3 text-xs font-bold text-[#a8a39a]">+ Add New Character Type (visible to all users in Characters section)</button>
            <button onClick={() => saveAll('archetypes', archetypes)} disabled={saving} className="mt-3 w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Archetypes</button>
            <p className="mt-2 text-[10px] text-[#6e6a63] text-center">Custom character types added here will appear in every user's Characters section for selection</p>
          </LabCard>
        </div>
      )}

      {/* ══════ CULTURAL LIBRARY ══════ */}
      {subTab === 'culture' && (
        <div className="space-y-4">
          <LabCard title="Cultural Reference Library" subtitle="Foods, festivals, traditions, places, music, games, clothing, greetings — organized by belief system. Claude picks from these to add cultural warmth without repeating.">
            <div className="flex gap-2 flex-wrap mb-4">
              {Object.keys(culturalRefs).map((key) => {
                const r = RELIGIONS.find((x) => x.key === key);
                return (
                  <button key={key} onClick={() => setEditingCulture(editingCulture === key ? null : key)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${editingCulture === key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-[#0f0f17] text-[#a8a39a]'}`}>
                    {r?.icon || '🌍'} {r?.label || key}
                  </button>
                );
              })}
            </div>
            {editingCulture && culturalRefs[editingCulture] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 rounded-xl bg-[#0f0f17] p-4">
                {Object.entries(culturalRefs[editingCulture]).map(([category, items]) => (
                  <div key={category}>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">
                      {category === 'foods' ? '🍲 Foods' : category === 'festivals' ? '🎉 Festivals' : category === 'traditions' ? '🪷 Traditions' : category === 'places' ? '📍 Places' : category === 'music' ? '🎵 Music & Sounds' : category === 'games' ? '🎮 Games' : category === 'clothing' ? '👗 Clothing' : '👋 Greetings'}
                    </label>
                    <textarea value={Array.isArray(items) ? items.join(', ') : items}
                      onChange={(e) => {
                        const updated = { ...culturalRefs, [editingCulture]: { ...culturalRefs[editingCulture], [category]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } };
                        setCulturalRefs(updated);
                      }}
                      rows={2} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
                  </div>
                ))}
                <button onClick={() => saveAll('culturalRefs', culturalRefs)} disabled={saving} className="w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save {RELIGIONS.find((r) => r.key === editingCulture)?.label || editingCulture}</button>
              </motion.div>
            )}
            {!editingCulture && (
              <p className="text-center text-xs text-[#6e6a63] py-6">Select a belief system above to edit its cultural references</p>
            )}
          </LabCard>
        </div>
      )}

      {/* ══════ QUICK WHISPERS ══════ */}
      {subTab === 'whispers' && (() => {
        const key = `${qwBelief}_${qwCountry}`;
        const current = quickWhispers[key] || ['', '', '', '', '', ''];
        const updateWhisper = (idx, val) => {
          const updated = [...current];
          updated[idx] = val;
          setQuickWhispers({ ...quickWhispers, [key]: updated });
        };
        return (
        <div className="space-y-4">
          <LabCard title="Quick Whispers" subtitle="Pre-set whisper suggestions shown to parents. 6 per belief + country combo. Parents see these as one-tap options before typing their own.">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#6e6a63]">Belief:</span>
                <select value={qwBelief} onChange={(e) => setQwBelief(e.target.value)} className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5">
                  {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#6e6a63]">Country:</span>
                <select value={qwCountry} onChange={(e) => setQwCountry(e.target.value)} className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5">
                  {COUNTRIES.map((c) => <option key={c.key} value={c.key}>{c.flag} {c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-[#0f0f17] p-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63] mb-3">
                6 Quick Whispers for {RELIGIONS.find((r) => r.key === qwBelief)?.icon} {RELIGIONS.find((r) => r.key === qwBelief)?.label} · {COUNTRIES.find((c) => c.key === qwCountry)?.flag} {COUNTRIES.find((c) => c.key === qwCountry)?.label}
              </div>
              <div className="space-y-2">
                {[0,1,2,3,4,5].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#f0a500] w-5">{idx + 1}</span>
                    <input
                      value={current[idx] || ''}
                      onChange={(e) => updateWhisper(idx, e.target.value)}
                      placeholder={`Quick whisper ${idx + 1}...`}
                      className="flex-1 rounded-lg bg-[#1a1a28] px-3 py-2.5 text-sm text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-[#0f0f17] p-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63] mb-2">Preview — what parents will see</div>
              <div className="flex flex-wrap gap-2">
                {current.filter(Boolean).map((w, i) => (
                  <span key={i} className="rounded-full bg-[#1a1a28] px-3 py-1.5 text-[11px] text-[#a8a39a] ring-1 ring-white/5">{w}</span>
                ))}
                {current.filter(Boolean).length === 0 && <span className="text-xs text-[#6e6a63]">No whispers set — will use default suggestions</span>}
              </div>
            </div>

            {/* Saved combos overview */}
            {Object.keys(quickWhispers).length > 0 && (
              <div className="rounded-xl bg-[#0f0f17] p-4 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6a63] mb-2">All configured combos</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quickWhispers).filter(([, v]) => v.some(Boolean)).map(([k]) => {
                    const [b, c] = k.split('_');
                    const br = RELIGIONS.find((r) => r.key === b);
                    const cr = COUNTRIES.find((x) => x.key === c);
                    return (
                      <button key={k} onClick={() => { setQwBelief(b); setQwCountry(c); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${k === key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-[#1a1a28] text-[#a8a39a]'}`}>
                        {br?.icon} {cr?.flag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button onClick={() => saveAll('quickWhispers', quickWhispers)} disabled={saving}
              className="w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">
              Save Quick Whispers
            </button>
            <p className="mt-2 text-[10px] text-[#6e6a63] text-center">Changes go live immediately for users matching this belief + country</p>
          </LabCard>
        </div>
        );
      })()}

      {/* ══════ STORY INGREDIENTS ══════ */}
      {subTab === 'ingredients' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Openers */}
          <LabCard title="Story Openers" subtitle="Great first lines that hook kids immediately. Claude picks from these.">
            {storyOpeners.map((opener, i) => (
              <div key={i} className="mb-2 rounded-lg bg-[#0f0f17] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#f0a500]">{opener.type}</span>
                  <span className="text-[9px] text-[#6e6a63]">Ages {opener.ages}</span>
                  <button onClick={() => { const u = storyOpeners.filter((_, j) => j !== i); setStoryOpeners(u); }} className="ml-auto text-[10px] text-[#f3727f]">remove</button>
                </div>
                <textarea value={opener.text} onChange={(e) => { const u = [...storyOpeners]; u[i] = { ...opener, text: e.target.value }; setStoryOpeners(u); }}
                  rows={2} className="w-full rounded bg-[#1a1a28] px-2 py-1.5 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
              </div>
            ))}
            <button onClick={() => setStoryOpeners([...storyOpeners, { type: 'new', text: '', ages: '3-10' }])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-[#a8a39a]">+ Add opener</button>
            <button onClick={() => saveAll('storyOpeners', storyOpeners)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Openers</button>
          </LabCard>

          {/* Plot Twists */}
          <LabCard title="Plot Twists" subtitle="Surprise moments that make stories memorable">
            {plotTwists.map((twist, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input value={twist} onChange={(e) => { const u = [...plotTwists]; u[i] = e.target.value; setPlotTwists(u); }}
                  className="flex-1 rounded-lg bg-[#0f0f17] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
                <button onClick={() => setPlotTwists(plotTwists.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setPlotTwists([...plotTwists, ''])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-[#a8a39a]">+ Add twist</button>
            <button onClick={() => saveAll('plotTwists', plotTwists)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Twists</button>
          </LabCard>

          {/* Wind-downs */}
          <LabCard title="Wind-Down Patterns" subtitle="How stories end — soft, sleepy, warm">
            {windDowns.map((wd, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <textarea value={wd} onChange={(e) => { const u = [...windDowns]; u[i] = e.target.value; setWindDowns(u); }}
                  rows={2} className="flex-1 rounded-lg bg-[#0f0f17] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
                <button onClick={() => setWindDowns(windDowns.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setWindDowns([...windDowns, ''])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-[#a8a39a]">+ Add wind-down</button>
            <button onClick={() => saveAll('windDowns', windDowns)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Wind-Downs</button>
          </LabCard>

          {/* Sound Effects */}
          <LabCard title="Sound Effects Library" subtitle="Fun sounds Claude weaves into the narrative">
            {soundFx.map((fx, i) => (
              <div key={i} className="mb-2 rounded-lg bg-[#0f0f17] p-3 flex items-center gap-3">
                <span className="text-lg">{fx.emoji}</span>
                <div className="flex-1 space-y-1">
                  <input value={fx.sound} onChange={(e) => { const u = [...soundFx]; u[i] = { ...fx, sound: e.target.value }; setSoundFx(u); }} placeholder="Sound"
                    className="w-full rounded bg-[#1a1a28] px-2 py-1 text-xs font-bold text-[#f0a500] outline-none ring-1 ring-white/5" />
                  <input value={fx.when} onChange={(e) => { const u = [...soundFx]; u[i] = { ...fx, when: e.target.value }; setSoundFx(u); }} placeholder="When to use"
                    className="w-full rounded bg-[#1a1a28] px-2 py-1 text-[10px] text-[#a8a39a] outline-none ring-1 ring-white/5" />
                </div>
                <button onClick={() => setSoundFx(soundFx.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setSoundFx([...soundFx, { sound: '', when: '', emoji: '🔊' }])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-[#a8a39a]">+ Add sound</button>
            <button onClick={() => saveAll('soundFx', soundFx)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Sounds</button>
          </LabCard>

          {/* Story Settings */}
          <LabCard title="World Settings" subtitle="Magical places where stories happen" colSpan>
            <div className="grid gap-3 sm:grid-cols-2">
              {settings.map((s, i) => (
                <div key={i} className="rounded-lg bg-[#0f0f17] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input value={s.emoji} onChange={(e) => { const u = [...settings]; u[i] = { ...s, emoji: e.target.value }; setSettings(u); }} className="w-10 rounded bg-[#1a1a28] px-1 py-0.5 text-center text-lg outline-none" />
                    <input value={s.name} onChange={(e) => { const u = [...settings]; u[i] = { ...s, name: e.target.value }; setSettings(u); }} className="flex-1 rounded bg-[#1a1a28] px-2 py-1 text-sm font-bold text-[#f5f0e8] outline-none ring-1 ring-white/5" />
                    <span className="text-[9px] text-[#6e6a63]">{s.ages}</span>
                    <button onClick={() => setSettings(settings.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
                  </div>
                  <textarea value={s.description} onChange={(e) => { const u = [...settings]; u[i] = { ...s, description: e.target.value }; setSettings(u); }}
                    rows={2} className="w-full rounded bg-[#1a1a28] px-2 py-1 text-[11px] text-[#a8a39a] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
                </div>
              ))}
            </div>
            <button onClick={() => setSettings([...settings, { name: 'New Setting', description: '', emoji: '✨', ages: '3-10' }])} className="mt-2 w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-[#a8a39a]">+ Add setting</button>
            <button onClick={() => saveAll('settings', settings)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Settings</button>
          </LabCard>
        </div>
      )}

      {/* ══════ VALUE DELIVERY ══════ */}
      {subTab === 'values' && (
        <div className="space-y-4">
          <LabCard title="Value Delivery Guide" subtitle="How to teach each value WITHOUT being preachy. The 'Do this / Not this' for your storytelling AI.">
            {valueDelivery.map((vd, i) => {
              const meta = VALUES.find((v) => v.key === vd.value);
              return (
                <div key={vd.value} className="mb-3 rounded-xl bg-[#0f0f17] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{meta?.emoji}</span>
                    <span className="font-bold text-[#f5f0e8] capitalize">{vd.value}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#7ad9a1]">Do this</label>
                      <textarea value={vd.doThis} onChange={(e) => { const u = [...valueDelivery]; u[i] = { ...vd, doThis: e.target.value }; setValueDelivery(u); }}
                        rows={4} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-[#7ad9a1]/20 focus:ring-[#7ad9a1]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#f3727f]">Not this</label>
                      <textarea value={vd.notThis} onChange={(e) => { const u = [...valueDelivery]; u[i] = { ...vd, notThis: e.target.value }; setValueDelivery(u); }}
                        rows={4} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-[#f3727f]/20 focus:ring-[#f3727f]" />
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={() => saveAll('valueDelivery', valueDelivery)} disabled={saving} className="w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Value Guides</button>
          </LabCard>
        </div>
      )}

      {/* ══════ AGE GUIDES ══════ */}
      {subTab === 'ages' && (
        <div className="space-y-4">
          <LabCard title="Age-Appropriate Guidelines" subtitle="How vocabulary, humor, themes, and attention span change by age">
            {ageGuides.map((ag, i) => (
              <div key={ag.range} className="mb-4 rounded-xl bg-[#0f0f17] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-[#f0a500]/10 px-3 py-1 text-sm font-bold text-[#f0a500]">{ag.range} years</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">Vocabulary & Language</label>
                    <textarea value={ag.vocab} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, vocab: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">Humor Style</label>
                    <textarea value={ag.humor} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, humor: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">Themes & Topics</label>
                    <textarea value={ag.themes} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, themes: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">Attention Span & Pacing</label>
                    <textarea value={ag.attention} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, attention: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" /></div>
                </div>
              </div>
            ))}
            <button onClick={() => saveAll('ageGuides', ageGuides)} disabled={saving} className="w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Age Guides</button>
          </LabCard>
        </div>
      )}

      {/* ══════ WISDOM AUDIO ══════ */}
      {subTab === 'wisdom-audio' && <WisdomAudioPanel />}

      {/* ══════ STORY CACHE ══════ */}
      {subTab === 'cache' && (() => {
        const filtered = cachedStories.filter((s) => {
          if (cacheFilterBelief !== 'all' && s.beliefs !== cacheFilterBelief) return false;
          if (cacheFilterCountry !== 'all' && s.country !== cacheFilterCountry) return false;
          return true;
        });
        return (
        <div className="space-y-4">
          <LabCard title="Story Cache" subtitle="Pre-generated and hand-written stories. These can be served without API credits.">
            {cachedStories.length > 0 && (
              <div className="mb-4 grid grid-cols-4 gap-3 text-center">
                <div className="rounded-lg bg-[#0f0f17] p-3"><div className="text-xl font-bold text-[#f0a500]">{cachedStories.length}</div><div className="text-[9px] text-[#6e6a63]">Total</div></div>
                <div className="rounded-lg bg-[#0f0f17] p-3"><div className="text-xl font-bold text-[#7ad9a1]">{cachedStories.filter((s) => s.rating >= 4).length}</div><div className="text-[9px] text-[#6e6a63]">4-5 stars</div></div>
                <div className="rounded-lg bg-[#0f0f17] p-3"><div className="text-xl font-bold text-[#f0a500]">{[...new Set(cachedStories.map((s) => s.value))].length}</div><div className="text-[9px] text-[#6e6a63]">Values</div></div>
                <div className="rounded-lg bg-[#0f0f17] p-3"><div className="text-xl font-bold text-[#f0a500]">{[...new Set(cachedStories.map((s) => s.beliefs))].length}</div><div className="text-[9px] text-[#6e6a63]">Beliefs</div></div>
              </div>
            )}
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#6e6a63]">Belief:</span>
                <select value={cacheFilterBelief} onChange={(e) => setCacheFilterBelief(e.target.value)} className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5">
                  <option value="all">All beliefs</option>
                  {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#6e6a63]">Country:</span>
                <select value={cacheFilterCountry} onChange={(e) => setCacheFilterCountry(e.target.value)} className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/5">
                  <option value="all">All countries</option>
                  {COUNTRIES.map((c) => <option key={c.key} value={c.key}>{c.flag} {c.label}</option>)}
                </select>
              </div>
              <span className="self-center text-xs text-[#a8a39a]">{filtered.length} stories</span>
            </div>
            {/* Add manual story button */}
            <button onClick={() => setShowManualForm(!showManualForm)}
              className="w-full rounded-xl bg-[#7ad9a1]/10 py-3 text-sm font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20">
              {showManualForm ? 'Cancel' : '+ Write a Story Manually (no API credits)'}
            </button>
          </LabCard>

          {/* Manual story form */}
          {showManualForm && (
            <LabCard title="Write a Pre-Built Story" subtitle="Hand-craft a story template. Use {childName} as placeholder — it will be replaced with the child's actual name.">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <LabInput label="Title" value={manualStory.title} onChange={(v) => setManualStory({ ...manualStory, title: v })} />
                <LabSelect label="Value" value={manualStory.value} onChange={(v) => setManualStory({ ...manualStory, value: v })} options={VALUES.map((v) => ({ value: v.key, label: `${v.emoji} ${v.label}` }))} />
                <LabSelect label="Belief" value={manualStory.beliefs} onChange={(v) => setManualStory({ ...manualStory, beliefs: v })} options={RELIGIONS.map((r) => ({ value: r.key, label: `${r.icon} ${r.label}` }))} />
                <LabSelect label="Country" value={manualStory.country} onChange={(v) => setManualStory({ ...manualStory, country: v })} options={COUNTRIES.map((c) => ({ value: c.key, label: `${c.flag} ${c.label}` }))} />
                <LabSelect label="Duration" value={manualStory.duration} onChange={(v) => setManualStory({ ...manualStory, duration: Number(v) })} options={DURATIONS.map((d) => ({ value: d.minutes, label: d.label }))} />
                <LabSelect label="Language" value={manualStory.language} onChange={(v) => setManualStory({ ...manualStory, language: v })} options={LANGUAGES.map((l) => ({ value: l.key, label: l.label }))} />
                <LabInput label="Target age" value={manualStory.age} onChange={(v) => setManualStory({ ...manualStory, age: Number(v) })} type="number" />
                <LabSelect label="Gender" value={manualStory.gender} onChange={(v) => setManualStory({ ...manualStory, gender: v })} options={[{ value: 'girl', label: 'Girl' }, { value: 'boy', label: 'Boy' }, { value: 'other', label: 'Other' }]} />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">Story text (use {'{childName}'} for personalization)</label>
                <textarea value={manualStory.text} onChange={(e) => setManualStory({ ...manualStory, text: e.target.value })}
                  rows={12} placeholder="Once upon a time, {childName} found something magical..."
                  className="w-full rounded-lg bg-[#0f0f17] px-4 py-3 font-story text-sm leading-relaxed text-[#f5f0e8] placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
                <div className="mt-1 text-right text-[10px] text-[#6e6a63]">{manualStory.text.split(/\s+/).filter(Boolean).length} words</div>
              </div>
              <button onClick={async () => {
                if (!manualStory.title || !manualStory.text) return;
                const id = `manual_${Date.now()}`;
                const entry = { ...manualStory, id, createdAt: Date.now(), wordCount: manualStory.text.split(/\s+/).filter(Boolean).length, generatedBy: 'manual', rating: 0, notes: '', childName: manualStory.childName || '{childName}' };
                if (db) await setDoc(doc(db, 'storyCache', id), entry);
                setCachedStories((prev) => [{ id, ...entry }, ...prev]);
                setManualStory({ title: '', text: '', value: 'kindness', duration: 5, language: 'English', beliefs: 'hindu', country: 'IN', age: 5, gender: 'girl', childName: '{childName}' });
                setShowManualForm(false);
              }} disabled={!manualStory.title || !manualStory.text}
                className="w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Story to Cache</button>
            </LabCard>
          )}

          {filtered.length === 0 ? (
            <div className="flex items-center justify-center rounded-2xl bg-[#1a1a28] p-12">
              <div className="text-center"><div className="mb-3 text-4xl">📦</div><p className="text-sm text-[#a8a39a]">{cachedStories.length === 0 ? 'No stories yet' : 'No stories match filters'}</p><p className="mt-1 text-xs text-[#6e6a63]">Generate in Playground or write manually</p></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((story) => <CachedStoryCard key={story.id} story={story} onDelete={() => deleteFromCache(story.id)} />)}
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}

// ─── Story Lab sub-components ───

function LabCard({ title, subtitle, titleColor, children, colSpan }) {
  return (
    <div className={`rounded-2xl bg-[#1a1a28] p-6 ${colSpan ? 'sm:col-span-2' : ''}`}>
      {title && <h3 className={`mb-1 text-sm font-bold ${titleColor ? 'font-display text-lg text-[#f0a500]' : 'text-[#f5f0e8]'}`}>{title}</h3>}
      {subtitle && <p className="mb-4 text-xs text-[#6e6a63]">{subtitle}</p>}
      {children}
    </div>
  );
}

function LabField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-[#1a1a28] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
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
            <div className="text-xs text-[#a8a39a]">{story.childName} · {story.age}y · {story.wordCount}w · {story.duration}min · {meta?.label} · {story.language}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#6e6a63]">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : ''}</span>
              {story.rating > 0 && <span className="text-[10px] text-[#f0a500]">{'★'.repeat(story.rating)}{'☆'.repeat(5 - story.rating)}</span>}
              {story.notes && <span className="text-[10px] text-[#6e6a63] truncate max-w-[200px]">{story.notes}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="rounded-lg bg-[#0f0f17] px-3 py-1.5 text-xs font-bold text-[#f0a500]">{expanded ? 'Hide' : 'Read'}</button>
          <button onClick={() => { if (confirm('Delete?')) onDelete(); }} className="rounded-lg bg-[#f3727f]/10 px-3 py-1.5 text-xs font-bold text-[#f3727f]">Del</button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 max-h-[40vh] overflow-y-auto rounded-lg bg-[#0f0f17] p-4 font-story text-sm leading-relaxed text-[#f5f0e8]/80">{story.text}</div>
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
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-[#0f0f17] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5 focus:ring-[#f0a500]" />
    </div>
  );
}

function LabSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e6a63]">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-[#0f0f17] px-3 py-2 text-sm text-[#f5f0e8] outline-none ring-1 ring-white/5">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
    </div>
  );
}

function WisdomAudioPanel() {
  const [urls, setUrls] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [status, setStatus] = useState({});
  const [generating, setGenerating] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [filterTradition, setFilterTradition] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [editing, setEditing] = useState(null); // lesson id being edited
  const [addingNew, setAddingNew] = useState(false);
  const [newStory, setNewStory] = useState({ id: '', tradition: 'hindu', theme: 'compassion-animals', title: '', body: '', source: '', durationMinutes: 8, imagePrompt: '' });

  useEffect(() => {
    // Load from both hardcoded + Firestore custom stories
    (async () => {
      try {
        const { CULTURAL_LESSONS, TRADITIONS, THEMES } = await import('../data/culturalLessons.js');
        const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase.js');
        if (!db) { setLessons(CULTURAL_LESSONS); return; }

        // Load Firestore custom wisdom stories
        const customSnap = await getDocs(collection(db, 'wisdomStories'));
        const custom = [];
        customSnap.forEach(d => custom.push({ id: d.id, ...d.data(), _isCustom: true }));

        // Merge: custom stories override hardcoded ones with same id
        const hardcoded = CULTURAL_LESSONS.map(l => ({ ...l, _isCustom: false }));
        const merged = new Map();
        hardcoded.forEach(l => merged.set(l.id, l));
        custom.forEach(l => merged.set(l.id, l));
        setLessons([...merged.values()]);

        const snap = await getDoc(doc(db, 'config', 'wisdomAudio'));
        if (snap.exists()) setUrls(snap.data());
        const imgSnap = await getDoc(doc(db, 'config', 'wisdomImages'));
        if (imgSnap.exists()) setImageUrls(imgSnap.data());
      } catch {}
    })();
  }, []);

  const generateOne = async (lesson) => {
    setGenerating(lesson.id);
    setStatus(s => ({ ...s, [lesson.id]: 'generating TTS...' }));
    try {
      const text = lesson.body.replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{grandfather\}/g, 'Dada ji').replace(/\{grandmother\}/g, 'Nani ma').replace(/\{pet\}/g, 'their puppy');
      const res = await fetch('/api/generate-wisdom-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 4096) }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [lesson.id]: `TTS failed (${res.status})` })); setGenerating(null); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [lesson.id]: 'uploading...' }));
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-audio/${lesson.id}.opus`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/ogg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [lesson.id]: audioUrl }, { merge: true });
      setUrls(u => ({ ...u, [lesson.id]: audioUrl }));
      setStatus(s => ({ ...s, [lesson.id]: 'done' }));
    } catch (e) { setStatus(s => ({ ...s, [lesson.id]: e.message })); }
    setGenerating(null);
  };

  const generateImage = async (lesson) => {
    setGenerating(lesson.id + '_img');
    setStatus(s => ({ ...s, [lesson.id]: 'generating image...' }));
    try {
      const prompt = lesson.imagePrompt || `A children's storybook scene from "${lesson.title}"`;
      const res = await fetch('/api/generate-story-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [lesson.id]: `Image failed (${res.status})` })); setGenerating(null); return; }
      const { imageUrl: dalleUrl } = await res.json();
      setStatus(s => ({ ...s, [lesson.id]: 'uploading image...' }));
      const imgRes = await fetch(dalleUrl);
      const imgBlob = await imgRes.blob();
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-images/${lesson.id}.png`);
      await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
      const permanentUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [lesson.id]: permanentUrl }, { merge: true });
      setImageUrls(u => ({ ...u, [lesson.id]: permanentUrl }));
      setStatus(s => ({ ...s, [lesson.id]: 'done' }));
    } catch (e) { setStatus(s => ({ ...s, [lesson.id]: e.message })); }
    setGenerating(null);
  };

  const saveStory = async (story) => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase.js');
      if (!db) return;
      await setDoc(doc(db, 'wisdomStories', story.id), {
        ...story,
        _isCustom: undefined,
        updatedAt: Date.now(),
      });
      setLessons(prev => {
        const exists = prev.find(l => l.id === story.id);
        if (exists) return prev.map(l => l.id === story.id ? { ...story, _isCustom: true } : l);
        return [{ ...story, _isCustom: true }, ...prev];
      });
      setEditing(null);
      setAddingNew(false);
    } catch (e) { alert('Save failed: ' + e.message); }
  };

  const deleteStory = async (id) => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase.js');
      if (!db) return;
      await deleteDoc(doc(db, 'wisdomStories', id));
      setLessons(prev => prev.filter(l => l.id !== id));
    } catch (e) { alert('Delete failed: ' + e.message); }
  };

  const TRADITION_OPTIONS = ['all', 'hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'jewish'];
  const THEME_OPTIONS = ['all', 'compassion-animals', 'courage', 'wisdom', 'honesty', 'sharing', 'humility', 'forgiveness'];

  const filtered = lessons.filter(l => {
    if (filterTradition !== 'all' && l.tradition !== filterTradition) return false;
    if (filterTheme !== 'all' && l.theme !== filterTheme) return false;
    return true;
  });

  const cached = lessons.filter(l => urls[l.id]).length;
  const imagesCached = lessons.filter(l => imageUrls[l.id]).length;

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between rounded-2xl bg-[#1a1a28] p-4">
        <div>
          <h3 className="text-sm font-bold text-[#f5f0e8]">Wisdom Story Lab</h3>
          <p className="text-xs text-[#6e6a63]">{lessons.length} stories · Audio: {cached} · Images: {imagesCached}</p>
        </div>
        <button onClick={() => { setAddingNew(true); setEditing(null); setNewStory({ id: '', tradition: 'hindu', theme: 'compassion-animals', title: '', body: '', source: '', durationMinutes: 8, imagePrompt: '' }); }}
          className="rounded-full bg-[#7ad9a1] px-4 py-2 text-xs font-bold text-[#0a0a0f]">
          + Add Story
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select value={filterTradition} onChange={e => setFilterTradition(e.target.value)}
          className="rounded-lg bg-[#1a1a28] px-3 py-1.5 text-xs font-bold text-[#f0a500] outline-none ring-1 ring-white/10">
          {TRADITION_OPTIONS.map(t => <option key={t} value={t}>{t === 'all' ? 'All Beliefs' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
          className="rounded-lg bg-[#1a1a28] px-3 py-1.5 text-xs font-bold text-[#539df5] outline-none ring-1 ring-white/10">
          {THEME_OPTIONS.map(t => <option key={t} value={t}>{t === 'all' ? 'All Themes' : t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
        </select>
        <span className="rounded-lg bg-[#1a1a28] px-3 py-1.5 text-xs text-[#6e6a63]">{filtered.length} shown</span>
      </div>

      {/* Add / Edit form */}
      {(addingNew || editing) && (() => {
        const story = addingNew ? newStory : lessons.find(l => l.id === editing);
        if (!story) return null;
        const update = (field, val) => {
          if (addingNew) setNewStory(prev => ({ ...prev, [field]: val }));
          else setLessons(prev => prev.map(l => l.id === editing ? { ...l, [field]: val } : l));
        };
        return (
          <div className="rounded-2xl bg-[#1a1a28] p-4 space-y-3 ring-1 ring-[#f0a500]/30">
            <h4 className="text-xs font-bold text-[#f0a500]">{addingNew ? 'New Story' : 'Edit Story'}</h4>
            {addingNew && (
              <input value={story.id} onChange={e => update('id', e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                placeholder="story_id (snake_case)" className="w-full rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10" />
            )}
            <input value={story.title} onChange={e => update('title', e.target.value)}
              placeholder="Story Title" className="w-full rounded-lg bg-[#0a0a0f] px-3 py-2 text-sm font-bold text-[#f5f0e8] outline-none ring-1 ring-white/10" />
            <div className="flex gap-2">
              <select value={story.tradition} onChange={e => update('tradition', e.target.value)}
                className="flex-1 rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10">
                {TRADITION_OPTIONS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={story.theme} onChange={e => update('theme', e.target.value)}
                className="flex-1 rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10">
                {THEME_OPTIONS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={story.durationMinutes} onChange={e => update('durationMinutes', parseInt(e.target.value) || 5)}
                className="w-16 rounded-lg bg-[#0a0a0f] px-2 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10" placeholder="min" />
            </div>
            <input value={story.source || ''} onChange={e => update('source', e.target.value)}
              placeholder="Source (e.g. Islamic tradition · Hadith)" className="w-full rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10" />
            <textarea value={story.body} onChange={e => update('body', e.target.value)}
              placeholder="Story body (use {childName}, {sibling}, {grandfather}, {grandmother}, {pet} as placeholders)" rows={10}
              className="w-full rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10 leading-relaxed" />
            <input value={story.imagePrompt || ''} onChange={e => update('imagePrompt', e.target.value)}
              placeholder="DALL-E image prompt (optional — auto-generated if empty)" className="w-full rounded-lg bg-[#0a0a0f] px-3 py-2 text-xs text-[#f5f0e8] outline-none ring-1 ring-white/10" />
            <div className="flex gap-2">
              <button onClick={() => saveStory(addingNew ? newStory : story)}
                disabled={!story.id || !story.title || !story.body}
                className="rounded-full bg-[#7ad9a1] px-4 py-2 text-xs font-bold text-[#0a0a0f] disabled:opacity-50">
                {addingNew ? 'Create & Publish' : 'Save Changes'}
              </button>
              <button onClick={() => { setAddingNew(false); setEditing(null); }}
                className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-[#6e6a63]">Cancel</button>
            </div>
          </div>
        );
      })()}

      {/* Story list */}
      <div className="space-y-2">
        {filtered.map(l => (
          <div key={l.id} className="flex items-start gap-3 rounded-xl bg-[#1a1a28] p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0f]">
              {imageUrls[l.id] ? (
                <img src={imageUrls[l.id]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-lg opacity-30">🖼️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-[#f5f0e8] truncate flex-1">{l.title}</div>
                {l._isCustom && <span className="text-[8px] rounded bg-[#f0a500]/20 text-[#f0a500] px-1.5 py-0.5 font-bold">CUSTOM</span>}
              </div>
              <div className="text-[10px] text-[#6e6a63]">{l.tradition} · {l.theme} · {l.durationMinutes}m</div>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                {urls[l.id] ? (
                  <span className="text-[9px] font-bold text-[#7ad9a1]">Audio ✓</span>
                ) : (
                  <button onClick={() => generateOne(l)} disabled={!!generating}
                    className="text-[9px] font-bold text-[#f0a500] disabled:opacity-50">
                    {generating === l.id ? '...' : 'Gen Audio'}
                  </button>
                )}
                <span className="text-[#6e6a63]">·</span>
                {imageUrls[l.id] ? (
                  <span className="text-[9px] font-bold text-[#7ad9a1]">Image ✓</span>
                ) : (
                  <button onClick={() => generateImage(l)} disabled={!!generating}
                    className="text-[9px] font-bold text-[#539df5] disabled:opacity-50">
                    {generating === l.id + '_img' ? '...' : 'Gen Image'}
                  </button>
                )}
                <span className="text-[#6e6a63]">·</span>
                <button onClick={() => { setEditing(l.id); setAddingNew(false); }}
                  className="text-[9px] font-bold text-[#e8b4ff]">Edit</button>
                {l._isCustom && (
                  <>
                    <span className="text-[#6e6a63]">·</span>
                    <button onClick={() => deleteStory(l.id)}
                      className="text-[9px] font-bold text-red-400">Delete</button>
                  </>
                )}
              </div>
              {status[l.id] && status[l.id] !== 'done' && (
                <div className="mt-0.5 text-[9px] text-[#6e6a63]">{status[l.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
