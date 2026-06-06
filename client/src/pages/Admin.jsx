import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { COLLECTIONS as COLLECTIONS_DATA } from '../data/collections.js';
import { SERIES as SERIES_DATA } from '../data/series.js';
import { RELIGIONS, COUNTRIES, VALUES, DURATIONS, LANGUAGES } from '../utils/constants.js';
import { CULTURAL_LESSONS as ALL_LESSONS_DATA } from '../data/culturalLessons.js';
import { SERIES as ALL_SERIES_DATA } from '../data/series.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';
import { GA_MEASUREMENT_ID, db } from '../lib/firebase.js';
import { doc, setDoc, collection, getDocs, query, orderBy, limit, startAfter, where, updateDoc, getCountFromServer } from 'firebase/firestore';

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
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="text-gold text-lg font-bold">Loading admin…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-base text-center">
        <div className="mb-4 text-5xl">🔒</div>
        <h1 className="font-display text-2xl font-bold text-ink">Access denied</h1>
        <p className="mt-2 text-sm text-ink-muted">You are not an admin.</p>
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
    { key: 'overview', label: 'Dashboard', icon: '📊' },
    { key: 'userstories', label: 'User Stories', icon: '🌙' },
    { key: 'storylab', label: 'Story Studio', icon: '🧪' },
    { key: 'feedback', label: 'Creators', icon: '✍️' },
    { key: 'tasks', label: 'Tasks', icon: '📋' },
    { key: 'expenses', label: 'Expenses', icon: '💰' },
    { key: 'outreach', label: 'Outreach', icon: '📧' },
    { key: 'users', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-ink">
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-bg-base/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <span className="font-display text-lg font-bold text-gold">{APP_NAME}</span>
              <span className="ml-2 rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-ink-muted sm:block">{user?.email}</span>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink"
            >
              ← Back to app
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ─── TABS ─── */}
        <div className="mb-6 grid grid-cols-4 gap-1 rounded-2xl bg-bg-elevated p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] sm:text-sm sm:flex-row sm:gap-2 sm:px-5 font-bold transition ${
                tab === t.key
                  ? 'bg-[#f0a500] text-[#0f0f17]'
                  : 'text-ink-muted hover:text-ink'
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
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Subscriptions
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.tiers).map(([tier, count]) => {
                    const pct = stats.totalKids > 0 ? Math.round((count / stats.totalKids) * 100) : 0;
                    return (
                      <div key={tier}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-bold capitalize text-ink">{tier}</span>
                          <span className="text-ink-muted">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-bg-base">
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

              {/* Beliefs — Users + Stories */}
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Beliefs
                </h3>
                <div className="space-y-2">
                  {(() => {
                    // Count stories per tradition from actual data
                    const storyCounts = {};
                    ALL_LESSONS_DATA.forEach(l => { storyCounts[l.tradition] = (storyCounts[l.tradition] || 0) + 1; });
                    ALL_SERIES_DATA.forEach(s => {
                      const t = s.tradition || 'universal';
                      storyCounts[t] = (storyCounts[t] || 0) + (s.episodes?.length || 0);
                    });

                    // Merge user belief counts + story counts
                    const allKeys = new Set([...Object.keys(stats.beliefs), ...Object.keys(storyCounts)]);
                    // Filter out invalid belief keys (e.g. 'secular', 'chinese' with 0 stories)
                    const validKeys = RELIGIONS.map(r => r.key);
                    return [...allKeys]
                      .filter(key => validKeys.includes(key) && ((storyCounts[key] || 0) > 0 || (stats.beliefs[key] || 0) > 0))
                      .sort((a, b) => (storyCounts[b] || 0) - (storyCounts[a] || 0))
                      .map(key => {
                        const r = RELIGIONS.find(x => x.key === key);
                        const userCount = stats.beliefs[key] || 0;
                        const storyCount = storyCounts[key] || 0;
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-ink">
                              <span>{r?.icon || '🌍'}</span>
                              {r?.label || key}
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="text-[10px] text-ink-dim">{userCount} users</span>
                              <span className="text-sm font-bold text-gold">{storyCount} stories</span>
                            </span>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>

              {/* Account statuses */}
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Account status
                </h3>
                <div className="space-y-3">
                  {['active', 'paused', 'blocked'].map((s) => {
                    const count = allUsers.filter(
                      (u) => (u.accountStatus || 'active') === s
                    ).length;
                    return (
                      <div key={s} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm capitalize text-ink">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: STATUS_COLORS[s] }}
                          />
                          {s}
                        </span>
                        <span className="text-sm font-bold text-gold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Geo / Regions */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Countries */}
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
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
                            <span className="flex items-center gap-2 text-ink">
                              <span>{c?.flag || '🌍'}</span>
                              {c?.label || key}
                            </span>
                            <span className="text-ink-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-bg-base">
                            <div className="h-full rounded-full bg-[#f0a500]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  {Object.keys(stats.countries || {}).length === 0 && (
                    <p className="text-sm text-ink-dim">No country data yet.</p>
                  )}
                </div>
              </div>

              {/* Timezones */}
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  🕐 Timezones
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.tzCities || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([tz, count]) => (
                      <div key={tz} className="flex items-center justify-between">
                        <span className="truncate text-sm text-ink">{tz}</span>
                        <span className="shrink-0 text-sm font-bold text-gold">{count}</span>
                      </div>
                    ))}
                  {Object.keys(stats.tzCities || {}).length === 0 && (
                    <p className="text-sm text-ink-dim">No timezone data yet.</p>
                  )}
                </div>
              </div>

              {/* Browser languages */}
              <div className="rounded-2xl bg-bg-elevated p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  🗣️ Browser languages
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.languages || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, count]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="text-sm text-ink">{lang}</span>
                        <span className="text-sm font-bold text-gold">{count}</span>
                      </div>
                    ))}
                  {Object.keys(stats.languages || {}).length === 0 && (
                    <p className="text-sm text-ink-dim">No language data yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Google Analytics — deployment timeline + reports */}
            {GA_MEASUREMENT_ID && (
              <div className="space-y-4">
                {/* Deployment timeline */}
                <div className="rounded-2xl bg-bg-elevated p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
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
                        <span className="shrink-0 text-xs text-ink-dim">{m.date}</span>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="shrink-0 text-xs text-ink-muted">{m.event}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-[#f0a500]/10 p-3 ring-1 ring-gold/20">
                    <div className="text-xs font-bold text-gold">Key metrics to track post-launch</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3 text-[11px] text-ink-muted">
                      <div>📈 <strong className="text-ink">Sessions</strong> — are people visiting?</div>
                      <div>⏱️ <strong className="text-ink">Avg session</strong> — are they staying?</div>
                      <div>🔁 <strong className="text-ink">Returning users</strong> — are they coming back?</div>
                      <div>🌍 <strong className="text-ink">Countries</strong> — where are they from?</div>
                      <div>📱 <strong className="text-ink">Device split</strong> — mobile vs desktop?</div>
                      <div>🚪 <strong className="text-ink">Bounce rate</strong> — leaving immediately?</div>
                    </div>
                  </div>
                </div>

                {/* GA report links */}
                <div className="rounded-2xl bg-bg-elevated p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
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
                        className="flex items-center gap-3 rounded-xl bg-bg-base p-3 transition hover:bg-white/[0.03]"
                      >
                        <span className="text-xl">{r.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-ink">{r.title}</div>
                          <div className="text-[10px] text-ink-dim">{r.sub}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-ink-dim">
                    ID: {GA_MEASUREMENT_ID} · Domain: mysleepytale.com · Tracking since Apr 15, 2026
                  </p>
                </div>
              </div>
            )}
          {/* ═══ USERS TABLE (inside Dashboard) ═══ */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-ink mb-4">Users</h3>
          <div>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or kid name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-bg-elevated px-5 py-3 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold"
              />
            </div>

            {/* Full data table */}
            <div className="overflow-x-auto rounded-2xl bg-bg-elevated">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
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
                      <td colSpan={10} className="px-4 py-8 text-center text-ink-dim">
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
                          <td className="px-4 py-3 text-ink-dim">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f0a500]/15">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <span className="text-sm">👤</span>
                                )}
                              </div>
                              <span className="font-bold text-ink">
                                {u.displayName || u.email?.split('@')[0] || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                            {u.email || '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-xs font-bold text-gold">
                              {kids.length}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-muted">{stories}</td>
                          <td className="px-4 py-3 text-center text-xs text-ink-muted">{Math.round(minutes)}</td>
                          <td className="px-4 py-3 text-center">
                            {tiers.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold capitalize text-gold"
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
                          <td className="px-4 py-3 text-xs text-ink-dim">{lastActive}</td>
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
                                className="rounded-lg bg-white/5 px-2 py-1 text-[9px] font-bold text-ink-muted"
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
                    className="mt-4 rounded-2xl bg-bg-elevated p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink">
                        {u.displayName || u.email} — full details
                      </h3>
                      <button
                        onClick={() => setExpandedUser(null)}
                        className="text-xs text-ink-dim hover:text-ink"
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

                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
                      Kid profiles ({(u.profiles || []).length})
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(u.profiles || []).map((kid, i) => (
                        <div key={i} className="rounded-xl bg-bg-base p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-ink">
                              {kid.childName || `Kid ${i + 1}`}
                            </span>
                            <select
                              value={kid.tier || 'free'}
                              onChange={(e) => setUserTier(u.uid, i, e.target.value)}
                              className="rounded-lg bg-bg-elevated px-2 py-1 text-[10px] font-bold text-gold outline-none"
                            >
                              <option value="free">Free</option>
                              <option value="family">Family</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                          <div className="space-y-1 text-[11px] text-ink-dim">
                            <div>Age: <span className="text-ink-muted">{kid.age || '?'}</span></div>
                            {kid.motherName && <div>Mother: <span className="text-ink-muted">{kid.motherName}</span></div>}
                            {kid.fatherName && <div>Father: <span className="text-ink-muted">{kid.fatherName}</span></div>}
                            {kid.sibling && <div>Sibling: <span className="text-ink-muted">{kid.sibling}</span></div>}
                            {kid.grandfather && <div>Grandfather: <span className="text-ink-muted">{kid.grandfather}</span></div>}
                            {kid.grandmother && <div>Grandmother: <span className="text-ink-muted">{kid.grandmother}</span></div>}
                            {kid.pet && <div>Pet: <span className="text-ink-muted">{kid.pet}</span></div>}
                            <div>Language: <span className="text-ink-muted">{kid.language || 'English'}</span></div>
                            <div>Beliefs: <span className="text-ink-muted">{(kid.beliefs || []).map(b => RELIGIONS.find(r => r.key === b)?.label || b).join(', ') || 'None'}</span></div>
                            <div>Characters: <span className="text-ink-muted">{kid.characters?.length || 0}</span></div>
                            {kid.characters && kid.characters.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {kid.characters.map((c, ci) => (
                                  <span key={ci} className="rounded-full bg-bg-elevated px-2 py-0.5 text-[9px] text-ink-muted">
                                    {c.emoji || '👤'} {c.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="mt-1">
                              Auto-play: <span className="text-ink-muted">{kid.autoplayNext ? 'On' : 'Off'}</span> ·
                              Sleep sounds: <span className="text-ink-muted">{kid.whiteNoiseEnabled ? 'On' : 'Off'}</span> ·
                              Dialogue fade: <span className="text-ink-muted">{kid.dialogueFade ? 'On' : 'Off'}</span>
                            </div>
                            <div>
                              Cross-culture: <span className="text-ink-muted">{kid.showCrossCulture ? 'On' : 'Off'}</span> ·
                              Only my beliefs: <span className="text-ink-muted">{kid.onlyMyTradition ? 'On' : 'Off'}</span>
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
          </div>
          </div>
        )}

        {/* ═══ FEEDBACK ═══ */}
        {tab === 'feedback' && <CuratorSubmissionsPanel />}

        {/* ═══ SETTINGS ═══ */}
        {tab === 'users' && (
          <>
            <AdminManagement />
            <div className="mt-6" />
            {/* Team management — inline in Settings */}
            <div className="rounded-2xl bg-bg-elevated p-6 mb-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gold">Team Members</h3>
              <p className="text-[10px] text-ink-dim mb-4">Team members can access /my-tasks to view and update their daily tasks.</p>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Email address..." value={newTeamEmail} onChange={(e) => setNewTeamEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold" />
                <select value={newTeamRole} onChange={(e) => setNewTeamRole(e.target.value)}
                  className="rounded-xl bg-bg-base px-3 py-3 text-sm text-ink outline-none ring-1 ring-white/5">
                  <option value="tester">Tester</option>
                  <option value="marketing">Marketing</option>
                  <option value="content">Content</option>
                  <option value="dev">Developer</option>
                  <option value="advisor">Advisor</option>
                  <option value="ambassador">Ambassador</option>
                </select>
                <button onClick={async () => {
                  if (!newTeamEmail.trim()) return;
                  await addTeamMember(newTeamEmail, newTeamRole);
                  fetch('/api/team-welcome', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newTeamEmail.trim().toLowerCase(), role: newTeamRole }) }).catch(() => {});
                  setNewTeamEmail('');
                  alert(`Added ${newTeamEmail} — welcome email sent!`);
                }} className="rounded-xl bg-[#f0a500] px-4 py-3 text-sm font-bold text-[#0f0f17]">Add</button>
              </div>
              {team.length > 0 && (
                <div className="space-y-2">
                  {team.map(m => (
                    <div key={m.email} className="flex items-center justify-between rounded-xl bg-bg-base px-4 py-3 ring-1 ring-white/5">
                      <div>
                        <span className="text-sm text-ink">{m.email}</span>
                        <span className="ml-2 text-[10px] text-ink-dim">{m.role}</span>
                      </div>
                      <button onClick={() => removeTeamMember(m.email)} className="text-[10px] text-[#f3727f] hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <StoryLab showSettingsTabs />
          </>
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
            <div className="rounded-2xl bg-bg-elevated p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
                Cost estimation basis
              </h3>
              <div className="grid gap-4 text-xs text-ink-muted sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-bg-base p-3">
                  <div className="text-[9px] uppercase tracking-wider text-ink-dim">ElevenLabs Starter</div>
                  <div className="mt-1 font-bold text-ink">CA$0.42 / 1K chars</div>
                  <div className="text-[9px] text-ink-dim">~CA$11.34 / 30 min story</div>
                </div>
                <div className="rounded-xl bg-bg-base p-3">
                  <div className="text-[9px] uppercase tracking-wider text-ink-dim">ElevenLabs Scale</div>
                  <div className="mt-1 font-bold text-ink">CA$0.25 / 1K chars</div>
                  <div className="text-[9px] text-ink-dim">~CA$6.75 / 30 min story</div>
                </div>
                <div className="rounded-xl bg-bg-base p-3">
                  <div className="text-[9px] uppercase tracking-wider text-ink-dim">Claude Sonnet (story gen)</div>
                  <div className="mt-1 font-bold text-ink">CA$0.03 / story</div>
                  <div className="text-[9px] text-ink-dim">~4K tokens in, ~2K out</div>
                </div>
                <div className="rounded-xl bg-bg-base p-3">
                  <div className="text-[9px] uppercase tracking-wider text-ink-dim">Blended per minute</div>
                  <div className="mt-1 font-bold text-gold">~CA$0.25 / min</div>
                  <div className="text-[9px] text-ink-dim">Scale plan + Claude</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-bg-base p-3">
                <div className="text-[9px] uppercase tracking-wider text-ink-dim">ElevenLabs plan comparison (CAD)</div>
                <table className="mt-2 w-full text-xs">
                  <thead>
                    <tr className="text-[9px] uppercase tracking-wider text-ink-dim">
                      <th className="pb-1 text-left">Plan</th>
                      <th className="pb-1 text-right">Monthly</th>
                      <th className="pb-1 text-right">Characters</th>
                      <th className="pb-1 text-right">Per 1K chars</th>
                      <th className="pb-1 text-right">~Stories / mo</th>
                    </tr>
                  </thead>
                  <tbody className="text-ink-muted">
                    <tr><td>Free</td><td className="text-right">CA$0</td><td className="text-right">10K</td><td className="text-right">—</td><td className="text-right">~0.4</td></tr>
                    <tr><td>Starter</td><td className="text-right">CA$7</td><td className="text-right">30K</td><td className="text-right">CA$0.42</td><td className="text-right">~1</td></tr>
                    <tr><td>Creator</td><td className="text-right">CA$31</td><td className="text-right">100K</td><td className="text-right">CA$0.31</td><td className="text-right">~4</td></tr>
                    <tr><td>Pro</td><td className="text-right">CA$137</td><td className="text-right">500K</td><td className="text-right">CA$0.27</td><td className="text-right">~18</td></tr>
                    <tr className="font-bold text-gold"><td>Scale</td><td className="text-right">CA$415</td><td className="text-right">2M</td><td className="text-right">CA$0.21</td><td className="text-right">~74</td></tr>
                    <tr><td>Business</td><td className="text-right">Custom</td><td className="text-right">Custom</td><td className="text-right">~CA$0.14</td><td className="text-right">—</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-ink-dim">
                All prices in CAD (1 USD ≈ 1.38 CAD). Actual costs depend on voice quality tier,
                story caching (repeat plays = zero cost), and pre-written cultural stories (zero API cost).
              </p>
            </div>

            {/* Per-user usage table */}
            <div className="rounded-2xl bg-bg-elevated">
              <div className="border-b border-white/5 px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Per-user usage
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
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
                            <td className="px-4 py-3 text-ink-dim">{idx + 1}</td>
                            <td className="px-4 py-3 font-bold text-ink">
                              {u.displayName || u.email?.split('@')[0] || '—'}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-ink-muted">{u.email || '—'}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-full bg-[#f0a500]/15 px-2 py-0.5 text-xs font-bold text-gold">
                                {stories}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-ink-muted">{Math.round(minutes)}</td>
                            <td className="px-4 py-3 text-center text-xs font-bold text-gold">CA${cost}</td>
                            <td className="px-4 py-3 text-xs text-ink-dim">{lastStory}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold capitalize text-gold">
                                {tier}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isPaid ? (
                                <span className="text-[#7ad9a1]">✓</span>
                              ) : (
                                <span className="text-ink-dim">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10 font-bold">
                      <td className="px-4 py-3" colSpan={3}>
                        <span className="text-xs uppercase tracking-wider text-ink-muted">Total</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gold">{totalStoriesAll}</td>
                      <td className="px-4 py-3 text-center text-ink-muted">{Math.round(totalMinutesAll)}</td>
                      <td className="px-4 py-3 text-center text-gold">CA${estimatedCost}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pricing helper */}
            <div className="rounded-2xl bg-bg-elevated p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
                Pricing decision helper
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-bg-base p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim">If avg = 10 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-ink">
                    CA${(10 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-ink-dim">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#7ad9a1]">
                    CA$4.99/mo → CA${(4.99 - 10 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-bg-base p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim">If avg = 30 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-ink">
                    CA${(30 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-ink-dim">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#ffa42b]">
                    CA$4.99/mo → CA${(4.99 - 30 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-bg-base p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim">If avg = 60 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-ink">
                    CA${(60 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-ink-dim">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#f3727f]">
                    CA$9.99/mo → CA${(9.99 - 60 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-bg-base p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim">If avg = 120 min / mo</div>
                  <div className="mt-1 text-lg font-bold text-ink">
                    CA${(120 * COST_PER_MINUTE_CAD).toFixed(2)} <span className="text-xs text-ink-dim">/ user</span>
                  </div>
                  <div className="mt-1 text-xs text-[#f3727f]">
                    CA$14.99/mo → CA${(14.99 - 120 * COST_PER_MINUTE_CAD).toFixed(2)} margin
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-ink-dim">
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
            <div className="rounded-2xl bg-bg-elevated p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                Add team member
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={newTeamEmail}
                    onChange={(e) => setNewTeamEmail(e.target.value)}
                    className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold"
                  />
                  {newTeamEmail.length >= 2 && (() => {
                    const q = newTeamEmail.toLowerCase();
                    const matches = allUsers.filter(u =>
                      (u.email || '').toLowerCase().includes(q) ||
                      (u.displayName || '').toLowerCase().includes(q)
                    ).slice(0, 5);
                    if (matches.length === 0 || (matches.length === 1 && matches[0].email === newTeamEmail)) return null;
                    return (
                      <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl bg-bg-elevated ring-1 ring-white/10 overflow-hidden">
                        {matches.map(u => (
                          <button key={u.uid} onClick={() => setNewTeamEmail(u.email || '')}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition">
                            {u.photoURL ? (
                              <img src={u.photoURL} className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-[#f0a500]/15 grid place-items-center text-[10px]">👤</div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-ink">{u.displayName || u.email}</div>
                              <div className="text-[10px] text-ink-dim">{u.email}</div>
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
                  className="rounded-xl bg-bg-base px-3 py-3 text-sm text-gold outline-none ring-1 ring-white/5"
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
              <p className="mt-2 text-[11px] text-ink-dim">
                Testers get full app access for QA. Investors can see the invest page. Marketing gets analytics + sharing.
                You can pause or stop access anytime.
              </p>
            </div>

            {/* Team list */}
            <div className="overflow-x-auto rounded-2xl bg-bg-elevated">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
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
                      <td colSpan={6} className="px-4 py-8 text-center text-ink-dim">
                        No team members yet.
                      </td>
                    </tr>
                  ) : (
                    team.map((t) => {
                      const statusColor = t.status === 'active' ? '#7ad9a1' : t.status === 'paused' ? '#ffa42b' : '#f3727f';
                      return (
                        <tr key={t.email} className="border-b border-white/5">
                          <td className="px-4 py-3 font-mono text-xs text-ink">{t.email}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                              t.role === 'tester' ? 'bg-[#539df5]/15 text-[#539df5]'
                                : t.role === 'investor' ? 'bg-[#f0a500]/15 text-gold'
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
                          <td className="px-4 py-3 text-xs text-ink-muted">{t.addedBy?.split('@')[0] || '—'}</td>
                          <td className="px-4 py-3 text-xs text-ink-dim">
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
                                className="rounded-lg bg-white/5 px-2 py-1 text-[9px] font-bold text-ink-dim"
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
            <div className="rounded-2xl bg-bg-elevated p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
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
              <p className="mb-4 text-xs text-ink-dim">
                Use for newsletters, promotions, and updates. One email per line.
              </p>
              <div className="max-h-96 overflow-y-auto rounded-xl bg-bg-base p-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-ink-dim">
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
                            <td className="py-2 pr-3 text-ink-dim">{i + 1}</td>
                            <td className="py-2 pr-3 font-mono text-xs text-ink">
                              {u.email}
                            </td>
                            <td className="py-2 pr-3 text-ink-muted">
                              {u.displayName || '—'}
                            </td>
                            <td className="py-2 pr-3 text-ink-muted">{kids || '—'}</td>
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
                className="mt-4 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink"
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
              <div className="rounded-2xl bg-bg-elevated p-4 text-center">
                <div className="text-2xl font-bold text-gold">{investors.filter((i) => i.status === 'confirmed').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">Confirmed</div>
              </div>
              <div className="rounded-2xl bg-bg-elevated p-4 text-center">
                <div className="text-2xl font-bold text-[#ffa42b]">{investors.filter((i) => i.status !== 'confirmed' && i.status !== 'rejected').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">Pending</div>
              </div>
              <div className="rounded-2xl bg-bg-elevated p-4 text-center">
                <div className="text-2xl font-bold text-gold">
                  CA${investors.filter((i) => i.status === 'confirmed').reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">Confirmed raised</div>
              </div>
            </div>

            <div className="space-y-3">
              {investors.length === 0 ? (
                <div className="rounded-2xl bg-bg-elevated p-8 text-center text-ink-dim">No investors yet.</div>
              ) : investors.map((inv) => {
                const statusColor = inv.status === 'confirmed' ? '#7ad9a1' : inv.status === 'rejected' ? '#f3727f' : '#ffa42b';
                return (
                  <div key={inv.id} className="rounded-2xl bg-bg-elevated p-4">
                    <div className="flex items-center gap-3">
                      {inv.photoURL ? (
                        <img src={inv.photoURL} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
                      ) : <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f0a500]/15 text-lg">👤</div>}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink">{inv.displayName || '—'}</span>
                          <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ background: `${statusColor}22`, color: statusColor }}>
                            {inv.status || 'pledged'}
                          </span>
                        </div>
                        <div className="truncate text-xs text-ink-muted">{inv.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ink">CA${inv.amount?.toLocaleString()}</div>
                        <div className="text-[10px] text-gold">{((inv.amount || 0) / 1000000 * 100).toFixed(4)}% SAFE</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-ink-dim">
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
                      <div className="mt-2 text-[11px] italic text-ink-dim">"{inv.message}"</div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {tab === 'admins' && (
          <div className="max-w-xl space-y-4">
            <div className="rounded-2xl bg-bg-elevated p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                Admin users
              </h3>
              <div className="space-y-2">
                {adminEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-xl bg-bg-base px-4 py-3"
                  >
                    <span className="font-mono text-sm text-ink">{email}</span>
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
                  className="flex-1 rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold"
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

        {/* ═══ USER STORIES ═══ */}
        {tab === 'userstories' && <UserStoriesAdmin />}

        {/* ═══ STORY LAB ═══ */}
        {tab === 'storylab' && <StoryLab />}

        {/* ═══ TASK BOARD ═══ */}
        {tab === 'tasks' && <TaskBoard team={team} adminEmails={adminEmails} />}

        {/* ═══ EXPENSES ═══ */}
        {tab === 'expenses' && <ExpenseTracker />}

        {/* ═══ OUTREACH DATABASE ═══ */}
        {tab === 'outreach' && <OutreachDatabase />}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6 text-center text-[10px] uppercase tracking-[0.2em] text-ink-dim">
        {APP_NAME} Admin · v{APP_VERSION}
      </footer>
    </div>
  );
}

// ─── Sub-components ───

function BigStat({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-bg-elevated p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="text-3xl font-bold text-gold">{value}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
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
    <motion.div layout className="overflow-hidden rounded-2xl bg-bg-elevated">
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
            <span className="truncate text-sm font-bold text-ink">
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
          <div className="truncate text-xs text-ink-muted">{u.email || 'No email'}</div>
        </div>

        <div className="hidden items-center gap-6 text-xs text-ink-muted lg:flex">
          <span>{kids.length} {kids.length === 1 ? 'kid' : 'kids'}</span>
          <span>{lastActive}</span>
        </div>

        <span className={`text-ink-muted transition ${expanded ? 'rotate-180' : ''}`}>▾</span>
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
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-dim">
                Kid profiles
              </h4>
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {kids.length === 0 ? (
                  <p className="text-xs text-ink-dim">No profiles yet.</p>
                ) : (
                  kids.map((kid, i) => (
                    <div key={i} className="rounded-xl bg-bg-base p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink">
                          {kid.childName || `Kid ${i + 1}`}
                        </span>
                        <select
                          value={kid.tier || 'free'}
                          onChange={(e) => setUserTier(u.uid, i, e.target.value)}
                          className="rounded-lg bg-bg-elevated px-2 py-1 text-[10px] font-bold text-gold outline-none"
                        >
                          <option value="free">Free</option>
                          <option value="family">Family</option>
                          <option value="annual">Annual</option>
                        </select>
                      </div>
                      <div className="mt-1 text-[10px] text-ink-dim">
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
    <div className="rounded-lg bg-bg-base px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-ink-dim">{label}</div>
      <div
        className={`mt-0.5 truncate text-xs text-ink ${mono ? 'font-mono' : ''}`}
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

// ═══ USER STORIES ADMIN ═══
function UserStoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [status, setStatus] = useState({});

  const ELEVEN_VOICES = [
    { key: 'george', label: 'George' }, { key: 'lily', label: 'Lily' },
    { key: 'sarah', label: 'Sarah' }, { key: 'brian', label: 'Brian' },
    { key: 'river', label: 'River' }, { key: 'jessica', label: 'Jessica' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const { collection, getDocs, query, orderBy, limit, doc: fdoc, getDoc } = await import('firebase/firestore');
        const snap = await getDocs(query(collection(db, 'sharedStories'), orderBy('createdAt', 'desc'), limit(200)));
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));

        // Enrich stories with user info for those missing email
        const uidSet = new Set(list.filter(s => !s.generatedByEmail && (s.generatedBy || s.sharedBy)).map(s => s.generatedBy || s.sharedBy));
        const userMap = {};
        for (const uid of uidSet) {
          if (!uid || uid === 'anonymous') continue;
          try {
            const uSnap = await getDoc(fdoc(db, 'users', uid));
            if (uSnap.exists()) { const u = uSnap.data(); userMap[uid] = u.email || u.displayName || uid.slice(0, 8); }
          } catch {}
        }
        list.forEach(s => {
          if (!s.generatedByEmail) {
            const uid = s.generatedBy || s.sharedBy;
            if (uid && userMap[uid]) s.generatedByEmail = userMap[uid];
          }
        });

        setStories(list);
      } catch (e) { console.error('Failed to load user stories:', e); }
      setLoading(false);
    })();
  }, []);

  const generateAudio = async (story, voice = 'george') => {
    setGenerating(story.id);
    setStatus(s => ({ ...s, [story.id]: `11Labs: ${voice}...` }));
    try {
      const text = (story.text || '').replace(/\{childName\}/g, 'little one').slice(0, 10000);
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [story.id]: `Failed (${res.status})` })); setGenerating(null); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [story.id]: 'uploading...' }));
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `user-story-audio/${story.id}.mp3`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(db, 'sharedStories', story.id), { audioUrl }, { merge: true });
      setStories(prev => prev.map(s => s.id === story.id ? { ...s, audioUrl } : s));
      setStatus(s => ({ ...s, [story.id]: `✓ ${voice}` }));
    } catch (e) { setStatus(s => ({ ...s, [story.id]: e.message })); }
    setGenerating(null);
  };

  const generateImage = async (story) => {
    setGenerating(story.id + '_img');
    setStatus(s => ({ ...s, [story.id]: 'generating image...' }));
    try {
      const firstLine = (story.text || '').split('\n').find(l => l.trim()) || '';
      const prompt = `Children's storybook illustration, warm watercolor, Pixar-meets-Ghibli. Scene from "${story.title}": ${firstLine.slice(0, 150)}`;
      const res = await fetch(`${API_BASE}/api/generate-story-image`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [story.id]: `Failed (${res.status})` })); setGenerating(null); return; }
      const data = await res.json();
      let imgBlob;
      if (data.imageBase64) {
        const bytes = Uint8Array.from(atob(data.imageBase64), c => c.charCodeAt(0));
        imgBlob = new Blob([bytes], { type: 'image/png' });
      } else if (data.imageUrl) {
        const imgRes = await fetch(data.imageUrl);
        imgBlob = await imgRes.blob();
      }
      if (!imgBlob) { setStatus(s => ({ ...s, [story.id]: 'No image returned' })); setGenerating(null); return; }
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `user-story-images/${story.id}.png`);
      await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
      const coverImage = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(db, 'sharedStories', story.id), { coverImage }, { merge: true });
      setStories(prev => prev.map(s => s.id === story.id ? { ...s, coverImage } : s));
      setStatus(s => ({ ...s, [story.id]: '✓ image' }));
    } catch (e) { setStatus(s => ({ ...s, [story.id]: e.message })); }
    setGenerating(null);
  };

  const deleteStory = async (storyId) => {
    if (!confirm('Delete this shared story?')) return;
    try {
      const { doc: fdoc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(fdoc(db, 'sharedStories', storyId));
      setStories(prev => prev.filter(s => s.id !== storyId));
    } catch (e) { alert('Delete failed: ' + e.message); }
  };

  // Group stories by user
  const userGroups = useMemo(() => {
    const groups = {};
    stories.forEach(s => {
      const key = s.generatedByEmail || s.generatedBy || s.sharedBy || 'anonymous';
      if (!groups[key]) groups[key] = { email: s.generatedByEmail || key, name: s.generatedByName || s.childName || '', stories: [] };
      if (s.generatedByName && !groups[key].name) groups[key].name = s.generatedByName;
      if (s.childName && !groups[key].childName) groups[key].childName = s.childName;
      groups[key].stories.push(s);
    });
    return Object.values(groups).sort((a, b) => b.stories.length - a.stories.length);
  }, [stories]);

  const [expandedUser, setExpandedUser] = useState(null);
  const [editingStory, setEditingStory] = useState(null);

  if (loading) return <div className="text-center py-12 text-ink-dim">Loading user stories...</div>;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-ink">{stories.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Total Stories</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-gold">{userGroups.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Users</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-[#7ad9a1]">{stories.filter(s => s.audioUrl).length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">With Audio</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-[#539df5]">{stories.filter(s => s.coverImage).length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">With Image</div>
        </div>
      </div>

      {/* Fix orphaned stories */}
      {stories.some(s => !s.generatedByEmail) && (
        <button
          onClick={async () => {
            const { doc: fdoc, updateDoc } = await import('firebase/firestore');
            let fixed = 0;
            for (const s of stories) {
              if (!s.generatedByEmail) {
                await updateDoc(fdoc(db, 'sharedStories', s.id), {
                  generatedByEmail: 'prateekyadav2010@gmail.com',
                  generatedByName: 'Prateek Yadav',
                  childName: s.childName || 'Veda',
                });
                fixed++;
              }
            }
            alert(`Fixed ${fixed} stories. Reload to see changes.`);
            window.location.reload();
          }}
          className="w-full rounded-xl bg-[#f0a500]/10 p-3 text-[10px] font-bold text-gold ring-1 ring-gold/20"
        >
          ⚠️ {stories.filter(s => !s.generatedByEmail).length} stories missing user info — tap to assign to prateekyadav2010@gmail.com
        </button>
      )}

      {/* User cards — tap to expand */}
      {userGroups.map(group => (
        <div key={group.email} className="rounded-xl bg-bg-elevated ring-1 ring-white/5 overflow-hidden">
          {/* User header */}
          <button
            onClick={() => setExpandedUser(expandedUser === group.email ? null : group.email)}
            className="w-full flex items-center gap-3 p-4 text-left transition hover:bg-white/3"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-lg">
              {group.name ? group.name[0]?.toUpperCase() : '👤'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-ink">{group.email}</h3>
              <p className="text-[10px] text-ink-dim">
                {group.childName && `Child: ${group.childName} · `}{group.stories.length} stories
              </p>
            </div>
            <span className="text-ink-dim text-sm">{expandedUser === group.email ? '▲' : '▼'}</span>
          </button>

          {/* Expanded: show all stories for this user */}
          {expandedUser === group.email && (
            <div className="border-t border-white/5 p-3 space-y-3">
              {group.stories.map(story => (
                <div key={story.id} className="rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
          <div className="flex items-start gap-3">
            {story.coverImage ? (
              <img src={story.coverImage} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-bg-base text-2xl">🌙</div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-ink">{story.title}</h3>
              <p className="text-[10px] text-ink-dim mt-0.5">
                {story.estimatedMinutes} min · {story.value} · {story.language}
                {story.childName && ` · for ${story.childName}`}
              </p>
              <p className="text-[10px] text-ink-dim">
                {story.generatedByEmail || story.generatedByName || story.sharedBy?.slice(0, 8) || 'anonymous'}
                {' · '}{story.createdAt ? new Date(story.createdAt).toLocaleString() : story.sharedAt ? new Date(story.sharedAt).toLocaleString() : ''}
              </p>
              {story.whisper && (
                <p className="text-[10px] text-gold/70 mt-0.5">💬 "{story.whisper}"</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {story.audioUrl ? (
                  <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Audio ✓</span>
                ) : (
                  <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No audio</span>
                )}
                {story.coverImage ? (
                  <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Image ✓</span>
                ) : (
                  <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No image</span>
                )}
              </div>
              {status[story.id] && <div className="text-[9px] text-gold mt-1">{status[story.id]}</div>}
            </div>
          </div>

          {/* Story text — editable */}
          {editingStory === story.id ? (
            <div className="mt-2 space-y-2">
              <input
                defaultValue={story.title}
                id={`edit-title-${story.id}`}
                className="w-full rounded-lg bg-bg-base px-3 py-2 text-xs font-bold text-ink outline-none ring-1 ring-gold/30"
                placeholder="Title"
              />
              <textarea
                defaultValue={story.text}
                id={`edit-text-${story.id}`}
                rows={8}
                className="w-full rounded-lg bg-bg-base px-3 py-2 text-[10px] text-ink-muted leading-relaxed outline-none ring-1 ring-gold/30 resize-y"
              />
              <div className="flex gap-2">
                <button onClick={async () => {
                  const newTitle = document.getElementById(`edit-title-${story.id}`).value;
                  const newText = document.getElementById(`edit-text-${story.id}`).value;
                  try {
                    const { doc: fdoc, updateDoc } = await import('firebase/firestore');
                    await updateDoc(fdoc(db, 'sharedStories', story.id), { title: newTitle, text: newText, wordCount: newText.split(/\s+/).length });
                    setStories(prev => prev.map(s => s.id === story.id ? { ...s, title: newTitle, text: newText } : s));
                    setEditingStory(null);
                    setStatus(s => ({ ...s, [story.id]: '✓ saved' }));
                  } catch (e) { setStatus(s => ({ ...s, [story.id]: 'Save failed: ' + e.message })); }
                }} className="rounded-lg bg-[#7ad9a1]/10 px-4 py-1.5 text-[10px] font-bold text-[#7ad9a1]">
                  💾 Save
                </button>
                <button onClick={() => setEditingStory(null)} className="rounded-lg bg-white/5 px-4 py-1.5 text-[10px] font-bold text-ink-dim">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 rounded-lg bg-bg-base p-3 max-h-24 overflow-y-auto">
              <p className="text-[10px] text-ink-muted leading-relaxed whitespace-pre-wrap">{(story.text || '').slice(0, 500)}...</p>
            </div>
          )}

          {/* Audio preview */}
          {story.audioUrl && <audio controls preload="none" src={story.audioUrl} className="w-full h-8 mt-2" style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.7 }} />}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <select defaultValue="george" id={`uvoice-${story.id}`}
              className="rounded-lg bg-bg-base px-2 py-1.5 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-[#7ad9a1]/20">
              {ELEVEN_VOICES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
            </select>
            <button onClick={() => generateAudio(story, document.getElementById(`uvoice-${story.id}`)?.value || 'george')}
              disabled={!!generating}
              className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1] disabled:opacity-30">
              {generating === story.id ? '...' : '⚡ Audio'}
            </button>
            <button onClick={() => generateImage(story)} disabled={!!generating}
              className="rounded-lg bg-[#539df5]/10 px-3 py-1.5 text-[10px] font-bold text-[#539df5] disabled:opacity-30">
              {generating === story.id + '_img' ? '...' : '🖼️ Image'}
            </button>
            <button onClick={() => setEditingStory(editingStory === story.id ? null : story.id)}
              className="rounded-lg bg-[#f0a500]/10 px-3 py-1.5 text-[10px] font-bold text-gold">
              {editingStory === story.id ? '✕ Close' : '✏️ Edit'}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(`https://mysleepytale.com/player?storyId=${story.id}`); setStatus(s => ({ ...s, [story.id]: 'Link copied!' })); }}
              className="rounded-lg bg-[#f0a500]/10 px-3 py-1.5 text-[10px] font-bold text-gold">
              🔗 Copy Link
            </button>
            <button onClick={() => deleteStory(story.id)}
              className="ml-auto rounded-lg bg-red-400/10 px-3 py-1.5 text-[10px] font-bold text-red-400">
              🗑️ Delete
            </button>
          </div>
        </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { doc: fdoc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(fdoc(db, 'config', 'app'));
        if (snap.exists()) setAdmins(snap.data().adminEmails || []);
      } catch {}
    })();
  }, []);

  const addAdmin = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || admins.includes(email)) return;
    setSaving(true);
    try {
      const next = [...admins, email];
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(db, 'config', 'app'), { adminEmails: next }, { merge: true });
      setAdmins(next);
      setNewEmail('');
    } catch (e) { alert('Failed: ' + e.message); }
    setSaving(false);
  };

  const removeAdmin = async (email) => {
    if (!confirm(`Remove ${email} as admin?`)) return;
    const next = admins.filter(e => e !== email);
    try {
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(db, 'config', 'app'), { adminEmails: next }, { merge: true });
      setAdmins(next);
    } catch (e) { alert('Failed: ' + e.message); }
  };

  return (
    <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
      <h3 className="text-sm font-bold text-ink mb-3">👑 Admin Users</h3>
      <div className="space-y-2 mb-3">
        {admins.map(email => (
          <div key={email} className="flex items-center justify-between rounded-lg bg-bg-base px-3 py-2">
            <span className="text-xs text-ink">{email}</span>
            <button onClick={() => removeAdmin(email)} className="text-[10px] text-red-400/60 hover:text-red-400">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@example.com"
          className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/10 placeholder:text-ink-dim"
          onKeyDown={(e) => e.key === 'Enter' && addAdmin()}
        />
        <button onClick={addAdmin} disabled={saving} className="rounded-lg bg-[#7ad9a1]/10 px-4 py-2 text-[10px] font-bold text-[#7ad9a1] disabled:opacity-30">
          {saving ? '...' : '+ Add'}
        </button>
      </div>
    </div>
  );
}

function StoryLab({ showSettingsTabs }) {
  const [subTab, setSubTab] = useState(showSettingsTabs ? 'rules' : 'wisdom-audio');
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

  const STUDIO_TABS = [
    { key: 'wisdom-audio', label: `Wisdom Stories (${ALL_LESSONS_DATA.length})`, icon: '📖' },
    { key: 'collections', label: 'Collections (48)', icon: '🎬' },
    { key: 'series', label: `Series (${ALL_SERIES_DATA.length})`, icon: '📺' },
  ];

  const SETTINGS_TABS = [
    { key: 'rules', label: 'Global Rules', icon: '🛡️' },
    { key: 'archetypes', label: 'Characters', icon: '👥' },
    { key: 'culture', label: 'Cultural Library', icon: '🌍' },
    { key: 'whispers', label: 'Quick Whispers', icon: '💭' },
    { key: 'ingredients', label: 'Story Ingredients', icon: '🧩' },
    { key: 'values', label: 'Value Delivery', icon: '💡' },
    { key: 'ages', label: 'Age Guides', icon: '🎂' },
    { key: 'voice-feedback', label: 'Voice Feedback', icon: '🎙️' },
  ];

  const SUB_TABS = showSettingsTabs ? SETTINGS_TABS : STUDIO_TABS;

  return (
    <div className="space-y-6">
      {/* Sub-tabs — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SUB_TABS.map((t) => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${subTab === t.key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-bg-elevated text-ink-muted hover:text-ink'}`}
          >{t.icon} {t.label}</button>
        ))}
      </div>

      {saving && <div className="rounded-xl bg-[#f0a500]/10 p-3 text-center text-xs font-bold text-gold">Saving...</div>}
      {lastSaved && <div className="rounded-xl bg-[#7ad9a1]/10 p-3 text-center text-xs font-bold text-[#7ad9a1]">Saved {lastSaved}!</div>}

      {/* ══════ GLOBAL RULES ══════ */}
      {subTab === 'rules' && (
        <div className="rounded-2xl bg-bg-elevated p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Mandatory Rules for ALL stories</h3>
            <button onClick={() => saveAll('globalRules', globalRules)} disabled={saving}
              className="rounded-full bg-[#f0a500] px-4 py-1.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Rules'}
            </button>
          </div>
          <p className="mb-4 text-xs text-ink-dim">These rules are injected into every story generation prompt. Claude will never violate them.</p>
          <div className="space-y-2">
            {globalRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <textarea value={rule} onChange={(e) => {
                  const updated = [...globalRules];
                  updated[i] = e.target.value;
                  setGlobalRules(updated);
                }} rows={2}
                className="flex-1 rounded-xl bg-bg-base px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/10" />
                <button onClick={() => setGlobalRules(globalRules.filter((_, j) => j !== i))}
                  className="mt-1 text-xs text-[#f3727f]">Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => setGlobalRules([...globalRules, ''])}
            className="mt-3 text-xs font-bold text-gold">+ Add rule</button>
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
              <div className="flex items-center justify-center rounded-2xl bg-bg-elevated p-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                  <p className="text-sm text-ink-muted">Generating story with Claude...</p>
                  <p className="mt-2 text-[10px] text-ink-dim">This typically takes 10-15 seconds</p>
                </div>
              </div>
            )}
            {pgResult && (
              <LabCard title={pgResult.title} titleColor>
                <p className="text-xs text-ink-muted">{pgResult.wordCount} words · ~{Math.round(pgResult.wordCount / 130)} min · {pgResult.generatedBy}</p>
                <div className="mt-3 max-h-[50vh] overflow-y-auto rounded-xl bg-bg-base p-4 font-story text-sm leading-relaxed text-ink/80">{pgResult.text}</div>

                {/* Quality rating */}
                <div className="mt-4 rounded-xl bg-bg-base p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-2">Rate this story</div>
                  <div className="flex gap-2 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setPgRating(star)}
                        className={`text-2xl transition ${star <= pgRating ? 'opacity-100' : 'opacity-20'}`}>
                        {star <= pgRating ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="ml-2 self-center text-xs text-ink-muted">
                      {pgRating === 1 ? 'Bad' : pgRating === 2 ? 'Weak' : pgRating === 3 ? 'OK' : pgRating === 4 ? 'Good' : pgRating === 5 ? 'Amazing' : ''}
                    </span>
                  </div>
                  <textarea value={pgNotes} onChange={(e) => setPgNotes(e.target.value)} placeholder="Notes — what worked, what didn't, what to change..."
                    className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold" rows={3} />
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => saveStoryToCache(pgResult)}
                    className="flex-1 rounded-xl bg-[#7ad9a1]/10 py-2.5 text-xs font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20">
                    Save to Cache
                  </button>
                  <button onClick={generateTestStory} disabled={pgGenerating}
                    className="flex-1 rounded-xl bg-[#f0a500]/10 py-2.5 text-xs font-bold text-gold hover:bg-[#f0a500]/20">
                    Regenerate
                  </button>
                </div>
              </LabCard>
            )}
            {!pgGenerating && !pgResult && (
              <div className="flex items-center justify-center rounded-2xl bg-bg-elevated p-12">
                <div className="text-center">
                  <div className="mb-3 text-4xl">🧪</div>
                  <p className="text-sm text-ink-muted">Configure and generate a test story</p>
                  <p className="mt-1 text-xs text-ink-dim">Test different parameter combos. Rate results. Save the good ones.</p>
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
                <div key={arch.key} className="rounded-xl bg-bg-base p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{arch.key === 'grandfather' ? '👴' : arch.key === 'grandmother' ? '👵' : arch.key === 'mother' ? '👩' : arch.key === 'father' ? '👨' : arch.key === 'sibling' ? '🧒' : arch.key === 'uncle' ? '🧔' : arch.key === 'aunt' ? '👩' : '🐶'}</span>
                      <div>
                        <div className="font-bold text-ink capitalize">{arch.key}</div>
                        <div className="text-xs text-ink-muted">Called: {arch.callOptions.slice(0, 4).join(', ')}{arch.callOptions.length > 4 ? ` +${arch.callOptions.length - 4}` : ''}</div>
                        <div className="mt-1 text-[10px] text-ink-dim truncate max-w-md">{arch.traits}</div>
                      </div>
                    </div>
                    <button onClick={() => setEditingArch(editingArch === i ? null : i)} className="rounded-lg bg-bg-elevated px-3 py-1.5 text-xs font-bold text-gold">{editingArch === i ? 'Close' : 'Edit'}</button>
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
              className="mt-3 w-full rounded-lg border border-dashed border-white/10 py-3 text-xs font-bold text-ink-muted">+ Add New Character Type (visible to all users in Characters section)</button>
            <button onClick={() => saveAll('archetypes', archetypes)} disabled={saving} className="mt-3 w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Archetypes</button>
            <p className="mt-2 text-[10px] text-ink-dim text-center">Custom character types added here will appear in every user's Characters section for selection</p>
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
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${editingCulture === key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-bg-base text-ink-muted'}`}>
                    {r?.icon || '🌍'} {r?.label || key}
                  </button>
                );
              })}
            </div>
            {editingCulture && culturalRefs[editingCulture] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 rounded-xl bg-bg-base p-4">
                {Object.entries(culturalRefs[editingCulture]).map(([category, items]) => (
                  <div key={category}>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">
                      {category === 'foods' ? '🍲 Foods' : category === 'festivals' ? '🎉 Festivals' : category === 'traditions' ? '🪷 Traditions' : category === 'places' ? '📍 Places' : category === 'music' ? '🎵 Music & Sounds' : category === 'games' ? '🎮 Games' : category === 'clothing' ? '👗 Clothing' : '👋 Greetings'}
                    </label>
                    <textarea value={Array.isArray(items) ? items.join(', ') : items}
                      onChange={(e) => {
                        const updated = { ...culturalRefs, [editingCulture]: { ...culturalRefs[editingCulture], [category]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } };
                        setCulturalRefs(updated);
                      }}
                      rows={2} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
                  </div>
                ))}
                <button onClick={() => saveAll('culturalRefs', culturalRefs)} disabled={saving} className="w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save {RELIGIONS.find((r) => r.key === editingCulture)?.label || editingCulture}</button>
              </motion.div>
            )}
            {!editingCulture && (
              <p className="text-center text-xs text-ink-dim py-6">Select a belief system above to edit its cultural references</p>
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
                <span className="text-[10px] font-bold uppercase text-ink-dim">Belief:</span>
                <select value={qwBelief} onChange={(e) => setQwBelief(e.target.value)} className="rounded-lg bg-bg-base px-3 py-1.5 text-xs text-ink outline-none ring-1 ring-white/5">
                  {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-ink-dim">Country:</span>
                <select value={qwCountry} onChange={(e) => setQwCountry(e.target.value)} className="rounded-lg bg-bg-base px-3 py-1.5 text-xs text-ink outline-none ring-1 ring-white/5">
                  {COUNTRIES.map((c) => <option key={c.key} value={c.key}>{c.flag} {c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-bg-base p-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-3">
                6 Quick Whispers for {RELIGIONS.find((r) => r.key === qwBelief)?.icon} {RELIGIONS.find((r) => r.key === qwBelief)?.label} · {COUNTRIES.find((c) => c.key === qwCountry)?.flag} {COUNTRIES.find((c) => c.key === qwCountry)?.label}
              </div>
              <div className="space-y-2">
                {[0,1,2,3,4,5].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gold w-5">{idx + 1}</span>
                    <input
                      value={current[idx] || ''}
                      onChange={(e) => updateWhisper(idx, e.target.value)}
                      placeholder={`Quick whisper ${idx + 1}...`}
                      className="flex-1 rounded-lg bg-bg-elevated px-3 py-2.5 text-sm text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-bg-base p-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-2">Preview — what parents will see</div>
              <div className="flex flex-wrap gap-2">
                {current.filter(Boolean).map((w, i) => (
                  <span key={i} className="rounded-full bg-bg-elevated px-3 py-1.5 text-[11px] text-ink-muted ring-1 ring-white/5">{w}</span>
                ))}
                {current.filter(Boolean).length === 0 && <span className="text-xs text-ink-dim">No whispers set — will use default suggestions</span>}
              </div>
            </div>

            {/* Saved combos overview */}
            {Object.keys(quickWhispers).length > 0 && (
              <div className="rounded-xl bg-bg-base p-4 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-2">All configured combos</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quickWhispers).filter(([, v]) => v.some(Boolean)).map(([k]) => {
                    const [b, c] = k.split('_');
                    const br = RELIGIONS.find((r) => r.key === b);
                    const cr = COUNTRIES.find((x) => x.key === c);
                    return (
                      <button key={k} onClick={() => { setQwBelief(b); setQwCountry(c); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${k === key ? 'bg-[#f0a500] text-[#0f0f17]' : 'bg-bg-elevated text-ink-muted'}`}>
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
            <p className="mt-2 text-[10px] text-ink-dim text-center">Changes go live immediately for users matching this belief + country</p>
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
              <div key={i} className="mb-2 rounded-lg bg-bg-base p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-[#f0a500]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-gold">{opener.type}</span>
                  <span className="text-[9px] text-ink-dim">Ages {opener.ages}</span>
                  <button onClick={() => { const u = storyOpeners.filter((_, j) => j !== i); setStoryOpeners(u); }} className="ml-auto text-[10px] text-[#f3727f]">remove</button>
                </div>
                <textarea value={opener.text} onChange={(e) => { const u = [...storyOpeners]; u[i] = { ...opener, text: e.target.value }; setStoryOpeners(u); }}
                  rows={2} className="w-full rounded bg-bg-elevated px-2 py-1.5 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
              </div>
            ))}
            <button onClick={() => setStoryOpeners([...storyOpeners, { type: 'new', text: '', ages: '3-10' }])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-ink-muted">+ Add opener</button>
            <button onClick={() => saveAll('storyOpeners', storyOpeners)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Openers</button>
          </LabCard>

          {/* Plot Twists */}
          <LabCard title="Plot Twists" subtitle="Surprise moments that make stories memorable">
            {plotTwists.map((twist, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input value={twist} onChange={(e) => { const u = [...plotTwists]; u[i] = e.target.value; setPlotTwists(u); }}
                  className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
                <button onClick={() => setPlotTwists(plotTwists.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setPlotTwists([...plotTwists, ''])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-ink-muted">+ Add twist</button>
            <button onClick={() => saveAll('plotTwists', plotTwists)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Twists</button>
          </LabCard>

          {/* Wind-downs */}
          <LabCard title="Wind-Down Patterns" subtitle="How stories end — soft, sleepy, warm">
            {windDowns.map((wd, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <textarea value={wd} onChange={(e) => { const u = [...windDowns]; u[i] = e.target.value; setWindDowns(u); }}
                  rows={2} className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
                <button onClick={() => setWindDowns(windDowns.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setWindDowns([...windDowns, ''])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-ink-muted">+ Add wind-down</button>
            <button onClick={() => saveAll('windDowns', windDowns)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Wind-Downs</button>
          </LabCard>

          {/* Sound Effects */}
          <LabCard title="Sound Effects Library" subtitle="Fun sounds Claude weaves into the narrative">
            {soundFx.map((fx, i) => (
              <div key={i} className="mb-2 rounded-lg bg-bg-base p-3 flex items-center gap-3">
                <span className="text-lg">{fx.emoji}</span>
                <div className="flex-1 space-y-1">
                  <input value={fx.sound} onChange={(e) => { const u = [...soundFx]; u[i] = { ...fx, sound: e.target.value }; setSoundFx(u); }} placeholder="Sound"
                    className="w-full rounded bg-bg-elevated px-2 py-1 text-xs font-bold text-gold outline-none ring-1 ring-white/5" />
                  <input value={fx.when} onChange={(e) => { const u = [...soundFx]; u[i] = { ...fx, when: e.target.value }; setSoundFx(u); }} placeholder="When to use"
                    className="w-full rounded bg-bg-elevated px-2 py-1 text-[10px] text-ink-muted outline-none ring-1 ring-white/5" />
                </div>
                <button onClick={() => setSoundFx(soundFx.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
              </div>
            ))}
            <button onClick={() => setSoundFx([...soundFx, { sound: '', when: '', emoji: '🔊' }])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-ink-muted">+ Add sound</button>
            <button onClick={() => saveAll('soundFx', soundFx)} disabled={saving} className="mt-2 w-full rounded-xl bg-[#f0a500] py-2.5 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Sounds</button>
          </LabCard>

          {/* Story Settings */}
          <LabCard title="World Settings" subtitle="Magical places where stories happen" colSpan>
            <div className="grid gap-3 sm:grid-cols-2">
              {settings.map((s, i) => (
                <div key={i} className="rounded-lg bg-bg-base p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input value={s.emoji} onChange={(e) => { const u = [...settings]; u[i] = { ...s, emoji: e.target.value }; setSettings(u); }} className="w-10 rounded bg-bg-elevated px-1 py-0.5 text-center text-lg outline-none" />
                    <input value={s.name} onChange={(e) => { const u = [...settings]; u[i] = { ...s, name: e.target.value }; setSettings(u); }} className="flex-1 rounded bg-bg-elevated px-2 py-1 text-sm font-bold text-ink outline-none ring-1 ring-white/5" />
                    <span className="text-[9px] text-ink-dim">{s.ages}</span>
                    <button onClick={() => setSettings(settings.filter((_, j) => j !== i))} className="text-xs text-[#f3727f]">x</button>
                  </div>
                  <textarea value={s.description} onChange={(e) => { const u = [...settings]; u[i] = { ...s, description: e.target.value }; setSettings(u); }}
                    rows={2} className="w-full rounded bg-bg-elevated px-2 py-1 text-[11px] text-ink-muted outline-none ring-1 ring-white/5 focus:ring-gold" />
                </div>
              ))}
            </div>
            <button onClick={() => setSettings([...settings, { name: 'New Setting', description: '', emoji: '✨', ages: '3-10' }])} className="mt-2 w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-ink-muted">+ Add setting</button>
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
                <div key={vd.value} className="mb-3 rounded-xl bg-bg-base p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{meta?.emoji}</span>
                    <span className="font-bold text-ink capitalize">{vd.value}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#7ad9a1]">Do this</label>
                      <textarea value={vd.doThis} onChange={(e) => { const u = [...valueDelivery]; u[i] = { ...vd, doThis: e.target.value }; setValueDelivery(u); }}
                        rows={4} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-[#7ad9a1]/20 focus:ring-[#7ad9a1]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#f3727f]">Not this</label>
                      <textarea value={vd.notThis} onChange={(e) => { const u = [...valueDelivery]; u[i] = { ...vd, notThis: e.target.value }; setValueDelivery(u); }}
                        rows={4} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-[#f3727f]/20 focus:ring-[#f3727f]" />
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
              <div key={ag.range} className="mb-4 rounded-xl bg-bg-base p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-[#f0a500]/10 px-3 py-1 text-sm font-bold text-gold">{ag.range} years</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">Vocabulary & Language</label>
                    <textarea value={ag.vocab} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, vocab: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">Humor Style</label>
                    <textarea value={ag.humor} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, humor: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">Themes & Topics</label>
                    <textarea value={ag.themes} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, themes: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" /></div>
                  <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">Attention Span & Pacing</label>
                    <textarea value={ag.attention} onChange={(e) => { const u = [...ageGuides]; u[i] = { ...ag, attention: e.target.value }; setAgeGuides(u); }} rows={3} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/5 focus:ring-gold" /></div>
                </div>
              </div>
            ))}
            <button onClick={() => saveAll('ageGuides', ageGuides)} disabled={saving} className="w-full rounded-xl bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] disabled:opacity-50">Save Age Guides</button>
          </LabCard>
        </div>
      )}

      {/* ══════ WISDOM AUDIO ══════ */}
      {subTab === 'wisdom-audio' && <WisdomAudioPanel />}
      {subTab === 'collections' && <CollectionsPanel />}
      {subTab === 'series' && <SeriesPanel />}

      {/* ══════ VOICE FEEDBACK ══════ */}
      {subTab === 'voice-feedback' && <VoiceFeedbackPanel />}

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
                <div className="rounded-lg bg-bg-base p-3"><div className="text-xl font-bold text-gold">{cachedStories.length}</div><div className="text-[9px] text-ink-dim">Total</div></div>
                <div className="rounded-lg bg-bg-base p-3"><div className="text-xl font-bold text-[#7ad9a1]">{cachedStories.filter((s) => s.rating >= 4).length}</div><div className="text-[9px] text-ink-dim">4-5 stars</div></div>
                <div className="rounded-lg bg-bg-base p-3"><div className="text-xl font-bold text-gold">{[...new Set(cachedStories.map((s) => s.value))].length}</div><div className="text-[9px] text-ink-dim">Values</div></div>
                <div className="rounded-lg bg-bg-base p-3"><div className="text-xl font-bold text-gold">{[...new Set(cachedStories.map((s) => s.beliefs))].length}</div><div className="text-[9px] text-ink-dim">Beliefs</div></div>
              </div>
            )}
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-ink-dim">Belief:</span>
                <select value={cacheFilterBelief} onChange={(e) => setCacheFilterBelief(e.target.value)} className="rounded-lg bg-bg-base px-3 py-1.5 text-xs text-ink outline-none ring-1 ring-white/5">
                  <option value="all">All beliefs</option>
                  {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-ink-dim">Country:</span>
                <select value={cacheFilterCountry} onChange={(e) => setCacheFilterCountry(e.target.value)} className="rounded-lg bg-bg-base px-3 py-1.5 text-xs text-ink outline-none ring-1 ring-white/5">
                  <option value="all">All countries</option>
                  {COUNTRIES.map((c) => <option key={c.key} value={c.key}>{c.flag} {c.label}</option>)}
                </select>
              </div>
              <span className="self-center text-xs text-ink-muted">{filtered.length} stories</span>
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
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">Story text (use {'{childName}'} for personalization)</label>
                <textarea value={manualStory.text} onChange={(e) => setManualStory({ ...manualStory, text: e.target.value })}
                  rows={12} placeholder="Once upon a time, {childName} found something magical..."
                  className="w-full rounded-lg bg-bg-base px-4 py-3 font-story text-sm leading-relaxed text-ink placeholder-[#6e6a63] outline-none ring-1 ring-white/5 focus:ring-gold" />
                <div className="mt-1 text-right text-[10px] text-ink-dim">{manualStory.text.split(/\s+/).filter(Boolean).length} words</div>
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
            <div className="flex items-center justify-center rounded-2xl bg-bg-elevated p-12">
              <div className="text-center"><div className="mb-3 text-4xl">📦</div><p className="text-sm text-ink-muted">{cachedStories.length === 0 ? 'No stories yet' : 'No stories match filters'}</p><p className="mt-1 text-xs text-ink-dim">Generate in Playground or write manually</p></div>
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
    <div className={`rounded-2xl bg-bg-elevated p-6 ${colSpan ? 'sm:col-span-2' : ''}`}>
      {title && <h3 className={`mb-1 text-sm font-bold ${titleColor ? 'font-display text-lg text-gold' : 'text-ink'}`}>{title}</h3>}
      {subtitle && <p className="mb-4 text-xs text-ink-dim">{subtitle}</p>}
      {children}
    </div>
  );
}

function LabField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
    </div>
  );
}

function CachedStoryCard({ story, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const meta = VALUES.find((v) => v.key === story.value);
  return (
    <div className="rounded-xl bg-bg-elevated p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{meta?.emoji || '📖'}</span>
          <div className="min-w-0">
            <div className="font-bold text-ink truncate">{story.title}</div>
            <div className="text-xs text-ink-muted">{story.childName} · {story.age}y · {story.wordCount}w · {story.duration}min · {meta?.label} · {story.language}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-ink-dim">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : ''}</span>
              {story.rating > 0 && <span className="text-[10px] text-gold">{'★'.repeat(story.rating)}{'☆'.repeat(5 - story.rating)}</span>}
              {story.notes && <span className="text-[10px] text-ink-dim truncate max-w-[200px]">{story.notes}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="rounded-lg bg-bg-base px-3 py-1.5 text-xs font-bold text-gold">{expanded ? 'Hide' : 'Read'}</button>
          <button onClick={() => { if (confirm('Delete?')) onDelete(); }} className="rounded-lg bg-[#f3727f]/10 px-3 py-1.5 text-xs font-bold text-[#f3727f]">Del</button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 max-h-[40vh] overflow-y-auto rounded-lg bg-bg-base p-4 font-story text-sm leading-relaxed text-ink/80">{story.text}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LabInput({ label, value, onChange, type = 'text', full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-bg-base px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5 focus:ring-gold" />
    </div>
  );
}

function LabSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-dim">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-bg-base px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
    </div>
  );
}

function WisdomAudioPanel() {
  const [urls, setUrls] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [status, setStatus] = useState({});
  const [generating, setGenerating] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [filterTradition, setFilterTradition] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [editing, setEditing] = useState(null); // lesson id being edited
  const [addingNew, setAddingNew] = useState(false);
  const [search, setSearch] = useState('');
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
        setDataReady(true);
      } catch { setDataReady(true); }
    })();
  }, []);

  const [voiceSelections, setVoiceSelections] = useState({}); // { lessonId: { voice, model } }
  const VOICE_OPTIONS = ['sage', 'nova', 'coral', 'ash', 'echo', 'fable', 'onyx', 'shimmer', 'alloy', 'ballad', 'verse', 'marin', 'cedar'];
  const MODEL_OPTIONS = ['tts-1', 'tts-1-hd', 'gpt-4o-mini-tts'];

  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  const bulkAbort = useRef(false);

  const getVoiceFor = (id) => voiceSelections[id]?.voice || 'sage';
  const getModelFor = (id) => voiceSelections[id]?.model || 'tts-1';

  const generateOne = async (lesson) => {
    setGenerating(lesson.id);
    const voice = getVoiceFor(lesson.id);
    const model = getModelFor(lesson.id);
    setStatus(s => ({ ...s, [lesson.id]: `generating ${voice}/${model}...` }));
    try {
      const text = lesson.body.replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{grandfather\}/g, 'Dada ji').replace(/\{grandmother\}/g, 'Nani ma').replace(/\{pet\}/g, 'their puppy');
      const res = await fetch(`${API_BASE}/api/generate-wisdom-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 4096), voice, model }),
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
      // Use standardized prompt framework
      let prompt;
      try {
        const { getStoryPrompt } = await import('../utils/imagePrompts.js');
        prompt = getStoryPrompt(lesson.id, 'thumbnail');
      } catch {
        prompt = lesson.imagePrompt || `A children's storybook scene from "${lesson.title}"`;
      }
      const res = await fetch(`${API_BASE}/api/generate-story-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [lesson.id]: `Image failed (${res.status})` })); setGenerating(null); return; }
      const data = await res.json();
      setStatus(s => ({ ...s, [lesson.id]: 'uploading image...' }));
      let imgBlob;
      if (data.imageBase64) {
        const bytes = Uint8Array.from(atob(data.imageBase64), c => c.charCodeAt(0));
        imgBlob = new Blob([bytes], { type: 'image/png' });
      } else if (data.imageUrl) {
        const imgRes = await fetch(data.imageUrl);
        imgBlob = await imgRes.blob();
      } else { setStatus(s => ({ ...s, [lesson.id]: 'No image data' })); setGenerating(null); return; }
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

  const bulkGenerate = async (type) => {
    bulkAbort.current = false;
    setBulkRunning(true);
    const targets = filtered.filter(l =>
      type === 'audio' ? !urls[l.id] : type === 'image' ? !imageUrls[l.id] : (!urls[l.id] || !imageUrls[l.id])
    );
    for (let i = 0; i < targets.length; i++) {
      if (bulkAbort.current) { setBulkProgress('Stopped'); break; }
      const l = targets[i];
      if (type === 'all' || type === 'audio') {
        if (!urls[l.id]) {
          setBulkProgress(`Audio ${i + 1}/${targets.length}: ${l.title}`);
          await generateOne(l);
          await new Promise(r => setTimeout(r, 500));
        }
      }
      if (bulkAbort.current) { setBulkProgress('Stopped'); break; }
      if (type === 'all' || type === 'image') {
        if (!imageUrls[l.id]) {
          setBulkProgress(`Image ${i + 1}/${targets.length}: ${l.title}`);
          await generateImage(l);
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }
    if (!bulkAbort.current) setBulkProgress(`Done! ${targets.length} stories processed`);
    setBulkRunning(false);
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

  const TRADITION_OPTIONS = [{ key: 'all', label: 'All Beliefs', icon: '' }, ...RELIGIONS];
  const THEME_OPTIONS = ['all', 'compassion-animals', 'courage', 'wisdom', 'honesty', 'sharing', 'humility', 'forgiveness'];

  const filtered = lessons.filter(l => {
    if (filterTradition !== 'all' && l.tradition !== filterTradition) return false;
    if (filterTheme !== 'all' && l.theme !== filterTheme) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!l.title?.toLowerCase().includes(q) && !l.id?.toLowerCase().includes(q) && !l.source?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const cached = lessons.filter(l => urls[l.id]).length;
  const imagesCached = lessons.filter(l => imageUrls[l.id]).length;

  return (
    <div className="space-y-5">
      {/* ── Dashboard Header ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-ink">{lessons.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Total Stories</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className={`text-2xl font-bold ${dataReady ? 'text-[#7ad9a1]' : 'text-gold animate-pulse'}`}>{dataReady ? cached : '...'}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Audio Ready</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className={`text-2xl font-bold ${dataReady ? 'text-[#539df5]' : 'text-gold animate-pulse'}`}>{dataReady ? imagesCached : '...'}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Images Ready</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className={`text-2xl font-bold ${dataReady ? 'text-gold' : 'text-gold animate-pulse'}`}>{dataReady ? lessons.length - Math.min(cached, imagesCached) : '...'}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Incomplete</div>
        </div>
      </div>

      {/* ── Search + Add ── */}
      <div className="flex items-center gap-3 rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, id, or source..."
          className="flex-1 rounded-lg bg-bg-base px-4 py-2 text-xs text-ink outline-none ring-1 ring-white/10 placeholder:text-ink-dim" />
        <span className="text-xs text-ink-dim shrink-0">{filtered.length} stories</span>
        <button onClick={() => { setAddingNew(true); setEditing(null); setNewStory({ id: '', tradition: 'hindu', theme: 'compassion-animals', title: '', body: '', source: '', durationMinutes: 8, imagePrompt: '' }); }}
          className="shrink-0 rounded-lg bg-[#7ad9a1] px-4 py-2 text-xs font-bold text-[#0a0a0f]">
          + Add Story
        </button>
      </div>

      {/* ── Bulk Generate (OpenAI) ── */}
      <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-dim">Bulk Generate Missing</span>
          <span className="text-xs text-ink-dim">{filtered.length} stories in view</span>
        </div>

        {/* Missing counts */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-gold/5 p-2 text-center ring-1 ring-gold/10">
            <div className="text-lg font-bold text-gold">{filtered.filter(l => !urls[l.id]).length}</div>
            <div className="text-[8px] text-ink-dim">Missing Audio</div>
          </div>
          <div className="rounded-lg bg-info/5 p-2 text-center ring-1 ring-info/10">
            <div className="text-lg font-bold text-info">{filtered.filter(l => !imageUrls[l.id]).length}</div>
            <div className="text-[8px] text-ink-dim">Missing Images</div>
          </div>
          <div className="rounded-lg bg-negative/5 p-2 text-center ring-1 ring-negative/10">
            <div className="text-lg font-bold text-negative">{filtered.filter(l => !urls[l.id] || !imageUrls[l.id]).length}</div>
            <div className="text-[8px] text-ink-dim">Total Incomplete</div>
          </div>
        </div>

        {/* Generate buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => bulkGenerate('audio')} disabled={bulkRunning || !!generating || filtered.filter(l => !urls[l.id]).length === 0}
            className="flex-1 rounded-lg bg-gold/10 px-4 py-2.5 text-xs font-bold text-gold hover:bg-gold/20 disabled:opacity-30 transition">
            🔊 Generate {filtered.filter(l => !urls[l.id]).length} Missing Audio
          </button>
          <button onClick={() => bulkGenerate('image')} disabled={bulkRunning || !!generating || filtered.filter(l => !imageUrls[l.id]).length === 0}
            className="flex-1 rounded-lg bg-info/10 px-4 py-2.5 text-xs font-bold text-info hover:bg-info/20 disabled:opacity-30 transition">
            🖼️ Generate {filtered.filter(l => !imageUrls[l.id]).length} Missing Images
          </button>
        </div>
        <button onClick={() => bulkGenerate('all')} disabled={bulkRunning || !!generating || filtered.filter(l => !urls[l.id] || !imageUrls[l.id]).length === 0}
          className="w-full rounded-lg bg-[#7ad9a1]/10 px-4 py-2.5 text-xs font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20 disabled:opacity-30 transition">
          ⚡ Generate All Missing (Audio + Images)
        </button>
        {/* Progress + Stop */}
        {(bulkRunning || bulkProgress) && (
          <div className="flex items-center gap-3 rounded-lg bg-bg-card p-3 ring-1 ring-white/5">
            {bulkRunning && <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold shrink-0" />}
            <span className="text-[11px] text-gold truncate flex-1">{bulkProgress}</span>
            {bulkRunning && (
              <button onClick={() => { bulkAbort.current = true; }}
                className="shrink-0 rounded-lg bg-negative/10 px-3 py-1.5 text-[10px] font-bold text-negative hover:bg-negative/20">
                Stop
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ElevenLabs Premium Audio ── */}
      <ElevenLabsPanel filtered={filtered} urls={urls} setUrls={setUrls} generating={generating} setGenerating={setGenerating} setStatus={setStatus} />

      {/* ── Add / Edit form ── */}
      {(addingNew || editing) && (() => {
        const story = addingNew ? newStory : lessons.find(l => l.id === editing);
        if (!story) return null;
        const update = (field, val) => {
          if (addingNew) setNewStory(prev => ({ ...prev, [field]: val }));
          else setLessons(prev => prev.map(l => l.id === editing ? { ...l, [field]: val } : l));
        };
        return (
          <div className="rounded-xl bg-bg-elevated p-5 space-y-3 ring-2 ring-gold/30">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gold">{addingNew ? 'New Story' : `Editing: ${story.title}`}</h4>
              <button onClick={() => { setAddingNew(false); setEditing(null); }}
                className="text-xs text-ink-dim hover:text-ink">✕ Close</button>
            </div>
            {addingNew && (
              <input value={story.id} onChange={e => update('id', e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                placeholder="story_id (snake_case)" className="w-full rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10" />
            )}
            <input value={story.title} onChange={e => update('title', e.target.value)}
              placeholder="Story Title" className="w-full rounded-lg bg-bg-base px-3 py-2.5 text-sm font-bold text-ink outline-none ring-1 ring-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select value={story.tradition} onChange={e => update('tradition', e.target.value)}
                className="rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10">
                {TRADITION_OPTIONS.filter(t => t.key !== 'all').map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
              </select>
              <select value={story.theme} onChange={e => update('theme', e.target.value)}
                className="rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10">
                {THEME_OPTIONS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={story.durationMinutes} onChange={e => update('durationMinutes', parseInt(e.target.value) || 5)}
                className="rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10" placeholder="Duration (min)" />
            </div>
            <input value={story.source || ''} onChange={e => update('source', e.target.value)}
              placeholder="Source (e.g. Islamic tradition · Hadith)" className="w-full rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10" />
            <textarea value={story.body} onChange={e => update('body', e.target.value)}
              placeholder="Story body (use {childName}, {sibling}, {grandfather}, {grandmother}, {pet} as placeholders)" rows={12}
              className="w-full rounded-lg bg-bg-base px-3 py-3 text-sm text-ink outline-none ring-1 ring-white/10 leading-relaxed" />
            <input value={story.imagePrompt || ''} onChange={e => update('imagePrompt', e.target.value)}
              placeholder="DALL-E image prompt (optional)" className="w-full rounded-lg bg-bg-base px-3 py-2.5 text-xs text-ink outline-none ring-1 ring-white/10" />
            <div className="flex gap-2 pt-1">
              <button onClick={() => saveStory(addingNew ? newStory : story)}
                disabled={!story.id || !story.title || !story.body}
                className="rounded-lg bg-[#7ad9a1] px-5 py-2.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-50">
                {addingNew ? 'Create & Publish' : 'Save Changes'}
              </button>
              <button onClick={() => { setAddingNew(false); setEditing(null); }}
                className="rounded-lg bg-white/5 px-5 py-2.5 text-xs font-bold text-ink-dim">Cancel</button>
            </div>
          </div>
        );
      })()}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
        <select value={filterTradition} onChange={e => setFilterTradition(e.target.value)}
          className="flex-1 min-w-[120px] rounded-lg bg-bg-base px-3 py-2 text-xs font-bold text-gold outline-none ring-1 ring-white/10">
          {TRADITION_OPTIONS.map(t => <option key={t.key} value={t.key}>{t.key === 'all' ? '▼ All Beliefs' : t.icon + ' ' + t.label}</option>)}
        </select>
        <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
          className="flex-1 min-w-[120px] rounded-lg bg-bg-base px-3 py-2 text-xs font-bold text-[#539df5] outline-none ring-1 ring-white/10">
          {THEME_OPTIONS.map(t => <option key={t} value={t}>{t === 'all' ? '▼ All Themes' : t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
        </select>
      </div>

      {/* ── Story Cards (mobile-friendly) ── */}
      <div className="space-y-2">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
            {/* Top row: image + title + status badges */}
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg-base">
                {imageUrls[l.id] ? (
                  <img src={imageUrls[l.id]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-lg opacity-30">🖼️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-ink">{l.title}</span>
                  {l._isCustom && <span className="text-[7px] rounded bg-[#f0a500]/20 text-gold px-1 py-0.5 font-bold shrink-0">CUSTOM</span>}
                </div>
                <div className="text-[10px] text-ink-dim truncate mt-0.5">{l.source || l.id}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-ink-muted">{TRADITION_OPTIONS.find(t => t.key === l.tradition)?.icon} {l.tradition}</span>
                  <span className="text-[10px] text-ink-muted">{l.theme?.replace('-', ' ')}</span>
                  {urls[l.id] ? (
                    <span className="inline-flex items-center rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Audio ✓</span>
                  ) : !dataReady ? (
                    <span className="inline-flex items-center rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[8px] font-bold text-gold animate-pulse">Loading...</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No audio</span>
                  )}
                  {imageUrls[l.id] ? (
                    <span className="inline-flex items-center rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Image ✓</span>
                  ) : !dataReady ? (
                    <span className="inline-flex items-center rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[8px] font-bold text-gold animate-pulse">Loading...</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No image</span>
                  )}
                </div>
                {status[l.id] && status[l.id] !== 'done' && (
                  <div className="text-[9px] text-gold mt-1">{status[l.id]}</div>
                )}
              </div>
            </div>
            {/* Audio preview player */}
            {urls[l.id] && (
              <div className="mt-2">
                <audio controls preload="none" src={urls[l.id]} className="w-full h-8" style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.7 }} />
              </div>
            )}
            {/* Bottom row: actions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* ElevenLabs — pick voice + generate in one row */}
              <select value={voiceSelections[l.id]?.elVoice || (['hindu','sikh','jain','buddhist'].includes(l.tradition) ? 'muskaan' : 'george')}
                onChange={e => setVoiceSelections(prev => ({ ...prev, [l.id]: { ...prev[l.id], elVoice: e.target.value } }))}
                className="rounded-lg bg-bg-base px-2 py-1.5 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-[#7ad9a1]/20">
                <option value="george">George</option>
                <option value="lily">Lily</option>
                <option value="sarah">Sarah</option>
                <option value="muskaan">Muskaan 🇮🇳</option>
                <option value="brian">Brian</option>
                <option value="bill">Bill</option>
                <option value="alice">Alice</option>
              </select>
              <button onClick={async () => {
                const voice = voiceSelections[l.id]?.elVoice || (['hindu','sikh','jain','buddhist'].includes(l.tradition) ? 'muskaan' : 'george');
                setGenerating(l.id);
                setStatus(s => ({ ...s, [l.id]: `11Labs: ${voice}...` }));
                try {
                  const text = l.body.replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{pet\}/g, 'their puppy').replace(/\{grandfather\}/g, 'Dada ji').replace(/\{grandmother\}/g, 'Nani ma');
                  const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text.slice(0, 10000), voice }) });
                  if (!res.ok) { setStatus(s => ({ ...s, [l.id]: `Failed (${res.status})` })); setGenerating(null); return; }
                  const blob = await res.blob();
                  setStatus(s => ({ ...s, [l.id]: 'uploading...' }));
                  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
                  const { storage, db: fireDb } = await import('../lib/firebase.js');
                  const storageRef = ref(storage, `wisdom-audio/${l.id}.mp3`);
                  await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
                  const audioUrl = await getDownloadURL(storageRef);
                  const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
                  await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [l.id]: audioUrl }, { merge: true });
                  setUrls(u => ({ ...u, [l.id]: audioUrl }));
                  setStatus(s => ({ ...s, [l.id]: `✓ ${voice}` }));
                } catch (e) { setStatus(s => ({ ...s, [l.id]: e.message })); }
                setGenerating(null);
              }} disabled={!!generating}
                className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1] hover:bg-[#7ad9a1]/20 disabled:opacity-30">
                {generating === l.id ? '...' : '⚡ 11Labs'}
              </button>
              <button onClick={() => generateImage(l)} disabled={!!generating}
                className="rounded-lg bg-[#539df5]/10 px-3 py-1.5 text-[10px] font-bold text-[#539df5] hover:bg-[#539df5]/20 disabled:opacity-30">
                {generating === l.id + '_img' ? '...' : imageUrls[l.id] ? 'Re-gen Image' : 'Gen Image'}
              </button>
              <label className="rounded-lg bg-[#e8b4ff]/10 px-3 py-1.5 text-[10px] font-bold text-[#e8b4ff] cursor-pointer hover:bg-[#e8b4ff]/20">
                📤 Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setGenerating(l.id + '_upload'); setStatus(s => ({ ...s, [l.id]: 'uploading...' }));
                  try {
                    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
                    const { storage, db: fireDb } = await import('../lib/firebase.js');
                    const storageRef = ref(storage, `wisdom-images/${l.id}.png`);
                    await uploadBytes(storageRef, file, { contentType: file.type });
                    const url = await getDownloadURL(storageRef);
                    const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
                    await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [l.id]: url }, { merge: true });
                    setImageUrls(u => ({ ...u, [l.id]: url })); setStatus(s => ({ ...s, [l.id]: '✓ uploaded' }));
                  } catch (err) { setStatus(s => ({ ...s, [l.id]: err.message })); }
                  setGenerating(null); e.target.value = '';
                }} />
              </label>
              <button onClick={() => { setEditing(l.id); setAddingNew(false); }}
                className="rounded-lg bg-[#e8b4ff]/10 px-3 py-1.5 text-[10px] font-bold text-[#e8b4ff] hover:bg-[#e8b4ff]/20">
                Edit
              </button>
              {l._isCustom && (
                <button onClick={() => deleteStory(l.id)}
                  className="rounded-lg bg-red-400/10 px-3 py-1.5 text-[10px] font-bold text-red-400 hover:bg-red-400/20">
                  Del
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl bg-bg-elevated px-4 py-8 text-center text-sm text-ink-dim ring-1 ring-white/5">No stories match the current filters</div>
        )}
      </div>
    </div>
  );
}

function CuratorSubmissionsPanel() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCreator, setExpandedCreator] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadIdx, setUploadIdx] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, getDocs, query, orderBy, doc, setDoc } = await import('firebase/firestore');
        const { SERIES: ALL_SERIES } = await import('../data/series.js');

        // Auto-seed built-in series into Firestore
        for (const s of ALL_SERIES.filter(s => s.createdBy && !s.comingSoon)) {
          await setDoc(doc(db, 'creatorSeries', s.id), {
            title: s.title, icon: s.icon, description: s.description,
            tradition: 'universal', ageRange: s.ageRange, totalEpisodes: s.totalEpisodes,
            episodes: s.episodes.map(ep => ({ episodeNumber: ep.episodeNumber, title: ep.title, subtitle: ep.subtitle || '', body: ep.body || '', wordCount: (ep.body || '').split(/\s+/).length })),
            authorEmail: s.createdBy, authorName: s.creatorName, authorUid: s.createdBy,
            status: 'published', submittedAt: new Date().toISOString(), type: 'series',
          }, { merge: true });
        }

        const [storySnap, seriesSnap] = await Promise.all([
          getDocs(query(collection(db, 'creatorStories'), orderBy('submittedAt', 'desc'))),
          getDocs(query(collection(db, 'creatorSeries'), orderBy('submittedAt', 'desc'))),
        ]);
        const items = [];
        storySnap.forEach(d => items.push({ id: d.id, type: 'story', ...d.data() }));
        seriesSnap.forEach(d => items.push({ id: d.id, type: 'series', ...d.data() }));
        setAllItems(items);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id, type, newStatus, feedback) => {
    const confirmMsgs = {
      published: 'Are you sure you want to publish? This will be live for all users.',
      rejected: 'Are you sure you want to unpublish/reject this?',
      revision_requested: 'Are you sure you want to send this back for edits?',
    };
    if (confirmMsgs[newStatus] && !confirm(confirmMsgs[newStatus])) return;
    const collName = type === 'series' ? 'creatorSeries' : 'creatorStories';
    try {
      const { db } = await import('../lib/firebase.js');
      const { doc, updateDoc } = await import('firebase/firestore');
      const updates = { status: newStatus };
      if (feedback) updates.adminFeedback = feedback;
      if (newStatus === 'revision_requested') updates.revisionRequestedAt = new Date().toISOString();
      await updateDoc(doc(db, collName, id), updates);
      setAllItems(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch {}
  };

  const sendFeedback = (id, type) => {
    if (!feedbackText.trim()) return;
    if (!confirm('Are you sure you want to send this feedback and request revision?')) return;
    updateStatus(id, type, 'revision_requested', feedbackText.trim());
    setFeedbackId(null); setFeedbackText('');
  };

  const startEdit = (item) => { setEditingId(item.id); setEditData(JSON.parse(JSON.stringify(item))); };
  const cancelEdit = () => { setEditingId(null); setEditData(null); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editData) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { storage } = await import('../lib/firebase.js');
        const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
        const imgRef = ref(storage, `creator-images/admin/${Date.now()}_${file.name}`);
        await uploadString(imgRef, reader.result, 'data_url');
        const url = await getDownloadURL(imgRef);
        if (uploadIdx === -1) setEditData(prev => ({ ...prev, coverImage: url }));
        else setEditData(prev => { const eps = [...(prev.episodes || [])]; eps[uploadIdx] = { ...eps[uploadIdx], coverImage: url }; return { ...prev, episodes: eps }; });
      } catch (err) { console.error('Upload failed:', err); }
    };
    reader.readAsDataURL(file); e.target.value = '';
  };

  const saveEdit = async () => {
    if (!editData) return;
    if (!confirm('Are you sure you want to save these changes?')) return;
    setSaving(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { doc, updateDoc } = await import('firebase/firestore');
      const collName = editData.type === 'series' ? 'creatorSeries' : 'creatorStories';
      const updates = editData.type === 'story'
        ? { title: editData.title, body: editData.body, tradition: editData.tradition, ...(editData.coverImage ? { coverImage: editData.coverImage } : {}) }
        : { title: editData.title, description: editData.description, icon: editData.icon, episodes: editData.episodes, totalEpisodes: editData.episodes?.length || 0 };
      updates.adminEditedAt = new Date().toISOString();
      await updateDoc(doc(db, collName, editData.id), updates);
      setAllItems(prev => prev.map(s => s.id === editData.id ? { ...s, ...updates } : s));
      setEditingId(null); setEditData(null);
    } catch (err) { console.error('Save failed:', err); }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-12 text-ink-dim">Loading submissions...</div>;

  // Group by creator
  const creators = {};
  allItems.forEach(item => {
    const key = item.authorEmail || item.authorName || 'unknown';
    if (!creators[key]) creators[key] = { name: item.authorName, email: item.authorEmail, items: [] };
    creators[key].items.push(item);
  });
  const creatorList = Object.values(creators).sort((a, b) => b.items.length - a.items.length);
  const totalPending = allItems.filter(i => i.status === 'pending' || i.status === 'revision_requested').length;
  const totalPublished = allItems.filter(i => i.status === 'published').length;
  const totalSeries = allItems.filter(i => i.type === 'series').length;

  const statusBadge = (status) => {
    const c = { pending: 'bg-yellow-500/15 text-yellow-400', published: 'bg-green-500/15 text-green-400', rejected: 'bg-red-500/15 text-red-400', revision_requested: 'bg-blue-500/15 text-blue-400' };
    const l = { revision_requested: 'Needs Edits', pending: 'Pending', published: 'Published', rejected: 'Rejected' };
    return <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${c[status] || c.pending}`}>{l[status] || status}</span>;
  };

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { v: totalPending, l: 'Pending', c: 'text-gold' },
          { v: totalPublished, l: 'Published', c: 'text-[#7ad9a1]' },
          { v: totalSeries, l: 'Series', c: 'text-blue-400' },
          { v: creatorList.length, l: 'Creators', c: 'text-purple-400' },
        ].map(s => (
          <div key={s.l} className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5 text-center">
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-[9px] text-ink-dim">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Creator rows — expandable */}
      {creatorList.length === 0 ? (
        <div className="text-center py-12"><div className="text-4xl mb-3">✍️</div><p className="text-sm text-ink-muted">No submissions yet</p></div>
      ) : creatorList.map((c) => {
        const isExp = expandedCreator === (c.email || c.name);
        const pCount = c.items.filter(i => i.status === 'pending' || i.status === 'revision_requested').length;
        const pubCount = c.items.filter(i => i.status === 'published').length;
        const serCount = c.items.filter(i => i.type === 'series').length;
        const stCount = c.items.filter(i => i.type === 'story').length;

        return (
          <div key={c.email || c.name} className="rounded-xl bg-bg-elevated ring-1 ring-white/5 overflow-hidden">
            {/* Creator header */}
            <button onClick={() => setExpandedCreator(isExp ? null : (c.email || c.name))}
              className="w-full flex items-center gap-3 p-3 text-left transition hover:bg-white/3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f0a500]/20 text-[10px] font-bold text-gold">
                {(c.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink truncate">{c.name}</p>
                <p className="text-[9px] text-ink-dim truncate">{c.email}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                {serCount > 0 && <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[8px] font-bold text-purple-400">{serCount} series</span>}
                {stCount > 0 && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">{stCount} stories</span>}
                {pCount > 0 && <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-[8px] font-bold text-yellow-400">{pCount}</span>}
                {pubCount > 0 && <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-[8px] font-bold text-green-400">{pubCount} live</span>}
                <span className={`text-ink-dim transition ${isExp ? 'rotate-180' : ''}`}>▾</span>
              </div>
            </button>

            {/* Expanded items */}
            {isExp && (
              <div className="border-t border-white/5">
                {/* Table header */}
                <div className="flex items-center gap-2 px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-ink-dim border-b border-white/3">
                  <div className="w-14">Type</div>
                  <div className="flex-1">Title</div>
                  <div className="w-16 text-center">Status</div>
                  <div className="w-24 text-right">Actions</div>
                </div>

                {c.items.map(s => {
                  const isEditing = editingId === s.id;
                  const ed = isEditing ? editData : s;
                  const isItemExp = expandedItem === s.id;

                  return (
                    <div key={`${s.type}-${s.id}`} className={`border-b border-white/3 ${isEditing ? 'bg-[#f0a500]/5' : ''}`}>
                      {/* Row */}
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="w-14">
                          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${s.type === 'series' ? 'bg-purple-500/15 text-purple-400' : 'bg-amber-500/15 text-amber-400'}`}>
                            {s.type === 'series' ? '📺' : '📖'} {s.type}
                          </span>
                        </div>
                        <button onClick={() => setExpandedItem(isItemExp ? null : s.id)} className="flex-1 min-w-0 text-left">
                          <p className="text-[11px] font-bold text-ink truncate">{s.icon || ''} {s.title}</p>
                          <p className="text-[9px] text-ink-dim">{s.type === 'series' ? `${s.totalEpisodes || (s.episodes||[]).length} eps · ` : ''}{s.tradition}</p>
                        </button>
                        <div className="w-16 text-center">{statusBadge(s.status)}</div>
                        <div className="w-24 flex gap-1 justify-end">
                          <button onClick={() => isEditing ? cancelEdit() : startEdit(s)}
                            className="rounded px-1.5 py-0.5 text-[8px] font-bold bg-[#f0a500]/10 text-gold">
                            {isEditing ? '✕' : '✏️'}
                          </button>
                          {!isEditing && s.status !== 'published' && (
                            <button onClick={() => updateStatus(s.id, s.type, 'published')}
                              className="rounded px-1.5 py-0.5 text-[8px] font-bold bg-green-500/10 text-green-400">✓</button>
                          )}
                          {!isEditing && s.status === 'published' && (
                            <button onClick={() => updateStatus(s.id, s.type, 'rejected')}
                              className="rounded px-1.5 py-0.5 text-[8px] font-bold bg-red-500/10 text-red-400">✕</button>
                          )}
                          {!isEditing && (
                            <button onClick={() => setFeedbackId(feedbackId === s.id ? null : s.id)}
                              className="rounded px-1.5 py-0.5 text-[8px] font-bold bg-blue-500/10 text-blue-400">✎</button>
                          )}
                        </div>
                      </div>

                      {/* Expanded item detail / edit */}
                      {(isItemExp || isEditing) && (
                        <div className="px-3 pb-3 space-y-2">
                          {/* Feedback input */}
                          {feedbackId === s.id && (
                            <div className="space-y-2">
                              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Feedback for creator..."
                                className="w-full rounded bg-bg-base p-2 text-xs text-ink ring-1 ring-white/10 h-16 resize-y" />
                              <div className="flex gap-2">
                                <button onClick={() => sendFeedback(s.id, s.type)}
                                  className="rounded bg-blue-500/10 px-2 py-1 text-[9px] font-bold text-blue-400">Send & Request Revision</button>
                                <button onClick={() => { setFeedbackId(null); setFeedbackText(''); }}
                                  className="text-[9px] text-ink-dim">Cancel</button>
                              </div>
                            </div>
                          )}

                          {s.adminFeedback && (
                            <div className="rounded bg-blue-500/5 border border-blue-500/20 p-2">
                              <p className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">Admin Feedback</p>
                              <p className="text-[10px] text-blue-300/80">{s.adminFeedback}</p>
                            </div>
                          )}

                          {/* Story body */}
                          {s.type === 'story' && (
                            isEditing ? (
                              <div className="space-y-2">
                                <input value={ed.title} onChange={(e) => setEditData(p => ({ ...p, title: e.target.value }))}
                                  className="w-full rounded bg-bg-base px-2 py-1 text-xs font-bold text-ink ring-1 ring-white/10" />
                                <textarea value={ed.body || ''} onChange={(e) => setEditData(p => ({ ...p, body: e.target.value }))}
                                  className="w-full rounded bg-bg-base p-2 text-[10px] text-ink-muted ring-1 ring-white/5 h-32 resize-y" />
                                <div className="flex items-center gap-2">
                                  {ed.coverImage && <img src={ed.coverImage} alt="" className="h-10 w-10 rounded object-cover" />}
                                  <button onClick={() => { setUploadIdx(-1); fileInputRef.current?.click(); }}
                                    className="rounded bg-white/5 px-2 py-1 text-[9px] font-bold text-ink-muted">📤 Image</button>
                                  <button onClick={saveEdit} disabled={saving}
                                    className="rounded bg-[#f0a500] px-3 py-1 text-[9px] font-bold text-[#0a0a0f]">{saving ? '...' : '💾 Save'}</button>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded bg-bg-base p-2 text-[10px] text-ink-muted leading-relaxed max-h-24 overflow-y-auto">
                                {(s.body || '').slice(0, 400)}{(s.body || '').length > 400 ? '...' : ''}
                              </div>
                            )
                          )}

                          {/* Series episodes */}
                          {s.type === 'series' && (
                            isEditing ? (
                              <div className="space-y-2">
                                <input value={ed.title} onChange={(e) => setEditData(p => ({ ...p, title: e.target.value }))}
                                  className="w-full rounded bg-bg-base px-2 py-1 text-xs font-bold text-ink ring-1 ring-white/10" />
                                <textarea value={ed.description || ''} onChange={(e) => setEditData(p => ({ ...p, description: e.target.value }))}
                                  className="w-full rounded bg-bg-base p-2 text-[10px] text-ink ring-1 ring-white/10 h-10 resize-none" placeholder="Description" />
                                {(ed.episodes || []).map((ep, i) => (
                                  <div key={i} className="rounded bg-bg-base p-2 ring-1 ring-white/5 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-bold text-gold">Ep {i+1}</span>
                                      <input value={ep.title} onChange={(e) => setEditData(p => { const eps=[...p.episodes]; eps[i]={...eps[i],title:e.target.value}; return {...p,episodes:eps}; })}
                                        className="flex-1 rounded bg-bg-elevated px-2 py-0.5 text-[10px] font-bold text-ink ring-1 ring-white/10" />
                                    </div>
                                    <textarea value={ep.body||''} onChange={(e) => setEditData(p => { const eps=[...p.episodes]; eps[i]={...eps[i],body:e.target.value}; return {...p,episodes:eps}; })}
                                      className="w-full rounded bg-bg-elevated p-1.5 text-[9px] text-ink-muted ring-1 ring-white/5 h-20 resize-y" />
                                    <div className="flex items-center gap-2">
                                      {ep.coverImage && <img src={ep.coverImage} alt="" className="h-8 w-8 rounded object-cover" />}
                                      <button onClick={() => { setUploadIdx(i); fileInputRef.current?.click(); }}
                                        className="rounded bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-ink-muted">📤</button>
                                      <span className="text-[8px] text-ink-dim">{(ep.body||'').split(/\s+/).filter(Boolean).length}w</span>
                                    </div>
                                  </div>
                                ))}
                                <button onClick={saveEdit} disabled={saving}
                                  className="rounded bg-[#f0a500] px-3 py-1 text-[9px] font-bold text-[#0a0a0f]">{saving ? '...' : '💾 Save All'}</button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {(s.episodes || []).map((ep, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[10px]">
                                    {ep.coverImage && <img src={ep.coverImage} alt="" className="h-6 w-6 rounded object-cover" />}
                                    <span className="text-gold font-bold">Ep {ep.episodeNumber || i+1}</span>
                                    <span className="text-ink truncate flex-1">{ep.title}</span>
                                    <span className="text-ink-dim">{ep.wordCount || (ep.body||'').split(/\s+/).length}w</span>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SeriesPanel() {
  const [urls, setUrls] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [galleryUrls, setGalleryUrls] = useState({}); // { storyId: [url1, url2, ...] }
  const [status, setStatus] = useState({});
  const [generating, setGenerating] = useState(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  const bulkAbort = useRef(false);
  const [dataReady, setDataReady] = useState(false);

  const ELEVEN_VOICES = [
    { key: 'george', label: 'George' }, { key: 'lily', label: 'Lily' },
    { key: 'sarah', label: 'Sarah' }, { key: 'muskaan', label: 'Muskaan 🇮🇳' },
    { key: 'brian', label: 'Brian' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) { setDataReady(true); return; }
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomAudio'));
        if (snap.exists()) setUrls(snap.data());
        const imgSnap = await getDoc(doc(db, 'config', 'wisdomImages'));
        if (imgSnap.exists()) setImageUrls(imgSnap.data());
        const galSnap = await getDoc(doc(db, 'config', 'wisdomGallery'));
        if (galSnap.exists()) setGalleryUrls(galSnap.data());
        setDataReady(true);
      } catch { setDataReady(true); }
    })();
  }, []);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const [editingEpisode, setEditingEpisode] = useState(null);

  const OPENAI_VOICES = ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'];

  const generateOpenAIAudio = async (episode, voice = 'nova') => {
    setGenerating(episode.id);
    setStatus(s => ({ ...s, [episode.id]: `OpenAI TTS: ${voice}...` }));
    try {
      const text = (episode.body || '').replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').slice(0, 10000);
      const res = await fetch(`${API_BASE}/api/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, model: 'tts-1-hd' }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [episode.id]: `Failed (${res.status})` })); setGenerating(null); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [episode.id]: 'uploading...' }));
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-audio/${episode.id}.mp3`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [episode.id]: audioUrl }, { merge: true });
      setUrls(u => ({ ...u, [episode.id]: audioUrl }));
      setStatus(s => ({ ...s, [episode.id]: `✓ OpenAI ${voice}` }));
    } catch (e) { setStatus(s => ({ ...s, [episode.id]: e.message })); }
    setGenerating(null);
  };

  const allEpisodes = SERIES_DATA.flatMap(s => s.episodes.map(ep => ({
    ...ep, seriesId: s.id, seriesTitle: s.title, seriesIcon: s.icon,
  })));

  const totalAudio = allEpisodes.filter(e => urls[e.id]).length;
  const totalImages = allEpisodes.filter(e => imageUrls[e.id]).length;

  const generateAudio = async (episode, voice = 'george') => {
    setGenerating(episode.id);
    setStatus(s => ({ ...s, [episode.id]: `11Labs: ${voice}...` }));
    try {
      const text = (episode.body || '').replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{pet\}/g, 'their puppy');
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 10000), voice }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [episode.id]: `Failed (${res.status})` })); setGenerating(null); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [episode.id]: 'uploading...' }));
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-audio/${episode.id}.mp3`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [episode.id]: audioUrl }, { merge: true });
      setUrls(u => ({ ...u, [episode.id]: audioUrl }));
      setStatus(s => ({ ...s, [episode.id]: `✓ ${voice}` }));
    } catch (e) { setStatus(s => ({ ...s, [episode.id]: e.message })); }
    setGenerating(null);
  };

  const generateImage = async (episode) => {
    setGenerating(episode.id + '_img');
    setStatus(s => ({ ...s, [episode.id]: 'generating image...' }));
    try {
      let prompt;
      try {
        const { getStoryPrompt } = await import('../utils/imagePrompts.js');
        prompt = getStoryPrompt(episode.id, 'thumbnail');
      } catch {
        prompt = `Children's storybook illustration for "${episode.title}". Warm, colorful, bedtime style.`;
      }
      const res = await fetch(`${API_BASE}/api/generate-story-image`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [episode.id]: `Image failed (${res.status})` })); setGenerating(null); return; }
      const data = await res.json();
      let imgBlob;
      if (data.imageBase64) {
        const bytes = Uint8Array.from(atob(data.imageBase64), c => c.charCodeAt(0));
        imgBlob = new Blob([bytes], { type: 'image/png' });
      } else if (data.imageUrl) {
        const imgRes = await fetch(data.imageUrl);
        imgBlob = await imgRes.blob();
      } else { setStatus(s => ({ ...s, [episode.id]: 'No image data' })); setGenerating(null); return; }
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-images/${episode.id}.png`);
      await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
      const permanentUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [episode.id]: permanentUrl }, { merge: true });
      setImageUrls(u => ({ ...u, [episode.id]: permanentUrl }));
      setStatus(s => ({ ...s, [episode.id]: '✓ image' }));
    } catch (e) { setStatus(s => ({ ...s, [episode.id]: e.message })); }
    setGenerating(null);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-ink">{SERIES_DATA.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Series</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-ink">{allEpisodes.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Total Episodes</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className={`text-2xl font-bold ${dataReady ? 'text-[#7ad9a1]' : 'text-gold animate-pulse'}`}>{dataReady ? totalAudio : '...'}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Audio Ready</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className={`text-2xl font-bold ${dataReady ? 'text-[#539df5]' : 'text-gold animate-pulse'}`}>{dataReady ? totalImages : '...'}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Images Ready</div>
        </div>
      </div>

      {/* Bulk generate ALL series */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
        <span className="text-xs font-bold text-ink mr-2">Bulk All Series:</span>
        <select id="bulk-series-voice" defaultValue="george"
          className="rounded-lg bg-bg-base px-2 py-1.5 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-[#7ad9a1]/20">
          {ELEVEN_VOICES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
        </select>
        <button
          onClick={async () => {
            const voice = document.getElementById('bulk-series-voice')?.value || 'george';
            const missing = allEpisodes.filter(e => !urls[e.id]);
            if (missing.length === 0) { alert('All episodes already have audio!'); return; }
            if (!confirm(`Generate audio for ${missing.length} episodes with voice "${voice}"? This will take ~${Math.ceil(missing.length * 15 / 60)} minutes.`)) return;
            for (let i = 0; i < missing.length; i++) {
              setBulkProgress(`Audio ${i + 1}/${missing.length}: ${missing[i].title}`);
              await generateAudio(missing[i], voice);
              await new Promise(r => setTimeout(r, 2000));
            }
            setBulkProgress(`Done! ${missing.length} audio files generated`);
          }}
          disabled={!!generating}
          className="rounded-lg bg-[#7ad9a1]/10 px-4 py-1.5 text-[10px] font-bold text-[#7ad9a1] disabled:opacity-30"
        >
          ⚡ Bulk Audio ({allEpisodes.filter(e => !urls[e.id]).length} missing)
        </button>
        <button
          onClick={async () => {
            const missing = allEpisodes.filter(e => !imageUrls[e.id]);
            if (missing.length === 0) { alert('All episodes already have images!'); return; }
            if (!confirm(`Generate images for ${missing.length} episodes? This will take ~${Math.ceil(missing.length * 10 / 60)} minutes.`)) return;
            for (let i = 0; i < missing.length; i++) {
              setBulkProgress(`Image ${i + 1}/${missing.length}: ${missing[i].title}`);
              await generateImage(missing[i]);
              await new Promise(r => setTimeout(r, 1500));
            }
            setBulkProgress(`Done! ${missing.length} images generated`);
          }}
          disabled={!!generating}
          className="rounded-lg bg-[#539df5]/10 px-4 py-1.5 text-[10px] font-bold text-[#539df5] disabled:opacity-30"
        >
          🖼️ Bulk Images ({allEpisodes.filter(e => !imageUrls[e.id]).length} missing)
        </button>
        <button
          onClick={async () => {
            const voice = document.getElementById('bulk-series-voice')?.value || 'george';
            const missingAudio = allEpisodes.filter(e => !urls[e.id]);
            const missingImages = allEpisodes.filter(e => !imageUrls[e.id]);
            const total = missingAudio.length + missingImages.length;
            if (total === 0) { alert('Everything is generated!'); return; }
            if (!confirm(`Generate ${missingAudio.length} audio + ${missingImages.length} images? This will take ~${Math.ceil((missingAudio.length * 15 + missingImages.length * 10) / 60)} minutes.`)) return;
            for (let i = 0; i < missingAudio.length; i++) {
              setBulkProgress(`Audio ${i + 1}/${missingAudio.length}: ${missingAudio[i].title}`);
              await generateAudio(missingAudio[i], voice);
              await new Promise(r => setTimeout(r, 2000));
            }
            for (let i = 0; i < missingImages.length; i++) {
              setBulkProgress(`Image ${i + 1}/${missingImages.length}: ${missingImages[i].title}`);
              await generateImage(missingImages[i]);
              await new Promise(r => setTimeout(r, 1500));
            }
            setBulkProgress(`Done! ${missingAudio.length} audio + ${missingImages.length} images`);
          }}
          disabled={!!generating}
          className="rounded-lg bg-[#f0a500]/10 px-4 py-1.5 text-[10px] font-bold text-gold disabled:opacity-30"
        >
          🚀 Bulk ALL ({allEpisodes.filter(e => !urls[e.id] || !imageUrls[e.id]).length} missing)
        </button>
        <button
          onClick={async () => {
            if (!confirm(`Regenerate images for ALL ${allEpisodes.length} episodes? This will replace existing images. ~${Math.ceil(allEpisodes.length * 10 / 60)} minutes.`)) return;
            for (let i = 0; i < allEpisodes.length; i++) {
              setBulkProgress(`🖼️ Regen ${i + 1}/${allEpisodes.length}: ${allEpisodes[i].title}`);
              await generateImage(allEpisodes[i]);
              await new Promise(r => setTimeout(r, 1500));
            }
            setBulkProgress(`Done! ${allEpisodes.length} images regenerated`);
          }}
          disabled={!!generating}
          className="rounded-lg bg-red-400/10 px-4 py-1.5 text-[10px] font-bold text-red-400 disabled:opacity-30"
        >
          🔄 Regen ALL Images ({allEpisodes.length})
        </button>
        <button
          onClick={async () => {
            const voice = document.getElementById('bulk-series-voice')?.value || 'george';
            if (!confirm(`Regenerate audio for ALL ${allEpisodes.length} episodes with voice "${voice}"? ~${Math.ceil(allEpisodes.length * 15 / 60)} minutes.`)) return;
            for (let i = 0; i < allEpisodes.length; i++) {
              setBulkProgress(`⚡ Regen ${i + 1}/${allEpisodes.length}: ${allEpisodes[i].title}`);
              await generateAudio(allEpisodes[i], voice);
              await new Promise(r => setTimeout(r, 2000));
            }
            setBulkProgress(`Done! ${allEpisodes.length} audio regenerated`);
          }}
          disabled={!!generating}
          className="rounded-lg bg-red-400/10 px-4 py-1.5 text-[10px] font-bold text-red-400 disabled:opacity-30"
        >
          🔄 Regen ALL Audio ({allEpisodes.length})
        </button>
        {bulkProgress && <div className="w-full text-[10px] text-gold mt-2">{bulkProgress}</div>}
      </div>

      {/* Series list */}
      {SERIES_DATA.map((series) => (
        <div key={series.id} className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          {/* Series header + per-series bulk */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{series.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-ink">{series.title}</h3>
                <p className="text-[10px] text-ink-dim">{series.episodes.length} episodes · {series.ageRange} · Audio: {series.episodes.filter(e => urls[e.id]).length}/{series.episodes.length} · Images: {series.episodes.filter(e => imageUrls[e.id]).length}/{series.episodes.length}</p>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={async () => {
                  const eps = series.episodes;
                  if (!confirm(`Generate audio + images for all ${eps.length} episodes of "${series.title}"? Uses per-episode voice selection.`)) return;
                  for (let i = 0; i < eps.length; i++) {
                    const epVoice = document.getElementById(`voice-${eps[i].id}`)?.value || document.getElementById('bulk-series-voice')?.value || 'george';
                    setBulkProgress(`${series.icon} ${i + 1}/${eps.length}: ${eps[i].title} (${epVoice})`);
                    if (!urls[eps[i].id]) { await generateAudio(eps[i], epVoice); await new Promise(r => setTimeout(r, 2000)); }
                    if (!imageUrls[eps[i].id]) { await generateImage(eps[i]); await new Promise(r => setTimeout(r, 1500)); }
                  }
                  setBulkProgress(`${series.icon} Done!`);
                }}
                disabled={!!generating}
                className="rounded-lg bg-[#f0a500]/10 px-2.5 py-1 text-[9px] font-bold text-gold disabled:opacity-30"
                title="Generate missing audio + images for this series"
              >
                🚀 Missing
              </button>
              <button
                onClick={async () => {
                  const eps = series.episodes;
                  if (!confirm(`REGENERATE all ${eps.length} episodes of "${series.title}"? Replaces existing. Uses per-episode voice selection.`)) return;
                  for (let i = 0; i < eps.length; i++) {
                    const epVoice = document.getElementById(`voice-${eps[i].id}`)?.value || document.getElementById('bulk-series-voice')?.value || 'george';
                    setBulkProgress(`${series.icon} Regen ${i + 1}/${eps.length}: ${eps[i].title} (${epVoice})`);
                    await generateAudio(eps[i], epVoice); await new Promise(r => setTimeout(r, 2000));
                    await generateImage(eps[i]); await new Promise(r => setTimeout(r, 1500));
                  }
                  setBulkProgress(`${series.icon} Regen done!`);
                }}
                disabled={!!generating}
                className="rounded-lg bg-red-400/10 px-2.5 py-1 text-[9px] font-bold text-red-400 disabled:opacity-30"
                title="Regenerate ALL audio + images for this series"
              >
                🔄 Regen
              </button>
            </div>
          </div>

          {/* Episodes */}
          <div className="space-y-2">
            {series.episodes.map((ep) => (
              <div key={ep.id} className="rounded-lg bg-bg-base p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
                    {imageUrls[ep.id] ? <img src={imageUrls[ep.id]} alt="" className="h-full w-full object-cover" />
                      : <div className="grid h-full w-full place-items-center text-sm font-bold text-ink-dim">{ep.episodeNumber}</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-ink">Ep {ep.episodeNumber}: {ep.title}</div>
                    <div className="text-[10px] text-ink-dim mt-0.5">{ep.subtitle}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {urls[ep.id] ? <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Audio ✓</span>
                        : !dataReady ? <span className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[8px] font-bold text-gold animate-pulse">Loading...</span>
                        : <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No audio</span>}
                      {imageUrls[ep.id] ? <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Image ✓</span>
                        : !dataReady ? <span className="rounded-full bg-[#f0a500]/10 px-2 py-0.5 text-[8px] font-bold text-gold animate-pulse">Loading...</span>
                        : <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No image</span>}
                    </div>
                    {status[ep.id] && <div className="text-[9px] text-gold mt-1">{status[ep.id]}</div>}
                  </div>
                </div>
                {/* Inline edit — title + body */}
                {editingEpisode === ep.id && (
                  <div className="mt-2 space-y-2 rounded-lg bg-bg-base p-3 ring-1 ring-gold/20">
                    <input defaultValue={ep.title} id={`ep-edit-title-${ep.id}`}
                      className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-xs font-bold text-ink outline-none ring-1 ring-white/10" placeholder="Title" />
                    <textarea defaultValue={ep.body} id={`ep-edit-body-${ep.id}`} rows={10}
                      className="w-full rounded-lg bg-bg-elevated px-3 py-2 text-[10px] text-ink-muted leading-relaxed outline-none ring-1 ring-white/10 resize-y" />
                    <div className="flex gap-2">
                      <button onClick={async () => {
                        const newTitle = document.getElementById(`ep-edit-title-${ep.id}`).value;
                        const newBody = document.getElementById(`ep-edit-body-${ep.id}`).value;
                        try {
                          const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
                          await fset(fdoc(db, 'config', 'pendingEdits'), {
                            [ep.id]: { title: newTitle, body: newBody },
                          }, { merge: true });
                          setStatus(s => ({ ...s, [ep.id]: '✅ Edit queued — run: node scripts/apply-story-edits.mjs' }));
                          setEditingEpisode(null);
                        } catch (e) { setStatus(s => ({ ...s, [ep.id]: '❌ ' + e.message })); }
                      }} className="rounded-lg bg-[#7ad9a1]/10 px-4 py-1.5 text-[10px] font-bold text-[#7ad9a1]">
                        💾 Save & Queue Deploy
                      </button>
                      <button onClick={() => setEditingEpisode(null)} className="rounded-lg bg-white/5 px-4 py-1.5 text-[10px] font-bold text-ink-dim">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {/* Audio preview */}
                {urls[ep.id] && <audio controls preload="none" src={urls[ep.id]} className="w-full h-8 mt-2" style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.7 }} />}
                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                  <select defaultValue="george" id={`voice-${ep.id}`}
                    className="rounded-lg bg-bg-elevated px-2 py-1.5 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-[#7ad9a1]/20">
                    {ELEVEN_VOICES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
                  </select>
                  <button onClick={() => generateAudio(ep, document.getElementById(`voice-${ep.id}`)?.value || 'george')} disabled={!!generating}
                    className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1] disabled:opacity-30">
                    {generating === ep.id ? '...' : '⚡ 11Labs'}
                  </button>
                  <select defaultValue="nova" id={`oaivoice-${ep.id}`}
                    className="rounded-lg bg-bg-elevated px-2 py-1.5 text-[10px] font-bold text-[#60a5fa] outline-none ring-1 ring-[#60a5fa]/20">
                    {OPENAI_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <button onClick={() => generateOpenAIAudio(ep, document.getElementById(`oaivoice-${ep.id}`)?.value || 'nova')} disabled={!!generating}
                    className="rounded-lg bg-[#60a5fa]/10 px-3 py-1.5 text-[10px] font-bold text-[#60a5fa] disabled:opacity-30">
                    {generating === ep.id ? '...' : '🔊 OpenAI'}
                  </button>
                  <button onClick={() => generateImage(ep)} disabled={!!generating}
                    className="rounded-lg bg-[#539df5]/10 px-3 py-1.5 text-[10px] font-bold text-[#539df5] disabled:opacity-30">
                    {generating === ep.id + '_img' ? '...' : '🖼️ AI Image'}
                  </button>
                  <button onClick={() => setEditingEpisode(editingEpisode === ep.id ? null : ep.id)}
                    className="rounded-lg bg-[#f0a500]/10 px-3 py-1.5 text-[10px] font-bold text-gold">
                    {editingEpisode === ep.id ? '✕ Close' : '✏️ Edit Text'}
                  </button>
                  <label className="rounded-lg bg-[#e8b4ff]/10 px-3 py-1.5 text-[10px] font-bold text-[#e8b4ff] cursor-pointer hover:bg-[#e8b4ff]/20">
                    📤 Upload ({(galleryUrls[ep.id] || []).length})
                    <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setGenerating(ep.id + '_upload');
                      setStatus(s => ({ ...s, [ep.id]: `uploading ${files.length} photos...` }));
                      try {
                        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
                        const { storage, db: fireDb } = await import('../lib/firebase.js');
                        const existing = galleryUrls[ep.id] || [];
                        const newUrls = [];
                        for (let i = 0; i < files.length; i++) {
                          setStatus(s => ({ ...s, [ep.id]: `uploading ${i+1}/${files.length}...` }));
                          const storageRef = ref(storage, `story-gallery/${ep.id}/${Date.now()}_${i}.${files[i].name.split('.').pop()}`);
                          await uploadBytes(storageRef, files[i], { contentType: files[i].type });
                          const url = await getDownloadURL(storageRef);
                          newUrls.push(url);
                        }
                        const allUrls = [...existing, ...newUrls];
                        const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
                        await fset(fdoc(fireDb, 'config', 'wisdomGallery'), { [ep.id]: allUrls }, { merge: true });
                        setGalleryUrls(u => ({ ...u, [ep.id]: allUrls }));
                        // Set first image as cover if none exists
                        if (!imageUrls[ep.id] && allUrls.length > 0) {
                          await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [ep.id]: allUrls[0] }, { merge: true });
                          setImageUrls(u => ({ ...u, [ep.id]: allUrls[0] }));
                        }
                        setStatus(s => ({ ...s, [ep.id]: `✓ ${allUrls.length} photos` }));
                      } catch (err) { setStatus(s => ({ ...s, [ep.id]: err.message })); }
                      setGenerating(null);
                      e.target.value = '';
                    }} />
                  </label>
                </div>
                {/* Gallery thumbnails */}
                {(galleryUrls[ep.id] || []).length > 0 && (
                  <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                    {(galleryUrls[ep.id] || []).map((url, i) => (
                      <img key={i} src={url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionsPanel() {
  const [urls, setUrls] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [status, setStatus] = useState({});
  const [generating, setGenerating] = useState(null);
  const [search, setSearch] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [bulkVoice, setBulkVoice] = useState('george');
  const bulkAbort = useRef(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');

  const ELEVEN_VOICES = [
    { key: 'george', label: '🎭 George — Warm Storyteller' },
    { key: 'lily', label: '🌸 Lily — Velvety Actress' },
    { key: 'sarah', label: '✨ Sarah — Mature, Reassuring' },
    { key: 'brian', label: '🎵 Brian — Deep, Comforting' },
    { key: 'bill', label: '📖 Bill — Wise, Mature' },
    { key: 'muskaan', label: '🇮🇳 Muskaan — Hindi' },
    { key: 'alice', label: '📚 Alice — Clear Educator' },
    { key: 'river', label: '🌊 River — Relaxed, Neutral' },
    { key: 'jessica', label: '🌟 Jessica — Playful, Warm' },
  ];

  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectAll = () => setSelected(new Set(filtered.map(s => s.id)));
  const selectNone = () => setSelected(new Set());

  // Load collection stories + their audio/image URLs from Firestore
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomAudio'));
        if (snap.exists()) setUrls(snap.data());
        const imgSnap = await getDoc(doc(db, 'config', 'wisdomImages'));
        if (imgSnap.exists()) setImageUrls(imgSnap.data());
      } catch {}
    })();
  }, []);

  const allStories = COLLECTIONS_DATA.flatMap(c => c.stories.map(s => ({ ...s, collection: c.id, collectionTitle: c.title })));

  const filtered = allStories.filter(s => {
    if (collectionFilter !== 'all' && s.collection !== collectionFilter) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.includes(search)) return false;
    return true;
  });

  const cached = allStories.filter(s => urls[s.id]).length;
  const imagesCached = allStories.filter(s => imageUrls[s.id]).length;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const generateAudio = async (story, forceVoice) => {
    setGenerating(story.id);
    const voice = forceVoice || (['hindu', 'sikh', 'jain', 'buddhist'].includes(story.tradition) ? 'muskaan' : ['george', 'lily', 'sarah'][(story.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 3]);
    setStatus(s => ({ ...s, [story.id]: `11Labs: ${voice}...` }));
    try {
      const text = (story.body || '').replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{pet\}/g, 'their puppy');
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 10000), voice }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [story.id]: `Failed (${res.status})` })); setGenerating(null); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [story.id]: 'uploading...' }));
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-audio/${story.id}.mp3`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [story.id]: audioUrl }, { merge: true });
      setUrls(u => ({ ...u, [story.id]: audioUrl }));
      setStatus(s => ({ ...s, [story.id]: `✓ ${voice}` }));
    } catch (e) { setStatus(s => ({ ...s, [story.id]: e.message })); }
    setGenerating(null);
  };

  const generateImage = async (story) => {
    setGenerating(story.id + '_img');
    setStatus(s => ({ ...s, [story.id]: 'generating image...' }));
    try {
      let prompt;
      try {
        const { getStoryPrompt } = await import('../utils/imagePrompts.js');
        prompt = getStoryPrompt(story.id, 'thumbnail');
      } catch {
        prompt = `A children's storybook illustration for "${story.title}". Warm, colorful, bedtime style.`;
      }
      const res = await fetch(`${API_BASE}/api/generate-story-image`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [story.id]: `Image failed (${res.status})` })); setGenerating(null); return; }
      const data = await res.json();
      let imgBlob;
      if (data.imageBase64) {
        const bytes = Uint8Array.from(atob(data.imageBase64), c => c.charCodeAt(0));
        imgBlob = new Blob([bytes], { type: 'image/png' });
      } else if (data.imageUrl) {
        const imgRes = await fetch(data.imageUrl);
        imgBlob = await imgRes.blob();
      } else { setStatus(s => ({ ...s, [story.id]: 'No image data' })); setGenerating(null); return; }
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-images/${story.id}.png`);
      await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
      const permanentUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [story.id]: permanentUrl }, { merge: true });
      setImageUrls(u => ({ ...u, [story.id]: permanentUrl }));
      setStatus(s => ({ ...s, [story.id]: '✓ image' }));
    } catch (e) { setStatus(s => ({ ...s, [story.id]: e.message })); }
    setGenerating(null);
  };

  const bulkGenerate = async (type) => {
    bulkAbort.current = false;
    setBulkRunning(true);
    // Use selected stories if any, otherwise use filtered stories missing content
    const pool = selected.size > 0 ? filtered.filter(s => selected.has(s.id)) : filtered.filter(s => type === 'audio' ? !urls[s.id] : type === 'image' ? !imageUrls[s.id] : (!urls[s.id] || !imageUrls[s.id]));
    for (let i = 0; i < pool.length; i++) {
      if (bulkAbort.current) break;
      const s = pool[i];
      setBulkProgress(`${i + 1}/${pool.length}: ${s.title}`);
      if ((type === 'audio' || type === 'all')) { await generateAudio(s, bulkVoice); await new Promise(r => setTimeout(r, 1000)); }
      if (bulkAbort.current) break;
      if ((type === 'image' || type === 'all')) { await generateImage(s); await new Promise(r => setTimeout(r, 500)); }
    }
    setBulkProgress(bulkAbort.current ? 'Stopped' : `Done! ${pool.length} processed`);
    setBulkRunning(false);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-ink">{allStories.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Collection Stories</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-[#7ad9a1]">{cached}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Audio Ready</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-[#539df5]">{imagesCached}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Images Ready</div>
        </div>
        <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-white/5">
          <div className="text-2xl font-bold text-gold">{allStories.length - Math.min(cached, imagesCached)}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Incomplete</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
        <select value={collectionFilter} onChange={e => setCollectionFilter(e.target.value)}
          className="rounded-lg bg-bg-base px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/10">
          <option value="all">All Collections</option>
          {COLLECTIONS_DATA.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
          className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink outline-none ring-1 ring-white/10" />
        <span className="text-xs text-ink-dim">{filtered.length} stories</span>
      </div>

      {/* Bulk — Select + Voice + Generate */}
      <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-[#7ad9a1]/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#7ad9a1]">⚡ ElevenLabs Bulk Generate</span>
          <span className="text-[9px] text-ink-dim">{selected.size > 0 ? `${selected.size} selected` : 'All without audio'}</span>
        </div>

        {/* Selection controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={selectAll} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">Select All ({filtered.length})</button>
          <button onClick={selectNone} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">Select None</button>
          <button onClick={() => setSelected(new Set(filtered.filter(s => !urls[s.id]).map(s => s.id)))} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">Select Missing Audio</button>
        </div>

        {/* Voice picker */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-dim">Voice:</span>
          <select value={bulkVoice} onChange={e => setBulkVoice(e.target.value)}
            className="rounded-lg bg-bg-base px-3 py-2 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-white/10">
            {ELEVEN_VOICES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
          </select>
        </div>

        {/* Generate buttons — big, clear, separate */}
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={() => bulkGenerate('audio')} disabled={bulkRunning || !!generating}
            className="rounded-lg bg-[#7ad9a1] px-4 py-2.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-30">
            🔊 Generate Audio ({selected.size || filtered.filter(s => !urls[s.id]).length})
          </button>
          <button onClick={() => bulkGenerate('image')} disabled={bulkRunning || !!generating}
            className="rounded-lg bg-[#539df5] px-4 py-2.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-30">
            🖼️ Generate Images ({selected.size || filtered.filter(s => !imageUrls[s.id]).length})
          </button>
          <button onClick={() => bulkGenerate('all')} disabled={bulkRunning || !!generating}
            className="rounded-lg bg-[#f0a500] px-4 py-2.5 text-xs font-bold text-[#0a0a0f] disabled:opacity-30">
            All ({selected.size || filtered.filter(s => !urls[s.id] || !imageUrls[s.id]).length})
          </button>
          {bulkRunning && <button onClick={() => { bulkAbort.current = true; }} className="rounded-lg bg-red-400 px-4 py-2.5 text-xs font-bold text-[#0a0a0f]">⏹ Stop</button>}
        </div>
        {bulkProgress && <span className="text-[10px] text-[#7ad9a1]">{bulkProgress}</span>}
      </div>

      {/* Story list */}
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className={`rounded-xl bg-bg-elevated p-3 ring-1 ${selected.has(s.id) ? 'ring-[#7ad9a1]/40' : 'ring-white/5'}`}>
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button onClick={() => toggleSelect(s.id)}
                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded border transition ${selected.has(s.id) ? 'border-[#7ad9a1] bg-[#7ad9a1] text-[#0a0a0f]' : 'border-white/20 text-transparent'}`}>
                {selected.has(s.id) && <span className="text-[10px] font-bold">✓</span>}
              </button>
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg-base">
                {imageUrls[s.id] ? <img src={imageUrls[s.id]} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-lg opacity-30">🖼️</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-ink">{s.title}</div>
                <div className="text-[10px] text-ink-dim mt-0.5">{s.collectionTitle} · {s.tradition} · {s.durationMinutes}m</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {urls[s.id] ? <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Audio ✓</span>
                    : <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No audio</span>}
                  {imageUrls[s.id] ? <span className="rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1]">Image ✓</span>
                    : <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[8px] font-bold text-red-400">No image</span>}
                </div>
                {status[s.id] && <div className="text-[9px] text-gold mt-1">{status[s.id]}</div>}
              </div>
            </div>
            {/* Audio preview */}
            {urls[s.id] && <audio controls preload="none" src={urls[s.id]} className="w-full h-8 mt-2" style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.7 }} />}
            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => generateAudio(s)} disabled={!!generating}
                className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1] disabled:opacity-30">
                {generating === s.id ? '...' : urls[s.id] ? 'Re-gen Audio' : 'Gen Audio'}
              </button>
              <button onClick={() => generateImage(s)} disabled={!!generating}
                className="rounded-lg bg-[#539df5]/10 px-3 py-1.5 text-[10px] font-bold text-[#539df5] disabled:opacity-30">
                {generating === s.id + '_img' ? '...' : imageUrls[s.id] ? 'Re-gen Image' : 'Gen Image'}
              </button>
              <label className="rounded-lg bg-[#e8b4ff]/10 px-3 py-1.5 text-[10px] font-bold text-[#e8b4ff] cursor-pointer hover:bg-[#e8b4ff]/20">
                📤 Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setGenerating(s.id + '_upload'); setStatus(st => ({ ...st, [s.id]: 'uploading...' }));
                  try {
                    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
                    const { storage, db: fireDb } = await import('../lib/firebase.js');
                    const storageRef = ref(storage, `wisdom-images/${s.id}.png`);
                    await uploadBytes(storageRef, file, { contentType: file.type });
                    const url = await getDownloadURL(storageRef);
                    const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
                    await fset(fdoc(fireDb, 'config', 'wisdomImages'), { [s.id]: url }, { merge: true });
                    setImageUrls(u => ({ ...u, [s.id]: url })); setStatus(st => ({ ...st, [s.id]: '✓ uploaded' }));
                  } catch (err) { setStatus(st => ({ ...st, [s.id]: err.message })); }
                  setGenerating(null); e.target.value = '';
                }} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElevenLabsPanel({ filtered, urls, setUrls, generating, setGenerating, setStatus }) {
  const ELEVEN_VOICES = [
    { key: 'george', label: '🎭 George — Warm Storyteller (British)' },
    { key: 'lily', label: '🌸 Lily — Velvety Actress (British)' },
    { key: 'sarah', label: '✨ Sarah — Mature, Reassuring (American)' },
    { key: 'brian', label: '🎵 Brian — Deep, Comforting (American)' },
    { key: 'bill', label: '📖 Bill — Wise, Mature (American)' },
    { key: 'muskaan', label: '🇮🇳 Muskaan — Hindi (Indian)' },
    { key: 'alice', label: '📚 Alice — Clear Educator (British)' },
    { key: 'river', label: '🌊 River — Relaxed, Neutral' },
    { key: 'jessica', label: '🌟 Jessica — Playful, Warm' },
  ];

  const [bulkVoice, setBulkVoice] = useState('george');
  const [selected, setSelected] = useState(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const abortRef = useRef(false);

  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectAll = () => setSelected(new Set(filtered.map(s => s.id)));
  const selectNone = () => setSelected(new Set());
  const selectIndian = () => setSelected(new Set(filtered.filter(s => ['hindu', 'sikh', 'jain', 'buddhist'].includes(s.tradition)).map(s => s.id)));
  const selectMissing = () => setSelected(new Set(filtered.filter(s => !urls[s.id]).map(s => s.id)));

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const previewVoice = async (voice) => {
    setPreviewUrl(null);
    try {
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'That night, little one, remember: every act of kindness counts. Every grain. Every drop. Every soul.', voice }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {}
  };

  const generateOneEL = async (story, forceVoice) => {
    const voice = forceVoice || bulkVoice;
    const text = (story.body || '').replace(/\{childName\}/g, 'little one').replace(/\{sibling\}/g, 'their friend').replace(/\{pet\}/g, 'their puppy').replace(/\{grandfather\}/g, 'Dada ji').replace(/\{grandmother\}/g, 'Nani ma');
    if (!text || text.length < 50) return;

    setStatus(s => ({ ...s, [story.id]: `11Labs: ${voice}...` }));
    try {
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 10000), voice }),
      });
      if (!res.ok) { setStatus(s => ({ ...s, [story.id]: `11Labs failed (${res.status})` })); return; }
      const blob = await res.blob();
      setStatus(s => ({ ...s, [story.id]: 'uploading...' }));

      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const storageRef = ref(storage, `wisdom-audio/${story.id}.mp3`);
      await uploadBytes(storageRef, blob, { contentType: 'audio/mpeg' });
      const audioUrl = await getDownloadURL(storageRef);
      const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
      await fset(fdoc(fireDb, 'config', 'wisdomAudio'), { [story.id]: audioUrl }, { merge: true });
      setUrls(u => ({ ...u, [story.id]: audioUrl }));
      setStatus(s => ({ ...s, [story.id]: `✓ ${voice}` }));
    } catch (e) { setStatus(s => ({ ...s, [story.id]: e.message })); }
  };

  const bulkGenerateEL = async () => {
    abortRef.current = false;
    setBulkRunning(true);
    const targets = selected.size > 0 ? filtered.filter(l => selected.has(l.id)) : filtered.filter(l => !urls[l.id]);
    for (let i = 0; i < targets.length; i++) {
      if (abortRef.current) { setProgress('Stopped'); break; }
      const l = targets[i];
      setProgress(`${i + 1}/${targets.length}: ${l.title}`);
      setGenerating(l.id);
      await generateOneEL(l, bulkVoice);
      setGenerating(null);
      await new Promise(r => setTimeout(r, 1000)); // rate limit safety
    }
    if (!abortRef.current) setProgress(`Done! ${targets.length} stories`);
    setBulkRunning(false);
  };

  const missingCount = filtered.filter(l => !urls[l.id]).length;

  return (
    <div className="rounded-xl bg-bg-elevated p-4 ring-1 ring-[#7ad9a1]/20 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#7ad9a1]">⚡ ElevenLabs Premium Audio</span>
        <span className="text-[9px] text-ink-dim">{selected.size > 0 ? `${selected.size} selected` : `${missingCount} need audio`}</span>
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={selectIndian} className="rounded-lg bg-[#f0a500]/10 px-3 py-1.5 text-[10px] font-bold text-gold">🇮🇳 Select Indian</button>
        <button onClick={selectMissing} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">Select Missing</button>
        <button onClick={selectAll} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">All ({filtered.length})</button>
        <button onClick={selectNone} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-ink-muted ring-1 ring-white/10">None</button>
      </div>

      {/* Selected stories list */}
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {filtered.filter(l => selected.has(l.id)).map(l => (
            <span key={l.id} onClick={() => toggleSelect(l.id)}
              className="shrink-0 rounded-full bg-[#7ad9a1]/10 px-2 py-0.5 text-[8px] font-bold text-[#7ad9a1] cursor-pointer hover:bg-red-400/10 hover:text-red-400">
              {l.title.slice(0, 25)}{l.title.length > 25 ? '...' : ''} ✕
            </span>
          ))}
        </div>
      )}

      {/* Voice picker */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] text-ink-dim">Voice:</span>
        <select value={bulkVoice} onChange={e => setBulkVoice(e.target.value)}
          className="rounded-lg bg-bg-base px-3 py-2 text-[10px] font-bold text-[#7ad9a1] outline-none ring-1 ring-white/10">
          {ELEVEN_VOICES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
        </select>
        <button onClick={() => previewVoice(bulkVoice)}
          className="rounded-lg bg-[#7ad9a1]/10 px-3 py-1.5 text-[10px] font-bold text-[#7ad9a1]">
          Preview
        </button>
      </div>

      {/* Preview player */}
      {previewUrl && <audio controls src={previewUrl} className="w-full h-8" style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.7 }} />}

      {/* Generate button */}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={bulkGenerateEL} disabled={bulkRunning || !!generating}
          className="rounded-lg bg-[#7ad9a1] px-4 py-2 text-xs font-bold text-[#0a0a0f] hover:bg-[#6bc491] disabled:opacity-30">
          Generate with {ELEVEN_VOICES.find(v => v.key === bulkVoice)?.label.split('—')[0] || bulkVoice} ({selected.size || missingCount})
        </button>
        {bulkRunning && (
          <button onClick={() => { abortRef.current = true; }}
            className="rounded-lg bg-red-400/10 px-4 py-2 text-xs font-bold text-red-400">Stop</button>
        )}
        {progress && <span className="text-[10px] text-[#7ad9a1] truncate">{progress}</span>}
      </div>
    </div>
  );
}

function VoiceFeedbackPanel() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const snap = await getDocs(query(collection(db, 'voiceFeedback'), orderBy('createdAt', 'desc'), limit(100)));
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setFeedback(list);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-sm text-ink-dim">Loading feedback...</div>;
  if (feedback.length === 0) return <div className="rounded-2xl bg-bg-elevated p-6 text-center text-sm text-ink-dim">No voice feedback yet. Users will rate after stories finish playing.</div>;

  const avg = (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1);
  const byVoice = {};
  feedback.forEach(f => {
    const v = f.voice || 'AI Narrator';
    if (!byVoice[v]) byVoice[v] = { total: 0, count: 0 };
    byVoice[v].total += f.rating || 0;
    byVoice[v].count++;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-bg-elevated p-4">
        <h3 className="text-sm font-bold text-ink">Voice Quality Feedback</h3>
        <p className="text-xs text-ink-dim">{feedback.length} ratings · Avg: <span className="text-gold font-bold">{avg}/5</span></p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(byVoice).map(([voice, data]) => (
            <div key={voice} className="rounded-xl bg-bg-base px-3 py-2 ring-1 ring-white/5">
              <div className="text-[10px] font-bold text-ink">{voice}</div>
              <div className="text-[9px] text-ink-dim">{(data.total / data.count).toFixed(1)}/5 · {data.count} ratings</div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {feedback.slice(0, 50).map(f => (
          <div key={f.id} className="flex items-center gap-3 rounded-xl bg-bg-elevated px-3 py-2">
            <div className="text-lg">{f.rating >= 4 ? '🤩' : f.rating >= 3 ? '🙂' : '😕'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-ink truncate">{f.storyTitle}</div>
              <div className="text-[9px] text-ink-dim">{f.voice} · {f.tradition} · {f.language} · {f.country}</div>
            </div>
            <div className="text-sm font-bold text-gold">{f.rating}/5</div>
            <div className="text-[8px] text-ink-dim">{new Date(f.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EXPENSE TRACKER
// ═══════════════════════════════════════════════════════

const EXPENSE_DATA = [
  {
    month: 'April 2026',
    items: [
      { name: 'Claude Code Max Plan', amount: 150, category: 'AI', spender: 'Prat' },
      { name: 'OpenAI APIs (GPT + Image Gen)', amount: 85, category: 'AI', spender: 'Prat' },
      { name: 'ElevenLabs TTS API', amount: 22, category: 'AI', spender: 'Prat' },
      { name: 'Anthropic Claude API', amount: 45, category: 'AI', spender: 'Prat' },
      { name: 'AWS (S3 + CloudFront + Lambda)', amount: 50, category: 'Infra', spender: 'Prat' },
    ],
  },
  {
    month: 'May 2026',
    items: [
      { name: 'Claude Code Max Plan', amount: 150, category: 'AI', spender: 'Prat' },
      { name: 'OpenAI APIs (GPT + Image Gen)', amount: 120, category: 'AI', spender: 'Prat' },
      { name: 'ElevenLabs TTS API', amount: 22, category: 'AI', spender: 'Prat' },
      { name: 'Anthropic Claude API', amount: 60, category: 'AI', spender: 'Prat' },
      { name: 'AWS (S3 + CloudFront + Lambda)', amount: 50, category: 'Infra', spender: 'Prat' },
      { name: 'Bike for Brain — Event & Promotion', amount: 50, category: 'Marketing', spender: 'Prat' },
    ],
  },
  {
    month: 'June 2026',
    items: [
      { name: 'Claude Code Max Plan', amount: 150, category: 'AI', spender: 'Prat' },
      { name: 'OpenAI APIs (GPT + Image Gen)', amount: 100, category: 'AI', spender: 'Prat' },
      { name: 'ElevenLabs TTS API', amount: 22, category: 'AI', spender: 'Prat' },
      { name: 'Anthropic Claude API', amount: 50, category: 'AI', spender: 'Prat' },
      { name: 'Google Workspace', amount: 30, category: 'SaaS', spender: 'Prat' },
      { name: 'AWS (S3 + CloudFront + Lambda)', amount: 50, category: 'Infra', spender: 'Prat' },
      { name: 'UPS Printing A4 QR Code Scan (5)', amount: 9, category: 'Marketing', spender: 'Prat' },
      { name: 'Library Printing and Coffee Donuts', amount: 20, category: 'Marketing', spender: 'Deepti' },
      { name: 'Gemini Subscription — Image Gen & Thumbnails', amount: 30, category: 'AI', spender: 'Prat' },
      { name: 'Vista Print — Visiting Cards & Flyers', amount: 95.54, category: 'Marketing', spender: 'Prat' },
    ],
  },
];

const CAT_COLORS = { AI: '#9f7aea', Infra: '#4299e1', SaaS: '#48bb78', Marketing: '#f0a500' };

function ExpenseTracker() {
  const totalAll = EXPENSE_DATA.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.amount, 0), 0);
  const totalByCategory = {};
  EXPENSE_DATA.forEach(m => m.items.forEach(i => { totalByCategory[i.category] = (totalByCategory[i.category] || 0) + i.amount; }));

  // Receipt uploads
  const [receipts, setReceipts] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!db) return;
        const snap = await getDocs(collection(db, 'receipts'));
        const loaded = [];
        snap.forEach(d => loaded.push({ id: d.id, ...d.data() }));
        setReceipts(loaded.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || '')));
      } catch {}
    })();
  }, []);

  // Compress image before upload (max 1200px, JPEG 0.7 quality)
  const compressImage = (file) => new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file); // skip non-images (PDFs)
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width: w, height: h } = img;
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.7);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

  // expenseKey = "april-2026_3" (month slug + item index)
  const uploadReceipt = async (file, expenseKey) => {
    if (!file) return;
    setUploading(expenseKey);
    try {
      const compressed = await compressImage(file);
      const { storage } = await import('../lib/firebase.js');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const id = `receipt_${expenseKey}_${Date.now()}`;
      const ext = compressed.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `receipts/${id}.${ext}`);
      await uploadBytes(storageRef, compressed, { contentType: compressed.type });
      const url = await getDownloadURL(storageRef);
      const data = { id, expenseKey, url, fileName: compressed.name, fileType: compressed.type, uploadedAt: new Date().toISOString() };
      await setDoc(doc(db, 'receipts', id), data);
      setReceipts(prev => [data, ...prev]);
    } catch (e) { console.error('Receipt upload error:', e); alert('Upload failed: ' + e.message); }
    setUploading(false);
  };

  const deleteReceipt = async (r) => {
    if (!confirm('Delete this receipt?')) return;
    try {
      const { deleteDoc: fdel } = await import('firebase/firestore');
      await fdel(doc(db, 'receipts', r.id));
      setReceipts(prev => prev.filter(x => x.id !== r.id));
    } catch {}
  };

  const getReceiptsForExpense = (expenseKey) => receipts.filter(r => r.expenseKey === expenseKey);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/5">
          <div className="text-[10px] uppercase tracking-wider text-ink-dim">Total Spent</div>
          <div className="mt-1 text-2xl font-bold text-gold">CA${totalAll.toLocaleString()}</div>
          <div className="text-[10px] text-ink-dim">{EXPENSE_DATA.length} months</div>
        </div>
        {Object.entries(totalByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
          <div key={cat} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/5">
            <div className="text-[10px] uppercase tracking-wider text-ink-dim">{cat}</div>
            <div className="mt-1 text-xl font-bold" style={{ color: CAT_COLORS[cat] || '#f5f0e8' }}>CA${amount.toLocaleString()}</div>
            <div className="text-[10px] text-ink-dim">{Math.round(amount / totalAll * 100)}% of total</div>
          </div>
        ))}
      </div>

      {/* Monthly breakdown */}
      {EXPENSE_DATA.map((month) => {
        const monthTotal = month.items.reduce((s, i) => s + i.amount, 0);
        return (
          <div key={month.month} className="rounded-2xl bg-white/5 ring-1 ring-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-ink">{month.month}</h3>
              <span className="text-sm font-bold text-gold">CA${monthTotal}</span>
            </div>
            <div className="divide-y divide-white/5">
              {month.items.map((item, i) => {
                const key = `${month.month.toLowerCase().replace(/\s/g, '-')}_${i}`;
                const itemReceipts = getReceiptsForExpense(key);
                return (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: CAT_COLORS[item.category] || '#666' }} />
                      <span className="text-xs text-ink-muted">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer rounded-full bg-white/5 px-2 py-1 text-[9px] text-ink-dim hover:text-gold hover:bg-[#f0a500]/10 transition">
                        {uploading === key ? '...' : itemReceipts.length > 0 ? `🧾 ${itemReceipts.length}` : '+ Receipt'}
                        <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading === key}
                          onChange={(e) => { if (e.target.files?.[0]) uploadReceipt(e.target.files[0], key); e.target.value = ''; }} />
                      </label>
                      {item.spender && (
                        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-ink-muted">
                          {item.spender}
                        </span>
                      )}
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ background: (CAT_COLORS[item.category] || '#666') + '22', color: CAT_COLORS[item.category] || '#666' }}>
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-ink w-16 text-right">CA${item.amount}</span>
                    </div>
                  </div>
                  {itemReceipts.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {itemReceipts.map(r => (
                        <div key={r.id} className="group relative shrink-0">
                          {r.fileType?.startsWith('image') ? (
                            <a href={r.url} target="_blank" rel="noreferrer">
                              <img src={r.url} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/10" />
                            </a>
                          ) : (
                            <a href={r.url} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-elevated ring-1 ring-white/10 text-lg">📄</a>
                          )}
                          <button onClick={() => deleteReceipt(r)}
                            className="absolute -top-1 -right-1 hidden group-hover:grid h-4 w-4 place-items-center rounded-full bg-[#f3727f] text-[8px] text-white">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
            {/* Month bar chart */}
            <div className="px-5 py-3 border-t border-white/5 flex gap-1 h-3 rounded-b-2xl overflow-hidden">
              {month.items.map((item, i) => (
                <div key={i} className="rounded-full" style={{ flex: item.amount, background: CAT_COLORS[item.category] || '#666', opacity: 0.7 }} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Average monthly */}
      <div className="rounded-2xl bg-[#f0a500]/10 ring-1 ring-gold/20 px-5 py-4 text-center">
        <div className="text-[10px] uppercase tracking-wider text-gold">Average Monthly Burn</div>
        <div className="mt-1 text-2xl font-bold text-gold">CA${Math.round(totalAll / EXPENSE_DATA.length)}/mo</div>
      </div>

      {/* Total receipts count */}
      {receipts.length > 0 && (
        <div className="text-center text-[10px] text-ink-dim">
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} uploaded
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TASK BOARD — Daily Task Management
// ═══════════════════════════════════════════════════════

const ACTIVITIES = [
  { key: 'content', label: 'Content', icon: '📝', color: '#9f7aea' },
  { key: 'marketing', label: 'Marketing', icon: '📣', color: '#f0a500' },
  { key: 'tech', label: 'Tech', icon: '💻', color: '#4299e1' },
  { key: 'design', label: 'Design', icon: '🎨', color: '#f472b6' },
  { key: 'ops', label: 'Operations', icon: '⚙️', color: '#48bb78' },
  { key: 'outreach', label: 'Outreach', icon: '🤝', color: '#ed8936' },
];

const TASK_STATUS = [
  { key: 'todo', label: 'To Do', color: '#6e6a63' },
  { key: 'in_progress', label: 'In Progress', color: '#f0a500' },
  { key: 'done', label: 'Done', color: '#48bb78' },
  { key: 'blocked', label: 'Blocked', color: '#f3727f' },
];

function TaskBoard({ team = [], adminEmails = [] }) {
  // Combine admins + team into one assignee list (deduplicated)
  const allAssignees = useMemo(() => {
    const map = new Map();
    adminEmails.forEach(e => map.set(e, { email: e, name: e.split('@')[0], source: 'admin' }));
    team.filter(m => m.status === 'active').forEach(m => {
      if (!map.has(m.email)) map.set(m.email, { email: m.email, name: m.name || m.email.split('@')[0], source: 'team' });
    });
    return [...map.values()];
  }, [adminEmails, team]);
  const [tasks, setTasks] = useState([]);
  const getLocalDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const [selectedDate, setSelectedDate] = useState(getLocalDate);
  const [viewMode, setViewMode] = useState('day'); // day | week | month
  const [filterActivity, setFilterActivity] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [emailPreview, setEmailPreview] = useState(null);
  const [editingTask, setEditingTask] = useState(null); // task being edited

  const [newTask, setNewTask] = useState({ title: '', description: '', activity: 'content', assignee: '', priority: 'normal', status: 'todo' });

  useEffect(() => {
    (async () => {
      try {
        if (!db) return;
        const snap = await getDocs(collection(db, 'dailyTasks'));
        const loaded = [];
        snap.forEach(d => loaded.push({ id: d.id, ...d.data() }));
        setTasks(loaded);
      } catch {}
    })();
  }, []);

  const saveTask = async (task) => {
    const id = task.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const data = { ...task, id, updatedAt: new Date().toISOString() };
    if (!task.createdAt) data.createdAt = new Date().toISOString();
    try {
      if (!db) { console.error('Save task: db is null'); return; }
      console.log('[TaskBoard] Saving task:', id, data.title, data.dueDate);
      await setDoc(doc(db, 'dailyTasks', id), data, { merge: true });
      console.log('[TaskBoard] Saved OK');
    } catch (e) {
      console.error('[TaskBoard] Firestore save failed:', e.message);
      // Fallback: still add to local state even if Firestore fails
    }
    setTasks(prev => {
      const exists = prev.find(t => t.id === id);
      return exists ? prev.map(t => t.id === id ? data : t) : [...prev, data];
    });
    return data;
  };

  const deleteTask = async (id) => {
    try {
      if (!db) return;
      const { deleteDoc: fdel } = await import('firebase/firestore');
      await fdel(doc(db, 'dailyTasks', id));
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {}
  };

  // Date range helpers for week/month views
  const getDateRange = useMemo(() => {
    const sel = new Date(selectedDate + 'T12:00:00');
    if (viewMode === 'day') return { start: selectedDate, end: selectedDate };
    if (viewMode === 'week') {
      const day = sel.getDay();
      const mon = new Date(sel); mon.setDate(sel.getDate() - ((day + 6) % 7)); // Monday
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      return { start: mon.toISOString().slice(0, 10), end: sun.toISOString().slice(0, 10) };
    }
    // month
    const first = new Date(sel.getFullYear(), sel.getMonth(), 1);
    const last = new Date(sel.getFullYear(), sel.getMonth() + 1, 0);
    return { start: first.toISOString().slice(0, 10), end: last.toISOString().slice(0, 10) };
  }, [selectedDate, viewMode]);

  const dayTasks = tasks
    .filter(t => t.dueDate >= getDateRange.start && t.dueDate <= getDateRange.end)
    .filter(t => filterActivity === 'all' || t.activity === filterActivity)
    .filter(t => filterAssignee === 'all' || t.assignee === filterAssignee)
    .sort((a, b) => {
      const pri = { urgent: 0, high: 1, normal: 2, low: 3 };
      if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      return (pri[a.priority] || 2) - (pri[b.priority] || 2);
    });

  // For week/month views — group tasks by date
  const tasksByDate = useMemo(() => {
    if (viewMode === 'day') return null;
    const grouped = {};
    dayTasks.forEach(t => {
      if (!grouped[t.dueDate]) grouped[t.dueDate] = [];
      grouped[t.dueDate].push(t);
    });
    return grouped;
  }, [dayTasks, viewMode]);

  const byAssignee = {};
  dayTasks.forEach(t => {
    const key = t.assignee || 'Unassigned';
    if (!byAssignee[key]) byAssignee[key] = [];
    byAssignee[key].push(t);
  });

  const totalToday = dayTasks.length;
  const doneToday = dayTasks.filter(t => t.status === 'done').length;
  const inProgress = dayTasks.filter(t => t.status === 'in_progress').length;

  const generateEmailBrief = () => {
    const briefs = {};
    dayTasks.forEach(t => {
      const assignee = t.assignee || 'Unassigned';
      if (!briefs[assignee]) briefs[assignee] = [];
      briefs[assignee].push(t);
    });
    const emails = Object.entries(briefs).map(([email, memberTasks]) => {
      const member = allAssignees.find(m => m.email === email);
      const name = member?.name || email.split('@')[0] || email;
      const actIcon = (key) => ACTIVITIES.find(a => a.key === key)?.icon || '';
      const priFlag = (p) => p === 'urgent' ? ' [URGENT]' : p === 'high' ? ' [HIGH]' : '';
      const taskLines = memberTasks.map((t, i) =>
        `${i + 1}. ${actIcon(t.activity)} [${t.activity.toUpperCase()}]${priFlag(t.priority)} ${t.title}${t.description ? '\n   ' + t.description : ''}`
      ).join('\n');
      return {
        to: email, name,
        subject: `Your Tasks for ${new Date(selectedDate).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })} — My Sleepy Tale`,
        body: `Good morning ${name}!\n\nHere are your tasks for today:\n\n${taskLines}\n\n---\nTotal: ${memberTasks.length} tasks\nPlease update status by end of day.\nReply to this email with your updates.\n\n— My Sleepy Tale Team`,
      };
    });
    setEmailPreview(emails);
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(`To: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`);
    alert(`Copied email for ${email.name}`);
  };

  const shiftDate = (dir) => {
    const d = new Date(selectedDate + 'T12:00:00');
    if (viewMode === 'day') d.setDate(d.getDate() + dir);
    else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const carryIncomplete = async () => {
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const target = tomorrow.toISOString().slice(0, 10);
    const incomplete = dayTasks.filter(t => t.status !== 'done');
    for (const t of incomplete) {
      await saveTask({ ...t, id: null, dueDate: target, status: 'todo', createdAt: null });
    }
    alert(`${incomplete.length} tasks carried to ${target}`);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await saveTask({ ...newTask, dueDate: selectedDate });
    setNewTask({ title: '', description: '', activity: 'content', assignee: '', priority: 'normal', status: 'todo' });
    setShowAddForm(false);
  };

  const handleUpdateStatus = async (task, status) => {
    await saveTask({ ...task, status, completedAt: status === 'done' ? new Date().toISOString() : null });
  };

  return (
    <div className="space-y-5">
      {/* View mode toggle */}
      <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit ring-1 ring-white/10">
        {['day', 'week', 'month'].map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${viewMode === m ? 'bg-[#f0a500] text-[#0f0f17]' : 'text-ink-dim hover:text-ink'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Date nav + stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-ink-muted hover:text-ink">&larr;</button>
          {viewMode === 'day' ? (
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-ink border border-white/10 outline-none" />
          ) : (
            <span className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-ink border border-white/10">
              {viewMode === 'week'
                ? `${new Date(getDateRange.start + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date(getDateRange.end + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </span>
          )}
          <button onClick={() => shiftDate(1)} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-ink-muted hover:text-ink">&rarr;</button>
          <button onClick={() => { setSelectedDate(getLocalDate()); setViewMode('day'); }} className="rounded-lg bg-[#f0a500]/15 px-3 py-2 text-xs font-bold text-gold">Today</button>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-ink-dim">{totalToday} tasks</span>
          <span className="text-gold">{inProgress} in progress</span>
          <span className="text-[#48bb78]">{doneToday} done</span>
          {totalToday > 0 && <span className="text-ink font-bold">{Math.round(doneToday / totalToday * 100)}%</span>}
        </div>
      </div>

      {/* Filters + actions */}
      <div className="flex flex-wrap gap-2">
        <select value={filterActivity} onChange={e => setFilterActivity(e.target.value)}
          className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink border border-white/10 outline-none">
          <option value="all">All Activities</option>
          {ACTIVITIES.map(a => <option key={a.key} value={a.key}>{a.icon} {a.label}</option>)}
        </select>
        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
          className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink border border-white/10 outline-none">
          <option value="all">All Team</option>
          {allAssignees.map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setShowAddForm(!showAddForm)} className="rounded-lg bg-[#f0a500] px-4 py-2 text-xs font-bold text-[#0f0f17]">+ Add Task</button>
        <button onClick={generateEmailBrief} className="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-gold ring-1 ring-gold/30">Morning Brief</button>
        <button onClick={carryIncomplete} className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink-muted ring-1 ring-white/10">Carry &rarr;</button>
      </div>

      {/* Add task form */}
      {showAddForm && (
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 space-y-3">
          <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title..."
            className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-ink border border-white/10 outline-none placeholder:text-[#4a4a5a]"
            onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }} />
          <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description (optional)..."
            className="w-full rounded-lg bg-white/5 px-4 py-2 text-xs text-ink-muted border border-white/10 outline-none resize-none h-16 placeholder:text-[#4a4a5a]" />
          <div className="flex flex-wrap gap-2">
            <select value={newTask.activity} onChange={e => setNewTask({ ...newTask, activity: e.target.value })}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink border border-white/10 outline-none">
              {ACTIVITIES.map(a => <option key={a.key} value={a.key}>{a.icon} {a.label}</option>)}
            </select>
            <select value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink border border-white/10 outline-none">
              <option value="">Assign to...</option>
              {allAssignees.map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs text-ink border border-white/10 outline-none">
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            <button onClick={handleAddTask} className="rounded-lg bg-[#f0a500] px-6 py-2 text-xs font-bold text-[#0f0f17]">Add</button>
            <button onClick={() => setShowAddForm(false)} className="rounded-lg bg-white/5 px-4 py-2 text-xs text-ink-dim">Cancel</button>
          </div>
        </div>
      )}

      {/* Empty state (day view) */}
      {viewMode === 'day' && Object.keys(byAssignee).length === 0 && (
        <div className="rounded-2xl bg-white/5 p-10 text-center ring-1 ring-white/5">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-ink-dim">No tasks for {selectedDate}</p>
          <button onClick={() => setShowAddForm(true)} className="mt-3 rounded-lg bg-[#f0a500]/15 px-4 py-2 text-xs font-bold text-gold">Add first task</button>
        </div>
      )}

      {/* Week/month: date section headers with per-date grouping */}
      {viewMode !== 'day' && tasksByDate && Object.keys(tasksByDate).length > 0 && (
        <div className="space-y-4">
          {Object.entries(tasksByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dateTasks]) => {
            const dateDone = dateTasks.filter(t => t.status === 'done').length;
            const isToday = date === getLocalDate();
            const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold ${isToday ? 'text-gold' : 'text-ink-dim'}`}>
                    {isToday ? 'Today' : dateLabel}
                  </span>
                  <span className="text-[10px] text-ink-dim">{date}</span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] font-bold text-[#48bb78]">{dateDone}/{dateTasks.length}</span>
                  {dateTasks.length > 0 && (
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#48bb78]" style={{ width: `${Math.round(dateDone / dateTasks.length * 100)}%` }} />
                    </div>
                  )}
                </div>
                {(() => {
                  const dateByAssignee = {};
                  dateTasks.forEach(t => {
                    const key = t.assignee || 'Unassigned';
                    if (!dateByAssignee[key]) dateByAssignee[key] = [];
                    dateByAssignee[key].push(t);
                  });
                  return Object.entries(dateByAssignee).map(([assignee, memberTasks]) => {
                    const member = allAssignees.find(m => m.email === assignee);
                    const name = member?.name || assignee.split('@')[0] || 'Unassigned';
                    return (
                      <div key={`${date}-${assignee}`} className="rounded-xl bg-white/5 ring-1 ring-white/5 overflow-hidden mb-2 ml-4">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                          <span className="text-xs font-bold text-ink">👤 {name}</span>
                          <span className="text-[9px] text-[#48bb78]">{memberTasks.filter(t => t.status === 'done').length}/{memberTasks.length}</span>
                        </div>
                        <div className="divide-y divide-white/5">
                          {memberTasks.map(task => {
                            const act = ACTIVITIES.find(a => a.key === task.activity);
                            const sta = TASK_STATUS.find(s => s.key === task.status);
                            return (
                              <div key={task.id} className={`flex items-center gap-2 px-4 py-2 ${task.status === 'done' ? 'opacity-50' : ''}`}>
                                <button onClick={() => {
                                  const order = ['todo', 'in_progress', 'done'];
                                  handleUpdateStatus(task, order[(order.indexOf(task.status) + 1) % order.length]);
                                }} className="shrink-0 grid h-4 w-4 place-items-center rounded-full"
                                  style={{ border: `2px solid ${sta?.color}`, background: task.status === 'done' ? '#48bb78' : 'transparent' }}>
                                  {task.status === 'done' && <span className="text-[8px] text-white">✓</span>}
                                </button>
                                <span className={`text-xs flex-1 ${task.status === 'done' ? 'line-through text-ink-dim' : 'text-ink'}`}>{task.title}</span>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: (act?.color || '#666') + '22', color: act?.color || '#666' }}>{act?.icon}</span>
                                {task.priority === 'urgent' && <span className="text-[8px] text-[#f3727f] font-bold">!</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* Day view: Task list grouped by assignee */}
      {viewMode === 'day' && Object.entries(byAssignee).map(([assignee, memberTasks]) => {
        const member = allAssignees.find(m => m.email === assignee);
        const name = member?.name || assignee.split('@')[0] || 'Unassigned';
        const memberDone = memberTasks.filter(t => t.status === 'done').length;
        return (
          <div key={assignee} className="rounded-2xl bg-white/5 ring-1 ring-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">👤</span>
                <span className="text-sm font-bold text-ink">{name}</span>
                <span className="text-[10px] text-ink-dim">{assignee}</span>
              </div>
              <span className="text-[10px] font-bold text-[#48bb78]">{memberDone}/{memberTasks.length} done</span>
            </div>
            <div className="divide-y divide-white/5">
              {memberTasks.map(task => {
                const act = ACTIVITIES.find(a => a.key === task.activity);
                const sta = TASK_STATUS.find(s => s.key === task.status);
                // Inline edit mode
                if (editingTask?.id === task.id) {
                  const e = editingTask;
                  return (
                    <div key={task.id} className="px-5 py-3 space-y-2 bg-[#f0a500]/5">
                      <input value={e.title} onChange={ev => setEditingTask({ ...e, title: ev.target.value })}
                        className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-ink border border-gold/30 outline-none" />
                      <textarea value={e.description || ''} onChange={ev => setEditingTask({ ...e, description: ev.target.value })}
                        className="w-full rounded-lg bg-white/5 px-3 py-1.5 text-xs text-ink-muted border border-white/10 outline-none resize-none h-12" placeholder="Description..." />
                      <div className="flex flex-wrap gap-2">
                        <select value={e.activity} onChange={ev => setEditingTask({ ...e, activity: ev.target.value })}
                          className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink border border-white/10 outline-none">
                          {ACTIVITIES.map(a => <option key={a.key} value={a.key}>{a.icon} {a.label}</option>)}
                        </select>
                        <select value={e.assignee} onChange={ev => setEditingTask({ ...e, assignee: ev.target.value })}
                          className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink border border-white/10 outline-none">
                          <option value="">Unassigned</option>
                          {allAssignees.map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
                        </select>
                        <select value={e.priority} onChange={ev => setEditingTask({ ...e, priority: ev.target.value })}
                          className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink border border-white/10 outline-none">
                          <option value="urgent">Urgent</option>
                          <option value="high">High</option>
                          <option value="normal">Normal</option>
                          <option value="low">Low</option>
                        </select>
                        <select value={e.status} onChange={ev => setEditingTask({ ...e, status: ev.target.value })}
                          className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink border border-white/10 outline-none">
                          {TASK_STATUS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                        <input type="date" value={e.dueDate || ''} onChange={ev => setEditingTask({ ...e, dueDate: ev.target.value })}
                          className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink border border-white/10 outline-none" />
                        <button onClick={async () => { await saveTask(e); setEditingTask(null); }}
                          className="rounded-lg bg-[#f0a500] px-4 py-1.5 text-xs font-bold text-[#0f0f17]">Save</button>
                        <button onClick={() => setEditingTask(null)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-ink-dim">Cancel</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={task.id} className={`flex items-start gap-3 px-5 py-3 ${task.status === 'done' ? 'opacity-50' : ''}`}>
                    <button onClick={() => {
                      const order = ['todo', 'in_progress', 'done'];
                      const next = order[(order.indexOf(task.status) + 1) % order.length];
                      handleUpdateStatus(task, next);
                    }} className="mt-0.5 shrink-0 grid h-5 w-5 place-items-center rounded-full transition"
                      style={{ border: `2px solid ${sta?.color}`, background: task.status === 'done' ? '#48bb78' : 'transparent' }}>
                      {task.status === 'done' && <span className="text-[10px] text-white">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingTask({ ...task })}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${task.status === 'done' ? 'line-through text-ink-dim' : 'text-ink'}`}>{task.title}</span>
                        {task.priority === 'urgent' && <span className="text-[9px] bg-[#f3727f]/20 text-[#f3727f] px-1.5 rounded-full font-bold">URGENT</span>}
                        {task.priority === 'high' && <span className="text-[9px] bg-[#f0a500]/20 text-gold px-1.5 rounded-full font-bold">HIGH</span>}
                      </div>
                      {task.description && <p className="text-[11px] text-ink-dim mt-0.5">{task.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: (act?.color || '#666') + '22', color: act?.color || '#666' }}>
                          {act?.icon} {act?.label}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: (sta?.color || '#666') + '22', color: sta?.color || '#666' }}>
                          {sta?.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => setEditingTask({ ...task })} className="text-[10px] text-ink-dim hover:text-gold">✎</button>
                      <button onClick={() => { if (confirm('Delete?')) deleteTask(task.id); }} className="text-[10px] text-ink-dim hover:text-[#f3727f]">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Week/month empty state */}
      {viewMode !== 'day' && (!tasksByDate || Object.keys(tasksByDate).length === 0) && (
        <div className="rounded-2xl bg-white/5 p-10 text-center ring-1 ring-white/5">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-ink-dim">No tasks for this {viewMode}</p>
        </div>
      )}

      {/* Email preview modal */}
      {emailPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEmailPreview(null)}>
          <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-bg-elevated p-6 ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gold">Morning Brief — {selectedDate}</h3>
              <button onClick={() => setEmailPreview(null)} className="text-ink-dim hover:text-ink">✕</button>
            </div>
            {emailPreview.length === 0 && <p className="text-sm text-ink-dim">No tasks assigned for today.</p>}
            {emailPreview.map((email, i) => (
              <div key={i} className="mb-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-ink">{email.name}</p>
                    <p className="text-[10px] text-ink-dim">{email.to}</p>
                  </div>
                  <button onClick={() => copyEmail(email)} className="rounded-lg bg-[#f0a500] px-3 py-1.5 text-[10px] font-bold text-[#0f0f17]">Copy</button>
                </div>
                <p className="text-[10px] font-bold text-gold mb-1">{email.subject}</p>
                <pre className="text-[11px] text-ink-muted whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
              </div>
            ))}
            <button onClick={async () => {
              try {
                const resp = await fetch('/api/morning-email', { method: 'POST' });
                const data = await resp.json();
                alert(`Sent ${data.sent}/${data.total} emails via SES`);
              } catch (e) { alert('Send failed: ' + e.message); }
            }} className="w-full rounded-lg bg-[#f0a500] py-3 text-sm font-bold text-[#0f0f17] mt-2">
              Send All via Email (SES)
            </button>
            <button onClick={() => {
              emailPreview.forEach(e => {
                window.open(`mailto:${e.to}?subject=${encodeURIComponent(e.subject)}&body=${encodeURIComponent(e.body)}`);
              });
            }} className="w-full rounded-lg bg-white/5 py-3 text-sm font-bold text-ink-muted mt-2 ring-1 ring-white/10">
              Open in Gmail Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OUTREACH DATABASE
// ═══════════════════════════════════════════════════════

const OUTREACH_STATUS_OPTIONS = ['new', 'contacted', 'responded', 'signed_up', 'paid', 'not_interested'];
const OUTREACH_STATUS_LABELS = { new: 'New', contacted: 'Contacted', responded: 'Responded', signed_up: 'Signed Up', paid: 'Paid', not_interested: 'Not Interested' };
const OUTREACH_STATUS_BADGE = { new: '#6e6a63', contacted: '#4299e1', responded: '#f0a500', signed_up: '#48bb78', paid: '#9f7aea', not_interested: '#f3727f' };
const OUTREACH_SOURCE_LABELS = { sheet1: 'Sheet 1', meta_leads: 'Meta Leads', google_registration: 'Google Reg' };

function OutreachDatabase() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(null);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, responded: 0, signed_up: 0, paid: 0, not_interested: 0 });
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 100;

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'outreachLeads'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        all.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
        setLeads(all);
        const s = { total: all.length, new: 0, contacted: 0, responded: 0, signed_up: 0, paid: 0, not_interested: 0 };
        all.forEach(l => { s[l.status] = (s[l.status] || 0) + 1; });
        setStats(s);
      } catch (e) { console.error('Outreach load error:', e); }
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (lead, newStatus) => {
    try {
      const updates = { status: newStatus };
      if (newStatus === 'contacted') { updates.outreachSent = true; updates.outreachSentAt = new Date().toISOString(); }
      if (newStatus === 'signed_up') { updates.signedUp = true; updates.signedUpAt = new Date().toISOString(); }
      if (newStatus === 'paid') { updates.isPaid = true; updates.paidAt = new Date().toISOString(); }
      await updateDoc(doc(db, 'outreachLeads', lead.id), updates);
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, ...updates } : l));
      setStats(prev => {
        const next = { ...prev };
        next[lead.status] = Math.max(0, (next[lead.status] || 0) - 1);
        next[newStatus] = (next[newStatus] || 0) + 1;
        return next;
      });
    } catch (e) { alert('Update failed: ' + e.message); }
  };

  const sendOutreach = async (lead) => {
    setSending(lead.id);
    try {
      const resp = await fetch('/api/outreach-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: lead.email, contactName: lead.firstName, businessName: '' }),
      });
      const data = await resp.json();
      if (data.sent) {
        await updateStatus(lead, 'contacted');
      } else {
        alert(data.message || 'Failed to send');
      }
    } catch (e) { alert('Send failed: ' + e.message); }
    setSending(null);
  };

  const filtered = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.firstName || '').toLowerCase().includes(q) ||
        (l.lastName || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.phone || '').includes(q);
    }
    return true;
  });

  if (loading) return <div className="text-center py-20 text-ink-dim">Loading outreach database...</div>;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
        {[
          { key: 'all', label: 'Total', count: stats.total, color: '#f5f0e8' },
          ...OUTREACH_STATUS_OPTIONS.map(s => ({ key: s, label: OUTREACH_STATUS_LABELS[s], count: stats[s] || 0, color: OUTREACH_STATUS_BADGE[s] })),
        ].map(s => (
          <button key={s.key} onClick={() => { setFilter(s.key); setPage(0); }}
            className={`rounded-2xl p-3 ring-1 text-center transition ${filter === s.key ? 'ring-gold bg-[#f0a500]/10' : 'ring-white/5 bg-white/5'}`}>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[10px] text-ink-dim mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Funnel bar */}
      <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-white/5">
        {OUTREACH_STATUS_OPTIONS.filter(s => stats[s] > 0).map(s => (
          <div key={s} className="rounded-full" style={{ flex: stats[s], background: OUTREACH_STATUS_BADGE[s], opacity: 0.8 }} title={`${OUTREACH_STATUS_LABELS[s]}: ${stats[s]}`} />
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input type="text" placeholder="Search by name, email, phone..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm text-ink placeholder-[#6e6a63] ring-1 ring-white/10 focus:ring-gold outline-none" />
        <div className="text-xs text-ink-dim self-center whitespace-nowrap">{filtered.length} leads</div>
      </div>

      {/* Lead list */}
      <div className="space-y-2">
        {filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(lead => (
          <div key={lead.id} className="rounded-2xl bg-white/5 ring-1 ring-white/5 overflow-hidden">
            <div className="px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-ink truncate">{lead.firstName} {lead.lastName}</span>
                    <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ background: OUTREACH_STATUS_BADGE[lead.status] + '22', color: OUTREACH_STATUS_BADGE[lead.status] }}>
                      {OUTREACH_STATUS_LABELS[lead.status] || lead.status}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] text-ink-dim">
                      {OUTREACH_SOURCE_LABELS[lead.source] || lead.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-ink-dim">
                    <span>{lead.email}</span>
                    {lead.phone && <span>{lead.phone}</span>}
                    {lead.postalCode && <span>{lead.postalCode}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={lead.status} onChange={e => updateStatus(lead, e.target.value)}
                    className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ink-muted ring-1 ring-white/10 outline-none cursor-pointer">
                    {OUTREACH_STATUS_OPTIONS.map(s => <option key={s} value={s}>{OUTREACH_STATUS_LABELS[s]}</option>)}
                  </select>
                  {lead.status === 'new' && (
                    <button onClick={() => sendOutreach(lead)} disabled={sending === lead.id}
                      className="rounded-lg bg-[#f0a500]/20 px-3 py-1 text-[10px] font-bold text-gold hover:bg-[#f0a500]/30 transition disabled:opacity-50">
                      {sending === lead.id ? 'Sending...' : 'Send Email'}
                    </button>
                  )}
                  {lead.outreachSentAt && (
                    <span className="text-[9px] text-ink-dim">
                      Sent {new Date(lead.outreachSentAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 py-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-ink-muted ring-1 ring-white/10 disabled:opacity-30">
              Previous
            </button>
            <span className="text-xs text-ink-dim">
              Page {page + 1} of {Math.ceil(filtered.length / PAGE_SIZE)} ({filtered.length} leads)
            </span>
            <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PAGE_SIZE) - 1, p + 1))}
              disabled={(page + 1) * PAGE_SIZE >= filtered.length}
              className="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-ink-muted ring-1 ring-white/10 disabled:opacity-30">
              Next
            </button>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="text-center text-ink-dim py-12">No leads found</div>
        )}
      </div>
    </div>
  );
}
