// List of past pipeline runs with status, topic, cost, duration.

const STATUS_BADGES = {
  running:   { bg: 'bg-gold/10', text: 'text-gold', label: '● Running' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: '✓ Done' },
  failed:    { bg: 'bg-red-500/10', text: 'text-red-400', label: '✕ Failed' },
  pending:   { bg: 'bg-white/5', text: 'text-ink-dim', label: '○ Pending' },
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function totalCost(agents) {
  // Will be populated from agentResults in the future
  return null;
}

export default function RunHistory({ runs, activeRunId, onSelect }) {
  if (!runs || runs.length === 0) {
    return (
      <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 text-center">
        <p className="text-sm text-ink-muted">No runs yet. Start your first content pipeline above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-dim">Recent Runs</h3>
      </div>
      <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
        {runs.map((run) => {
          const badge = STATUS_BADGES[run.status] || STATUS_BADGES.pending;
          const isActive = run.id === activeRunId;

          return (
            <button
              key={run.id}
              onClick={() => onSelect(run.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-white/3 ${isActive ? 'bg-gold/5' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{run.input?.topic || 'Untitled'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-bold ${badge.text}`}>{badge.label}</span>
                  <span className="text-[10px] text-ink-dim">{timeAgo(run.startedAt)}</span>
                </div>
              </div>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
