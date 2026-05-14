// Full-width hero banner for tonight's featured story.
// Replaces the "Moon" section from old Home.jsx.

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { getStoryArt } from '../utils/storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';

export default function HeroBanner({ story, imageUrl, onPlay }) {
  if (!story) return null;

  const art = getStoryArt(story.id);
  const tradition = TRADITIONS.find((t) => t.key === story.tradition);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6 overflow-hidden"
    >
      <div
        className="relative mx-auto flex flex-col items-center rounded-3xl p-6 lg:p-10 lg:flex-row lg:gap-8 overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.1)', minHeight: '14rem' }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: art.gradient }} />
        {/* Image overlay */}
        {(imageUrl || art.image) && (
          <img
            src={imageUrl || art.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Moon play button */}
        <motion.button
          onClick={() => onPlay(story)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="relative mb-4 grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffd98a, #f0a500 50%, #b87f00)',
            boxShadow: '0 0 60px rgba(240,165,0,0.35), 0 0 120px rgba(240,165,0,0.15), inset 0 -4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle at 65% 40%, transparent 35%, rgba(10,10,15,0.7) 75%)' }}
          />
          <Play size={36} fill="rgba(10,10,15,0.9)" stroke="none" className="relative z-10 ml-1" />
        </motion.button>

        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Tonight's Story
        </p>
        <h2
          className="mt-1 text-center text-lg font-bold text-white"
          style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
        >
          {story.title}
        </h2>
        <p className="mt-1 text-xs text-white/60">
          {tradition?.label} · {story.durationMinutes} min
        </p>
      </div>
    </motion.section>
  );
}
