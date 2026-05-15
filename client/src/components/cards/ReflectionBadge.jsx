// Small emoji badge on LibraryTile showing the child's feeling from reflection.

export default function ReflectionBadge({ reflection }) {
  if (!reflection?.answers?.length) return null;

  // Find the emoji feeling answer
  const feeling = reflection.answers.find((a) => a.type === 'emoji');
  const emojiMap = { Loved: '🥰', Thoughtful: '🤔', Moved: '😢', Strong: '💪', Sleepy: '😴' };
  const emoji = feeling ? emojiMap[feeling.answer] || '✅' : '✅';

  return (
    <div
      className="absolute left-2 bottom-[52px] z-10 grid h-7 w-7 place-items-center rounded-full bg-bg-base/80 text-sm backdrop-blur-sm ring-1 ring-white/10"
      title={`Reflection: ${feeling?.answer || 'Completed'}`}
    >
      {emoji}
    </div>
  );
}
