// V2 Listen — presentational. New night-sky shell + your production cover cards.
// Search (top) · category filters · featured carousel · category shelves ·
// played outline · multilingual badge. All props are plain data from ListenHome.
import { Search, X, Mic, Flame, Star, Library } from 'lucide-react';
import StoryTile from '../../components/cards/StoryTile.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import HeroSlider from '../../components/HeroSlider.jsx';
import { TRADITIONS, THEMES } from '../../data/culturalLessons.js';
import { isPlayed, isMultiLang } from '../played.js';
import { getActiveVoice } from '../voice.js';
import { GOLD } from '../ui.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ListenView(props) {
  const {
    childName, streak, loading, playedSet,
    query, onSearch, traditionFilter, themeFilter, onToggleTradition, onToggleTheme, onClearFilters,
    results, heroLessons, heroImages, topWeek, shelves, seriesList,
    onPlay, onOpenSeries, onOpenVoice,
  } = props;

  const searching = (query || '').trim().length > 0;
  const filtering = !!(traditionFilter || themeFilter);
  const active = searching || filtering;

  const renderStory = (item) => (
    <StoryCard key={item.lesson.id} item={item} played={isPlayed(playedSet, item.lesson.id)} multi={isMultiLang(item.lesson)} onPlay={onPlay} />
  );

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
            <Mic size={13} strokeWidth={2} /> Playing in: <span className="text-[#F7F1E8]">{getActiveVoice()?.name || 'Default'}</span>
          </button>
          <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold" style={{ color: GOLD, background: 'rgba(246,196,83,0.10)', border: '1px solid rgba(246,196,83,0.22)' }}>
            <Flame size={13} strokeWidth={2.2} /> {streak} {streak === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </header>

      {/* Search */}
      <div className="mt-5 relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6B8A]" />
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search stories, themes, keywords…"
          className="w-full rounded-full bg-white/[0.06] ring-1 ring-white/10 focus:ring-[#F6C453]/50 outline-none py-3 pl-11 pr-10 text-sm text-[#F7F1E8] placeholder:text-[#7A6B8A]"
        />
        {searching && (
          <button onClick={() => onSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6B8A] hover:text-[#F7F1E8]">
            <X size={17} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 lg:-mx-8 lg:px-8" style={{ scrollbarWidth: 'none' }}>
        <Chip active={!filtering} onClick={onClearFilters}>All</Chip>
        {TRADITIONS.filter((t) => t.key !== 'universal').map((t) => (
          <Chip key={t.key} active={traditionFilter === t.key} onClick={() => onToggleTradition(t.key)}>{t.icon} {t.label}</Chip>
        ))}
        {THEMES.map((t) => (
          <Chip key={t.key} active={themeFilter === t.key} onClick={() => onToggleTheme(t.key)}>{t.icon} {t.label}</Chip>
        ))}
      </div>

      {active ? (
        /* Search / filter results */
        <section className="mt-7">
          <h2 className="text-[15px] font-bold text-[#F7F1E8] mb-4">
            {results.total > 0 ? `${results.total} result${results.total === 1 ? '' : 's'}` : 'No stories found'}
            {searching ? ` for “${query.trim()}”` : ''}
          </h2>
          {results.series?.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 pl-2 -mx-5 px-5 lg:-mx-8 lg:px-8 mb-6" style={{ scrollbarWidth: 'none' }}>
              {results.series.map(({ series: s, coverImage }) => (
                <SeriesCard key={s.id} series={s} coverImage={coverImage} onClick={() => onOpenSeries(s.id)} />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {results.stories.map(renderStory)}
          </div>
          {results.total === 0 && (
            <p className="text-[13px] text-[#7A6B8A] mt-2">Try a different word — a name, a value like “courage”, or a tradition.</p>
          )}
        </section>
      ) : (
        /* Default browse */
        <>
          {heroLessons?.length > 0 && (
            <div className="mt-6"><HeroSlider stories={heroLessons} wisdomImageUrls={heroImages} onPlay={onPlay} /></div>
          )}
          {topWeek?.length > 0 && (
            <Section icon={Star} title="Top of the Week">
              <Row extraPad>{topWeek.map(({ series: s, coverImage }) => (<SeriesCard key={s.id} series={s} coverImage={coverImage} onClick={() => onOpenSeries(s.id)} />))}</Row>
            </Section>
          )}
          {loading && (!shelves || shelves.length === 0) && (
            <Section title="Loading stories…"><Row>{[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}</Row></Section>
          )}
          {(shelves || []).map((sh) => (
            sh.stories.length ? (
              <Section key={sh.id} title={sh.title}><Row>{sh.stories.map(renderStory)}</Row></Section>
            ) : null
          ))}
          {seriesList?.length > 0 && (
            <Section icon={Library} title="All Series">
              <Row extraPad>{seriesList.map(({ series: s, coverImage }) => (<SeriesCard key={s.id} series={s} coverImage={coverImage} onClick={() => onOpenSeries(s.id)} />))}</Row>
            </Section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition ${active ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10 hover:ring-white/20'}`}
      style={active ? { background: GOLD } : undefined}
    >
      {children}
    </button>
  );
}

function StoryCard({ item, played, multi, onPlay }) {
  return (
    <div className="relative shrink-0">
      <div className={`rounded-2xl ${played ? 'ring-2 ring-[#F6C453]/70' : ''}`}>
        <div className={played ? 'opacity-70' : ''}>
          <StoryTile lesson={item.lesson} imageUrl={item.imageUrl} onPlay={onPlay} />
        </div>
      </div>
      {played && (
        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-[#F6C453] px-2 py-[3px] text-[8px] font-bold uppercase tracking-wide text-[#0D1B2A]">Played</span>
      )}
      {multi && (
        <span className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-[3px] text-[8px] font-bold text-white/90 backdrop-blur-sm ring-1 ring-white/15">🌐 Langs</span>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-9">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#F7F1E8] mb-4">
        {Icon && <Icon size={17} strokeWidth={2} style={{ color: GOLD }} />} {title}
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
function Skeleton() {
  return <div className="shrink-0 w-40 lg:w-48 rounded-2xl bg-white/5 animate-pulse" style={{ aspectRatio: '2/3', minHeight: 240 }} />;
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
