// Story Lab — Kids Creator Hub
// Create tab: pick a prompt image, speak a topic, or free record
// My Stories tab: list of kid's recordings with status + play count

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Trash2, Share2, Lock, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';

// Curated prompt images for kids to pick from (rotate daily)
const PROMPT_IMAGES = [
  { id: 'dragon', url: 'https://mysleepytale.com/media/stories/col_fire_truck.jpg', label: 'A fire truck on an adventure' },
  { id: 'space', url: 'https://mysleepytale.com/media/stories/pe_ep1_moon.jpg', label: 'A trip to the moon' },
  { id: 'ocean', url: 'https://mysleepytale.com/media/stories/ws_ep1_splash.jpg', label: 'Splashing in the ocean' },
  { id: 'animals', url: 'https://mysleepytale.com/media/stories/col_loyal_dog.jpg', label: 'A loyal dog' },
  { id: 'forest', url: 'https://mysleepytale.com/media/stories/brave_ep7_chipko.jpg', label: 'A magical forest' },
  { id: 'city', url: 'https://mysleepytale.com/media/stories/brave_ep8_billy_bishop.jpg', label: 'A big city adventure' },
];

function getPromptImages() {
  const day = Math.floor(Date.now() / 86400000);
  const shuffled = PROMPT_IMAGES
    .map((img, i) => ({ img, sort: ((i * 2654435761 + day * 7) >>> 0) % 10000 }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.img);
  return shuffled.slice(0, 4);
}

export default function Incubate() {
  const navigate = useNavigate();
  const { user, loginGoogle } = useAuth();
  const { profile } = useFamilyProfile();
  const [tab, setTab] = useState('create'); // 'create' | 'stories'
  const [kidStories, setKidStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const kidName = profile?.childName || 'Little Creator';
  const promptImages = getPromptImages();

  // Load kid's stories from Firestore
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
        const kidId = `${user.uid}_${0}`; // first profile
        const q = query(
          collection(db, 'kidStories'),
          where('parentUid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setKidStories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.warn('[Incubate] Error loading stories:', e.message);
      }
      setLoading(false);
    })();
  }, [user]);

  // Not logged in
  if (!user) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 pb-32 safe-top">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-6xl mb-4">🎙️</div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Story Lab</h1>
          <p className="mt-2 text-sm text-ink-muted max-w-xs">Your child can create and record their own bedtime stories here.</p>
          <button onClick={loginGoogle} className="mt-6 rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
            Sign in to start creating
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="page-scroll px-5 pt-10 pb-32 safe-top">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-2">🎙️</motion.div>
        <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          {kidName}'s Story Lab
        </h1>
        <p className="text-xs text-ink-muted mt-1">Create, record, and share your own stories!</p>
      </div>

      {/* Tab toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-full bg-bg-surface p-1 ring-1 ring-white/5">
          <button
            onClick={() => setTab('create')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              tab === 'create' ? 'bg-gold text-bg-base shadow-glow' : 'text-ink-muted'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setTab('stories')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              tab === 'stories' ? 'bg-gold text-bg-base shadow-glow' : 'text-ink-muted'
            }`}
          >
            My Stories {kidStories.length > 0 && `(${kidStories.length})`}
          </button>
        </div>
      </div>

      {/* ═══ CREATE TAB ═══ */}
      {tab === 'create' && (
        <div className="space-y-4">
          {/* Option 1: Pick a picture */}
          <div className="rounded-2xl bg-bg-surface p-5 ring-1 ring-white/5">
            <h3 className="text-sm font-bold text-ink mb-1">📸 Pick a Picture</h3>
            <p className="text-[11px] text-ink-muted mb-3">Choose an image and tell a story about it!</p>
            <div className="grid grid-cols-2 gap-2">
              {promptImages.map(img => (
                <motion.button
                  key={img.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/incubate/record?mode=image&prompt=${encodeURIComponent(img.label)}&image=${encodeURIComponent(img.url)}`)}
                  className="relative overflow-hidden rounded-xl aspect-[4/3] ring-1 ring-white/10 transition active:ring-gold/50"
                >
                  <img src={img.url} alt={img.label} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white leading-tight">{img.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Option 2: Tell a topic */}
          <div className="rounded-2xl bg-bg-surface p-5 ring-1 ring-white/5">
            <h3 className="text-sm font-bold text-ink mb-1">💬 Tell Me a Topic</h3>
            <p className="text-[11px] text-ink-muted mb-3">What should your story be about?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && topicInput.trim() && navigate(`/incubate/record?mode=topic&prompt=${encodeURIComponent(topicInput.trim())}`)}
                placeholder="a dragon who loves ice cream..."
                className="flex-1 rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 outline-none focus:ring-gold/50"
              />
              <button
                onClick={() => topicInput.trim() && navigate(`/incubate/record?mode=topic&prompt=${encodeURIComponent(topicInput.trim())}`)}
                disabled={!topicInput.trim()}
                className="rounded-xl bg-gold px-4 py-3 text-sm font-bold text-bg-base transition active:scale-95 disabled:opacity-40"
              >
                Go!
              </button>
            </div>
          </div>

          {/* Option 3: Free record */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/incubate/record?mode=free')}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-500/20 to-gold/20 p-5 ring-1 ring-gold/20 text-left transition"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/20">
                <Mic size={24} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">🎤 Free Story</h3>
                <p className="text-[11px] text-ink-muted mt-0.5">Tell any story you want — no prompt needed!</p>
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* ═══ MY STORIES TAB ═══ */}
      {tab === 'stories' && (
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-12">
              <div className="text-3xl animate-pulse">🎙️</div>
              <p className="mt-2 text-sm text-ink-muted">Loading your stories...</p>
            </div>
          )}

          {!loading && kidStories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>No stories yet!</h3>
              <p className="mt-1 text-sm text-ink-muted">Tap "Create" to record your first story.</p>
              <button
                onClick={() => setTab('create')}
                className="mt-4 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95"
              >
                Create my first story
              </button>
            </div>
          )}

          {kidStories.map(story => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-bg-base ring-1 ring-white/10">
                  {story.promptImageUrl ? (
                    <img src={story.promptImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">🎤</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-ink truncate">{story.title || 'Untitled Story'}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-ink-muted">
                    <span>{Math.ceil((story.durationSeconds || 0) / 60)} min</span>
                    <span>·</span>
                    <span>▶ {story.plays || 0}</span>
                    <span>·</span>
                    <span>❤️ {story.likes || 0}</span>
                  </div>
                  {/* Status badge */}
                  <div className="mt-1.5">
                    {story.status === 'published' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[9px] font-bold text-green-400">
                        <CheckCircle size={10} /> Published
                      </span>
                    )}
                    {story.status === 'pending_approval' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[9px] font-bold text-yellow-400">
                        <Clock size={10} /> Waiting for parent
                      </span>
                    )}
                    {story.status === 'draft' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-ink-muted">
                        <Lock size={10} /> Draft
                      </span>
                    )}
                    {story.status === 'flagged' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400">
                        <AlertTriangle size={10} /> Under review
                      </span>
                    )}
                  </div>
                </div>

                {/* Play button */}
                {story.audioUrl && (
                  <button
                    onClick={() => navigate(`/player?storyId=${story.id}`)}
                    className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-gold text-bg-base transition active:scale-90"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom padding for nav */}
      <div className="h-20" />
    </PageTransition>
  );
}
