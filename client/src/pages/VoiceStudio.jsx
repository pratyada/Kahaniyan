import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyVoices } from '../hooks/useFamilyVoices.jsx';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder.js';
import { VOICE_TRAINING_PARAGRAPH, FAMILY_RELATIONS } from '../utils/constants.js';

const STEPS = ['list', 'record', 'label'];

export default function VoiceStudio() {
  const navigate = useNavigate();
  const { voices, ready, addVoice, removeVoice } = useFamilyVoices();
  const recorder = useVoiceRecorder();
  const [step, setStep] = useState('list');
  const [draft, setDraft] = useState({ name: '', relation: 'mummy' });
  const previewAudioRef = useRef(null);

  const goToRecord = () => {
    recorder.reset();
    setDraft({ name: '', relation: 'mummy' });
    setStep('record');
  };

  const onMouseDown = () => recorder.start();
  const onMouseUp = () => recorder.stop();
  // Touch handlers
  const onTouchStart = (e) => {
    e.preventDefault();
    recorder.start();
  };
  const onTouchEnd = (e) => {
    e.preventDefault();
    recorder.stop();
  };

  const handleSave = async () => {
    if (!recorder.lastBlob || !draft.name.trim()) return;
    await addVoice({
      name: draft.name.trim(),
      relation: draft.relation,
      blob: recorder.lastBlob,
      durationSeconds: recorder.lastDuration,
    });
    recorder.reset();
    setStep('list');
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

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* ─── Step Header ─── */}
      <header className="mb-6">
        <button
          onClick={() => (step === 'list' ? navigate('/settings') : setStep('list'))}
          className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back
        </button>
        <p className="ui-label">Voice Studio</p>
        {step === 'list' && (
          <h1 className="display-title mt-1 text-ink">
            Family <span className="text-gold">voices</span>
          </h1>
        )}
        {step === 'record' && (
          <h1 className="display-title mt-1 text-ink">
            Step 1 · <span className="text-gold">Record</span>
          </h1>
        )}
        {step === 'label' && (
          <h1 className="display-title mt-1 text-ink">
            Step 2 · <span className="text-gold">Label</span>
          </h1>
        )}
        <p className="mt-2 text-sm text-ink-muted">
          {step === 'list' && `${voices.length} ${voices.length === 1 ? 'voice' : 'voices'} saved on this device.`}
          {step === 'record' && 'Hold the gold button and read the paragraph below in your natural voice.'}
          {step === 'label' && 'Tell us who this voice belongs to.'}
        </p>
      </header>

      <AnimatePresence mode="wait">
        {/* ───────────────────────────────────────── LIST ───────────────────────────────────────── */}
        {step === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {ready && voices.length === 0 ? (
              <div className="card-elevated text-center">
                <div className="mb-3 text-5xl">🎙️</div>
                <p className="font-display text-xl font-bold text-ink">No voices yet</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Record a parent, grandparent, sibling — anyone whose voice your child loves.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {voices.map((v) => {
                  const relation = FAMILY_RELATIONS.find((r) => r.key === v.relation);
                  return (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 rounded-2xl bg-bg-surface p-3 shadow-card ring-1 ring-white/5"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-2xl">
                        {relation?.emoji || '🎤'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-ui text-sm font-bold text-ink">{v.name}</div>
                        <div className="text-[11px] text-ink-muted">
                          {relation?.label || 'Voice'} · {Math.round(v.durationSeconds)}s
                        </div>
                      </div>
                      <button
                        onClick={() => playPreview(v.blob)}
                        className="grid h-10 w-10 place-items-center rounded-full bg-bg-card text-gold hover:bg-gold hover:text-bg-base"
                        aria-label={`Play ${v.name}`}
                      >
                        ▶
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete voice "${v.name}"?`)) removeVoice(v.id);
                        }}
                        className="text-[11px] text-ink-dim hover:text-negative"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={goToRecord} className="btn-primary mt-6 w-full py-4">
              + Add a new voice
            </button>

            <p className="mt-3 text-center text-[11px] text-ink-dim">
              Voices stay on this device. Nothing is uploaded.
            </p>
          </motion.div>
        )}

        {/* ───────────────────────────────────────── RECORD ───────────────────────────────────────── */}
        {step === 'record' && (
          <motion.div
            key="record"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {!recorder.supported && (
              <div className="card-elevated mb-4 text-center text-warning">
                Your browser does not support microphone recording.
              </div>
            )}

            {/* Training paragraph */}
            <div className="card-elevated mb-6">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                Read this paragraph aloud
              </div>
              <p className="font-story text-[15px] leading-relaxed text-ink">
                {VOICE_TRAINING_PARAGRAPH}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-wider text-ink-dim">
                ~30–45 seconds · cover all emotions naturally
              </p>
            </div>

            {/* HOLD button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={recorder.recording ? onMouseUp : undefined}
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
                  <span className="text-lg font-bold uppercase tracking-wider text-white">
                    Release
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-1 text-bg-base">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Hold to record
                    </span>
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
                  <button
                    onClick={() => playPreview(recorder.lastBlob)}
                    className="btn-secondary w-full"
                  >
                    ▶ Listen back ({recorder.lastDuration.toFixed(1)}s)
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => recorder.reset()} className="btn-outline">
                      Try again
                    </button>
                    <button onClick={() => setStep('label')} className="btn-primary">
                      Looks good →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ───────────────────────────────────────── LABEL ───────────────────────────────────────── */}
        {step === 'label' && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <div>
              <label className="ui-label mb-2 block">Their name</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Mummy, Dada ji, Priya didi"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="field text-lg"
              />
            </div>

            <div>
              <label className="ui-label mb-2 block">Relationship</label>
              <div className="grid grid-cols-3 gap-2">
                {FAMILY_RELATIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setDraft({ ...draft, relation: r.key })}
                    className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition ${
                      draft.relation === r.key
                        ? 'bg-gold text-bg-base shadow-glow'
                        : 'bg-bg-surface text-ink ring-1 ring-white/5'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-[11px] font-bold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
              <div className="text-[10px] uppercase tracking-wider text-ink-dim">Recording</div>
              <div className="mt-1 text-sm font-bold text-ink">
                {recorder.lastDuration.toFixed(1)}s captured
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!draft.name.trim()}
              className="btn-primary w-full py-4 disabled:opacity-40"
            >
              Save to family voices
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <VersionFooter />
    </PageTransition>
  );
}
