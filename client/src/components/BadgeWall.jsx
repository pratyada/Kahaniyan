// Badge Wall — displays all badges grouped by category.
// Unlocked badges are colorful, locked ones are greyed out.
// Tapping a badge shows details. New badges pulse.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useBadges, BADGE_CATEGORIES } from '../hooks/useBadges.js';

export default function BadgeWall({ open, onClose }) {
  const { badges, unlockedCount, totalBadges, checkBadges, markSeen } = useBadges();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) checkBadges();
  }, [open, checkBadges]);

  if (!open) return null;

  const progress = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-bg-elevated p-5 pb-24 shadow-lift"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gold">Badges</h2>
            <p className="text-[11px] text-ink-muted">{unlockedCount} of {totalBadges} unlocked</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-bg-surface">
            <X size={16} className="text-ink-muted" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 rounded-full bg-bg-surface p-1 ring-1 ring-white/5">
          <div className="h-2 rounded-full bg-gold/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gold"
            />
          </div>
          <p className="mt-1 text-center text-[10px] font-bold text-gold">{progress}%</p>
        </div>

        {/* Badge categories */}
        {BADGE_CATEGORIES.map(cat => {
          const catBadges = badges.filter(b => b.category === cat.key);
          if (catBadges.length === 0) return null;
          const catUnlocked = catBadges.filter(b => b.unlocked).length;

          return (
            <div key={cat.key} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{cat.emoji}</span>
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">{cat.label}</h3>
                <span className="text-[10px] text-ink-dim">{catUnlocked}/{catBadges.length}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {catBadges.map(badge => (
                  <motion.button
                    key={badge.id}
                    onClick={() => {
                      setSelected(badge);
                      if (badge.unlocked && !badge.seen) markSeen(badge.id);
                    }}
                    whileTap={{ scale: 0.92 }}
                    className={`relative flex flex-col items-center gap-1 rounded-2xl p-3 transition ${
                      badge.unlocked
                        ? 'bg-gold/10 ring-1 ring-gold/20'
                        : 'bg-bg-surface/50 ring-1 ring-white/5 opacity-40'
                    }`}
                  >
                    {/* New badge pulse */}
                    {badge.unlocked && !badge.seen && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
                      </span>
                    )}

                    <span className={`text-2xl ${badge.unlocked ? '' : 'grayscale'}`}>
                      {badge.unlocked ? badge.emoji : <Lock size={20} className="text-ink-dim" />}
                    </span>
                    <span className={`text-[9px] font-bold text-center leading-tight ${
                      badge.unlocked ? 'text-ink' : 'text-ink-dim'
                    }`}>
                      {badge.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Badge detail popup */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/60"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="mx-8 w-full max-w-xs rounded-3xl bg-bg-elevated p-8 text-center shadow-lift ring-1 ring-white/10"
                onClick={e => e.stopPropagation()}
              >
                <span className={`text-6xl ${selected.unlocked ? '' : 'grayscale opacity-40'}`}>
                  {selected.emoji}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-gold">{selected.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{selected.desc}</p>

                {selected.unlocked ? (
                  <>
                    <div className="mt-3 rounded-xl bg-gold/10 px-4 py-2 ring-1 ring-gold/20">
                      <p className="text-[10px] font-bold text-gold">
                        Unlocked {new Date(selected.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selected.reward && (
                      <div className="mt-3 rounded-xl bg-green-900/20 px-4 py-3 ring-1 ring-green-500/20">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-lg">{selected.reward.icon}</span>
                          <p className="text-xs font-bold text-green-400">{selected.reward.label}</p>
                        </div>
                        <p className="text-[10px] text-green-400/70">{selected.reward.detail}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mt-3 rounded-xl bg-bg-surface px-4 py-2 ring-1 ring-white/5">
                      <p className="text-[10px] font-bold text-ink-dim">Keep going to unlock!</p>
                    </div>
                    {selected.reward && (
                      <div className="mt-2 rounded-xl bg-bg-surface/50 px-4 py-2 ring-1 ring-white/5 opacity-50">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm">{selected.reward.icon}</span>
                          <p className="text-[10px] text-ink-dim">Reward: {selected.reward.label}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setSelected(null)}
                  className="mt-4 text-sm text-ink-muted"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
