// Star Counter — animated credit balance display for kids
import { motion } from 'framer-motion';

const LEVELS = [
  { min: 0, title: 'Little Storyteller', icon: '🌱', color: '#22c55e' },
  { min: 25, title: 'Story Star', icon: '⭐', color: '#f59e0b' },
  { min: 100, title: 'Story Hero', icon: '🦸', color: '#8b5cf6' },
  { min: 250, title: 'Story Master', icon: '🏆', color: '#f0a500' },
  { min: 500, title: 'Story Legend', icon: '👑', color: '#ef4444' },
];

function getLevelInfo(totalEarned) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalEarned >= LEVELS[i].min) return { ...LEVELS[i], nextMin: LEVELS[i + 1]?.min || null };
  }
  return { ...LEVELS[0], nextMin: LEVELS[1].min };
}

export default function StarCounter({ balance = 0, totalEarned = 0, streak = 0, compact = false }) {
  const level = getLevelInfo(totalEarned);
  const progress = level.nextMin ? (totalEarned - level.min) / (level.nextMin - level.min) : 1;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 ring-1 ring-gold/30">
        <span className="text-sm">{level.icon}</span>
        <span className="text-xs font-bold text-gold">{balance} ⭐</span>
        {streak > 1 && <span className="text-[9px] text-orange-400 font-bold">🔥{streak}</span>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.span
            key={balance}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            {level.icon}
          </motion.span>
          <div>
            <p className="text-xs font-bold" style={{ color: level.color }}>{level.title}</p>
            <p className="text-[10px] text-ink-dim">
              {level.nextMin ? `${level.nextMin - totalEarned} stars to next level` : 'Max level!'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.p
            key={balance}
            initial={{ scale: 1.3, color: '#f0a500' }}
            animate={{ scale: 1, color: '#c8c3ba' }}
            className="text-lg font-bold"
          >
            {balance} ⭐
          </motion.p>
          {streak > 1 && <p className="text-[10px] text-orange-400 font-bold">🔥 {streak} day streak</p>}
        </div>
      </div>

      {/* Progress bar to next level */}
      {level.nextMin && (
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress * 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: level.color }}
          />
        </div>
      )}
    </div>
  );
}
