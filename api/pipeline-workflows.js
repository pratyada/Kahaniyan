// GET/POST /api/pipeline-workflows — CRUD for workflow templates.
// GET: list all workflows
// POST: create/update a workflow { uid, workflow: { name, agents[] } }

import { getFirestore } from './_firebase.js';

const DEFAULT_WORKFLOW = {
  id: 'blog-story-package',
  name: 'Blog Story Package',
  description: 'Story + images + SEO blog post — the complete content package.',
  agents: [
    { id: 'story-writer', type: 'story-writer', dependsOn: [], config: { provider: 'claude' } },
    { id: 'image-prompt-gen', type: 'image-prompt-gen', dependsOn: [], config: { provider: 'claude' } },
    { id: 'image-gen', type: 'image-gen', dependsOn: ['story-writer', 'image-prompt-gen'], config: { provider: 'openai' } },
    { id: 'blog-image-gen', type: 'blog-image-gen', dependsOn: ['story-writer', 'image-prompt-gen'], config: { provider: 'openai' } },
    { id: 'blog-html-gen', type: 'blog-html-gen', dependsOn: ['story-writer', 'image-gen'], config: { provider: 'claude' } },
  ],
};

export default async function handler(req, res) {
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  if (req.method === 'GET') {
    const snap = await db.collection('pipelineWorkflows').get();
    let workflows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Seed default workflow if none exist
    if (workflows.length === 0) {
      await db.collection('pipelineWorkflows').doc(DEFAULT_WORKFLOW.id).set({
        ...DEFAULT_WORKFLOW,
        createdAt: new Date().toISOString(),
      });
      workflows = [{ ...DEFAULT_WORKFLOW, createdAt: new Date().toISOString() }];
    }

    return res.status(200).json({ workflows });
  }

  if (req.method === 'POST') {
    const { uid, workflow } = req.body || {};
    if (!uid || !workflow?.name || !workflow?.agents?.length) {
      return res.status(400).json({ error: 'uid, workflow.name, workflow.agents required' });
    }

    const id = workflow.id || workflow.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.collection('pipelineWorkflows').doc(id).set({
      ...workflow,
      id,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return res.status(200).json({ workflowId: id });
  }

  return res.status(405).json({ error: 'GET or POST only' });
}
