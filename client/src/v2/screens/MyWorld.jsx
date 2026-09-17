// V2 My World — the child's PRIVATE, GROWING world of creations (family-only, no public feed).
// Two views: an animated night-sky CONSTELLATION (each story = a glowing star on a trail that
// grows every night) and a plain Grid. Lists real kidStories via kid-story-save (action:list).
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Wand2, Heart, Play, X, Share2, Check, Trash2, Sparkles, LayoutGrid, Orbit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { GOLD } from '../ui.js';

// Deterministic, pleasing scatter so a star always sits in the same place.
const XPATTERN = [50, 30, 68, 40, 72, 34, 62, 46];
function orbPos(i) {
  const h = (i * 2654435761) >>> 0;      // Knuth multiplicative hash → stable jitter
  const jitter = (h % 13) - 6;           // -6..6 %
  const x = Math.max(15, Math.min(82, XPATTERN[i % XPATTERN.length] + jitter));
  const y = 60 + i * 118;                // trail flows downward as the world grows
  return { x, y };
}

// Self-contained kid-drawing look for the ?demo preview (no network, never 404s).
function demoStar(emoji, c1, c2) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='300' height='300' fill='url(#g)'/><text x='150' y='198' font-size='150' text-anchor='middle'>${emoji}</text></svg>`;
  // base64 (UTF-8 safe for emoji) — avoids the '#' fragment problem in raw data URIs
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
const DEMO_STORIES = [
  { id: 'demo1', storyId: 'demo1', title: 'My Flying Car', promptImageUrl: demoStar('🚗', '#5B8CFF', '#8E5BFF'), likes: 3, plays: 12 },
  { id: 'demo2', storyId: 'demo2', title: 'Rainbow Dragon', promptImageUrl: demoStar('🐉', '#FF7EB6', '#FFB35B'), likes: 5, plays: 20 },
  { id: 'demo3', storyId: 'demo3', title: 'Moon Picnic', promptImageUrl: demoStar('🌙', '#2B2E63', '#6E4BC9'), likes: 2, plays: 7 },
  { id: 'demo4', storyId: 'demo4', title: 'Underwater City', promptImageUrl: demoStar('🐠', '#1FA2A6', '#2B6EE0'), likes: 4, plays: 15 },
  { id: 'demo5', storyId: 'demo5', title: 'Robot Best Friend', promptImageUrl: demoStar('🤖', '#7A8CA6', '#3A4A63'), likes: 1, plays: 4 },
  { id: 'demo6', storyId: 'demo6', title: 'Candy Mountain', promptImageUrl: demoStar('🍭', '#FF8FD0', '#FF5B8C'), likes: 6, plays: 22 },
  { id: 'demo7', storyId: 'demo7', title: 'Space Puppy', promptImageUrl: demoStar('🐶', '#3A2C6B', '#5B8CFF'), likes: 3, plays: 9 },
];

export default function MyWorld() {
  const navigate = useNavigate();
  const { user, loginGoogle } = useAuth();
  const { profile } = useFamilyProfile();
  const demo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');
  const name = (profile?.childName && profile.childName !== 'little one' ? profile.childName : null) || (demo ? 'Aria' : null);

  const [stories, setStories] = useState(null); // null = loading
  const [open, setOpen] = useState(null); // selected story for lightbox
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState('world'); // 'world' (animated) | 'grid'

  const publishAndShare = async (story) => {
    if (!user) return; // demo/preview — no-op
    const id = story.id;
    // Publish (family/approved) so the link resolves + shows THIS story's picture as
    // the preview. Share the /api/share link → unique per-story OG image (not generic).
    try {
      await fetch('/api/kid-story-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', parentUid: user.uid, storyId: id, visibility: 'family' }),
      });
    } catch {}
    const url = `${window.location.origin}/api/share?id=${id}`;
    try { if (navigator.share) { await navigator.share({ title: story.title || 'My story', text: 'Listen to my story 🌙', url }); return; } } catch { return; }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const toggleLike = async (story) => {
    if (!user) return; // demo/preview — no-op
    const liked = (story.likedBy || []).includes(user.uid);
    const nextAction = liked ? 'unlike' : 'like';
    // optimistic
    const upd = (s) => ({ ...s, likes: (s.likes || 0) + (liked ? -1 : 1), likedBy: liked ? (s.likedBy || []).filter((u) => u !== user.uid) : [...(s.likedBy || []), user.uid] });
    setOpen((o) => (o && o.id === story.id ? upd(o) : o));
    setStories((list) => (list || []).map((s) => (s.id === story.id ? upd(s) : s)));
    try { await fetch('/api/kid-story-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: nextAction, storyId: story.id, uid: user.uid }) }); } catch {}
  };

  const deleteStory = async (story) => {
    if (!user) return; // demo/preview — no-op
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    setStories((list) => (list || []).filter((s) => s.id !== story.id));
    setOpen(null);
    try { await fetch('/api/kid-story-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', parentUid: user.uid, storyId: story.id }) }); } catch {}
  };

  useEffect(() => {
    if (demo) { setStories(DEMO_STORIES); return; } // ?demo → preview the world with sample stars
    if (!user) { setStories([]); return; }
    fetch('/api/kid-story-save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', parentUid: user.uid }),
    })
      .then((r) => r.json())
      .then((d) => setStories(Array.isArray(d.stories) ? d.stories : []))
      .catch(() => setStories([]));
  }, [user]);

  const Head = (
    <header>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]"><Lock size={12} /> Private — family only</p>
      <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">{name ? `${name}'s World` : 'Your World'}</h1>
    </header>
  );

  // Signed out (demo bypasses so you can preview the world without an account)
  if (!user && !demo) {
    return (
      <div className="px-5 lg:px-8 pt-7 lg:pt-10 max-w-[520px]">
        {Head}
        <div className="mt-6 rounded-3xl p-6 ring-1 ring-white/10 bg-white/[0.05] text-center">
          <Star size={40} style={{ color: GOLD }} fill={GOLD} className="mx-auto mb-3 opacity-90" />
          <p className="font-display text-lg text-[#F7F1E8]">Your world lives here</p>
          <p className="text-[13px] text-[#B8AAC8] mt-1">Sign in to keep every story your child makes — private to your family.</p>
          <button onClick={() => loginGoogle && loginGoogle()} className="mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Continue with Google</button>
        </div>
      </div>
    );
  }

  const n = stories?.length || 0;

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10 pb-28 max-w-[760px]">
      {/* self-contained animations so we don't touch global config */}
      <style>{`
        @keyframes mwFloat { 0%,100%{ transform: translate(-50%, 0); } 50%{ transform: translate(-50%, -9px); } }
        @keyframes mwPulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(246,196,83,0.45), 0 8px 26px rgba(246,196,83,0.30); } 50%{ box-shadow: 0 0 0 10px rgba(246,196,83,0), 0 8px 30px rgba(246,196,83,0.45); } }
        @keyframes mwDash { to { stroke-dashoffset: -60; } }
        @media (prefers-reduced-motion: reduce){ .mw-orb, .mw-line { animation: none !important; } }
      `}</style>

      <div className="flex items-start justify-between gap-3">
        {Head}
        {n > 0 && (
          <div className="mt-1 flex rounded-full bg-white/[0.06] p-0.5 ring-1 ring-white/10 shrink-0">
            <ToggleBtn active={view === 'world'} onClick={() => setView('world')} icon={Orbit} label="World" />
            <ToggleBtn active={view === 'grid'} onClick={() => setView('grid')} icon={LayoutGrid} label="Grid" />
          </div>
        )}
      </div>

      {stories === null ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : n === 0 ? (
        <section className="mt-6 max-w-[560px]">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10" style={{ height: 300, background: 'radial-gradient(120% 90% at 50% 8%, #1F1450 0%, #0D1B2A 58%, #070A19 100%)' }}>
            {[[18, 26], [72, 20], [46, 52], [83, 60], [28, 74], [62, 80], [13, 58]].map(([x, y], i) => (
              <span key={i} className="absolute animate-twinkle" style={{ left: `${x}%`, top: `${y}%` }}><Star size={11} className="text-white/40" fill="currentColor" /></span>
            ))}
            <div className="absolute inset-0 grid place-items-center text-center px-10">
              <div>
                <Star size={44} strokeWidth={1.5} style={{ color: GOLD }} fill={GOLD} className="mx-auto mb-4 opacity-90" />
                <p className="font-display text-xl text-white">Your first star awaits</p>
                <p className="text-[13px] text-white/65 mt-1.5 leading-relaxed">Every story you make lights up a new star. Your sky grows a little every night.</p>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/v2/build')} className="mt-5 w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD, boxShadow: '0 10px 30px rgba(246,196,83,0.28)' }}>
            <Wand2 size={17} strokeWidth={2.2} /> Make my first story
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#7A6B8A] mt-6"><Heart size={12} /> Private — family only, no public feed.</p>
        </section>
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[13px] text-[#B8AAC8]">
              <span className="font-bold text-[#F7F1E8]">{n}</span> {n === 1 ? 'star' : 'stars'} in {name ? `${name}'s` : 'your'} sky
              <span className="text-[#7A6B8A]"> · growing 🌱</span>
            </p>
            <button onClick={() => navigate('/v2/build')} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#0D1B2A]" style={{ background: GOLD }}><Wand2 size={13} strokeWidth={2.4} /> New</button>
          </div>

          {view === 'world' ? (
            <WorldSky stories={stories} name={name} onOpen={setOpen} />
          ) : (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stories.map((s) => {
                const thumb = s.promptImageUrl || s.coverImage || null;
                return (
                  <button key={s.storyId || s.id} onClick={() => setOpen(s)} className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 active:scale-95 transition group text-left" style={{ background: 'linear-gradient(135deg,#243349,#0D1B2A)' }}>
                    {thumb ? <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="absolute inset-0 grid place-items-center"><Star size={22} className="text-white/25" /></span>}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(7,10,25,0.85) 100%)' }} />
                    {s.videoUrl && <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 backdrop-blur-sm"><Play size={12} className="text-white" fill="white" /></span>}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{s.title || 'My story'}</p>
                      {(s.plays || s.likes) ? <p className="text-[9px] text-white/60 mt-0.5">▶ {s.plays || 0} · ♥ {s.likes || 0}</p> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#7A6B8A] mt-6"><Lock size={11} /> Private — family only. Share with Grandma by invite (coming soon).</p>
        </>
      )}

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 backdrop-blur-sm px-5" onClick={() => setOpen(null)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-3xl overflow-hidden ring-1 ring-white/15 aspect-square bg-black">
              {open.videoUrl ? (
                <video src={open.videoUrl} className="h-full w-full object-cover" autoPlay loop playsInline controls />
              ) : open.promptImageUrl ? (
                <img src={open.promptImageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-display text-lg text-white truncate">{open.title || 'My story'}</p>
                <p className="text-[11px] text-white/60">🎙️ In {name || 'their'} own voice</p>
              </div>
              <button onClick={() => setOpen(null)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white shrink-0"><X size={18} /></button>
            </div>
            {open.audioUrl && !open.videoUrl && (
              <audio src={open.audioUrl} controls autoPlay className="mt-3 w-full" />
            )}
            {/* Like + Delete */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => toggleLike(open)}
                className="flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ring-1 transition"
                style={(open.likedBy || []).includes(user?.uid) ? { background: 'rgba(243,114,127,0.15)', borderColor: 'rgba(243,114,127,0.4)', color: '#f3727f' } : { borderColor: 'rgba(255,255,255,0.15)', color: '#B8AAC8' }}
              >
                <Heart size={16} fill={(open.likedBy || []).includes(user?.uid) ? '#f3727f' : 'none'} /> {open.likes || 0}
              </button>
              <button onClick={() => deleteStory(open)} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-[#f3727f]/30 text-[#f3727f] active:scale-95" title="Delete story"><Trash2 size={16} /></button>
            </div>
            <button
              onClick={() => publishAndShare(open)}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#0D1B2A]"
              style={{ background: GOLD }}
            >
              {copied ? <><Check size={16} /> Link copied!</> : <><Share2 size={16} /> Share with family</>}
            </button>
            <p className="mt-2 text-center text-[10px] text-[#7A6B8A]">Anyone with the link can listen — no public feed.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${active ? 'text-[#0D1B2A]' : 'text-[#B8AAC8]'}`} style={active ? { background: GOLD } : undefined}>
      <Icon size={13} strokeWidth={2.2} /> {label}
    </button>
  );
}

// Animated night sky: a wandering constellation trail that grows with every creation.
function WorldSky({ stories, name, onOpen }) {
  const positions = stories.map((_, i) => orbPos(i));
  const lastY = positions.length ? positions[positions.length - 1].y : 60;
  const totalH = lastY + 170;
  // background twinkle field — deterministic
  const bg = [];
  for (let i = 0; i < 46; i++) {
    const h = ((i + 3) * 2654435761) >>> 0;
    bg.push({ x: (h % 100), y: ((h >> 7) % 100), s: 1 + ((h >> 3) % 3), d: (h % 40) / 10 });
  }

  return (
    <div className="mt-4 relative rounded-3xl overflow-hidden ring-1 ring-white/10"
      style={{ height: totalH, background: 'radial-gradient(120% 60% at 50% -6%, #241452 0%, #12173A 44%, #070A19 100%)' }}>

      {/* crescent moon */}
      <div className="absolute" style={{ right: 22, top: 20, width: 40, height: 40, borderRadius: '50%', boxShadow: 'inset -11px 6px 0 0 #F6E7B8', filter: 'drop-shadow(0 0 16px rgba(246,196,83,0.35))', opacity: 0.9 }} />

      {/* background stars */}
      {bg.map((st, i) => (
        <span key={i} className="absolute animate-twinkle" style={{ left: `${st.x}%`, top: `${(st.y / 100) * totalH}px`, animationDelay: `${st.d}s` }}>
          <span style={{ display: 'block', width: st.s, height: st.s, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
        </span>
      ))}

      {/* constellation trail connecting the creations */}
      {positions.length > 1 && (
        <svg className="absolute inset-0" width="100%" height={totalH} viewBox={`0 0 100 ${totalH}`} preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
          <polyline
            className="mw-line"
            points={positions.map((p, i) => `${p.x},${p.y + orbSize(i) / 2}`).join(' ')}
            fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1"
            strokeDasharray="1.4 5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            style={{ animation: 'mwDash 3s linear infinite' }}
          />
        </svg>
      )}

      {/* the creation stars */}
      {stories.map((s, i) => {
        const p = positions[i];
        const size = orbSize(i);
        const thumb = s.promptImageUrl || s.coverImage || null;
        const isNewest = i === 0;
        return (
          <button
            key={s.storyId || s.id}
            onClick={() => onOpen(s)}
            className="mw-orb group absolute active:scale-90 transition"
            style={{
              left: `${p.x}%`, top: p.y, width: size, height: size,
              animation: `mwFloat ${4.5 + (i % 4) * 0.6}s ease-in-out ${(i % 5) * 0.4}s infinite`,
            }}
            aria-label={s.title || 'My story'}
          >
            <span className="block h-full w-full rounded-full overflow-hidden ring-2"
              style={{
                borderColor: 'transparent', boxShadow: isNewest ? undefined : '0 6px 22px rgba(0,0,0,0.45), 0 0 16px rgba(246,196,83,0.25)',
                animation: isNewest ? 'mwPulse 2.4s ease-in-out infinite' : undefined,
                outline: `2px solid ${isNewest ? GOLD : 'rgba(246,196,83,0.55)'}`,
              }}>
              {thumb
                ? <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                : <span className="grid h-full w-full place-items-center" style={{ background: 'linear-gradient(135deg,#243349,#0D1B2A)' }}><Star size={18} className="text-white/40" fill="currentColor" /></span>}
            </span>
            {/* video sparkle badge */}
            {s.videoUrl && <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#0D1B2A] ring-1 ring-white/20"><Play size={10} className="text-white" fill="white" /></span>}
            {isNewest && <span className="absolute -top-2 left-1/2 -translate-x-1/2"><Sparkles size={14} style={{ color: GOLD }} /></span>}
            {/* title label */}
            <span className="absolute left-1/2 -translate-x-1/2 mt-1.5 top-full whitespace-nowrap text-[10px] font-semibold text-white/85"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {(s.title || 'My story').length > 18 ? (s.title || 'My story').slice(0, 17) + '…' : (s.title || 'My story')}
            </span>
          </button>
        );
      })}

      {/* horizon caption at the growing edge */}
      <div className="absolute left-0 right-0 text-center" style={{ top: lastY + 74 }}>
        <p className="text-[11px] text-white/45">✨ Make another to light up a new star ✨</p>
      </div>
    </div>
  );
}

function orbSize(i) { return i === 0 ? 76 : 58; }
