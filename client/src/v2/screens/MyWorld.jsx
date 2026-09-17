// V2 My World — the child's PRIVATE gallery of creations (family-only, no public feed).
// Lists real kidStories via kid-story-save (action:list). Empty state invites the first.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Wand2, Heart, Play, X, Share2, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { GOLD } from '../ui.js';

export default function MyWorld() {
  const navigate = useNavigate();
  const { user, loginGoogle } = useAuth();
  const { profile } = useFamilyProfile();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;

  const [stories, setStories] = useState(null); // null = loading
  const [open, setOpen] = useState(null); // selected story for lightbox
  const [copied, setCopied] = useState(false);

  const publishAndShare = async (story) => {
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
    const liked = (story.likedBy || []).includes(user.uid);
    const nextAction = liked ? 'unlike' : 'like';
    // optimistic
    const upd = (s) => ({ ...s, likes: (s.likes || 0) + (liked ? -1 : 1), likedBy: liked ? (s.likedBy || []).filter((u) => u !== user.uid) : [...(s.likedBy || []), user.uid] });
    setOpen((o) => (o && o.id === story.id ? upd(o) : o));
    setStories((list) => (list || []).map((s) => (s.id === story.id ? upd(s) : s)));
    try { await fetch('/api/kid-story-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: nextAction, storyId: story.id, uid: user.uid }) }); } catch {}
  };

  const deleteStory = async (story) => {
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    setStories((list) => (list || []).filter((s) => s.id !== story.id));
    setOpen(null);
    try { await fetch('/api/kid-story-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', parentUid: user.uid, storyId: story.id }) }); } catch {}
  };

  useEffect(() => {
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

  // Signed out
  if (!user) {
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

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10 pb-28 max-w-[760px]">
      {Head}

      {stories === null ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : stories.length === 0 ? (
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
            <p className="text-[13px] text-[#B8AAC8]"><span className="font-bold text-[#F7F1E8]">{stories.length}</span> {stories.length === 1 ? 'story' : 'stories'} in your world 🌟</p>
            <button onClick={() => navigate('/v2/build')} className="rounded-full px-4 py-2 text-xs font-bold text-[#0D1B2A]" style={{ background: GOLD }}>＋ New story</button>
          </div>
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
                <p className="text-[11px] text-white/60">🎙️ In {name || 'their'} own voice{open.audioUrl ? '' : ''}</p>
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
