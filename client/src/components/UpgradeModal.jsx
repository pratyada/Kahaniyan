import { motion, AnimatePresence } from 'framer-motion';
import { TIERS } from '../utils/tierGate.js';

export default function UpgradeModal({ open, onClose, reason }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full rounded-t-3xl bg-bg-elevated p-6 shadow-lift"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            <h2 className="display-title mb-1 text-gold">Unlock more bedtime magic</h2>
            <p className="mb-5 text-sm text-ink-muted">
              {reason || 'You have reached a free tier limit.'}
            </p>

            <div className="space-y-3">
              {Object.entries(TIERS).map(([key, tier]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl bg-bg-surface p-4"
                >
                  <div>
                    <div className="font-ui text-sm font-bold text-ink">{tier.label}</div>
                    <div className="text-xs text-ink-muted">
                      {tier.storiesPerWeek === Infinity
                        ? 'Unlimited stories'
                        : `${tier.storiesPerWeek} stories / week`}{' '}
                      · up to {tier.maxDuration} min
                    </div>
                  </div>
                  {key === 'free' ? (
                    <span className="text-xs uppercase tracking-wider text-ink-dim">Current</span>
                  ) : (
                    <button className="btn-primary">Choose</button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="mt-5 w-full text-center text-sm text-ink-muted">
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
