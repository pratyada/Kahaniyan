// Dynamic OG / social-crawler rendering for My Sleepy Tale.
//
// The CloudFront viewer-request function (infra/cloudfront-og-router.js) detects
// social crawlers (Facebook, Twitter/X, WhatsApp, Slack, LinkedIn, Discord,
// Telegram, Pinterest, Reddit, Googlebot, bingbot, …) and rewrites their request
// to  /api/og?path=<original-uri>  so they land here instead of the generic SPA
// shell (index.html). Humans keep getting the SPA.
//
// This handler returns a minimal HTML doc with page-specific OG/Twitter/canonical
// meta, then a <script> that redirects a real browser back to the SPA route.
//
// Story/series resolution + HTML escaping live in api/_og-data.js (shared with
// api/share.js). Culture landing pages / blog already ship rich static HTML from
// S3 and are EXCLUDED from rewriting by the CloudFront function — their entries
// below are a completeness fallback for direct /api/og?path=… hits only.

import {
  resolveStory, resolveKidStory, renderOgHtml, DEFAULT_OG_IMAGE, SITE,
} from './_og-data.js';

const OG_IMAGE = `${SITE}/og-image.jpg`; // our own branded 1200x630, never Unsplash

// Static route → meta. Keyed by exact pathname.
const STATIC_META = {
  '/': {
    title: 'My Sleepy Tale — A bedtime story made just for your child',
    description: "Every night, a fresh story with your child's name, their family, their pet, and the lesson you choose. AI-narrated in a voice that sounds like home. Try free.",
    image: OG_IMAGE,
  },
  '/v2': {
    title: 'My Sleepy Tale — Listen, Build & Share Bedtime Stories',
    description: 'Personalized bedtime stories from 11 traditions, plus a studio where kids build and record their own. AI-narrated, free to start.',
    image: OG_IMAGE,
  },
  '/aboutus': {
    title: 'About My Sleepy Tale — Bedtime stories for every family',
    description: 'We are a family building bedtime stories that reflect every child — their name, their culture, their values. Learn our story.',
    image: OG_IMAGE,
  },
  '/creators': {
    title: 'Creator Studio — Kids create & record their own bedtime stories',
    description: 'Your child can imagine, record and share their very own bedtime stories, earn stars, and build collaborative chain stories with friends. Free on My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/creatives': {
    title: 'Creatives — My Sleepy Tale',
    description: 'Explore creative bedtime story formats, reels, and artwork from My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/studio': {
    title: 'Studio — My Sleepy Tale',
    description: 'Create bedtime stories, images, and audio with the My Sleepy Tale studio.',
    image: OG_IMAGE,
  },
  '/lessons': {
    title: 'Cultural Wisdom Stories — My Sleepy Tale',
    description: 'Bedtime stories that teach real values, drawn from Hindu, Islamic, Christian, Sikh, Jewish, Buddhist, Jain and universal traditions. Listen free.',
    image: OG_IMAGE,
  },
  '/library': {
    title: 'Story Library — My Sleepy Tale',
    description: 'Browse 200+ personalized audio bedtime stories from 11 cultural traditions. Listen free on My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/search': {
    title: 'Search Bedtime Stories — My Sleepy Tale',
    description: 'Search 200+ audio bedtime stories by name, tradition, theme, or age. Listen free on My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/curators': {
    title: 'Story Creators — My Sleepy Tale',
    description: 'Meet the creators writing and narrating bedtime stories on My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/summer': {
    title: 'Summer Adventures — A personalized 8-week learning journey',
    description: 'Turn your child\'s report card into a personalized 8-week summer learning journey with a story every day. My Sleepy Tale Summer Pass.',
    image: OG_IMAGE,
  },
  '/roadmap': {
    title: 'Roadmap — My Sleepy Tale',
    description: 'What we are building next at My Sleepy Tale.',
    image: OG_IMAGE,
  },
  '/privacy': {
    title: 'Privacy Policy — My Sleepy Tale',
    description: 'How My Sleepy Tale protects your family\'s data and your child\'s privacy.',
    image: OG_IMAGE,
  },
  '/invest': {
    title: 'Invest in My Sleepy Tale — SAFE at $1M Cap · Friends & Family',
    description: 'Back My Sleepy Tale, the AI-powered personalized bedtime story app. SAFE note at $1M valuation cap. Transparent cap table, real-time backer board. Min CA$50.',
    image: OG_IMAGE,
  },
  '/admin': {
    title: 'My Sleepy Tale — Admin Dashboard',
    description: 'Admin panel for My Sleepy Tale. User management, analytics, investors, team.',
    image: OG_IMAGE,
  },
  '/blog': {
    title: 'My Sleepy Tale Blog — Bedtime, parenting & culture',
    description: 'Ideas on bedtime routines, multicultural parenting, and raising kids with values. From the My Sleepy Tale team.',
    image: OG_IMAGE,
  },
  // Culture / SEO landing pages (fallback only — static HTML in S3 serves these).
  '/bedtime-stories-for-kids': {
    title: 'Bedtime Stories for Kids — Personalized Audio Stories | My Sleepy Tale',
    description: "101 audio bedtime stories from 11 cultural traditions. Personalized with your child's name. Hindu, Islamic, Catholic, Hispanic, African and more. Listen free.",
    image: OG_IMAGE,
  },
  '/bedtime-story-app': {
    title: 'Best Bedtime Story App 2026 — Free Personalized Stories | My Sleepy Tale',
    description: '101 personalized audio bedtime stories from 11 cultural traditions. No screens. The bedtime story app parents and kids love. Free to start.',
    image: OG_IMAGE,
  },
  '/hindu-bedtime-stories': {
    title: 'Hindu Bedtime Stories for Kids — Krishna, Hanuman & Indian Mythology',
    description: 'Audio bedtime stories from Hindu mythology. Krishna, Hanuman, Ganesh and more — personalized for your child. Listen free.',
    image: OG_IMAGE,
  },
  '/islamic-stories-for-kids': {
    title: 'Islamic Stories for Kids — Prophet Stories & Muslim Bedtime Tales',
    description: 'Audio bedtime stories from Islamic tradition. Prophet stories, Quran tales, and moral lessons — personalized for your child. Listen free.',
    image: OG_IMAGE,
  },
  '/sikh-bedtime-stories': {
    title: 'Sikh Bedtime Stories for Kids — Guru Nanak, Ten Gurus & Punjab Tales',
    description: "43 Sikh bedtime stories for kids. Guru Nanak Dev Ji, the Ten Gurus, Khalsa, langar, and Punjab tales. Audio stories personalized with your child's name. Free.",
    image: `${SITE}/og/sikh-stories.jpg`,
  },
  '/catholic-bedtime-stories': {
    title: 'Catholic Bedtime Stories for Kids — Saints, Parables & Bible Tales',
    description: 'Audio bedtime stories from the Catholic tradition. Saints, parables, and Bible tales — personalized for your child. Listen free.',
    image: OG_IMAGE,
  },
  '/hispanic-bedtime-stories': {
    title: 'Hispanic Bedtime Stories for Kids — Latino Folklore & Cultural Tales',
    description: 'Audio bedtime stories from Hispanic and Latino traditions. Folklore, family tales, and cultural stories — personalized for your child. Listen free.',
    image: OG_IMAGE,
  },
  '/fifa-world-cup-kids': {
    title: 'FIFA World Cup 2026 for Kids — Bedtime Audiobook Stories | My Sleepy Tale',
    description: 'FIFA 2026 bedtime audiobooks in English, Spanish, French & Hindi. 5 episodes, 48 countries. Your child falls asleep learning about the beautiful game.',
    image: OG_IMAGE,
  },
  '/fifa-world-cup-dallas-kids': {
    title: 'FIFA World Cup 2026 Dallas for Kids — Bedtime Audiobook Stories | My Sleepy Tale',
    description: 'FIFA 2026 Dallas bedtime audiobooks — AT&T Stadium, Texas legends, 4 languages. 5 episodes, 48 countries. Your child falls asleep learning about the beautiful game.',
    image: OG_IMAGE,
  },
};

const DEFAULT_META = {
  title: 'My Sleepy Tale — Personalized bedtime stories for your child',
  description: "Every night, a fresh story with your child's name, their family, their pet, and the lesson you choose. AI-narrated in a voice that sounds like home.",
  image: OG_IMAGE,
};

// Strip a trailing slash (except root) so '/aboutus/' matches '/aboutus'.
function normalizePath(p) {
  if (!p) return '/';
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export default async function handler(req, res) {
  // The CloudFront function passes the original URI (path+query) as ?path=.
  // Fall back to req.url / '/' so direct hits still work.
  let raw = req.query?.path || req.query?.p || '';
  if (!raw && req.url) {
    try {
      const u = new URL(req.url, `http://${req.headers?.host || 'mysleepytale.com'}`);
      raw = u.searchParams.get('path') || u.searchParams.get('p') || '';
    } catch {}
  }
  if (!raw) raw = '/';

  let pathname = '/';
  let params = new URLSearchParams();
  try {
    const u = new URL(raw, SITE);
    pathname = normalizePath(decodeURIComponent(u.pathname));
    params = u.searchParams;
  } catch {
    pathname = normalizePath(raw.split('?')[0] || '/');
  }

  const canonical = `${SITE}${pathname}`;
  let meta = null;   // { title, description, image, type?, redirectUrl? }

  // ── Dynamic: story players ──
  // /player?storyId=…  and  /v2/player?storyId=…
  if (pathname === '/player' || pathname === '/v2/player') {
    const sid = params.get('storyId') || params.get('id') || '';
    if (sid) {
      const s = await resolveStory(sid);
      meta = { ...s, type: 'article', redirectUrl: `${SITE}${pathname}?storyId=${encodeURIComponent(sid)}` };
    }
  }

  // /story/:id
  if (!meta) {
    const m = pathname.match(/^\/story\/(.+)$/);
    if (m) {
      const s = await resolveStory(m[1]);
      meta = { ...s, type: 'article', redirectUrl: `${SITE}/story/${encodeURIComponent(m[1])}` };
    }
  }

  // /v2/player/:id  — built-in story first, else a shared (approved) kid story.
  if (!meta) {
    const m = pathname.match(/^\/v2\/player\/(.+)$/);
    if (m) {
      const id = m[1];
      const s = await resolveStory(id);
      if (s.found) {
        meta = { ...s, type: 'article', redirectUrl: `${SITE}/v2/player/${encodeURIComponent(id)}` };
      } else {
        const kid = await resolveKidStory(id);
        if (kid) meta = { ...kid, type: 'article' };
        else meta = { ...s, type: 'article', redirectUrl: `${SITE}/v2/player/${encodeURIComponent(id)}` };
      }
    }
  }

  // /series/:id  and  /v2/series/:id
  if (!meta) {
    const m = pathname.match(/^\/(?:v2\/)?series\/(.+)$/);
    if (m) {
      const s = await resolveStory(m[1]);
      const v2 = pathname.startsWith('/v2/');
      meta = { ...s, type: 'article', redirectUrl: `${SITE}${v2 ? '/v2' : ''}/series/${encodeURIComponent(m[1])}` };
    }
  }

  // /collection/:id  — collections render on Home; give them a sensible default.
  if (!meta) {
    const m = pathname.match(/^\/collection\/(.+)$/);
    if (m) {
      meta = { ...DEFAULT_META, redirectUrl: `${SITE}/collection/${encodeURIComponent(m[1])}` };
    }
  }

  // ── Static routes ──
  if (!meta && STATIC_META[pathname]) {
    meta = { ...STATIC_META[pathname] };
  }

  // Blog posts /blog/<slug> — generic blog meta fallback.
  if (!meta && pathname.startsWith('/blog/')) {
    meta = { ...STATIC_META['/blog'] };
  }

  // ── Default ──
  if (!meta) meta = { ...DEFAULT_META };

  const html = renderOgHtml({
    title: meta.title,
    description: meta.description,
    image: meta.image || DEFAULT_OG_IMAGE,
    canonical,
    redirectUrl: meta.redirectUrl || canonical,
    type: meta.type || 'website',
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
}
