// Wide landscape card (16:9) for "Continue Listening" shelf.
// Shows progress bar, resume indicator, and story title.

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { getStoryArt } from '../../utils/storyArt.js';

export default function StoryTileWide({ story, imageUrl, progress, onPlay }) {
  const art = getStoryArt(story.storyId || story.id);
  const pct = Math.round((progress || 0) * 100);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onPlay(story)}
      className="group relative flex w-56 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl text-left"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: art.gradient }} />
      {(imageUrl || art.image) && (
        <img
          src={imageUrl || art.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Play icon */}
      <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
        <Play size={12} fill="currentColor" />
      </div>

      {/* Resume badge */}
      <div className="absolute left-3 top-3 rounded-full bg-gold/90 px-2 py-0.5">
        <span className="text-[9px] font-bold text-bg-base">Continue</span>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 p-3 pt-0">
        <p
          className="line-clamp-1 text-xs font-bold text-white"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          {story.title}
        </p>
        {/* Progress bar */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[9px] text-white/50">{pct}% complete</p>
      </div>
    </motion.button>
  );
}
