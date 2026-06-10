// Creator page — submit stories, view credits, see leaderboard.

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { RELIGIONS } from '../utils/constants.js';
import { SERIES } from '../data/series.js';
import { FOUNDER } from '../utils/socialProof.js';

const THEMES = [
  { key: 'compassion-animals', label: 'Compassion' },
  { key: 'courage', label: 'Courage' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'honesty', label: 'Honesty' },
  { key: 'sharing', label: 'Sharing' },
  { key: 'humility', label: 'Humility' },
  { key: 'forgiveness', label: 'Forgiveness' },
];

export default function Creator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const [tab, setTab] = useState('submit');
  const [myStories, setMyStories] = useState([]);
  const [credits, setCredits] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [toast, setToast] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [tradition, setTradition] = useState(profile?.beliefs?.[0] || 'universal');
  const [theme, setTheme] = useState('compassion-animals');
  const [source, setSource] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load creator data from Firestore
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, query, where, getDocs, doc, getDoc, orderBy, limit } = await import('firebase/firestore');

        // My submissions
        const myQ = query(collection(db, 'creatorStories'), where('authorUid', '==', user.uid));
        const mySnap = await getDocs(myQ);
        const stories = [];
        mySnap.forEach((d) => stories.push({ id: d.id, ...d.data() }));
        setMyStories(stories.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));

        // My credits
        const creditDoc = await getDoc(doc(db, 'creatorCredits', user.uid));
        if (creditDoc.exists()) setCredits(creditDoc.data().total || 0);

        // Leaderboard by tradition
        const lbQ = query(collection(db, 'creatorLeaderboard'), orderBy('storyCount', 'desc'), limit(20));
        const lbSnap = await getDocs(lbQ);
        const lb = [];
        lbSnap.forEach((d) => lb.push({ id: d.id, ...d.data() }));
        setLeaderboard(lb);
      } catch {}
    })();
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = async () => {
    if (!user) { showToast('Please sign in first'); return; }
    if (!title.trim() || !body.trim()) { showToast('Title and story are required'); return; }
    if (body.trim().split(/\s+/).length < 200) { showToast('Story should be at least 200 words'); return; }

    setSubmitting(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'creatorStories'), {
        title: title.trim(),
        tradition,
        theme,
        source: source.trim() || `${tradition} tradition`,
        body: body.trim(),
        authorUid: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        authorEmail: user.email || '',
        status: 'pending', // pending → approved �� published OR rejected
        submittedAt: new Date().toISOString(),
        views: 0,
        creditsEarned: 0,
      });
      showToast('Story submitted! We\'ll review it within 48 hours.');
      setTitle(''); setBody(''); setSource('');
      setTab('my-stories');
      // Refresh
      const { query: q, where: w, getDocs: gd } = await import('firebase/firestore');
      const myQ = q(collection(db, 'creatorStories'), w('authorUid', '==', user.uid));
      const mySnap = await gd(myQ);
      const stories = [];
      mySnap.forEach((d) => stories.push({ id: d.id, ...d.data() }));
      setMyStories(stories.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (e) {
      showToast('Failed to submit: ' + e.message);
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center">
          <div className="text-5xl mb-4">✍️</div>
          <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Sign in to become a Creator</h1>
          <p className="mt-2 text-sm text-ink-muted">Share stories from your tradition and earn credits.</p>
          <button onClick={() => navigate('/login')} className="mt-6 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base">
            Sign In
          </button>
        </div>
      </PageTransition>
    );
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-5">
        <button onClick={() => navigate(-1)} className="mb-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">← Back</button>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          Story <span className="text-gold">Creator</span>
        </h1>
        <p className="mt-1 text-xs text-ink-muted">Write stories. Earn credits. Preserve your tradition.</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 ring-1 ring-gold/20">
          <span className="text-xs font-bold text-gold">{credits} credits earned</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
        {[
          { key: 'submit', label: 'Write Story' },
          { key: 'my-stories', label: `My Stories (${myStories.length})` },
          { key: 'leaderboard', label: 'Board' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
              tab === t.key ? 'bg-gold text-bg-base' : 'text-ink-muted'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Submit tab */}
      {tab === 'submit' && (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">{t('creation.storyTitle')}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Monkey and the Crocodile"
              className="field" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Tradition</label>
              <select value={tradition} onChange={(e) => setTradition(e.target.value)}
                className="field text-sm">
                {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}
                className="field text-sm">
                {THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Source (optional)</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Panchatantra folk tradition"
              className="field" />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Story Body ({wordCount} words — aim for 800-2000)
            </label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Write your story here... End with: That night, {childName}, remember..."
              className="field h-64 resize-y" />
          </div>

          <div className="rounded-xl bg-bg-surface p-3 ring-1 ring-white/5 text-[11px] text-ink-muted">
            <strong className="text-ink">Tips:</strong> End with "That night, {'{childName}'}, remember..." so the app personalizes it. Use {'{childName}'}, {'{sibling}'}, {'{pet}'} as placeholders. Teach ONE clear value.
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting || wordCount < 200}
            className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition disabled:opacity-40"
          >
            {submitting ? 'Submitting...' : t('creation.submit')}
          </motion.button>
          {wordCount > 0 && wordCount < 200 && (
            <p className="text-center text-[10px] text-warning">Need at least 200 words ({200 - wordCount} more)</p>
          )}
        </div>
      )}

      {/* My stories tab */}
      {tab === 'my-stories' && (
        <div className="space-y-3">
          {/* Series created by this user (founder sees all series) */}
          {user?.email === FOUNDER.email && SERIES.map((series) => (
            <div key={series.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{series.icon}</span>
                    <h3 className="text-sm font-bold text-ink">{series.title}</h3>
                  </div>
                  <p className="text-[10px] text-ink-muted">Series · {series.totalEpisodes} episodes · {series.ageRange}</p>
                  <div className="mt-2 space-y-1">
                    {series.episodes.map((ep) => (
                      <p key={ep.id} className="text-[10px] text-ink-dim">Ep {ep.episodeNumber}: {ep.title}</p>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400">
                  published
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-muted">
                <span>📺 {series.totalEpisodes} episodes</span>
                <span>⭐ {series.totalEpisodes * 15 + 50} credits</span>
              </div>
            </div>
          ))}

          {myStories.length === 0 && !(user?.email === FOUNDER.email && SERIES.length > 0) ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">✍️</div>
              <p className="text-sm text-ink-muted">No stories submitted yet. Write your first!</p>
            </div>
          ) : myStories.map((s) => (
            <div key={s.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                  <p className="text-[10px] text-ink-muted mt-0.5">{s.tradition} · {s.theme} · {s.body?.split(/\s+/).length || 0} words</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                  s.status === 'published' ? 'bg-green-500/10 text-green-400' :
                  s.status === 'approved' ? 'bg-blue-500/10 text-blue-400' :
                  s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                  'bg-gold/10 text-gold'
                }`}>
                  {s.status}
                </span>
              </div>
              {s.status === 'published' && (
                <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-muted">
                  <span>👁 {s.views || 0} views</span>
                  <span>⭐ {s.creditsEarned || 0} credits</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard tab */}
      {tab === 'leaderboard' && (
        <div>
          <p className="mb-4 text-center text-xs text-ink-muted">Top creators by tradition</p>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-sm text-ink-muted">Be the first creator on the board!</p>
            </div>
          ) : leaderboard.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-xl bg-bg-surface p-3 mb-2 ring-1 ring-white/5">
              <span className="text-lg font-bold text-gold w-6 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{entry.name || 'Creator'}</p>
                <p className="text-[10px] text-ink-muted">{entry.tradition} · {entry.storyCount} stories</p>
              </div>
              <span className="text-xs font-bold text-gold">{entry.totalViews || 0} views</span>
            </div>
          ))}
        </div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
