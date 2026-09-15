// V2 Series detail — night-sky episode list. Playing an episode stays in V2.
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Moon } from 'lucide-react';
import { SERIES } from '../../data/series.js';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { buildStory } from '../play.js';
import { GOLD } from '../ui.js';

export default function V2Series() {
  const navigate = useNavigate();
  const { seriesId } = useParams();
  const { wisdomImageUrls, wisdomAudioUrls } = useWisdomData();
  const { load } = usePlayer();

  const series = (SERIES || []).find((s) => s.id === seriesId);
  if (!series) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="text-[#B8AAC8]">Series not found.</p>
        <button onClick={() => navigate('/v2')} className="mt-4 rounded-full px-6 py-3 text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>Back to Listen</button>
      </div>
    );
  }

  const episodes = series.episodes || [];
  const cover = episodes.map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean);

  const playEpisode = (ep) => {
    load(buildStory(ep, wisdomAudioUrls || {}, wisdomImageUrls || {}, {
      seriesId: series.id, episodeId: ep.id, episodeNumber: ep.episodeNumber, coverImage: wisdomImageUrls?.[ep.id] || ep.coverImage || cover || null,
    }));
    navigate('/v2/player');
  };

  return (
    <div className="pb-28 max-w-[720px] mx-auto">
      {/* Hero */}
      <div className="relative" style={{ minHeight: 240, background: series.gradient || 'linear-gradient(135deg,#243349,#0D1B2A)' }}>
        {cover && <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,10,25,0.35) 0%,rgba(7,10,25,0.55) 55%,#0D1B2A 100%)' }} />
        <div className="relative px-5 lg:px-8 pt-6">
          <button onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-black/30 ring-1 ring-white/15 text-white active:scale-95 backdrop-blur-sm">
            <ChevronLeft size={20} />
          </button>
          <div className="mt-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Series · {episodes.length} episodes</p>
            <h1 className="font-display text-2xl lg:text-3xl text-white mt-1.5 leading-snug">{series.icon} {series.title}</h1>
            {series.description && <p className="text-[13px] text-white/70 mt-2 max-w-[520px]">{series.description}</p>}
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="px-5 lg:px-8 mt-5 space-y-2.5">
        {episodes.map((ep) => {
          const img = wisdomImageUrls?.[ep.id] || ep.coverImage || null;
          return (
            <button
              key={ep.id}
              onClick={() => playEpisode(ep)}
              className="w-full flex items-center gap-3.5 rounded-2xl p-2.5 pr-4 text-left bg-white/[0.04] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06] transition active:scale-[0.99]"
            >
              <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden relative" style={{ background: series.gradient }}>
                {img ? <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="absolute inset-0 grid place-items-center"><Moon size={20} className="text-white/30" /></span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A6B8A]">Episode {ep.episodeNumber}</p>
                <p className="text-sm font-bold text-[#F7F1E8] leading-tight line-clamp-1 mt-0.5">{ep.title}</p>
                {ep.subtitle && <p className="text-[12px] text-[#B8AAC8] line-clamp-1 mt-0.5">{ep.subtitle}</p>}
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#0D1B2A]" style={{ background: GOLD }}>
                <Play size={16} fill="#0D1B2A" className="ml-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
