// Kid Recording Screen — big record button, timer, playback, title, save.
// Accessed from Incubate page with ?mode=image|topic|free&prompt=...&image=...

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';

const API = import.meta.env.VITE_API_BASE_URL || '';
const MAX_DURATION = 300; // 5 minutes

export default function KidRecord() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();

  const mode = searchParams.get('mode') || 'free';
  const prompt = searchParams.get('prompt') || '';
  const promptImage = searchParams.get('image') || '';

  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // { safe, reason }

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const blobRef = useRef(null);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setPlaying(false);
        setRecorded(true);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecorded(false);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= MAX_DURATION - 1) {
            recorder.stop();
            setRecording(false);
            clearInterval(timerRef.current);
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e) {
      alert('Could not access microphone. Please allow microphone access.');
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  // Play/pause preview
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
    }
  };

  // Re-record
  const reRecord = () => {
    blobRef.current = null;
    audioRef.current = null;
    setRecorded(false);
    setElapsed(0);
    setValidationResult(null);
  };

  // Save story
  const handleSave = async () => {
    if (!blobRef.current || !user) return;
    setSaving(true);

    try {
      // Step 1: Validate content with AI
      setValidating(true);
      const base64 = await blobToBase64(blobRef.current);
      const validateRes = await fetch(`${API}/api/content-validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          contentType: blobRef.current.type,
          kidAge: profile?.age || 7,
        }),
      });
      const validation = await validateRes.json();
      setValidating(false);
      setValidationResult(validation);

      if (!validation.safe) {
        setSaving(false);
        return; // Show friendly message, don't save
      }

      // Step 2: Get pre-signed upload URL
      const presignRes = await fetch(`${API}/api/kid-story-presign`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          parentUid: user.uid,
          profileIndex: 0,
          contentType: blobRef.current.type,
        }),
      });
      const { uploadUrl, storyId, audioKey } = await presignRes.json();

      // Step 3: Upload audio directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: blobRef.current,
        headers: { 'Content-Type': blobRef.current.type },
      });

      // Step 4: Save metadata to Firestore
      await fetch(`${API}/api/kid-story-save`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          parentUid: user.uid,
          profileIndex: 0,
          storyId,
          audioKey,
          title: title.trim() || 'My Story',
          topic: prompt || '',
          promptImageUrl: promptImage || '',
          promptType: mode,
          language: profile?.language || 'English',
          durationSeconds: elapsed,
          transcript: validation.transcript || '',
        }),
      });

      savedStoryIdRef.current = storyId;
      setSaved(true);
    } catch (e) {
      console.error('[KidRecord] Save failed:', e.message);
      alert('Could not save your story. Please try again.');
    }
    setSaving(false);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Animation state
  const [animating, setAnimating] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [animError, setAnimError] = useState(null);
  const savedStoryIdRef = useRef(null);

  const handleAnimate = async () => {
    if (!savedStoryIdRef.current || !user) return;
    setAnimating(true);
    setAnimError(null);
    try {
      const res = await fetch(`${API}/api/kid-story-animate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ parentUid: user.uid, storyId: savedStoryIdRef.current }),
      });
      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setAnimationDone(true);
      } else {
        setAnimError(data.error || 'Animation failed');
      }
    } catch (e) {
      setAnimError(e.message);
    }
    setAnimating(false);
  };

  // Celebration screen after save
  if (saved) {
    return (
      <PageTransition className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        {animationDone && videoUrl ? (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-3">🎬</motion.div>
            <h1 className="text-xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>Your Story Came Alive!</h1>
            <div className="mt-4 w-full max-w-sm rounded-2xl overflow-hidden ring-1 ring-gold/30">
              <video src={videoUrl} controls autoPlay playsInline className="w-full" style={{ maxHeight: '50vh' }} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => navigate('/incubate')} className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-bg-base transition active:scale-95">
                Back to Incubate
              </button>
              <button onClick={() => {
                const url = `https://mysleepytale.com/player?storyId=${savedStoryIdRef.current}`;
                if (navigator.share) navigator.share({ title: title || 'My Story', url }).catch(() => {});
                else { navigator.clipboard.writeText(url); alert('Link copied!'); }
              }} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-ink-muted transition active:scale-95">
                Share
              </button>
            </div>
          </>
        ) : (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-7xl mb-4">
              🌟
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>
              Amazing Story!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-2 text-sm text-ink-muted">
              {title || 'Your story'} has been saved. You earned ⭐ 5 stars!
            </motion.p>

            {/* Animate button — only if they used an image prompt */}
            {promptImage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {animating ? (
                  <div className="mt-5 text-center">
                    <div className="text-3xl animate-pulse mb-2">✨</div>
                    <p className="text-sm text-gold font-bold">Bringing your story to life...</p>
                    <p className="text-[10px] text-ink-dim mt-1">This takes about 30-60 seconds</p>
                  </div>
                ) : animError ? (
                  <div className="mt-5 text-center">
                    <p className="text-xs text-red-400 mb-2">{animError}</p>
                    <button onClick={handleAnimate} className="rounded-xl bg-gold/20 px-5 py-2.5 text-xs font-bold text-gold ring-1 ring-gold/30 transition active:scale-95">
                      Try Again
                    </button>
                  </div>
                ) : (
                  <button onClick={handleAnimate}
                    className="mt-5 rounded-2xl bg-gradient-to-r from-purple-500 to-gold px-8 py-4 text-sm font-bold text-white shadow-glow transition active:scale-95">
                    🎬 Animate My Story!
                  </button>
                )}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-4 flex gap-3">
              <button onClick={() => navigate('/incubate')} className="rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95">
                Back to Incubate
              </button>
              <button onClick={reRecord} className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-ink-muted transition active:scale-95">
                Record Another
              </button>
            </motion.div>
          </>
        )}
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex flex-col h-screen bg-bg-base safe-top">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate('/incubate')} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-ink-muted transition active:scale-90">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-ink">
            {mode === 'image' ? 'Tell a story about this picture' : mode === 'topic' ? 'Tell a story about...' : 'Tell any story!'}
          </h2>
        </div>
      </div>

      {/* Prompt image — full display */}
      {promptImage && (
        <div className="px-5 mb-4">
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
            <img src={promptImage} alt={prompt} className="w-full object-contain" style={{ maxHeight: '45vh' }} />
          </div>
          {prompt && <p className="text-center text-xs text-ink-muted mt-2">{prompt}</p>}
        </div>
      )}

      {/* Topic text prompt */}
      {prompt && !promptImage && !recording && !recorded && (
        <div className="px-5 mb-4">
          <div className="rounded-2xl bg-bg-surface p-5 ring-1 ring-gold/20 text-center max-w-sm mx-auto">
            <p className="text-xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>"{prompt}"</p>
            <p className="text-[11px] text-ink-muted mt-2">Tell a story about this!</p>
          </div>
        </div>
      )}

      {/* Recording controls — below the image, above bottom nav */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24">
        <div className="flex flex-col items-center relative">
        {/* Validation failed */}
        {validationResult && !validationResult.safe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-yellow-500/10 p-5 ring-1 ring-yellow-500/30 text-center mb-6 max-w-sm"
          >
            <div className="text-3xl mb-2">🙈</div>
            <h3 className="text-sm font-bold text-ink">Oops! Let's try a different story</h3>
            <p className="mt-1 text-xs text-ink-muted">{validationResult.reason || 'This story has some words we cannot use. Try recording a new one!'}</p>
            <button onClick={reRecord} className="mt-3 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-bg-base transition active:scale-95">
              Try Again
            </button>
          </motion.div>
        )}

        {/* Validating spinner */}
        {validating && (
          <div className="text-center mb-6">
            <div className="text-3xl animate-pulse mb-2">🔍</div>
            <p className="text-sm text-ink-muted">Checking your story...</p>
          </div>
        )}

        {/* Record button */}
        {!recorded && !validating && (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={recording ? stopRecording : startRecording}
              className={`grid h-28 w-28 place-items-center rounded-full transition ${
                recording
                  ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                  : 'bg-gold shadow-glow'
              }`}
            >
              {recording ? (
                <Square size={36} fill="white" className="text-white" />
              ) : (
                <Mic size={36} className="text-bg-base" />
              )}
            </motion.button>

            {/* Timer */}
            <div className="mt-4 text-center">
              <p className={`text-2xl font-bold font-mono ${recording ? 'text-red-400' : 'text-ink-dim'}`}>
                {formatTime(elapsed)}
              </p>
              <p className="text-[10px] text-ink-dim mt-1">
                {recording ? 'Tap to stop' : 'Tap to start recording'}
              </p>
              {recording && (
                <p className="text-[9px] text-ink-dim mt-0.5">Max {MAX_DURATION / 60} minutes</p>
              )}
            </div>

            {/* Pulsing animation when recording — behind button */}
            {recording && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.08, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-36 w-36 rounded-full bg-red-500/20 -z-10 -mt-32 pointer-events-none"
              />
            )}
          </>
        )}

        {/* Playback controls */}
        {recorded && !validating && (!validationResult || validationResult.safe) && (
          <div className="text-center">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={togglePlayback} className="grid h-16 w-16 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-90">
                {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={reRecord} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-ink-muted transition active:scale-90">
                <RotateCcw size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-dim">{formatTime(elapsed)} recorded</p>
          </div>
        )}
        </div>
      </div>

      {/* Bottom: title + save */}
      {recorded && (!validationResult || validationResult.safe) && !validating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-28 safe-bottom"
        >
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What's your story called?"
            className="w-full rounded-xl bg-bg-surface px-4 py-3.5 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 outline-none focus:ring-gold/50 text-center mb-3"
            style={{ fontSize: 16 }} // prevent iOS zoom
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition active:scale-95 disabled:opacity-50"
          >
            {saving ? '✨ Saving your story...' : '🌟 Save My Story!'}
          </button>
        </motion.div>
      )}
    </PageTransition>
  );
}

async function blobToBase64(blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
