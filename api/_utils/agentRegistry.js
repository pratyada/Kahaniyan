// Agent registry — maps agent type strings to async handler functions.
// Each handler receives { input, config } and returns { output, provider, tokens, costEstimate }.

import { getFirestore } from '../_firebase.js';

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

// ─── Shared AI Call Helpers ───────────────────────────────────────

async function callClaude(systemPrompt, userPrompt, maxTokens = 2000) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return {
    text,
    tokens: { input: data.usage?.input_tokens || 0, output: data.usage?.output_tokens || 0 },
  };
}

async function callOpenAIImage(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1024x1024', response_format: 'b64_json' }),
  });

  if (!res.ok) throw new Error(`OpenAI Image API error: ${res.status}`);
  const data = await res.json();
  return data.data?.[0]?.b64_json || null;
}

// ─── Agent: Story Writer ──────────────────────────────────────────

async function storyWriter({ input }) {
  const { topic, targetAge, tradition, language } = input;

  // Load Story Lab config for richer prompts
  let storyLabContext = '';
  try {
    const db = await getFirestore();
    if (db) {
      const labSnap = await db.collection('config').doc('storyLab').get();
      if (labSnap.exists) {
        const lab = labSnap.data();
        if (lab.globalRules) storyLabContext += `\nGlobal rules: ${lab.globalRules.join('; ')}`;
        if (lab.culturalRefs?.[tradition]) {
          const refs = lab.culturalRefs[tradition];
          storyLabContext += `\nCultural context for ${tradition}: ${JSON.stringify(refs).slice(0, 500)}`;
        }
      }
    }
  } catch {}

  const system = `You are a master bedtime story writer for children. Write warm, gentle, educational stories.
Rules:
- Use soft, positive language only (no "grabbed", "exploded", "scary")
- Age-appropriate for ${targetAge || '4-7'} year olds
- Include a clear moral/value lesson
- 800-1200 words (about 5 minutes reading time at 150 wpm)
- End with a calming wind-down paragraph
${tradition ? `- Respectfully incorporate ${tradition} cultural elements` : ''}
${storyLabContext}

Return JSON: {"title":"...","body":"...","value":"...","plotType":"...","wordCount":N,"characters":["..."],"moralLesson":"..."}`;

  const result = await callClaude(system, `Write a bedtime story about: ${topic}`, 2500);

  let output;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    output = JSON.parse(jsonMatch[0]);
  } catch {
    output = { title: topic, body: result.text, value: 'kindness', plotType: 'adventure', wordCount: result.text.split(/\s+/).length, characters: [], moralLesson: '' };
  }

  return {
    output,
    provider: 'claude',
    tokens: result.tokens,
    costEstimate: ((result.tokens.input * 0.25 + result.tokens.output * 1.25) / 1_000_000),
  };
}

// ─── Agent: Image Prompt Generator ────────────────────────────────

async function imagePromptGen({ input }) {
  const { topic, targetAge, tradition } = input;

  const system = `You generate image prompts for a children's bedtime story illustration platform.
Style: Digital children's storybook illustration, soft watercolor textures, warm golden hour lighting, rounded gentle shapes, cozy bedtime palette with deep purples and warm ambers, Pixar-meets-Ghibli warmth, no text or words or letters anywhere.
${tradition === 'islamic' ? 'CRITICAL: Never depict God or any Prophet in imagery.' : ''}
${tradition === 'sikh' ? 'CRITICAL: Never depict Guru faces. Show symbols, gurdwara, light instead.' : ''}

Return JSON: {"coverPrompt":"...","scenePrompts":["prompt1","prompt2","prompt3"],"styleGuide":"...","ogImagePrompt":"...","twitterImagePrompt":"..."}`;

  const result = await callClaude(system, `Create image prompts for a bedtime story about: ${topic}. Target age: ${targetAge || '4-7'}.`, 1200);

  let output;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    output = JSON.parse(jsonMatch[0]);
  } catch {
    output = {
      coverPrompt: `Children's storybook illustration about ${topic}, warm bedtime colors`,
      scenePrompts: [`Scene about ${topic}`],
      styleGuide: 'Soft watercolor, Pixar-meets-Ghibli',
      ogImagePrompt: `Wide landscape illustration about ${topic} for social sharing`,
      twitterImagePrompt: `Portrait illustration about ${topic} for social sharing`,
    };
  }

  return {
    output,
    provider: 'claude',
    tokens: result.tokens,
    costEstimate: ((result.tokens.input * 0.25 + result.tokens.output * 1.25) / 1_000_000),
  };
}

// ─── Agent: Image Generator ───────────────────────────────────────

async function imageGen({ input }) {
  const storyData = input._from_['story-writer'] || {};
  const promptData = input._from_['image-prompt-gen'] || {};

  const coverPrompt = promptData.coverPrompt ||
    `Children's bedtime storybook illustration for "${storyData.title || input.topic}", soft watercolor style, warm dreamy colors`;

  const stylePrefix = 'Digital children\'s storybook illustration, soft watercolor textures, warm golden hour lighting, rounded gentle shapes, cozy bedtime palette, no text or words: ';

  const coverBase64 = await callOpenAIImage(stylePrefix + coverPrompt);

  // Upload to Firebase Storage
  let coverImageUrl = null;
  try {
    const admin = (await import('../_firebase.js')).getFirebaseAdmin;
    const fb = await admin();
    if (fb && coverBase64) {
      const bucket = fb.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'qissaa-61a78.firebasestorage.app');
      const filename = `pipeline-images/${Date.now()}_cover.png`;
      const file = bucket.file(filename);
      await file.save(Buffer.from(coverBase64, 'base64'), { contentType: 'image/png', public: true });
      coverImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }
  } catch (e) {
    coverImageUrl = `data:image/png;base64,${coverBase64?.slice(0, 100)}...`; // fallback
  }

  return {
    output: { coverImageUrl, coverBase64: coverBase64 ? '[base64_stored]' : null },
    provider: 'openai',
    tokens: { input: 0, output: 0 },
    costEstimate: 0.04, // ~$0.04 per gpt-image-1 generation
  };
}

// ─── Agent: Blog HTML Generator ───────────────────────────────────

async function blogHtmlGen({ input }) {
  const storyData = input._from_['story-writer'] || {};
  const imageData = input._from_['image-gen'] || {};

  const system = `You generate SEO-optimized blog post HTML for My Sleepy Tale, a bedtime story platform.
The HTML must include:
- <!DOCTYPE html> with lang="en-CA"
- <title> with " | My Sleepy Tale" suffix
- <meta name="description"> (150 chars max)
- <meta name="blog:category"> (one of: psychology, guide, culture, creators, toronto, fifa, comparison)
- <meta name="blog:tag"> (short display tag)
- <meta name="blog:reading-time"> (minutes)
- <link rel="canonical"> to https://mysleepytale.com/blog/{slug}
- OG meta tags (og:title, og:description, og:image, og:type=article, og:url)
- Twitter card meta tags
- JSON-LD Article schema with author "Prateek Yadav", publisher "My Sleepy Tale"
- JSON-LD BreadcrumbList (Home > Blog > This Post)
- Styled content matching the existing blog design (Fraunces + DM Sans fonts, dark theme with gold accents)
- Theme support: data-blog-theme="day" CSS overrides

Return ONLY the complete HTML document, nothing else.`;

  const userPrompt = `Generate a blog post HTML for this bedtime story:
Title: ${storyData.title || input.topic}
Story body: ${(storyData.body || '').slice(0, 2000)}
Value/theme: ${storyData.value || 'kindness'}
Moral lesson: ${storyData.moralLesson || ''}
Cover image URL: ${imageData.coverImageUrl || 'https://mysleepytale.com/og/cover.jpg'}
Target age: ${input.targetAge || '4-7'}
Tradition: ${input.tradition || 'universal'}
Slug suggestion: derive from the title (lowercase, hyphens, no special chars)`;

  const result = await callClaude(system, userPrompt, 4000);

  // Extract slug from the generated HTML
  let slug = '';
  const canonMatch = result.text.match(/canonical.*?\/blog\/([\w-]+)/);
  if (canonMatch) slug = canonMatch[1];
  else slug = (storyData.title || input.topic).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  return {
    output: {
      html: result.text,
      slug,
      metaTitle: storyData.title || input.topic,
      metaDescription: (storyData.body || '').slice(0, 150),
    },
    provider: 'claude',
    tokens: result.tokens,
    costEstimate: ((result.tokens.input * 0.25 + result.tokens.output * 1.25) / 1_000_000),
  };
}

// ─── Agent: Blog Image Generator ──────────────────────────────────

async function blogImageGen({ input }) {
  const storyData = input._from_['story-writer'] || {};
  const promptData = input._from_['image-prompt-gen'] || {};

  const ogPrompt = promptData.ogImagePrompt ||
    `Wide landscape illustration for "${storyData.title || input.topic}", atmospheric, room for text overlay on left, bedtime story style`;

  const stylePrefix = 'Digital children\'s storybook illustration, wide landscape 16:9, soft watercolor textures, warm golden hour lighting, no text: ';

  const ogBase64 = await callOpenAIImage(stylePrefix + ogPrompt);

  let ogImageUrl = null;
  try {
    const admin = (await import('../_firebase.js')).getFirebaseAdmin;
    const fb = await admin();
    if (fb && ogBase64) {
      const bucket = fb.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'qissaa-61a78.firebasestorage.app');
      const filename = `pipeline-images/${Date.now()}_og.png`;
      const file = bucket.file(filename);
      await file.save(Buffer.from(ogBase64, 'base64'), { contentType: 'image/png', public: true });
      ogImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }
  } catch {}

  return {
    output: { ogImageUrl },
    provider: 'openai',
    tokens: { input: 0, output: 0 },
    costEstimate: 0.04,
  };
}

// ─── Registry ─────────────────────────────────────────────────────

const AGENTS = {
  'story-writer': storyWriter,
  'image-prompt-gen': imagePromptGen,
  'image-gen': imageGen,
  'blog-html-gen': blogHtmlGen,
  'blog-image-gen': blogImageGen,
};

export function getAgentHandler(type) {
  return AGENTS[type] || null;
}

export function getAvailableAgents() {
  return Object.keys(AGENTS);
}
