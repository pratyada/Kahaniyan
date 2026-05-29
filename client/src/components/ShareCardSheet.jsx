// Share card sheet — share/save/copy story card.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './BottomSheet.jsx';
import { shareStoryCard, saveCardImage, getStoryShareUrl } from '../utils/cardExport.js';
import { extractMoral } from '../utils/moralExtractor.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { trackStoryCardShared } from '../utils/analytics.js';
import { getStoryArt } from '../utils/storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';
import { useWisdomData } from '../hooks/useWisdomData.js';

export default function ShareCardSheet({ open, onClose, story }) {
  const { profile } = useFamilyProfile();
  const { wisdomImageUrls } = useWisdomData();
  const [busy, setBusy] = useState(null); // 'share' | 'save' | 'copy' | null
  const [toast, setToast] = useState(null);
  const { moral } = extractMoral(story);

  const lessonKey = story?.id?.startsWith('lesson_') ? story.id.slice(7) : story?.id || '';
  const art = getStoryArt(lessonKey);
  const tradition = TRADITIONS.find((t) => t.key === story?.tradition);
  const colors = (art.gradient.match(/#[a-fA-F0-9]{6}/g) || ['#1a1a2e', '#0a0a0f']);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleShare = async () => {
    setBusy('share');
    try {
      const result = await shareStoryCard(story, profile?.childName, profile, moral);
      if (result === 'shared') {
        trackStoryCardShared(story?.id);
        showToast('Shared!');
        setTimeout(onClose, 600);
      } else if (result === 'copied') {
        trackStoryCardShared(story?.id);
        showToast('Link & text copied! Paste in any chat.');
      } else if (result === 'failed') {
        showToast('Try Copy Link below');
      }
    } catch {
      showToast('Try Copy Link below');
    }
    setBusy(null);
  };

  const handleSave = async () => {
    setBusy('save');
    try {
      const saved = await saveCardImage(story, moral, profile?.childName);
      if (saved) {
        trackStoryCardShared(story?.id);
        showToast('Saved!');
      }
    } catch {
      showToast('Could not save');
    }
    setBusy(null);
  };

  const handleCopyLink = async () => {
    setBusy('copy');
    try {
      const url = await getStoryShareUrl(story, profile);
      await navigator.clipboard.writeText(url);
      showToast('Link copied!');
      trackStoryCardShared(story?.id);
    } catch {
      showToast('Could not copy');
    }
    setBusy(null);
  };

  // Short moral for preview
  const shortMoral = moral ? moral.split(/[.!?]+/).filter(Boolean).slice(0, 1).join('. ').trim() + '.' : '';

  return (
    <BottomSheet open={open} onClose={onClose}>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-3 rounded-full bg-gold px-4 py-2 text-center text-xs font-bold text-bg-base">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card preview with story image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto mb-5 overflow-hidden rounded-2xl shadow-lift"
        style={{
          width: '100%', maxWidth: 320, aspectRatio: '9/10',
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
          position: 'relative',
        }}
      >
        {/* Story image — check coverImage first, then wisdomImageUrls, then art image */}
        {(() => {
          const imgId = story?.id?.startsWith('lesson_') ? story.id.slice(7) : story?.id;
          const imgUrl = story?.coverImage || wisdomImageUrls?.[imgId] || wisdomImageUrls?.[story?.id] || art?.image;
          return imgUrl ? (
            <img src={imgUrl} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : null;
        })()}
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,10,15,0.85) 60%, rgba(10,10,15,0.98) 100%)',
        }} />

        {/* Play icon */}
        <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full"
          style={{ background: 'rgba(240,165,0,0.15)', border: '2px solid rgba(240,165,0,0.4)' }}>
          <div style={{ width: 0, height: 0, borderLeft: '14px solid rgba(240,165,0,0.8)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', marginLeft: 3 }} />
        </div>

        {/* Tradition badge */}
        {tradition && (
          <div className="absolute top-3 left-3 rounded-full px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <span className="text-[10px] font-bold text-white/90">{tradition.icon} {tradition.label}</span>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-bold text-white leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            {story?.title}
          </h3>
          {shortMoral && (
            <p className="text-[10px] text-white/60 leading-relaxed line-clamp-2 mb-2 italic">
              "{shortMoral}"
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-gold">
              {profile?.childName ? `${profile.childName}'s story` : 'A bedtime story'}
            </span>
            <span className="text-[9px] text-white/40">🌙 My Sleepy Tale</span>
          </div>
        </div>
      </motion.div>

      {/* Motivating header */}
      <p className="mb-1 text-center text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
        Share tonight's story
      </p>
      <p className="mb-4 text-center text-[11px] text-ink-muted">
        Inspire another family's bedtime routine
      </p>

      {/* Share button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        disabled={!!busy}
        className="mb-2 w-full rounded-2xl bg-gold py-4 text-center text-sm font-bold text-bg-base shadow-glow transition disabled:opacity-50"
      >
        {busy === 'share' ? 'Opening share...' : 'Share with friends & family'}
      </motion.button>

      {/* Secondary row */}
      <div className="flex gap-2 mb-2">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={!!busy}
          className="flex-1 rounded-xl bg-white/5 py-3 text-center text-[11px] font-bold text-ink-muted ring-1 ring-white/10 transition disabled:opacity-50">
          {busy === 'save' ? 'Saving...' : 'Save Image'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopyLink} disabled={!!busy}
          className="flex-1 rounded-xl bg-white/5 py-3 text-center text-[11px] font-bold text-ink-muted ring-1 ring-white/10 transition disabled:opacity-50">
          {busy === 'copy' ? 'Copying...' : 'Copy Link'}
        </motion.button>
      </div>

      <button onClick={onClose} className="w-full py-2 text-center text-[11px] text-ink-dim">
        Maybe later
      </button>
    </BottomSheet>
  );
}
