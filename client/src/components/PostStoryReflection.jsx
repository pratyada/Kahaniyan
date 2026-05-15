// Post-story reflection flow — shown after a story finishes.
// 2 quick questions + "save for morning" option.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReflectionStep from './ReflectionStep.jsx';
import { getReflectionQuestions } from '../data/reflectionQuestions.js';
import { extractMoral } from '../utils/moralExtractor.js';
import { useReflections } from '../utils/reflectionStore.js';
import { trackReflectionCompleted, trackReflectionDeferred } from '../utils/analytics.js';

export default function PostStoryReflection({ story, onComplete, onDefer }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const { saveReflection } = useReflections();

  const questions = getReflectionQuestions(story);
  const { moral, moralShort } = extractMoral(story);
  const currentQuestion = questions[step];
  const isLastStep = step >= questions.length - 1;

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, {
      type: currentQuestion.type,
      question: currentQuestion.prompt,
      answer,
    }];
    setAnswers(newAnswers);

    if (isLastStep) {
      // Save and complete
      saveReflection(story.id, {
        storyTitle: story.title,
        value: story.value || story.tradition,
        moral: moralShort,
        answers: newAnswers,
        completedAt: new Date().toISOString(),
        deferred: false,
      });
      trackReflectionCompleted(story.id, newAnswers.length);
      setTimeout(() => onComplete(newAnswers), 600);
    } else {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const handleDefer = () => {
    saveReflection(story.id, {
      storyTitle: story.title,
      value: story.value || story.tradition,
      moral: moralShort,
      answers,
      completedAt: new Date().toISOString(),
      deferred: true,
    });
    trackReflectionDeferred(story.id);
    onDefer();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md px-6"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm"
      >
        {/* Progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-gold' : i < step ? 'w-3 bg-gold/40' : 'w-3 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">
          Quick Reflection
        </p>
        <p className="mb-6 text-center text-[11px] text-ink-muted line-clamp-2">
          {story.title}
        </p>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ReflectionStep
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {/* Save for morning */}
        <button
          onClick={handleDefer}
          className="mt-8 w-full text-center text-[11px] font-bold text-ink-dim transition hover:text-ink-muted"
        >
          😴 Too sleepy? Save for morning
        </button>
      </motion.div>
    </motion.div>
  );
}
