// V2 Listen — presentational. New night-sky shell + the EXISTING production cover
// cards (StoryTile / SeriesCard) you prefer. All props are plain data from ListenHome.
import { Mic, Flame, Play, Star, Sparkles, Library, Moon } from 'lucide-react';
import StoryTile from '../../components/cards/StoryTile.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import { GOLD } from '../ui.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ListenView({ childName, streak, tonight, highlights, stories, series, loading, onPlay, onOpenSeries, onOpenVoice }) {
  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10">
      {/* Header */}
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">{greeting()}</p>
        <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">
          A story for <span style={{ color: GOLD }}>{childName || 'little one'}</span>
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={onOpenVoice} className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-[#B8AAC8] ring-1 ring-white/10 hover:ring-white/20 transition">
            <Mic size={13} strokeWidth={2} /> Playing in: <span className="text-[#F7F1E8]">Default</span>
          </button>
          <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold" style={{ color: GOLD, background: 'rgba(246,196,83,0.10)', border: '1px solid rgba(246,196,83,0.22)' }}>
            <Flame size={13} strokeWidth={2.2} /> {streak} {streak === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </header>

      {/* Tonight's chapter — wide hero */}
      {tonight && (
        <button
          onClick={() => onOpenSeries(tonight.series.id)}
          className="mt-6 w-full text-left rounded-3xl overflow-hidden ring-1 ring-white/10 relative active:scale-[0.99] transition"
          style={{ minHeight: 196, background: tonight.series.gradient || 'linear-gradient(135deg,#1a0a2e,#2e1a0a)' }}
        >
          {tonight.coverImage && <img src={tonight.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg,rgba(7,10,25,0.9) 30%,rgba(7,10,25,0.2) 100%)' }} />
          <div className="relative p-6 lg:p-7 max-w-[460px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 flex items-center gap-1.5"><Moon size={13} /> Tonight&apos;s chapter</p>
            <p className="font-display text-xl lg:text-2xl text-white mt-2 leading-snug">{tonight.series.title}</p>
            <p className="text-[13px] text-white/75 mt-1.5 line-clamp-2">{tonight.series.episodes?.[0]?.title} — {tonight.series.episodes?.[0]?.subtitle || tonight.series.description}</p>
            <span className="inline-flex items-center gap-2 mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
              <Play size={15} strokeWidth={2.5} fill="#0D1B2A" /> Listen now
            </span>
          </div>
        </button>
      )}

      {/* Top of the Week — real SeriesCards */}
      {highlights?.length > 0 && (
        <Section icon={Star} title="Top of the Week">
          <Row extraPad>
            {highlights.map(({ series: s, coverImage }) => (
              <SeriesCard key={s.id} series={s} coverImage={coverImage} onClick={() => onOpenSeries(s.id)} />
            ))}
          </Row>
        </Section>
      )}

      {/* Stories — real StoryTiles */}
      <Section icon={Sparkles} title="Stories">
        <Row>
          {loading
            ? [0, 1, 2, 3].map((i) => <div key={i} className="w-40 lg:w-48 shrink-0 rounded-2xl bg-white/5 animate-pulse" style={{ aspectRatio: '2/3', minHeight: 240 }} />)
            : stories.map(({ lesson, imageUrl }) => <StoryTile key={lesson.id} lesson={lesson} imageUrl={imageUrl} onPlay={onPlay} />)}
        </Row>
      </Section>

      {/* Series — real SeriesCards */}
      <Section icon={Library} title="Series">
        <Row extraPad>
          {series.map(({ series: s, coverImage }) => (
            <SeriesCard key={s.id} series={s} coverImage={coverImage} onClick={() => onOpenSeries(s.id)} />
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
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#F7F1E8] mb-4">
        <Icon size={17} strokeWidth={2} style={{ color: GOLD }} /> {title}
      </h2>
      {children}
    </section>
  );
}
function Row({ children, extraPad }) {
  return (
    <div className={`flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 lg:-mx-8 lg:px-8 ${extraPad ? 'pt-1 pl-7 lg:pl-10' : ''}`} style={{ scrollbarWidth: 'none' }}>
      {children}
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
