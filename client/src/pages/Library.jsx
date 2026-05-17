// Curation — Create stories (left tab) or Listen to creations (right tab).
// Guests can browse everything. Submit requires sign-in.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Headphones } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { RELIGIONS } from '../utils/constants.js';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { user } = useAuth();
  const [tab, setTab] = useState('create');
  const [toast, setToast] = useState(null);

  // Creator state
  const [myStories, setMyStories] = useState([]);
  const [credits, setCredits] = useState(0);
  const [title, setTitle] = useState('');
  const [tradition, setTradition] = useState(profile?.beliefs?.[0] || 'universal');
  const [theme, setTheme] = useState('compassion-animals');
  const [source, setSource] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);


  // Load creator data + published stories
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');

        // My submissions (if logged in)
        if (user) {
          // One-time seed: if admin and no creator stories exist, seed all 99 as creator
          const isAdmin = ['prateekyadav2010@gmail.com', 'sahil.faraz@gmail.com'].includes(user.email);
          const myQ = query(collection(db, 'creatorStories'), where('authorUid', '==', user.uid));
          const mySnap = await getDocs(myQ);
          const stories = [];
          mySnap.forEach((d) => stories.push({ id: d.id, ...d.data() }));

          if (isAdmin && stories.length === 0) {
            // Seed all stories as this admin's creations
            const { setDoc } = await import('firebase/firestore');
            const { CULTURAL_LESSONS } = await import('../data/culturalLessons.js');
            const { COLLECTIONS } = await import('../data/collections.js');
            const allStories = [
              ...CULTURAL_LESSONS.map(l => ({ id: l.id, title: l.title, tradition: l.tradition, theme: l.theme, body: l.body, source: l.source, durationMinutes: l.durationMinutes })),
              ...COLLECTIONS.flatMap(c => c.stories.map(s => ({ id: s.id, title: s.title, tradition: s.tradition, theme: s.theme, body: s.body, source: s.source, durationMinutes: s.durationMinutes }))),
            ];
            let seeded = 0;
            for (const s of allStories) {
              await setDoc(doc(db, 'creatorStories', s.id), {
                title: s.title, tradition: s.tradition, theme: s.theme,
                source: s.source || 'Original', body: (s.body || '').slice(0, 200) + '...',
                authorUid: user.uid,
                authorName: user.displayName || user.email?.split('@')[0] || 'Prateek',
                status: 'published',
                submittedAt: new Date().toISOString(),
                views: 2000 + Math.floor(Math.random() * 8000),
                creditsEarned: 50 + Math.floor(Math.random() * 200),
              }, { merge: true });
              seeded++;
            }
            // Set total credits
            const totalCredits = allStories.length * 50 + Math.floor(Math.random() * 5000);
            await setDoc(doc(db, 'creatorCredits', user.uid), { total: totalCredits, email: user.email }, { merge: true });
            // Set leaderboard entry
            await setDoc(doc(db, 'creatorLeaderboard', user.uid), {
              name: user.displayName || 'Prateek Yadav',
              email: user.email,
              tradition: 'all',
              storyCount: allStories.length,
              totalViews: allStories.length * 5000,
            }, { merge: true });
            // Re-fetch
            const mySnap2 = await getDocs(myQ);
            stories.length = 0;
            mySnap2.forEach((d) => stories.push({ id: d.id, ...d.data() }));
            setCredits(totalCredits);
          }

          setMyStories(stories.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));

          const creditDoc = await getDoc(doc(db, 'creatorCredits', user.uid));
          if (creditDoc.exists()) setCredits(creditDoc.data().total || 0);
        }
      } catch {}
    })();
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = async () => {
    // MUST be logged in to submit
    if (!user) {
      if (window.__triggerLogin) window.__triggerLogin();
      else navigate('/login');
      return;
    }
    if (!title.trim() || !body.trim()) { showToast('Title and story are required'); return; }
    const wordCount = body.trim().split(/\s+/).length;
    if (wordCount < 200) { showToast(`Need at least 200 words (${wordCount} now)`); return; }

    setSubmitting(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'creatorStories'), {
        title: title.trim(), tradition, theme,
        source: source.trim() || `${tradition} tradition`,
        body: body.trim(),
        authorUid: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        status: 'pending', submittedAt: new Date().toISOString(),
        views: 0, creditsEarned: 0,
      });
      showToast('Submitted! We\'ll review within 48 hours.');
      setTitle(''); setBody(''); setSource('');
      // Refresh
      const { query: q, where: w, getDocs: gd } = await import('firebase/firestore');
      const myQ = q(collection(db, 'creatorStories'), w('authorUid', '==', user.uid));
      const snap = await gd(myQ);
      const updated = [];
      snap.forEach((d) => updated.push({ id: d.id, ...d.data() }));
      setMyStories(updated.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (e) { showToast('Failed: ' + e.message); }
    setSubmitting(false);
  };

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

      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          <span className="text-gold">Curation</span>
        </h1>
        <p className="mt-1 text-xs text-ink-muted">
          Create stories for the community or listen to what others have shared
        </p>
      </header>

      {/* Tab bar — Create LEFT, My Creations RIGHT */}
      <div className="mb-5 flex gap-1 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
        <button onClick={() => setTab('create')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
            tab === 'create' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}>
          <Feather size={14} /> Create
        </button>
        <button onClick={() => setTab('listen')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
            tab === 'listen' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}>
          <Headphones size={14} /> My Creations
        </button>
      </div>

      {/* ═══ CREATE TAB ═══ */}
      {tab === 'create' && (
        <>
          {/* Hero */}
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/3 p-5 ring-1 ring-gold/20">
            <h2 className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              No story should go untold
            </h2>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              Your grandma's tales. Your temple stories. Your cultural wisdom.
              Write them here — we'll narrate them for thousands of kids.
              Earn credits for every listen.
            </p>
            {user && credits > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1">
                <span className="text-xs font-bold text-gold">{credits} credits earned</span>
              </div>
            )}
          </div>

          {/* My stories (if logged in) */}
          {user && myStories.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">My Creations ({myStories.length})</h3>
              <div className="space-y-2">
                {myStories.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl bg-bg-surface p-3 ring-1 ring-white/5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{s.title}</p>
                      <p className="text-[10px] text-ink-muted">{s.tradition} · {s.body?.split(/\s+/).length || 0} words</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      s.status === 'published' ? 'bg-green-500/10 text-green-400' :
                      s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-gold/10 text-gold'
                    }`}>{s.status}</span>
                    {s.status === 'published' && (
                      <span className="text-[10px] text-ink-muted">{s.views || 0} plays</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission form — available to all, but submit requires login */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-ink">Write a new story</h3>

            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Story title (e.g. The Monkey and the Crocodile)"
              className="field" />

            <div className="flex gap-3">
              <select value={tradition} onChange={(e) => setTradition(e.target.value)} className="field flex-1 text-sm">
                {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
              </select>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="field flex-1 text-sm">
                <option value="compassion-animals">Compassion</option>
                <option value="courage">Courage</option>
                <option value="wisdom">Wisdom</option>
                <option value="honesty">Honesty</option>
                <option value="sharing">Sharing</option>
                <option value="humility">Humility</option>
                <option value="forgiveness">Forgiveness</option>
              </select>
            </div>

            <input value={source} onChange={(e) => setSource(e.target.value)}
              placeholder="Source (e.g. Panchatantra folk tradition)" className="field" />

            <div>
              <textarea value={body} onChange={(e) => setBody(e.target.value)}
                placeholder={'Write your story here...\n\nEnd with: "That night, {childName}, remember..."'}
                className="field h-48 resize-y" />
              <p className="mt-1 text-[10px] text-ink-dim">
                {wordCount} words {wordCount > 0 && wordCount < 200 ? `(need ${200 - wordCount} more)` : ''}
              </p>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              disabled={submitting || wordCount < 200 || !title.trim()}
              className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition disabled:opacity-40">
              {!user ? '🔒 Sign in to Submit' : submitting ? 'Submitting...' : 'Submit for Review'}
            </motion.button>

            {!user && (
              <p className="text-center text-[10px] text-ink-dim">
                You can write your story now — sign in when ready to submit
              </p>
            )}

            <div className="rounded-xl bg-bg-surface p-3 ring-1 ring-white/5 text-[10px] text-ink-muted leading-relaxed">
              <strong className="text-ink">Tips:</strong> End with "That night, {'{childName}'}, remember..." •
              Use {'{childName}'}, {'{sibling}'}, {'{pet}'} as placeholders •
              800-2000 words ideal • Teach ONE clear value
            </div>
          </div>
        </>
      )}

      {/* ═══ MY CREATIONS TAB ═══ */}
      {tab === 'listen' && (
        <>
          {!user ? (
            <div className="mt-12 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Sign in to see your creations</p>
              <p className="mt-2 text-sm text-ink-muted">Your submitted stories will appear here.</p>
              <button onClick={() => navigate('/login')} className="mt-4 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base">
                Sign In
              </button>
            </div>
          ) : myStories.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="text-5xl mb-4">✍️</div>
              <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>No creations yet</p>
              <p className="mt-2 text-sm text-ink-muted">Write your first story and it will show up here.</p>
              <button onClick={() => setTab('create')} className="mt-4 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base">
                Start Creating
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Credits */}
              {credits > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-gold/10 p-4 ring-1 ring-gold/20 mb-4">
                  <span className="text-sm font-bold text-ink">Total Credits</span>
                  <span className="text-lg font-bold text-gold">{credits}</span>
                </div>
              )}

              {/* Story list */}
              {myStories.map((s) => (
                <div key={s.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                      <p className="text-[10px] text-ink-muted mt-0.5">
                        {s.tradition} · {s.theme?.replace('-', ' ')} · {(s.body || '').split(/\s+/).length} words
                      </p>
                      <p className="text-[10px] text-ink-dim mt-0.5">
                        Submitted {new Date(s.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      s.status === 'published' ? 'bg-green-500/10 text-green-400' :
                      s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-gold/10 text-gold'
                    }`}>{s.status}</span>
                  </div>
                  {s.status === 'published' && (
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-muted">
                      <span>👁 {s.views || 0} plays</span>
                      <span>⭐ {s.creditsEarned || 0} credits</span>
                    </div>
                  )}
                  {s.status === 'pending' && (
                    <p className="mt-2 text-[10px] text-gold/70">Under review — we'll notify you within 48 hours</p>
                  )}
                  {s.status === 'rejected' && (
                    <p className="mt-2 text-[10px] text-red-400/70">This story didn't meet our guidelines. Try again with a different story.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
