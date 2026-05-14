// Library — user's saved stories with shelf rows + grid.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import ShelfSection from '../components/shelves/ShelfSection.jsx';
import ShelfRow from '../components/shelves/ShelfRow.jsx';
import LibraryTile from '../components/cards/LibraryTile.jsx';
import { getLibrary, pruneArchive, removeFromLibrary, loadAndMergeLibrary, updateStoryInLibrary } from '../utils/storyCache.js';
import { shareStoryToFirestore } from '../utils/shareStory.js';
import { archiveDaysFor } from '../utils/tierGate.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES, valueMeta } from '../utils/constants.js';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useWisdomData } from '../hooks/useWisdomData.js';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const { isAdmin } = useAdmin();
  const { wisdomImageUrls } = useWisdomData();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sharing, setSharing] = useState(null);
  const [toast, setToast] = useState(null);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState('');

  useEffect(() => {
    pruneArchive(archiveDaysFor(profile?.tier || 'free'));
    setLibrary(getLibrary());
    loadAndMergeLibrary().then((merged) => setLibrary(merged));
  }, [profile?.tier]);

  const filtered = useMemo(
    () => (filter ? library.filter((s) => s.value === filter) : library),
    [library, filter]
  );

  // Recently played — last 8 stories sorted by date
  const recentStories = useMemo(
    () => [...library].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    [library]
  );

  // Group by value for shelf rows
  const valueGroups = useMemo(() => {
    const groups = {};
    library.forEach((s) => {
      const key = s.value || 'kindness';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return Object.entries(groups)
      .filter(([, stories]) => stories.length >= 2)
      .map(([key, stories]) => ({ key, meta: valueMeta(key), stories }));
  }, [library]);

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
        await navigator.share({ title: `${story.title} — My Sleepy Tale`, text: 'Listen to this bedtime story!', url });
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

  // Auto-generate missing images when ?gen=1 is in URL (admin use)
  const autoGenRef = useRef(false);
  useEffect(() => {
    if (autoGenRef.current || !isAdmin || library.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('gen') !== '1') return;
    autoGenRef.current = true;
    setTimeout(() => generateMissingImages(), 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, library]);

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
        const firstLine = (story.text || '').split('\n').find((l) => l.trim()) || '';
        const prompt = `Scene from "${story.title}": ${firstLine.slice(0, 120)}`;
        const res = await fetch(`${API_BASE}/api/generate-story-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) { done++; continue; }
        const data = await res.json();
        let imgBlob;
        if (data.imageBase64) {
          const bytes = Uint8Array.from(atob(data.imageBase64), (c) => c.charCodeAt(0));
          imgBlob = new Blob([bytes], { type: 'image/png' });
        } else if (data.imageUrl) {
          const imgFetch = await fetch(data.imageUrl);
          imgBlob = await imgFetch.blob();
        } else { done++; continue; }
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const { storage } = await import('../lib/firebase.js');
        const storageRef = ref(storage, `story-covers/${story.id}.png`);
        await uploadBytes(storageRef, imgBlob, { contentType: 'image/png' });
        const permanentUrl = await getDownloadURL(storageRef);
        updateStoryInLibrary(story.id, { coverImage: permanentUrl });
        setLibrary((prev) => prev.map((s) => (s.id === story.id ? { ...s, coverImage: permanentUrl } : s)));
        done++;
      } catch { done++; }
    }
    setGeneratingImages(false);
    setImageProgress('');
    showToast(`Generated ${done} images!`);
  };

  const availableValues = useMemo(() => {
    const vals = new Set(library.map((s) => s.value).filter(Boolean));
    return VALUES.filter((v) => vals.has(v.key));
  }, [library]);

  const playStory = (story) => { load(story); navigate('/player'); };

  const renderTile = (story, i) => (
    <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <LibraryTile
        story={story}
        wisdomImageUrls={wisdomImageUrls}
        onPlay={() => playStory(story)}
        onShare={() => handleShare(story)}
        onDelete={() => handleDelete(story.id)}
        isSharing={sharing === story.id}
      />
    </motion.div>
  );

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          {profile?.childName ? `${profile.childName}'s` : 'Your'} <span className="text-gold">Stories</span>
        </h1>
        <p className="mt-1 text-xs text-ink-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {generatingImages ? imageProgress : `${library.length} ${library.length === 1 ? 'story' : 'stories'} saved`}
        </p>
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

      {/* Filter chips */}
      {availableValues.length > 1 && (
        <div className="relative mb-4 -mx-5">
          <div className="overflow-x-auto px-5 py-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex w-max gap-2.5 pr-8">
              <button onClick={() => setFilter(null)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                  !filter ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                }`}>All</button>
              {availableValues.map((v) => {
                const meta = valueMeta(v.key);
                return (
                  <button key={v.key} onClick={() => setFilter(filter === v.key ? null : v.key)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                      filter === v.key ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                    }`}>{meta.emoji} {meta.label}</button>
                );
              })}
            </div>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-base to-transparent" />
        </div>
      )}

      {library.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex flex-col items-center text-center">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-gold/10">
            <BookOpen size={32} className="text-gold" />
          </div>
          <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Your library is empty</p>
          <p className="mt-2 text-sm text-ink-muted">Tap the moon on Tonight to play your first story.</p>
          <button onClick={() => navigate('/')} className="mt-5 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95">
            Go to Tonight
          </button>
        </motion.div>
      ) : (
        <>
          {/* Recently Played shelf */}
          {!filter && recentStories.length > 2 && (
            <ShelfSection title="Recently Played">
              <ShelfRow>
                {recentStories.map((story) => (
                  <div key={story.id} className="w-40 shrink-0 snap-start">
                    <LibraryTile
                      story={story}
                      wisdomImageUrls={wisdomImageUrls}
                      onPlay={() => playStory(story)}
                      onShare={() => handleShare(story)}
                      onDelete={() => handleDelete(story.id)}
                      isSharing={sharing === story.id}
                    />
                  </div>
                ))}
              </ShelfRow>
            </ShelfSection>
          )}

          {/* Value-grouped shelves (only when no filter active) */}
          {!filter && valueGroups.map(({ key, meta, stories }) => (
            <ShelfSection key={key} title={`${meta.emoji} ${meta.label} Stories`}>
              <ShelfRow>
                {stories.map((story) => (
                  <div key={story.id} className="w-40 shrink-0 snap-start">
                    <LibraryTile
                      story={story}
                      wisdomImageUrls={wisdomImageUrls}
                      onPlay={() => playStory(story)}
                      onShare={() => handleShare(story)}
                      onDelete={() => handleDelete(story.id)}
                      isSharing={sharing === story.id}
                    />
                  </div>
                ))}
              </ShelfRow>
            </ShelfSection>
          ))}

          {/* All Stories grid (or filtered results) */}
          <ShelfSection title={filter ? `${valueMeta(filter).emoji} ${valueMeta(filter).label}` : 'All Stories'}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((story, i) => renderTile(story, i))}
            </div>
          </ShelfSection>
        </>
      )}

      <div className="h-40" />
    </PageTransition>
  );
}
