// V2 site footer — SEO "Explore More" link columns + legal + contact.
// EVERY link opens in a new tab so the V2 shell/menu never changes (full consistency).
// URLs mirror the production Home footer; legal pages are static (see client/public).
import { GOLD } from './ui.js';

const COLUMNS = [
  {
    title: 'Bedtime Stories',
    links: [
      ['Why Bedtime Stories Matter', '/blog/why-bedtime-stories-matter'],
      ['Screen-Free Bedtime Routines', '/blog/screen-free-bedtime-routines'],
      ['Why Family Stories Matter', '/blog/why-family-stories-matter'],
      ['Become a Creator', '/blog/become-a-creator'],
    ],
  },
  {
    title: 'World Cup 2026',
    links: [
      ['FIFA World Cup Kids Audiobook', '/blog/fifa-world-cup-kids-audiobook'],
      ['FIFA Dallas Kids Audiobook', '/blog/fifa-world-cup-dallas-kids-audiobook'],
      ['World Cup Kids Stories', '/fifa-world-cup-kids.html'],
      ['World Cup Dallas Stories', '/fifa-world-cup-dallas-kids.html'],
    ],
  },
  {
    title: 'Cultural Stories',
    links: [
      ['Indian Bedtime Stories', '/blog/indian-bedtime-stories'],
      ['Islamic Stories for Kids', '/blog/islamic-stories-for-kids'],
      ['Hispanic Bedtime Stories', '/blog/hispanic-bedtime-stories-for-kids'],
      ['Belief Stories for Kids', '/blog/belief-stories-for-kids'],
    ],
  },
  {
    title: 'Child Psychology',
    links: [
      ['Why Kids Love Who Would Win', '/blog/why-kids-love-who-would-win'],
      ['Why Kids Love Cars & Buses', '/blog/why-kids-love-cars-buses'],
      ['Why Kids Love Planets', '/blog/why-kids-love-planets'],
      ['Why Kids Love Sports Stories', '/blog/why-kids-love-sports-stories'],
      ['Why Kids Need Superhero Stories', '/blog/why-kids-need-superhero-stories'],
      ['Why Kids Love Countries', '/blog/why-kids-love-countries'],
    ],
  },
  {
    title: 'Landing Pages',
    links: [
      ['Bedtime Stories for Kids', '/bedtime-stories-for-kids'],
      ['Bedtime Story App', '/bedtime-story-app'],
      ['Hindu Bedtime Stories', '/hindu-bedtime-stories'],
      ['Islamic Stories for Kids', '/islamic-stories-for-kids'],
      ['Catholic Bedtime Stories', '/catholic-bedtime-stories'],
      ['Hispanic Bedtime Stories', '/hispanic-bedtime-stories'],
      ['Sikh Bedtime Stories', '/sikh-bedtime-stories'],
    ],
  },
  {
    title: 'Series & More',
    links: [
      ['Best Bedtime Story App 2026', '/blog/best-bedtime-story-app-2026'],
      ['Best App Toronto', '/blog/best-bedtime-story-app-toronto'],
      ['Multilingual Bedtime Stories', '/blog/multilingual-bedtime-stories'],
      ['Technology Stack', '/blog/technology-stack'],
      ['Multilingual Demo', '/demo/multilingual/'],
      ['All Blog Posts', '/blog/'],
    ],
  },
];

// Top row: general links + the prominent compliance hub.
const LEGAL = [
  ['Blog', '/blog/'],
  ['About', '/aboutus'],
  ['Privacy, Safety & Compliance', '/compliance.html'],
  ['Contact', 'mailto:hello@mysleepytale.com'],
];

// Compliance & Policies — grouped so it reads cleanly. All are first-party static
// pages; link to the reachable .html URLs (clean-URL rewrites only cover /blog).
const POLICIES = [
  ['Privacy Policy', '/privacy.html'],
  ["Children's Privacy", '/childrens-privacy.html'],
  ['Voice & Recording Consent', '/voice-consent.html'],
  ['Cookie Policy', '/cookie-policy.html'],
  ['Terms & Conditions', '/terms.html'],
  ['Refund & Cancellation', '/refund-policy.html'],
  ['Community Guidelines', '/community-guidelines.html'],
  ['Accessibility', '/accessibility.html'],
  ['Security', '/security.html'],
  ['Copyright & Takedown', '/copyright.html'],
];

function ext(href) {
  return href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' };
}

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/8 pt-8">
      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <a href="https://www.producthunt.com/products/my-sleepy-tale-personalized-audio-book?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-my-sleepy-tale-personalized-audio-book" target="_blank" rel="noopener noreferrer">
          <img alt="My Sleepy Tale on Product Hunt" style={{ height: 40, width: 'auto' }} src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1174662&theme=dark" />
        </a>
        <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" aria-label="Listed on Sell With Boost">
          <img alt="Listed on Sell With Boost" style={{ height: 40, width: 'auto' }} src="https://sellwithboost.com/badge/listing.svg" />
        </a>
      </div>

      {/* Explore More — SEO link columns */}
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A6B8A] mb-4 text-center lg:text-left" style={{ fontFamily: 'Lora, serif' }}>Explore More</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-6">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-bold text-[#B8AAC8] mb-2.5">{col.title}</p>
            <ul className="space-y-1.5">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} {...ext(href)} className="text-[11px] leading-snug text-[#7A6B8A] hover:text-[#B8AAC8] transition">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Compliance & Policies */}
      <div className="mt-9 border-t border-white/8 pt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A6B8A] mb-3 text-center" style={{ fontFamily: 'Lora, serif' }}>Compliance &amp; Policies</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-2xl mx-auto">
          {POLICIES.map(([label, href]) => (
            <a key={href} href={href} {...ext(href)} className="text-[11px] leading-snug text-[#7A6B8A] hover:text-[#B8AAC8] transition">{label}</a>
          ))}
        </nav>
      </div>

      {/* Legal + contact */}
      <div className="mt-8 border-t border-white/8 pt-6 flex flex-col items-center gap-3">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {LEGAL.map(([label, href]) => (
            <a key={href} href={href} {...ext(href)} className="text-[11px] font-semibold text-[#B8AAC8] hover:text-[#F7F1E8] transition">{label}</a>
          ))}
        </nav>
        <p className="text-[10px] text-[#7A6B8A] text-center leading-relaxed">
          © {new Date().getFullYear()} My Sleepy Tale · Toronto, Canada · Bedtime stories that teach roots &amp; values
        </p>
      </div>
    </footer>
  );
}
