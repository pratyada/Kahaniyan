// POST /api/generate-social-creatives — Generate multi-format social media creatives + video
// Body: { uid, prompt, formats[], variations: 1-5, mode: 'generate'|'list'|'video' }
// Video: { mode: 'video', imageUrls[], videoPrompt, campaignId }

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

async function enhancePrompt(userPrompt, format, variationIndex) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return `${userPrompt}. Format: ${format.size}. MySleepyTale brand: dark #0a0a0f, gold #f0a500.`;

  const variationHint = variationIndex > 0 ? `This is variation #${variationIndex + 1} — use a DIFFERENT composition, angle, color emphasis, or layout than the previous variations. Be creative with the visual approach.` : '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You write image generation prompts for MySleepyTale social media creatives.

Brand: Dark background #0a0a0f, gold accent #f0a500, moon 🌙, warm Pixar-meets-Ghibli watercolor style, audience: parents of kids 3-10, never say "app".

Format: ${format.label} (${format.size}), aspect ratio: ${format.aspect}
${variationHint}

Return ONLY the enhanced prompt — no JSON, no explanation. Include text overlay if appropriate.`,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) return `${userPrompt}. ${format.size}. Brand: dark #0a0a0f, gold #f0a500, Pixar-style.`;
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
    const urlMatch = result.match(/https:\/\/\S+/);
    return urlMatch ? urlMatch[0] : null;
  } catch (e) {
    console.error('[creatives] Higgsfield error:', e.message?.slice(0, 200));
    return null;
  }
}

async function uploadToS3(sourceUrl, key, contentType = 'image/png') {
  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: 'us-east-1' });
    const imgRes = await fetch(sourceUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    await s3.send(new PutObjectCommand({
      Bucket: 'mysleepytale-app',
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=604800',
    }));
    return `https://mysleepytale.com/${key}`;
  } catch (e) {
    console.error('[creatives] S3 error:', e.message);
    return sourceUrl;
  }
}

// ═══════════════════════════════════════
// Gemini Veo video generation
// ═══════════════════════════════════════
async function generateVideoFromImage(imageUrl, videoPrompt) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error('GEMINI_API_KEY not set');

  // Download image and convert to base64
  const imgRes = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const base64Image = imgBuffer.toString('base64');
  const mimeType = imageUrl.includes('.png') ? 'image/png' : 'image/jpeg';

  // Start video generation (long-running operation)
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{
        prompt: videoPrompt || 'Gentle camera zoom in with magical sparkles and floating particles, warm bedtime atmosphere, soft golden light animation',
        image: { bytesBase64Encoded: base64Image, mimeType },
      }],
      parameters: {
        aspectRatio: '16:9',
        sampleCount: 1,
        durationSeconds: 8,
        personGeneration: 'allow_all',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Veo API error: ${res.status} ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const operationName = data.name;
  if (!operationName) throw new Error('No operation name returned from Veo');

  // Poll for completion (up to 5 minutes)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000)); // 5s intervals

    const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${geminiKey}`);
    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();
    if (pollData.done) {
      const videos = pollData.response?.predictions || [];
      if (videos.length > 0 && videos[0].bytesBase64Encoded) {
        return { base64: videos[0].bytesBase64Encoded, mimeType: videos[0].mimeType || 'video/mp4' };
      }
      if (pollData.error) throw new Error(pollData.error.message);
      throw new Error('Video generated but no data returned');
    }
  }
  throw new Error('Video generation timed out');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, prompt, formats, mode, variations, imageUrls, videoPrompt, campaignId } = req.body || {};

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

  // ── GENERATE VIDEO from images ──
  if (mode === 'video') {
    if (!imageUrls?.length) return res.status(400).json({ error: 'imageUrls[] required' });

    const videoResults = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const { base64, mimeType } = await generateVideoFromImage(imageUrls[i], videoPrompt);
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const slug = (prompt || 'creative').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 20);
        const s3Key = `media/creatives/${slug}_video_${i}_${Date.now()}.${ext}`;

        // Upload video to S3
        const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
        const s3 = new S3Client({ region: 'us-east-1' });
        await s3.send(new PutObjectCommand({
          Bucket: 'mysleepytale-app',
          Key: s3Key,
          Body: Buffer.from(base64, 'base64'),
          ContentType: mimeType,
          CacheControl: 'public, max-age=604800',
        }));

        videoResults.push({ status: 'done', url: `https://mysleepytale.com/${s3Key}`, sourceImage: imageUrls[i] });
      } catch (e) {
        videoResults.push({ status: 'failed', error: e.message, sourceImage: imageUrls[i] });
      }
    }

    // Update campaign if ID provided
    if (campaignId) {
      try {
        await db.collection('creativeCampaigns').doc(campaignId).update({
          videos: videoResults,
          videoPrompt: videoPrompt || '',
          videoGeneratedAt: new Date().toISOString(),
        });
      } catch {}
    }

    return res.json({ videos: videoResults });
  }

  // ── GENERATE IMAGES ──
  if (!prompt || !formats || !formats.length) {
    return res.status(400).json({ error: 'prompt and formats[] required' });
  }

  const numVariations = Math.min(Math.max(parseInt(variations) || 1, 1), 5);
  const validFormats = formats.filter(f => FORMAT_CONFIG[f]);
  if (!validFormats.length) return res.status(400).json({ error: 'No valid formats', available: Object.keys(FORMAT_CONFIG) });

  // Create campaign doc
  const campaignRef = db.collection('creativeCampaigns').doc();
  const campaign = {
    id: campaignRef.id,
    prompt,
    formats: validFormats,
    variations: numVariations,
    status: 'generating',
    creatives: {},
    createdAt: new Date().toISOString(),
    createdBy: uid,
  };
  await campaignRef.set(campaign);

  // Generate all formats × variations in parallel
  const results = {};
  const promises = [];

  for (const formatKey of validFormats) {
    const format = FORMAT_CONFIG[formatKey];
    results[formatKey] = { format: format.label, size: format.size, aspect: format.aspect, images: [] };

    for (let v = 0; v < numVariations; v++) {
      promises.push((async () => {
        try {
          const enhancedPrompt = await enhancePrompt(prompt, format, v);
          const imageUrl = await generateImage(enhancedPrompt, format.aspect);
          if (!imageUrl) {
            results[formatKey].images.push({ status: 'failed', error: 'Generation failed' });
            return;
          }
          const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
          const s3Key = `media/creatives/${slug}_${formatKey}_v${v + 1}_${Date.now()}.png`;
          const permanentUrl = await uploadToS3(imageUrl, s3Key);
          results[formatKey].images.push({ status: 'done', url: permanentUrl, higgsUrl: imageUrl, variation: v + 1 });
        } catch (e) {
          results[formatKey].images.push({ status: 'failed', error: e.message });
        }
      })());
    }
  }

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
    variations: numVariations,
    creatives: results,
    formatConfig: FORMAT_CONFIG,
  });
}
