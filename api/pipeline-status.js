// GET /api/pipeline-status?runId=xxx — Get pipeline run status (polling fallback).

import { getRun } from './_utils/pipelineEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { runId } = req.query || {};
  if (!runId) return res.status(400).json({ error: 'runId required' });

  const run = await getRun(runId);
  if (!run) return res.status(404).json({ error: 'Run not found' });

  return res.status(200).json(run);
}
