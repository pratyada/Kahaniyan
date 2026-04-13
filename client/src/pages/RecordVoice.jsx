import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVoiceLink, uploadVoiceRecording } from '../utils/voiceLink.js';
import { VOICE_TRAINING_PARAGRAPH } from '../utils/constants.js';
import { APP_NAME, APP_VERSION } from '../utils/version.js';

export default function RecordVoice() {
  const { token } = useParams();
  const [link, setLink] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | recording | uploading | done | expired | error
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(0);
  const tickRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getVoiceLink(token);
        if (!data) { setStatus('error'); return; }
        if (data.expired) { setStatus('expired'); setLink(data); return; }
        if (data.used) { setStatus('done'); setLink(data); return; }
        setLink(data);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [token]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        setStatus('uploading');
        try {
          await uploadVoiceRecording(token, blob);
          setStatus('done');
        } catch (e) {
          console.error(e);
          setStatus('error');
        }
      };
      recorderRef.current = rec;
      startTimeRef.current = Date.now();
      rec.start();
      setStatus('recording');
      tickRef.current = setInterval(() => {
        setElapsed((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } catch {
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 py-10 text-[#f5f0e8]">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">🌙</div>
          <h1 className="font-display text-2xl font-bold text-[#f0a500]">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-[#a8a39a]">Voice recording</p>
        </div>

        {/* LOADING */}
        {status === 'loading' && (
          <div className="text-center text-sm text-[#a8a39a]">Loading…</div>
        )}

        {/* EXPIRED */}
        {status === 'expired' && (
          <div className="rounded-2xl bg-[#1a1a28] p-6 text-center">
            <div className="mb-3 text-4xl">⏰</div>
            <h2 className="font-display text-xl font-bold text-[#f0a500]">Link expired</h2>
            <p className="mt-2 text-sm text-[#a8a39a]">
              This recording link has expired. Ask {link?.userEmail?.split('@')[0] || 'the sender'} to
              send a new one from the app.
            </p>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="rounded-2xl bg-[#1a1a28] p-6 text-center">
            <div className="mb-3 text-4xl">❌</div>
            <h2 className="font-display text-xl font-bold text-[#f3727f]">Something went wrong</h2>
            <p className="mt-2 text-sm text-[#a8a39a]">
              This link may be invalid or your browser doesn't support recording.
            </p>
          </div>
        )}

        {/* DONE */}
        {status === 'done' && (
          <div className="rounded-2xl bg-[#1a1a28] p-6 text-center">
            <div className="mb-3 text-4xl">✅</div>
            <h2 className="font-display text-xl font-bold text-[#7ad9a1]">Voice recorded!</h2>
            <p className="mt-2 text-sm text-[#a8a39a]">
              Thank you{link?.characterName ? `, ${link.characterName}` : ''}! Your voice has been
              saved. {link?.userEmail?.split('@')[0] || 'The family'} can now use it in bedtime
              stories.
            </p>
            <p className="mt-4 text-xs text-[#6e6a63]">You can close this tab.</p>
          </div>
        )}

        {/* UPLOADING */}
        {status === 'uploading' && (
          <div className="rounded-2xl bg-[#1a1a28] p-6 text-center">
            <div className="mb-3 text-4xl animate-pulse">☁️</div>
            <h2 className="text-lg font-bold text-[#f0a500]">Saving your voice…</h2>
          </div>
        )}

        {/* READY / RECORDING */}
        {(status === 'ready' || status === 'recording') && link && (
          <div className="space-y-6">
            {/* Who is recording */}
            <div className="rounded-2xl bg-[#1a1a28] p-4 text-center">
              <div className="mb-2 text-3xl">{link.emoji || '🎤'}</div>
              <div className="text-lg font-bold text-[#f5f0e8]">
                Recording as: {link.characterName}
              </div>
              <div className="mt-1 text-xs text-[#a8a39a]">
                Requested by {link.userEmail?.split('@')[0] || 'family'} ·
                expires in {Math.max(0, Math.round((new Date(link.expiresAt) - new Date()) / 60000))} min
              </div>
            </div>

            {/* Training paragraph */}
            <div className="rounded-2xl bg-[#1a1a28] p-4">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0a500]">
                Read this paragraph aloud
              </div>
              <p className="font-story text-[15px] leading-relaxed text-[#a8a39a]">
                {VOICE_TRAINING_PARAGRAPH}
              </p>
              <p className="mt-3 text-[10px] text-[#6e6a63]">
                ~30–45 seconds · speak naturally
              </p>
            </div>

            {/* Record button */}
            <div className="flex flex-col items-center gap-4">
              <motion.button
                onMouseDown={status === 'ready' ? startRecording : undefined}
                onMouseUp={status === 'recording' ? stopRecording : undefined}
                onMouseLeave={status === 'recording' ? stopRecording : undefined}
                onTouchStart={status === 'ready' ? (e) => { e.preventDefault(); startRecording(); } : undefined}
                onTouchEnd={status === 'recording' ? (e) => { e.preventDefault(); stopRecording(); } : undefined}
                animate={status === 'recording' ? { scale: [1, 1.05, 1] } : {}}
                transition={status === 'recording' ? { repeat: Infinity, duration: 1 } : {}}
                className={`grid h-32 w-32 place-items-center rounded-full transition ${
                  status === 'recording'
                    ? 'bg-[#f3727f] shadow-[0_0_60px_rgba(243,114,127,0.6)]'
                    : 'bg-[#f0a500] shadow-[0_0_40px_rgba(240,165,0,0.4)]'
                }`}
              >
                {status === 'recording' ? (
                  <span className="text-lg font-bold uppercase tracking-wider text-white">
                    Release
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-1 text-[#0a0a0f]">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Hold to record
                    </span>
                  </span>
                )}
              </motion.button>

              {status === 'recording' && (
                <div className="text-2xl font-bold tabular-nums text-[#f0a500]">
                  {elapsed.toFixed(1)}s
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-[10px] uppercase tracking-[0.2em] text-[#6e6a63]">
          {APP_NAME} · v{APP_VERSION}
        </footer>
      </div>
    </div>
  );
}
