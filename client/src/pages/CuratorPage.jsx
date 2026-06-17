// Creator public page — shows all series and stories by a creator.
// Route: /creator/:slug (e.g. /creator/deepti-ramaul)

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, Heart } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { SERIES } from '../data/series.js';
import { usePlayer } from '../hooks/usePlayer.jsx';

export default function CuratorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { load } = usePlayer();
  const [firestoreSeries, setFirestoreSeries] = useState([]);
  const [firestoreStories, setFirestoreStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  // Find built-in series by this creator (match slug to creatorName)
  const builtInSeries = SERIES.filter(s => {
    if (!s.creatorName) return false;
    const nameSlug = s.creatorName.toLowerCase().replace(/\s+/g, '-');
    return nameSlug === slug;
  });

  const creatorName = builtInSeries[0]?.creatorName || slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Creator';
  const [resolvedEmail, setResolvedEmail] = useState(builtInSeries[0]?.createdBy || '');

  // Load creator profile photo + Firestore content — ALL IN PARALLEL
  useEffect(() => {
    (async () => {
      try {
        const { db, auth: fbAuth } = await import('../lib/firebase.js');
        if (!db) { setLoading(false); return; }
        const { collection, query, where, getDocs, doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const myEmail = fbAuth?.currentUser?.email?.toLowerCase();
        const myUid = fbAuth?.currentUser?.uid;

        // Step 1: Username lookup + content queries by slug — ALL PARALLEL
        const [usernameSnap, serBySlug, storyBySlug, likeSnap] = await Promise.all([
          fget(fdoc(db, 'usernames', slug)),
          getDocs(query(collection(db, 'creatorSeries'), where('authorUsername', '==', slug))).catch(() => ({ forEach: () => {} })),
          getDocs(query(collection(db, 'creatorStories'), where('authorUsername', '==', slug))).catch(() => ({ forEach: () => {} })),
          fget(fdoc(db, 'creatorLikes', slug)).catch(() => null),
        ]);

        // Process username
        let email = builtInSeries[0]?.createdBy || '';
        let uid = '';
        if (usernameSnap.exists()) {
          email = usernameSnap.data().email || '';
          uid = usernameSnap.data().uid || '';
        }
        if (email) setResolvedEmail(email);

        // Process likes (already fetched)
        if (likeSnap?.exists()) {
          setLikes(likeSnap.data().count || 0);
          if (myUid && (likeSnap.data().likedBy || []).includes(myUid)) setLiked(true);
        }

        // Collect content from slug queries
        const seriesMap = {};
        const storyMap = {};
        serBySlug.forEach(d => { seriesMap[d.id] = { id: d.id, ...d.data() }; });
        storyBySlug.forEach(d => { storyMap[d.id] = { id: d.id, ...d.data() }; });

        // Step 2: If we have uid/email, fetch by those too + photo — ALL PARALLEL
        const step2 = [];
        if (uid) {
          step2.push(fget(fdoc(db, 'users', uid)).then(s => { if (s.exists() && s.data().photoURL) setPhotoURL(s.data().photoURL); }).catch(() => {}));
          step2.push(getDocs(query(collection(db, 'creatorSeries'), where('authorUid', '==', uid))).then(s => s.forEach(d => { seriesMap[d.id] = { id: d.id, ...d.data() }; })).catch(() => {}));
          step2.push(getDocs(query(collection(db, 'creatorStories'), where('authorUid', '==', uid))).then(s => s.forEach(d => { storyMap[d.id] = { id: d.id, ...d.data() }; })).catch(() => {}));
        }
        if (email) {
          step2.push(getDocs(query(collection(db, 'creatorSeries'), where('authorEmail', '==', email))).then(s => s.forEach(d => { seriesMap[d.id] = { id: d.id, ...d.data() }; })).catch(() => {}));
          step2.push(getDocs(query(collection(db, 'creatorStories'), where('authorEmail', '==', email))).then(s => s.forEach(d => { storyMap[d.id] = { id: d.id, ...d.data() }; })).catch(() => {}));
          if (!uid) step2.push(getDocs(query(collection(db, 'users'), where('email', '==', email))).then(s => s.forEach(d => { if (d.data().photoURL) setPhotoURL(d.data().photoURL); })).catch(() => {}));
        }
        if (step2.length > 0) await Promise.all(step2);

        // Process results
        const isOwnProfile = myEmail && (myEmail === (email || '').toLowerCase());
        const isSharedWith = (item) => myEmail && (item.sharedWith || []).some(e => e.toLowerCase() === myEmail);
        const statusOrder = { published: 0, approved: 1, pending: 2, personal: 3 };
        const se = Object.values(seriesMap).map(s => ({ ...s, _canClick: s.status === 'published' || isOwnProfile || isSharedWith(s) })).sort((a, b) => (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9));
        const sl = Object.values(storyMap).map(s => ({ ...s, _canClick: s.status === 'published' || isOwnProfile || isSharedWith(s) })).sort((a, b) => (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9));
        setFirestoreSeries(se);
        setFirestoreStories(sl);
      } catch (e) { console.warn('[CreatorPage]', e.message); }
      setLoading(false);
    })();
  }, [slug]);

  const toggleLike = async () => {
    const { auth: fbAuth } = await import('../lib/firebase.js');
    if (!fbAuth?.currentUser) { navigate('/login'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { doc, setDoc, getDoc, arrayUnion, arrayRemove, increment } = await import('firebase/firestore');
      const ref = doc(db, 'creatorLikes', slug);
      const uid = fbAuth.currentUser.uid;
      if (liked) {
        await setDoc(ref, { count: increment(-1), likedBy: arrayRemove(uid) }, { merge: true });
        setLikes(l => Math.max(0, l - 1));
        setLiked(false);
      } else {
        await setDoc(ref, { count: increment(1), likedBy: arrayUnion(uid) }, { merge: true });
        setLikes(l => l + 1);
        setLiked(true);
      }
    } catch (e) { console.warn('Like failed:', e.message); }
    setLiking(false);
  };

  const initials = creatorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  // Dedupe: built-in series IDs take priority over Firestore copies
  const builtInIds = new Set(builtInSeries.map(s => s.id));
  const allSeries = [...builtInSeries, ...firestoreSeries.filter(s => !builtInIds.has(s.id))];
  const totalEpisodes = allSeries.reduce((sum, s) => sum + (s.totalEpisodes || s.episodes?.length || 0), 0);

  // Image caches from localStorage
  const wisdomImages = (() => { try { return JSON.parse(localStorage.getItem('mst:cache:wisdomImages')) || {}; } catch { return {}; } })();
  const wisdomGallery = (() => { try { return JSON.parse(localStorage.getItem('mst:cache:wisdomGallery') || '{}'); } catch { return {}; } })();

  const getSeriesCover = (series) => {
    for (const ep of (series.episodes || [])) {
      const img = wisdomImages[ep.id] || (wisdomGallery[ep.id] || [])[0];
      if (img) return img;
    }
    return null;
  };

  const getStoryImage = (storyId) => {
    return wisdomImages[storyId] || (wisdomGallery[storyId] || [])[0] || null;
  };

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Hero */}
      <div className="px-5 pt-10 pb-6">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink">
            <ArrowLeft size={14} /> Back
          </button>
          <button onClick={() => navigate('/creators')} className="text-[11px] font-bold text-gold hover:text-gold-bright">
            All Creators →
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          {photoURL ? (
            <img src={photoURL} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/30" />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-xl font-bold text-gold ring-2 ring-gold/30">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
              {creatorName}
            </h1>
            <p className="text-xs text-gold/70">Story Creator</p>
          </div>
          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleLike}
            disabled={liking}
            className="flex flex-col items-center gap-0.5"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={24}
                className={`transition ${liked ? 'text-red-500 fill-red-500' : 'text-ink-muted'}`}
              />
            </motion.div>
            <span className={`text-[10px] font-bold ${liked ? 'text-red-400' : 'text-ink-dim'}`}>{likes}</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center flex-1">
            <div className="text-lg font-bold text-gold">{allSeries.length}</div>
            <div className="text-[9px] text-ink-muted">Series</div>
          </div>
          <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center flex-1">
            <div className="text-lg font-bold text-gold">{totalEpisodes}</div>
            <div className="text-[9px] text-ink-muted">Episodes</div>
          </div>
          <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center flex-1">
            <div className="text-lg font-bold text-gold">{firestoreStories.length}</div>
            <div className="text-[9px] text-ink-muted">Stories</div>
          </div>
        </div>

        {/* Status legend */}
        <div className="flex gap-2 mt-3">
          <span className="text-[9px] text-ink-dim flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400"></span> Published</span>
          <span className="text-[9px] text-ink-dim flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold"></span> Pending Review</span>
          <span className="text-[9px] text-ink-dim flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400"></span> Personal</span>
        </div>
      </div>

      {/* All creations — compact square cards, 2 per row */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>Creations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Series */}
          {allSeries.map((ser) => {
            const cover = getSeriesCover(ser);
            const isBuiltIn = !!ser.episodes?.[0]?.body;
            const isPublished = ser.status === 'published' || isBuiltIn;
            const isPersonal = ser.visibility === 'personal' || ser.status === 'personal';
            const isPending = ser.status === 'pending' || ser.status === 'approved';
            const statusColor = isPublished ? '#48bb78' : isPersonal ? '#4299e1' : '#f0a500';
            const statusLabel = isPublished ? 'Published' : isPersonal ? 'Personal' : 'Pending';
            return (
              <motion.button
                key={ser.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => (isBuiltIn || ser._canClick) ? navigate(`/series/${ser.id}`) : null}
                className={`relative overflow-hidden rounded-2xl text-left ring-1 ring-white/8 ${!isPublished ? 'opacity-40 grayscale-[30%]' : ''} ${!ser._canClick && !isBuiltIn ? 'cursor-not-allowed' : ''}`}
                style={{ aspectRatio: '2/3', minHeight: 200 }}
              >
                {cover ? (
                  <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="absolute inset-0" style={{ background: ser.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm text-[8px] font-bold text-white/80">📺 {ser.totalEpisodes || ser.episodes?.length || 0} eps</span>
                  {!isBuiltIn && <span className="rounded-full px-2 py-0.5 backdrop-blur-sm text-[7px] font-bold" style={{ background: statusColor + '33', color: statusColor }}>{statusLabel}</span>}
                </div>

                <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold/20 text-gold backdrop-blur-sm">
                  <Play size={10} fill="currentColor" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <h4 className="text-xs font-bold text-white leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                    {ser.icon} {ser.title}
                  </h4>
                  <p className="text-[9px] text-white/50 mt-0.5 line-clamp-1">{ser.description}</p>
                </div>
              </motion.button>
            );
          })}

          {/* Stories */}
          {firestoreStories.map((story) => {
            const isPublished = story.status === 'published';
            const isPersonal = story.visibility === 'personal' || story.status === 'personal';
            const statusColor = isPublished ? '#48bb78' : isPersonal ? '#4299e1' : '#f0a500';
            const statusLabel = isPublished ? 'Published' : isPersonal ? 'Personal' : 'Pending';
            return (
            <motion.button
              key={story.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!story._canClick) return;
                // Load story into player
                load({
                  id: story.id,
                  title: story.title,
                  text: story.body || '',
                  tradition: story.tradition,
                  source: story.source || '',
                  language: 'English',
                  voice: 'AI Narrator',
                  isWisdom: true,
                  createdAt: story.submittedAt || new Date().toISOString(),
                });
                navigate('/player');
              }}
              className={`relative overflow-hidden rounded-2xl text-left ring-1 ring-white/8 ${!isPublished ? 'opacity-40 grayscale-[30%] cursor-not-allowed' : 'cursor-pointer'}`}
              style={{ aspectRatio: '2/3', minHeight: 200 }}
            >
              {(story.coverImage || getStoryImage(story.id)) ? (
                <img src={story.coverImage || getStoryImage(story.id)} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-orange-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

              <div className="absolute top-2 left-2">
                <span className="rounded-full px-2 py-0.5 backdrop-blur-sm text-[7px] font-bold" style={{ background: statusColor + '33', color: statusColor }}>{statusLabel}</span>
              </div>

              <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold/20 text-gold backdrop-blur-sm">
                <Play size={10} fill="currentColor" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-[8px] font-bold uppercase tracking-wider text-gold/70">{story.tradition}</p>
                <h4 className="text-xs font-bold text-white leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                  {story.title}
                </h4>
              </div>
            </motion.button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {!loading && allSeries.length === 0 && firestoreStories.length === 0 && (
        <div className="px-5 mt-12 text-center">
          <div className="text-4xl mb-3">✍️</div>
          <p className="text-sm text-ink-muted">No published content yet.</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Go Home</button>
        </div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
