// VoiceClipRecorder — record short voice clips for kid's voice in stories.
// Shows prompts, records audio, saves to Firebase Storage.
// Fully optional — skip button always available.

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Check, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceClipRecorder({ prompts, episodeId, childName, onDone, onSkip }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [saved, setSaved] = useState({}); // { promptId: blob }
  const [uploading, setUploading] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  const prompt = prompts.prompts[currentIdx];
  const maxSec = prompt?.maxSeconds || 5;
  const allDone = currentIdx >= prompts.prompts.length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.current = mr;
      mr.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev + 1 >= maxSec) {
            mr.stop();
            setRecording(false);
            clearInterval(timerRef.current);
            return maxSec;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsed(0);
  };

  const acceptRecording = () => {
    if (!audioBlob) return;
    setSaved(prev => ({ ...prev, [prompt.id]: audioBlob }));
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsed(0);
    setCurrentIdx(i => i + 1);
  };

  const skipPrompt = () => {
    discardRecording();
    setCurrentIdx(i => i + 1);
  };

  const finishAndSave = async () => {
    const clips = Object.entries(saved);
    if (clips.length === 0) { onSkip(); return; }

    setUploading(true);
    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../lib/firebase.js');
      if (!storage) { onDone(saved); return; }

      const urls = {};
      for (const [promptId, blob] of clips) {
        const path = `voice-clips/${episodeId}/${Date.now()}_${promptId}.webm`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        urls[promptId] = await getDownloadURL(storageRef);
      }

      // Save clip URLs to localStorage for this episode
      const key = `mst:voiceclips:${episodeId}`;
      localStorage.setItem(key, JSON.stringify(urls));

      onDone(urls);
    } catch (err) {
      console.error('Upload failed:', err);
      // Still save locally even if upload fails
      onDone(saved);
    }
    setUploading(false);
  };

  // All prompts answered (or skipped)
  if (allDone) {
    const clipCount = Object.keys(saved).length;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center px-6 py-10 text-center"
      >
        {clipCount > 0 ? (
          <>
            <div className="text-5xl mb-4">🎙️</div>
            <h2 className="font-display text-xl font-bold text-gold mb-2">
              {clipCount} voice clip{clipCount !== 1 ? 's' : ''} recorded!
            </h2>
            <p className="text-sm text-ink-muted mb-6 max-w-xs">
              {childName}'s voice will be woven into the story at special moments.
            </p>
            <button
              onClick={finishAndSave}
              disabled={uploading}
              className="btn-primary px-8 py-4 text-base disabled:opacity-50"
            >
              {uploading ? 'Saving...' : 'Save & Play Story'}
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🌙</div>
            <h2 className="font-display text-xl font-bold text-ink mb-2">No clips recorded</h2>
            <p className="text-sm text-ink-muted mb-6">That's okay! The story plays beautifully without them.</p>
            <button onClick={onSkip} className="btn-primary px-8 py-4">
              Play Story
            </button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 py-8"
    >
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {prompts.prompts.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${
              i < currentIdx ? 'w-8 bg-gold' :
              i === currentIdx ? 'w-8 bg-gold/50' :
              'w-4 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Episode context */}
      <p className="text-[10px] uppercase tracking-wider text-ink-dim mb-4">
        {prompts.episodeTitle} · clip {currentIdx + 1} of {prompts.prompts.length}
      </p>

      {/* Prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">{prompt.emoji}</div>
          <h2 className="font-display text-xl font-bold text-ink mb-2">{prompt.label}</h2>
          <p className="text-sm text-ink-muted">{prompt.hint}</p>
        </motion.div>
      </AnimatePresence>

      {/* Recording UI */}
      {!audioUrl ? (
        <div className="flex flex-col items-center gap-4">
          {/* Mic button */}
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`grid h-20 w-20 place-items-center rounded-full transition-all ${
              recording
                ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                : 'bg-gold shadow-glow'
            }`}
          >
            {recording ? (
              <Square size={28} className="text-white" fill="white" />
            ) : (
              <Mic size={28} className="text-bg-base" />
            )}
          </button>

          {/* Timer */}
          {recording && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-bold text-red-400 tabular-nums">{elapsed}s / {maxSec}s</span>
            </div>
          )}

          {!recording && (
            <p className="text-[11px] text-ink-dim">Tap to record (max {maxSec} seconds)</p>
          )}
        </div>
      ) : (
        /* Playback + accept/discard */
        <div className="flex flex-col items-center gap-4">
          <audio src={audioUrl} controls className="w-full max-w-[280px] h-10" />

          <div className="flex gap-3">
            <button
              onClick={discardRecording}
              className="flex items-center gap-2 rounded-pill bg-bg-surface px-5 py-3 text-sm font-bold text-ink-muted ring-1 ring-white/5"
            >
              <Trash2 size={16} /> Redo
            </button>
            <button
              onClick={acceptRecording}
              className="flex items-center gap-2 rounded-pill bg-gold px-5 py-3 text-sm font-bold text-bg-base"
            >
              <Check size={16} /> Perfect!
            </button>
          </div>
        </div>
      )}

      {/* Skip */}
      {!recording && (
        <button
          onClick={skipPrompt}
          className="mt-6 flex items-center gap-1.5 text-sm text-ink-dim transition hover:text-ink-muted"
        >
          <SkipForward size={14} /> Skip this one
        </button>
      )}

      {/* Skip all */}
      {currentIdx === 0 && !recording && !audioUrl && (
        <button
          onClick={onSkip}
          className="mt-4 text-[11px] text-ink-dim/50"
        >
          Skip all — just play the story
        </button>
      )}
    </motion.div>
  );
}
