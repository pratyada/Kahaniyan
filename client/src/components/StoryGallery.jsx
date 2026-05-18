// Swipeable image gallery during story playback.
// Shows story photos that user can swipe through while listening.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryGallery({ storyId, coverImage }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // Load gallery from Firestore
  useEffect(() => {
    if (!storyId) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'config', 'wisdomGallery'));
        if (snap.exists()) {
          const gallery = snap.data()[storyId] || [];
          // Include cover image at the start if not already in gallery
          const all = coverImage && !gallery.includes(coverImage) ? [coverImage, ...gallery] : gallery;
          setImages(all);
        } else if (coverImage) {
          setImages([coverImage]);
        }
      } catch {}
    })();
  }, [storyId, coverImage]);

  if (images.length === 0) return null;

  const goNext = () => setCurrent((c) => (c + 1) % images.length);
  const goPrev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: '16/10' }}>
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

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
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
  );
}
