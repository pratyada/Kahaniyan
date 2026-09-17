// Shared child-setup form — used by V2 onboarding (/v2/welcome) and settings.
// Captures child name + age + belief (single-select; universal = no religion).
import { useState } from 'react';
import { TRADITIONS } from '../../data/culturalLessons.js';
import { GOLD } from '../ui.js';

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function ChildSetup({ initial, cta = 'Continue', onSave }) {
  const [name, setName] = useState(initial?.childName && initial.childName !== 'little one' ? initial.childName : '');
  const [age, setAge] = useState(initial?.age || 6);
  const [belief, setBelief] = useState((initial?.beliefs && initial.beliefs[0]) || 'universal');

  const save = () => onSave({
    childName: name.trim() || 'little one',
    age: Number(age) || 6,
    beliefs: belief === 'universal' ? [] : [belief],
    language: initial?.language || 'English',
  });

  const beliefs = [{ key: 'universal', label: 'No specific belief', icon: '🌍' }, ...TRADITIONS.filter((t) => t.key !== 'universal')];

  return (
    <div className="max-w-[440px]">
      <label className="text-[12px] font-bold text-[#B8AAC8]">Your child&apos;s name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Veda"
        className="mt-1.5 w-full rounded-2xl bg-white/[0.06] ring-1 ring-white/10 focus:ring-[#F6C453]/50 outline-none py-3 px-4 text-sm text-[#F7F1E8] placeholder:text-[#7A6B8A]"
      />

      <label className="mt-6 block text-[12px] font-bold text-[#B8AAC8]">Age</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {AGES.map((a) => (
          <button key={a} onClick={() => setAge(a)} className={`h-10 w-10 rounded-full text-sm font-bold transition ${age === a ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10'}`} style={age === a ? { background: GOLD } : undefined}>{a}</button>
        ))}
      </div>

      <label className="mt-6 block text-[12px] font-bold text-[#B8AAC8]">Stories &amp; values from…</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {beliefs.map((b) => (
          <button key={b.key} onClick={() => setBelief(b.key)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${belief === b.key ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10'}`} style={belief === b.key ? { background: GOLD } : undefined}>{b.icon} {b.label}</button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-[#7A6B8A]">“No specific belief” shows universal stories only — no religious content.</p>

      <button onClick={save} className="mt-7 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A] active:scale-95 transition" style={{ background: GOLD }}>{cta}</button>
    </div>
  );
}
