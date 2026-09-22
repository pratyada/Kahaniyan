// V2 My Voices — clone a family voice (ElevenLabs), pick the active voice for
// playback. First voice free; more require Family Plus (enforced server-side).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Mic, Square, Check, Trash2, Plus, Gem, Volume2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { blobToBase64 } from '../kidbuild.js';
import { toWav } from '../wav.js';
import { getActiveVoice, setActiveVoice } from '../voice.js';
import { GOLD } from '../ui.js';

const READ_LINE = "Once upon a time, under a big silver moon, a little star wished to give the sweetest dreams to every sleepy child in the whole wide world.";

export default function MyVoices() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo'); // set when arriving from a story's mic button
  const { user, loginGoogle } = useAuth();
  const { voiceClones, isPaid, refreshVoiceClones } = useFamilyProfile();

  const [clones, setClones] = useState([]);
  const [active, setActive] = useState(getActiveVoice());
  const [mode, setMode] = useState('list'); // list · add · weaving · done · upsell
  const [name, setName] = useState('');
  const [blob, setBlob] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const mediaRef = useRef(null); const chunksRef = useRef([]); const timerRef = useRef(null);

  useEffect(() => { setClones(voiceClones || []); }, [voiceClones]);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const pick = (v) => {
    setActive(v);
    setActiveVoice(v);
    // If we came here from a story to choose its voice, go straight back so it replays
    // in the chosen voice (a short delay lets the selection persist first).
    if (returnTo) setTimeout(() => navigate(returnTo), 250);
  };
  // Back button returns to wherever we came from — the story (if arrived via its mic
  // button) or the profile screen otherwise.
  const goBack = () => navigate(returnTo || '/profile');
  const canAddFree = useMemo(() => clones.length === 0, [clones]);

  if (!user) {
    return (
      <Wrap>
        <Header title="My Voices" onBack={goBack} />
        <div className="mt-8 rounded-3xl p-6 ring-1 ring-white/10 bg-white/[0.05] text-center">
          <Volume2 size={34} style={{ color: GOLD }} className="mx-auto mb-3" />
          <p className="font-display text-lg text-[#F7F1E8]">Sign in to add family voices</p>
          <button onClick={() => loginGoogle && loginGoogle()} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Continue with Google</button>
        </div>
      </Wrap>
    );
  }

  const startRec = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach((t) => t.stop()); setBlob(new Blob(chunksRef.current, { type: 'audio/webm' })); };
      mr.start(); mediaRef.current = mr; setRecording(true); setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => { if (s + 1 >= 60) stopRec(); return s + 1; }), 1000);
    } catch { setError('Please allow the microphone.'); }
  };
  const stopRec = () => { if (mediaRef.current?.state !== 'inactive') mediaRef.current?.stop(); if (timerRef.current) clearInterval(timerRef.current); setRecording(false); };

  const weave = async () => {
    if (!blob || !name.trim()) { setError('Add a name and a recording first.'); return; }
    setMode('weaving'); setError('');
    try {
      // Convert to WAV — ElevenLabs reliably accepts wav/mp3/m4a; webm/opus often fails.
      let sample = blob, ct = 'audio/webm';
      try { sample = await toWav(blob, 22050); ct = 'audio/wav'; } catch { sample = blob; ct = blob.type || 'audio/webm'; }
      const audioBase64 = await blobToBase64(sample);
      const r = await fetch('/api/clone-voice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, name: name.trim(), relation: '', audioBase64, contentType: ct, language: 'English' }),
      });
      if (r.status === 402) { setMode('upsell'); return; }
      const d = await r.json();
      if (!r.ok || !d.voiceId) throw new Error(d.error || 'Cloning failed');
      const clone = d.clone || { id: d.voiceId, name: name.trim() };
      setClones((c) => [clone, ...c]);
      pick(clone);
      // Sync the provider from the server (source of truth) so the new voice survives
      // navigating away and back — otherwise the one-time-fetched voiceClones is stale
      // on remount and the voice appears to vanish until a hard refresh.
      refreshVoiceClones && refreshVoiceClones();
      setMode('done');
    } catch (e) { setError(e.message || 'Could not weave the voice. Try again.'); setMode('add'); }
  };

  const startAdd = () => {
    if (!canAddFree && !isPaid) { setMode('upsell'); return; }
    setName(''); setBlob(null); setSeconds(0); setError(''); setMode('add');
  };

  /* ── weaving ── */
  if (mode === 'weaving') {
    return (
      <Wrap>
        <div className="mt-16 text-center">
          <div className="text-5xl mb-4">🧵</div>
          <p className="font-display text-xl text-[#F7F1E8]">Weaving {name}&apos;s voice…</p>
          <p className="text-[13px] text-[#B8AAC8] mt-2">This takes a moment — we&apos;re teaching the stars to speak like them.</p>
          <div className="mx-auto mt-8 h-1.5 w-52 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/3 animate-pulse rounded-full" style={{ background: GOLD }} /></div>
        </div>
      </Wrap>
    );
  }

  /* ── upsell ── */
  if (mode === 'upsell') {
    return (
      <Wrap>
        <Header title="Add more voices" onBack={() => setMode('list')} />
        <div className="mt-6 rounded-3xl p-6 ring-1 text-center" style={{ background: 'linear-gradient(120deg, rgba(246,196,83,0.16), rgba(246,196,83,0.04))', borderColor: 'rgba(246,196,83,0.3)' }}>
          <Gem size={34} style={{ color: GOLD }} className="mx-auto mb-3" />
          <p className="font-display text-xl text-[#F7F1E8]">Your first voice is free</p>
          <p className="text-[13px] text-[#B8AAC8] mt-2">Add Mum, Dad &amp; Grandma with <b>Family Plus</b> — unlimited voices, every story read in a voice they love.</p>
          <button onClick={() => navigate('/profile')} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>See Family Plus</button>
        </div>
      </Wrap>
    );
  }

  /* ── done ── */
  if (mode === 'done') {
    return (
      <Wrap>
        <div className="mt-16 text-center">
          <div className="grid h-20 w-20 mx-auto place-items-center rounded-full" style={{ background: GOLD }}><Check size={40} className="text-[#0D1B2A]" /></div>
          <p className="font-display text-xl text-[#F7F1E8] mt-5">{name}&apos;s voice is ready ✨</p>
          <p className="text-[13px] text-[#B8AAC8] mt-2">Every story will now be read in their voice.</p>
          <button onClick={() => setMode('list')} className="mt-6 w-full max-w-[360px] rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Done</button>
        </div>
      </Wrap>
    );
  }

  /* ── add / record ── */
  if (mode === 'add') {
    const mm = String(Math.floor(seconds / 60)); const ss = String(seconds % 60).padStart(2, '0');
    return (
      <Wrap>
        <Header title="Add a voice" onBack={() => setMode('list')} />
        <div className="mt-5 max-w-[440px]">
          <label className="text-[12px] font-bold text-[#B8AAC8]">Whose voice?</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grandma" className="mt-1.5 w-full rounded-2xl bg-white/[0.06] ring-1 ring-white/10 focus:ring-[#F6C453]/50 outline-none py-3 px-4 text-sm text-[#F7F1E8] placeholder:text-[#7A6B8A]" />

          <div className="mt-5 rounded-2xl p-4 ring-1 ring-white/10 bg-white/[0.04]">
            <p className="text-[12px] font-bold text-[#B8AAC8] mb-1">Read this aloud (~20s):</p>
            <p className="text-[15px] text-[#F7F1E8] leading-relaxed font-display">“{READ_LINE}”</p>
          </div>

          <div className="mt-6 grid place-items-center">
            <button onClick={recording ? stopRec : startRec} className="grid place-items-center rounded-full active:scale-95 transition" style={{ width: 110, height: 110, background: recording ? '#f3727f' : 'radial-gradient(circle at 50% 38%, #F6C453 0%, #C4853A 72%)' }}>
              {recording ? <Square size={36} className="text-white" fill="white" /> : <Mic size={44} strokeWidth={1.8} className="text-[#0D1B2A]" />}
            </button>
            <p className="mt-3 text-sm text-[#B8AAC8]">{recording ? `${mm}:${ss} — tap to stop` : (blob ? '✓ Got it — re-record or weave below' : 'Tap and read the line')}</p>
          </div>

          {blob && !recording && (
            <button onClick={weave} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>🧵 Weave this voice</button>
          )}
          {error && <p className="mt-3 text-center text-[13px] text-[#f3727f]">{error}</p>}
          <p className="mt-4 text-[11px] text-[#7A6B8A] text-center">Only clone a voice you&apos;re allowed to. Children&apos;s voices are never cloned.</p>
        </div>
      </Wrap>
    );
  }

  /* ── list ── */
  return (
    <Wrap>
      <Header title="My Voices" onBack={goBack} />
      <p className="text-[13px] text-[#B8AAC8] mt-1">Pick the voice that reads your stories.</p>

      <div className="mt-5 space-y-2.5 max-w-[520px]">
        <VoiceRow name="Default narrator" sub="Our warm storyteller" active={!active} onPick={() => pick(null)} />
        {clones.map((v) => (
          <VoiceRow key={v.id} name={v.name} sub={v.relation || 'Cloned voice'} active={active?.id === v.id} onPick={() => pick(v)} />
        ))}
      </div>

      <button onClick={startAdd} className="mt-5 w-full max-w-[520px] flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 py-3.5 text-sm font-bold text-[#B8AAC8] hover:border-white/25 transition">
        <Plus size={17} /> {canAddFree ? 'Add your first voice — free' : 'Add another voice'}
      </button>

      <p className="mt-5 text-[12px] text-[#7A6B8A] max-w-[520px]">💛 “Hear Grandma read tonight.” Your first voice is free; add more with Family Plus.</p>
    </Wrap>
  );
}

function VoiceRow({ name, sub, active, onPick }) {
  return (
    <button onClick={onPick} className={`w-full flex items-center gap-3.5 rounded-2xl p-3.5 text-left ring-1 transition ${active ? '' : 'ring-white/10 bg-white/[0.04] hover:bg-white/[0.06]'}`} style={active ? { background: 'rgba(246,196,83,0.12)', borderColor: 'rgba(246,196,83,0.4)', boxShadow: 'inset 0 0 0 1px rgba(246,196,83,0.4)' } : undefined}>
      <div className="grid h-11 w-11 place-items-center rounded-full shrink-0" style={{ background: active ? GOLD : 'rgba(255,255,255,0.08)' }}>
        <Volume2 size={18} className={active ? 'text-[#0D1B2A]' : 'text-[#B8AAC8]'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#F7F1E8]">{name}</p>
        <p className="text-[12px] text-[#7A6B8A]">{sub}</p>
      </div>
      {active && <Check size={18} style={{ color: GOLD }} />}
    </button>
  );
}
function Wrap({ children }) { return <div className="px-5 lg:px-8 pt-7 lg:pt-10 pb-28">{children}</div>; }
function Header({ title, onBack }) {
  return (
    <header className="flex items-center gap-2">
      {onBack && <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8]"><ChevronLeft size={18} /></button>}
      <h1 className="font-display text-[24px] lg:text-3xl text-[#F7F1E8]">{title}</h1>
    </header>
  );
}
