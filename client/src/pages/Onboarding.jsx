import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { LANGUAGES, COUNTRIES, RELIGIONS } from '../utils/constants.js';

const STEPS = [
  { key: 'childName', title: "What's your child's name?", placeholder: 'e.g. Arjun', type: 'text' },
  { key: 'age', title: 'How old are they?', placeholder: '6', type: 'number' },
  { key: 'country', title: 'Where do you live?', type: 'country' },
  { key: 'beliefs', title: 'Your family belief?', subtitle: 'Pick one or more. Wisdom stories will come from these traditions. You can change this later.', type: 'beliefs', optional: true },
  { key: 'sibling', title: 'A brother or sister?', placeholder: 'optional — e.g. Priya', type: 'text', optional: true },
  { key: 'grandfather', title: 'A grandfather they love?', placeholder: 'optional — e.g. Dada ji', type: 'text', optional: true },
  { key: 'grandmother', title: 'A grandmother they love?', placeholder: 'optional — e.g. Nani ma', type: 'text', optional: true },
  { key: 'pet', title: 'A pet at home?', placeholder: 'optional — e.g. Bruno', type: 'text', optional: true },
  { key: 'language', title: 'Which language tonight?', type: 'language' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    language: 'English',
    country: 'IN',
    beliefs: [],
    openToAllCultures: true,
  });
  const navigate = useNavigate();
  const { save } = useFamilyProfile();

  const current = STEPS[step];
  const value = draft[current.key] ?? '';

  const next = () => {
    if (step === STEPS.length - 1) {
      save({ ...draft, age: Number(draft.age) || 6, tier: 'free', createdAt: Date.now() });
      navigate('/');
    } else {
      setStep((s) => s + 1);
    }
  };

  const canAdvance = current.optional || (typeof value === 'string' ? value.trim().length > 0 : !!value);

  return (
    <div className="phone-shell">
      <div className="aurora" />
      <div className="starfield opacity-30" />

      <div className="relative z-10 flex h-full flex-col px-6 pt-12 pb-8 safe-top">
        {/* Brand */}
        <div className="mb-2 flex items-center gap-2 text-gold">
          <span className="text-2xl">🌙</span>
          <span className="font-display text-xl font-bold tracking-tight">Dreemo</span>
        </div>
        <p className="mb-10 text-xs uppercase tracking-[0.18em] text-ink-muted">
          Step {step + 1} of {STEPS.length}
        </p>

        {/* Progress dots */}
        <div className="mb-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? 'bg-gold' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            <h1 className="display-title mb-2 text-ink">{current.title}</h1>
            {current.subtitle && (
              <p className="mb-6 text-sm text-ink-muted">{current.subtitle}</p>
            )}
            {!current.subtitle && <div className="mb-6" />}

            {current.type === 'language' ? (
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setDraft((d) => ({ ...d, language: l.key }))}
                    className={`rounded-2xl px-4 py-5 text-left transition ${
                      draft.language === l.key
                        ? 'bg-gold text-bg-base shadow-glow'
                        : 'bg-bg-surface text-ink ring-1 ring-white/5'
                    }`}
                  >
                    <div className="font-display text-2xl">{l.label}</div>
                    <div
                      className={`text-xs ${
                        draft.language === l.key ? 'text-bg-base/70' : 'text-ink-muted'
                      }`}
                    >
                      {l.key}
                    </div>
                  </button>
                ))}
              </div>
            ) : current.type === 'country' ? (
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setDraft((d) => ({ ...d, country: c.key }))}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                      draft.country === c.key
                        ? 'bg-gold text-bg-base shadow-glow'
                        : 'bg-bg-surface text-ink ring-1 ring-white/5'
                    }`}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <span className="font-ui text-sm font-bold">{c.label}</span>
                  </button>
                ))}
              </div>
            ) : current.type === 'beliefs' ? (
              <div>
                <p className="mb-2 text-[11px] text-ink-dim">
                  Tap to select multiple. Leave empty for stories from all traditions.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {RELIGIONS.filter((r) => r.key !== 'all').map((r) => {
                    const selected = (draft.beliefs || []).includes(r.key);
                    return (
                      <button
                        key={r.key}
                        onClick={() =>
                          setDraft((d) => {
                            const cur = d.beliefs || [];
                            const next = cur.includes(r.key)
                              ? cur.filter((x) => x !== r.key)
                              : [...cur, r.key];
                            return { ...d, beliefs: next };
                          })
                        }
                        className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                          selected
                            ? 'bg-gold text-bg-base shadow-glow'
                            : 'bg-bg-surface text-ink ring-1 ring-white/5'
                        }`}
                      >
                        <span className="text-xl">{r.icon}</span>
                        <span className="font-ui text-sm font-bold">{r.label}</span>
                        {selected && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <input
                autoFocus
                type={current.type}
                placeholder={current.placeholder}
                value={value}
                onChange={(e) => setDraft((d) => ({ ...d, [current.key]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && canAdvance && next()}
                className="field text-lg"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="btn-secondary">
              ← Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canAdvance}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {step === STEPS.length - 1 ? 'Begin →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
