import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase.js';

const PLANS = [
  {
    key: 'free',
    label: 'Free',
    price: 'CA$0',
    features: ['3 stories / week', 'Up to 5 min', '1 child profile', '2 languages'],
    current: true,
  },
  {
    key: 'pro',
    label: 'Pro',
    price: 'CA$9.99/mo',
    features: ['Unlimited stories', 'Up to 30 min', '3 child profiles', 'All languages', 'Voice cloning', 'Festival packs'],
    highlight: true,
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    price: 'CA$24.99/mo',
    features: ['Everything in Pro', '10 child profiles', 'Unlimited voices', 'Offline download', 'Priority support'],
  },
];

export default function UpgradeModal({ open, onClose, reason }) {
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (tier) => {
    setLoading(tier);
    try {
      const user = auth?.currentUser;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          uid: user?.uid || '',
          email: user?.email || '',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not start checkout');
      }
    } catch (e) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

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
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-bg-elevated p-6 shadow-lift"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            <h2 className="display-title mb-1 text-gold">Unlock more bedtime magic</h2>
            <p className="mb-5 text-sm text-ink-muted">
              {reason || 'Upgrade to unlock longer stories, more voices, and all languages.'}
            </p>

            <div className="space-y-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`rounded-2xl p-4 ${
                    plan.highlight
                      ? 'bg-gold/10 ring-1 ring-gold'
                      : 'bg-bg-surface ring-1 ring-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-ui text-sm font-bold text-ink">{plan.label}</span>
                        {plan.highlight && (
                          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 font-display text-lg font-bold text-gold">{plan.price}</div>
                    </div>
                    {plan.current ? (
                      <span className="text-[10px] uppercase tracking-wider text-ink-dim">Current</span>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.key)}
                        disabled={loading === plan.key}
                        className="btn-primary disabled:opacity-60"
                      >
                        {loading === plan.key ? 'Loading…' : 'Choose'}
                      </button>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-ink-muted">
                        <span className="text-[10px] text-gold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
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
