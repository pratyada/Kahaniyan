// Swipeable image gallery during story playback.
// Shows story photos that user can swipe through while listening.
// Tap to expand fullscreen — audio keeps playing.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function StoryGallery({ storyId, coverImage, extraImages = [] }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Load gallery from Firestore or use extraImages (for personal/creator series)
  useEffect(() => {
    if (!storyId) return;

    // If extraImages provided (from personal/creator series), use those directly
    if (extraImages.length > 0) {
      const all = coverImage && !extraImages.includes(coverImage)
        ? [coverImage, ...extraImages] : extraImages;
      setImages(all.filter(Boolean));
      return;
    }

    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomGallery'));
        if (snap.exists()) {
          const gallery = snap.data()[storyId] || [];
          const all = coverImage && !gallery.includes(coverImage) ? [coverImage, ...gallery] : gallery;
          setImages(all);
        } else if (coverImage) {
          setImages([coverImage]);
        }
      } catch {}
    })();
  }, [storyId, coverImage, extraImages.length]);

  if (images.length === 0) return null;

  const goNext = () => setCurrent((c) => (c + 1) % images.length);
  const goPrev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <>
      {/* Inline gallery */}
      <div
        className="relative w-full overflow-hidden rounded-2xl mb-4 cursor-pointer"
        style={{ aspectRatio: '16/10' }}
        onClick={() => setFullscreen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt=""
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) goNext();
              else if (info.offset.x > 50) goPrev();
            }}
            className="absolute inset-0 h-full w-full object-cover cursor-grab active:cursor-grabbing"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </AnimatePresence>

        {/* Tap to expand hint */}
        <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[9px] font-bold text-white/80">Tap to expand</span>
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all ${
                  i === current ? 'h-2 w-5 bg-gold' : 'h-2 w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Photo count */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="text-[9px] font-bold text-white/80">{current + 1}/{images.length}</span>
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
            onClick={() => setFullscreen(false)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
              <span className="text-xs font-bold text-white/60">
                {current + 1} / {images.length}
              </span>
              <button
                onClick={() => setFullscreen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={images[current]}
                  alt=""
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) goNext();
                    else if (info.offset.x > 60) goPrev();
                    // Swipe down to close
                    if (info.offset.y > 100) setFullscreen(false);
                  }}
                  className="absolute inset-0 h-full w-full object-contain cursor-grab active:cursor-grabbing"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </AnimatePresence>

              {/* Nav arrows on desktop */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white text-lg backdrop-blur-sm transition active:scale-95 hover:bg-white/20"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white text-lg backdrop-blur-sm transition active:scale-95 hover:bg-white/20"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Bottom dots */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-4 safe-bottom">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={`rounded-full transition-all ${
                      i === current ? 'h-2.5 w-7 bg-gold' : 'h-2.5 w-2.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
