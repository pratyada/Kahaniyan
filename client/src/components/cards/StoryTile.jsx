// Portrait card (2:3 aspect) with play counts + rating — Pocket FM style.

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { getStoryArt, getTraditionArt } from '../../utils/storyArt.js';
import { TRADITIONS } from '../../data/culturalLessons.js';
import { getPlayCount, getRating, formatCount } from '../../utils/socialProof.js';

export default function StoryTile({ lesson, imageUrl, onPlay }) {
  const art = getStoryArt(lesson.id);
  const tradArt = getTraditionArt(lesson.tradition);
  const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
  const plays = getPlayCount(lesson.id);
  const rating = getRating(lesson.id);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onPlay(lesson)}
      className="group relative flex w-40 lg:w-48 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl text-left"
      style={{ aspectRatio: '2/3', minHeight: 240 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ background: art.gradient }} />
      {/* Image */}
      {(imageUrl || art.image) && (
        <img src={imageUrl || art.image} alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy" decoding="async"
          onError={(e) => { e.target.style.display = 'none'; }} />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play button (top right) */}
      <div className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition group-hover:bg-white/20 group-hover:text-white">
        <Play size={12} fill="currentColor" />
      </div>

      {/* Play count badge (top left) */}
      <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
        <span className="text-[9px] font-bold text-white/90">▶ {formatCount(plays)}</span>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 p-3 pt-8">
        {/* Tradition badge */}
        {tradition && (
          <div className="mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: `${tradArt.color}33` }}>
            <span className="text-[9px] font-bold text-white/90">{tradition.label}</span>
          </div>
        )}
        {/* Title */}
        <p className="line-clamp-2 text-xs font-bold leading-snug text-white"
          style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {lesson.title}
        </p>
        {/* Plays + Rating + Duration */}
        <div className="mt-1 flex items-center gap-1.5 text-[9px] text-white/60">
          <span>⭐ {rating}</span>
          <span>·</span>
          <span>{lesson.durationMinutes} min</span>
        </div>
      </div>
    </motion.button>
  );
}
