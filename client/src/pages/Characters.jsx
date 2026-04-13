import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { FAMILY_RELATIONS, RELATION_EMOJI, PET_TYPES, SKIN_TONES } from '../utils/constants.js';
import { createVoiceLink } from '../utils/voiceLink.js';
import { hasConfig } from '../lib/firebase.js';

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
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ name: '', relation: 'sibling', traits: '', emoji: '🧒', petType: 'dog', adventureName: '' });
  const [sendingLink, setSendingLink] = useState(null); // character id
  const [linkUrl, setLinkUrl] = useState(null);

  if (!profile) return null;
  const characters = profile.characters || [];

  const startNew = () => {
    setDraft({ name: '', relation: 'sibling', traits: '', emoji: RELATION_EMOJI.sibling, petType: 'dog', adventureName: '' });
    setEditing('new');
  };

  const startEdit = (c) => {
    setDraft({ petType: 'dog', adventureName: '', ...c });
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
        petType: draft.relation === 'pet' ? draft.petType : undefined,
        adventureName: draft.relation === 'self' ? draft.adventureName?.trim() : undefined,
      };
      next = [...characters, newChar];
    } else {
      next = characters.map((c) =>
        c.id === editing.id
          ? {
              ...c,
              name: draft.name.trim(),
              relation: draft.relation,
              emoji: draft.emoji,
              traits: draft.traits.trim(),
              petType: draft.relation === 'pet' ? draft.petType : c.petType,
              adventureName: draft.relation === 'self' ? draft.adventureName?.trim() : c.adventureName,
            }
          : c
      );
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
    <PageTransition className="relative flex h-full flex-col">
      <div className="page-scroll px-5 pt-10 pb-28 safe-top">
        <header className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
          >
            ← Back
          </button>
          <h1 className="display-title text-ink">
            Story <span className="text-gold">cast</span>
          </h1>
          <p className="mt-1 text-[12px] text-ink-muted">
            People, pets and imaginary friends for tonight's story.
          </p>
        </header>

        {/* Character list */}
        <div className="space-y-2">
          {characters.map((c) => {
            const isSelf = c.relation === 'self';
            const petInfo = c.petType ? PET_TYPES.find((p) => p.key === c.petType) : null;
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-xl">
                  {petInfo?.emoji || c.emoji || RELATION_EMOJI[c.relation] || '✨'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-ui text-sm font-bold text-ink">{c.name}</span>
                    {isSelf && (
                      <span className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">
                        Hero
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {ALL_RELATIONS.find((r) => r.key === c.relation)?.label || c.relation}
                    {petInfo && ` · ${petInfo.label}`}
                    {c.adventureName && ` · plays as "${c.adventureName}"`}
                    {c.traits && ` · ${c.traits}`}
                  </div>
                </div>
                <button
                  onClick={() => startEdit(c)}
                  className="shrink-0 rounded-full bg-bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold"
                >
                  Edit
                </button>
                {!isSelf && hasConfig && (
                  <button
                    onClick={async () => {
                      setSendingLink(c.id);
                      try {
                        const result = await createVoiceLink({
                          characterName: c.name,
                          relation: c.relation,
                          emoji: c.emoji,
                        });
                        setLinkUrl(result.url);
                        if (navigator.share) {
                          await navigator.share({
                            title: `Record your voice for Qissaa`,
                            text: `${c.name}, please record your voice for bedtime stories! Link expires in 5 minutes.`,
                            url: result.url,
                          });
                        } else {
                          await navigator.clipboard.writeText(result.url);
                          alert(`Link copied! Send it to ${c.name}. Expires in 5 minutes.`);
                        }
                      } catch {
                        // cancelled or failed
                      }
                      setSendingLink(null);
                    }}
                    disabled={sendingLink === c.id}
                    className="shrink-0 rounded-full bg-bg-card px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-gold disabled:opacity-50"
                  >
                    {sendingLink === c.id ? '…' : '🔗 Send link'}
                  </button>
                )}
                {!isSelf && (
                  <button
                    onClick={() => remove(c.id)}
                    className="shrink-0 text-[11px] text-ink-dim hover:text-negative"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <VersionFooter />
      </div>

      {/* Sticky bottom button — always accessible */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-bg-base/95 px-5 py-3 backdrop-blur-xl safe-bottom">
        <button onClick={startNew} className="btn-primary w-full py-4">
          + Add character
        </button>
      </div>

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
              className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-bg-elevated p-6 shadow-lift"
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

                {/* Adventure name — only for hero (self) */}
                {(editing !== 'new' && editing?.relation === 'self') && (
                  <div>
                    <label className="ui-label mb-1 block">Adventure name (optional)</label>
                    <input
                      type="text"
                      value={draft.adventureName || ''}
                      onChange={(e) => setDraft({ ...draft, adventureName: e.target.value })}
                      placeholder="e.g. Iron Man, Princess Luna, Super Arjun"
                      className="field"
                    />
                    <p className="mt-1 text-[10px] text-ink-dim">
                      Stories will use this name instead. Leave empty to use their real name.
                    </p>
                  </div>
                )}

                {/* Avatar skin tone — for hero */}
                {(editing !== 'new' && editing?.relation === 'self') && (
                  <div>
                    <label className="ui-label mb-1 block">Avatar</label>
                    <div className="flex gap-2">
                      {SKIN_TONES.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => setDraft({ ...draft, emoji: s.emoji })}
                          className={`grid h-10 w-10 place-items-center rounded-full text-2xl transition ${
                            draft.emoji === s.emoji
                              ? 'bg-gold/30 ring-2 ring-gold'
                              : 'bg-bg-surface ring-1 ring-white/10'
                          }`}
                        >
                          {s.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relationship — not for self */}
                {!(editing !== 'new' && editing?.relation === 'self') && (
                  <div>
                    <label className="ui-label mb-1 block">Relationship</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {ALL_RELATIONS.map((r) => (
                        <button
                          key={r.key}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              relation: r.key,
                              emoji: r.emoji || RELATION_EMOJI[r.key],
                            })
                          }
                          className={`flex flex-col items-center gap-0.5 rounded-xl p-2 transition ${
                            draft.relation === r.key
                              ? 'bg-gold text-bg-base'
                              : 'bg-bg-surface text-ink ring-1 ring-white/5'
                          }`}
                        >
                          <span className="text-lg">{r.emoji}</span>
                          <span className="text-[9px] font-bold leading-tight">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pet type selector */}
                {draft.relation === 'pet' && (
                  <div>
                    <label className="ui-label mb-1 block">What kind of pet?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PET_TYPES.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setDraft({ ...draft, petType: p.key, emoji: p.emoji })}
                          className={`flex flex-col items-center gap-1 rounded-xl p-2 transition ${
                            draft.petType === p.key
                              ? 'bg-gold text-bg-base shadow-glow'
                              : 'bg-bg-surface text-ink ring-1 ring-white/5'
                          }`}
                        >
                          <span className="text-2xl">{p.emoji}</span>
                          <span className="text-[10px] font-bold">{p.label}</span>
                          <span className={`text-[9px] italic ${draft.petType === p.key ? 'text-bg-base/70' : 'text-ink-dim'}`}>
                            "{p.sound}"
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="ui-label mb-1 block">Traits (optional)</label>
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
                  Save
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
    </PageTransition>
  );
}
