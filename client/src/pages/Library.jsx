import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import ValuePill from '../components/ValuePill.jsx';
import { getLibrary, pruneArchive, removeFromLibrary } from '../utils/storyCache.js';
import { shareStoryToFirestore, toggleLike, isLikedByMe, getTopStories } from '../utils/shareStory.js';
import { archiveDaysFor } from '../utils/tierGate.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES, valueMeta, RELIGIONS, COUNTRIES } from '../utils/constants.js';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sharing, setSharing] = useState(null);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState('mine'); // 'mine' | 'top'

  // Top stories state
  const [topStories, setTopStories] = useState([]);
  const [topLoading, setTopLoading] = useState(false);
  const [topBelief, setTopBelief] = useState('all');
  const [topCountry, setTopCountry] = useState('all');

  useEffect(() => {
    pruneArchive(archiveDaysFor(profile?.tier || 'free'));
    setLibrary(getLibrary());
  }, [profile?.tier]);

  // Load top stories when tab switches or filters change
  useEffect(() => {
    if (tab !== 'top') return;
    setTopLoading(true);
    getTopStories({ belief: topBelief, country: topCountry, max: 20 }).then((stories) => {
      setTopStories(stories);
      setTopLoading(false);
    });
  }, [tab, topBelief, topCountry]);

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

  const handleLike = async (story) => {
    const result = await toggleLike(story.id);
    if (!result) {
      showToast('Sign in to like stories');
      return;
    }
    // Update in top stories list
    setTopStories((prev) => prev.map((s) =>
      s.id === story.id ? { ...s, likes: result.likes, likedBy: result.liked ? [...(s.likedBy || []), 'me'] : (s.likedBy || []).filter((x) => x !== 'me') } : s
    ));
    showToast(result.liked ? 'Liked!' : 'Unliked');
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
          {tab === 'mine' ? (
            <>Stories <span className="text-gold">{profile?.childName}</span> has heard</>
          ) : (
            <>Top stories <span className="text-gold">everyone loves</span></>
          )}
        </h1>
      </header>

      {/* Tab switch */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab('mine')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${tab === 'mine' ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'}`}>
          My Stories ({library.length})
        </button>
        <button onClick={() => setTab('top')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${tab === 'top' ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'}`}>
          Top Liked
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MY STORIES TAB ═══ */}
      {tab === 'mine' && (
        <>
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
            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} · tap to replay · share with family
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
                  onLike={() => handleLike(story)}
                  isSharing={sharing === story.id} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══ TOP LIKED TAB ═══ */}
      {tab === 'top' && (
        <>
          {/* Filters */}
          <div className="mb-4 flex gap-2">
            <select value={topBelief} onChange={(e) => setTopBelief(e.target.value)}
              className="flex-1 rounded-xl bg-bg-elevated px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5">
              <option value="all">All beliefs</option>
              {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
            </select>
            <select value={topCountry} onChange={(e) => setTopCountry(e.target.value)}
              className="flex-1 rounded-xl bg-bg-elevated px-3 py-2 text-sm text-ink outline-none ring-1 ring-white/5">
              <option value="all">All countries</option>
              {COUNTRIES.map((c) => <option key={c.key} value={c.key}>{c.flag} {c.label}</option>)}
            </select>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : topStories.length === 0 ? (
            <div className="card-elevated mt-8 text-center">
              <div className="mb-4 text-5xl">🏆</div>
              <p className="font-display text-xl font-bold text-ink">No top stories yet</p>
              <p className="mt-2 text-sm text-ink-muted">
                Share your stories and like others' to build the community collection!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topStories.map((story, idx) => (
                <TopStoryCard key={story.id} story={story} rank={idx + 1}
                  onPlay={() => { load(story); navigate('/player'); }}
                  onLike={() => handleLike(story)} />
              ))}
            </div>
          )}
        </>
      )}

      <VersionFooter />
    </PageTransition>
  );
}

function LibraryCard({ story, onPlay, onShare, onDelete, onLike, isSharing }) {
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
          <div className="truncate font-ui text-sm font-bold text-ink">{story.title}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
            <span>{meta.label}</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{story.estimatedMinutes} min</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{date}</span>
          </div>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-card text-gold">▶</span>
      </button>
      <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2">
        <button onClick={onLike}
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-ink-muted transition active:scale-95">
          {isLikedByMe(story) ? '❤️' : '🤍'} {story.likes || 0}
        </button>
        <button onClick={onShare} disabled={isSharing}
          className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition active:scale-95 disabled:opacity-50">
          {isSharing ? <span className="inline-block h-3 w-3 animate-spin rounded-full border border-gold border-t-transparent" /> : '↗'} Share
        </button>
        <button onClick={() => { if (confirm('Remove from library?')) onDelete(); }}
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-ink-muted transition active:scale-95">
          Remove
        </button>
        {story.generatedBy === 'claude' && (
          <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-gold/40">AI</span>
        )}
      </div>
    </div>
  );
}

function TopStoryCard({ story, rank, onPlay, onLike }) {
  const meta = valueMeta(story.value);
  const liked = isLikedByMe(story);

  return (
    <div className="rounded-2xl bg-bg-surface shadow-card">
      <button onClick={onPlay} className="flex w-full items-center gap-3 p-3 text-left">
        {/* Rank badge */}
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
          rank <= 3 ? 'bg-gold text-bg-base' : 'bg-bg-card text-ink-muted'
        }`}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
        </div>
        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl text-xl"
          style={{ background: `linear-gradient(135deg, ${meta.color}55, ${meta.color}11)` }}>
          <span>{meta.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-ui text-sm font-bold text-ink">{story.title}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
            <span>{meta.label}</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{story.estimatedMinutes} min</span>
            <span className="h-1 w-1 rounded-full bg-ink-dim" />
            <span>{story.language}</span>
          </div>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-card text-gold">▶</span>
      </button>
      <div className="flex items-center gap-3 border-t border-white/5 px-3 py-2">
        <button onClick={onLike}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition active:scale-95 ${
            liked ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-ink-muted'
          }`}>
          {liked ? '❤️' : '🤍'} {story.likes || 0} {(story.likes || 0) === 1 ? 'like' : 'likes'}
        </button>
        {story.beliefs?.length > 0 && (
          <span className="text-[10px] text-ink-dim">
            {story.beliefs.map((b) => RELIGIONS.find((r) => r.key === b)?.icon || '').join(' ')}
          </span>
        )}
        {story.country && (
          <span className="text-[10px] text-ink-dim">
            {COUNTRIES.find((c) => c.key === story.country)?.flag || ''}
          </span>
        )}
      </div>
    </div>
  );
}
