import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { ROADMAP, STATUS_META, IMPACT_META } from '../data/roadmap.js';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'planned', label: 'Planned' },
  { key: 'considering', label: 'Considering' },
];

export default function Roadmap() {
  const [filter, setFilter] = useState('all');

  const filtered = ROADMAP.filter((item) => filter === 'all' || item.status === filter);
  const shippedCount = ROADMAP.filter((r) => r.status === 'shipped').length;

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Roadmap</p>
        <h1 className="display-title mt-1 text-ink">
          What's <span className="text-gold">shipped</span>, what's coming
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {shippedCount} of {ROADMAP.length} requirements shipped. Live status of every product
          requirement from the spec.
        </p>
      </header>

      {/* Progress bar */}
      <div className="mb-6 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          <span>Build progress</span>
          <span>{Math.round((shippedCount / ROADMAP.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-base">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(shippedCount / ROADMAP.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="mb-5 -mx-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`btn-pill shrink-0 px-4 py-2 text-sm font-bold ${
              filter === f.key ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const status = STATUS_META[item.status];
          const impact = IMPACT_META[item.impact];
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="rounded-2xl bg-bg-surface p-4 shadow-card ring-1 ring-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: impact.color, border: `1px solid ${impact.color}33` }}
                    >
                      {impact.label}
                    </span>
                    {item.mvp && (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        MVP
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-ui text-sm font-bold leading-snug text-ink">
                    {item.title}
                  </h3>
                  {item.notes && (
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{item.notes}</p>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <VersionFooter />
    </PageTransition>
  );
}
