// V2 Listen — browse & play Stories + Series. Committed night-sky look.
// Free/generic audio ("little one"); child's NAME shown in TEXT for free.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Flame, Play, Star, Sparkles, Library, Moon } from 'lucide-react';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { playLesson } from '../../utils/storyHelpers.js';
import { getStoryArt } from '../../utils/storyArt.js';
import { SERIES } from '../../data/series.js';
import { GOLD } from '../ui.js';

function art(id, imageUrls) {
  const a = getStoryArt(id) || {};
  return {
    img: imageUrls?.[id] || a.image || null,
    gradient: a.gradient || 'linear-gradient(135deg,#243349 0%,#0D1B2A 100%)',
  };
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ListenHome() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { allLessons, wisdomImageUrls, wisdomAudioUrls, loading } = useWisdomData();
  const { load } = usePlayer();
  const { user } = useAuth();

  const childName = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;
  const streak = Number((typeof localStorage !== 'undefined' && localStorage.getItem('mst:streak')) || 1);

  const stories = useMemo(() => (allLessons || []).filter((l) => l && l.body && l.title).slice(0, 14), [allLessons]);
  const series = useMemo(() => (SERIES || []).filter((s) => !s.comingSoon && s.episodes?.length), []);
  const tonight = series[0];
  const highlights = useMemo(() => series.slice(0, 6), [series]);

  const playStory = (l) => playLesson(l, profile, wisdomAudioUrls || {}, load, navigate, user);
  const seriesCover = (s) => (s.episodes || []).map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean);

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10">
      {/* Header */}
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">{greeting()}</p>
        <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">
          A story for <span style={{ color: GOLD }}>{childName || 'little one'}</span>
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => navigate('/v2/profile')}
            className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-[#B8AAC8] ring-1 ring-white/10 hover:ring-white/20 transition"
          >
            <Mic size={13} strokeWidth={2} /> Playing in: <span className="text-[#F7F1E8]">Default</span>
          </button>
          <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold ring-1" style={{ color: GOLD, background: 'rgba(246,196,83,0.10)', borderColor: 'rgba(246,196,83,0.22)' }}>
            <Flame size={13} strokeWidth={2.2} /> {streak} {streak === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </header>

      {/* Tonight's chapter */}
      {tonight && (
        <button
          onClick={() => navigate(`/series/${tonight.id}`)}
          className="mt-6 w-full text-left rounded-3xl overflow-hidden ring-1 ring-white/10 relative active:scale-[0.99] transition"
          style={{ minHeight: 190, background: tonight.gradient || 'linear-gradient(135deg,#1a0a2e,#2e1a0a)' }}
        >
          {seriesCover(tonight) && (
            <img src={seriesCover(tonight)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(7,10,25,0.86) 25%,rgba(7,10,25,0.15) 100%)' }} />
          <div className="relative p-6 lg:p-7 max-w-[440px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 flex items-center gap-1.5"><Moon size={13} /> Tonight&apos;s chapter</p>
            <p className="font-display text-xl lg:text-2xl text-white mt-2 leading-snug">{tonight.title}</p>
            <p className="text-[13px] text-white/75 mt-1.5 line-clamp-2">{tonight.episodes[0]?.title} — {tonight.episodes[0]?.subtitle || tonight.description}</p>
            <span className="inline-flex items-center gap-2 mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
              <Play size={15} strokeWidth={2.5} fill="#0D1B2A" /> Listen now
            </span>
          </div>
        </button>
      )}

      {/* Top of the Week — hero carousel */}
      {highlights.length > 0 && (
        <Section icon={Star} title="Top of the Week">
          <Row>
            {highlights.map((s) => {
              const cover = seriesCover(s);
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/series/${s.id}`)}
                  className="snap-start shrink-0 w-[280px] lg:w-[320px] h-[176px] lg:h-[200px] rounded-2xl overflow-hidden ring-1 ring-white/10 relative text-left active:scale-[0.98] transition"
                  style={{ background: s.gradient || 'linear-gradient(135deg,#243349,#0D1B2A)' }}
                >
                  {cover && <img src={cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(7,10,25,0.85) 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">{s.totalEpisodes || s.episodes.length} episodes</p>
                    <p className="font-display text-[17px] text-white leading-tight line-clamp-2 mt-0.5">{s.title}</p>
                  </div>
                </button>
              );
            })}
          </Row>
        </Section>
      )}

      {/* Stories */}
      <Section icon={Sparkles} title="Stories">
        <Row>
          {loading && stories.length === 0
            ? [0, 1, 2, 3].map((i) => <Skeleton key={i} />)
            : stories.map((l) => <Tile key={l.id} onClick={() => playStory(l)} a={art(l.id, wisdomImageUrls)} title={l.title} sub={`${l.durationMinutes || 5} min`} />)}
        </Row>
      </Section>

      {/* Series */}
      <Section icon={Library} title="Series">
        <Row>
          {series.map((s) => (
            <Tile
              key={s.id}
              onClick={() => navigate(`/series/${s.id}`)}
              a={{ img: seriesCover(s), gradient: s.gradient || 'linear-gradient(135deg,#243349,#0D1B2A)' }}
              title={s.title}
              sub={`${s.totalEpisodes || s.episodes.length} episodes`}
            />
          ))}
        </Row>
      </Section>

      <Footer />
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-9">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#F7F1E8] mb-3.5">
        <Icon size={17} strokeWidth={2} style={{ color: GOLD }} /> {title}
      </h2>
      {children}
    </section>
  );
}
function Row({ children }) {
  return (
    <div className="flex gap-3.5 overflow-x-auto pb-1 snap-x -mx-5 px-5 lg:-mx-8 lg:px-8" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}
function Tile({ onClick, a, title, sub }) {
  return (
    <button onClick={onClick} className="snap-start shrink-0 w-[140px] lg:w-[156px] text-left active:scale-95 transition">
      <div className="w-full aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 relative" style={{ background: a.gradient }}>
        {a.img ? (
          <img src={a.img} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center"><Moon size={26} className="text-white/25" /></span>
        )}
      </div>
      <p className="mt-2 text-[13px] font-bold text-[#F7F1E8] leading-tight line-clamp-2 min-h-[34px]">{title}</p>
      <p className="text-[11px] text-[#7A6B8A] mt-0.5">{sub}</p>
    </button>
  );
}
function Skeleton() {
  return (
    <div className="shrink-0 w-[140px] lg:w-[156px]">
      <div className="w-full aspect-square rounded-2xl bg-white/5 animate-pulse" />
      <div className="mt-2 h-3 w-24 rounded bg-white/5 animate-pulse" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12">
      <div className="border-t border-white/8 pt-7 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://www.producthunt.com/products/my-sleepy-tale-personalized-audio-book?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-my-sleepy-tale-personalized-audio-book" target="_blank" rel="noopener noreferrer">
            <img alt="My Sleepy Tale on Product Hunt" style={{ height: '44px', width: 'auto' }} src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1174662&theme=dark" />
          </a>
          <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" aria-label="Listed on Sell With Boost">
            <img alt="Listed on Sell With Boost" style={{ height: '44px', width: 'auto' }} src="https://sellwithboost.com/badge/listing.svg" />
          </a>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[#7A6B8A]">
          <a href="/aboutus" className="hover:text-[#B8AAC8]">About</a>
          <a href="/blog/" className="hover:text-[#B8AAC8]">Blog</a>
          <a href="/privacy" className="hover:text-[#B8AAC8]">Privacy</a>
          <a href="mailto:hello@mysleepytale.com" className="hover:text-[#B8AAC8]">Contact</a>
        </nav>
        <p className="text-[10px] text-[#7A6B8A] text-center leading-relaxed">My Sleepy Tale · Toronto, Canada · Bedtime stories that teach roots &amp; values</p>
      </div>
    </footer>
  );
}
