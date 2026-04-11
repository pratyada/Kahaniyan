import { valueMeta } from '../utils/constants.js';

export default function StoryCard({ story, onClick }) {
  const meta = valueMeta(story.value);
  const date = new Date(story.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl bg-bg-surface p-3 text-left shadow-card transition hover:bg-bg-elevated"
    >
      <div
        className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl text-2xl"
        style={{ background: `linear-gradient(135deg, ${meta.color}55, ${meta.color}11)` }}
      >
        <span>{meta.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-ui text-sm font-bold text-ink">{story.title}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
          <span>{meta.label}</span>
          <span className="h-1 w-1 rounded-full bg-ink-dim" />
          <span>{story.estimatedMinutes} min</span>
          <span className="h-1 w-1 rounded-full bg-ink-dim" />
          <span>{date}</span>
        </div>
      </div>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-card text-gold transition group-hover:bg-gold group-hover:text-bg-base">
        ▶
      </span>
    </button>
  );
}
