// React Flow DAG visualization for pipeline runs.
// Real-time node status colors via Firestore onSnapshot.

import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AgentNode from './AgentNode.jsx';

const nodeTypes = { agent: AgentNode };

// Auto-layout: position nodes based on dependency depth
function layoutNodes(workflow, agentStatuses, agentResults) {
  const agents = workflow?.agents || [];
  if (agents.length === 0) return { nodes: [], edges: [] };

  // Calculate depth for each agent (longest path from root)
  const depths = {};
  function getDepth(agentId) {
    if (depths[agentId] !== undefined) return depths[agentId];
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.dependsOn.length === 0) { depths[agentId] = 0; return 0; }
    depths[agentId] = 1 + Math.max(...agent.dependsOn.map(getDepth));
    return depths[agentId];
  }
  agents.forEach(a => getDepth(a.id));

  // Group by depth
  const byDepth = {};
  agents.forEach(a => {
    const d = depths[a.id];
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(a);
  });

  const X_GAP = 280;
  const Y_GAP = 140;

  const nodes = agents.map(a => {
    const depth = depths[a.id];
    const siblings = byDepth[depth];
    const index = siblings.indexOf(a);
    const totalWidth = (siblings.length - 1) * X_GAP;
    const xOffset = -totalWidth / 2 + index * X_GAP;

    const status = agentStatuses?.[a.id]?.status || 'pending';
    const result = agentResults?.[a.id];

    return {
      id: a.id,
      type: 'agent',
      position: { x: 400 + xOffset, y: 60 + depth * Y_GAP },
      data: {
        label: a.id.replace(/-/g, ' ').replace(/\bgen\b/g, 'generator').replace(/\b\w/g, c => c.toUpperCase()),
        agentId: a.id,
        type: a.type,
        status,
        provider: result?.provider || a.config?.provider || null,
        durationMs: result?.durationMs || null,
        costEstimate: result?.costEstimate || null,
        error: agentStatuses?.[a.id]?.error || null,
      },
    };
  });

  const edges = [];
  agents.forEach(a => {
    a.dependsOn.forEach(depId => {
      const sourceStatus = agentStatuses?.[depId]?.status || 'pending';
      edges.push({
        id: `${depId}->${a.id}`,
        source: depId,
        target: a.id,
        animated: sourceStatus === 'running',
        style: {
          stroke: sourceStatus === 'completed' ? '#7ad9a1' : sourceStatus === 'running' ? '#f0a500' : '#3a3832',
          strokeWidth: 2,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: sourceStatus === 'completed' ? '#7ad9a1' : '#3a3832' },
      });
    });
  });

  return { nodes, edges };
}

export default function WorkflowCanvas({ workflow, run, agentResults }) {
  const { nodes, edges } = useMemo(
    () => layoutNodes(workflow, run?.agents, agentResults),
    [workflow, run?.agents, agentResults]
  );

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
        Select a workflow to see the pipeline
      </div>
    );
  }

  return (
    <div className="h-[420px] rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
      >
        <Background color="#1a1a25" gap={20} />
        <Controls showInteractive={false} className="!bg-bg-surface !border-white/10 !shadow-none [&>button]:!bg-bg-surface [&>button]:!border-white/10 [&>button]:!text-ink-muted" />
      </ReactFlow>
    </div>
  );
}
