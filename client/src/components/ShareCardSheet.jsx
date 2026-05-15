// Bottom sheet for sharing/saving a story card after reflection.

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import BottomSheet from './BottomSheet.jsx';
import ShareableStoryCard from './ShareableStoryCard.jsx';
import { exportCardAsImage, shareCardImage } from '../utils/cardExport.js';
import { extractMoral } from '../utils/moralExtractor.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { trackStoryCardShared } from '../utils/analytics.js';

export default function ShareCardSheet({ open, onClose, story, imageUrl }) {
  const cardRef = useRef(null);
  const { profile } = useFamilyProfile();
  const [sharing, setSharing] = useState(false);
  const { moral } = extractMoral(story);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await exportCardAsImage(cardRef.current);
      if (blob) {
        await shareCardImage(blob, story);
        trackStoryCardShared(story?.id);
      }
    } catch {}
    setSharing(false);
    onClose();
  };

  const handleSave = async () => {
    setSharing(true);
    try {
      const blob = await exportCardAsImage(cardRef.current);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${story?.title || 'story'}.png`;
        a.click();
        URL.revokeObjectURL(url);
        trackStoryCardShared(story?.id);
      }
    } catch {}
    setSharing(false);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">
        Share this story
      </p>

      {/* Card preview (scaled down) */}
      <div className="mx-auto mb-5 flex justify-center" style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
        <ShareableStoryCard
          ref={cardRef}
          story={story}
          moral={moral}
          childName={profile?.childName}
          imageUrl={imageUrl}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={sharing}
          className="flex-1 rounded-2xl bg-gold py-3.5 text-center text-sm font-bold text-bg-base shadow-glow transition disabled:opacity-50"
        >
          {sharing ? 'Preparing...' : 'Share'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={sharing}
          className="flex-1 rounded-2xl bg-white/5 py-3.5 text-center text-sm font-bold text-ink ring-1 ring-white/10 transition disabled:opacity-50"
        >
          Save Image
        </motion.button>
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full text-center text-[11px] font-bold text-ink-dim"
      >
        Skip
      </button>
    </BottomSheet>
  );
}
