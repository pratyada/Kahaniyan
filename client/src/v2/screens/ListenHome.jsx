// V2 Listen — browse & play Stories + Series. Free/generic audio ("little one"),
// but the child's NAME is shown in TEXT for free (paid tier speaks it / uses cloned voice).
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { playLesson } from '../../utils/storyHelpers.js';
import { getStoryArt } from '../../utils/storyArt.js';
import { SERIES } from '../../data/series.js';

function art(id, imageUrls) {
  const a = getStoryArt(id) || {};
  return {
    img: imageUrls?.[id] || a.image || null,
    gradient: a.gradient || 'linear-gradient(135deg,#1E2D3D 0%,#0D1B2A 100%)',
    icon: a.icon || '🌙',
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

  const stories = useMemo(
    () => (allLessons || []).filter((l) => l && l.body && l.title).slice(0, 12),
    [allLessons]
  );
  const series = useMemo(() => (SERIES || []).filter((s) => !s.comingSoon && s.episodes?.length), []);
  const tonight = series[0];
  const highlights = useMemo(() => series.slice(0, 6), [series]);

  const playStory = (lesson) => playLesson(lesson, profile, wisdomAudioUrls || {}, load, navigate, user);
  const seriesCover = (s) => (s.episodes || []).map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean);

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="px-5 pt-7">
        <p className="ui-label text-ink-dim">{greeting()}</p>
        <h1 className="display-title text-2xl mt-1 text-ink">
          A story for <span className="text-gold">{childName || 'little one'}</span>
        </h1>

        {/* Chips */}
        <div className="mt-4 flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-pill bg-bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted ring-1 ring-white/5 active:scale-95 transition"
            onClick={() => navigate('/v2/world')}
          >
            🎙️ Playing in: <span className="text-ink">Default</span> <span className="text-ink-dim">▾</span>
          </button>
          <span className="flex items-center gap-1 rounded-pill bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold ring-1 ring-gold/20">
            🔥 {streak} {streak === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </header>

      {/* Tonight's chapter */}
      {tonight && (
        <section className="px-5 mt-6">
          <button
            onClick={() => navigate(`/series/${tonight.id}`)}
            className="w-full text-left rounded-2xl overflow-hidden ring-1 ring-white/8 active:scale-[0.99] transition"
            style={{ background: tonight.gradient || 'linear-gradient(135deg,#1a0a2e,#2e1a0a)' }}
          >
            <div className="p-5">
              <p className="ui-label text-white/70">🌙 Tonight&apos;s chapter</p>
              <p className="display-title text-lg text-white mt-1">{tonight.icon} {tonight.title}</p>
              <p className="text-[13px] text-white/80 mt-1 line-clamp-2">
                {tonight.episodes[0]?.title} — {tonight.episodes[0]?.subtitle || tonight.description}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 rounded-pill bg-white/90 px-4 py-2 text-sm font-bold text-bg-base">
                ▶ Listen now
              </span>
            </div>
          </button>
        </section>
      )}

      {/* Top of the Week — hero carousel of big cover cards */}
      {highlights.length > 0 && (
        <section className="mt-7">
          <h2 className="ui-title text-sm px-5 mb-3 text-ink">⭐ Top of the Week</h2>
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {highlights.map((s) => {
              const cover = seriesCover(s);
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/series/${s.id}`)}
                  className="snap-start shrink-0 w-[280px] h-[172px] rounded-2xl overflow-hidden ring-1 ring-white/10 relative text-left active:scale-[0.98] transition"
                  style={{ background: s.gradient || 'linear-gradient(135deg,#1E2D3D,#0D1B2A)' }}
                >
                  {cover && <img src={cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,0.75) 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                      {s.totalEpisodes || s.episodes.length} episodes
                    </p>
                    <p className="display-title text-base text-white leading-tight line-clamp-2 mt-0.5">
                      {s.icon} {s.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Stories shelf */}
      <Shelf title="✨ Stories">
        {loading && stories.length === 0 ? (
          <SkeletonRow />
        ) : (
          stories.map((l) => (
            <Tile key={l.id} onClick={() => playStory(l)} a={art(l.id, wisdomImageUrls)} title={l.title} sub={`${l.durationMinutes || 5} min`} />
          ))
        )}
      </Shelf>

      {/* Series shelf */}
      <Shelf title="📚 Series">
        {series.map((s) => (
          <Tile
            key={s.id}
            onClick={() => navigate(`/series/${s.id}`)}
            a={{ img: seriesCover(s), gradient: s.gradient || 'linear-gradient(135deg,#1E2D3D,#0D1B2A)', icon: s.icon || '📚' }}
            title={s.title}
            sub={`${s.totalEpisodes || s.episodes.length} episodes`}
          />
        ))}
      </Shelf>

      <Footer />
    </div>
  );
}

function Shelf({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="ui-title text-sm px-5 mb-3 text-ink">{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </section>
  );
}

function Tile({ onClick, a, title, sub }) {
  return (
    <button onClick={onClick} className="shrink-0 w-[132px] text-left active:scale-95 transition">
      <div className="h-[132px] w-[132px] rounded-2xl overflow-hidden ring-1 ring-white/8 grid place-items-center relative" style={{ background: a.gradient }}>
        {a.img ? (
          <img src={a.img} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl opacity-90">{a.icon}</span>
        )}
      </div>
      <p className="mt-2 text-[13px] font-bold text-ink leading-tight line-clamp-2 min-h-[34px]">{title}</p>
      <p className="text-[11px] text-ink-dim mt-0.5">{sub}</p>
    </button>
  );
}

function SkeletonRow() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="shrink-0 w-[132px]">
          <div className="h-[132px] w-[132px] rounded-2xl bg-bg-surface animate-pulse" />
          <div className="mt-2 h-3 w-24 rounded bg-bg-surface animate-pulse" />
        </div>
      ))}
    </>
  );
}

function Footer() {
  const dark = typeof document !== 'undefined' && document.documentElement.dataset.theme !== 'day';
  return (
    <footer className="mt-10 px-5">
      <div className="border-t border-white/8 pt-6 flex flex-col items-center gap-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.producthunt.com/products/my-sleepy-tale-personalized-audio-book?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-my-sleepy-tale-personalized-audio-book"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="My Sleepy Tale on Product Hunt"
              width="210"
              height="45"
              style={{ height: '45px', width: 'auto' }}
              src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1174662&theme=${dark ? 'dark' : 'light'}`}
            />
          </a>
          <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" aria-label="Listed on Sell With Boost">
            <img
              alt="Listed on Sell With Boost"
              style={{ height: '45px', width: 'auto' }}
              src={`https://sellwithboost.com/badge/${dark ? 'listing' : 'listing-dark'}.svg`}
            />
          </a>
        </div>

        {/* Quick links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-ink-dim">
          <a href="/aboutus" className="hover:text-ink-muted">About</a>
          <a href="/blog/" className="hover:text-ink-muted">Blog</a>
          <a href="/privacy" className="hover:text-ink-muted">Privacy</a>
          <a href="mailto:hello@mysleepytale.com" className="hover:text-ink-muted">Contact</a>
        </nav>

        <p className="text-[10px] text-ink-dim text-center leading-relaxed">
          My Sleepy Tale · Toronto, Canada<br />Bedtime stories that teach roots &amp; values 💛
        </p>
      </div>
    </footer>
  );
}
