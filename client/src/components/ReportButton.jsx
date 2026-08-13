// Report button — flag inappropriate content for review.
// Shows on kid-created stories, community content, etc.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';

const API = import.meta.env.VITE_API_BASE_URL || '';

const REASONS = [
  { id: 'inappropriate', label: 'Inappropriate language', icon: '🚫' },
  { id: 'scary', label: 'Scary or harmful content', icon: '😨' },
  { id: 'bullying', label: 'Bullying or mean words', icon: '😢' },
  { id: 'personal-info', label: 'Shares personal information', icon: '🔒' },
  { id: 'spam', label: 'Spam or not a real story', icon: '🗑️' },
  { id: 'other', label: 'Other', icon: '❓' },
];

export default function ReportButton({ contentId, contentType = 'story', size = 'sm' }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/api/content-report`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contentId,
          contentType,
          reason: selectedReason,
          description: description.trim(),
          reportedBy: user?.uid || 'anonymous',
          reporterEmail: user?.email || '',
        }),
      });
      setSubmitted(true);
      setTimeout(() => { setOpen(false); setSubmitted(false); setSelectedReason(null); setDescription(''); }, 2000);
    } catch {}
    setSubmitting(false);
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`text-ink-dim transition active:scale-90 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}
        title="Report this content"
      >
        🚩
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-bg-elevated p-6 shadow-lift ring-1 ring-white/10"
            >
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-ink">Thank you</h3>
                  <p className="mt-1 text-sm text-ink-muted">We will review this content within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-ink text-center mb-1" style={{ fontFamily: 'Lora, serif' }}>
                    Report Content
                  </h3>
                  <p className="text-xs text-ink-muted text-center mb-4">Help us keep My Sleepy Tale safe for all children.</p>

                  <div className="space-y-2 mb-4">
                    {REASONS.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedReason(r.id)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                          selectedReason === r.id
                            ? 'bg-gold/20 ring-2 ring-gold/50 text-ink'
                            : 'bg-bg-base ring-1 ring-white/5 text-ink-muted'
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>

                  {selectedReason === 'other' && (
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Please describe the issue..."
                      rows={3}
                      className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 outline-none focus:ring-gold/50 mb-4 resize-none"
                    />
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedReason || submitting}
                    className="w-full rounded-xl bg-red-500/80 py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="mt-2 w-full text-center text-[11px] text-ink-dim py-2"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
