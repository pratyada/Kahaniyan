import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import ValuePill from '../components/ValuePill.jsx';
import { getLibrary, pruneArchive, removeFromLibrary, loadAndMergeLibrary } from '../utils/storyCache.js';
import { shareStoryToFirestore } from '../utils/shareStory.js';
import { archiveDaysFor } from '../utils/tierGate.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES, valueMeta } from '../utils/constants.js';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sharing, setSharing] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    pruneArchive(archiveDaysFor(profile?.tier || 'free'));
    // Load local first (instant), then merge with Firestore (cross-device)
    setLibrary(getLibrary());
    loadAndMergeLibrary().then((merged) => setLibrary(merged));
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
        await navigator.share({
          title: `${story.title} — My Sleepy Tale`,
          text: `Listen to this bedtime story! "${story.title}"`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        showToast('Link copied!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') showToast('Could not share');
    }
    setSharing(null);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-4">
        <p className="ui-label">Library</p>
        <h1 className="display-title mt-1 text-ink">
          Stories <span className="text-gold">{profile?.childName}</span> has heard
        </h1>
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

      {/* Filters */}
      <div className="mb-4 -mx-5 overflow-x-auto px-5">
        <div className="flex w-max gap-2">
          <button onClick={() => setFilter(null)}
            className={`btn-pill px-4 py-2 text-sm font-bold ${!filter ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink'}`}>
            All
          </button>
          {VALUES.map((v) => (
            <ValuePill key={v.key} value={v.key} size="sm" active={filter === v.key}
              onClick={() => setFilter(filter === v.key ? null : v.key)} />
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-ink-muted">
        {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} · tap to replay · share with community
      </p>

      {filtered.length === 0 ? (
        <div className="card-elevated mt-8 text-center">
          <div className="mb-4 text-5xl">📖</div>
          <p className="font-display text-xl font-bold text-ink">
            {library.length === 0 ? 'Your library is empty' : 'No stories with that value yet'}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {library.length === 0 ? "Tap Tonight to weave your child's first bedtime story." : 'Try a different filter.'}
          </p>
          <button onClick={() => navigate('/')} className="btn-primary mt-5">
            {library.length === 0 ? 'Weave first story' : 'Back to Tonight'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((story) => (
            <LibraryCard key={story.id} story={story}
              onPlay={() => { load(story); navigate('/player'); }}
              onShare={() => handleShare(story)}
              onDelete={() => handleDelete(story.id)}
              isSharing={sharing === story.id} />
          ))}
        </div>
      )}

    </PageTransition>
  );
}

function LibraryCard({ story, onPlay, onShare, onDelete, isSharing }) {
  const meta = valueMeta(story.value);
  const date = new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="rounded-2xl bg-bg-surface shadow-card">
      <button onClick={onPlay} className="flex w-full items-center gap-3 p-3 text-left">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl text-2xl"
          style={{ background: `linear-gradient(135deg, ${meta.color}55, ${meta.color}11)` }}>
          <span>{meta.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-ui text-sm font-bold text-ink">{story.title || 'Untitled Story'}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
            <span>{meta.label}</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{story.estimatedMinutes || '?'} min</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{date}</span>
          </div>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-card text-gold">▶</span>
      </button>
      <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2">
        <button onClick={onShare} disabled={isSharing}
          className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition active:scale-95 disabled:opacity-50">
          {isSharing ? <span className="inline-block h-3 w-3 animate-spin rounded-full border border-gold border-t-transparent" /> : '↗'} Share with community
        </button>
        <button onClick={() => { if (confirm('Remove from library?')) onDelete(); }}
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-ink-muted transition active:scale-95">
          Remove
        </button>
      </div>
    </div>
  );
}
