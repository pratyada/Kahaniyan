// POST /api/pipeline-start — Create and start a pipeline run.
// Body: { uid, workflowId, input: { topic, targetAge?, tradition?, language? } }

import { getFirestore } from './_firebase.js';
import {
  createRun, evaluateReadyAgents, updateAgentStatus,
  mergeAgentInputs, saveAgentResult, updateRunStatus, getWorkflow,
  isRunComplete, hasBlockingFailure,
} from './_utils/pipelineEngine.js';
import { getAgentHandler } from './_utils/agentRegistry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, workflowId, input } = req.body || {};
  if (!uid || !input?.topic) return res.status(400).json({ error: 'uid and input.topic required' });

  // Auth check — admin or family tier
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const configSnap = await db.collection('config').doc('app').get();
  const adminEmails = configSnap.exists ? (configSnap.data().adminEmails || []) : [];
  const userSnap = await db.collection('users').doc(uid).get();
  const userEmail = userSnap.exists ? userSnap.data().email : '';
  const userTier = userSnap.exists ? (userSnap.data().subscriptionTier || 'free') : 'free';
  const isAdmin = adminEmails.map(e => e.toLowerCase()).includes(userEmail.toLowerCase());

  if (!isAdmin && userTier !== 'family') {
    return res.status(403).json({ error: 'Content Pipeline requires admin access or Family subscription' });
  }

  // Load workflow
  const wfId = workflowId || 'blog-story-package';
  const workflow = await getWorkflow(wfId);
  if (!workflow) return res.status(404).json({ error: `Workflow ${wfId} not found` });

  // Create run
  const { runId, agentStatuses } = await createRun(wfId, workflow, input, uid);

  // Evaluate which agents can start (no dependencies)
  const ready = evaluateReadyAgents(workflow, agentStatuses);

  // Execute full pipeline (await — Lambda freezes after response)
  try {
    await executeAgents(runId, wfId, ready, input);
  } catch (e) {
    console.error('[pipeline] Execution error:', e.message);
  }

  // Return final status
  const finalRun = await getRun(runId);
  return res.status(200).json({ runId, status: finalRun?.status || 'running', agents: finalRun?.agents });
}

// Execute agents and handle completion chain
async function executeAgents(runId, workflowId, agentIds, runInput) {
  const workflow = await getWorkflow(workflowId);
  if (!workflow) return;

  const now = new Date().toISOString();

  // Mark all as running
  await Promise.all(agentIds.map(id =>
    updateAgentStatus(runId, id, { status: 'running', startedAt: now })
  ));

  // Execute in parallel
  const results = await Promise.allSettled(
    agentIds.map(async (agentId) => {
      const agentDef = workflow.agents.find(a => a.id === agentId);
      if (!agentDef) throw new Error(`Agent ${agentId} not in workflow`);

      const handler = getAgentHandler(agentDef.type);
      if (!handler) throw new Error(`No handler for agent type: ${agentDef.type}`);

      // Merge inputs from dependencies
      const mergedInput = await mergeAgentInputs(runId, agentDef, runInput);

      const start = Date.now();
      const result = await handler({ input: mergedInput, config: agentDef.config || {} });
      result.durationMs = Date.now() - start;

      return { agentId, result };
    })
  );

  // Process results and trigger next agents
  const completedIds = [];

  for (const r of results) {
    if (r.status === 'fulfilled') {
      const { agentId, result } = r.value;
      await saveAgentResult(runId, agentId, {
        agentId,
        provider: result.provider,
        output: result.output,
        tokens: result.tokens,
        costEstimate: result.costEstimate,
        durationMs: result.durationMs,
      });
      await updateAgentStatus(runId, agentId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      completedIds.push(agentId);
    } else {
      const agentId = agentIds[results.indexOf(r)];
      await updateAgentStatus(runId, agentId, {
        status: 'failed',
        error: r.reason?.message || 'Unknown error',
        completedAt: new Date().toISOString(),
      });
    }
  }

  // Re-evaluate DAG for next agents
  const run = await (await import('./_utils/pipelineEngine.js')).getRun(runId);
  if (!run) return;

  if (isRunComplete(run.agents)) {
    const failed = hasBlockingFailure(workflow, run.agents);
    await updateRunStatus(runId, failed ? 'failed' : 'completed');
    return;
  }

  const nextReady = evaluateReadyAgents(workflow, run.agents);
  if (nextReady.length > 0) {
    await executeAgents(runId, workflowId, nextReady, run.input);
  }
}
