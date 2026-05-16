// Pocket FM-style hero slider — auto-rotating full-width carousel.
// Shows 5 featured stories with "Play Now" + "More Info", dot indicators, swipe.

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { getStoryArt, getTraditionArt } from '../utils/storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';
import { extractMoral } from '../utils/moralExtractor.js';

const ROTATE_INTERVAL = 6000; // 6 seconds per slide

export default function HeroSlider({ stories, wisdomImageUrls, onPlay, onInfo }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = stories?.length || 0;

  // Auto-rotate
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) {
        setDirection(1);
        setCurrent((i) => (i + 1) % count);
      }
    }, ROTATE_INTERVAL);
  }, [count, paused]);

  useEffect(() => {
    if (count > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count, startTimer]);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    startTimer(); // reset timer on manual nav
  };

  // Swipe handling
  const dragStartX = useRef(0);
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -50) {
      setDirection(1);
      setCurrent((i) => (i + 1) % count);
      startTimer();
    } else if (info.offset.x > 50) {
      setDirection(-1);
      setCurrent((i) => (i - 1 + count) % count);
      startTimer();
    }
  };

  if (!stories || count === 0) return null;

  const story = stories[current];
  const lessonKey = story?.id || '';
  const art = getStoryArt(lessonKey);
  const tradition = TRADITIONS.find((t) => t.key === story?.tradition);
  const tradArt = getTraditionArt(story?.tradition);
  const imageUrl = wisdomImageUrls?.[lessonKey] || art.image;
  const { moralShort } = extractMoral(story);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 }),
  };

  return (
    <section
      className="relative mb-6 -mx-5 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{ aspectRatio: '16/8', minHeight: 220 }}
        >
          {/* Background */}
          <div className="absolute inset-0" style={{ background: art.gradient }} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          {/* Multi-layer overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.2) 100%)',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.8) 100%)',
          }} />

          {/* Content — left-aligned */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-8 lg:justify-center lg:max-w-[60%]">
            {/* Tradition badge */}
            {tradition && (
              <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background: `${tradArt.color}33`, border: `1px solid ${tradArt.color}44` }}>
                <span className="text-[10px] font-bold text-white/90">
                  {tradition.icon} {tradition.label}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-1.5"
              style={{ fontFamily: 'Fraunces, serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {story.title}
            </h2>

            {/* Subtitle — moral excerpt */}
            <p className="text-[11px] lg:text-xs text-white/60 leading-relaxed line-clamp-2 mb-4 max-w-[85%]">
              {moralShort || `${story.durationMinutes} min · ${story.source || ''}`}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onPlay(story)}
                className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-bg-base shadow-glow transition active:scale-95"
              >
                <Play size={16} fill="currentColor" />
                Play Now
              </button>
              {onInfo && (
                <button
                  onClick={() => onInfo(story)}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/90 backdrop-blur-sm ring-1 ring-white/10 transition active:scale-95"
                >
                  <Info size={14} />
                  More Info
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'h-2 w-6 bg-gold'
                  : 'h-2 w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar for auto-rotate */}
      {count > 1 && !paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            key={current}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: ROTATE_INTERVAL / 1000, ease: 'linear' }}
            className="h-full bg-gold/40"
          />
        </div>
      )}
    </section>
  );
}
