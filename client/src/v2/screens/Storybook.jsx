// Storybook — immersive page-turning experience for a SINGLE showcase story
// ("The Garden Where Mistakes Grew Flowers"). One paragraph per page, a scene
// illustration per page (4 scenes across the story), a real page-turn animation,
// and expressive ElevenLabs v3 narration with the pages auto-turning in sync.
//
// Strictly scoped: V2Player only renders this for STORYBOOK_STORY_ID. Every other
// story uses the normal player untouched. Uses the narrator instance passed from
// V2Player so the "one audio at a time" rule holds.
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, Play, Pause, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { GOLD } from '../ui.js';

// 4 scene illustrations mapped across the 11 paragraphs. These are generated in the
// "Brave Moments" house style and uploaded to S3; until then each falls back to the
// story cover via onError. Kept here (not in Firestore) to stay fully self-contained.
const SCENE_BASE = 'https://mysleepytale.com/media/stories/garden';
const SCENES = [`${SCENE_BASE}/scene1.jpg`, `${SCENE_BASE}/scene2.jpg`, `${SCENE_BASE}/scene3.jpg`, `${SCENE_BASE}/scene4.jpg`];
// The 11 paragraphs are shown across 8 screens — 2 screens per scene image.
// PAGE_GROUPS lists the paragraph indices grouped onto each screen; PAGE_SCENE maps
// each screen to its image (2 screens per image → 0,0,1,1,2,2,3,3).
const PAGE_GROUPS = [[0], [1], [2], [3, 4], [5], [6, 7], [8], [9, 10]];
const PAGE_SCENE = [0, 0, 1, 1, 2, 2, 3, 3];

const AUTOTURN_KEY = 'mst:storybook:autoturn';

export default function Storybook({ current, nar, onClassic }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookRef = useRef(null);

  const paragraphs = useMemo(
    () => String(current?.text || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    [current?.text]
  );

  // Build the screens. For the 11-paragraph showcase story we group into 8 screens
  // (2 per image). If the text ever changes shape, fall back to one paragraph per
  // screen with the 4 images spread evenly — so it never breaks.
  const pages = useMemo(() => {
    if (paragraphs.length === 11) {
      return PAGE_GROUPS.map((g, i) => ({
        text: g.map((j) => paragraphs[j]).filter(Boolean).join('\n\n'),
        img: SCENES[PAGE_SCENE[i]],
      }));
    }
    const n = paragraphs.length || 1;
    return paragraphs.map((t, i) => ({ text: t, img: SCENES[Math.min(3, Math.floor((i / n) * 4))] }));
  }, [paragraphs]);

  // Screen boundaries as fractions of the whole narration (by text length), so we can
  // auto-turn on audio progress and seek on manual turns.
  const boundaries = useMemo(() => {
    const total = pages.reduce((n, p) => n + p.text.length, 0) || 1;
    const out = [];
    let acc = 0;
    for (const p of pages) { out.push(acc / total); acc += p.text.length; }
    out.push(1);
    return out;
  }, [pages]);

  const [page, setPage] = useState(0);
  const [autoTurn, setAutoTurn] = useState(() => {
    try { return localStorage.getItem(AUTOTURN_KEY) !== '0'; } catch { return true; }
  });
  const [voiceState, setVoiceState] = useState('loading'); // loading · ready · error
  const startedRef = useRef(false);

  const pageForProgress = (p) => {
    for (let i = 0; i < pages.length; i++) {
      if (p >= boundaries[i] && p < boundaries[i + 1]) return i;
    }
    return pages.length - 1;
  };

  // ── Start expressive narration once, with graceful fallback ──
  useEffect(() => {
    if (startedRef.current || !current?.text) return;
    startedRef.current = true;
    let cancelled = false;
    (async () => {
      setVoiceState('loading');
      const attempts = [
        { model: 'eleven_v3', elevenVoice: 'george' },            // most human
        { model: 'eleven_multilingual_v2', elevenVoice: 'george' }, // fallback quality
        { narrator: 'AI Narrator', language: 'English' },           // classic OpenAI TTS
      ];
      for (const a of attempts) {
        try {
          const audio = await nar.generate({ text: current.text, uid: user?.uid, ...a });
          if (cancelled) return;
          if (audio) { nar.play(); setVoiceState('ready'); return; }
        } catch { /* try next */ }
      }
      if (!cancelled) setVoiceState('error'); // pages still fully readable without audio
    })();
    return () => { cancelled = true; nar.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  // ── Auto-turn: follow the narration ──
  useEffect(() => {
    if (!autoTurn || voiceState !== 'ready') return;
    const idx = pageForProgress(nar.progress || 0);
    if (idx !== page) { try { bookRef.current?.pageFlip()?.flip(idx); } catch { /* ignore */ } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nar.progress, autoTurn, voiceState]);

  const onFlip = (e) => {
    const idx = e?.data ?? 0;
    setPage(idx);
    // A manual turn (page differs from where the audio is) seeks the voice to match.
    if (voiceState === 'ready' && idx !== pageForProgress(nar.progress || 0)) {
      nar.seek(boundaries[idx]);
    }
  };

  const toggleAuto = () => {
    setAutoTurn((a) => { const n = !a; try { localStorage.setItem(AUTOTURN_KEY, n ? '1' : '0'); } catch {} return n; });
  };
  const togglePlay = () => { if (nar.playing) nar.pause(); else nar.play(); };
  const goBack = () => { if (window.history.length > 1) navigate(-1); else navigate('/'); };

  return (
    <div className="min-h-[100dvh] px-4 pt-5 pb-6 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-2">
        <button onClick={goBack} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8]"><ChevronLeft size={18} /></button>
        <h1 className="font-display text-[15px] lg:text-lg text-[#F7F1E8] truncate px-2">{current?.title}</h1>
        <button onClick={onClassic} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10"><BookOpen size={12} /> Classic</button>
      </header>

      {/* The book */}
      <div className="flex-1 grid place-items-center py-4 select-none">
        {pages.length > 0 && (
          <HTMLFlipBook
            ref={bookRef}
            width={360}
            height={560}
            size="stretch"
            minWidth={280}
            maxWidth={460}
            minHeight={440}
            maxHeight={680}
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport
            drawShadow
            flippingTime={800}
            useMouseEvents
            className="storybook"
            onFlip={onFlip}
          >
            {pages.map((pg, i) => (
              <Page key={i} index={i} total={pages.length} text={pg.text} img={pg.img} cover={current?.coverImage} />
            ))}
          </HTMLFlipBook>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={togglePlay}
          disabled={voiceState === 'loading'}
          className="grid h-14 w-14 place-items-center rounded-full text-[#0D1B2A] disabled:opacity-60"
          style={{ background: GOLD }}
          aria-label={nar.playing ? 'Pause' : 'Play'}
        >
          {voiceState === 'loading'
            ? <Sparkles size={22} className="animate-pulse" />
            : nar.playing ? <Pause size={24} fill="#0D1B2A" /> : <Play size={24} fill="#0D1B2A" className="ml-0.5" />}
        </button>
        <button
          onClick={toggleAuto}
          className={`rounded-full px-3.5 py-2 text-[12px] font-bold ring-1 transition ${autoTurn ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-white/10'}`}
          style={autoTurn ? { background: GOLD, borderColor: 'transparent' } : undefined}
        >
          Auto-turn {autoTurn ? 'on' : 'off'}
        </button>
      </div>
      <p className="text-center text-[11px] text-[#7A6B8A] mt-2">
        Page {page + 1} of {pages.length}
        {voiceState === 'loading' && ' · weaving the voice…'}
        {voiceState === 'error' && ' · tap a page to turn'}
      </p>
    </div>
  );
}

// A single storybook page — scene image on top, paragraph below. forwardRef is
// required by react-pageflip. Image falls back to the story cover, then a gradient.
const Page = forwardRef(function Page({ index, total, text, img, cover }, ref) {
  const [src, setSrc] = useState(img);
  const [failed, setFailed] = useState(false);
  return (
    <div ref={ref} className="storybook-page h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ background: 'linear-gradient(160deg,#16233a,#0D1B2A)' }}>
      <div className="flex h-full flex-col">
        <div className="relative w-full" style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg,#243b6b,#5b3aa0)' }}>
          {!failed && src ? (
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              onError={() => { if (src !== cover && cover) setSrc(cover); else setFailed(true); }}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl">🌱</div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {String(text).split(/\n\s*\n/).filter(Boolean).map((para, k) => (
            <p key={k} className="font-display text-[16px] leading-relaxed text-[#F7F1E8]">{para}</p>
          ))}
        </div>
        <div className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A6B8A]">{index + 1} / {total}</div>
      </div>
    </div>
  );
});
