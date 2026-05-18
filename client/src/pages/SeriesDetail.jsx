// Series detail page — shows all episodes with progress.

import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { SERIES } from '../data/series.js';
import { useSeriesProgress } from '../hooks/useSeriesProgress.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { fillTokens } from '../utils/storyHelpers.js';
import { getPlayCount, getRating, formatCount } from '../utils/socialProof.js';

export default function SeriesDetail() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const { getSeriesProgress, isEpisodeComplete } = useSeriesProgress();

  const series = SERIES.find((s) => s.id === seriesId);
  if (!series) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center">
          <p className="text-ink-muted">Series not found</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Go Home</button>
        </div>
      </PageTransition>
    );
  }

  const sp = getSeriesProgress(series.id);
  const completedCount = sp.completed.length;

  const playEpisode = (episode) => {
    const filledText = fillTokens(episode.body || '', user ? profile : null);
    load({
      id: episode.id,
      title: episode.title,
      text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: episode.durationMinutes,
      value: episode.value || 'courage',
      language: profile?.language || 'English',
      voice: 'AI Narrator',
      tradition: episode.tradition,
      source: episode.source,
      createdAt: new Date().toISOString(),
      isWisdom: true,
      seriesId: series.id,
      episodeId: episode.id,
    });
    navigate('/player');
  };

  // Find next episode to play
  const nextEpisode = series.episodes.find((ep) => !isEpisodeComplete(series.id, ep.id));

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <div className="absolute inset-0" style={{ background: series.gradient }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />

        <div className="relative px-5 pt-10 pb-6">
          <button onClick={() => navigate('/')}
            className="mb-4 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white">
            ← Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{series.icon}</span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold/70">Series · {series.totalEpisodes} episodes</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>
                {series.title}
              </h1>
            </div>
          </div>

          <p className="text-xs text-white/60 leading-relaxed mb-3">{series.description}</p>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 flex-1">
              {series.episodes.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < completedCount ? 'bg-gold' : 'bg-white/15'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-white/50">
              {completedCount}/{series.totalEpisodes} done
            </span>
          </div>
        </div>
      </div>

      {/* Continue button */}
      {nextEpisode && (
        <div className="px-5 -mt-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => playEpisode(nextEpisode)}
            className="w-full flex items-center gap-3 rounded-2xl bg-gold py-4 px-5 shadow-glow"
          >
            <Play size={20} fill="#0a0a0f" className="text-bg-base" />
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-bg-base">
                {completedCount === 0 ? 'Start Series' : 'Continue'}
              </p>
              <p className="text-[10px] text-bg-base/70">
                Episode {nextEpisode.episodeNumber}: {nextEpisode.title}
              </p>
            </div>
          </motion.button>
        </div>
      )}

      {/* Episode list */}
      <div className="px-5 space-y-3">
        {series.episodes.map((ep, i) => {
          const done = isEpisodeComplete(series.id, ep.id);
          const isNext = nextEpisode?.id === ep.id;
          const plays = getPlayCount(ep.id);
          const rating = getRating(ep.id);
          const wordCount = (ep.body || '').split(/\s+/).filter(Boolean).length;
          const realDuration = Math.max(1, Math.round(wordCount / 150));

          return (
            <motion.button
              key={ep.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playEpisode(ep)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`w-full flex items-start gap-3 rounded-2xl p-4 text-left transition ${
                isNext
                  ? 'bg-gold/10 ring-1 ring-gold/30'
                  : done
                  ? 'bg-bg-surface/50 ring-1 ring-white/5'
                  : 'bg-bg-surface ring-1 ring-white/5'
              }`}
            >
              {/* Episode number */}
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                done ? 'bg-gold/20 text-gold' : isNext ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted'
              }`}>
                {done ? <CheckCircle size={18} /> : ep.episodeNumber}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${done ? 'text-ink-muted' : 'text-ink'}`}
                  style={{ fontFamily: 'Fraunces, serif' }}>
                  {ep.title}
                </p>
                <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{ep.subtitle}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[9px] text-ink-dim">
                  <span>▶ {formatCount(plays)}</span>
                  <span>⭐ {rating}</span>
                  <span>{realDuration} min</span>
                </div>
              </div>

              {/* Play icon */}
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                isNext ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted'
              }`}>
                <Play size={14} fill="currentColor" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion state */}
      {completedCount === series.totalEpisodes && (
        <div className="px-5 mt-6 mb-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-sm font-bold text-gold" style={{ fontFamily: 'Fraunces, serif' }}>
            Series Complete!
          </p>
          <p className="text-[11px] text-ink-muted mt-1">
            You finished all {series.totalEpisodes} episodes. Replay anytime!
          </p>
        </div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
