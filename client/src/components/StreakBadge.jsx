// Streak badge — shows streak + badge count on Home. Tapping opens full badge wall.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { useStreak } from '../hooks/useStreak.js';
import { useBadges } from '../hooks/useBadges.js';
import StreakCalendar from './StreakCalendar.jsx';
import BadgeWall from './BadgeWall.jsx';

export default function StreakBadge() {
  const { streak, weekHistory } = useStreak();
  const { unlockedCount, totalBadges, newBadges, checkBadges } = useBadges();
  const [expanded, setExpanded] = useState(false);
  const [badgeWallOpen, setBadgeWallOpen] = useState(false);

  useEffect(() => { checkBadges(); }, [checkBadges]);

  if (streak === 0 && unlockedCount === 0) return null;

  return (
    <>
      <div className="mb-4">
        <div className="mx-auto flex items-center justify-center gap-2">
          {/* Streak pill */}
          {streak > 0 && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 ring-1 ring-gold/20 transition"
            >
              <span className="text-lg">🔥</span>
              <span className="text-xs font-bold text-gold">{streak}-day streak</span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                className="text-[10px] text-gold/60"
              >
                ▼
              </motion.span>
            </motion.button>
          )}

          {/* Badges pill */}
          <motion.button
            onClick={() => setBadgeWallOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-1.5 rounded-full bg-bg-surface px-3 py-2 ring-1 ring-white/10 transition"
          >
            <Award size={14} className="text-gold" />
            <span className="text-xs font-bold text-ink">{unlockedCount}</span>
            <span className="text-[10px] text-ink-dim">/ {totalBadges}</span>
            {newBadges.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-bg-base">
                  {newBadges.length}
                </span>
              </span>
            )}
          </motion.button>
        </div>

        {/* Week calendar (expanded) */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                <StreakCalendar weekHistory={weekHistory} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge Wall modal */}
      <AnimatePresence>
        {badgeWallOpen && <BadgeWall open={badgeWallOpen} onClose={() => setBadgeWallOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
