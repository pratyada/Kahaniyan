import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { RELIGIONS } from '../utils/constants.js';

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

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin, loadUsers]);

  if (loading) return null;
  if (!isAdmin) {
    return (
      <PageTransition className="page-scroll flex items-center justify-center px-5 pt-20">
        <div className="card-elevated text-center">
          <div className="mb-3 text-4xl">🔒</div>
          <h1 className="font-display text-xl font-bold text-ink">Access denied</h1>
          <p className="mt-2 text-sm text-ink-muted">
            You are not an admin. Contact the app owner.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary mt-5">
            Back to app
          </button>
        </div>
      </PageTransition>
    );
  }

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: `Users (${allUsers.length})` },
    { key: 'admins', label: 'Admins' },
  ];

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-5">
        <button
          onClick={() => navigate('/settings')}
          className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted"
        >
          ← Back
        </button>
        <h1 className="display-title text-ink">
          Admin <span className="text-gold">dashboard</span>
        </h1>
        <p className="mt-1 text-[11px] text-ink-muted">
          Logged in as {user?.email}
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-pill bg-bg-surface p-1 ring-1 ring-white/5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-pill py-2 text-[11px] font-bold uppercase tracking-wider transition ${
              tab === t.key ? 'bg-gold text-bg-base' : 'text-ink-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === 'overview' && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total users" value={stats.totalUsers} icon="👤" />
            <StatCard label="Kid profiles" value={stats.totalKids} icon="🧒" />
            <StatCard label="Characters" value={stats.totalChars} icon="👨‍👩‍👧" />
            <StatCard label="Admin count" value={adminEmails.length} icon="🔑" />
          </div>

          <div className="card">
            <h3 className="ui-label mb-3">Subscriptions</h3>
            <div className="space-y-2">
              {Object.entries(stats.tiers).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="text-sm font-bold capitalize text-ink">{tier}</span>
                  <span className="rounded-pill bg-bg-card px-3 py-1 text-xs font-bold text-gold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="ui-label mb-3">Beliefs breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.beliefs).map(([key, count]) => {
                const r = RELIGIONS.find((x) => x.key === key);
                return (
                  <span
                    key={key}
                    className="rounded-pill bg-bg-card px-3 py-1.5 text-xs font-bold text-ink"
                  >
                    {r?.icon} {r?.label || key} · {count}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="ui-label mb-3">Account statuses</h3>
            <div className="space-y-2">
              {['active', 'paused', 'blocked'].map((s) => {
                const count = allUsers.filter(
                  (u) => (u.accountStatus || 'active') === s
                ).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold capitalize text-ink">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: STATUS_COLORS[s] }}
                      />
                      {s}
                    </span>
                    <span className="text-xs text-ink-muted">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── USERS ─── */}
      {tab === 'users' && (
        <div className="space-y-3">
          {allUsers.length === 0 ? (
            <p className="text-center text-sm text-ink-muted">No users yet.</p>
          ) : (
            allUsers.map((u) => {
              const status = u.accountStatus || 'active';
              const expanded = expandedUser === u.uid;
              const kids = u.profiles || [];
              return (
                <motion.div
                  key={u.uid}
                  layout
                  className="overflow-hidden rounded-2xl bg-bg-surface ring-1 ring-white/5"
                >
                  {/* Row */}
                  <button
                    onClick={() => setExpandedUser(expanded ? null : u.uid)}
                    className="flex w-full items-center gap-3 p-3 text-left"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-lg">
                      {u.photoURL ? (
                        <img
                          src={u.photoURL}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-ink">
                          {u.displayName || u.email || u.uid.slice(0, 8)}
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
                      <div className="text-[11px] text-ink-muted">
                        {u.email || 'No email'} · {kids.length}{' '}
                        {kids.length === 1 ? 'kid' : 'kids'}
                      </div>
                    </div>
                    <span className={`text-ink-muted transition ${expanded ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>

                  {/* Expanded details */}
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-white/5 px-3 pb-3 pt-3"
                    >
                      <div className="mb-3 space-y-1 text-[11px] text-ink-muted">
                        <div>
                          <strong className="text-ink">UID:</strong> {u.uid}
                        </div>
                        {u.lastActiveAt && (
                          <div>
                            <strong className="text-ink">Last active:</strong>{' '}
                            {new Date(u.lastActiveAt).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Kid profiles */}
                      {kids.map((kid, i) => (
                        <div
                          key={i}
                          className="mb-2 rounded-xl bg-bg-base/60 p-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink">
                              {kid.childName || `Kid ${i + 1}`} · age {kid.age}
                            </span>
                            <select
                              value={kid.tier || 'free'}
                              onChange={(e) => setUserTier(u.uid, i, e.target.value)}
                              className="rounded-lg bg-bg-card px-2 py-1 text-[10px] font-bold text-gold"
                            >
                              <option value="free">Free</option>
                              <option value="family">Family</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                          <div className="mt-1 text-[10px] text-ink-dim">
                            {(kid.beliefs || []).join(', ') || 'No beliefs set'} ·{' '}
                            {kid.characters?.length || 0} chars · {kid.language || 'English'}
                          </div>
                        </div>
                      ))}

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        {status !== 'active' && (
                          <button
                            onClick={() => setUserStatus(u.uid, 'active')}
                            className="flex-1 rounded-xl bg-green-900/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-green-400"
                          >
                            Activate
                          </button>
                        )}
                        {status !== 'paused' && (
                          <button
                            onClick={() => setUserStatus(u.uid, 'paused')}
                            className="flex-1 rounded-xl bg-yellow-900/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-yellow-400"
                          >
                            Pause
                          </button>
                        )}
                        {status !== 'blocked' && (
                          <button
                            onClick={() => setUserStatus(u.uid, 'blocked')}
                            className="flex-1 rounded-xl bg-red-900/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* ─── ADMINS ─── */}
      {tab === 'admins' && (
        <div className="space-y-4">
          <div className="space-y-2">
            {adminEmails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5"
              >
                <span className="text-sm font-bold text-ink">{email}</span>
                {adminEmails.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${email} as admin?`)) removeAdmin(email);
                    }}
                    className="text-[10px] text-negative/80"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Add admin email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="field flex-1"
            />
            <button
              onClick={() => {
                if (newAdminEmail.trim()) {
                  addAdmin(newAdminEmail);
                  setNewAdminEmail('');
                }
              }}
              className="btn-primary"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <VersionFooter />
    </PageTransition>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl font-bold text-gold">{value}</span>
      </div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
        {label}
      </div>
    </div>
  );
}
