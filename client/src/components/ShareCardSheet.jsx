// Share card sheet — preview + share/save/copy actions.

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import BottomSheet from './BottomSheet.jsx';
import ShareableStoryCard from './ShareableStoryCard.jsx';
import { exportCardAsImage, shareStoryCard, downloadCardImage, getStoryShareUrl } from '../utils/cardExport.js';
import { extractMoral } from '../utils/moralExtractor.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { trackStoryCardShared } from '../utils/analytics.js';

export default function ShareCardSheet({ open, onClose, story, imageUrl }) {
  const cardRef = useRef(null);
  const { profile } = useFamilyProfile();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const { moral } = extractMoral(story);

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
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-full bg-gold px-4 py-2 text-center text-xs font-bold text-bg-base"
        >
          {toast}
        </motion.div>
      )}

      <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">
        Share this story
      </p>

      {/* Card preview (compact — scaled to fit without scrolling) */}
      <div className="mx-auto mb-4 overflow-hidden rounded-xl" style={{ width: 216, height: 192 }}>
        <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: 360, height: 320 }}>
          <ShareableStoryCard
            ref={cardRef}
            story={story}
            moral={moral}
            childName={profile?.childName}
            imageUrl={imageUrl}
          />
        </div>
      </div>
      {/* Story title under preview */}
      <p className="mb-4 text-center text-sm font-bold text-ink line-clamp-1" style={{ fontFamily: 'Fraunces, serif' }}>
        {story?.title}
      </p>

      {/* Primary action: Share (opens native share sheet) */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        disabled={busy}
        className="mb-3 w-full rounded-2xl bg-gold py-4 text-center text-sm font-bold text-bg-base shadow-glow transition disabled:opacity-50"
      >
        {busy ? 'Preparing...' : '📤 Share to WhatsApp, SMS, Instagram...'}
      </motion.button>

      {/* Secondary actions row */}
      <div className="flex gap-2 mb-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={busy}
          className="flex-1 rounded-2xl bg-white/5 py-3 text-center text-xs font-bold text-ink ring-1 ring-white/10 transition disabled:opacity-50"
        >
          💾 Save Image
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopyLink}
          className="flex-1 rounded-2xl bg-white/5 py-3 text-center text-xs font-bold text-ink ring-1 ring-white/10 transition"
        >
          🔗 Copy Link
        </motion.button>
      </div>

      <button
        onClick={onClose}
        className="w-full text-center text-[11px] font-bold text-ink-dim py-2"
      >
        Skip
      </button>
    </BottomSheet>
  );
}
