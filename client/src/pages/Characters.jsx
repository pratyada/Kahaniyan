import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { FAMILY_RELATIONS, RELATION_EMOJI } from '../utils/constants.js';

const EXTRA_RELATIONS = [
  { key: 'pet', label: 'Pet', emoji: '🐶' },
  { key: 'imaginary', label: 'Imaginary friend', emoji: '🦄' },
  { key: 'friend', label: 'Friend', emoji: '🧒' },
  { key: 'other', label: 'Other', emoji: '✨' },
];
const ALL_RELATIONS = [...FAMILY_RELATIONS, ...EXTRA_RELATIONS];

export default function Characters() {
  const navigate = useNavigate();
  const { profile, update } = useFamilyProfile();
  const [editing, setEditing] = useState(null); // null | 'new' | character object
  const [draft, setDraft] = useState({ name: '', relation: 'sibling', traits: '', emoji: '🧒' });

  if (!profile) return null;
  const characters = profile.characters || [];

  const startNew = () => {
    setDraft({ name: '', relation: 'sibling', traits: '', emoji: RELATION_EMOJI.sibling });
    setEditing('new');
  };

  const startEdit = (c) => {
    setDraft({ ...c });
    setEditing(c);
  };

  const save = () => {
    if (!draft.name.trim()) return;
    let next;
    if (editing === 'new') {
      const newChar = {
        id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: draft.name.trim(),
        relation: draft.relation,
        emoji: draft.emoji || RELATION_EMOJI[draft.relation] || '✨',
        traits: draft.traits.trim(),
      };
      next = [...characters, newChar];
    } else {
      next = characters.map((c) => (c.id === editing.id ? { ...c, ...draft, name: draft.name.trim() } : c));
    }
    update({ characters: next });
    setEditing(null);
  };

  const remove = (id) => {
    if (id === 'char_self') return;
    if (!confirm('Remove this character?')) return;
    update({ characters: characters.filter((c) => c.id !== id) });
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
          Story <span className="text-gold">cast</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Add the people, pets, and imaginary friends who can appear in your child's stories.
        </p>
      </header>

      {/* Character list */}
      <div className="space-y-3">
        {characters.map((c) => {
          const isSelf = c.relation === 'self';
          return (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-2xl bg-bg-surface p-3 shadow-card ring-1 ring-white/5"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-2xl">
                {c.emoji || RELATION_EMOJI[c.relation] || '✨'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-ui text-sm font-bold text-ink">
                  {c.name}
                  {isSelf && (
                    <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                      Hero
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-muted">
                  {ALL_RELATIONS.find((r) => r.key === c.relation)?.label || c.relation}
                  {c.traits && ` · ${c.traits}`}
                </div>
              </div>
              {!isSelf && (
                <>
                  <button
                    onClick={() => startEdit(c)}
                    className="text-[11px] font-bold uppercase tracking-wider text-gold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="text-[11px] text-ink-dim hover:text-negative"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={startNew} className="btn-primary mt-6 w-full py-4">
        + Add a new character
      </button>

      {/* Edit/new sheet */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
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
              <h2 className="display-title mb-4 text-gold">
                {editing === 'new' ? 'New character' : `Edit ${editing.name}`}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="ui-label mb-1 block">Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="e.g. Priya, Bruno, Captain Cosmo"
                    className="field"
                  />
                </div>

                <div>
                  <label className="ui-label mb-1 block">Relationship</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_RELATIONS.map((r) => (
                      <button
                        key={r.key}
                        onClick={() =>
                          setDraft({ ...draft, relation: r.key, emoji: r.emoji || RELATION_EMOJI[r.key] })
                        }
                        className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition ${
                          draft.relation === r.key
                            ? 'bg-gold text-bg-base'
                            : 'bg-bg-surface text-ink ring-1 ring-white/5'
                        }`}
                      >
                        <span className="text-xl">{r.emoji}</span>
                        <span className="text-[10px] font-bold">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="ui-label mb-1 block">A few traits (optional)</label>
                  <input
                    type="text"
                    value={draft.traits}
                    onChange={(e) => setDraft({ ...draft, traits: e.target.value })}
                    placeholder="e.g. loves cricket, always tells jokes"
                    className="field"
                  />
                </div>

                <button
                  onClick={save}
                  disabled={!draft.name.trim()}
                  className="btn-primary w-full py-4 disabled:opacity-40"
                >
                  Save character
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="w-full text-center text-xs text-ink-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VersionFooter />
    </PageTransition>
  );
}
