// POST /api/generate-social-creatives — Generate multi-format social media creatives via Higgsfield
// Body: { uid, prompt, formats: ['instagram_post','instagram_story','linkedin_banner','email_header','facebook_post','x_post'] }
// Returns: { jobIds: [...] } immediately, then poll with { mode: 'status', jobIds: [...] }

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];

const FORMAT_CONFIG = {
  instagram_post: { label: 'Instagram Post', size: '1080×1080', aspect: '1:1', icon: '📸' },
  instagram_story: { label: 'Instagram/WhatsApp Story', size: '1080×1920', aspect: '9:16', icon: '📱' },
  linkedin_banner: { label: 'LinkedIn/Facebook/X Banner', size: '1200×630', aspect: '16:9', icon: '💼' },
  email_header: { label: 'Email Header', size: '1200×400', aspect: '16:9', icon: '📧' },
  facebook_post: { label: 'Facebook Post', size: '1200×630', aspect: '16:9', icon: '📘' },
  x_post: { label: 'X/Twitter Post', size: '1600×900', aspect: '16:9', icon: '🐦' },
  pinterest_pin: { label: 'Pinterest Pin', size: '1000×1500', aspect: '2:3', icon: '📌' },
  youtube_thumb: { label: 'YouTube Thumbnail', size: '1280×720', aspect: '16:9', icon: '▶️' },
};

async function enhancePrompt(userPrompt, format) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return `${userPrompt}. Format: ${format.size}. MySleepyTale brand: dark background #0a0a0f, gold accent #f0a500, moon logo.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You write image generation prompts for MySleepyTale social media creatives.

Brand guidelines:
- Dark background #0a0a0f
- Gold accent #f0a500
- Moon emoji 🌙 as brand symbol
- Warm, Pixar-meets-Ghibli watercolor style
- Target audience: parents of kids 3-10
- Never say "app" — say "platform"
- Gentle, magical, bedtime atmosphere

You are creating a prompt for: ${format.label} (${format.size})
Aspect ratio: ${format.aspect}

Return ONLY the enhanced image generation prompt — no JSON, no explanation. Include text overlay instructions if appropriate for the format. Keep the MySleepyTale brand consistent.`,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) return `${userPrompt}. ${format.size} format. MySleepyTale brand: dark background #0a0a0f, gold #f0a500, warm Pixar-style.`;
  const data = await res.json();
  return data.content?.[0]?.text || userPrompt;
}

async function generateImage(prompt, aspect) {
  const { execSync } = await import('child_process');
  try {
    const result = execSync(
      `higgsfield generate create gpt_image_2 --prompt "${prompt.replace(/"/g, '\\"')}" --aspect_ratio ${aspect} --resolution 2k --wait`,
      { timeout: 300000, encoding: 'utf-8' }
    ).trim();
    // Result is the URL
    const urlMatch = result.match(/https:\/\/\S+/);
    return urlMatch ? urlMatch[0] : null;
  } catch (e) {
    console.error('[generate-social-creatives] Higgsfield error:', e.message?.slice(0, 200));
    return null;
  }
}

async function uploadToS3(imageUrl, key) {
  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: 'us-east-1' });

    // Download image
    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    await s3.send(new PutObjectCommand({
      Bucket: 'mysleepytale-app',
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=604800',
    }));

    return `https://mysleepytale.com/${key}`;
  } catch (e) {
    console.error('[generate-social-creatives] S3 upload error:', e.message);
    return imageUrl; // fallback to Higgsfield URL
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, prompt, formats, mode, campaignId } = req.body || {};

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Auth
  if (uid) {
    const userSnap = await db.collection('users').doc(uid).get();
    const email = userSnap.exists ? userSnap.data().email : '';
    if (!FOUNDER_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'Founder access only' });
    }
  }

  // ── LIST past campaigns ──
  if (mode === 'list') {
    const snap = await db.collection('creativeCampaigns').orderBy('createdAt', 'desc').limit(20).get();
    const campaigns = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ campaigns });
  }

  // ── GENERATE creatives ──
  if (!prompt || !formats || !formats.length) {
    return res.status(400).json({ error: 'prompt and formats[] required' });
  }

  const validFormats = formats.filter(f => FORMAT_CONFIG[f]);
  if (!validFormats.length) return res.status(400).json({ error: 'No valid formats', available: Object.keys(FORMAT_CONFIG) });

  // Create campaign doc
  const campaignRef = db.collection('creativeCampaigns').doc();
  const campaign = {
    id: campaignRef.id,
    prompt,
    formats: validFormats,
    status: 'generating',
    creatives: {},
    createdAt: new Date().toISOString(),
    createdBy: uid,
  };
  await campaignRef.set(campaign);

  // Generate all formats in parallel
  const results = {};
  const promises = validFormats.map(async (formatKey) => {
    const format = FORMAT_CONFIG[formatKey];
    try {
      // Enhance prompt for this specific format
      const enhancedPrompt = await enhancePrompt(prompt, format);

      // Generate via Higgsfield
      const imageUrl = await generateImage(enhancedPrompt, format.aspect);
      if (!imageUrl) {
        results[formatKey] = { status: 'failed', error: 'Generation failed' };
        return;
      }

      // Upload to S3
      const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
      const s3Key = `media/creatives/${slug}_${formatKey}_${Date.now()}.png`;
      const permanentUrl = await uploadToS3(imageUrl, s3Key);

      results[formatKey] = {
        status: 'done',
        url: permanentUrl,
        higgsUrl: imageUrl,
        format: format.label,
        size: format.size,
        aspect: format.aspect,
      };
    } catch (e) {
      results[formatKey] = { status: 'failed', error: e.message };
    }
  });

  await Promise.all(promises);

  // Update campaign
  await campaignRef.update({
    status: 'done',
    creatives: results,
    completedAt: new Date().toISOString(),
  });

  return res.json({
    campaignId: campaignRef.id,
    prompt,
    creatives: results,
    formatConfig: FORMAT_CONFIG,
  });
}
