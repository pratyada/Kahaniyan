/**
 * blog-chrome.mjs — single source of truth for the canonical My Sleepy Tale blog
 * chrome (header, footer, bottom-nav, hero CSS + gradient heroes).
 *
 * Imported by BOTH:
 *   - scripts/blog-standardize.mjs   (injects chrome into the 45 post files)
 *   - scripts/generate-blog-index.js (builds the /blog listing page)
 *
 * Keeping the strings here guarantees posts and the index never drift apart.
 * No side effects — safe to import.
 */
const YEAR = new Date().getFullYear();

/* ── Canonical chrome CSS (self-contained; mstc- prefix avoids per-post CSS drift) ── */
export const CHROME_CSS = `<style id="mst-blog-chrome">
/* My Sleepy Tale — canonical blog chrome (header / footer / bottom-nav / hero) */
.mstc-hdr{position:sticky;top:0;z-index:50;background:rgba(10,10,15,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.06)}
.mstc-hdr-in{max-width:1000px;margin:0 auto;padding:.7rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.mstc-back{display:inline-flex;align-items:center;gap:.4rem;font-family:'DM Sans',system-ui,sans-serif;font-size:.85rem;font-weight:600;color:#a8a39a;text-decoration:none;transition:color .2s}
.mstc-back:hover{color:#f0a500}
.mstc-back svg{width:16px;height:16px;stroke-width:2}
.mstc-brand{font-family:Fraunces,Georgia,serif;font-size:1rem;font-weight:700;color:#f5f0e8;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem}
.mstc-hero{position:relative;overflow:hidden;display:block;width:100%;max-width:1000px;margin:0 auto}
.mstc-hero-in{aspect-ratio:16/6;min-height:170px;display:flex;flex-direction:column;justify-content:center;gap:.7rem;padding:2rem 1.5rem;text-align:center}
@media(max-width:600px){.mstc-hero-in{aspect-ratio:16/9}}
.mstc-hero-emoji{font-size:2.4rem;line-height:1}
.mstc-hero-badge{display:inline-block;margin:0 auto;font-family:'DM Sans',system-ui,sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.9);background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.25);border-radius:2rem;padding:.3rem .85rem}
.mstc-hero-title{font-family:Fraunces,Georgia,serif;font-size:clamp(1.4rem,4vw,2.1rem);font-weight:700;line-height:1.2;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.25);max-width:640px;margin:0 auto}
@media(min-width:800px){.mstc-hero{border-radius:0 0 1.5rem 1.5rem}}
/* footer */
.mstc-ftr{background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.07);margin-top:3rem}
.mstc-ftr-in{max-width:1000px;margin:0 auto;padding:2.5rem 1.5rem 1rem}
.mstc-ftr-h{font-family:Fraunces,Georgia,serif;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8a857d;margin:0 0 1.2rem;text-align:center}
.mstc-ftr-cols{display:grid;grid-template-columns:repeat(2,1fr);gap:1.4rem 1.2rem}
@media(min-width:640px){.mstc-ftr-cols{grid-template-columns:repeat(3,1fr)}}
@media(min-width:960px){.mstc-ftr-cols{grid-template-columns:repeat(6,1fr)}}
.mstc-ftr-col h4{font-family:'DM Sans',system-ui,sans-serif;font-size:.72rem;font-weight:700;color:#b8aac8;margin:0 0 .6rem}
.mstc-ftr-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.4rem}
.mstc-ftr-col a{font-size:.72rem;line-height:1.35;color:#8a857d;text-decoration:none;transition:color .2s}
.mstc-ftr-col a:hover{color:#f0a500}
.mstc-legal{margin-top:1.8rem;padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.07);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.5rem 1rem}
.mstc-legal a{font-size:.72rem;font-weight:600;color:#b8aac8;text-decoration:none;transition:color .2s}
.mstc-legal a:hover{color:#f5f0e8}
.mstc-copy{margin:.9rem 0 0;text-align:center;font-size:.68rem;color:#6e6a63;line-height:1.6}
/* bottom nav (mobile) */
.mstc-bnav{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(10,10,15,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,.06);padding-bottom:env(safe-area-inset-bottom)}
.mstc-bnav ul{display:flex;max-width:500px;margin:0 auto;padding:.4rem .5rem 0;list-style:none}
.mstc-bnav li{flex:1;text-align:center}
.mstc-bnav a{display:flex;flex-direction:column;align-items:center;gap:.15rem;padding:.45rem 0;color:#6e6a63;font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;text-decoration:none;transition:color .2s}
.mstc-bnav a:hover,.mstc-bnav a.on{color:#f0a500}
.mstc-bnav svg{width:21px;height:21px;stroke-width:1.8}
body{padding-bottom:4.2rem}
/* never let article images overflow */
article img,.article-wrap img,.wrap img,.c img{max-width:100%;height:auto}
/* Day-theme overrides (posts set data-blog-theme="day" on <html>) */
[data-blog-theme="day"] .mstc-hdr{background:rgba(253,248,240,.95);border-bottom-color:rgba(0,0,0,.07)}
[data-blog-theme="day"] .mstc-back{color:#5E4880}
[data-blog-theme="day"] .mstc-back:hover{color:#6B4FA8}
[data-blog-theme="day"] .mstc-brand{color:#1A1040}
[data-blog-theme="day"] .mstc-ftr{background:rgba(107,79,168,.03);border-top-color:rgba(0,0,0,.07)}
[data-blog-theme="day"] .mstc-ftr-h{color:#6B4FA8}
[data-blog-theme="day"] .mstc-ftr-col h4{color:#1A1040}
[data-blog-theme="day"] .mstc-ftr-col a{color:#5E4880}
[data-blog-theme="day"] .mstc-ftr-col a:hover{color:#6B4FA8}
[data-blog-theme="day"] .mstc-legal{border-top-color:rgba(0,0,0,.08)}
[data-blog-theme="day"] .mstc-legal a{color:#5E4880}
[data-blog-theme="day"] .mstc-legal a:hover{color:#1A1040}
[data-blog-theme="day"] .mstc-copy{color:#9A8BB0}
[data-blog-theme="day"] .mstc-bnav{background:rgba(253,248,240,.95);border-top-color:rgba(0,0,0,.07)}
[data-blog-theme="day"] .mstc-bnav a{color:#9A8BB0}
[data-blog-theme="day"] .mstc-bnav a.on,[data-blog-theme="day"] .mstc-bnav a:hover{color:#6B4FA8}
</style>`;

/* ── Canonical header ── */
export const HEADER = `<!-- MST-HEADER-START -->
<header class="mstc-hdr"><div class="mstc-hdr-in">
  <a href="/blog" class="mstc-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6"/></svg>All articles</a>
  <a href="/" class="mstc-brand">🌙 My Sleepy Tale</a>
</div></header>
<!-- MST-HEADER-END -->`;

/* ── Canonical footer (mirrors client/src/v2/SiteFooter.jsx) ── */
const FOOTER_COLUMNS = [
  ['Bedtime Stories', [
    ['Why Bedtime Stories Matter', '/blog/why-bedtime-stories-matter'],
    ['Screen-Free Bedtime Routines', '/blog/screen-free-bedtime-routines'],
    ['Why Family Stories Matter', '/blog/why-family-stories-matter'],
    ['Become a Creator', '/blog/become-a-creator'],
  ]],
  ['World Cup 2026', [
    ['FIFA World Cup Kids Audiobook', '/blog/fifa-world-cup-kids-audiobook'],
    ['FIFA Dallas Kids Audiobook', '/blog/fifa-world-cup-dallas-kids-audiobook'],
    ['World Cup Kids Stories', '/fifa-world-cup-kids.html'],
    ['World Cup Dallas Stories', '/fifa-world-cup-dallas-kids.html'],
  ]],
  ['Cultural Stories', [
    ['Indian Bedtime Stories', '/blog/indian-bedtime-stories'],
    ['Islamic Stories for Kids', '/blog/islamic-stories-for-kids'],
    ['Hispanic Bedtime Stories', '/blog/hispanic-bedtime-stories-for-kids'],
    ['Belief Stories for Kids', '/blog/belief-stories-for-kids'],
  ]],
  ['Child Psychology', [
    ['Why Kids Love Who Would Win', '/blog/why-kids-love-who-would-win'],
    ['Why Kids Love Cars & Buses', '/blog/why-kids-love-cars-buses'],
    ['Why Kids Love Planets', '/blog/why-kids-love-planets'],
    ['Why Kids Love Sports Stories', '/blog/why-kids-love-sports-stories'],
    ['Why Kids Need Superhero Stories', '/blog/why-kids-need-superhero-stories'],
    ['Why Kids Love Countries', '/blog/why-kids-love-countries'],
  ]],
  ['Landing Pages', [
    ['Bedtime Stories for Kids', '/bedtime-stories-for-kids'],
    ['Bedtime Story App', '/bedtime-story-app'],
    ['Hindu Bedtime Stories', '/hindu-bedtime-stories'],
    ['Islamic Stories for Kids', '/islamic-stories-for-kids'],
    ['Catholic Bedtime Stories', '/catholic-bedtime-stories'],
    ['Sikh Bedtime Stories', '/sikh-bedtime-stories'],
  ]],
  ['Series & More', [
    ['Best Bedtime Story App 2026', '/blog/best-bedtime-story-app-2026'],
    ['Best App Toronto', '/blog/best-bedtime-story-app-toronto'],
    ['Multilingual Bedtime Stories', '/blog/multilingual-bedtime-stories'],
    ['Technology Stack', '/blog/technology-stack'],
    ['Multilingual Demo', '/demo/multilingual/'],
    ['All Blog Posts', '/blog/'],
  ]],
];
const FOOTER_LEGAL = [
  ['Blog', '/blog/'],
  ['About', '/aboutus'],
  ['Terms & Conditions', '/terms.html'],
  ['Privacy Policy', '/privacy'],
  ['Refund & Cancellation', '/refund-policy.html'],
  ['Contact', 'mailto:hello@mysleepytale.com'],
];
const ext = (href) => (href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"');
const colsHtml = FOOTER_COLUMNS.map(([title, links]) => `      <div class="mstc-ftr-col">
        <h4>${title}</h4>
        <ul>${links.map(([l, h]) => `\n          <li><a href="${h}"${ext(h)}>${l}</a></li>`).join('')}
        </ul>
      </div>`).join('\n');
const legalHtml = FOOTER_LEGAL.map(([l, h]) => `<a href="${h}"${ext(h)}>${l}</a>`).join('\n      ');

export const FOOTER = `<!-- MST-FOOTER-START -->
<footer class="mstc-ftr"><div class="mstc-ftr-in">
    <p class="mstc-ftr-h">Explore More</p>
    <div class="mstc-ftr-cols">
${colsHtml}
    </div>
    <nav class="mstc-legal">
      ${legalHtml}
    </nav>
    <p class="mstc-copy">© ${YEAR} My Sleepy Tale · Toronto, Canada · Bedtime stories that teach roots &amp; values</p>
</div></footer>
<nav class="mstc-bnav"><ul>
  <li><a href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>Home</a></li>
  <li><a href="/build"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>Create</a></li>
  <li><a href="/world"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>My World</a></li>
  <li><a href="/blog" class="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>Blog</a></li>
  <li><a href="/profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Me</a></li>
</ul></nav>
<!-- MST-FOOTER-END -->`;

/* ── Branded gradient heroes for posts that ship without any image ── */
export const HERO_POSTS = {
  'belief-stories-for-kids':        { emoji: '🕊️', badge: 'Values & Belief', title: 'Stories From Every Belief', grad: 'linear-gradient(135deg,#3a2a6b,#8b5cf6 55%,#c084fc)' },
  'email-notifications-guide':      { emoji: '📬', badge: 'Transparency',     title: 'Updates, Never Spam',      grad: 'linear-gradient(135deg,#0f3057,#1e6091 55%,#48cae4)' },
  'how-to-calm-kids-at-bedtime':    { emoji: '🌙', badge: 'Bedtime Guide',    title: 'How to Calm Kids at Bedtime', grad: 'linear-gradient(135deg,#1a1440,#4338ca 55%,#818cf8)' },
  'kids-storytelling-creativity-stem': { emoji: '✨', badge: 'Creativity & STEM', title: 'Storytellers Become Better Thinkers', grad: 'linear-gradient(135deg,#134e4a,#0d9488 55%,#5eead4)' },
  'multilingual-bedtime-stories':   { emoji: '🌍', badge: 'Multilingual',     title: 'One Story, Nine Languages', grad: 'linear-gradient(135deg,#7c2d12,#ea580c 55%,#fdba74)' },
  'security-improvements-guide':    { emoji: '🛡️', badge: 'Security',         title: "Protecting Your Family's Data", grad: 'linear-gradient(135deg,#14532d,#16a34a 55%,#86efac)' },
  'technology-stack':               { emoji: '⚙️', badge: 'Engineering',      title: 'How We Built My Sleepy Tale', grad: 'linear-gradient(135deg,#1e293b,#475569 55%,#94a3b8)' },
};
export function heroHtml(slug) {
  const h = HERO_POSTS[slug];
  if (!h) return '';
  return `
<!-- MST-HERO-START -->
<div class="mstc-hero" style="background:${h.grad}">
  <div class="mstc-hero-in">
    <span class="mstc-hero-emoji">${h.emoji}</span>
    <span class="mstc-hero-badge">${h.badge}</span>
    <div class="mstc-hero-title">${h.title}</div>
  </div>
</div>
<!-- MST-HERO-END -->`;
}
