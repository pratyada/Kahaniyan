// Badge unlock celebration — slides up from bottom when a new badge is earned.
// Shows badge emoji, title, and desc. Auto-dismisses after 4s or tap.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadges } from '../hooks/useBadges.js';

export default function BadgeUnlockToast() {
  const { checkBadges, markSeen } = useBadges();
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    const newOnes = checkBadges();
    if (newOnes.length > 0) {
      setBadge(newOnes[0]); // show first new badge
    }
  }, [checkBadges]);

  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(() => {
      markSeen(badge.id);
      setBadge(null);
    }, 4500);
    return () => clearTimeout(t);
  }, [badge, markSeen]);

  const dismiss = () => {
    if (badge) markSeen(badge.id);
    setBadge(null);
  };

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={dismiss}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-bg-elevated p-4 shadow-lift ring-1 ring-gold/20">
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 8, delay: 0.2 }}
              className="text-4xl"
            >
              {badge.emoji}
            </motion.span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gold font-bold">Badge Unlocked!</p>
              <p className="text-sm font-bold text-ink">{badge.title}</p>
              <p className="text-[11px] text-ink-muted">{badge.desc}</p>
            </div>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
