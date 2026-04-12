import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { LANGUAGES, COUNTRIES, RELIGIONS } from '../utils/constants.js';

export default function EditFamily() {
  const navigate = useNavigate();
  const { profile, save } = useFamilyProfile();
  const [draft, setDraft] = useState(profile || {});

  if (!profile) return null;

  const handleSave = () => {
    save({ ...draft, age: Number(draft.age) || profile.age });
    navigate('/settings');
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button
          onClick={() => navigate('/settings')}
          className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back
        </button>
        <p className="ui-label">Customization</p>
        <h1 className="display-title mt-1 text-ink">
          Edit <span className="text-gold">family</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Everything you set during onboarding — change anytime.
        </p>
      </header>

      <div className="space-y-5">
        <Field label="Child's name">
          <input
            type="text"
            value={draft.childName || ''}
            onChange={(e) => setDraft({ ...draft, childName: e.target.value })}
            className="field"
          />
        </Field>

        <Field label="Age">
          <input
            type="number"
            min="1"
            max="14"
            value={draft.age || ''}
            onChange={(e) => setDraft({ ...draft, age: e.target.value })}
            className="field"
          />
        </Field>

        <Field label="Country">
          <div className="grid grid-cols-2 gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setDraft({ ...draft, country: c.key })}
                className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                  draft.country === c.key
                    ? 'bg-gold text-bg-base shadow-glow'
                    : 'bg-bg-surface text-ink ring-1 ring-white/5'
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="text-sm font-bold">{c.label}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Belief — pick one or more">
          <p className="mb-2 text-[11px] text-ink-dim">
            Wisdom Stories will come from your selected traditions. Leave empty for stories from
            all traditions.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {RELIGIONS.filter((r) => r.key !== 'all').map((r) => {
              const selected = (draft.beliefs || []).includes(r.key);
              return (
                <button
                  key={r.key}
                  onClick={() => {
                    const cur = draft.beliefs || [];
                    const next = cur.includes(r.key)
                      ? cur.filter((x) => x !== r.key)
                      : [...cur, r.key];
                    setDraft({ ...draft, beliefs: next });
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                    selected
                      ? 'bg-gold text-bg-base shadow-glow'
                      : 'bg-bg-surface text-ink ring-1 ring-white/5'
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-sm font-bold">{r.label}</span>
                  {selected && <span className="ml-auto text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Language">
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => setDraft({ ...draft, language: l.key })}
                className={`rounded-2xl px-3 py-3 text-left transition ${
                  draft.language === l.key
                    ? 'bg-gold text-bg-base shadow-glow'
                    : 'bg-bg-surface text-ink ring-1 ring-white/5'
                }`}
              >
                <div className="font-display text-lg">{l.label}</div>
              </button>
            ))}
          </div>
        </Field>

        <p className="text-[11px] text-ink-muted">
          Tip: To add or remove people in stories, use the <strong className="text-ink">Story cast</strong> page.
        </p>

        <button onClick={handleSave} className="btn-primary w-full py-4">
          Save family
        </button>
      </div>

      <VersionFooter />
    </PageTransition>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="ui-label mb-2 block">{label}</label>
      {children}
    </div>
  );
}
