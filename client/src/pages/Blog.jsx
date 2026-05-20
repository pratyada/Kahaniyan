// Blog — articles grid inside the app shell with bottom nav.

import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

const POSTS = [
  { slug: 'jean-lumb-kindergarten-bedtime-stories-toronto', title: 'Jean Lumb PS Kindergarten Bedtime Stories — Real Adventures, Real Kids', desc: 'We turned real kindergarten adventures at Jean Lumb Public School into bedtime audio stories.', cat: 'toronto', tag: 'Featured', min: 8, img: 'https://firebasestorage.googleapis.com/v0/b/qissaa-61a78.firebasestorage.app/o/story-gallery%2Frk_ep1_canoe%2F1779129759962_0.jpeg?alt=media&token=df4fa13e-7b64-4860-bb65-61a300f6da93', featured: true },
  { slug: 'why-kids-love-who-would-win', title: 'Why Do Kids Love "Who Would Win?" — The Psychology Behind It', desc: 'Lion vs Eagle. Why your 5-year-old is obsessed with these debates — and why it\'s brilliant for their brain.', cat: 'psychology', tag: 'Psychology', min: 7, img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-kids-love-cars-buses', title: 'Why Are 4-6 Year Olds Obsessed with Cars, Buses & Trucks?', desc: 'The developmental science behind your child\'s vehicle fascination.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-kids-love-planets', title: 'Why Kids Are Fascinated by Planets and Space', desc: 'The Pluto Effect: why your child feels sad for a rock 5.9 billion km away.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-kids-love-sports-stories', title: 'Why Sports Stories Build Discipline, Teamwork & Grit', desc: 'How cricket, swimming, and soccer stories teach persistence and fair play.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-kids-need-superhero-stories', title: 'Why Every Child Needs Superhero Stories (Not the Marvel Kind)', desc: 'The superheroes your child needs have patience, empathy, and kindness as their powers.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1521714161819-15534968fc5f?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-family-stories-matter', title: 'Why Family Stories Are the Most Powerful Bedtime Tool', desc: 'Emory research: the #1 predictor of a child\'s resilience is knowing their family story.', cat: 'psychology', tag: 'Research', min: 7, img: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-kids-love-countries', title: 'Why Stories About Countries & Flags Build Open-Minded Kids', desc: 'How place-based stories reduce implicit bias in children.', cat: 'psychology', tag: 'Global', min: 6, img: 'https://images.unsplash.com/photo-1633477189729-9290b3261d0a?w=600&h=380&fit=crop&q=80' },
  { slug: 'why-bedtime-stories-matter', title: 'Why Bedtime Stories Matter More Than You Think', desc: 'Kids who hear stories before bed develop 26% better vocabulary. Here\'s the science.', cat: 'guide', tag: 'Guide', min: 5, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=380&fit=crop&q=80' },
  { slug: 'best-bedtime-story-app-2026', title: 'Best Bedtime Story App in 2026 — Calm vs Moshi vs My Sleepy Tale', desc: 'Feature-by-feature comparison. Where each app wins — and where we\'re different.', cat: 'comparison', tag: 'Comparison', min: 7, img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=380&fit=crop&q=80' },
  { slug: 'best-bedtime-story-app-toronto', title: 'Best Bedtime Story App for Multicultural Families in Toronto', desc: '5 reasons parents in Brampton, Scarborough, and Mississauga are switching.', cat: 'toronto', tag: 'Toronto', min: 8, img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=380&fit=crop&q=80' },
  { slug: 'indian-bedtime-stories', title: 'Indian Bedtime Stories for Kids — Krishna to Panchatantra', desc: '15 Indian classics reimagined as audio bedtime tales for NRI families.', cat: 'culture', tag: 'Indian', min: 6, img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=380&fit=crop&q=80' },
  { slug: 'islamic-stories-for-kids', title: 'Islamic Stories for Kids — Prophet Stories for Bedtime', desc: 'Stories of Prophet Muhammad (peace be upon him) told beautifully.', cat: 'culture', tag: 'Islamic', min: 6, img: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=600&h=380&fit=crop&q=80' },
  { slug: 'become-a-creator', title: 'How to Become a Story Creator — The Complete Guide', desc: 'Write, submit, review, narrate, publish. Full creator workflow explained.', cat: 'creators', tag: 'Creator Guide', min: 10, img: 'https://mysleepytale.com/dsp_ep1_development.png' },
  { slug: 'creator-credits-guide', title: 'Creator Credits Guide — How Earning Works', desc: 'Everything about earning credits as a story creator on My Sleepy Tale.', cat: 'creators', tag: 'Credits', min: 5, img: 'https://mysleepytale.com/dsp_ep1_development.png' },
  { slug: 'rainbow-kindergarten-series-2026', title: 'Rainbow Kindergarten Adventures — Our First Series', desc: '3 episodes featuring Mr. Zak, Shelagh, and the Rainbow Batch of 2026.', cat: 'creators', tag: 'Series', min: 5, img: 'https://firebasestorage.googleapis.com/v0/b/qissaa-61a78.firebasestorage.app/o/story-gallery%2Frk_ep2_concert%2F1779131207663_0.jpeg?alt=media&token=72a55ede-4c5f-47ce-a4bc-d51f9548c94c' },
  { slug: 'bluey-bingo-niagara-victoria-day', title: 'Bluey & Bingo\'s Victoria Day Adventure at Niagara Falls', desc: 'A bedtime story where Bluey and Bingo visit Niagara Falls for Victoria Day fireworks.', cat: 'toronto', tag: 'Toronto', min: 5, img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=380&fit=crop&q=80' },
];

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'psychology', label: 'Psychology' },
  { key: 'guide', label: 'Guides' },
  { key: 'toronto', label: 'Toronto' },
  { key: 'culture', label: 'Cultural' },
  { key: 'comparison', label: 'Compare' },
  { key: 'creators', label: 'Creators' },
];

export default function Blog() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return POSTS.filter(p => {
      const matchCat = cat === 'all' || p.cat === cat;
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat]);

  const featured = filtered.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Header */}
      <div className="px-5 pt-8 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-gold" />
          <h1 className="font-display text-2xl font-bold text-ink">Blog</h1>
        </div>
        <p className="text-sm text-ink-muted">Child psychology, bedtime guides & parenting insights</p>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-2xl bg-bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-dim outline-none ring-1 ring-white/5 focus:ring-gold/40 transition"
        />
      </div>

      {/* Categories */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {CATS.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-bold transition ${
              cat === c.key
                ? 'bg-gold text-bg-base'
                : 'bg-bg-surface text-ink-muted ring-1 ring-white/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="text-[11px] text-ink-dim px-5 mb-3">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</div>

      {/* Featured card */}
      {featured && (
        <a href={`/blog/${featured.slug}`} className="block mx-5 mb-5 rounded-2xl overflow-hidden bg-bg-surface ring-1 ring-white/5 transition active:scale-[0.99]">
          <div className="aspect-[16/9] overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" loading="eager" />
          </div>
          <div className="p-4">
            <span className="inline-block bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2">{featured.tag}</span>
            <h2 className="font-display text-lg font-bold text-ink leading-snug mb-1.5">{featured.title}</h2>
            <p className="text-xs text-ink-muted line-clamp-2">{featured.desc}</p>
            <div className="mt-2 text-[10px] text-ink-dim">{featured.min} min read</div>
          </div>
        </a>
      )}

      {/* Cards grid */}
      <div className="px-5 pb-32 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rest.map(p => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="flex gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5 transition active:scale-[0.99] hover:bg-bg-elevated"
          >
            <div className="w-24 h-20 shrink-0 rounded-xl overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gold mb-0.5">{p.tag}</span>
              <h3 className="text-[13px] font-bold text-ink leading-tight line-clamp-2">{p.title}</h3>
              <div className="mt-1 text-[10px] text-ink-dim">{p.min} min</div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center px-5">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm text-ink-muted">No articles found</p>
        </div>
      )}
    </PageTransition>
  );
}
