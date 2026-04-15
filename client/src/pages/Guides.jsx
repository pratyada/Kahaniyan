import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';

// ─── QUICK GUIDES — one per feature, 30-second reads ───
const GUIDES = [
  {
    id: 'tonight',
    icon: '🌙',
    title: 'Tonight — 3 ways to start a story',
    time: '30 sec read',
    body: [
      '💭 "Today this happened" — type one sentence about how your child is feeling. My Sleepy Tale weaves a bedtime story around it.',
      '🪷 "Wisdom story" — pick a tradition and a theme. Tap any story to play instantly. No generation, no wait.',
      '👨‍👩‍👧 "Choose the cast" — select 2–5 characters (family, pets, imaginary friends). My Sleepy Tale builds a fresh story starring all of them.',
    ],
  },
  {
    id: 'cast',
    icon: '👨‍👩‍👧',
    title: 'Story cast — add your whole family',
    time: '30 sec read',
    body: [
      'Go to More → Story cast. Everyone you added during onboarding is already there.',
      'Tap "+ Add character" to add grandparents, cousins, imaginary friends, or pets.',
      'Each pet has a type — dogs say "bhau bhau", cats say "meow". Pick the right one.',
      'Edit the Hero (your child) to set an "adventure name" — they can be Iron Man or Princess Luna in the story.',
      'On the Tonight screen, tap "Choose the cast" and select who stars tonight.',
    ],
  },
  {
    id: 'wisdom',
    icon: '🪷',
    title: 'Wisdom Stories — many beliefs, one app',
    time: '30 sec read',
    body: [
      'My Sleepy Tale has hand-written stories from Hindu, Muslim, Christian, Sikh, Buddhist, Jain, and Jewish traditions.',
      'Same theme (like compassion to animals) told through different cultures — so your child grows up rooted AND open-minded.',
      'Go to More → Edit family → Belief to choose yours. My Sleepy Tale prioritizes your tradition first.',
      'Toggle "Also show stories from other cultures" in More → Content if you want cross-culture stories too.',
    ],
  },
  {
    id: 'radio',
    icon: '📻',
    title: 'Radio — bedtime ambient music',
    time: '20 sec read',
    body: [
      'Three stations: Drone Zone (ambient), Raag Nidra (Indian classical), Deep Space One (deep ambient).',
      'Tap play. Switch tabs — the music keeps playing. A mini bar shows above the bottom nav.',
      'Use it to wind down before a story, or leave it running after the story ends.',
    ],
  },
  {
    id: 'sleep-sounds',
    icon: '🌧️',
    title: 'Sleep sounds + story fade',
    time: '20 sec read',
    body: [
      'In the player, tap any noise chip (Rain, Ocean, Fan, Drone) to layer it under the narration.',
      'Enable "🌧️ Sleep sounds behind stories" in More to auto-start rain when a story plays.',
      'Enable "🌙 Story voice fades into sleep sounds" — the narration gets quieter while noise grows, easing your child into sleep.',
    ],
  },
  {
    id: 'voices',
    icon: '🎙️',
    title: 'Voice Studio — record family voices',
    time: '30 sec read',
    body: [
      'Go to More → Voices → "+ Add a new voice".',
      'Hold the gold button and read the training paragraph out loud in your natural voice.',
      'Release → listen back → if happy, tap "Looks good" → name the voice and pick the relationship.',
      'Voices are stored on your device. When we add ElevenLabs, these recordings will be used to clone real family voices for narration.',
    ],
  },
  {
    id: 'multi-kids',
    icon: '🧒',
    title: 'Multiple kids — switch profiles',
    time: '20 sec read',
    body: [
      'Go to More → tap "+ Add another kid" → complete onboarding for the second child.',
      'A profile switcher appears at the top of More. Tap any name to switch.',
      'Each child has their own characters, beliefs, library, and settings.',
    ],
  },
  {
    id: 'theme',
    icon: '☀️',
    title: 'Day mode — for mornings',
    time: '10 sec read',
    body: [
      'Go to More → tap the day/night toggle.',
      'Day mode uses warm cream backgrounds. Night mode uses deep dark backgrounds for bedtime.',
    ],
  },
];

// ─── BLOGS — soft marketing, storytelling about My Sleepy Tale ───
const BLOGS = [
  {
    id: 'what-is-mst',
    icon: '📖',
    title: 'Why My Sleepy Tale?',
    time: '2 min read',
    body: `Every parent knows the moment. The lights are dim, the child is in bed, and a small voice says: "Tell me a story."

That moment — the last 15 minutes before sleep — is the most neurologically receptive window of a child's entire day. What they hear then shapes how they dream, what they believe, and who they become.

My Sleepy Tale exists for that moment. We built it because we couldn't find a bedtime story app that understood our families — their names, their grandparents, their pets, their cultural values, their language, their accent.

So we built one. A story that knows your child by name. That weaves in their grandmother and their puppy. That teaches honesty through the lens of your own tradition. That narrates in a voice warm enough to make a dark room feel safe.

My Sleepy Tale is not screen time. It is voice time. The screen is only the remote control. You tap one button, put the phone face-down, and a warm voice fills the room until your child's breathing slows and their eyes close.

That is what a sleepy tale is. A bridge between the day that was, and the dreams that will be.`,
  },
  {
    id: 'why-bedtime',
    icon: '🌙',
    title: 'Why bedtime is the most important 15 minutes of the day',
    time: '3 min read',
    body: `Neuroscience has known for decades what grandmothers always knew: the last thing a child hears before sleep shapes how their brain consolidates the day.

During the transition from wakefulness to sleep, a child's brain moves into a theta-wave state — the same state used in meditation and deep learning. In this state, the brain is 2–3x more receptive to emotional patterning. Whatever narrative is running at that moment — fear, safety, loneliness, belonging — gets wired deeper than anything heard during the busy day.

This is why a bedtime story is not a luxury. It is a developmental tool. A child who hears a story about courage before sleep is literally more likely to act with courage the next day. A child who hears a story about kindness carries that template into their playground interactions.

My Sleepy Tale is built around this insight. We don't just generate stories. We match the story's emotional core — its value — to the child's developmental stage. Courage for a 3-year-old is not the same as courage for a 10-year-old. Honesty at 5 sounds different from honesty at 12.

The goal is simple: own the last 15 minutes of your child's day. Make them count. Make them soft, warm, personal, and rooted in the values your family actually believes in.

That's what My Sleepy Tale does. One story, every night, for the child you know best.`,
  },
  {
    id: 'personalization',
    icon: '✨',
    title: 'Why your child\'s name in the story changes everything',
    time: '2 min read',
    body: `There is a well-documented phenomenon in developmental psychology called the "cocktail party effect" — even in a noisy room, a child's attention snaps to their own name. The name is the first word a child recognizes, and it remains the most emotionally loaded word in their vocabulary for life.

When a bedtime story says "Once upon a time there was a child," a listener hears a generic tale. When the story says "Once upon a time, Ved walked into a garden with his grandmother Nani ma and his puppy Bruno," something electric happens. The child is IN the story. Their brain simulates the events as if they are happening to them personally.

This is not a gimmick. This is the difference between a story that entertains and a story that teaches. Personalization — using the child's real name, their real family members, their real pet — turns a bedtime story into a rehearsal. The child practices courage, patience, honesty, and kindness from inside the narrative, not from the outside looking in.

My Sleepy Tale personalizes every story. Not just the name — the sibling, the grandparents, the pet, the cultural references, the food, the festivals. The story feels like home because it IS home, rearranged into a new adventure every night.`,
  },
  {
    id: 'screen-time',
    icon: '📵',
    title: 'This is the opposite of screen time',
    time: '2 min read',
    body: `Parents worry about screen time. They should. The research on passive video consumption for children under 8 is clear and concerning — it reduces attention span, delays language development, and disrupts sleep onset.

But My Sleepy Tale is not screen time. It is voice time.

The screen is only the remote control. You open the app, tap one button, and put the phone face-down. What follows is a voice — a warm, paced, story-shaped voice — filling the dark room for 5, 10, or 15 minutes. The child's eyes are closed. Their brain is listening, imagining, building the world of the story inside their own head.

This is the exact opposite of a screen. A screen gives you the images. A voice makes you build them yourself. That act of imagination is one of the most developmentally important things a child's brain can do.

When you use My Sleepy Tale, you are not handing your child a device. You are handing them a storyteller. The device just happens to be how the storyteller arrives.

And when the story ends, the screen fades to black, and the room is quiet, and the child is asleep. That is not screen time. That is parenting.`,
  },
  {
    id: 'culture',
    icon: '🌍',
    title: 'Raising global children with local roots',
    time: '2 min read',
    body: `The hardest question in modern parenting is: how do I raise a child who is proud of where they come from AND open to where the world is going?

Too much cultural specificity and the child grows up in a bubble. Too much universalism and the child grows up rootless — knowing about everything, belonging to nothing.

My Sleepy Tale solves this with a simple design choice: we tell the same lesson from many traditions.

Compassion to animals is taught by Krishna and the squirrel, by Prophet Muhammad and the crying camel, by Jesus and the birds, by Prince Siddhartha and the wounded swan, by Guru Nanak and the true bargain, by Mahavir and the tiny ant.

The child hears their own tradition's version first. Then, over time, they hear the others. They realize — without being told, without a lecture — that kindness is not the property of any one religion. That courage looks the same in a Hindu village and a Christian hillside and a Sikh battlefield.

This is not moral relativism. This is the oldest form of education: stories from many places, arriving in one child's bedroom, building a mind that can hold complexity without losing its center.

That is the kind of child the world needs. And bedtime, it turns out, is the best time to start.`,
  },
];

export default function Guides() {
  const [tab, setTab] = useState('guides');
  const [openId, setOpenId] = useState('tonight');

  const items = tab === 'guides' ? GUIDES : BLOGS;

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Learn</p>
        <h1 className="display-title mt-1 text-ink">
          {tab === 'guides' ? (
            <>How to use <span className="text-gold">My Sleepy Tale</span></>
          ) : (
            <>Why <span className="text-gold">My Sleepy Tale</span> matters</>
          )}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {tab === 'guides'
            ? 'Quick reads — one per feature, 10–30 seconds each.'
            : 'The thinking behind bedtime stories.'}
        </p>
      </header>

      {/* Tab toggle */}
      <div className="mb-6 flex gap-1 rounded-pill bg-bg-surface p-1 ring-1 ring-white/5">
        <button
          onClick={() => { setTab('guides'); setOpenId('tonight'); }}
          className={`flex-1 rounded-pill py-2.5 text-center text-xs font-bold uppercase tracking-wider transition ${
            tab === 'guides' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}
        >
          ✨ Guides
        </button>
        <button
          onClick={() => { setTab('blogs'); setOpenId('what-is-mst'); }}
          className={`flex-1 rounded-pill py-2.5 text-center text-xs font-bold uppercase tracking-wider transition ${
            tab === 'blogs' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}
        >
          📖 Blog
        </button>
      </div>

      <div className="space-y-3">
        {items.map((g, i) => {
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
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    {tab === 'guides' ? `Guide ${String(i + 1).padStart(2, '0')}` : `Blog ${String(i + 1).padStart(2, '0')}`}
                    {' · '}{g.time}
                  </div>
                  <div className="mt-1 font-ui text-sm font-bold leading-snug text-ink">
                    {g.title}
                  </div>
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
                    {tab === 'guides' ? (
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
                    ) : (
                      <div className="px-4 pb-5 pl-[4.25rem]">
                        {g.body.split('\n\n').map((para, idx) => (
                          <p
                            key={idx}
                            className="mb-3 font-story text-[14px] leading-relaxed text-ink-muted last:mb-0"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
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
