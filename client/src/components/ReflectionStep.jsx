// Single reflection question renderer — emoji grid, choice buttons, or open text.

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReflectionStep({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (answer) => {
    setSelected(answer);
    setTimeout(() => onAnswer(answer), 400);
  };

  if (question.type === 'emoji') {
    return (
      <div>
        <p className="mb-5 text-center text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          {question.prompt}
        </p>
        <div className="flex items-center justify-center gap-3">
          {question.options.map((opt) => (
            <motion.button
              key={opt.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(opt.label)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition ${
                selected === opt.label
                  ? 'bg-gold/20 ring-2 ring-gold scale-110'
                  : 'bg-white/5 ring-1 ring-white/10'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[9px] font-bold text-ink-muted">{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'choice') {
    return (
      <div>
        <p className="mb-5 text-center text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          {question.prompt}
        </p>
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(opt)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                selected === opt
                  ? 'bg-gold text-bg-base shadow-glow'
                  : 'bg-white/5 text-ink ring-1 ring-white/10'
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Open-ended
  const [text, setText] = useState('');
  return (
    <div>
      <p className="mb-4 text-center text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
        {question.prompt}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer..."
        className="field mb-3 h-20 resize-none"
      />
      <button
        onClick={() => handleSelect(text || 'skipped')}
        className="w-full rounded-2xl bg-gold py-3 text-sm font-bold text-bg-base"
      >
        Done
      </button>
    </div>
  );
}
