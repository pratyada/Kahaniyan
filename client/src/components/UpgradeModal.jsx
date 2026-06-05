import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase.js';

const PLANS = [
  {
    key: 'free',
    label: 'Free',
    price: 'CA$0',
    period: 'forever',
    features: [
      '150+ pre-recorded stories',
      'Text personalized with child name',
      '3 story generations / week',
      '1 child profile',
      'Up to 5 min stories',
    ],
    current: true,
  },
  {
    key: 'pro',
    label: 'Pro',
    price: 'CA$9',
    originalPrice: 'CA$29',
    period: '/month',
    discount: '69% off — Summer 2026',
    features: [
      'Everything in Free',
      'Audio personalized with child name (3/day)',
      'Unlimited story generation',
      'Up to 30 min stories',
      '3 child profiles',
      'Voice cloning',
      'Festival story packs',
      'Private series + contributors',
      '90-day story archive',
    ],
    highlight: true,
    color: 'gold',
  },
  {
    key: 'family',
    label: 'Family',
    price: 'CA$59',
    originalPrice: 'CA$199',
    period: '/month',
    discount: '70% off — Summer 2026',
    features: [
      'Everything in Pro',
      '50 personalized stories / day',
      '50 story generations / day',
      '10 child profiles',
      'Unlimited voice cloning',
      'Offline listening',
      'Priority AI narration',
      'Creator program access',
      'Unlimited story archive',
    ],
    color: 'purple',
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
              {reason || 'Upgrade for personalized audio, unlimited stories, and more.'}
            </p>

            <div className="space-y-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`rounded-2xl p-4 ${
                    plan.highlight
                      ? 'bg-gold/10 ring-2 ring-gold relative'
                      : plan.color === 'purple'
                      ? 'bg-purple-500/5 ring-1 ring-purple-500/20'
                      : 'bg-bg-surface ring-1 ring-white/5'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-gold px-3 py-0.5 text-[8px] font-bold uppercase tracking-wider text-bg-base">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-ui text-sm font-bold ${plan.color === 'purple' ? 'text-purple-400' : 'text-ink'}`}>
                        {plan.label}
                      </span>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className={`font-display text-xl font-bold ${plan.color === 'purple' ? 'text-purple-400' : 'text-gold'}`}>
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-xs text-ink-dim line-through">{plan.originalPrice}</span>
                        )}
                        <span className="text-[10px] text-ink-dim">{plan.period}</span>
                      </div>
                      {plan.discount && (
                        <p className="text-[9px] font-bold text-green-400 mt-0.5">{plan.discount}</p>
                      )}
                    </div>
                    {plan.current ? (
                      <span className="text-[10px] uppercase tracking-wider text-ink-dim">Current</span>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.key)}
                        disabled={loading === plan.key}
                        className={`rounded-full px-5 py-2 text-xs font-bold transition active:scale-95 disabled:opacity-60 ${
                          plan.highlight
                            ? 'bg-gold text-bg-base shadow-glow'
                            : plan.color === 'purple'
                            ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30'
                            : 'bg-white/10 text-ink'
                        }`}
                      >
                        {loading === plan.key ? 'Loading...' : 'Choose'}
                      </button>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-muted">
                        <span className={`text-[10px] mt-0.5 ${plan.color === 'purple' ? 'text-purple-400' : 'text-gold'}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-[9px] text-ink-dim">Cancel anytime. Summer pricing through September 2026.</p>

            <button onClick={onClose} className="mt-4 w-full text-center text-sm text-ink-muted">
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
