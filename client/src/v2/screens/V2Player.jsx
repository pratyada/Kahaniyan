// V2 Player — night-sky playback. Story-SPECIFIC via /player/:storyId so it's
// refresh-safe, deep-linkable and shareable (resolves + loads the story from the id
// if it isn't already the active one). Plays stored audio directly via loadCached
// with a liveness probe → TTS fallback for dead URLs. Multilingual → language picker.
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Play, Pause, RotateCcw, RotateCw, Moon, Mic, Globe, Share2, Check, BookOpen, ChevronDown } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useNarrator } from '../../hooks/useNarrator.js';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getActiveVoice } from '../voice.js';
import { getStoryArt, getTraditionArt } from '../../utils/storyArt.js';
import { TRADITIONS } from '../../data/culturalLessons.js';
import { SERIES } from '../../data/series.js';
import { COLLECTIONS } from '../../data/collections.js';
import { buildStory } from '../play.js';
import { markPlayed, isMultiLang } from '../played.js';
import { GOLD } from '../ui.js';
import Storybook from './Storybook.jsx';

// Phase 1: exactly ONE story gets the immersive page-turning Storybook experience.
// Every other story renders the normal player below, untouched.
const STORYBOOK_STORY_ID = 'universal_garden_of_mistakes';

const ML_LANGS = [['English', '🇬🇧'], ['French', '🇫🇷'], ['Hindi', '🇮🇳'], ['Arabic', '🇸🇦'], ['Spanish', '🇪🇸'], ['Chinese', '🇨🇳'], ['Polish', '🇵🇱'], ['Hungarian', '🇭🇺'], ['Tamil', '🇮🇳']];
const TR_LANGS = [['English', '🇬🇧'], ['Spanish', '🇪🇸'], ['French', '🇫🇷'], ['Hindi', '🇮🇳'], ['Arabic', '🇸🇦'], ['Tamil', '🇮🇳'], ['Hungarian', '🇭🇺']];

const stripId = (id) => String(id || '').replace(/^lesson_/, '');
const fmt = (sec) => (!isFinite(sec) || sec < 0 ? '0:00' : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`);

// Resolve a raw content id to its lesson / episode / collection-story object
function findContent(id, allLessons) {
  if (!id) return null;
  let hit = (allLessons || []).find((l) => l.id === id);
  if (hit) return hit;
  for (const s of SERIES || []) {
    const ep = (s.episodes || []).find((e) => e.id === id);
    if (ep) return { ...ep, seriesId: s.id };
  }
  for (const c of COLLECTIONS || []) {
    const st = (c.stories || []).find((x) => x.id === id);
    if (st) return st;
  }
  return null;
}

export default function V2Player() {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [searchParams] = useSearchParams();
  const { current, load } = usePlayer();
  const nar = useNarrator();
  const { user, loginGoogle } = useAuth();
  const { allLessons, wisdomImageUrls, wisdomAudioUrls } = useWisdomData();
  const [activeVoice] = useState(getActiveVoice()); // selected cloned voice, if any
  const startedRef = useRef(null);
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepOpen, setSleepOpen] = useState(false); // sleep-timer popover
  const [lang, setLang] = useState('English');
  const [copied, setCopied] = useState(false);
  const [showText, setShowText] = useState(false); // text hidden by default → "Read along" reveals it, "Hide text" hides it
  const [view, setView] = useState('storybook'); // only affects the showcase story: 'storybook' | 'classic'
  const [gated, setGated] = useState(false); // cliffhanger signup gate for guests
  const sleepRef = useRef(null);
  const GATE_AT = 0.75; // guests are paused ~75% through and asked to sign up free

  const cleanCurrentId = stripId(current?.id);
  const isStorybookStory = cleanCurrentId === STORYBOOK_STORY_ID || storyId === STORYBOOK_STORY_ID;
  const storybookActive = isStorybookStory && view === 'storybook';

  // Ensure the story for THIS url is the active one (resolve + load if needed)
  useEffect(() => {
    if (!storyId) return;
    const matches = current && (stripId(current.id) === storyId || current.episodeId === storyId);
    if (matches) return;
    const content = findContent(storyId, allLessons);
    if (content) {
      load(buildStory(content, wisdomAudioUrls || {}, wisdomImageUrls || {},
        content.seriesId ? { seriesId: content.seriesId, episodeId: content.id } : {}));
      return;
    }
    // Not a built-in story → try a shared kid-created story via the SERVER
    // (admin SDK read; works regardless of client Firestore rules / approval).
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/kid-story-save', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get', storyId }),
        });
        if (!r.ok || cancelled) return;
        const { story: k } = await r.json();
        if (!k || cancelled) return;
        load({
          id: `lesson_${storyId}`,
          title: k.title || 'A little story',
          text: k.transcript || '',
          audioUrl: k.audioUrl || null,
          coverImage: k.videoUrl ? null : (k.promptImageUrl || null),
          videoUrl: k.videoUrl || null,
          source: 'A story by a young creator 🌙',
          isWisdom: false,
        });
      } catch { /* not found / not shared */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, allLessons]);

  const multi = isMultiLang(current);
  const langs = /multilingual|fifa26/i.test(current?.id || '') ? ML_LANGS : TR_LANGS;

  useEffect(() => { setLang('English'); }, [current?.id]);

  // Unique browser-tab title per story
  useEffect(() => {
    if (current?.title) document.title = `${current.title} · My Sleepy Tale`;
    return () => { document.title = 'My Sleepy Tale — Bedtime Stories for Kids'; };
  }, [current?.title]);

  // Playback — stored audio (with probe) → TTS fallback; non-English → translate + TTS
  useEffect(() => {
    if (!current) return;
    // When the Storybook view is active it owns narration (shared narrator instance),
    // so the classic player must not also start playback.
    if (storybookActive) return;
    const key = `${current.id}|${lang}|${activeVoice?.id || 'default'}`;
    if (startedRef.current === key) return;
    startedRef.current = key;

    let cancelled = false;
    const probe = (audio) => new Promise((resolve) => {
      let done = false;
      audio.oncanplay = () => { if (!done) { done = true; resolve(true); } };
      audio.onerror = () => { if (!done) { done = true; resolve(false); } };
      setTimeout(() => { if (!done) { done = true; resolve(false); } }, 5000);
    });

    (async () => {
      let audio = null;
      // A CHILD'S OWN RECORDING (kid-created story) must ALWAYS play their real
      // voice — never a cloned voice, never AI/TTS. Play the stored audio directly.
      const isKidRecording = current.isWisdom === false && !!current.audioUrl;
      if (isKidRecording) {
        audio = nar.loadCached(current.audioUrl);
      } else {
        // Cloned voice selected → regenerate generic stories in that voice
        if (activeVoice?.id && current.text) {
          try { audio = await nar.generate({ text: current.text, customVoiceId: activeVoice.id, uid: user?.uid }); } catch { /* nar.error */ }
        }
        if (!audio && !activeVoice?.id && lang === 'English' && current.audioUrl) {
          audio = nar.loadCached(current.audioUrl);
          const ok = await probe(audio);
          if (!ok || cancelled) { try { audio.pause(); audio.src = ''; audio.load(); } catch {} audio = null; }
        }
        if (!audio && current.text && !cancelled) {
          let text = current.text;
          if (lang !== 'English') {
            try {
              const r = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language: lang }) });
              if (r.ok) { const { translated } = await r.json(); if (translated) text = translated; }
            } catch { /* keep English text */ }
          }
          try { audio = await nar.generate({ text, narrator: current.voice || 'AI Narrator', language: 'English' }); } catch { /* nar.error */ }
        }
      }
      if (audio && !cancelled) {
        const go = () => audio.play?.().catch(() => {});
        audio.addEventListener('canplay', go, { once: true });
        go();
        markPlayed(current.id);
      }
    })();

    return () => { cancelled = true; nar.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, lang, activeVoice?.id, storybookActive]);

  useEffect(() => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    if (sleepMin > 0) sleepRef.current = setTimeout(() => nar.pause(), sleepMin * 60000);
    return () => { if (sleepRef.current) clearTimeout(sleepRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepMin]);

  // Cliffhanger signup gate — a GUEST is paused ~75% through and asked to sign up
  // free to hear the ending. Signed-in users are never gated; the Storybook view
  // handles its own thing so it's excluded here.
  useEffect(() => { setGated(false); }, [current?.id]);
  useEffect(() => {
    if (user || gated || storybookActive) return;
    if ((nar.progress || 0) >= GATE_AT) { setGated(true); nar.pause(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nar.progress, user, gated, storybookActive]);
  // Once the guest signs in while gated, resume right where they left off.
  useEffect(() => {
    if (user && gated) { setGated(false); nar.play(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Series "Play all" — when an episode ends and we arrived with ?series=<id>,
  // auto-advance to the next episode (top to bottom) until the series finishes.
  useEffect(() => {
    if (!nar.ended || !current) return;
    const sid = searchParams.get('series');
    if (!sid) return;
    const s = (SERIES || []).find((x) => x.id === sid);
    const eps = s?.episodes || [];
    const curId = stripId(current.id);
    const idx = eps.findIndex((e) => e.id === curId || e.id === storyId);
    if (idx >= 0 && idx < eps.length - 1) {
      navigate(`/player/${eps[idx + 1].id}?series=${sid}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nar.ended]);

  if (!current) {
    return (
      <div className="px-5 pt-20 text-center max-w-[480px] mx-auto">
        <Moon size={36} className="mx-auto mb-3" style={{ color: GOLD }} />
        <p className="text-[#B8AAC8]">{storyId ? 'Loading this story…' : 'Nothing playing yet.'}</p>
        <button onClick={() => navigate('/')} className="mt-5 rounded-full px-6 py-3 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Browse stories</button>
      </div>
    );
  }

  // Showcase story → the immersive Storybook experience (shares this narrator instance).
  if (storybookActive) {
    return <Storybook current={current} nar={nar} onClassic={() => setView('classic')} />;
  }

  const cleanId = stripId(current.id);
  const art = getStoryArt(cleanId) || {};
  const cover = current.coverImage || art.image || null;
  const tradition = TRADITIONS.find((t) => t.key === current.tradition);
  const tradArt = getTraditionArt(current.tradition);
  const dur = nar.duration || 0;
  const curT = nar.progress * dur;

  // Unique, shareable link for THIS story
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://mysleepytale.com'}/player/${cleanId}`;
  const shareStory = async () => {
    const title = current?.title ? `${current.title} · My Sleepy Tale` : 'My Sleepy Tale';
    try {
      if (navigator.share) { await navigator.share({ title, text: 'A bedtime story on My Sleepy Tale 🌙', url: shareUrl }); return; }
    } catch { return; /* user cancelled the share sheet */ }
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };

  return (
    <div className="px-5 lg:px-8 pt-5 pb-28 max-w-[520px] mx-auto">
      {/* Cliffhanger signup gate (guests only) */}
      {gated && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/80 backdrop-blur-sm px-5">
          <div className="w-full max-w-sm rounded-3xl p-6 ring-1 ring-white/10 text-center" style={{ background: '#0F1E30' }}>
            <div className="text-4xl mb-2">🌙</div>
            <h3 className="font-display text-xl text-[#F7F1E8]">The best part is coming…</h3>
            <p className="text-[13px] text-[#B8AAC8] mt-2 leading-relaxed">
              Sign up free to hear how <span className="text-[#F7F1E8]">{current.title}</span> ends — and unlock every bedtime story, even in your own voice.
            </p>
            <button onClick={() => loginGoogle && loginGoogle()} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
              Continue with Google — free
            </button>
            <button onClick={() => navigate('/')} className="mt-2 w-full rounded-full px-6 py-2.5 text-xs font-bold text-[#B8AAC8]">Maybe later</button>
            <p className="text-[11px] text-[#7A6B8A] mt-3">Free forever · no card needed</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8] active:scale-95" title="Back"><ChevronLeft size={20} /></button>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A6B8A]">Now Playing</p>
        <div className="flex items-center gap-2">
          {isStorybookStory && (
            <button onClick={() => setView('storybook')} className="flex items-center gap-1 rounded-full px-3 h-10 bg-white/[0.06] ring-1 ring-white/10 text-[11px] font-bold text-[#F6C453] active:scale-95" title="Switch to the illustrated storybook">
              <BookOpen size={14} /> Enhanced
            </button>
          )}
          <button onClick={shareStory} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#B8AAC8] active:scale-95" title="Share this story">
            {copied ? <Check size={16} style={{ color: GOLD }} /> : <Share2 size={16} />}
          </button>
          <button onClick={() => navigate('/voices')} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#B8AAC8] active:scale-95" title="Voice"><Mic size={16} /></button>
        </div>
      </div>

      <div className="mt-5 mx-auto w-full max-w-[256px] sm:max-w-[288px] aspect-square rounded-3xl overflow-hidden ring-1 ring-white/10 relative" style={{ background: art.gradient || 'linear-gradient(135deg,#243349,#0D1B2A)' }}>
        {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <span className="absolute inset-0 grid place-items-center"><Moon size={40} className="text-white/25" /></span>}
      </div>

      <div className="mt-4 text-center">
        {tradition && (<span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white/90 mb-2" style={{ background: `${tradArt.color}33` }}>{tradition.icon} {tradition.label}</span>)}
        <h1 className="font-display text-2xl text-[#F7F1E8] leading-snug">{current.title}</h1>
        {current.source && <p className="text-[12px] text-[#7A6B8A] mt-1">{current.source}</p>}
      </div>

      {multi && (
        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A6B8A] mb-2"><Globe size={12} /> Language</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {langs.map(([name, flag]) => (
              <button key={name} onClick={() => setLang(name)} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${lang === name ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10'}`} style={lang === name ? { background: GOLD } : undefined}>
                {flag} {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="h-2 rounded-full bg-white/10 cursor-pointer relative" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); nar.seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}>
          <div className="h-full rounded-full" style={{ width: `${(nar.progress || 0) * 100}%`, background: GOLD }} />
        </div>
        <div className="flex justify-between text-[11px] text-[#7A6B8A] mt-1.5">
          <span>{fmt(curT)}</span>
          <span>{dur ? fmt(dur) : (nar.loading ? 'Loading…' : '—:—')}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-7">
        <button onClick={() => nar.seekBy(-15)} className="grid h-12 w-12 place-items-center rounded-full text-[#B8AAC8] hover:text-[#F7F1E8] active:scale-95 relative"><RotateCcw size={26} strokeWidth={1.8} /><span className="absolute text-[8px] font-bold">15</span></button>
        <button onClick={() => (nar.playing ? nar.pause() : nar.resume())} className="grid h-[72px] w-[72px] place-items-center rounded-full text-[#0D1B2A] active:scale-95" style={{ background: GOLD, boxShadow: '0 10px 34px rgba(246,196,83,0.35)' }}>
          {nar.playing ? <Pause size={30} fill="#0D1B2A" /> : <Play size={30} fill="#0D1B2A" className="ml-1" />}
        </button>
        <button onClick={() => nar.seekBy(15)} className="grid h-12 w-12 place-items-center rounded-full text-[#B8AAC8] hover:text-[#F7F1E8] active:scale-95 relative"><RotateCw size={26} strokeWidth={1.8} /><span className="absolute text-[8px] font-bold">15</span></button>
      </div>

      {nar.error && <p className="mt-4 text-center text-[12px] text-[#f3727f]">{nar.error}</p>}
      {copied && <p className="mt-3 text-center text-[12px] font-bold" style={{ color: GOLD }}>🔗 Link copied — paste to share!</p>}

      {/* Read along — text on demand (kept minimal/clean like a social player) */}
      {current.text && (
        <div className="mt-6">
          <button onClick={() => setShowText((s) => !s)} className="mx-auto flex items-center gap-1.5 text-[12px] font-bold text-[#7A6B8A] hover:text-[#B8AAC8] transition">
            <BookOpen size={13} /> {showText ? 'Hide text' : 'Read along'} <ChevronDown size={13} style={{ transform: showText ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {showText && <HighlightedText text={current.text} progress={nar.progress || 0} />}
        </div>
      )}

      {/* Sleep timer — a single moon icon to save space; tap to reveal 5/10/15/20 */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative">
          <button
            onClick={() => setSleepOpen((o) => !o)}
            aria-label={sleepMin > 0 ? `Sleep timer: ${sleepMin} minutes` : 'Sleep timer'}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ring-1 transition ${sleepMin > 0 ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-white/10'}`}
            style={sleepMin > 0 ? { background: GOLD, borderColor: 'transparent' } : undefined}
          >
            <Moon size={14} />
            {sleepMin > 0 && <span>{sleepMin}m</span>}
          </button>
          {sleepOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSleepOpen(false)} />
              <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full p-1 ring-1 ring-white/10 bg-[#0F1E30] shadow-xl">
                {[0, 5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSleepMin(m); setSleepOpen(false); }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${sleepMin === m ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] hover:bg-white/[0.06]'}`}
                    style={sleepMin === m ? { background: GOLD } : undefined}
                  >
                    {m === 0 ? 'Off' : m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Karaoke-style read-along: highlights the line being narrated (driven by playback
// progress), dims past/future lines, and auto-scrolls to keep it in view. Matches
// the production player's HighlightedText, restyled for the V2 night-sky theme.
function HighlightedText({ text, progress }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const lines = (text || '').split('\n').filter((l) => l.trim());
  const totalChars = (text || '').length || 1;
  const adjusted = Math.min(1, progress || 0);

  let charsSoFar = 0;
  let activeLine = 0;
  for (let i = 0; i < lines.length; i++) {
    charsSoFar += lines[i].length + 1; // +1 for the newline
    if (charsSoFar / totalChars > adjusted) { activeLine = i; break; }
    if (i === lines.length - 1) activeLine = i;
  }

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const c = containerRef.current;
      const a = activeRef.current;
      const cr = c.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      if (ar.top > cr.bottom - 80 || ar.bottom < cr.top + 20) {
        c.scrollTo({ top: a.offsetTop - c.offsetTop - c.clientHeight / 3, behavior: 'smooth' });
      }
    }
  }, [activeLine]);

  return (
    <div ref={containerRef} className="mt-3 max-h-[42vh] overflow-y-auto rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 font-display text-[15px] leading-[1.9]">
      {lines.map((line, i) => {
        const isActive = i === activeLine;
        const isPast = i < activeLine;
        return (
          <p
            key={i}
            ref={isActive ? activeRef : null}
            className="mb-3 rounded-lg px-2.5 py-1.5 transition-all duration-500"
            style={
              isActive
                ? { background: 'rgba(246,196,83,0.12)', boxShadow: 'inset 0 0 0 1.5px rgba(246,196,83,0.55)', color: '#F7F1E8' }
                : isPast
                  ? { color: '#B8AAC8' }
                  : { color: '#6B5F7A' }
            }
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}
