// Share card sheet — big preview + motivating share flow.

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './BottomSheet.jsx';
import ShareableStoryCard from './ShareableStoryCard.jsx';
import { exportCardAsImage, shareStoryCard, downloadCardImage, getStoryShareUrl } from '../utils/cardExport.js';
import { extractMoral } from '../utils/moralExtractor.js';
import { useReflections } from '../utils/reflectionStore.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { trackStoryCardShared } from '../utils/analytics.js';

export default function ShareCardSheet({ open, onClose, story, imageUrl }) {
  const cardRef = useRef(null);
  const { profile } = useFamilyProfile();
  const { getReflection } = useReflections();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const { moral } = extractMoral(story);

  // Get the feeling emoji from reflection
  const reflection = getReflection(story?.id);
  const feeling = reflection?.answers?.find((a) => a.type === 'emoji')?.answer;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleShare = async () => {
    setBusy(true);
    try {
      const blob = await exportCardAsImage(cardRef.current);
      const result = await shareStoryCard(blob, story, profile?.childName, profile);
      if (result === 'shared') {
        trackStoryCardShared(story?.id);
        showToast('Shared!');
        setTimeout(onClose, 800);
      } else if (result === 'copied') {
        trackStoryCardShared(story?.id);
        showToast('Link copied to clipboard!');
      }
    } catch {}
    setBusy(false);
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const blob = await exportCardAsImage(cardRef.current);
      if (blob) {
        downloadCardImage(blob, story);
        trackStoryCardShared(story?.id);
        showToast('Image saved!');
      } else {
        showToast('Could not generate image');
      }
    } catch {}
    setBusy(false);
  };

  const handleCopyLink = async () => {
    try {
      const url = await getStoryShareUrl(story, profile);
      await navigator.clipboard.writeText(url);
      showToast('Link copied!');
    } catch {
      showToast('Could not copy');
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 rounded-full bg-gold px-4 py-2 text-center text-xs font-bold text-bg-base"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivating header */}
      <div className="mb-4 text-center">
        <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          Share tonight's story
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Inspire another family's bedtime routine
        </p>
      </div>

      {/* Card preview — prominent, centered */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="mx-auto mb-5 overflow-hidden rounded-2xl shadow-lift"
        style={{ width: 270, height: 480 }}
      >
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: 360, height: 640 }}>
          <ShareableStoryCard
            ref={cardRef}
            story={story}
            moral={moral}
            childName={profile?.childName}
            imageUrl={imageUrl}
            feeling={feeling}
          />
        </div>
      </motion.div>

      {/* Primary: Share */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        disabled={busy}
        className="mb-2 w-full rounded-2xl bg-gold py-4 text-center text-base font-bold text-bg-base shadow-glow transition disabled:opacity-50"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {busy ? 'Preparing...' : 'Share with friends & family'}
      </motion.button>

      {/* Secondary row */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleSave}
          disabled={busy}
          className="flex-1 rounded-xl bg-white/5 py-3 text-center text-[11px] font-bold text-ink-muted ring-1 ring-white/10 transition active:scale-97 disabled:opacity-50"
        >
          Save Image
        </button>
        <button
          onClick={handleCopyLink}
          className="flex-1 rounded-xl bg-white/5 py-3 text-center text-[11px] font-bold text-ink-muted ring-1 ring-white/10 transition active:scale-97"
        >
          Copy Link
        </button>
      </div>

      <button onClick={onClose} className="w-full py-2 text-center text-[11px] text-ink-dim">
        Maybe later
      </button>
    </BottomSheet>
  );
}
