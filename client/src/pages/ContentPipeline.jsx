// Content Pipeline — Agentic AI content generation with visual workflow tracking.
// Admin-gated. Route: /content-pipeline

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import WorkflowCanvas from '../components/pipeline/WorkflowCanvas.jsx';
import NewRunSheet from '../components/pipeline/NewRunSheet.jsx';
import RunHistory from '../components/pipeline/RunHistory.jsx';
import { usePipelineRun } from '../hooks/usePipelineRun.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';

const FOUNDER_EMAIL = 'prateekyadav2010@gmail.com';

const API = import.meta.env.VITE_API_URL || '';

export default function ContentPipeline() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [workflows, setWorkflows] = useState([]);
  const [runs, setRuns] = useState([]);
  const [activeRunId, setActiveRunId] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  // Real-time subscription to active run
  const { run, agentResults, loading: runLoading } = usePipelineRun(activeRunId);

  // Find active workflow definition
  const activeWorkflow = workflows.find(w => w.id === run?.workflowId) || workflows[0];

  // Load workflows on mount
  useEffect(() => {
    if (!user) return;
    fetch(`${API}/api/pipeline-workflows`)
      .then(r => r.json())
      .then(d => setWorkflows(d.workflows || []))
      .catch(() => {});
  }, [user]);

  // Load run history
  const loadRuns = useCallback(() => {
    if (!user) return;
    fetch(`${API}/api/pipeline-list?uid=${user.uid}&limit=20`)
      .then(r => r.json())
      .then(d => setRuns(d.runs || []))
      .catch(() => {});
  }, [user]);

  useEffect(() => { loadRuns(); }, [loadRuns]);

  // Redirect if not founder
  useEffect(() => {
    if (user && user.email?.toLowerCase() !== FOUNDER_EMAIL && !isAdmin) navigate('/');
  }, [user, isAdmin, navigate]);

  // Start a new pipeline run
  const handleStart = async ({ workflowId, input }) => {
    if (!user) return;
    setStarting(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/pipeline-start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, workflowId, input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start pipeline');

      setActiveRunId(data.runId);
      loadRuns();
    } catch (e) {
      setError(e.message);
    } finally {
      setStarting(false);
    }
  };

  // Retry failed agents
  const handleRetry = async (agentId) => {
    if (!user || !activeRunId) return;
    try {
      await fetch(`${API}/api/pipeline-retry`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, runId: activeRunId, agentId }),
      });
    } catch {}
  };

  if (adminLoading) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="flex items-center justify-center h-64">
          <span className="text-ink-muted text-sm">Loading...</span>
        </div>
      </PageTransition>
    );
  }

  // Stats for active run
  const agentCount = run ? Object.keys(run.agents || {}).length : 0;
  const completedCount = run ? Object.values(run.agents || {}).filter(a => a.status === 'completed').length : 0;
  const totalCost = Object.values(agentResults).reduce((sum, r) => sum + (r.costEstimate || 0), 0);

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => navigate('/founder-hub')} className="text-xs text-gold font-bold">← Founder Hub</button>
        </div>
        <p className="ui-label">Content Pipeline</p>
        <h1 className="display-title mt-1 text-ink">
          Agentic <span className="text-gold">Content Studio</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Submit a thought. AI agents generate story, images, and blog — all in one pipeline.
        </p>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-300">✕</button>
        </div>
      )}

      {/* Main layout — 2 columns on desktop */}
      <div className="lg:flex lg:gap-6">
        {/* Left: New run form + history */}
        <div className="lg:w-[360px] lg:shrink-0 space-y-4 mb-6 lg:mb-0">
          <NewRunSheet workflows={workflows} onStart={handleStart} loading={starting} />
          <RunHistory runs={runs} activeRunId={activeRunId} onSelect={setActiveRunId} />
        </div>

        {/* Right: Workflow canvas + stats */}
        <div className="flex-1 space-y-4">
          {/* Run stats bar */}
          {run && (
            <div className="flex items-center gap-4 rounded-xl bg-bg-surface ring-1 ring-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  run.status === 'running' ? 'bg-gold animate-pulse' :
                  run.status === 'completed' ? 'bg-emerald-400' :
                  run.status === 'failed' ? 'bg-red-400' : 'bg-ink-dim'
                }`} />
                <span className="text-xs font-bold text-ink capitalize">{run.status}</span>
              </div>
              <span className="text-[10px] text-ink-dim">{completedCount}/{agentCount} agents</span>
              {totalCost > 0 && <span className="text-[10px] text-ink-dim">~${totalCost.toFixed(3)}</span>}
              <div className="flex-1" />
              <span className="text-[10px] text-ink-dim truncate max-w-[200px]">{run.input?.topic}</span>
            </div>
          )}

          {/* Workflow DAG */}
          <WorkflowCanvas
            workflow={activeWorkflow}
            run={run}
            agentResults={agentResults}
          />

          {/* Agent results preview */}
          {run?.status === 'completed' && (
            <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5">
              <h3 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>
                📦 Generated Content
              </h3>
              <div className="space-y-3">
                {agentResults['story-writer']?.output?.title && (
                  <div className="rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1">✍️ Story</p>
                    <p className="text-sm font-bold text-ink">{agentResults['story-writer'].output.title}</p>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-3">{agentResults['story-writer'].output.body?.slice(0, 200)}...</p>
                    <p className="text-[10px] text-ink-dim mt-1">{agentResults['story-writer'].output.wordCount} words · {agentResults['story-writer'].output.value}</p>
                  </div>
                )}
                {agentResults['image-gen']?.output?.coverImageUrl && (
                  <div className="rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1">🖼️ Cover Image</p>
                    <img src={agentResults['image-gen'].output.coverImageUrl} alt="Generated cover" className="rounded-lg w-full max-w-xs" />
                  </div>
                )}
                {agentResults['blog-html-gen']?.output?.slug && (
                  <div className="rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1">📝 Blog Post</p>
                    <p className="text-sm text-ink">Slug: <code className="text-gold">/blog/{agentResults['blog-html-gen'].output.slug}</code></p>
                    <p className="text-[10px] text-ink-dim mt-1">HTML generated — ready to deploy</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Failed agent retry buttons */}
          {run?.status === 'failed' && (
            <div className="rounded-2xl bg-red-500/5 ring-1 ring-red-500/20 p-5">
              <h3 className="text-sm font-bold text-red-400 mb-3">Pipeline Failed</h3>
              {Object.entries(run.agents || {})
                .filter(([, v]) => v.status === 'failed')
                .map(([id, v]) => (
                  <div key={id} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-ink">{id}</span>
                    <span className="text-[10px] text-red-400 flex-1 truncate">{v.error}</span>
                    <button
                      onClick={() => handleRetry(id)}
                      className="rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold text-gold"
                    >
                      Retry
                    </button>
                  </div>
                ))}
              <button
                onClick={() => handleRetry()}
                className="mt-2 rounded-full bg-gold px-4 py-2 text-xs font-bold text-bg-base"
              >
                Retry All Failed
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-32" />
    </PageTransition>
  );
}
