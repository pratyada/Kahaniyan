// Custom React Flow node for pipeline agents.
// Shows: agent name, AI provider, status badge, duration, cost.

import { Handle, Position } from '@xyflow/react';

const STATUS_STYLES = {
  pending:   { bg: 'bg-white/5', ring: 'ring-white/10', text: 'text-ink-dim', dot: 'bg-ink-dim', label: 'Pending' },
  running:   { bg: 'bg-gold/10', ring: 'ring-gold/30', text: 'text-gold', dot: 'bg-gold animate-pulse', label: 'Running' },
  completed: { bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Done' },
  failed:    { bg: 'bg-red-500/10', ring: 'ring-red-500/30', text: 'text-red-400', dot: 'bg-red-400', label: 'Failed' },
  skipped:   { bg: 'bg-white/5', ring: 'ring-white/10', text: 'text-ink-dim', dot: 'bg-ink-dim', label: 'Skipped' },
};

const PROVIDER_ICONS = {
  claude: '🟣',
  openai: '🟢',
  gemini: '🔵',
};

const AGENT_ICONS = {
  'story-writer': '✍️',
  'image-prompt-gen': '🎨',
  'image-gen': '🖼️',
  'blog-html-gen': '📝',
  'blog-image-gen': '🌅',
  'video-prompt-gen': '🎬',
  'video-gen': '📹',
  'social-media-gen': '📱',
  'distribution': '📤',
};

export default function AgentNode({ data }) {
  const { label, agentId, type, status, provider, durationMs, costEstimate, error } = data;
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <div className={`rounded-2xl ${s.bg} ring-1 ${s.ring} px-4 py-3 min-w-[200px] max-w-[240px] transition-all duration-300`}>
      <Handle type="target" position={Position.Top} className="!bg-gold !w-2 !h-2" />

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{AGENT_ICONS[type] || '⚙️'}</span>
        <span className="text-xs font-bold text-ink truncate flex-1">{label}</span>
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${s.text}`}>{s.label}</span>
        {provider && (
          <span className="text-[10px] text-ink-dim ml-auto">{PROVIDER_ICONS[provider] || ''} {provider}</span>
        )}
      </div>

      {(durationMs || costEstimate) && (
        <div className="flex items-center gap-2 text-[9px] text-ink-dim">
          {durationMs && <span>{(durationMs / 1000).toFixed(1)}s</span>}
          {costEstimate && <span>~${costEstimate.toFixed(3)}</span>}
        </div>
      )}

      {error && status === 'failed' && (
        <p className="mt-1 text-[9px] text-red-400 line-clamp-2">{error}</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gold !w-2 !h-2" />
    </div>
  );
}
