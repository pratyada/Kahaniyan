// Creator public page — shows all series and stories by a creator.
// Route: /creator/:slug (e.g. /creator/deepti-ramaul)

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, Heart } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { SERIES } from '../data/series.js';

export default function CuratorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
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

  // Load creator profile photo + Firestore content
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) { setLoading(false); return; }
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        // If we have email from series.js, use it. Otherwise search Firestore by author name.
        let email = builtInSeries[0]?.createdBy || '';
        let uid = '';

        // Try username lookup first (from usernames collection)
        const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
        const usernameSnap = await fget(fdoc(db, 'usernames', slug));
        if (usernameSnap.exists()) {
          email = usernameSnap.data().email || '';
          uid = usernameSnap.data().uid || '';
        }

        // Fallback: search by name match
        if (!email && !uid) {
          const storyAll = await getDocs(collection(db, 'creatorStories'));
          const nameToMatch = creatorName.toLowerCase();
          storyAll.forEach(d => {
            const data = d.data();
            if ((data.authorName || '').toLowerCase() === nameToMatch) {
              if (data.authorEmail) email = data.authorEmail;
              if (data.authorUid) uid = data.authorUid;
            }
          });
        }

        if (email) setResolvedEmail(email);

        // Fetch photo from users doc
        if (uid) {
          const userSnap = await fget(fdoc(db, 'users', uid));
          if (userSnap.exists() && userSnap.data().photoURL) setPhotoURL(userSnap.data().photoURL);
        } else if (email) {
          const usersSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
          usersSnap.forEach(d => { if (d.data().photoURL) setPhotoURL(d.data().photoURL); });
        }

        // Fetch published content by authorUid OR authorEmail
        const queryField = uid ? 'authorUid' : 'authorEmail';
        const queryValue = uid || email;
        if (queryValue) {
          const [serSnap, storySnap] = await Promise.all([
            getDocs(query(collection(db, 'creatorSeries'), where(queryField, '==', queryValue))),
            getDocs(query(collection(db, 'creatorStories'), where(queryField, '==', queryValue))),
          ]);
          const se = []; serSnap.forEach(d => { const data = d.data(); if (data.status === 'published') se.push({ id: d.id, ...data }); });
          const sl = []; storySnap.forEach(d => { const data = d.data(); if (data.status === 'published') sl.push({ id: d.id, ...data }); });
          setFirestoreSeries(se);
          setFirestoreStories(sl);
        }
        // Load likes
        const likeSnap = await fget(fdoc(db, 'creatorLikes', slug));
        if (likeSnap.exists()) {
          setLikes(likeSnap.data().count || 0);
          const myUid = (await import('../lib/firebase.js')).auth?.currentUser?.uid;
          if (myUid && (likeSnap.data().likedBy || []).includes(myUid)) setLiked(true);
        }
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
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white">
          <ArrowLeft size={14} /> Back
        </button>

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
      </div>

      {/* All creations — compact square cards, 2 per row */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>Creations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Series */}
          {allSeries.map((ser) => {
            const cover = getSeriesCover(ser);
            const isBuiltIn = !!ser.episodes?.[0]?.body;
            return (
              <motion.button
                key={ser.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => isBuiltIn ? navigate(`/series/${ser.id}`) : null}
                className="relative overflow-hidden rounded-2xl text-left ring-1 ring-white/8"
                style={{ aspectRatio: '2/3', minHeight: 200 }}
              >
                {cover ? (
                  <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="absolute inset-0" style={{ background: ser.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

                <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                  <span className="text-[8px] font-bold text-white/80">📺 {ser.totalEpisodes || ser.episodes?.length || 0} eps</span>
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
          {firestoreStories.map((story) => (
            <motion.button
              key={story.id}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-2xl text-left ring-1 ring-white/8"
              style={{ aspectRatio: '2/3', minHeight: 200 }}
            >
              {(story.coverImage || getStoryImage(story.id)) ? (
                <img src={story.coverImage || getStoryImage(story.id)} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-orange-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

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
          ))}
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
