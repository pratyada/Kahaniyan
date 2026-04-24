import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Share2, Trash2, BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { getLibrary, pruneArchive, removeFromLibrary, loadAndMergeLibrary, updateStoryInLibrary } from '../utils/storyCache.js';
import { shareStoryToFirestore } from '../utils/shareStory.js';
import { archiveDaysFor } from '../utils/tierGate.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES, valueMeta } from '../utils/constants.js';
import { getStoryArt } from '../utils/storyArt.js';
import { useAdmin } from '../hooks/useAdmin.jsx';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sharing, setSharing] = useState(null);
  const [toast, setToast] = useState(null);
  const { isAdmin } = useAdmin();
  const [wisdomImageUrls, setWisdomImageUrls] = useState({});

  useEffect(() => {
    pruneArchive(archiveDaysFor(profile?.tier || 'free'));
    setLibrary(getLibrary());
    loadAndMergeLibrary().then((merged) => setLibrary(merged));
    // Fetch DALL-E generated images
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(fireDb, 'config', 'wisdomImages'));
        if (snap.exists()) setWisdomImageUrls(snap.data());
      } catch {}
    })();
  }, [profile?.tier]);

  const filtered = useMemo(
    () => (filter ? library.filter((s) => s.value === filter) : library),
    [library, filter]
  );

  const handleDelete = (storyId) => {
    removeFromLibrary(storyId);
    setLibrary((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleShare = async (story) => {
    setSharing(story.id);
    try {
      const url = await shareStoryToFirestore(story, {
        beliefs: profile?.beliefs || [],
        country: profile?.country || '',
      });
      if (navigator.share) {
        await navigator.share({ title: `${story.title} — My Sleepy Tale`, text: `Listen to this bedtime story!`, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast('Link copied!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') showToast('Could not share');
    }
    setSharing(null);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const [generatingImages, setGeneratingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState('');

  const generateMissingImages = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
    const missing = library.filter((s) => {
      if (s.coverImage) return false;
      const lk = s.id?.startsWith('lesson_') ? s.id.slice(7) : '';
      if (wisdomImageUrls[lk]) return false;
      return true;
    });
    if (missing.length === 0) { showToast('All stories have images!'); return; }

    setGeneratingImages(true);
    let done = 0;
    for (const story of missing) {
      try {
        setImageProgress(`${done + 1}/${missing.length}: ${story.title?.slice(0, 25)}...`);
        const firstLine = (story.text || '').split('\n').find(l => l.trim()) || '';
        const snippet = firstLine.slice(0, 120);
        const prompt = `Scene from "${story.title}": ${snippet}`;

        const res = await fetch(`${API_BASE}/api/generate-story-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) { done++; continue; }
        const { imageUrl: dalleUrl } = await res.json();
        if (!dalleUrl) { done++; continue; }

        // Upload to Firebase Storage
        const imgRes = await fetch(dalleUrl);
        const imgBlob = await imgRes.blob();
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const { storage } = await import('../lib/firebase.js');
        const storageRef = ref(storage, `story-covers/${story.id}.png`);
        await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
        const permanentUrl = await getDownloadURL(storageRef);

        updateStoryInLibrary(story.id, { coverImage: permanentUrl });
        setLibrary((prev) => prev.map((s) => s.id === story.id ? { ...s, coverImage: permanentUrl } : s));
        done++;
      } catch {
        done++;
      }
    }
    setGeneratingImages(false);
    setImageProgress('');
    showToast(`Generated ${done} images!`);
  };

  // Unique values present in library for filter chips
  const availableValues = useMemo(() => {
    const vals = new Set(library.map((s) => s.value).filter(Boolean));
    return VALUES.filter((v) => vals.has(v.key));
  }, [library]);

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              {profile?.childName ? `${profile.childName}'s` : 'Your'} <span className="text-gold">Stories</span>
            </h1>
            <p className="mt-1 text-xs text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {library.length} {library.length === 1 ? 'story' : 'stories'} saved
            </p>
          </div>
{/* Gen Images moved to Admin panel — not shown here */}
        </div>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter chips — horizontal scroll with fade hint */}
      {availableValues.length > 1 && (
        <div className="relative mb-4 -mx-5">
          <div className="overflow-x-auto px-5 pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex w-max gap-2 pr-8">
              <button onClick={() => setFilter(null)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                  !filter ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                }`}>
                All
              </button>
              {availableValues.map((v) => {
                const meta = valueMeta(v.key);
                return (
                  <button key={v.key} onClick={() => setFilter(filter === v.key ? null : v.key)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                      filter === v.key ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                    }`}>
                    {meta.emoji} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Fade hint on right edge — signals more content to scroll */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-base to-transparent" />
        </div>
      )}

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex flex-col items-center text-center"
        >
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-gold/10">
            <BookOpen size={32} className="text-gold" />
          </div>
          <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
            {library.length === 0 ? 'Your library is empty' : 'No stories match'}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {library.length === 0 ? 'Tap the moon on Tonight to play your first story.' : 'Try a different filter.'}
          </p>
          <button onClick={() => navigate('/')}
            className="mt-5 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95">
            Go to Tonight
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <LibraryCard
                story={story}
                wisdomImageUrls={wisdomImageUrls}
                onPlay={() => { load(story); navigate('/player'); }}
                onShare={() => handleShare(story)}
                onDelete={() => handleDelete(story.id)}
                isSharing={sharing === story.id}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className="h-20" />
    </PageTransition>
  );
}

function LibraryCard({ story, wisdomImageUrls = {}, onPlay, onShare, onDelete, isSharing }) {
  const meta = valueMeta(story.value);
  const lessonKey = story.id?.startsWith('lesson_') ? story.id.slice(7) : '';
  const art = getStoryArt(lessonKey);
  const imgSrc = story.coverImage || wisdomImageUrls[lessonKey] || wisdomImageUrls[story.id] || art.image;
  const date = new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="group relative overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Album art cover — tap to play */}
      <button onClick={onPlay} className="relative block w-full text-left" style={{ aspectRatio: '1 / 1' }}>
        {imgSrc ? (
          <img src={imgSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: art.gradient }} />
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <Play size={20} fill="white" stroke="none" />
          </div>
        </div>
        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white" style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {story.title || 'Untitled Story'}
          </p>
          <p className="mt-0.5 text-[10px] text-white/60">{meta.label} · {story.estimatedMinutes || '?'}m · {date}</p>
        </div>
      </button>
      {/* Actions row */}
      <div className="flex items-center gap-1 bg-bg-surface/80 px-2 py-1.5">
        <button onClick={onShare} disabled={isSharing}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-gold transition active:scale-95 disabled:opacity-50">
          <Share2 size={11} /> Share
        </button>
        <div className="flex-1" />
        <button onClick={() => { if (confirm('Remove?')) onDelete(); }}
          className="grid h-7 w-7 place-items-center rounded-full text-ink-dim transition hover:text-negative active:scale-95">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
