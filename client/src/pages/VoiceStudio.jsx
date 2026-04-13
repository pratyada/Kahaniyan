import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyVoices } from '../hooks/useFamilyVoices.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder.js';
import { VOICE_TRAINING_PARAGRAPH, FAMILY_RELATIONS, RELATION_EMOJI } from '../utils/constants.js';
import { createVoiceLink } from '../utils/voiceLink.js';
import { hasConfig } from '../lib/firebase.js';

export default function VoiceStudio() {
  const navigate = useNavigate();
  const { voices, ready, addVoice, removeVoice } = useFamilyVoices();
  const { profile } = useFamilyProfile();
  const recorder = useVoiceRecorder();
  const [step, setStep] = useState('pick'); // pick | record | done
  const [selectedChar, setSelectedChar] = useState(null);
  const [sendingLink, setSendingLink] = useState(null);
  const previewAudioRef = useRef(null);

  const characters = (profile?.characters || []).filter((c) => c.relation !== 'self');
  const allRelations = [...FAMILY_RELATIONS, { key: 'pet', label: 'Pet', emoji: '🐶' }, { key: 'imaginary', label: 'Imaginary', emoji: '🦄' }, { key: 'friend', label: 'Friend', emoji: '🧒' }];

  // Check if a character already has a voice recorded
  const hasVoice = (charName) => voices.some((v) => v.name === charName);

  const startRecordFor = (char) => {
    setSelectedChar(char);
    recorder.reset();
    setStep('record');
  };

  const handleSave = async () => {
    if (!recorder.lastBlob || !selectedChar) return;
    await addVoice({
      name: selectedChar.name,
      relation: selectedChar.relation,
      blob: recorder.lastBlob,
      durationSeconds: recorder.lastDuration,
    });
    recorder.reset();
    setStep('done');
    setTimeout(() => setStep('pick'), 2000);
  };

  const handleSendLink = async (char) => {
    if (!hasConfig) return;
    setSendingLink(char.id);
    try {
      const result = await createVoiceLink({
        characterName: char.name,
        relation: char.relation,
        emoji: char.emoji,
      });
      if (navigator.share) {
        await navigator.share({
          title: 'Record your voice for Qissaa',
          text: `${char.name}, please record your voice for bedtime stories! Link expires in 5 minutes.`,
          url: result.url,
        });
      } else {
        await navigator.clipboard.writeText(result.url);
        alert(`Link copied! Send to ${char.name}. Expires in 5 min.`);
      }
    } catch {
      // cancelled
    }
    setSendingLink(null);
  };

  const playPreview = (blob) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      URL.revokeObjectURL(previewAudioRef.current.src);
    }
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
    previewAudioRef.current = audio;
  };

  const onTouchStart = (e) => { e.preventDefault(); recorder.start(); };
  const onTouchEnd = (e) => { e.preventDefault(); recorder.stop(); };

  return (
    <PageTransition className="relative flex h-full flex-col">
      <div className="page-scroll px-5 pt-10 pb-6 safe-top">
        <header className="mb-6">
          <button
            onClick={() => (step === 'pick' ? navigate('/settings') : setStep('pick'))}
            className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
          >
            ← Back
          </button>
          <h1 className="display-title text-ink">
            Family <span className="text-gold">voices</span>
          </h1>
          <p className="mt-1 text-[12px] text-ink-muted">
            {step === 'pick'
              ? 'Whose voice do you want to save? Record here or send them a link.'
              : step === 'record'
              ? `Recording voice for ${selectedChar?.name}`
              : 'Voice saved!'}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {/* ─── PICK: who to record ─── */}
          {step === 'pick' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Cast members — record or send link */}
              {characters.length > 0 && (
                <section className="mb-6">
                  <h2 className="ui-label mb-3">From your story cast</h2>
                  <div className="space-y-2">
                    {characters.map((c) => {
                      const rel = allRelations.find((r) => r.key === c.relation);
                      const recorded = hasVoice(c.name);
                      return (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5"
                        >
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-xl">
                            {c.emoji || RELATION_EMOJI[c.relation] || '✨'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-ui text-sm font-bold text-ink">{c.name}</span>
                              {recorded && (
                                <span className="shrink-0 rounded-full bg-green-900/30 px-2 py-0.5 text-[8px] font-bold uppercase text-green-400">
                                  Recorded
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-ink-muted">
                              {rel?.label || c.relation}
                              {c.traits && ` · ${c.traits}`}
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <button
                              onClick={() => startRecordFor(c)}
                              className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold text-bg-base"
                            >
                              🎤 Record
                            </button>
                            {hasConfig && (
                              <button
                                onClick={() => handleSendLink(c)}
                                disabled={sendingLink === c.id}
                                className="rounded-full bg-bg-card px-3 py-1.5 text-[10px] font-bold text-gold ring-1 ring-gold/30 disabled:opacity-50"
                              >
                                {sendingLink === c.id ? '…' : '🔗 Send link'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {characters.length === 0 && (
                <div className="card-elevated mb-6 text-center">
                  <div className="mb-2 text-3xl">👥</div>
                  <p className="text-sm font-bold text-ink">No cast members yet</p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Add family members in Story Cast first, then come back to record their voices.
                  </p>
                  <button onClick={() => navigate('/characters')} className="btn-primary mt-4">
                    Go to Story Cast
                  </button>
                </div>
              )}

              {/* Already recorded voices */}
              {voices.length > 0 && (
                <section className="mb-6">
                  <h2 className="ui-label mb-3">Saved voices ({voices.length})</h2>
                  <div className="space-y-2">
                    {voices.map((v) => {
                      const rel = allRelations.find((r) => r.key === v.relation);
                      return (
                        <div
                          key={v.id}
                          className="flex items-center gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5"
                        >
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-900/30 text-xl">
                            {rel?.emoji || RELATION_EMOJI[v.relation] || '🎤'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-ui text-sm font-bold text-ink">{v.name}</div>
                            <div className="text-[11px] text-ink-muted">
                              {rel?.label || v.relation} · {Math.round(v.durationSeconds)}s
                            </div>
                          </div>
                          <button
                            onClick={() => playPreview(v.blob)}
                            className="grid h-9 w-9 place-items-center rounded-full bg-bg-card text-gold"
                          >
                            ▶
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete ${v.name}'s voice?`)) removeVoice(v.id); }}
                            className="text-[11px] text-ink-dim hover:text-negative"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <p className="text-center text-[10px] text-ink-dim">
                Voices stay on this device. "Send link" lets someone else record remotely (link expires in 5 min).
              </p>
            </motion.div>
          )}

          {/* ─── RECORD ─── */}
          {step === 'record' && selectedChar && (
            <motion.div
              key="record"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-bg-elevated p-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-2xl">
                  {selectedChar.emoji || '🎤'}
                </div>
                <div>
                  <div className="font-ui text-lg font-bold text-ink">{selectedChar.name}</div>
                  <div className="text-xs text-ink-muted">
                    {allRelations.find((r) => r.key === selectedChar.relation)?.label || selectedChar.relation}
                  </div>
                </div>
              </div>

              {!recorder.supported && (
                <div className="card-elevated mb-4 text-center text-warning">
                  Your browser does not support microphone recording.
                </div>
              )}

              <div className="card-elevated mb-6">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                  Read this paragraph aloud as {selectedChar.name}
                </div>
                <p className="font-story text-[15px] leading-relaxed text-ink">
                  {VOICE_TRAINING_PARAGRAPH}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-wider text-ink-dim">
                  ~30–45 seconds · speak naturally
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onMouseDown={() => recorder.start()}
                  onMouseUp={() => recorder.stop()}
                  onMouseLeave={recorder.recording ? () => recorder.stop() : undefined}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  disabled={!recorder.supported}
                  className={`relative grid h-32 w-32 place-items-center rounded-full transition disabled:opacity-40 ${
                    recorder.recording
                      ? 'scale-110 bg-negative shadow-[0_0_60px_rgba(243,114,127,0.6)]'
                      : 'bg-gold shadow-glow active:scale-95'
                  }`}
                >
                  {recorder.recording ? (
                    <span className="text-lg font-bold uppercase tracking-wider text-white">Release</span>
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-bg-base">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Hold to record</span>
                    </span>
                  )}
                </button>

                <div className="text-2xl font-bold text-gold tabular-nums">
                  {recorder.elapsed.toFixed(1)}s
                </div>

                {recorder.error && (
                  <p className="text-center text-xs text-negative">{recorder.error}</p>
                )}

                {recorder.lastBlob && !recorder.recording && (
                  <div className="mt-4 w-full space-y-3">
                    <button onClick={() => playPreview(recorder.lastBlob)} className="btn-secondary w-full">
                      ▶ Listen back ({recorder.lastDuration.toFixed(1)}s)
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => recorder.reset()} className="btn-outline">Try again</button>
                      <button onClick={handleSave} className="btn-primary">Save voice</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── DONE ─── */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div className="mb-4 text-5xl">✅</div>
              <h2 className="font-display text-xl font-bold text-gold">
                {selectedChar?.name}'s voice saved!
              </h2>
              <p className="mt-2 text-sm text-ink-muted">Returning to voice list…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VersionFooter />
    </PageTransition>
  );
}
