// My Tasks — team member view of their daily tasks.
// Accessible at /my-tasks. Shows tasks assigned to the logged-in user.
// Team members can update status: To Do → In Progress → Done.

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { db } from '../lib/firebase.js';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import PageTransition from '../components/PageTransition.jsx';

const ACTIVITIES = {
  content: { label: 'Content', icon: '📝', color: '#9f7aea' },
  marketing: { label: 'Marketing', icon: '📣', color: '#f0a500' },
  tech: { label: 'Tech', icon: '💻', color: '#4299e1' },
  design: { label: 'Design', icon: '🎨', color: '#f472b6' },
  ops: { label: 'Operations', icon: '⚙️', color: '#48bb78' },
  outreach: { label: 'Outreach', icon: '🤝', color: '#ed8936' },
};

const STATUS_META = {
  todo: { label: 'To Do', color: '#6e6a63', next: 'in_progress' },
  in_progress: { label: 'In Progress', color: '#f0a500', next: 'done' },
  done: { label: 'Done', color: '#48bb78', next: 'todo' },
  blocked: { label: 'Blocked', color: '#f3727f', next: 'todo' },
};

export default function MyTasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const getLocalDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [selectedDate, setSelectedDate] = useState(getLocalDate);

  // Load all tasks
  useEffect(() => {
    if (!db || !user) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'dailyTasks'));
        const loaded = [];
        snap.forEach(d => loaded.push({ id: d.id, ...d.data() }));
        setTasks(loaded);
      } catch (e) {
        console.error('[MyTasks] Load error:', e.message);
      }
      setLoading(false);
    })();
  }, [user]);

  // Filter to my tasks for selected date
  const myTasks = useMemo(() => {
    if (!user?.email) return [];
    return tasks
      .filter(t => t.assignee === user.email && t.dueDate === selectedDate)
      .sort((a, b) => {
        const pri = { urgent: 0, high: 1, normal: 2, low: 3 };
        const sta = { todo: 0, in_progress: 1, blocked: 2, done: 3 };
        if (a.status !== b.status) return (sta[a.status] || 0) - (sta[b.status] || 0);
        return (pri[a.priority] || 2) - (pri[b.priority] || 2);
      });
  }, [tasks, user, selectedDate]);

  const doneCount = myTasks.filter(t => t.status === 'done').length;
  const totalCount = myTasks.length;

  const updateStatus = async (task, newStatus) => {
    setUpdating(task.id);
    const updated = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    };
    try {
      if (db) await setDoc(doc(db, 'dailyTasks', task.id), updated, { merge: true });
    } catch (e) {
      console.error('[MyTasks] Update error:', e.message);
    }
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    setUpdating(null);
  };

  const shiftDate = (days) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  if (!user) {
    return (
      <PageTransition className="page-scroll px-5 pt-20 safe-top text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-sm text-ink-muted">Sign in to see your tasks</p>
        <button onClick={() => navigate('/login')} className="mt-4 btn-primary px-6 py-2 text-sm">Sign In</button>
      </PageTransition>
    );
  }

  const dayLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <PageTransition className="page-scroll safe-top">
      <div className="px-5 pt-10 pb-40">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </a>
          <span className="text-[10px] text-ink-dim">{user.email}</span>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
          My Tasks
        </h1>
        <p className="text-xs text-ink-muted mb-6">{dayLabel}</p>

        {/* Date nav */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => shiftDate(-1)} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-ink-muted">←</button>
          <button onClick={() => setSelectedDate(getLocalDate())} className="rounded-lg bg-gold/15 px-4 py-2 text-xs font-bold text-gold">Today</button>
          <button onClick={() => shiftDate(1)} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-ink-muted">→</button>
          <div className="flex-1" />
          {totalCount > 0 && (
            <div className="text-right">
              <span className="text-lg font-bold text-gold">{doneCount}/{totalCount}</span>
              <span className="text-[10px] text-ink-dim ml-1">done</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="h-2 rounded-full bg-white/5 mb-6 overflow-hidden">
            <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${Math.round(doneCount / totalCount * 100)}%` }} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
            <p className="mt-3 text-xs text-ink-muted">Loading tasks...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && myTasks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-sm text-ink-muted">No tasks for {dayLabel}</p>
            <p className="text-[10px] text-ink-dim mt-1">Check back tomorrow or ask your admin</p>
          </div>
        )}

        {/* Task list */}
        <div className="space-y-3">
          {myTasks.map(task => {
            const act = ACTIVITIES[task.activity] || { label: task.activity, icon: '📌', color: '#666' };
            const sta = STATUS_META[task.status] || STATUS_META.todo;
            const isUpdating = updating === task.id;

            return (
              <div key={task.id} className={`rounded-2xl bg-white/5 ring-1 ring-white/5 overflow-hidden transition ${task.status === 'done' ? 'opacity-50' : ''}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Status button */}
                    <button
                      onClick={() => updateStatus(task, sta.next)}
                      disabled={isUpdating}
                      className="mt-0.5 shrink-0 grid h-7 w-7 place-items-center rounded-full transition active:scale-90"
                      style={{
                        border: `2.5px solid ${sta.color}`,
                        background: task.status === 'done' ? '#48bb78' : 'transparent',
                      }}
                    >
                      {isUpdating ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-white/50 border-t-white" />
                      ) : task.status === 'done' ? (
                        <span className="text-xs text-white font-bold">✓</span>
                      ) : null}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${task.status === 'done' ? 'line-through text-ink-dim' : 'text-ink'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-ink-muted mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: act.color + '22', color: act.color }}>
                          {act.icon} {act.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: sta.color + '22', color: sta.color }}>
                          {sta.label}
                        </span>
                        {task.priority === 'urgent' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400">URGENT</span>
                        )}
                        {task.priority === 'high' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-500/20 text-yellow-400">HIGH</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick status buttons */}
                {task.status !== 'done' && (
                  <div className="flex border-t border-white/5">
                    {task.status === 'todo' && (
                      <button onClick={() => updateStatus(task, 'in_progress')}
                        className="flex-1 py-2.5 text-[11px] font-bold text-gold bg-gold/5 hover:bg-gold/10 transition">
                        Start Working
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button onClick={() => updateStatus(task, 'done')}
                          className="flex-1 py-2.5 text-[11px] font-bold text-green-400 bg-green-500/5 hover:bg-green-500/10 transition">
                          Mark Done ✓
                        </button>
                        <button onClick={() => updateStatus(task, 'blocked')}
                          className="py-2.5 px-4 text-[11px] font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 transition border-l border-white/5">
                          Blocked
                        </button>
                      </>
                    )}
                    {task.status === 'blocked' && (
                      <button onClick={() => updateStatus(task, 'in_progress')}
                        className="flex-1 py-2.5 text-[11px] font-bold text-gold bg-gold/5 hover:bg-gold/10 transition">
                        Unblock → Resume
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* All done celebration */}
        {!loading && totalCount > 0 && doneCount === totalCount && (
          <div className="mt-8 rounded-2xl bg-gold/10 ring-1 ring-gold/20 p-6 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-sm font-bold text-gold">All tasks completed!</p>
            <p className="text-[10px] text-ink-muted mt-1">Great work today. See you tomorrow.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
