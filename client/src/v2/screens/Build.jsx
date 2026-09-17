// V2 Kids Build — pick a picture → record your story → Guardian-Owl safety check →
// the picture animates → save to My World. Reuses existing endpoints (content-validate,
// kid-story-presign, kid-story-save, kid-story-animate). Parental consent + sparkle quota.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mic, Square, Camera, Wand2, RotateCcw, Share2, Check, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { sparklesLeft, useSparkle, hasConsent, grantConsent, blobToBase64 } from '../kidbuild.js';
import { GOLD } from '../ui.js';

const MAX_SEC = 120;

export default function Build() {
  const navigate = useNavigate();
  const { user, loginGoogle } = useAuth();
  const { profile, activeIndex, isPaid } = useFamilyProfile();
  const { wisdomImageUrls } = useWisdomData();

  const kidName = profile?.childName && profile.childName !== 'little one' ? profile.childName : 'friend';
  const kidAge = profile?.age || 6;

  const [step, setStep] = useState('pick'); // pick · record · checking · animating · reveal · blocked
  const [picture, setPicture] = useState(null); // { url }
  const [blob, setBlob] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null); // { videoUrl, imageUrl }
  const [failReason, setFailReason] = useState('');
  const [error, setError] = useState('');
  const [consentOpen, setConsentOpen] = useState(false);
  const [left, setLeft] = useState(sparklesLeft(isPaid));

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const pics = useMemo(() => Object.values(wisdomImageUrls || {}).filter(Boolean).slice(0, 8), [wisdomImageUrls]);
  // Playable URL for the just-recorded clip (so you can replay before making magic)
  const blobUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, [blobUrl]);
  useEffect(() => { setLeft(sparklesLeft(isPaid)); }, [isPaid, step]);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── not signed in ──
  if (!user) {
    return (
      <Wrap>
        <Header title="Let's make a story" />
        <div className="mt-8 rounded-3xl p-6 ring-1 ring-white/10 bg-white/[0.05] text-center">
          <div className="text-5xl mb-3">🦉</div>
          <p className="font-display text-lg text-[#F7F1E8]">Ask a grown-up to sign in</p>
          <p className="text-[13px] text-[#B8AAC8] mt-1">Building stories is a signed-in, parent-approved feature.</p>
          <button onClick={() => loginGoogle && loginGoogle()} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Continue with Google</button>
        </div>
      </Wrap>
    );
  }

  const pickImage = (url) => {
    setPicture({ url });
    if (!hasConsent()) { setConsentOpen(true); return; }
    setStep('record');
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Slice-1: use a local object URL to record against; animate needs a hosted URL,
    // so uploaded photos currently can't be animated (library pictures can). TODO: image upload.
    setPicture({ url: URL.createObjectURL(file), local: true });
    if (!hasConsent()) { setConsentOpen(true); return; }
    setStep('record');
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Low bitrate keeps the upload small (avoids body-size "Load failed").
      let mr;
      try { mr = new MediaRecorder(stream, { mimeType: 'audio/webm', audioBitsPerSecond: 32000 }); }
      catch { mr = new MediaRecorder(stream); }
      chunksRef.current = [];
      mr.ondataavailable = (ev) => { if (ev.data.size) chunksRef.current.push(ev.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setBlob(new Blob(chunksRef.current, { type: 'audio/webm' }));
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => { if (s + 1 >= MAX_SEC) stopRecording(); return s + 1; }), 1000);
    } catch {
      setError('Please allow the microphone so we can hear your story.');
    }
  };
  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  };

  const makeMagic = async () => {
    if (!blob || !picture) return;
    if (sparklesLeft(isPaid) <= 0) { setError('No sparkles left today — ask a grown-up for more.'); return; }
    setStep('checking'); setError('');
    const step = (m) => new Error(m);
    try {
      // 1) Safety check (transcribe + moderate)
      const audioBase64 = await blobToBase64(blob);
      let v;
      try {
        const vRes = await fetch('/api/content-validate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64, contentType: 'audio/webm', kidAge }),
        });
        if (!vRes.ok) throw 0;
        v = await vRes.json();
      } catch { throw step("I couldn't hear the story clearly — try a shorter recording."); }
      if (!v.safe) { setFailReason(v.reason || "Some words ruffled my feathers. Let's try a gentler story!"); setStep('blocked'); return; }

      // 2) Save the story (picture + the child's voice). THIS is success.
      setStep('animating');
      let pre;
      try {
        pre = await fetch('/api/kid-story-presign', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentUid: user.uid, profileIndex: activeIndex, contentType: 'audio/webm' }),
        }).then((r) => r.json());
      } catch { throw step('Could not reach the story server. Please try again.'); }
      if (!pre?.uploadUrl) throw step(pre?.error || 'Could not start the upload.');

      const put = await fetch(pre.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'audio/webm' }, body: blob }).catch(() => null);
      if (!put || !put.ok) throw step('Could not save the recording. Please try again.');

      let saveRes = {};
      try {
        saveRes = await fetch('/api/kid-story-save', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentUid: user.uid, profileIndex: activeIndex, storyId: pre.storyId, audioKey: pre.audioKey,
            title: `${kidName}'s story`, promptImageUrl: picture.local ? null : picture.url,
            promptType: 'image', language: 'English', durationSeconds: seconds, transcript: v.transcript,
          }),
        }).then((r) => r.json());
      } catch { throw step('Could not save your story. Please try again.'); }

      useSparkle(isPaid);

      // 3) Animate — BEST EFFORT. Provider may be unavailable; the story still exists
      // with the picture + the child's voice. Never fail the flow on animation.
      let videoUrl = null;
      if (!picture.local) {
        try {
          const a = await fetch('/api/kid-story-animate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentUid: user.uid, storyId: pre.storyId }),
          });
          if (a.ok) { const d = await a.json(); videoUrl = d.videoUrl || null; }
        } catch { /* animation unavailable — fine */ }
      }

      setResult({ videoUrl, imageUrl: picture.url, audioUrl: URL.createObjectURL(blob), storyId: pre.storyId });
      setStep('reveal');
    } catch (e) {
      setError(e?.message || 'Something went wrong. Please try again.');
      setStep('record');
    }
  };

  const reset = () => { setPicture(null); setBlob(null); setSeconds(0); setResult(null); setStep('pick'); };

  // ── consent modal ──
  const consent = consentOpen && (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 backdrop-blur-sm px-5" onClick={() => setConsentOpen(false)}>
      <div className="w-full max-w-sm rounded-3xl p-6 ring-1 ring-white/10" style={{ background: '#0F1E30' }} onClick={(e) => e.stopPropagation()}>
        <div className="text-4xl mb-2">🦉</div>
        <h3 className="font-display text-xl text-[#F7F1E8]">A grown-up check</h3>
        <p className="text-[13px] text-[#B8AAC8] mt-2 leading-relaxed">
          I'm {kidName}'s parent/guardian and I approve them recording their voice and animating a picture to make a story.
          Voice &amp; the short video are processed only to create the story, kept private to your family, and the raw recording is deleted after processing.
        </p>
        <button onClick={() => { grantConsent(); setConsentOpen(false); setStep('record'); }} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>I'm the parent — I approve</button>
        <button onClick={() => setConsentOpen(false)} className="mt-2 w-full rounded-full px-6 py-2.5 text-xs font-bold text-[#B8AAC8]">Not now</button>
      </div>
    </div>
  );

  // ── steps ──
  if (step === 'checking' || step === 'animating') {
    return (
      <Wrap>
        <div className="mt-16 text-center">
          <div className="text-6xl mb-4 animate-bounce">🦉</div>
          <p className="font-display text-xl text-[#F7F1E8]">{step === 'checking' ? 'Listening to your story…' : 'Making the magic…'}</p>
          <p className="text-[13px] text-[#B8AAC8] mt-2">{step === 'checking' ? 'The Guardian Owl is making sure it\'s cozy and kind.' : 'Watch your picture come alive! ✨'}</p>
          <div className="mx-auto mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 animate-pulse rounded-full" style={{ background: GOLD }} />
          </div>
        </div>
      </Wrap>
    );
  }

  if (step === 'blocked') {
    return (
      <Wrap>
        <div className="mt-14 text-center max-w-[420px] mx-auto">
          <div className="text-6xl mb-3">🦉</div>
          <p className="font-display text-xl" style={{ color: GOLD }}>Let's try a different story</p>
          <p className="text-[14px] text-[#B8AAC8] mt-2 leading-relaxed">{failReason}</p>
          <p className="text-[11px] text-[#7A6B8A] mt-3">Nothing was saved · no one else sees it · your sparkle is safe.</p>
          <button onClick={() => { setBlob(null); setSeconds(0); setStep('record'); }} className="mt-6 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Try again</button>
        </div>
      </Wrap>
    );
  }

  if (step === 'reveal') {
    return (
      <Wrap>
        <Header title={result?.videoUrl ? 'You made it come alive!' : 'Your story is ready!'} onBack={reset} />
        <div className="mt-4 rounded-3xl overflow-hidden ring-1 ring-white/10 relative aspect-square max-w-[380px] mx-auto bg-black">
          {result?.videoUrl ? (
            <video src={result.videoUrl} className="h-full w-full object-cover" autoPlay loop playsInline controls />
          ) : (
            <img src={result?.imageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        {/* Play the child's recording (over the picture) when there's no animation yet */}
        {!result?.videoUrl && result?.audioUrl && (
          <audio src={result.audioUrl} controls autoPlay className="mt-3 w-full max-w-[380px] mx-auto block" />
        )}
        <p className="text-center text-[13px] text-[#B8AAC8] mt-3">🎙️ In {kidName}'s own voice · ⭐ +1 star</p>
        {!result?.videoUrl && (
          <p className="text-center text-[11px] text-[#7A6B8A] mt-1">✨ Animation is coming soon — your story is saved with your picture &amp; voice.</p>
        )}
        <div className="mt-5 flex flex-col gap-2.5 max-w-[380px] mx-auto">
          <button onClick={() => navigate('/v2/world')} className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
            <Check size={17} /> Add to my world
          </button>
          <button onClick={reset} className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#B8AAC8] ring-1 ring-white/10">
            <RotateCcw size={15} /> Make another
          </button>
        </div>
      </Wrap>
    );
  }

  if (step === 'record') {
    const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return (
      <Wrap>
        <Header title="Tell your story" onBack={() => setStep('pick')} left={left} />
        {picture && (
          <div className="mt-4 rounded-3xl overflow-hidden ring-1 ring-white/10 aspect-video max-w-[420px] mx-auto">
            <img src={picture.url} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="mt-8 grid place-items-center">
          <button
            onClick={recording ? stopRecording : startRecording}
            className="grid place-items-center rounded-full active:scale-95 transition"
            style={{ width: 148, height: 148, background: recording ? '#f3727f' : 'radial-gradient(circle at 50% 38%, #F6C453 0%, #C4853A 72%)', boxShadow: '0 0 0 10px rgba(246,196,83,0.14), 0 0 0 22px rgba(246,196,83,0.07)' }}
          >
            {recording ? <Square size={46} className="text-white" fill="white" /> : <Mic size={56} strokeWidth={1.8} className="text-[#0D1B2A]" />}
          </button>
          <p className="mt-4 font-display text-xl text-[#F7F1E8]">{recording ? `${mm}:${ss}` : (blob ? 'Have a listen 👂' : 'Tap and tell me your story!')}</p>
          {!recording && blob && blobUrl && (
            <audio src={blobUrl} controls className="mt-4 w-full max-w-[380px]" />
          )}
          {!recording && blob && (
            <button onClick={makeMagic} className="mt-5 w-full max-w-[380px] flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
              <Wand2 size={17} /> Make the magic ✨
            </button>
          )}
          {!recording && blob && <button onClick={() => { setBlob(null); setSeconds(0); }} className="mt-2 text-xs font-bold text-[#7A6B8A]">↺ Record again</button>}
          {error && <p className="mt-4 text-[13px] text-[#f3727f] text-center">{error}</p>}
        </div>
      </Wrap>
    );
  }

  // ── step 'pick' ──
  return (
    <Wrap>
      {consent}
      <Header title={`${kidName}'s Studio`} kicker="Let's make something" left={left} />
      <section className="mt-6 max-w-[560px]">
        <h2 className="text-[15px] font-bold text-[#F7F1E8] mb-3.5">1 · Pick a picture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pics.map((url, i) => (
            <button key={i} onClick={() => pickImage(url)} className="aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 active:scale-95 transition">
              <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <label className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 py-3.5 text-sm font-bold text-[#B8AAC8] cursor-pointer hover:border-white/25 transition">
          <Camera size={17} /> Upload your own photo
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </section>
    </Wrap>
  );
}

function Wrap({ children }) {
  return <div className="px-5 lg:px-8 pt-7 lg:pt-10 pb-28">{children}</div>;
}
function Header({ title, kicker, onBack, left }) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        {onBack && <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8] mt-0.5"><ChevronLeft size={18} /></button>}
        <div>
          {kicker && <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">{kicker}</p>}
          <h1 className="font-display text-[24px] lg:text-3xl mt-0.5 text-[#F7F1E8]">{title}</h1>
        </div>
      </div>
      {left !== undefined && (
        <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold shrink-0" style={{ color: GOLD, background: 'rgba(246,196,83,0.10)', border: '1px solid rgba(246,196,83,0.22)' }}>
          <Sparkles size={14} /> {left === Infinity ? '∞' : left} left
        </span>
      )}
    </header>
  );
}
