// V2 My World — "Themes" view. Groups a child's creations into topic CLUSTERS as
// draggable, tilting cards. Today the grouping is by an assigned/keyword topic; the
// framing (and the roadmap) is on-device theme + sentiment analysis so MST can learn
// what sparks the child and grow the NEXT story from it.
import { useRef } from 'react';
import { Rocket, Sparkles, Cog, Leaf, Candy, Trophy, Brain, Wand2 } from 'lucide-react';
import { DraggableCardContainer, DraggableCardBody } from '../DraggableCard.jsx';
import { GOLD } from '../ui.js';

// The clusters. `keywords` power the fallback classifier for real stories that don't
// carry an explicit topic — matched against the story's title AND its transcript, so
// a kid's "pet" / "dinosaur" / "soccer" story lands in the right theme even when the
// title is generic (e.g. "Veda's story"). `interest` is a placeholder for the ML score.
export const CLUSTERS = [
  { key: 'space',    title: 'Space & Sky',   icon: Rocket,   c1: '#3A2C6B', c2: '#5B8CFF', tag: 'Big questions', interest: 86, keywords: ['moon', 'star', 'space', 'rocket', 'planet', 'sky', 'astro', 'galaxy', 'comet', 'alien', 'universe'] },
  { key: 'nature',   title: 'Animals',       icon: Leaf,     c1: '#1D6B4C', c2: '#4FD1A5', tag: 'Caring',        interest: 68, keywords: ['fish', 'fox', 'forest', 'ocean', 'puppy', 'dog', 'cat', 'kitten', 'bird', 'animal', 'animals', 'pet', 'pets', 'rabbit', 'bunny', 'hamster', 'horse', 'lion', 'tiger', 'elephant', 'dinosaur', 'dino', 'tree', 'sea', 'jungle', 'zoo'] },
  { key: 'sports',   title: 'Sports & Games',icon: Trophy,   c1: '#8A4B1E', c2: '#F6C453', tag: 'Play & teamwork', interest: 70, keywords: ['sport', 'sports', 'ball', 'soccer', 'football', 'cricket', 'basketball', 'tennis', 'hockey', 'race', 'racing', 'run', 'running', 'swim', 'game', 'team', 'goal', 'match', 'win', 'jump', 'skate', 'bike', 'ride'] },
  { key: 'machines', title: 'Machines',      icon: Cog,      c1: '#134E5E', c2: '#33C3E0', tag: 'How things work', interest: 72, keywords: ['car', 'robot', 'train', 'plane', 'machine', 'truck', 'engine', 'build', 'digger', 'crane', 'boat', 'ship'] },
  { key: 'magic',    title: 'Magic & Myth',  icon: Sparkles, c1: '#5B2C87', c2: '#FF7EB6', tag: 'Fantasy',       interest: 78, keywords: ['dragon', 'unicorn', 'wizard', 'magic', 'fairy', 'spell', 'myth', 'giant', 'castle', 'princess', 'mermaid', 'monster'] },
  { key: 'silly',    title: 'Silly & Fun',   icon: Candy,    c1: '#B23A73', c2: '#FF9F6B', tag: 'Pure fun',      interest: 64, keywords: ['candy', 'giggle', 'silly', 'upside', 'funny', 'sweet', 'cake', 'party', 'laugh', 'joke', 'ice cream', 'pizza'] },
];

const CLUSTER_MAP = CLUSTERS.reduce((m, c) => { m[c.key] = c; return m; }, {});

// Layout for sm+ screens: a loose, playful scatter (cards are draggable anyway).
// Two columns × three rows, staggered so nothing hides on first load.
const POS = {
  space:    { top: 4,   left: '2%',  rotate: -5 },
  nature:   { top: 22,  left: '52%', rotate: 5 },
  sports:   { top: 214, left: '4%',  rotate: 4 },
  machines: { top: 232, left: '54%', rotate: -4 },
  magic:    { top: 424, left: '2%',  rotate: -3 },
  silly:    { top: 442, left: '52%', rotate: 3 },
};

export function classifyTopic(story) {
  if (story.topic && CLUSTER_MAP[story.topic]) return story.topic;
  // Classify on the title AND the transcript (the actual story), since kid recordings
  // usually have a generic title — this is what segregates pet / sports / space / etc.
  const t = `${story.title || ''} ${story.transcript || ''} ${story.text || ''}`.toLowerCase();
  // Score every cluster by how many of its keywords appear; the strongest wins, so a
  // story mentioning several animals beats an incidental single keyword elsewhere.
  let best = null, bestScore = 0;
  for (const c of CLUSTERS) {
    const score = c.keywords.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) { bestScore = score; best = c.key; }
  }
  return best || 'magic'; // imagination is the safe home for the unclassified
}

export default function WorldClusters({ stories, name, onOpen, isWide }) {
  const boardRef = useRef(null);

  const grouped = CLUSTERS.map((c) => ({
    cluster: c,
    items: stories.filter((s) => classifyTopic(s) === c.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mt-4">
      {/* Big branded hero */}
      <div className="flex items-center gap-3.5 mb-1">
        <div className="relative shrink-0" style={{ width: 58, height: 58 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset -15px 8px 0 0 #F6E7B8', filter: 'drop-shadow(0 0 18px rgba(246,196,83,0.5))' }} />
        </div>
        <div>
          <h2 className="font-display text-2xl lg:text-[28px] leading-none" style={{ color: GOLD }}>{name ? `${name}'s` : 'Your'} Story World</h2>
          <p className="text-[12px] text-[#B8AAC8] mt-1">Grouped by what they love</p>
        </div>
      </div>

      {/* Cognitive framing — one short line */}
      <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 px-4 py-3">
        <Brain size={16} strokeWidth={2} className="shrink-0" style={{ color: GOLD }} />
        <p className="text-[12.5px] text-[#CDBFE0]">Bigger the group, the more they love it. <span className="text-[#7A6B8A]">Drag to explore.</span></p>
      </div>

      {/* Cluster cards */}
      <DraggableCardContainer className="mt-6">
        <div ref={boardRef} className="relative" style={{ minHeight: isWide ? 660 : undefined }}>
          {grouped.map(({ cluster, items }) => {
            const p = POS[cluster.key] || { top: 0, left: '0%', rotate: 0 };
            // box grows with how many stories fall in the category
            const w = Math.min(300, 190 + (items.length - 1) * 26);
            const wideStyle = isWide
              ? { position: 'absolute', top: p.top, left: p.left, rotate: p.rotate, width: w }
              : { rotate: p.rotate, width: '100%', maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' };
            return (
              <div key={cluster.key} className={isWide ? '' : 'mb-5'}>
                <DraggableCardBody constraintsRef={boardRef} style={wideStyle}
                  className="ring-1 ring-white/12"
                >
                  <ClusterCardInner cluster={cluster} items={items} name={name} onOpen={onOpen} />
                </DraggableCardBody>
              </div>
            );
          })}
        </div>
      </DraggableCardContainer>

      <p className="mt-6 text-center text-[11px] text-[#7A6B8A] flex items-center justify-center gap-1.5">
        <Sparkles size={12} /> Themes learn &amp; re-cluster as your child creates more.
      </p>
    </div>
  );
}

function ClusterCardInner({ cluster, items, onOpen }) {
  const Icon = cluster.icon;
  return (
    <div className="p-3.5" style={{ background: 'linear-gradient(160deg,#141C33 0%,#0C1226 100%)' }}>
      {/* colored top accent */}
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg,${cluster.c1},${cluster.c2})` }} />

      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl shrink-0" style={{ background: `linear-gradient(135deg,${cluster.c1},${cluster.c2})` }}>
          <Icon size={17} strokeWidth={2.2} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[16px] text-[#F7F1E8] leading-tight truncate">{cluster.title}</p>
          <p className="text-[10.5px] text-[#7A6B8A]">{items.length} {items.length === 1 ? 'story' : 'stories'} · {cluster.tag}</p>
        </div>
      </div>

      {/* story chips — all of them, so a bigger group looks fuller */}
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((s) => (
          <button
            key={s.id || s.storyId}
            onClick={() => onOpen && onOpen(s)}
            className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/15 active:scale-90 transition"
            title={s.title}
          >
            {s.promptImageUrl || s.coverImage
              ? <img src={s.promptImageUrl || s.coverImage} alt="" className="h-full w-full object-cover pointer-events-none" />
              : <span className="grid h-full w-full place-items-center bg-white/5 text-white/40 text-xs">★</span>}
          </button>
        ))}
      </div>

      <button
        onClick={() => onOpen && items[0] && onOpen(items[0])}
        className="mt-3.5 w-full flex items-center justify-center gap-1.5 rounded-full py-2 text-[12px] font-bold text-[#0D1B2A]"
        style={{ background: GOLD }}
      >
        <Wand2 size={13} strokeWidth={2.4} /> Grow
      </button>
    </div>
  );
}
