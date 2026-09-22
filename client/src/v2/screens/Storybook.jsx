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
import { ChevronLeft, Play, Pause, BookOpen, Sparkles, Share2, Check, Mic } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getActiveVoice } from '../voice.js';
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
  const flipLockRef = useRef(false); // blocks overlapping auto-flips during the animation
  const autoFlipRef = useRef(false); // marks a flip as automatic so onFlip won't seek

  // On a wide screen react-pageflip shows a 2-page spread; on a phone it's 1 page.
  // In spread mode the two pages of a scene share ONE illustration split across both
  // (a panorama), instead of repeating the image twice.
  const [isSpread, setIsSpread] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(min-width: 920px)').matches : false));
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 920px)');
    const on = () => setIsSpread(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on); };
  }, []);

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
  const [copied, setCopied] = useState(false);
  const [activeVoice] = useState(getActiveVoice()); // a chosen cloned family voice, if any
  const startedRef = useRef(false);

  // Share the story (same link as the classic player, so both formats share one URL).
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://mysleepytale.com'}/player/universal_garden_of_mistakes`;
  const shareStory = async () => {
    const title = current?.title ? `${current.title} · My Sleepy Tale` : 'My Sleepy Tale';
    try {
      if (navigator.share) { await navigator.share({ title, url: shareUrl }); return; }
    } catch { /* fall through to copy */ }
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

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
      // If the family picked a cloned voice, read the story in it — using the more
      // human multilingual model (not the faster/robotic turbo). Otherwise use the
      // expressive v3 default narrator. Each chain falls back gracefully.
      const attempts = activeVoice?.id
        ? [
            { customVoiceId: activeVoice.id, model: 'eleven_multilingual_v2' }, // cloned, more human
            { customVoiceId: activeVoice.id },                                  // cloned, default model
            { model: 'eleven_v3', elevenVoice: 'george' },                     // fall back to v3 narrator
            { narrator: 'AI Narrator', language: 'English' },                  // classic OpenAI TTS
          ]
        : [
            { model: 'eleven_v3', elevenVoice: 'george' },            // most human default
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
  // Guards that prevent the erratic flip-forward-then-back bug:
  //  • only while actually playing, with finite positive progress (no NaN-at-load jump);
  //  • flipLock so we never issue a new flip while the 800ms animation is running;
  //  • autoFlip marker so onFlip knows this turn was automatic and must NOT seek the
  //    audio (an auto-flip that seeks would jump progress → trigger another flip →
  //    cascade). Advance exactly ONE page via flipNext().
  useEffect(() => {
    if (!autoTurn || voiceState !== 'ready' || !nar.playing) return;
    const p = nar.progress;
    if (!Number.isFinite(p) || p <= 0) return;
    if (flipLockRef.current) return;
    // In spread mode two pages are visible, so only advance once the audio passes BOTH.
    const perView = isSpread ? 2 : 1;
    if (pageForProgress(p) >= page + perView) {
      flipLockRef.current = true;
      autoFlipRef.current = true;
      try { bookRef.current?.pageFlip()?.flipNext(); } catch { autoFlipRef.current = false; }
      setTimeout(() => { flipLockRef.current = false; }, 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nar.progress, autoTurn, voiceState, nar.playing, page, isSpread]);

  const onFlip = (e) => {
    const idx = e?.data ?? 0;
    setPage(idx);
    // An AUTO flip: just record the page and stop (no seek).
    if (autoFlipRef.current) { autoFlipRef.current = false; return; }
    // A MANUAL turn = the reader wants to browse. Keep the audio playing exactly where
    // it is (no seek → no restart) and switch auto-turn OFF so it doesn't yank them
    // back to the audio's page. They can re-enable auto-turn with the toggle.
    setAutoTurn(false);
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
        <button onClick={goBack} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8]" title="Back"><ChevronLeft size={18} /></button>
        <h1 className="font-display text-[15px] lg:text-lg text-[#F7F1E8] truncate px-2 flex-1 text-center">{current?.title}</h1>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={shareStory} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#B8AAC8]" title="Share this story">
            {copied ? <Check size={15} style={{ color: GOLD }} /> : <Share2 size={15} />}
          </button>
          <button onClick={() => navigate(`/voices?returnTo=${encodeURIComponent('/player/universal_garden_of_mistakes')}`)} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#B8AAC8]" title="Choose a voice">
            <Mic size={15} />
          </button>
          <button onClick={onClassic} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10" title="Switch to the classic player"><BookOpen size={12} /> Classic</button>
        </div>
      </header>

      {/* The book */}
      <div className="flex-1 grid place-items-center py-4 select-none">
        {pages.length > 0 && (
          <HTMLFlipBook
            ref={bookRef}
            width={380}
            height={480}
            size="stretch"
            minWidth={300}
            maxWidth={440}
            minHeight={400}
            maxHeight={520}
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport
            drawShadow
            flippingTime={800}
            useMouseEvents
            disableFlipByClick
            swipeDistance={40}
            showPageCorners={false}
            className="storybook"
            onFlip={onFlip}
          >
            {pages.map((pg, i) => (
              <Page
                key={i}
                index={i}
                total={pages.length}
                text={pg.text}
                img={pg.img}
                cover={current?.coverImage}
                spreadSide={isSpread ? (i % 2 === 0 ? 'left' : 'right') : 'full'}
              />
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

// A single storybook page — scene illustration on top, text below (vertically centred
// so short paragraphs don't leave a big blank box). forwardRef is required by
// react-pageflip. In a 2-page spread the shared scene image is split across the two
// pages (spreadSide left/right) so it reads as ONE panorama, not a repeat.
const Page = forwardRef(function Page({ index, total, text, img, cover, spreadSide = 'full' }, ref) {
  const [failed, setFailed] = useState(false);
  const url = failed ? (cover || null) : img;
  // Panorama halves via background positioning; 'full' shows the whole image.
  const imgStyle = url
    ? spreadSide === 'full'
      ? { backgroundImage: `url("${url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundImage: `url("${url}")`, backgroundSize: '200% 100%', backgroundPosition: spreadSide === 'left' ? 'left center' : 'right center' }
    : {};
  // Auto-fit: text-heavy pages (e.g. two long paragraphs) shrink the font a little and
  // give the image slightly less height, so the text fits without an in-page scroll.
  const len = String(text).length;
  const heavy = len > 260;
  const imgH = heavy ? '50%' : len > 170 ? '55%' : '60%';
  const fontPx = heavy ? 13.5 : len > 170 ? 14.5 : 16;
  // Keep any residual scroll (very long pages) from being eaten by the flip gesture.
  const stop = (e) => e.stopPropagation();
  return (
    <div ref={ref} className="storybook-page h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ background: 'linear-gradient(160deg,#16233a,#0D1B2A)' }}>
      <div className="flex h-full flex-col">
        {/* Illustration — height adapts to how much text the page carries */}
        <div className="relative w-full shrink-0" style={{ height: imgH, background: 'linear-gradient(135deg,#243b6b,#5b3aa0)', ...imgStyle }}>
          {!url && <div className="grid h-full w-full place-items-center text-4xl">🌱</div>}
          {url && !failed && <img src={url} alt="" className="hidden" onError={() => setFailed(true)} />}
        </div>
        {/* Text — centred, auto-sized to fit */}
        <div className="flex-1 flex flex-col justify-center px-5 py-3 space-y-2 overflow-y-auto" onTouchMove={stop} onWheel={stop}>
          {String(text).split(/\n\s*\n/).filter(Boolean).map((para, k) => (
            <p key={k} className="font-display text-[#F7F1E8]" style={{ fontSize: `${fontPx}px`, lineHeight: 1.5 }}>{para}</p>
          ))}
        </div>
        <div className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A6B8A]">{index + 1} / {total}</div>
      </div>
    </div>
  );
});
