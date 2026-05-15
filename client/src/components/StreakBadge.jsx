// Streak badge — shows "🔥 7-day streak!" in the Home header.
// Tapping expands the weekly calendar.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStreak } from '../hooks/useStreak.js';
import StreakCalendar from './StreakCalendar.jsx';

export default function StreakBadge() {
  const { streak, weekHistory } = useStreak();
  const [expanded, setExpanded] = useState(false);

  if (streak === 0) return null;

  return (
    <div className="mb-4">
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileTap={{ scale: 0.97 }}
        className="mx-auto flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 ring-1 ring-gold/20 transition"
      >
        <span className="text-lg">🔥</span>
        <span className="text-xs font-bold text-gold">
          {streak}-day streak!
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-[10px] text-gold/60"
        >
          ▼
        </motion.span>
      </motion.button>

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
  );
}
