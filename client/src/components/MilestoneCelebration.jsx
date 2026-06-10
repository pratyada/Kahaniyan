// Full-screen milestone celebration overlay — shown at 3, 7, 14, 30 day streaks.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStreak } from '../hooks/useStreak.js';
import { trackStreakDay } from '../utils/analytics.js';

const MESSAGES = {
  3: { emoji: '🌱', title: 'Great start!', sub: '3 nights of stories' },
  7: { emoji: '🌟', title: 'A whole week!', sub: '7 nights of learning' },
  14: { emoji: '🏆', title: 'Story champion!', sub: '14 nights and counting' },
  30: { emoji: '👑', title: 'Legendary listener!', sub: '30 nights of wisdom' },
  60: { emoji: '🔥', title: 'Unstoppable!', sub: '60 nights of growth' },
  100: { emoji: '💎', title: 'Diamond streak!', sub: '100 nights of stories' },
};

export default function MilestoneCelebration() {
  const { checkMilestone, dismissMilestone } = useStreak();
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    const m = checkMilestone();
    if (m) {
      setMilestone(m);
      trackStreakDay(m);
    }
  }, [checkMilestone]);

  const dismiss = () => {
    if (milestone) dismissMilestone(milestone);
    setMilestone(null);
  };

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!milestone) return;
    const t = setTimeout(dismiss, 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestone]);

  const msg = MESSAGES[milestone] || MESSAGES[7];

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="flex flex-col items-center text-center px-8"
          >
            <span className="text-7xl mb-4">{msg.emoji}</span>
            <h2 className="text-2xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>
              {msg.title}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{msg.sub}</p>
            <div className="mt-4 h-1 w-20 rounded-full bg-gold/30 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="h-full bg-gold"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
