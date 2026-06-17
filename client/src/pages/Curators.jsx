// All Creators — animated avatar circles with hover details + search.
// Route: /creators

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

export default function Curators() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Show cached creators instantly (from previous visit)
    try {
      const cached = JSON.parse(localStorage.getItem('mst:cache:creators'));
      if (cached?.length > 0) {
        setCreators(cached);
        setLoading(false);
      }
    } catch {}

    // Load all creators from Firestore (single source of truth)
    const byKey = {};
    setLoadingMore(true);

    // Step 2: Load Firestore data in background
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, getDocs, query, where } = await import('firebase/firestore');

        // Fetch all content, filter published client-side
        const [serSnap, storySnap] = await Promise.all([
          getDocs(collection(db, 'creatorSeries')),
          getDocs(collection(db, 'creatorStories')),
        ]);

        serSnap.forEach(d => {
          const data = d.data();
          if (data.status !== 'published') return;
          const key = data.authorUid || data.authorEmail || data.authorName;
          if (!byKey[key]) byKey[key] = { name: data.authorName, email: data.authorEmail, uid: data.authorUid, slug: (data.authorUsername || data.authorName || 'creator').toLowerCase().replace(/\s+/g, '-'), seriesCount: 0, storyCount: 0, likes: 0, photoURL: null, traditions: new Set(), tags: new Set() };
          if (data.authorUsername) byKey[key].slug = data.authorUsername;
          if (data.authorUid) byKey[key].uid = data.authorUid;
          if (data.tradition) byKey[key].traditions.add(data.tradition);
          byKey[key].tags.add('series');
          byKey[key].seriesCount++;
        });

        storySnap.forEach(d => {
          const data = d.data();
          if (data.status !== 'published') return;
          const key = data.authorUid || data.authorEmail || data.authorName;
          if (!byKey[key]) byKey[key] = { name: data.authorName, email: data.authorEmail, uid: data.authorUid, slug: (data.authorUsername || data.authorName || 'creator').toLowerCase().replace(/\s+/g, '-'), seriesCount: 0, storyCount: 0, likes: 0, photoURL: null, traditions: new Set(), tags: new Set() };
          if (data.authorUsername) byKey[key].slug = data.authorUsername;
          if (data.authorUid) byKey[key].uid = data.authorUid;
          if (data.tradition) byKey[key].traditions.add(data.tradition);
          if (data.theme) byKey[key].tags.add(data.theme);
          byKey[key].tags.add('story');
          byKey[key].storyCount++;
        });

        // Likes
        try {
          const likesSnap = await getDocs(collection(db, 'creatorLikes'));
          likesSnap.forEach(d => {
            const match = Object.values(byKey).find(c => c.slug === d.id);
            if (match) match.likes = d.data().count || 0;
          });
        } catch {}

        const final = Object.values(byKey)
          .filter(c => c.seriesCount + c.storyCount >= 1)
          .map(c => ({ ...c, traditions: c.traditions instanceof Set ? [...c.traditions] : c.traditions, tags: c.tags instanceof Set ? [...c.tags] : c.tags }))
          .sort((a, b) => (b.seriesCount + b.storyCount) - (a.seriesCount + a.storyCount));
        setCreators(final);
        // Cache for instant display on next visit
        try { localStorage.setItem('mst:cache:creators', JSON.stringify(final)); } catch {}
        // Photos — fetch in parallel after showing creators
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const photoUpdates = {};
        const photoPromises = final.filter(c => !c.photoURL && c.uid && !c.uid.includes('@')).map(async (c) => {
          try {
            const snap = await fget(fdoc(db, 'users', c.uid));
            if (snap.exists() && snap.data().photoURL) {
              photoUpdates[c.slug] = { photoURL: snap.data().photoURL, slug: snap.data().username || c.slug };
            } else {
              const lookupEmail = c.email || (c.uid?.includes('@') ? c.uid : null);
              if (lookupEmail) {
                const snap = await getDocs(query(collection(db, 'users'), where('email', '==', lookupEmail)));
                snap.forEach(d => {
                  if (d.data().photoURL) photoUpdates[c.slug] = { photoURL: d.data().photoURL, slug: d.data().username || c.slug };
                });
              }
            }
          } catch {}
        });
        await Promise.all(photoPromises);
        if (Object.keys(photoUpdates).length > 0) {
          setCreators(prev => {
            const updated = prev.map(c => photoUpdates[c.slug] ? { ...c, ...photoUpdates[c.slug] } : c);
            try { localStorage.setItem('mst:cache:creators', JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
      } catch (e) { console.warn('[Creators]', e.message); }
      setLoading(false);
      setLoadingMore(false);
    })();
  }, []);

  const initials = (name) => (name || 'C').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const filtered = creators.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.name || '').toLowerCase().includes(q)
      || (c.slug || '').toLowerCase().includes(q)
      || (c.traditions || []).some(t => t.toLowerCase().includes(q))
      || (c.tags || []).some(t => t.toLowerCase().includes(q));
  });

  const allTags = [...new Set(creators.flatMap(c => c.traditions || []))].filter(Boolean);

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button onClick={() => navigate('/')} className="mb-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">← Home</button>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          Our <span className="text-gold">Creators</span>
        </h1>
        <p className="mt-1 text-xs text-ink-muted">The storytellers behind My Sleepy Tale</p>
      </header>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
        <input id="creator-search" name="creator-search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, tradition, or tag..."
          className="w-full rounded-2xl bg-bg-surface pl-10 pr-10 py-3 text-sm text-ink ring-1 ring-white/10 outline-none focus:ring-gold/40 placeholder:text-ink-dim" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim"><X size={16} /></button>}
      </div>

      {/* Loading / Empty states */}
      {loading && creators.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-sm text-ink-muted">Loading creators...</p>
        </div>
      )}

      {!loading && creators.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="font-display text-lg font-bold text-ink">No creators yet</h2>
          <p className="mt-2 text-sm text-ink-muted max-w-xs mx-auto">Be the first! Go to Creation tab and submit a story for the community.</p>
          <button onClick={() => navigate('/creation')} className="btn-primary mt-4 px-6 py-3">Start Creating</button>
        </div>
      )}

      {/* Filter chips */}
      {allTags.length > 0 && (
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setSearch(search === tag ? '' : tag)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold capitalize transition ${search === tag ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'}`}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-ink-muted">{search ? `No creators matching "${search}"` : 'No creators yet'}</p>
        </div>
      ) : (
        <>
          {/* Avatar row */}
          <div className="flex items-center justify-center mb-8 -space-x-3">
            {filtered.slice(0, 8).map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                className="relative" style={{ zIndex: filtered.length - i }}
                onMouseEnter={() => setHoveredId(c.slug)} onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/creator/${c.slug}`)}>
                <AnimatePresence>
                  {hoveredId === c.slug && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-bg-elevated shadow-lift ring-1 ring-white/10 px-4 py-2.5 min-w-max pointer-events-none">
                      <p className="text-xs font-bold text-ink text-center">{c.name}</p>
                      <p className="text-[9px] text-ink-muted text-center">
                        {c.seriesCount > 0 ? `${c.seriesCount} series` : ''}{c.seriesCount > 0 && c.storyCount > 0 ? ' · ' : ''}{c.storyCount > 0 ? `${c.storyCount} stories` : ''}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div whileHover={{ scale: 1.15, zIndex: 100 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
                  {c.photoURL ? (
                    <img src={c.photoURL} alt={c.name} referrerPolicy="no-referrer" className="h-14 w-14 rounded-full object-cover ring-[3px] ring-bg-base shadow-lg" />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold ring-[3px] ring-bg-base shadow-lg">{initials(c.name)}</div>
                  )}
                </motion.div>
              </motion.div>
            ))}
            {filtered.length > 8 && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                className="grid h-14 w-14 place-items-center rounded-full bg-bg-surface text-xs font-bold text-ink-muted ring-[3px] ring-bg-base">
                +{filtered.length - 8}
              </motion.div>
            )}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((c, i) => (
              <motion.button key={c.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/creator/${c.slug}`)}
                className="rounded-2xl bg-bg-surface p-4 text-center ring-1 ring-white/5 transition hover:ring-gold/20 active:scale-[0.98]">
                {c.photoURL ? (
                  <img src={c.photoURL} alt={c.name} referrerPolicy="no-referrer" className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-gold/20 mb-3" />
                ) : (
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-lg font-bold text-gold ring-2 ring-gold/20 mb-3">{initials(c.name)}</div>
                )}
                <h3 className="text-sm font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>{c.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  {c.seriesCount > 0 && <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold text-purple-400">{c.seriesCount} series</span>}
                  {c.storyCount > 0 && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">{c.storyCount} stories</span>}
                </div>
                {c.likes > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <span className="text-[10px]">❤️</span>
                    <span className="text-[9px] font-bold text-red-400/70">{c.likes}</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {loadingMore && (
        <div className="mt-4 text-center">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-[9px] text-ink-dim mt-1">Loading more creators...</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs text-ink-muted mb-3">Want to create stories for kids?</p>
        <a href="/blog/become-a-creator" className="inline-block rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
          Become a Creator
        </a>
      </div>

      <div className="h-32" />
    </PageTransition>
  );
}
