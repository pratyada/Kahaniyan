// POST /api/kid-story-animate — Animate a kid's story using Gemini Veo
// Flow: prompt image → Veo video (8s) → merge kid's audio → S3
// Uses Gemini Veo 3.1 Fast (~$0.10-0.15 per video, cheapest option)

import { getFirestore } from './_firebase.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'mysleepytale-app';

// Generate animation prompt from kid's transcript using Claude
async function buildAnimationPrompt(transcript, topic) {
  if (!ANTHROPIC_KEY) return `Gentle animation of: ${topic || transcript.slice(0, 100)}. Warm children's storybook style, soft movement, magical sparkles.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: `You write short video animation prompts for a children's storytelling platform. Given a child's story transcript, write a 1-2 sentence animation prompt describing gentle, magical movement to bring the scene to life. Style: warm, cozy, Pixar-meets-Ghibli, bedtime atmosphere, soft golden lighting. Never include text, words, or UI elements. Keep it simple and child-appropriate.`,
      messages: [{ role: 'user', content: `Topic: ${topic || 'a story'}\n\nChild's story transcript:\n"${transcript.slice(0, 500)}"` }],
    }),
  });

  if (!res.ok) return `Gentle animation with magical sparkles and floating particles, warm bedtime atmosphere, soft golden light, children's storybook style`;
  const data = await res.json();
  return data.content?.[0]?.text || `Gentle animation, warm bedtime atmosphere, magical sparkles`;
}

// Generate video from image using Gemini Veo
async function generateVideo(imageUrl, animationPrompt) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not set');

  // Download image
  const imgRes = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const base64Image = imgBuffer.toString('base64');
  const mimeType = imageUrl.includes('.png') ? 'image/png' : 'image/jpeg';

  // Start generation
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{
        prompt: animationPrompt,
        image: { bytesBase64Encoded: base64Image, mimeType },
      }],
      parameters: {
        aspectRatio: '9:16', // vertical for social sharing
        sampleCount: 1,
        durationSeconds: 8,
        personGeneration: 'allow_all',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Veo error: ${res.status} ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const operationName = data.name;
  if (!operationName) throw new Error('No operation name from Veo');

  // Poll (up to 5 min)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${GEMINI_KEY}`);
    if (!pollRes.ok) continue;
    const pollData = await pollRes.json();
    if (pollData.done) {
      const videos = pollData.response?.predictions || [];
      if (videos.length > 0 && videos[0].bytesBase64Encoded) {
        return Buffer.from(videos[0].bytesBase64Encoded, 'base64');
      }
      if (pollData.error) throw new Error(pollData.error.message);
      throw new Error('Video generated but no data');
    }
  }
  throw new Error('Video generation timed out');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { parentUid, storyId } = req.body || {};
  if (!parentUid || !storyId) return res.status(400).json({ error: 'parentUid and storyId required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Verify parent owns this story
  const storyRef = db.collection('kidStories').doc(storyId);
  const storySnap = await storyRef.get();
  if (!storySnap.exists) return res.status(404).json({ error: 'Story not found' });
  const story = storySnap.data();
  if (story.parentUid !== parentUid) return res.status(403).json({ error: 'Not your story' });

  // Already animated?
  if (story.videoUrl) return res.json({ videoUrl: story.videoUrl, cached: true });

  // Need a prompt image to animate
  const imageUrl = story.promptImageUrl;
  if (!imageUrl) return res.status(400).json({ error: 'No prompt image to animate. Record with an image prompt.' });

  try {
    // Step 1: Build animation prompt from transcript
    const animationPrompt = await buildAnimationPrompt(story.transcript || '', story.topic || '');

    // Step 2: Generate video with Gemini Veo
    const videoBuffer = await generateVideo(imageUrl, animationPrompt);

    // Step 3: Upload to S3
    const videoKey = `video/kids/${story.kidId}/${storyId}.mp4`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: videoKey,
      Body: videoBuffer,
      ContentType: 'video/mp4',
      CacheControl: 'public, max-age=2592000',
    }));
    const videoUrl = `https://mysleepytale.com/${videoKey}`;

    // Step 4: Update Firestore
    await storyRef.update({ videoUrl, animatedAt: new Date().toISOString() });

    return res.json({ videoUrl, cached: false, durationSeconds: 8 });
  } catch (e) {
    console.error('[kid-story-animate] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
