// 7-day calendar row — moon (played) or dim circle (missed).
// Shows the last 7 days with day labels.

import { motion } from 'framer-motion';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StreakCalendar({ weekHistory = {} }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-CA');
    const dayLabel = DAY_LABELS[d.getDay()];
    const isToday = i === 0;
    const played = !!weekHistory[dateStr];
    days.push({ dateStr, dayLabel, isToday, played });
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {days.map((day, i) => (
        <motion.div
          key={day.dateStr}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-ink-dim">
            {day.dayLabel}
          </span>
          <div
            className={`grid h-9 w-9 place-items-center rounded-full transition ${
              day.played
                ? 'bg-gold/20 ring-1 ring-gold/40'
                : day.isToday
                ? 'bg-white/5 ring-1 ring-white/10'
                : 'bg-white/3'
            }`}
          >
            {day.played ? (
              <span className="text-base">{day.isToday ? '⭐' : '🌙'}</span>
            ) : (
              <span className={`text-[10px] ${day.isToday ? 'text-ink-muted' : 'text-ink-dim/40'}`}>
                {day.isToday ? '?' : '·'}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
