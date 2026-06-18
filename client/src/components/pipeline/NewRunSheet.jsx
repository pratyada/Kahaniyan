// Form to start a new pipeline run.
// Fields: topic/thought, target age, tradition, workflow selector.

import { useState } from 'react';

const TRADITIONS = [
  { value: 'universal', label: '🌍 Universal' },
  { value: 'hindu', label: '🙏 Hindu' },
  { value: 'islamic', label: '☪️ Islamic' },
  { value: 'catholic', label: '✝️ Catholic' },
  { value: 'sikh', label: '🪯 Sikh' },
  { value: 'buddhist', label: '☸️ Buddhist' },
  { value: 'jewish', label: '✡️ Jewish' },
  { value: 'filipino', label: '🇵🇭 Filipino' },
  { value: 'hispanic', label: '🇲🇽 Hispanic' },
  { value: 'indigenous', label: '🪶 Indigenous' },
];

const AGE_RANGES = ['2-3', '3-5', '4-7', '5-8', '6-10'];

export default function NewRunSheet({ workflows, onStart, loading }) {
  const [topic, setTopic] = useState('');
  const [targetAge, setTargetAge] = useState('4-7');
  const [tradition, setTradition] = useState('universal');
  const [workflowId, setWorkflowId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart({
      workflowId: workflowId || workflows?.[0]?.id || 'blog-story-package',
      input: { topic: topic.trim(), targetAge, tradition },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5">
      <h3 className="text-sm font-bold text-ink mb-4" style={{ fontFamily: 'Lora, serif' }}>
        ✨ New Content Run
      </h3>

      {/* Topic */}
      <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1.5">
          Topic / Thought / Link
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="A bedtime story about a cat who learns to share... or paste an article link"
          className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-dim ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Age + Tradition row */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1.5">Age</label>
          <select
            value={targetAge}
            onChange={(e) => setTargetAge(e.target.value)}
            className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none"
          >
            {AGE_RANGES.map(a => <option key={a} value={a}>{a} years</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1.5">Tradition</label>
          <select
            value={tradition}
            onChange={(e) => setTradition(e.target.value)}
            className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none"
          >
            {TRADITIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Workflow selector */}
      {workflows && workflows.length > 1 && (
        <div className="mb-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1.5">Workflow</label>
          <select
            value={workflowId}
            onChange={(e) => setWorkflowId(e.target.value)}
            className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none"
          >
            {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!topic.trim() || loading}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting Pipeline...' : '🚀 Start Content Pipeline'}
      </button>
    </form>
  );
}
