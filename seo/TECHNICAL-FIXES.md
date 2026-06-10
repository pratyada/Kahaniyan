# Technical SEO Fixes — My Sleepy Tale

## Priority Order (Do in This Sequence)

---

## P0: Critical (Do This Week)

### 1. Pre-Rendering / Static Generation for SEO Pages

**Problem:** React SPA (client-side rendered) means Googlebot sees an empty `<div id="root"></div>`. Google may render JS eventually, but it's unreliable and slow.

**Solutions (pick one):**

#### Option A: Prerender.io (Fastest to implement)
- Sign up at prerender.io (free tier: 250 pages/mo)
- Add middleware to Vercel that serves pre-rendered HTML to bots
- In `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(Googlebot|bingbot|Baiduspider).*"
        }
      ],
      "destination": "https://service.prerender.io/https://mysleepytale.com/$1"
    }
  ]
}
```

#### Option B: React-Snap (Static Pre-rendering at Build)
```bash
npm install react-snap
```
Add to `package.json`:
```json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "include": ["/", "/stories", "/about", "/blog"]
  }
}
```

#### Option C: Move SEO Pages to Next.js (Best long-term)
- Create a separate Next.js app for blog + landing pages
- Deploy on same domain: `mysleepytale.com/blog/` via Vercel path rewrites
- Keep React SPA for the authenticated app experience
- This gives you SSG/SSR for all content pages

**Recommendation:** Option A now (takes 30 min), Option C within 30 days.

---

### 2. Meta Tags Per Route

**Problem:** SPA has single `index.html` with one set of meta tags for all routes.

**Fix with react-helmet-async:**
```bash
npm install react-helmet-async
```

```jsx
// Wrap app in HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>...</Router>
    </HelmetProvider>
  );
}

// Per page:
import { Helmet } from 'react-helmet-async';

function HinduStoriesPage() {
  return (
    <>
      <Helmet>
        <title>Hindu Bedtime Stories for Kids | My Sleepy Tale</title>
        <meta name="description" content="Discover beautiful Hindu bedtime stories for children. Tales from the Ramayana, Mahabharata, and Indian mythology that teach values through adventure." />
        <meta property="og:title" content="Hindu Bedtime Stories for Kids" />
        <meta property="og:description" content="Tales from Indian mythology for bedtime" />
        <meta property="og:image" content="https://mysleepytale.com/og/hindu-stories.png" />
        <link rel="canonical" href="https://mysleepytale.com/hindu-bedtime-stories/" />
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

**Note:** Meta tags via JS won't help unless you also implement pre-rendering (Fix #1). Do both.

---

### 3. Sitemap.xml

Create `/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mysleepytale.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mysleepytale.com/bedtime-stories-for-kids/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mysleepytale.com/hindu-bedtime-stories/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mysleepytale.com/islamic-stories-for-kids/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Add all public pages -->
</urlset>
```

**For dynamic content (blog posts),** use a build script:
```js
// scripts/generate-sitemap.js
const fs = require('fs');
const pages = [
  '/', '/bedtime-stories-for-kids/', '/hindu-bedtime-stories/',
  '/islamic-stories-for-kids/', '/christian-bedtime-stories/',
  // ... add all pages
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>https://mysleepytale.com${p}</loc></url>`).join('\n')}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
```

Run this as part of your build: `"prebuild": "node scripts/generate-sitemap.js"`

---

### 4. robots.txt

Create `/public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://mysleepytale.com/sitemap.xml

# Block internal/auth routes from crawling
Disallow: /api/
Disallow: /dashboard/
Disallow: /admin/
Disallow: /auth/
```

---

### 5. Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Add property: `mysleepytale.com`
3. Verify via DNS TXT record (recommended) or HTML file
4. Submit sitemap: `https://mysleepytale.com/sitemap.xml`
5. Request indexing of homepage

---

## P1: Important (Do Within 2 Weeks)

### 6. Schema Markup (Structured Data)

#### SoftwareApplication Schema (Homepage)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "My Sleepy Tale",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "description": "Bedtime story app for kids featuring personalized tales from Hindu, Muslim, Christian, Sikh, Buddhist, and universal traditions.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
}
</script>
```

#### FAQ Schema (Blog Posts)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the best bedtime stories for 5 year olds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best bedtime stories for 5 year olds are..."
      }
    }
  ]
}
</script>
```

#### Article Schema (Blog Posts)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "10 Best Hindu Bedtime Stories for Kids",
  "author": {
    "@type": "Person",
    "name": "My Sleepy Tale Team"
  },
  "datePublished": "2026-05-14",
  "publisher": {
    "@type": "Organization",
    "name": "My Sleepy Tale",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mysleepytale.com/logo.png"
    }
  }
}
</script>
```

---

### 7. Open Graph + Twitter Cards

Add to every page via react-helmet:
```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="My Sleepy Tale" />
<meta property="og:title" content="Page Title Here" />
<meta property="og:description" content="Page description here" />
<meta property="og:image" content="https://mysleepytale.com/og/page-image.png" />
<meta property="og:url" content="https://mysleepytale.com/page-url/" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title Here" />
<meta name="twitter:description" content="Page description here" />
<meta name="twitter:image" content="https://mysleepytale.com/og/page-image.png" />
```

Create OG images (1200x630px) for each major page.

---

### 8. Internal Linking Structure

- Every blog post links to 2-3 other blog posts
- Every blog post links to 1 landing page (tradition or feature page)
- Every landing page links to the app/signup
- Sidebar/footer: link to all tradition pages
- Breadcrumbs on all pages (also helps Schema)

---

## P2: Nice to Have (Month 2)

### 9. Page Speed Optimization

- Lazy load images below the fold
- Use WebP/AVIF image formats
- Code-split routes (React.lazy)
- Preload critical fonts
- Minimize third-party scripts
- Target: LCP < 2.5s, CLS < 0.1, INP < 200ms

### 10. Canonical URLs

Add to every page:
```html
<link rel="canonical" href="https://mysleepytale.com/exact-page-url/" />
```
Prevents duplicate content issues (trailing slashes, query params, etc.)

### 11. 404 Page

Create a custom 404 page that:
- Suggests popular stories/pages
- Has a search function
- Links back to homepage
- Is pre-rendered (not blank div)

### 12. URL Structure

Clean URLs for all content:
- Blog: `/blog/hindu-bedtime-stories-for-kids/`
- Stories: `/stories/the-monkey-and-the-crocodile/`
- Landing: `/bedtime-stories-for-kids/`
- No query params, no hash routing for public pages

### 13. Image Optimization

- All images need descriptive `alt` text
- Use descriptive filenames: `hindu-bedtime-story-krishna.webp` not `img_001.png`
- Serve responsive images with `srcset`
- Compress all images (TinyPNG or build tool)

### 14. Web Vitals Monitoring

Add web-vitals library:
```bash
npm install web-vitals
```
```js
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

---

## Implementation Checklist

| Fix | Effort | Impact | Status |
|-----|--------|--------|--------|
| Pre-rendering (Prerender.io) | 30 min | Critical | [ ] |
| robots.txt | 5 min | High | [ ] |
| sitemap.xml | 30 min | High | [ ] |
| Google Search Console | 10 min | High | [ ] |
| Meta tags (react-helmet) | 2 hours | High | [ ] |
| Schema markup | 1 hour | Medium | [ ] |
| OG tags | 1 hour | Medium | [ ] |
| Internal links | Ongoing | Medium | [ ] |
| Next.js for SEO pages | 1-2 days | Critical (long-term) | [ ] |
| Page speed optimization | 2 hours | Medium | [ ] |
| Image optimization | 1 hour | Low-Medium | [ ] |
| Custom 404 | 30 min | Low | [ ] |
