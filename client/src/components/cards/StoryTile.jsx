// Portrait card (2:3 aspect) for Netflix-style shelf rows.
// Shows story art/image, tradition badge, title, duration, and optional play count.

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { getStoryArt, getTraditionArt } from '../../utils/storyArt.js';
import { TRADITIONS } from '../../data/culturalLessons.js';
import { formatPlays } from '../../utils/storyHelpers.js';

export default function StoryTile({ lesson, imageUrl, plays, onPlay }) {
  const art = getStoryArt(lesson.id);
  const tradArt = getTraditionArt(lesson.tradition);
  const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
  const playCount = formatPlays(plays);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onPlay(lesson)}
      className="group relative flex w-40 lg:w-48 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl text-left"
      style={{ aspectRatio: '2/3' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ background: art.gradient }}
      />
      {/* Image overlay */}
      {(imageUrl || art.image) && (
        <img
          src={imageUrl || art.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      {/* Dark overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Play button */}
      <div className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition group-hover:bg-white/20 group-hover:text-white">
        <Play size={12} fill="currentColor" />
      </div>

      {/* Play count badge */}
      {playCount && (
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[9px] font-bold text-white/80">▶ {playCount}</span>
        </div>
      )}

      {/* Bottom content */}
      <div className="relative z-10 p-3 pt-8">
        {/* Tradition badge */}
        <div
          className="mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5"
          style={{ background: `${tradArt.color}33` }}
        >
          <span className="text-[9px] font-bold text-white/90">
            {tradition?.label}
          </span>
        </div>
        {/* Title */}
        <p
          className="line-clamp-2 text-xs font-bold leading-snug text-white"
          style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          {lesson.title}
        </p>
        <p className="mt-0.5 text-[9px] text-white/50">
          {lesson.durationMinutes} min
        </p>
      </div>
    </motion.button>
  );
}
