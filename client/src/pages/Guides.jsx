import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';

const GUIDES = [
  {
    id: 'first-night',
    icon: '🌙',
    title: 'Your first bedtime with Dreemo',
    audience: 'New parents',
    summary: 'A 5-minute setup that turns Dreemo into part of your nightly ritual.',
    body: [
      'Open Dreemo about 15 minutes before bedtime — give your child time to settle.',
      'Complete the family profile once. Use real names — "Dada ji", "Nani ma", "Bruno". The story will weave them in naturally.',
      'Pick a 15-minute story for the very first night. Children build trust with shorter formats first.',
      'Dim the lights, dock the phone, and tap Start. The story begins in under a second — no fiddling once your child is in bed.',
      'After the story ends, leave the "Sweet dreams" screen up. The fade-to-black is part of the experience.',
    ],
  },
  {
    id: 'choose-value',
    icon: '🌿',
    title: 'How to choose the right value',
    audience: 'Parents of 2–10 year olds',
    summary: 'Eight values, one child, one night — pick the one that matches what is happening today.',
    body: [
      'Think about today, not forever. If your child shared a toy without being asked, pick Sharing — celebrate it.',
      'If something hard happened — a doctor visit, a bee sting, a first day of school — pick Courage or Bravery.',
      'For ages 2–4: stick to Sharing, Kindness, and Saying sorry. Big abstract ideas come later.',
      'For ages 5–7: lean into Honesty, Respect, and Gratitude — they are old enough to feel the weight.',
      'For ages 8–10: Patience, Courage, and Fairness land best. They notice when stories oversimplify, so use the longer formats.',
    ],
  },
  {
    id: 'story-language',
    icon: '🗣️',
    title: 'Switching languages — when and why',
    audience: 'Multilingual families',
    summary: 'Stories in Hindi, Tamil, Spanish, and Arabic are not translations — they are written natively.',
    body: [
      'Use the heritage language one or two nights a week, even if it is not the dominant language at home. Children learn rhythm first, vocabulary second.',
      'For very young children, choose the language a grandparent would use. The voice association makes the words stickier.',
      'Switch language in Settings, not in the middle of the night — children notice when something feels different and may resist sleep.',
      'Pair language switches with a value the child already knows. Familiar idea + new sounds = comfortable learning.',
      'If the narration sounds robotic, your browser may not have a native voice for that language installed. Chrome on Mac/Windows has the widest support.',
    ],
  },
  {
    id: 'sleep-timer',
    icon: '⏱️',
    title: 'Using the sleep timer like a pro',
    audience: 'Parents whose kids fall asleep mid-story',
    summary: 'The sleep timer plus volume fade-out is the secret to a clean handover from story to dreams.',
    body: [
      'Set the sleep timer to roughly the duration of the story plus 5 minutes. The story finishes; the silence is the cue.',
      'For children who resist endings, use a 30-minute timer with a 15-minute story — the silent gap lets them drift without realizing it.',
      'The last 2 minutes always fade out gently. Do not turn the volume up to compensate; the fade is intentional.',
      'On a tablet, dock it on the bedside and use the largest text mode. Some children like to follow along visually until their eyes close.',
      'If your child wakes up partway through, tap the mini player to resume from where it stopped.',
    ],
  },
  {
    id: 'tonight-whisper',
    icon: '💭',
    title: "Tonight's Whisper — telling Dreemo what's on their heart",
    audience: 'Parents who want stories that meet the moment',
    summary:
      'Type one sentence about how your child is feeling and the story will be woven around it — gently, in your culture, in your values.',
    body: [
      'Open the home screen and tap the "Tonight\'s Whisper" card. A small text box opens.',
      'Write one honest sentence — "they are scared of thunder" or "first day of school tomorrow" or "wants to know why the moon follows them home".',
      'Leave the toggle "Let the whisper choose the value" on — Dreemo will pick courage, kindness, patience, or whichever value fits best.',
      'If you want to keep your own value choice, turn the toggle off — the whisper will still be woven into the opening and closing of the story.',
      'The whisper never leaves your device. It is used only to shape tonight\'s story, then forgotten.',
    ],
  },
];

export default function Guides() {
  const [openId, setOpenId] = useState('first-night');

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Guides</p>
        <h1 className="display-title mt-1 text-ink">
          Get the most <span className="text-gold">out of bedtime</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Five short reads for parents and customers. Tap any guide to expand.
        </p>
      </header>

      <div className="space-y-3">
        {GUIDES.map((g, i) => {
          const open = openId === g.id;
          return (
            <motion.article
              key={g.id}
              layout
              transition={{ layout: { duration: 0.25, ease: 'easeOut' } }}
              className={`overflow-hidden rounded-2xl ${
                open ? 'bg-bg-elevated shadow-lift' : 'bg-bg-surface shadow-card'
              }`}
            >
              <button
                onClick={() => setOpenId(open ? null : g.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(240,165,0,0.35), rgba(240,165,0,0.05))',
                  }}
                >
                  {g.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-gold">
                    Guide {String(i + 1).padStart(2, '0')} · {g.audience}
                  </div>
                  <div className="mt-1 truncate font-ui text-sm font-bold text-ink">
                    {g.title}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-ink-muted">{g.summary}</div>
                </div>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg-card text-xs text-ink-muted transition ${
                    open ? 'rotate-180 text-gold' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <ol className="space-y-3 px-4 pb-5 pl-[4.25rem]">
                      {g.body.map((step, idx) => (
                        <li
                          key={idx}
                          className="relative pl-6 font-story text-[14px] leading-relaxed text-ink-muted"
                        >
                          <span className="absolute left-0 top-0 grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-[10px] font-bold text-gold">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      <VersionFooter />
    </PageTransition>
  );
}
