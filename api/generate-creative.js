// POST /api/generate-creative — Generate social media creative (image + caption).
// Body: { uid, topic, platform, style, aspectRatio }
// Uses Claude for caption + Higgsfield for image generation.

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];
const SOUL_ID = 'f5c1aac0-c994-48dd-90dc-a8eb9ea9419a';

const PLATFORM_CONFIG = {
  instagram: { aspectRatio: '1:1', captionStyle: 'Instagram post with emojis, line breaks, hashtags. 150-300 words.' },
  'instagram-story': { aspectRatio: '9:16', captionStyle: 'Instagram story overlay text. 2-3 short punchy lines.' },
  'instagram-portrait': { aspectRatio: '3:4', captionStyle: 'Instagram post with emojis, line breaks, hashtags. 150-300 words.' },
  twitter: { aspectRatio: '16:9', captionStyle: 'Tweet. Max 280 chars. Punchy, no fluff. 2-3 hashtags.' },
  linkedin: { aspectRatio: '1:1', captionStyle: 'LinkedIn post. Professional, founder voice, 100-200 words. Storytelling format.' },
  tiktok: { aspectRatio: '9:16', captionStyle: 'TikTok caption. Short, trendy, hook-first. 5-8 hashtags.' },
};

const STYLE_PREFIX = "Digital children's storybook illustration, soft watercolor textures, warm golden hour lighting, rounded gentle shapes, cozy bedtime palette with deep purples and warm ambers, Pixar-meets-Ghibli warmth, no text or words or letters anywhere in the image. ";

async function generateCaption(topic, platform) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { caption: '', hashtags: '' };

  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: `You write social media posts for MySleepyTale, an audio bedtime story platform for kids. 200+ stories, 11 cultural traditions, 9 languages. Free. Built in Toronto.

Rules:
- Never say "app" — say "platform" or "web space"
- Be genuine, not salesy
- Include mysleepytale.com link naturally
- ${config.captionStyle}

Return JSON: {"caption":"...","hashtags":["tag1","tag2",...]}`,
      messages: [{ role: 'user', content: `Write a ${platform} post about: ${topic}` }],
    }),
  });

  if (!res.ok) return { caption: topic, hashtags: [] };
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  } catch {
    return { caption: text, hashtags: [] };
  }
}

async function generateImagePrompt(topic) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return STYLE_PREFIX + topic;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You generate image prompts for MySleepyTale social media posts. Style: Pixar-quality children's illustration, Disney cinematic lighting, magical bedtime atmosphere, warm golden glow, deep navy night sky. Never include text/words in images. Never depict real people or likenesses. Return ONLY the prompt text, nothing else.`,
      messages: [{ role: 'user', content: `Generate an image prompt for a social media post about: ${topic}` }],
    }),
  });

  if (!res.ok) return STYLE_PREFIX + topic;
  const data = await res.json();
  return STYLE_PREFIX + (data.content?.[0]?.text || topic);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, topic, platform = 'instagram', style = 'brand' } = req.body || {};
  if (!uid || !topic) return res.status(400).json({ error: 'uid and topic required' });

  // Auth check — founder only for now
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  const userSnap = await db.collection('users').doc(uid).get();
  const email = userSnap.exists ? userSnap.data().email : '';
  if (!FOUNDER_EMAILS.includes(email.toLowerCase())) return res.status(403).json({ error: 'Founder access only' });

  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram;

  // Generate caption and image prompt in parallel
  const [captionResult, imagePrompt] = await Promise.all([
    generateCaption(topic, platform),
    generateImagePrompt(topic),
  ]);

  // Generate image via Higgsfield
  let imageUrl = null;
  let imageError = null;
  try {
    // Use child_process to call Higgsfield CLI
    const { execSync } = await import('child_process');
    const cmd = `higgsfield generate create text2image_soul_v2 --prompt "${imagePrompt.replace(/"/g, '\\"')}" --custom_reference_id ${SOUL_ID} --aspect_ratio "${config.aspectRatio}" --quality "2k" --wait --wait-timeout 5m 2>&1`;
    const output = execSync(cmd, { timeout: 330000, encoding: 'utf8' }).trim();
    if (output.startsWith('http')) {
      imageUrl = output;
    } else {
      imageError = output;
    }
  } catch (e) {
    imageError = e.message?.slice(0, 200) || 'Image generation failed';
  }

  // Save to Firestore
  const creative = {
    topic,
    platform,
    caption: captionResult.caption,
    hashtags: captionResult.hashtags,
    imagePrompt,
    imageUrl,
    imageError,
    createdBy: uid,
    createdAt: new Date().toISOString(),
    status: imageUrl ? 'ready' : 'caption-only',
  };

  const ref = await db.collection('creatives').add(creative);

  return res.status(200).json({ id: ref.id, ...creative });
}
