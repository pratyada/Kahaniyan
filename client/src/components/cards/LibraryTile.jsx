// Library card — portrait cover art with share/delete actions.
// Extracted from Library.jsx to its own file.

import { Play, Share2, Trash2 } from 'lucide-react';
import { valueMeta } from '../../utils/constants.js';
import { getStoryArt } from '../../utils/storyArt.js';

export default function LibraryTile({ story, wisdomImageUrls = {}, onPlay, onShare, onDelete, isSharing }) {
  const meta = valueMeta(story.value);
  const lessonKey = story.id?.startsWith('lesson_') ? story.id.slice(7) : '';
  const art = getStoryArt(lessonKey);
  const imgSrc = story.coverImage || wisdomImageUrls[lessonKey] || wisdomImageUrls[story.id] || art.image;
  const date = new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="group relative overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Album art cover — tap to play */}
      <button onClick={onPlay} className="relative block w-full text-left" style={{ aspectRatio: '1 / 1' }}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: art.gradient }} />
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <Play size={20} fill="white" stroke="none" />
          </div>
        </div>
        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p
            className="line-clamp-2 text-sm font-bold leading-snug text-white"
            style={{ fontFamily: 'Fraunces, serif', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {story.title || 'Untitled Story'}
          </p>
          <p className="mt-0.5 text-[10px] text-white/60">
            {meta.label} · {story.estimatedMinutes || '?'}m · {date}
          </p>
        </div>
      </button>
      {/* Actions row */}
      <div className="flex items-center gap-1 bg-bg-surface/80 px-2 py-1.5">
        <button
          onClick={onShare}
          disabled={isSharing}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-gold transition active:scale-95 disabled:opacity-50"
        >
          <Share2 size={11} /> Share
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { if (confirm('Remove?')) onDelete(); }}
          className="grid h-7 w-7 place-items-center rounded-full text-ink-dim transition hover:text-negative active:scale-95"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
