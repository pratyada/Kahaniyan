// GET /api/pipeline-list?uid=xxx&limit=20 — List recent pipeline runs.

import { getFirestore } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { uid, limit } = req.query || {};
  if (!uid) return res.status(400).json({ error: 'uid required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  try {
    const snap = await db.collection('pipelineRuns')
      .where('startedBy', '==', uid)
      .limit(parseInt(limit) || 20)
      .get();

    const runs = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));

    return res.status(200).json({ runs });
  } catch (e) {
    return res.status(200).json({ runs: [], error: e.message });
  }
}
