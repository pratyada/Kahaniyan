// Pipeline DAG engine — evaluates which agents are ready, merges inputs, manages state.
// Stateless: all state lives in Firestore. Safe for Lambda's ephemeral execution model.

import { getFirestore } from '../_firebase.js';

// ─── DAG Evaluation ───────────────────────────────────────────────

/** Returns agent IDs whose dependencies are ALL completed and own status is pending */
export function evaluateReadyAgents(workflow, agentStatuses) {
  return workflow.agents
    .filter(a => {
      const status = agentStatuses[a.id]?.status;
      if (status !== 'pending') return false;
      return a.dependsOn.every(depId => agentStatuses[depId]?.status === 'completed');
    })
    .map(a => a.id);
}

/** Check if all agents are in a terminal state (completed or failed) */
export function isRunComplete(agentStatuses) {
  return Object.values(agentStatuses).every(a =>
    a.status === 'completed' || a.status === 'failed' || a.status === 'skipped'
  );
}

/** Check if any required agent failed (non-optional) */
export function hasBlockingFailure(workflow, agentStatuses) {
  return workflow.agents.some(a => {
    const status = agentStatuses[a.id]?.status;
    return status === 'failed' && !a.optional;
  });
}

// ─── Input Merging ────────────────────────────────────────────────

/** Gather outputs from dependency agents and merge with run input */
export async function mergeAgentInputs(runId, agentDef, runInput) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const merged = { ...runInput };

  for (const depId of agentDef.dependsOn) {
    const snap = await db.collection('pipelineRuns').doc(runId)
      .collection('agentResults').doc(depId).get();
    if (snap.exists) {
      merged[`_from_${depId}`] = snap.data().output;
    }
  }

  return merged;
}

// ─── State Management ─────────────────────────────────────────────

/** Create a new pipeline run in Firestore */
export async function createRun(workflowId, workflow, input, startedBy) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const agentStatuses = {};
  for (const a of workflow.agents) {
    agentStatuses[a.id] = { status: 'pending', startedAt: null, completedAt: null, error: null };
  }

  const runRef = db.collection('pipelineRuns').doc();
  const now = new Date().toISOString();

  await runRef.set({
    workflowId,
    status: 'running',
    input,
    agents: agentStatuses,
    startedBy,
    startedAt: now,
    completedAt: null,
    error: null,
  });

  return { runId: runRef.id, agentStatuses };
}

/** Update a single agent's status in the run document */
export async function updateAgentStatus(runId, agentId, statusUpdate) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const runRef = db.collection('pipelineRuns').doc(runId);
  const updates = {};
  for (const [key, val] of Object.entries(statusUpdate)) {
    updates[`agents.${agentId}.${key}`] = val;
  }
  await runRef.update(updates);
}

/** Save agent result to subcollection */
export async function saveAgentResult(runId, agentId, result) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  await db.collection('pipelineRuns').doc(runId)
    .collection('agentResults').doc(agentId)
    .set({ ...result, createdAt: new Date().toISOString() });
}

/** Update run-level status */
export async function updateRunStatus(runId, status, error = null) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const update = { status };
  if (status === 'completed' || status === 'failed') {
    update.completedAt = new Date().toISOString();
  }
  if (error) update.error = error;
  await db.collection('pipelineRuns').doc(runId).update(update);
}

/** Get a run document */
export async function getRun(runId) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const snap = await db.collection('pipelineRuns').doc(runId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

/** Get a workflow document */
export async function getWorkflow(workflowId) {
  const db = await getFirestore();
  if (!db) throw new Error('Firestore not available');

  const snap = await db.collection('pipelineWorkflows').doc(workflowId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}
