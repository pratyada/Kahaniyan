// Morning recap card — shows a story's moral + optional deferred reflection.

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReflectionStep from '../ReflectionStep.jsx';
import { getReflectionQuestions } from '../../data/reflectionQuestions.js';
import { useReflections } from '../../utils/reflectionStore.js';

export default function RecapCard({ story, moral, reflection, onDismiss }) {
  const { saveReflection, markComplete } = useReflections();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isDeferred = reflection?.deferred;
  const questions = isDeferred ? getReflectionQuestions(story) : [];
  const showQuestion = isDeferred && step < questions.length;

  const handleAnswer = (answer) => {
    const answers = [...(reflection.answers || []), {
      type: questions[step].type,
      question: questions[step].prompt,
      answer,
    }];
    saveReflection(story.storyId || story.id, { answers, deferred: false });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      markComplete(story.storyId || story.id);
      setDismissed(true);
      onDismiss?.();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-72 shrink-0 snap-start rounded-2xl bg-bg-elevated p-4 ring-1 ring-gold/20"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold/60 mb-2">
        Last night you learned
      </p>
      <h4 className="text-sm font-bold text-ink mb-2" style={{ fontFamily: 'Lora, serif' }}>
        {story.storyTitle || story.title}
      </h4>
      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-3 mb-3">
        {moral}
      </p>

      {showQuestion ? (
        <ReflectionStep question={questions[step]} onAnswer={handleAnswer} />
      ) : (
        <button
          onClick={handleDismiss}
          className="w-full rounded-xl bg-gold/10 py-2 text-xs font-bold text-gold transition active:scale-97"
        >
          Got it
        </button>
      )}
    </motion.div>
  );
}
