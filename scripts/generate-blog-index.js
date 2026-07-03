#!/usr/bin/env node
/**
 * generate-blog-index.js
 * Scans all blog post HTML files, extracts metadata from blog:* meta tags,
 * and generates client/public/blog/index.html + updates sitemap.xml.
 *
 * Zero npm dependencies — uses only fs and path.
 *
 * Usage:  node scripts/generate-blog-index.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'client', 'public', 'blog');
const SITEMAP_PATH = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
const INDEX_PATH = path.join(BLOG_DIR, 'index.html');

// ── Section definitions (order matters — first match wins) ───────────
const SECTIONS = [
  { title: 'Child <em>Psychology</em>',       cats: ['psychology'],          excludeTags: ['Series'] },
  { title: 'Guides & <em>Comparisons</em>',   cats: ['guide', 'comparison'], excludeTags: ['Engineering', 'Multilingual', 'Security', 'Transparency'] },
  { title: 'Cultural <em>Stories</em>',        cats: ['culture'],             excludeTags: ['Series'] },
  { title: 'Guides &amp; <em>Transparency</em>', cats: ['guide', 'culture'],  onlyTags: ['Engineering', 'Multilingual', 'Values', 'Security', 'Transparency'] },
  { title: 'Creator <em>Program</em>',         cats: ['creators'] },
  { title: 'Series <em>Launches</em>',         matchTag: 'Series' },
  { title: 'Toronto <em>Stories</em>',         cats: ['toronto'] },
  { title: 'Inspirational <em>Stories</em>',  cats: ['inspirational'] },
  { title: 'More <em>Reads</em>',              remainder: true },
];

// ── Helpers ──────────────────────────────────────────────────────────
function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : '';
}

function formatDateLong(dateStr) {
  // "2026-06-17" → "June 17, 2026"
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDateShort(dateStr) {
  // "2026-06-17" → "Jun 2026"
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Scan all blog posts ─────────────────────────────────────────────
function scanPosts() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();

  const posts = [];

  for (const file of files) {
    const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const slug = file.replace(/\.html$/, '');

    // Extract title — strip " | My Sleepy Tale" suffix
    let title = extract(html, /<title>([\s\S]*?)<\/title>/);
    title = title.replace(/\s*\|?\s*My Sleepy Tale\s*$/, '').trim();

    const description = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/);
    const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]*)"/);
    const datePublished = extract(html, /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
    const category = extract(html, /<meta\s+name="blog:category"\s+content="([^"]*)"/);
    const tag = extract(html, /<meta\s+name="blog:tag"\s+content="([^"]*)"/);
    const readingTime = extract(html, /<meta\s+name="blog:reading-time"\s+content="(\d+)"/);
    const featured = /<meta\s+name="blog:featured"\s+content="true"/.test(html);
    const featuredLabel = extract(html, /<meta\s+name="blog:featured-label"\s+content="([^"]*)"/);

    posts.push({
      slug,
      title,
      description,
      ogImage,
      datePublished: datePublished || '2026-05-01',
      category: category || 'guide',
      tag: tag || 'Guide',
      readingTime: readingTime || '5',
      featured,
      featuredLabel,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => b.datePublished.localeCompare(a.datePublished));
  return posts;
}

// ── Assign posts to sections ────────────────────────────────────────
function assignSections(posts) {
  const featuredPosts = posts.filter(p => p.featured);
  const gridPosts = posts.filter(p => !p.featured);

  const assigned = new Set();
  const sections = [];

  for (const sec of SECTIONS) {
    const matching = [];

    for (const post of gridPosts) {
      if (assigned.has(post.slug)) continue;

      if (sec.remainder) {
        matching.push(post);
        continue;
      }

      if (sec.matchTag) {
        if (post.tag === sec.matchTag) matching.push(post);
        continue;
      }

      const catMatch = sec.cats && sec.cats.includes(post.category);
      if (!catMatch) continue;

      if (sec.onlyTags) {
        if (sec.onlyTags.includes(post.tag)) matching.push(post);
        continue;
      }

      if (sec.excludeTags && sec.excludeTags.includes(post.tag)) continue;

      matching.push(post);
    }

    if (matching.length > 0) {
      for (const p of matching) assigned.add(p.slug);
      sections.push({ title: sec.title, posts: matching });
    }
  }

  return { featuredPosts, sections };
}

// ── Generate featured card HTML ─────────────────────────────────────
function featuredCard(post) {
  return `
  <!-- Featured — ${post.title} -->
  <div class="featured" data-post data-cat="${post.category}">
    <a href="/blog/${post.slug}">
      <div class="img">
        <img src="${post.ogImage}" alt="${escapeHtml(post.title)}" loading="eager">
      </div>
      <div class="body">
        <span class="tag">${post.featuredLabel || post.tag}</span>
        <h2>${post.title}</h2>
        <p class="desc">${post.description}</p>
        <div class="meta"><span>${post.readingTime} min read</span><span class="dot"></span><span>${formatDateLong(post.datePublished)}</span><span class="dot"></span><span>${post.tag}</span></div>
      </div>
    </a>
  </div>`;
}

// ── Generate grid card HTML ─────────────────────────────────────────
function gridCard(post) {
  return `
      <a href="/blog/${post.slug}" class="card" data-post data-cat="${post.category}">
        <div class="thumb">
          <img src="${post.ogImage}" alt="${escapeHtml(post.title)}" loading="lazy">
          <span class="tag">${post.tag}</span>
        </div>
        <div class="info">
          <h3>${post.title}</h3>
          <p class="snippet">${post.description}</p>
          <div class="card-meta"><span>${post.readingTime} min</span><span class="dot"></span><span>${formatDateShort(post.datePublished)}</span></div>
        </div>
      </a>`;
}

// ── Generate index HTML ─────────────────────────────────────────────
function generateIndex(posts) {
  const { featuredPosts, sections } = assignSections(posts);
  const totalArticles = posts.length;
  const featuredCount = featuredPosts.length;
  const gridCount = totalArticles - featuredCount;

  // Featured cards
  const featuredHtml = featuredPosts.map(p => featuredCard(p)).join('\n');

  // Grid sections
  let gridHtml = '';
  for (const sec of sections) {
    gridHtml += `
    <h2 class="section-title">${sec.title}</h2>
    <div class="grid">
${sec.posts.map(p => gridCard(p)).join('\n')}
    </div>
`;
  }

  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — My Sleepy Tale | Bedtime Stories, Child Psychology & Parenting</title>
  <meta name="description" content="Expert guides on bedtime storytelling, child psychology, and raising culturally-rooted kids. Why kids love cars, planets, superheroes — and how to use it for learning.">
  <link rel="canonical" href="https://mysleepytale.com/blog/">
  <meta property="og:title" content="Blog — My Sleepy Tale">
  <meta property="og:description" content="Child psychology, bedtime guides, and parenting tips from the team behind My Sleepy Tale.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mysleepytale.com/blog/">
  <meta property="og:image" content="https://mysleepytale.com/og/cover.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://mysleepytale.com/og/cover.jpg">
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Blog","name":"My Sleepy Tale Blog","description":"Expert guides on bedtime storytelling, child psychology, and raising culturally-rooted kids.","url":"https://mysleepytale.com/blog/","publisher":{"@type":"Organization","name":"My Sleepy Tale","url":"https://mysleepytale.com"}}
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',system-ui,sans-serif;background:#0a0a0f;color:#f5f0e8;line-height:1.7;-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}

    /* Nav */
    .nav{max-width:1200px;margin:0 auto;padding:1.2rem 1.5rem;display:flex;align-items:center;justify-content:space-between}
    .nav .brand{font-family:Fraunces,Georgia,serif;font-weight:700;font-size:1.1rem;color:#f5f0e8;display:flex;align-items:center;gap:.5rem}
    .nav .app-btn{font-size:.8rem;background:rgba(240,165,0,.12);padding:.5rem 1.2rem;border-radius:2rem;color:#f0a500;font-weight:600;transition:all .2s}
    .nav .app-btn:hover{background:rgba(240,165,0,.2)}

    /* Hero */
    .hero{text-align:center;padding:3.5rem 1.5rem 2rem;max-width:700px;margin:0 auto}
    .hero .badge{display:inline-block;background:rgba(240,165,0,.08);border:1px solid rgba(240,165,0,.15);border-radius:2rem;padding:.35rem 1rem;font-size:.7rem;font-weight:700;color:#f0a500;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.2rem}
    .hero h1{font-family:Fraunces,Georgia,serif;font-size:clamp(2rem,5vw,3rem);font-weight:700;line-height:1.15;margin-bottom:.8rem}
    .hero h1 em{color:#f0a500;font-style:normal}
    .hero p{color:#8a857d;font-size:1.05rem;max-width:520px;margin:0 auto}

    /* Search + filters */
    .controls{max-width:1200px;margin:0 auto;padding:0 1.5rem 1.5rem}
    .search-row{display:flex;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
    .search-row input{flex:1;min-width:200px;padding:.75rem 1.2rem;border-radius:1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#f5f0e8;font-size:.9rem;outline:none;transition:border .2s}
    .search-row input:focus{border-color:rgba(240,165,0,.5)}
    .search-row input::placeholder{color:#5a5650}
    .cats{display:flex;gap:.4rem;overflow-x:auto;padding-bottom:.3rem;scrollbar-width:none;-ms-overflow-style:none}
    .cats::-webkit-scrollbar{display:none}
    .cat{flex-shrink:0;padding:.45rem .9rem;border-radius:2rem;font-size:.75rem;font-weight:600;border:1px solid rgba(255,255,255,.08);background:transparent;color:#8a857d;cursor:pointer;white-space:nowrap;transition:all .2s}
    .cat:hover{border-color:rgba(240,165,0,.3);color:#f0a500}
    .cat.on{background:#f0a500;color:#0a0a0f;border-color:#f0a500}
    .count{font-size:.75rem;color:#5a5650;margin-bottom:.5rem}

    /* Featured card */
    .featured{max-width:1200px;margin:0 auto 2rem;padding:0 1.5rem}
    .featured a{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:1.5rem;overflow:hidden;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);transition:all .3s}
    .featured a:hover{border-color:rgba(240,165,0,.25);transform:translateY(-2px);box-shadow:0 20px 60px rgba(0,0,0,.4)}
    .featured .img{aspect-ratio:16/10;overflow:hidden}
    .featured .img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
    .featured a:hover .img img{transform:scale(1.05)}
    .featured .body{padding:2rem 2.5rem;display:flex;flex-direction:column;justify-content:center}
    .featured .tag{display:inline-block;background:rgba(240,165,0,.1);color:#f0a500;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .7rem;border-radius:1rem;margin-bottom:.8rem;width:fit-content}
    .featured h2{font-family:Fraunces,Georgia,serif;font-size:1.6rem;font-weight:700;line-height:1.25;margin-bottom:.6rem}
    .featured .desc{color:#8a857d;font-size:.92rem;line-height:1.6;margin-bottom:1rem}
    .featured .meta{color:#5a5650;font-size:.75rem;display:flex;align-items:center;gap:.5rem}
    .featured .meta .dot{width:3px;height:3px;border-radius:50%;background:#5a5650}
    @media(max-width:768px){
      .featured a{grid-template-columns:1fr}
      .featured .body{padding:1.5rem}
      .featured h2{font-size:1.3rem}
    }

    /* Grid */
    .grid-wrap{max-width:1200px;margin:0 auto;padding:0 1.5rem 3rem}
    .section-title{font-family:Fraunces,Georgia,serif;font-size:1.3rem;font-weight:700;margin-bottom:1.2rem;color:#f5f0e8;display:flex;align-items:center;gap:.6rem}
    .section-title em{color:#f0a500;font-style:normal}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem;margin-bottom:3rem}
    .card{display:flex;flex-direction:column;border-radius:1.2rem;overflow:hidden;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);transition:all .3s;cursor:pointer}
    .card:hover{border-color:rgba(240,165,0,.2);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
    .card .thumb{aspect-ratio:16/10;overflow:hidden;position:relative}
    .card .thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
    .card:hover .thumb img{transform:scale(1.06)}
    .card .thumb .tag{position:absolute;top:.8rem;left:.8rem;background:rgba(10,10,15,.75);backdrop-filter:blur(8px);color:#f0a500;font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .65rem;border-radius:.6rem}
    .card .info{padding:1.2rem 1.3rem 1.4rem;flex:1;display:flex;flex-direction:column}
    .card h3{font-family:Fraunces,Georgia,serif;font-size:1.05rem;font-weight:700;line-height:1.3;margin-bottom:.5rem;color:#f5f0e8}
    .card .snippet{font-size:.82rem;color:#8a857d;line-height:1.55;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .card .card-meta{margin-top:.8rem;font-size:.7rem;color:#5a5650;display:flex;align-items:center;gap:.5rem}
    .card .card-meta .dot{width:3px;height:3px;border-radius:50%;background:#5a5650}
    @media(max-width:480px){
      .grid{grid-template-columns:1fr}
    }

    /* CTA */
    .cta{max-width:1200px;margin:0 auto;padding:0 1.5rem 4rem}
    .cta-box{background:linear-gradient(135deg,rgba(240,165,0,.12),rgba(240,165,0,.03));border:1px solid rgba(240,165,0,.2);border-radius:1.5rem;padding:3rem 2rem;text-align:center}
    .cta-box h2{font-family:Fraunces,Georgia,serif;font-size:1.5rem;font-weight:700;margin-bottom:.6rem}
    .cta-box h2 em{color:#f0a500;font-style:normal}
    .cta-box p{color:#8a857d;font-size:.95rem;margin-bottom:1.2rem;max-width:450px;margin-left:auto;margin-right:auto}
    .cta-box .btn{display:inline-block;background:#f0a500;color:#0a0a0f;font-weight:700;padding:.8rem 2rem;border-radius:2rem;font-size:.95rem;transition:all .2s}
    .cta-box .btn:hover{transform:scale(1.03);box-shadow:0 8px 30px rgba(240,165,0,.25)}

    /* Footer */
    .foot{max-width:1200px;margin:0 auto;padding:1.5rem;border-top:1px solid rgba(255,255,255,.05);text-align:center;color:#3a3832;font-size:.75rem}
    .foot a{color:#5a5650}
  </style>
  <script>
    function filterPosts(){
      const q=document.getElementById('search').value.toLowerCase();
      const cat=document.querySelector('.cat.on')?.dataset.cat||'all';
      let vis=0;
      document.querySelectorAll('[data-post]').forEach(c=>{
        const text=(c.textContent||'').toLowerCase();
        const postCat=c.dataset.cat||'';
        const ok=(!q||text.includes(q))&&(cat==='all'||postCat===cat);
        c.style.display=ok?'':'none';
        if(ok)vis++;
      });
      document.getElementById('count').textContent=vis+' article'+(vis!==1?'s':'');
      // Hide section headers when no cards visible in that section
      document.querySelectorAll('.section-title').forEach(h=>{
        const grid=h.nextElementSibling;
        if(grid&&grid.classList.contains('grid')){
          const hasVisible=[...grid.querySelectorAll('[data-post]')].some(c=>c.style.display!=='none');
          h.style.display=hasVisible?'':'none';
          grid.style.display=hasVisible?'':'none';
        }
      });
    }
    function setCat(btn){
      document.querySelectorAll('.cat').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      filterPosts();
    }
  </script>
<script>
(function(){
  var t = localStorage.getItem('mst:theme');
  if (t === 'day') document.documentElement.setAttribute('data-blog-theme', 'day');
})();
</script>
<style>
[data-blog-theme="day"] body { background: #FDF8F0 !important; color: #1A1040 !important; }
[data-blog-theme="day"] .topbar { background: rgba(253,248,240,.95) !important; border-bottom-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] .topbar .back { color: #5E4880 !important; }
[data-blog-theme="day"] .topbar .back:hover { color: #6B4FA8 !important; }
[data-blog-theme="day"] .topbar .brand { color: #1A1040 !important; }
[data-blog-theme="day"] .c { color: #1A1040 !important; }
[data-blog-theme="day"] h1, [data-blog-theme="day"] h2, [data-blog-theme="day"] h3, [data-blog-theme="day"] strong { color: #1A1040 !important; }
[data-blog-theme="day"] h1 em, [data-blog-theme="day"] h2 em { color: #6B4FA8 !important; }
[data-blog-theme="day"] p, [data-blog-theme="day"] li, [data-blog-theme="day"] td { color: #5E4880 !important; }
[data-blog-theme="day"] .hero .sub, [data-blog-theme="day"] .hero .ey { color: #6B4FA8 !important; border-color: rgba(107,79,168,.2) !important; background: rgba(107,79,168,.08) !important; }
[data-blog-theme="day"] a { color: #6B4FA8 !important; }
[data-blog-theme="day"] .fb, [data-blog-theme="day"] .cm, [data-blog-theme="day"] .sg-card, [data-blog-theme="day"] .tc { background: #fff !important; border-color: rgba(0,0,0,.08) !important; }
[data-blog-theme="day"] .ex { background: rgba(107,79,168,.05) !important; border-left-color: #6B4FA8 !important; }
[data-blog-theme="day"] .ex h4 { color: #6B4FA8 !important; }
[data-blog-theme="day"] .cta { background: linear-gradient(135deg,rgba(107,79,168,.1),rgba(107,79,168,.03)) !important; border-color: rgba(107,79,168,.2) !important; }
[data-blog-theme="day"] .cta .btn { background: #6B4FA8 !important; color: #fff !important; }
[data-blog-theme="day"] .related-card { background: #fff !important; border-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] .related-card h4 { color: #1A1040 !important; }
[data-blog-theme="day"] .bottom-nav { background: rgba(253,248,240,.95) !important; border-top-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] .bottom-nav a { color: #9A8BB0 !important; }
[data-blog-theme="day"] .bottom-nav a.on { color: #6B4FA8 !important; }
[data-blog-theme="day"] th { color: #6B4FA8 !important; border-bottom-color: rgba(0,0,0,.1) !important; }
[data-blog-theme="day"] tr:hover td { background: rgba(107,79,168,.03) !important; }
[data-blog-theme="day"] table { border-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] td { border-bottom-color: rgba(0,0,0,.04) !important; }
[data-blog-theme="day"] footer { color: rgba(26,16,64,.4) !important; border-top-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] .lang-card, [data-blog-theme="day"] .belief-card { background: #fff !important; border-color: rgba(0,0,0,.06) !important; }
[data-blog-theme="day"] .belief-card .name, [data-blog-theme="day"] .lang-card .name { color: #1A1040 !important; }
</style>
</head>
<body>

  <!-- Nav -->
  <nav class="nav">
    <a href="/" class="brand">\u{1F319} My Sleepy Tale</a>
    <a href="/" class="app-btn">Open App</a>
  </nav>

  <!-- Hero -->
  <div class="hero">
    <div class="badge">Stories, Science & Parenting</div>
    <h1>The <em>Sleepy Tale</em> Blog</h1>
    <p>Child psychology, bedtime guides, cultural storytelling, and the science behind why stories shape better humans.</p>
  </div>

  <!-- Search + Filters -->
  <div class="controls">
    <div class="search-row">
      <input type="text" id="search" placeholder="Search articles..." oninput="filterPosts()">
    </div>
    <div class="cats">
      <button class="cat on" data-cat="all" onclick="setCat(this)">All</button>
      <button class="cat" data-cat="psychology" onclick="setCat(this)">Child Psychology</button>
      <button class="cat" data-cat="guide" onclick="setCat(this)">Guides</button>
      <button class="cat" data-cat="toronto" onclick="setCat(this)">Toronto</button>
      <button class="cat" data-cat="culture" onclick="setCat(this)">Cultural</button>
      <button class="cat" data-cat="comparison" onclick="setCat(this)">Comparisons</button>
      <button class="cat" data-cat="creators" onclick="setCat(this)">Creators</button>
      <button class="cat" data-cat="fifa" onclick="setCat(this)">\u26BD FIFA 2026</button>
      <button class="cat" data-cat="inspirational" onclick="setCat(this)">\u2B50 Inspirational</button>
    </div>
    <p class="count" id="count">${totalArticles} article${totalArticles !== 1 ? 's' : ''}</p>
  </div>

${featuredHtml}

  <!-- Grid -->
  <div class="grid-wrap">
${gridHtml}
  </div>

  <!-- CTA -->
  <div class="cta">
    <div class="cta-box">
      <h2>Try My Sleepy Tale <em>Free Tonight</em></h2>
      <p>150+ stories. 11 traditions. 54 series. Your child's name woven into every story.</p>
      <a href="/" class="btn">Start Listening</a>
    </div>
  </div>

  <!-- Footer -->
  <footer class="foot">
    <p>\u{1F319} My Sleepy Tale \u2014 bedtime stories that feel like home</p>
    <p style="margin-top:.4rem"><a href="/">Home</a> \u00B7 <a href="/creators">Creators</a> \u00B7 <a href="/creation">Create</a></p>
  </footer>

</body>
</html>`;

  return { html, featuredCount, gridCount, totalArticles };
}

// ── Update sitemap ──────────────────────────────────────────────────
function updateSitemap(posts) {
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

  // Parse into lines for safe manipulation
  const lines = sitemap.split('\n');
  const kept = [];
  let inBlogUrl = false;
  let skipLine = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip blog-related comments
    if (/^<!--\s*(Blog index|Blog posts|Series launch blog posts|Vozinha|FIFA World Cup|Blog posts \(auto-generated\))/.test(trimmed)) {
      continue;
    }

    // Detect <url> blocks containing /blog/ in the <loc>
    if (trimmed === '<url>') {
      // Look ahead to see if this <url> block contains a /blog/ loc
      let j = i + 1;
      let blockLines = [line];
      let isBlogUrl = false;
      while (j < lines.length && !lines[j].trim().startsWith('</url>')) {
        blockLines.push(lines[j]);
        if (/<loc>https:\/\/mysleepytale\.com\/blog\//.test(lines[j])) {
          isBlogUrl = true;
        }
        j++;
      }
      if (j < lines.length) {
        blockLines.push(lines[j]); // </url> line
      }

      if (isBlogUrl) {
        // Skip entire block
        i = j;
        continue;
      }
    }

    // Also handle inline <url>...<loc>.../blog/...</loc>...</url> on one line or collapsed
    if (/<url>\s*<loc>https:\/\/mysleepytale\.com\/blog\//.test(line)) {
      // Skip lines that are collapsed blog URL blocks
      // Find the closing </url> on this or subsequent lines
      if (/<\/url>/.test(line)) {
        // Entire block on one line - remove the blog URL part
        const cleaned = line.replace(/<url>\s*<loc>https:\/\/mysleepytale\.com\/blog\/[^]*?<\/url>/, '');
        if (cleaned.trim()) kept.push(cleaned);
        continue;
      }
      // Multi-line: skip until </url>
      while (i < lines.length && !lines[i].includes('</url>')) i++;
      continue;
    }

    kept.push(line);
  }

  sitemap = kept.join('\n');

  // Build new blog URL block
  const today = new Date().toISOString().slice(0, 10);
  let blogUrls = '\n  <!-- Blog posts (auto-generated) -->\n';
  blogUrls += `  <url>\n    <loc>https://mysleepytale.com/blog/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;

  for (const post of posts) {
    const lastmod = post.datePublished;
    blogUrls += `  <url>\n    <loc>https://mysleepytale.com/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
  }

  // Insert before </urlset>
  sitemap = sitemap.replace(/<\/urlset>/, blogUrls + '</urlset>');

  // Clean up any excess blank lines
  sitemap = sitemap.replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');

  // +1 for blog index
  return posts.length + 1;
}

// ── Main ─────────────────────────────────────────────────────────────
function run() {
  const posts = scanPosts();
  const { html, featuredCount, gridCount, totalArticles } = generateIndex(posts);

  fs.writeFileSync(INDEX_PATH, html, 'utf8');

  const sitemapCount = updateSitemap(posts);

  console.log(`Blog index: ${totalArticles} posts (${featuredCount} featured, ${gridCount} grid) | Sitemap: ${sitemapCount} blog URLs`);
}

run();
