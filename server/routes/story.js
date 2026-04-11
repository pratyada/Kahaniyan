import { Router } from 'express';
import { selectStory } from '../lib/storySelector.js';

const router = Router();

// POST /api/generate-story
// Body matches the README spec exactly so a Claude-backed
// implementation can be dropped in later without client changes.
router.post('/generate-story', (req, res) => {
  try {
    const story = selectStory(req.body || {});
    res.json(story);
  } catch (err) {
    console.error('story generation failed', err);
    res.status(500).json({ error: 'Story generation failed' });
  }
});

export default router;
