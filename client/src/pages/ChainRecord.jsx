// Chain Record — Record a part for a collaborative chain story
// Must listen to ALL previous parts before recording
// Route: /incubate/chain/:chainId/record?partNumber=N&storyId=X&audioKey=Y&uploadUrl=Z

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, ArrowLeft, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';

const API = import.meta.env.VITE_API_BASE_URL || '';
const MAX_DURATION = 300;

export default function ChainRecord() {
  const navigate = useNavigate();
  const { chainId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();

  const partNumber = parseInt(searchParams.get('partNumber') || '1');
  const storyId = searchParams.get('storyId') || '';
  const audioKey = searchParams.get('audioKey') || '';
  const uploadUrl = searchParams.get('uploadUrl') || '';

  // Chain data
  const [chain, setChain] = useState(null);
  const [parts, setParts] = useState([]);
  const [loadingChain, setLoadingChain] = useState(true);

  // Listening state
  const [listenedAll, setListenedAll] = useState(false);
  const [listeningPart, setListeningPart] = useState(0); // 0 = not started
  const [listeningDone, setListeningDone] = useState(new Set());
  const listenAudioRef = useRef(null);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const playbackAudioRef = useRef(null);
  const blobRef = useRef(null);

  // Load chain + parts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/kid-story-chain`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'get', chainId }),
        });
        const data = await res.json();
        setChain(data.chain);
        setParts(data.parts || []);
        // If this is part 1 (no previous parts), skip listening
        if ((data.parts || []).length === 0) setListenedAll(true);
      } catch {}
      setLoadingChain(false);
    })();
  }, [chainId]);

  // Listen to previous parts sequentially
  const startListening = () => {
    if (parts.length === 0) { setListenedAll(true); return; }
    playNextPart(0);
  };

  const playNextPart = (idx) => {
    if (idx >= parts.length) {
      setListenedAll(true);
      setListeningPart(0);
      return;
    }
    setListeningPart(idx + 1);
    if (listenAudioRef.current) listenAudioRef.current.pause();
    const audio = new Audio(parts[idx].audioUrl);
    listenAudioRef.current = audio;
    audio.onended = () => {
      setListeningDone(prev => new Set([...prev, idx]));
      playNextPart(idx + 1);
    };
    audio.play();
  };

  // Recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        playbackAudioRef.current = new Audio(URL.createObjectURL(blob));
        playbackAudioRef.current.onended = () => setPlaying(false);
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
          if (prev >= MAX_DURATION - 1) { recorder.stop(); setRecording(false); clearInterval(timerRef.current); return MAX_DURATION; }
          return prev + 1;
        });
      }, 1000);
    } catch { alert('Could not access microphone.'); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const togglePlayback = () => {
    if (!playbackAudioRef.current) return;
    if (playing) { playbackAudioRef.current.pause(); setPlaying(false); }
    else { playbackAudioRef.current.currentTime = 0; playbackAudioRef.current.play(); setPlaying(true); }
  };

  const reRecord = () => { blobRef.current = null; setRecorded(false); setElapsed(0); setValidationResult(null); };

  // Save
  const handleSave = async () => {
    if (!blobRef.current || !user) return;
    setSaving(true);
    try {
      // Validate
      setValidating(true);
      const base64 = await blobToBase64(blobRef.current);
      const valRes = await fetch(`${API}/api/content-validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64, contentType: blobRef.current.type, kidAge: profile?.age || 7 }),
      });
      const validation = await valRes.json();
      setValidating(false);
      setValidationResult(validation);
      if (!validation.safe) { setSaving(false); return; }

      // Upload to S3
      await fetch(uploadUrl, { method: 'PUT', body: blobRef.current, headers: { 'Content-Type': blobRef.current.type } });

      // Add part
      await fetch(`${API}/api/kid-story-chain`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'add-part',
          chainId,
          parentUid: user.uid,
          profileIndex: 0,
          storyId,
          audioKey,
          title: `Part ${partNumber}`,
          durationSeconds: elapsed,
          transcript: validation.transcript || '',
        }),
      });

      setSaved(true);
    } catch (e) { alert('Save failed: ' + e.message); }
    setSaving(false);
  };

  useEffect(() => { return () => { clearInterval(timerRef.current); if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop(); }; }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Celebration
  if (saved) {
    return (
      <PageTransition className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-7xl mb-4">🎉</motion.div>
        <h1 className="text-2xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>Part {partNumber} Added!</h1>
        <p className="mt-2 text-sm text-ink-muted">You earned ⭐ {partNumber === 1 ? 5 : 3} stars!</p>
        <p className="mt-1 text-xs text-ink-dim">{chain?.title} now has {partNumber} part{partNumber !== 1 ? 's' : ''}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate(`/incubate/chain/${chainId}`)} className="rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95">
            View Chain Story
          </button>
          <button onClick={() => {
            const url = `https://mysleepytale.com/incubate/chain/join/${chain?.inviteToken}`;
            if (navigator.share) navigator.share({ title: chain?.title, text: 'Add your part!', url }).catch(() => {});
            else { navigator.clipboard.writeText(url); alert('Link copied!'); }
          }} className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-ink-muted transition active:scale-95">
            Share with Friends
          </button>
        </div>
      </PageTransition>
    );
  }

  if (loadingChain) {
    return <PageTransition className="flex h-screen items-center justify-center bg-bg-base"><div className="text-3xl animate-pulse">🔗</div></PageTransition>;
  }

  return (
    <PageTransition className="flex flex-col h-screen bg-bg-base safe-top">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(`/incubate/chain/${chainId}`)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-ink-muted transition active:scale-90">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-ink">Part {partNumber} — {chain?.title || 'Chain Story'}</h2>
          <p className="text-[10px] text-ink-dim">{parts.length} part{parts.length !== 1 ? 's' : ''} so far</p>
        </div>
      </div>

      {/* Prompt image */}
      {chain?.promptImageUrl && (
        <div className="px-5 mb-3">
          <div className="rounded-xl overflow-hidden ring-1 ring-white/10" style={{ maxHeight: 150 }}>
            <img src={chain.promptImageUrl} alt="" className="w-full object-cover" style={{ maxHeight: 150 }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24">
        {/* Step 1: Listen to previous parts */}
        {!listenedAll && parts.length > 0 && (
          <div className="text-center w-full max-w-sm">
            <div className="text-4xl mb-3">🎧</div>
            <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Listen to the story so far</h3>
            <p className="text-xs text-ink-muted mt-1 mb-4">Hear what others have said before adding your part</p>

            {listeningPart === 0 ? (
              <button onClick={startListening} className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
                ▶ Play All {parts.length} Part{parts.length !== 1 ? 's' : ''}
              </button>
            ) : (
              <div className="space-y-2">
                {parts.map((p, i) => (
                  <div key={p.id} className={`flex items-center gap-3 rounded-xl p-3 ${listeningDone.has(i) ? 'bg-green-500/10 ring-1 ring-green-500/20' : listeningPart === i + 1 ? 'bg-gold/10 ring-1 ring-gold/30' : 'bg-bg-surface ring-1 ring-white/5'}`}>
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-ink-muted">
                      {listeningDone.has(i) ? <CheckCircle size={14} className="text-green-400" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-ink">{p.kidName} — Part {i + 1}</p>
                    </div>
                    {listeningPart === i + 1 && <span className="text-[10px] text-gold animate-pulse">Playing...</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Record (only after listening) */}
        {listenedAll && !validating && (!validationResult || validationResult.safe) && (
          <div className="flex flex-col items-center">
            {/* Validation failed */}
            {validationResult && !validationResult.safe && (
              <div className="rounded-2xl bg-yellow-500/10 p-5 ring-1 ring-yellow-500/30 text-center mb-6 max-w-sm">
                <div className="text-3xl mb-2">🙈</div>
                <h3 className="text-sm font-bold text-ink">Let's try a different story</h3>
                <p className="mt-1 text-xs text-ink-muted">{validationResult.reason}</p>
                <button onClick={reRecord} className="mt-3 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-bg-base">Try Again</button>
              </div>
            )}

            {!recorded && (
              <>
                <p className="text-xs text-gold mb-3 font-bold">Your turn! Record Part {partNumber}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={recording ? stopRecording : startRecording}
                  className={`grid h-28 w-28 place-items-center rounded-full transition ${recording ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-gold shadow-glow'}`}
                >
                  {recording ? <Square size={36} fill="white" className="text-white" /> : <Mic size={36} className="text-bg-base" />}
                </motion.button>
                <div className="mt-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${recording ? 'text-red-400' : 'text-ink-dim'}`}>{formatTime(elapsed)}</p>
                  <p className="text-[10px] text-ink-dim mt-1">{recording ? 'Tap to stop' : 'Tap to start'}</p>
                </div>
              </>
            )}

            {recorded && (
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
        )}

        {validating && (
          <div className="text-center"><div className="text-3xl animate-pulse mb-2">🔍</div><p className="text-sm text-ink-muted">Checking your story...</p></div>
        )}
      </div>

      {/* Save button */}
      {recorded && listenedAll && (!validationResult || validationResult.safe) && !validating && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 pb-28 safe-bottom">
          <button onClick={handleSave} disabled={saving} className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition active:scale-95 disabled:opacity-50">
            {saving ? '✨ Adding your part...' : `🌟 Add Part ${partNumber} to the Story!`}
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
