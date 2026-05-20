// Creator profile page — shows all stories and series by a specific creator.
// Route: /creator/:creatorId

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { fillTokens } from '../utils/storyHelpers.js';

export default function CreatorProfile() {
  const { t } = useTranslation();
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const [creator, setCreator] = useState(null);
  const [stories, setStories] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) { setLoading(false); return; }
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        const [storySnap, seriesSnap] = await Promise.all([
          getDocs(query(collection(db, 'creatorStories'), where('authorUid', '==', creatorId), where('status', '==', 'published'))),
          getDocs(query(collection(db, 'creatorSeries'), where('authorUid', '==', creatorId), where('status', '==', 'published'))),
        ]);

        const sl = []; storySnap.forEach((d) => sl.push({ id: d.id, ...d.data() }));
        const se = []; seriesSnap.forEach((d) => se.push({ id: d.id, ...d.data() }));

        sl.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
        se.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

        setStories(sl);
        setSeries(se);

        // Get creator info from first item
        const first = sl[0] || se[0];
        if (first) {
          setCreator({
            name: first.authorName || 'Creator',
            email: first.authorEmail || '',
            uid: first.authorUid,
            storyCount: sl.length,
            seriesCount: se.length,
            totalEpisodes: se.reduce((sum, s) => sum + (s.totalEpisodes || 0), 0),
          });
        }
      } catch (e) { console.warn('[CreatorProfile]', e.message); }
      setLoading(false);
    })();
  }, [creatorId]);

  const playStory = (story) => {
    const filledText = fillTokens(story.body || '', user ? profile : null);
    load({
      id: story.id, title: story.title, text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: Math.max(1, Math.round((story.body || '').split(/\s+/).length / 150)),
      value: story.theme || 'kindness', language: 'English', voice: 'AI Narrator',
      tradition: story.tradition || 'universal',
      source: story.source || `by ${story.authorName}`,
      createdAt: story.submittedAt || new Date().toISOString(),
      isWisdom: true, coverImage: story.coverImage || null,
    });
    navigate('/player');
  };

  const playEpisode = (ser, ep) => {
    const filledText = fillTokens(ep.body || '', user ? profile : null);
    load({
      id: `cs_${ser.id}_ep${ep.episodeNumber}`, title: ep.title, text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: Math.max(1, Math.round((ep.body || '').split(/\s+/).length / 150)),
      value: 'kindness', language: 'English', voice: 'AI Narrator',
      tradition: ser.tradition || 'universal',
      source: `${ser.title} · Episode ${ep.episodeNumber}`,
      createdAt: ser.submittedAt || new Date().toISOString(),
      isWisdom: true, coverImage: ep.coverImage || null,
    });
    navigate('/player');
  };

  const initials = (name) => (name || 'C').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="mt-3 text-sm text-ink-muted">{t('common.loading')}</p>
        </div>
      </PageTransition>
    );
  }

  if (!creator) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center">
          <div className="text-4xl mb-3">😔</div>
          <p className="text-ink-muted">Creator not found or no published content yet.</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Go Home</button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Hero */}
      <div className="px-5 pt-10 pb-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white">
          <ArrowLeft size={14} className="inline mr-1" />Back
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-xl font-bold text-gold ring-2 ring-gold/30">
            {initials(creator.name)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              {creator.name}
            </h1>
            <p className="text-xs text-ink-muted">Story Creator</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          {creator.storyCount > 0 && (
            <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center">
              <div className="text-lg font-bold text-gold">{creator.storyCount}</div>
              <div className="text-[9px] text-ink-muted">{creator.storyCount === 1 ? 'Story' : 'Stories'}</div>
            </div>
          )}
          {creator.seriesCount > 0 && (
            <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center">
              <div className="text-lg font-bold text-gold">{creator.seriesCount}</div>
              <div className="text-[9px] text-ink-muted">{creator.seriesCount === 1 ? 'Series' : 'Series'}</div>
            </div>
          )}
          {creator.totalEpisodes > 0 && (
            <div className="rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/5 text-center">
              <div className="text-lg font-bold text-gold">{creator.totalEpisodes}</div>
              <div className="text-[9px] text-ink-muted">Episodes</div>
            </div>
          )}
        </div>
      </div>

      {/* Series */}
      {series.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Fraunces, serif' }}>Series</h2>
          <div className="space-y-3">
            {series.map((ser) => (
              <div key={ser.id} className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{ser.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{ser.title}</h3>
                    <p className="text-[10px] text-ink-muted">{ser.totalEpisodes} episodes · {ser.tradition}</p>
                  </div>
                </div>
                {ser.description && <p className="text-xs text-ink-muted mb-3">{ser.description}</p>}
                <div className="space-y-2">
                  {(ser.episodes || []).map((ep, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => playEpisode(ser, ep)}
                      className="w-full flex items-center gap-3 rounded-xl bg-black/20 p-3 text-left ring-1 ring-white/5"
                    >
                      {ep.coverImage ? (
                        <img src={ep.coverImage} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/5 text-sm font-bold text-gold">
                          {ep.episodeNumber}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink">Ep {ep.episodeNumber}: {ep.title}</p>
                        <p className="text-[10px] text-ink-muted">{(ep.body || '').split(/\s+/).length} words</p>
                      </div>
                      <Play size={14} className="shrink-0 text-gold" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stories */}
      {stories.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Fraunces, serif' }}>Stories</h2>
          <div className="grid grid-cols-2 gap-3">
            {stories.map((story) => (
              <motion.button
                key={story.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => playStory(story)}
                className="relative overflow-hidden rounded-2xl text-left ring-1 ring-white/8"
                style={{ aspectRatio: '3/4' }}
              >
                {story.coverImage ? (
                  <img src={story.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-orange-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold/20 text-gold backdrop-blur-sm">
                  <Play size={10} fill="currentColor" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-gold/70">{story.tradition}</p>
                  <h4 className="text-xs font-bold text-white leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                    {story.title}
                  </h4>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
