// POST /api/pipeline-retry — Retry failed agent(s) in a run.
// Body: { uid, runId, agentId? }

import { getFirestore } from './_firebase.js';
import {
  getRun, getWorkflow, updateAgentStatus, evaluateReadyAgents,
  mergeAgentInputs, saveAgentResult, updateRunStatus,
  isRunComplete, hasBlockingFailure,
} from './_utils/pipelineEngine.js';
import { getAgentHandler } from './_utils/agentRegistry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, runId, agentId } = req.body || {};
  if (!uid || !runId) return res.status(400).json({ error: 'uid and runId required' });

  const run = await getRun(runId);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  if (run.startedBy !== uid) return res.status(403).json({ error: 'Not your run' });

  // Reset failed agent(s) to pending
  const agentsToRetry = agentId
    ? [agentId]
    : Object.entries(run.agents).filter(([, v]) => v.status === 'failed').map(([k]) => k);

  if (agentsToRetry.length === 0) return res.status(400).json({ error: 'No failed agents to retry' });

  for (const id of agentsToRetry) {
    await updateAgentStatus(runId, id, { status: 'pending', error: null, startedAt: null, completedAt: null });
  }

  await updateRunStatus(runId, 'running');

  // Re-evaluate and execute
  const workflow = await getWorkflow(run.workflowId);
  const updatedRun = await getRun(runId);
  const ready = evaluateReadyAgents(workflow, updatedRun.agents);

  if (ready.length > 0) {
    executeRetry(runId, run.workflowId, ready, run.input).catch(console.error);
  }

  return res.status(200).json({ status: 'retrying', agents: agentsToRetry });
}

async function executeRetry(runId, workflowId, agentIds, runInput) {
  const workflow = await getWorkflow(workflowId);
  if (!workflow) return;

  const now = new Date().toISOString();
  await Promise.all(agentIds.map(id =>
    updateAgentStatus(runId, id, { status: 'running', startedAt: now })
  ));

  const results = await Promise.allSettled(
    agentIds.map(async (agentId) => {
      const agentDef = workflow.agents.find(a => a.id === agentId);
      const handler = getAgentHandler(agentDef.type);
      if (!handler) throw new Error(`No handler for: ${agentDef.type}`);
      const mergedInput = await mergeAgentInputs(runId, agentDef, runInput);
      const start = Date.now();
      const result = await handler({ input: mergedInput, config: agentDef.config || {} });
      result.durationMs = Date.now() - start;
      return { agentId, result };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      const { agentId, result } = r.value;
      await saveAgentResult(runId, agentId, {
        agentId, provider: result.provider, output: result.output,
        tokens: result.tokens, costEstimate: result.costEstimate, durationMs: result.durationMs,
      });
      await updateAgentStatus(runId, agentId, { status: 'completed', completedAt: new Date().toISOString() });
    } else {
      const agentId = agentIds[results.indexOf(r)];
      await updateAgentStatus(runId, agentId, { status: 'failed', error: r.reason?.message || 'Unknown error', completedAt: new Date().toISOString() });
    }
  }

  const run = await getRun(runId);
  if (isRunComplete(run.agents)) {
    await updateRunStatus(runId, hasBlockingFailure(workflow, run.agents) ? 'failed' : 'completed');
    return;
  }

  const next = evaluateReadyAgents(workflow, run.agents);
  if (next.length > 0) await executeRetry(runId, workflowId, next, runInput);
}
