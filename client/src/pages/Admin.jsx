import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { RELIGIONS } from '../utils/constants.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';

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
  } = useAdmin();

  const [newAdminEmail, setNewAdminEmail] = useState('');
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
  // Cost estimate: ~$0.015/1K chars for TTS, ~4500 words = 27K chars per 30 min ≈ $0.40/30min
  const COST_PER_MINUTE = 0.013; // estimated blended cost with ElevenLabs
  const estimatedCost = (totalMinutesAll * COST_PER_MINUTE).toFixed(2);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'users', label: `Users (${allUsers.length})`, icon: '👤' },
    { key: 'usage', label: 'Usage & Costs', icon: '💰' },
    { key: 'emails', label: `Emails (${allEmails.length})`, icon: '📧' },
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
              <BigStat label="Est. API cost" value={`$${estimatedCost}`} icon="💰" />
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
              <BigStat label="Est. API cost" value={`$${estimatedCost}`} icon="💰" />
            </div>

            {/* Cost breakdown note */}
            <div className="rounded-2xl bg-[#1a1a28] p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a8a39a]">
                Cost estimation basis
              </h3>
              <div className="grid gap-4 text-xs text-[#a8a39a] sm:grid-cols-3">
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">ElevenLabs TTS</div>
                  <div className="mt-1 font-bold text-[#f5f0e8]">~$0.40 / 30 min story</div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Claude API (story gen)</div>
                  <div className="mt-1 font-bold text-[#f5f0e8]">~$0.02 / story</div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#6e6a63]">Blended per minute</div>
                  <div className="mt-1 font-bold text-[#f0a500]">~$0.013 / min</div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#6e6a63]">
                These are estimates based on ElevenLabs Starter plan + Claude Sonnet pricing.
                Actual costs depend on voice quality tier, caching, and story length distribution.
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
                        const cost = (minutes * COST_PER_MINUTE).toFixed(2);
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
                            <td className="px-4 py-3 text-center text-xs font-bold text-[#f0a500]">${cost}</td>
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
                      <td className="px-4 py-3 text-center text-[#f0a500]">${estimatedCost}</td>
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
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg user = 30 min / month</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    ${(30 * COST_PER_MINUTE).toFixed(2)} <span className="text-xs text-[#6e6a63]">cost / user / mo</span>
                  </div>
                  <div className="mt-1 text-xs text-[#7ad9a1]">
                    ₹299/mo plan → ₹{Math.round(299 - 30 * COST_PER_MINUTE * 85)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg user = 60 min / month</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    ${(60 * COST_PER_MINUTE).toFixed(2)} <span className="text-xs text-[#6e6a63]">cost / user / mo</span>
                  </div>
                  <div className="mt-1 text-xs text-[#7ad9a1]">
                    ₹299/mo plan → ₹{Math.round(299 - 60 * COST_PER_MINUTE * 85)} margin
                  </div>
                </div>
                <div className="rounded-xl bg-[#0f0f17] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#6e6a63]">If avg user = 120 min / month</div>
                  <div className="mt-1 text-lg font-bold text-[#f5f0e8]">
                    ${(120 * COST_PER_MINUTE).toFixed(2)} <span className="text-xs text-[#6e6a63]">cost / user / mo</span>
                  </div>
                  <div className="mt-1 text-xs text-[#ffa42b]">
                    ₹299/mo plan → ₹{Math.round(299 - 120 * COST_PER_MINUTE * 85)} margin
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#6e6a63]">
                Margins assume ₹85/$1 exchange rate. Real margins improve with story caching
                (repeat plays don't regenerate) and free-tier pre-written stories (zero API cost).
              </p>
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
                  a.download = `qissaa-users-${new Date().toISOString().slice(0, 10)}.csv`;
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
