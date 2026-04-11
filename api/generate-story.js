// Vercel Serverless Function — wraps the in-house story selector.
// Lives at /api/generate-story so the existing client code Just Works.
import { selectStory } from '../server/lib/storySelector.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const story = selectStory(req.body || {});
    return res.status(200).json(story);
  } catch (err) {
    console.error('story generation failed', err);
    return res.status(500).json({ error: 'Story generation failed' });
  }
}
