import express from 'express';
import cors from 'cors';
import storyRouter from './routes/story.js';
import { rateLimit } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'kahaniyo-server', mode: 'in-house-poc' })
);

app.use('/api', rateLimit({ windowMs: 60_000, max: 30 }), storyRouter);

app.listen(PORT, () => {
  console.log(`✨ Kahaniyo server listening on http://localhost:${PORT}`);
});
