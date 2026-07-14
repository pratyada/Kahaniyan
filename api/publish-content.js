// POST /api/publish-content — Publish story/episode/series/blog to production.
// Saves to Firestore, uploads images + blog HTML to S3, returns live links.

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];
const BUCKET = 'mysleepytale-app';
const SITE = 'https://mysleepytale.com';

async function uploadToS3(key, body, contentType, cacheControl) {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const s3 = new S3Client({ region: 'us-east-1' });
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key,
    Body: typeof body === 'string' ? Buffer.from(body, 'utf-8') : body,
    ContentType: contentType,
    CacheControl: cacheControl || 'public, max-age=3600',
  }));
  return `${SITE}/${key}`;
}

async function generateBlogContent(content) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { blogBody: content.body, blogTitle: content.title };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: `You write blog articles for My Sleepy Tale, an audio bedtime story platform for kids. The blog should be a ARTICLE about the story — NOT the story itself.

Rules:
- Write a 400-600 word blog article that discusses the story, its themes, and what children learn
- Start with a compelling hook about why this story matters
- Include context: when/where this story is set, what inspired it
- Discuss the values/themes the story teaches (without spoiling the ending)
- Add a "Why this story matters" section
- Include a "Listen to this story" call-to-action
- Mention My Sleepy Tale naturally (not salesy)
- If blog context/references are provided, weave them in naturally as backlinks
- Tone: warm, knowledgeable, parent-to-parent
- SEO-friendly: use the story title and key themes naturally

Return ONLY valid JSON:
{
  "blogTitle": "An engaging blog title (different from story title)",
  "blogBody": "Full blog article in HTML paragraphs (<p>, <h2>, <blockquote>, <ul><li>)",
  "metaDescription": "155 char SEO description"
}`,
        messages: [{ role: 'user', content: `Write a blog article about this bedtime story:

Title: ${content.title}
Story text: ${(content.body || '').slice(0, 1500)}
Tradition: ${content.tradition || 'universal'}
Theme: ${content.theme || 'kindness'}
Series: ${content.source || 'standalone'}
${content.blog?.context ? `\nAdditional context & references:\n${content.blog.context}` : ''}` }],
      }),
    });

    if (!res.ok) return { blogBody: content.body, blogTitle: content.title };
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        blogBody: parsed.blogBody || content.body,
        blogTitle: parsed.blogTitle || content.title,
        metaDescription: parsed.metaDescription || content.metaDescription,
      };
    }
  } catch {}
  return { blogBody: content.body, blogTitle: content.title };
}

function generateBlogHtml(content, blogContent) {
  const { title, metaDescription, coverImage, blog, tradition, images } = content;
  const { blogBody, blogTitle } = blogContent || {};
  const slug = blog.slug;
  const date = new Date().toISOString().slice(0, 10);
  const readableDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | My Sleepy Tale</title>
  <meta name="description" content="${metaDescription || title}">
  <meta name="blog:category" content="${blog.category || 'guide'}">
  <meta name="blog:tag" content="${blog.tag || 'Story'}">
  <meta name="blog:reading-time" content="${blog.readingTime || 5}">
  <link rel="canonical" href="${SITE}/blog/${slug}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDescription || title}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE}/blog/${slug}">
  <meta property="og:image" content="${coverImage || SITE + '/og/cover.jpg'}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${coverImage || SITE + '/og/cover.jpg'}">
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${metaDescription}","image":"${coverImage || ''}","datePublished":"${date}","dateModified":"${date}","author":{"@type":"Person","name":"Prateek Yadav"},"publisher":{"@type":"Organization","name":"My Sleepy Tale","url":"${SITE}"},"mainEntityOfPage":{"@id":"${SITE}/blog/${slug}"},"url":"${SITE}/blog/${slug}"}
  </script>
  <script>
  (function(){ var t = localStorage.getItem('mst:theme'); if (t === 'day') document.documentElement.setAttribute('data-blog-theme', 'day'); })();
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',system-ui,sans-serif;background:#0a0a0f;color:#f5f0e8;line-height:1.8;-webkit-font-smoothing:antialiased}
    a{color:#f0a500;text-decoration:none}
    .wrap{max-width:720px;margin:0 auto;padding:2rem 1.5rem 4rem}
    .nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}
    .nav .brand{font-family:Fraunces,Georgia,serif;font-weight:700;font-size:1.1rem;color:#f5f0e8}
    .nav .btn{font-size:.8rem;background:rgba(240,165,0,.12);padding:.5rem 1.2rem;border-radius:2rem;color:#f0a500;font-weight:600}
    .hero-img{width:100%;border-radius:1rem;margin-bottom:1.5rem;aspect-ratio:16/9;object-fit:cover}
    h1{font-family:Fraunces,Georgia,serif;font-size:clamp(1.6rem,4vw,2.2rem);font-weight:700;line-height:1.2;margin-bottom:.8rem}
    h1 em{color:#f0a500;font-style:normal}
    .meta{font-size:.8rem;color:#8a857d;margin-bottom:2rem;display:flex;gap:.8rem;flex-wrap:wrap}
    .story{font-size:1rem;color:#c5c0b8;white-space:pre-line}
    .story p{margin-bottom:1rem}
    .cta{margin-top:3rem;text-align:center;background:linear-gradient(135deg,rgba(240,165,0,.12),rgba(240,165,0,.03));border:1px solid rgba(240,165,0,.2);border-radius:1.5rem;padding:2rem}
    .cta h2{font-family:Fraunces,Georgia,serif;font-size:1.3rem;margin-bottom:.5rem}
    .cta h2 em{color:#f0a500;font-style:normal}
    .cta .btn-primary{display:inline-block;background:#f0a500;color:#0a0a0f;font-weight:700;padding:.7rem 1.8rem;border-radius:2rem;font-size:.9rem;margin-top:.8rem}
    .photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin:1.5rem 0}
    .photo-grid img{width:100%;border-radius:.75rem;aspect-ratio:4/3;object-fit:cover;cursor:pointer;transition:transform .2s}
    .photo-grid img:hover{transform:scale(1.02)}
    .foot{text-align:center;margin-top:2rem;color:#3a3832;font-size:.75rem;border-top:1px solid rgba(255,255,255,.05);padding-top:1rem}
    [data-blog-theme="day"] body{background:#FDF8F0!important;color:#1A1040!important}
    [data-blog-theme="day"] h1,[data-blog-theme="day"] h2{color:#1A1040!important}
    [data-blog-theme="day"] h1 em,[data-blog-theme="day"] h2 em{color:#6B4FA8!important}
    [data-blog-theme="day"] .story{color:#5E4880!important}
    [data-blog-theme="day"] a{color:#6B4FA8!important}
    [data-blog-theme="day"] .cta{background:rgba(107,79,168,.08)!important;border-color:rgba(107,79,168,.2)!important}
    [data-blog-theme="day"] .cta .btn-primary{background:#6B4FA8!important;color:#fff!important}
  </style>
</head>
<body>
  <div class="wrap">
    <nav class="nav">
      <a href="/" class="brand">🌙 My Sleepy Tale</a>
      <a href="/" class="btn">Open App</a>
    </nav>
    ${coverImage ? `<img class="hero-img" src="${coverImage}" alt="${title}" loading="eager">` : ''}
    <h1>${blogTitle || title}</h1>
    <div class="meta">
      <span>${readableDate}</span>
      <span>·</span>
      <span>${blog.readingTime || 5} min read</span>
      ${tradition ? `<span>·</span><span>${tradition}</span>` : ''}
    </div>
    <div class="story">${blogBody || ''}</div>
    ${(images && images.length > 1) ? `
    <h2 style="font-family:Fraunces,Georgia,serif;font-size:1.3rem;margin:2rem 0 .8rem;color:#f0a500">📸 Photos from this story</h2>
    <div class="photo-grid">
      ${images.map((img, i) => `<img src="${img}" alt="Story photo ${i + 1}" loading="lazy">`).join('\n      ')}
    </div>` : ''}
    <div class="cta">
      <h2>Listen to This <em>Story</em></h2>
      <p style="color:#8a857d;font-size:.9rem;margin-bottom:.5rem">Hear it as a bedtime audio tale — free on My Sleepy Tale.</p>
      <a href="${SITE}/api/share?id=${content.id}" class="btn-primary">▶ Listen Now</a>
    </div>
    <footer class="foot">
      <p>🌙 My Sleepy Tale — bedtime stories that feel like home</p>
      <p style="margin-top:.3rem"><a href="/">Home</a> · <a href="/blog/">Blog</a></p>
    </footer>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // List published content
    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Database unavailable' });
    const snap = await db.collection('publishedContent').orderBy('createdAt', 'desc').limit(50).get();
    return res.status(200).json({ items: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'GET or POST only' });

  // Register image URL in wisdomImages (for episodes uploaded via ContentPublisher)
  if (req.body?.action === 'registerImage') {
    const { episodeId, imageUrl, gallery } = req.body;
    if (!episodeId || !imageUrl) return res.status(400).json({ error: 'episodeId and imageUrl required' });
    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Database unavailable' });
    const updates = { [episodeId]: imageUrl };
    await db.collection('config').doc('wisdomImages').set(updates, { merge: true });
    if (gallery && gallery.length > 0) {
      await db.collection('config').doc('wisdomGallery').set({ [episodeId]: gallery }, { merge: true });
    }
    return res.json({ registered: true, episodeId, imageUrl });
  }

  const { uid, content } = req.body || {};
  if (!uid || !content?.title || !content?.body) {
    return res.status(400).json({ error: 'uid, content.title, content.body required' });
  }

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Auth check
  const userSnap = await db.collection('users').doc(uid).get();
  const email = userSnap.exists ? userSnap.data().email : '';
  if (!FOUNDER_EMAILS.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Founder access only' });
  }

  const id = content.id || content.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 60);
  const now = new Date().toISOString();
  const results = { id, links: {} };

  try {
    // 1. Upload cover image to S3 if base64 provided
    let coverImageUrl = content.coverImage || '';
    if (content.coverImageBase64) {
      coverImageUrl = await uploadToS3(
        `media/published/${id}_cover.jpg`,
        Buffer.from(content.coverImageBase64, 'base64'),
        'image/jpeg', 'public, max-age=604800'
      );
    }

    // 2. Upload additional images
    const imageUrls = [];
    if (content.images) {
      for (let i = 0; i < content.images.length; i++) {
        if (content.images[i].startsWith('data:') || content.images[i].startsWith('/9j/')) {
          const b64 = content.images[i].replace(/^data:image\/\w+;base64,/, '');
          const url = await uploadToS3(
            `media/published/${id}_img${i}.jpg`,
            Buffer.from(b64, 'base64'),
            'image/jpeg', 'public, max-age=604800'
          );
          imageUrls.push(url);
        } else {
          imageUrls.push(content.images[i]); // already a URL
        }
      }
    }

    // 3. Generate blog HTML + upload to S3
    let blogUrl = null;
    if (content.blog?.enabled && content.blog?.slug) {
      const blogContent = await generateBlogContent({ ...content, id, coverImage: coverImageUrl });
      const blogHtml = generateBlogHtml({ ...content, id, coverImage: coverImageUrl }, blogContent);
      blogUrl = await uploadToS3(
        `blog/${content.blog.slug}.html`,
        blogHtml, 'text/html', 'public, max-age=3600'
      );
      results.links.blog = `${SITE}/blog/${content.blog.slug}`;
    }

    // 4. Build text hash
    const textHash = (() => {
      let h = 0;
      const t = content.body || '';
      for (let i = 0; i < t.length; i++) h = ((h << 5) - h + t.charCodeAt(i)) | 0;
      return 'h' + Math.abs(h).toString(36);
    })();

    // 5. Save to Firestore
    const doc = {
      id,
      type: content.type || 'episode',
      seriesId: content.seriesId || null,
      episodeNumber: content.episodeNumber || null,
      title: content.title,
      subtitle: content.subtitle || '',
      tradition: content.tradition || 'universal',
      theme: content.theme || 'kindness',
      durationMinutes: content.durationMinutes || Math.round((content.body || '').split(/\s+/).length / 150),
      source: content.source || '',
      body: content.body,
      coverImage: coverImageUrl,
      images: imageUrls,
      ogImage: coverImageUrl || `${SITE}/og/cover.jpg`,
      metaDescription: content.metaDescription || content.subtitle || content.title,
      storyArt: content.storyArt || null,
      imagePrompt: content.imagePrompt || '',
      blog: content.blog?.enabled ? { ...content.blog, blogUrl: results.links.blog } : null,
      audioUrl: null, // generated on first play via TTS
      textHash,
      shareUrl: `${SITE}/api/share?id=${id}`,
      playerUrl: `${SITE}/api/share?id=${id}`,
      status: 'published',
      publishedAt: now,
      publishedBy: email,
      createdAt: now,
    };

    await db.collection('publishedContent').doc(id).set(doc);

    // 6. Update wisdomAudio hash so Player knows this is fresh
    await db.collection('config').doc('audioHashes').set({ [id]: textHash }, { merge: true });

    results.links.story = doc.shareUrl;
    results.content = doc;

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
