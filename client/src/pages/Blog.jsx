// Blog — image card grid inside the app shell, matching the static /blog/ design.

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition.jsx';

const POSTS = [
  { slug: 'jean-lumb-kindergarten-bedtime-stories-toronto', title: 'Jean Lumb PS Kindergarten Bedtime Stories — Real Adventures, Real Kids', desc: 'We turned real kindergarten adventures at Jean Lumb Public School into bedtime audio stories. Canoe Landing Park shapes walk, school concert, Evergreen Brick Works field trip — all personalized with your child\'s name.', cat: 'toronto', tag: 'Featured', min: 8, img: 'https://firebasestorage.googleapis.com/v0/b/qissaa-61a78.firebasestorage.app/o/story-gallery%2Frk_ep1_canoe%2F1779129759962_0.jpeg?alt=media&token=df4fa13e-7b64-4860-bb65-61a300f6da93', featured: true },
  { slug: 'why-kids-love-who-would-win', title: 'Why Do Kids Love "Who Would Win?" — The Psychology Behind It', desc: 'Lion vs Eagle. Ant vs Elephant. Why your 5-year-old is obsessed with these debates — and why it\'s brilliant for their brain.', cat: 'psychology', tag: 'Psychology', min: 7, img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-kids-love-cars-buses', title: 'Why Are 4-6 Year Olds Obsessed with Cars, Buses & Trucks?', desc: 'The developmental science behind your child\'s vehicle fascination — predictable movement, cause and effect, and agency.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-kids-love-planets', title: 'Why Kids Are Fascinated by Planets and Space', desc: 'The Pluto Effect: why your child feels sad for a rock 5.9 billion km away — and why that\'s amazing for their empathy.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-kids-love-sports-stories', title: 'Why Sports Stories Build Discipline, Teamwork & Grit', desc: 'How cricket, swimming, and soccer stories teach persistence and fair play — better than any lecture.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-kids-need-superhero-stories', title: 'Why Every Child Needs Superhero Stories (Not the Marvel Kind)', desc: 'The superheroes your child needs have patience, empathy, and kindness as their powers.', cat: 'psychology', tag: 'Psychology', min: 6, img: 'https://images.unsplash.com/photo-1521714161819-15534968fc5f?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-family-stories-matter', title: 'Why Family Stories Are the Most Powerful Bedtime Tool', desc: 'Emory University research: the #1 predictor of a child\'s resilience is knowing their family story.', cat: 'psychology', tag: 'Research', min: 7, img: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-kids-love-countries', title: 'Why Stories About Countries & Flags Build Open-Minded Kids', desc: 'Japan\'s cherry blossoms. Egypt\'s pyramids. How place-based stories reduce implicit bias in children.', cat: 'psychology', tag: 'Global', min: 6, img: 'https://images.unsplash.com/photo-1633477189729-9290b3261d0a?w=600&h=380&fit=crop&q=80', section: 'psychology' },
  { slug: 'why-bedtime-stories-matter', title: 'Why Bedtime Stories Matter More Than You Think', desc: 'Research shows kids who hear stories before bed develop 26% better vocabulary. Here\'s the science.', cat: 'guide', tag: 'Guide', min: 5, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=380&fit=crop&q=80', section: 'guides' },
  { slug: 'best-bedtime-story-app-2026', title: 'Best Bedtime Story App in 2026 — Calm vs Moshi vs My Sleepy Tale', desc: 'Feature-by-feature comparison. Where each app wins — and where My Sleepy Tale is different.', cat: 'comparison', tag: 'Comparison', min: 7, img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=380&fit=crop&q=80', section: 'guides' },
  { slug: 'best-bedtime-story-app-toronto', title: 'Best Bedtime Story App for Multicultural Families in Toronto', desc: '5 reasons parents in Brampton, Scarborough, and Mississauga are switching to My Sleepy Tale.', cat: 'toronto', tag: 'Toronto', min: 8, img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=380&fit=crop&q=80', section: 'guides' },
  { slug: 'indian-bedtime-stories', title: 'Indian Bedtime Stories for Kids — Krishna to Panchatantra', desc: '15 Indian classics reimagined as audio bedtime tales. For NRI families who want their kids connected to roots.', cat: 'culture', tag: 'Indian', min: 6, img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=380&fit=crop&q=80', section: 'culture' },
  { slug: 'islamic-stories-for-kids', title: 'Islamic Stories for Kids — Prophet Stories for Bedtime', desc: 'Stories of Prophet Muhammad (peace be upon him) told beautifully. Compassion, patience, honesty — the Islamic way.', cat: 'culture', tag: 'Islamic', min: 6, img: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=600&h=380&fit=crop&q=80', section: 'culture' },
  { slug: 'become-a-creator', title: 'How to Become a Story Creator — The Complete Guide', desc: 'Full workflow: write, submit, admin review, image generation, audio narration, publish. Everything explained.', cat: 'creators', tag: 'Creator Guide', min: 10, img: 'https://mysleepytale.com/dsp_ep1_development.png', section: 'creators' },
  { slug: 'creator-credits-guide', title: 'Creator Credits Guide — How Earning Works', desc: 'Everything you need to know about earning credits as a story creator on My Sleepy Tale.', cat: 'creators', tag: 'Credits', min: 5, img: 'https://mysleepytale.com/dsp_ep1_development.png', section: 'creators' },
  { slug: 'rainbow-kindergarten-series-2026', title: 'Rainbow Kindergarten Adventures — Our First Series', desc: '3 episodes featuring Mr. Zak, Shelagh, and the Rainbow Batch of 2026 at Jean Lumb Public School.', cat: 'creators', tag: 'Series', min: 5, img: 'https://firebasestorage.googleapis.com/v0/b/qissaa-61a78.firebasestorage.app/o/story-gallery%2Frk_ep2_concert%2F1779131207663_0.jpeg?alt=media&token=72a55ede-4c5f-47ce-a4bc-d51f9548c94c', section: 'creators' },
  { slug: 'bluey-bingo-niagara-victoria-day', title: 'Bluey & Bingo\'s Victoria Day Adventure at Niagara Falls', desc: 'A bedtime story where Bluey and Bingo visit Niagara Falls for Victoria Day fireworks. For Toronto kids who love Bluey.', cat: 'toronto', tag: 'Toronto', min: 5, img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=380&fit=crop&q=80', section: 'more' },
];

const CAT_KEYS = ['all', 'psychology', 'guide', 'toronto', 'culture', 'comparison', 'creators'];

const SECTION_KEYS = ['psychology', 'guides', 'culture', 'creators', 'more'];

function BlogCard({ post }) {
  const { t } = useTranslation();
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-bg-surface ring-1 ring-white/5 transition hover:ring-gold/20 active:scale-[0.98]"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
          {post.tag}
        </span>
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="font-display text-[15px] font-bold text-ink leading-snug mb-1.5 line-clamp-2">{post.title}</h3>
        <p className="text-[12px] text-ink-muted leading-relaxed line-clamp-2 flex-1">{post.desc}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-ink-dim">
          <span>{t('blog.min', { count: post.min })}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-dim" />
          <span>May 2026</span>
        </div>
      </div>
    </a>
  );
}

export default function Blog() {
  const { t } = useTranslation();
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
  const isFiltering = cat !== 'all' || query;

  // Group by section when showing "All"
  const sections = useMemo(() => {
    if (isFiltering) return null;
    return SECTION_KEYS.map(key => ({
      key,
      posts: POSTS.filter(p => !p.featured && p.section === key),
    })).filter(s => s.posts.length > 0);
  }, [isFiltering]);

  // Flat filtered list (when searching/filtering)
  const flatFiltered = filtered.filter(p => !p.featured);

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Header */}
      <div className="text-center px-5 pt-8 pb-1">
        <span className="inline-block bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-[.15em] px-3 py-1 rounded-full ring-1 ring-gold/15 mb-3">
          {t('blog.badge')}
        </span>
        <h1 className="font-display text-[clamp(1.6rem,5vw,2.2rem)] font-bold text-ink leading-tight">
          The <span className="text-gold">Sleepy Tale</span> Blog
        </h1>
        <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('blog.search')}
          className="w-full rounded-2xl bg-bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-dim outline-none ring-1 ring-white/5 focus:ring-gold/40 transition"
        />
      </div>

      {/* Categories */}
      <div className="px-5 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {CAT_KEYS.map(key => (
          <button
            key={key}
            onClick={() => setCat(key)}
            className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-bold transition ${
              cat === key
                ? 'bg-gold text-bg-base'
                : 'bg-bg-surface text-ink-muted ring-1 ring-white/5'
            }`}
          >
            {t(`blog.categories.${key}`)}
          </button>
        ))}
      </div>

      <div className="text-[11px] text-ink-dim px-5 mb-3">{filtered.length} {filtered.length !== 1 ? t('blog.articles') : t('blog.article')}</div>

      {/* Featured card — side by side on desktop */}
      {featured && (
        <a
          href={`/blog/${featured.slug}`}
          className="group block mx-5 mb-6 rounded-2xl overflow-hidden bg-bg-surface ring-1 ring-white/5 transition hover:ring-gold/20 active:scale-[0.99] lg:grid lg:grid-cols-2"
        >
          <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
          </div>
          <div className="p-5 lg:p-8 flex flex-col justify-center">
            <span className="inline-block w-fit bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-3">{featured.tag}</span>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-ink leading-snug mb-2">{featured.title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{featured.desc}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-dim">
              <span>{t('blog.minRead', { count: featured.min })}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-ink-dim" />
              <span>May 2026</span>
              <span className="w-[3px] h-[3px] rounded-full bg-ink-dim" />
              <span>Toronto</span>
            </div>
          </div>
        </a>
      )}

      {/* Grouped sections (default "All" view) */}
      {sections && sections.map(s => (
        <div key={s.key} className="px-5 mb-6">
          <h2 className="font-display text-lg font-bold text-ink mb-3">
            {t(`blog.sections.${s.key}`)} <span className="text-gold">{t(`blog.sections.${s.key}Highlight`)}</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {s.posts.map(p => <BlogCard key={p.slug} post={p} />)}
          </div>
        </div>
      ))}

      {/* Flat filtered grid (search/filter active) */}
      {isFiltering && (
        <div className="px-5 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {flatFiltered.map(p => <BlogCard key={p.slug} post={p} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center px-5">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm text-ink-muted">{t('blog.noResults')}</p>
        </div>
      )}

      {/* Bottom spacer for nav */}
      <div className="h-28" />
    </PageTransition>
  );
}
