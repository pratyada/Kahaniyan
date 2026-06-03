// Studio — 30-day content calendar & creative pipeline for social media.
// mysleepytale.com/studio

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

// ─── Brand tokens ───
const BLACK = '#0a0a0f';
const NAVY = '#1a1040';
const NAVY_DARK = '#0f0a2a';
const GOLD = '#f0a500';
const GOLD_LIGHT = '#ffd98a';
const CREAM = '#f5f0e8';
const MUTED = '#8a8494';
const GREEN = '#48bb78';
const SERIF = "'Georgia', 'Fraunces', 'Times New Roman', serif";
const SANS = "'Helvetica Neue', 'Arial', sans-serif";

const STATUS_CYCLE = ['todo', 'in_progress', 'done'];
const STATUS_META = {
  todo:        { label: 'To Do',        bg: '#2a2a35', color: '#999', border: '#444' },
  in_progress: { label: 'In Progress',  bg: '#3d2e00', color: GOLD,  border: GOLD },
  done:        { label: 'Done',         bg: '#1a3a2a', color: GREEN, border: GREEN },
};

// ─── Storage helpers ───
const STORAGE_KEY = 'studio_statuses';
function loadStatuses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveStatuses(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

// ─── 30-day Instagram plan ───
const INSTAGRAM_PLAN = [
  { day: 1, date: 'Jun 08', title: 'The Last Train Home', reel: 'POV out a rain-streaked train window at night; warm carriage light; distant lights blurring past; title fades in.', voiceover: 'The last train of the night is almost empty. Rain taps the glass. The seat is warm. You don\'t have to be anywhere now\u2026 just here.', caption: 'Tonight\'s story: The Last Train Home. \ud83d\ude82 A quiet carriage, rain on the windows, and nowhere you need to be. Let the rhythm of the rails carry you under.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 2, date: 'Jun 09', title: 'The Lighthouse Keeper', reel: 'Slow pan of a lighthouse beam sweeping over a dark calm sea; stars; gentle waves below.', voiceover: 'High on the cliff, the lighthouse turns its slow, patient light. The sea breathes below. Tonight you are kept safe. Tonight you can rest.', caption: 'Tonight\'s story: The Lighthouse Keeper. \ud83c\udf0a One steady light, one quiet sea, one slow breath after another.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 3, date: 'Jun 10', title: 'A Cabin in the Snow', reel: 'Crackling fireplace, embers glowing; snow falling past a frosted window; warm amber light.', voiceover: 'Snow falls without a sound. Inside, the fire settles into embers. The blanket is heavy and warm. Outside, the whole world is sleeping too.', caption: 'Tonight\'s story: A Cabin in the Snow. \u2744\ufe0f\ud83d\udd25 Snowfall, firelight, and the softest place to let your thoughts go quiet.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 4, date: 'Jun 11', title: 'The Tea Garden', reel: 'Japanese garden at dusk; paper lanterns glowing; soft rain on stone; koi-pond ripples.', voiceover: 'Rain falls gently on the garden stones. A lantern glows. Steam rises from a cup left to cool. There is nowhere to rush, nothing to solve.', caption: 'Tonight\'s story: The Tea Garden. \ud83c\udfee Lantern light, soft rain, and the slow art of doing nothing at all.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 5, date: 'Jun 12', title: 'Drifting (a boat under stars)', reel: 'A small boat on glassy dark water; Milky Way above; slow ripples; lantern on the bow.', voiceover: 'The oars are still. The water carries you. Above, a thousand stars. Below, their reflections. You are floating between two skies.', caption: 'Tonight\'s story: Drifting. \u2728 A boat, still water, and more stars than you can count. Nothing to steer. Nothing to decide.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 6, date: 'Jun 13', title: 'The Old Bookshop', reel: 'Camera drifts down a narrow aisle of old books; dust motes in lamplight; leather spines; a cat asleep on a stack.', voiceover: 'The door closes behind you. The air smells of old paper and lamp oil. Somewhere, a clock ticks very slowly. You can stay as long as you like.', caption: 'Tonight\'s story: The Old Bookshop. \ud83d\udcda Leather spines, lamplight, and a clock that has all the time in the world.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 7, date: 'Jun 14', title: 'POLL \u2014 night train vs snowy cabin', variety: true, reel: 'Split screen \u2014 rain-streaked train window vs snowy cabin fireplace; poll overlay.', voiceover: 'Which one helps you drift off faster?', caption: 'Night train or snowy cabin? \ud83d\ude82\u2744\ufe0f Which bedtime world do you want to fall asleep in tonight? Vote below \ud83d\udc47', cta: '\ud83c\udf19 The winner becomes tomorrow\'s story. Follow @mysleepytale_official so you don\'t miss it.', hashtags: '#sleepstories #bedtimestories #wouldyourather #sleephelp #polltime #mysleepytale', status: 'todo' },
  { day: 8, date: 'Jun 15', title: 'Meadow at Dusk', reel: 'Golden-hour meadow with tall grass swaying; fireflies begin to appear; distant purple hills.', voiceover: 'The grass bends in a breeze you can barely feel. One by one, the fireflies begin. The sky has forgotten how to be blue.', caption: 'Tonight\'s story: Meadow at Dusk. \ud83c\udf3e\u2728 Tall grass, fireflies, and a sky that melts from gold to violet.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 9, date: 'Jun 16', title: 'Grandmother\'s Kitchen', reel: 'Close-up of hands kneading dough; flour dust in warm light; a kettle beginning to steam; herbs on a windowsill.', voiceover: 'Flour on the counter. The kettle begins to hum. Everything in this kitchen has been here a long time \u2014 and it is all exactly where it should be.', caption: 'Tonight\'s story: Grandmother\'s Kitchen. \ud83c\udf5e Flour dust, a humming kettle, and the feeling that everything is exactly where it should be.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 10, date: 'Jun 17', title: 'The Desert Under Stars', reel: 'Vast desert dunes at night; brilliant Milky Way; a single campfire glowing; sand cooling in moonlight.', voiceover: 'The sand is still warm from the day. Above you, the Milky Way. No roads, no clocks, no walls. Just sky.', caption: 'Tonight\'s story: The Desert Under Stars. \ud83c\udfdc\ufe0f\ud83c\udf0c Warm sand, a single campfire, and the biggest sky you\'ve ever seen.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 11, date: 'Jun 18', title: 'Rain on a Tin Roof', reel: 'Close-up of rain drumming on a corrugated tin roof; cozy interior below; warm light; a book open on a table.', voiceover: 'The rain finds its rhythm on the roof. Tap tap tap-tap. Inside, everything is dry, warm, and still. This is the sound of being safe.', caption: 'Tonight\'s story: Rain on a Tin Roof. \ud83c\udf27\ufe0f The best sound in the world when you\'re warm inside and don\'t have to go anywhere.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 12, date: 'Jun 19', title: 'The Slow River', reel: 'Aerial view of a wide, slow river through green valley; golden light; a small boat drifting.', voiceover: 'The river doesn\'t hurry. It knows where it\'s going. You can watch it for an hour or an age \u2014 it is the same river, the same slow beautiful going.', caption: 'Tonight\'s story: The Slow River. \ud83c\udfde\ufe0f A river that knows where it\'s going and doesn\'t hurry to get there.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 13, date: 'Jun 20', title: 'A Greenhouse in Winter', reel: 'Inside a glass greenhouse; frost on the outside panes; tropical plants inside; warm humidity; dripping water.', voiceover: 'Outside, winter presses against the glass. Inside, everything is green and warm and breathing. You are in the warmest room in the world.', caption: 'Tonight\'s story: A Greenhouse in Winter. \ud83c\udf3f\u2744\ufe0f Frost outside the glass, tropical warmth inside, and the quietest breathing in the world.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 14, date: 'Jun 21', title: 'TIP \u2014 the 4-7-8 breath', variety: true, reel: 'Gentle animated text over a dark calm ocean \u2014 breathe in 4, hold 7, out 8; numbers pulse softly.', voiceover: 'Breathe in for four. Hold for seven. Out for eight. Again. You are already closer to sleep than you think.', caption: 'The 4-7-8 breathing trick. \ud83c\udf2c\ufe0f It\'s not magic \u2014 it\'s science. Your nervous system can\'t tell the difference between being calm and pretending to be calm. So pretend.', cta: '\ud83c\udf19 Save this for tonight. Follow @mysleepytale_official for a new story every single night.', hashtags: '#sleeptip #breathwork #478breathing #sleephack #anxietyrelief #insomniatips #mysleepytale', status: 'todo' },
  { day: 15, date: 'Jun 22', title: 'Tide Pools at Low Tide', reel: 'Close-up of tide pools \u2014 small crabs, anemones, trapped starfish; golden low-angle light; waves distant.', voiceover: 'The tide left behind tiny worlds. A crab no bigger than a coin. A starfish holding on. They don\'t know the ocean will come back. But it always does.', caption: 'Tonight\'s story: Tide Pools at Low Tide. \ud83c\udf0a Tiny worlds left behind by the sea. Small enough to hold in your hand. Big enough to fall asleep in.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 16, date: 'Jun 23', title: 'The Sleeping Village', reel: 'Aerial slow drift over a tiny village at night; warm windows glowing; smoke from chimneys; cobblestone streets.', voiceover: 'Every window glows. Smoke rises from every chimney. The cobblestones are cool and clean. The whole village is falling asleep \u2014 and so are you.', caption: 'Tonight\'s story: The Sleeping Village. \ud83c\udfe1 Warm windows, chimney smoke, and the quietest street in the world.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 17, date: 'Jun 24', title: 'Lavender Fields', reel: 'Endless lavender rows stretching to a sunset; bees; warm breeze; scent almost visible.', voiceover: 'Purple as far as you can see. The bees are finishing their day. The air smells the way calm feels. Breathe it in. Breathe it out.', caption: 'Tonight\'s story: Lavender Fields. \ud83d\udc9c Purple to the horizon, the hum of tired bees, and air that smells the way calm feels.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 18, date: 'Jun 25', title: 'POLL \u2014 pick tonight\'s sleep mood', variety: true, reel: 'Four quadrants \u2014 ocean / forest / rain / stars \u2014 each with gentle motion; poll overlay.', voiceover: 'What does your sleep need tonight? Ocean, forest, rain, or stars?', caption: 'Pick your tonight. \ud83c\udf0a\ud83c\udf32\ud83c\udf27\ufe0f\u2b50 What mood does your sleep need? The most voted becomes our next story.', cta: '\ud83c\udf19 Follow @mysleepytale_official \u2014 a new sleep story every night. The winner drops tomorrow.', hashtags: '#sleepstories #wouldyourather #sleeppoll #bedtimestories #chooseyouradventure #mysleepytale', status: 'todo' },
  { day: 19, date: 'Jun 26', title: 'The Ferry Crossing', reel: 'Car ferry crossing a fjord at dusk; still water; distant mountains; slow engine hum.', voiceover: 'The ferry hums. The water is flat as glass. Mountains on both sides, silent as old friends. You are crossing from somewhere to somewhere \u2014 but for now, you are exactly in between.', caption: 'Tonight\'s story: The Ferry Crossing. \u26f4\ufe0f Flat water, silent mountains, and the feeling of being gently carried somewhere.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 20, date: 'Jun 27', title: 'An Attic of Forgotten Things', reel: 'Dusty attic with warm light through a small window; old trunks, globes, letters, a music box turning slowly.', voiceover: 'A music box is still turning. Someone wound it years ago and forgot. The melody is thin, and sweet, and it doesn\'t know you\'re listening.', caption: 'Tonight\'s story: An Attic of Forgotten Things. \ud83c\udfb5 A music box still playing, old letters, and the kind of quiet that keeps secrets.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 21, date: 'Jun 28', title: 'TESTIMONIAL \u2014 your DMs', variety: true, reel: 'Screenshot-style DM bubbles fading in one by one over dark calm background; soft music.', voiceover: 'You sent these. Every word is real.', caption: 'You sent us these. We didn\'t ask \u2014 you just\u2026 told us. \ud83d\udcac "I fell asleep before the story ended." "My kid asked for the train one again." "I\'ve tried everything. This actually worked." This is why we keep making them.', cta: '\ud83c\udf19 Follow @mysleepytale_official for a new sleep story every night. And keep the DMs coming. \ud83d\udc9b', hashtags: '#sleepstories #bedtimestories #testimonial #sleephelp #itworks #realresults #mysleepytale', status: 'todo' },
  { day: 22, date: 'Jun 29', title: 'A Field of Wheat', reel: 'Golden wheat field rippling in wind; sunset backlighting; a path disappearing into the gold.', voiceover: 'The wheat bends and rises. The sun is almost gone. You could walk this path forever. Or you could stop, right here, and let the gold close around you.', caption: 'Tonight\'s story: A Field of Wheat. \ud83c\udf3e Golden light, a rippling sea of wheat, and the softest place to disappear.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 23, date: 'Jun 30', title: 'The Observatory', reel: 'Inside a hilltop observatory; telescope pointed at stars; mechanical dome rotating slowly; celestial maps.', voiceover: 'The dome turns with a low hum. Through the lens, Jupiter hangs like a lantern. The astronomer fell asleep hours ago. The stars don\'t mind.', caption: 'Tonight\'s story: The Observatory. \ud83d\udd2d A turning dome, a sleeping astronomer, and Jupiter as clear as a lantern.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 24, date: 'Jul 01', title: 'The Houseboat', reel: 'A wooden houseboat on a calm canal; string lights, potted plants on deck; gentle rocking; canal reflections.', voiceover: 'The houseboat rocks, just barely. String lights sway. The canal reflects them back \u2014 twice as many lights, twice as much quiet.', caption: 'Tonight\'s story: The Houseboat. \ud83d\udee8 String lights, still water, and a gentle rocking that makes everything else fade.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 25, date: 'Jul 02', title: 'The Quiet Cafe at Closing', reel: 'Empty cafe at closing time; chairs being put up; last cup of coffee cooling; rain starting outside.', voiceover: 'The chairs are going up. The espresso machine sighs and goes quiet. Your cup is almost cold. Outside, it starts to rain \u2014 but you don\'t have to leave yet.', caption: 'Tonight\'s story: The Quiet Cafe at Closing. \u2615 The last cup, the chairs going up, and rain that starts just as you stop needing the world.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 26, date: 'Jul 03', title: 'The Forest After Rain', reel: 'Wet forest floor; mushrooms and ferns; water dripping from leaves; mist between trees; birdsong fading.', voiceover: 'The rain has stopped but the forest hasn\'t noticed. Water drips from leaf to leaf, slow and patient, as if it has nowhere else to be.', caption: 'Tonight\'s story: The Forest After Rain. \ud83c\udf32\ud83d\udca7 Wet ferns, dripping leaves, and a forest that hasn\'t noticed the rain stopped.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstories #bedtimestories #fallasleepfast #sleephelp #calm #insomniarelief #cozyvibes #mysleepytale', status: 'todo' },
  { day: 27, date: 'Jul 04', title: 'The Northern Lights', reel: 'Aurora borealis over a frozen lake; green and purple curtains; snow; a cabin in the distance.', voiceover: 'Green and violet, the sky is dancing. It moves like breathing \u2014 in and out, in and out. You\'ve never seen anything so quiet be so alive.', caption: 'Tonight\'s story: The Northern Lights. \ud83c\udf0c A sky that breathes in green and violet. The quietest dance you\'ll ever see.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#sleepstory #cantsleep #relaxation #sleepaid #nighttimeroutine #unwind #sleepbetter #mysleepytale', status: 'todo' },
  { day: 28, date: 'Jul 05', title: 'BEHIND-THE-SCENES \u2014 how a story is made', variety: true, reel: 'Screen recording style \u2014 writing in a doc, recording audio, editing waveform; cozy desk setup.', voiceover: 'This is how one story goes from a blank page to your pillow. It takes about a day. Most of it is deleting things.', caption: 'How a mysleepytale story is made. \u270d\ufe0f Blank page \u2192 writing \u2192 deleting everything too interesting \u2192 recording \u2192 editing \u2192 your pillow. Most of the job is deletion.', cta: '\ud83c\udf19 Follow @mysleepytale_official to hear the result every night. \ud83d\udca4', hashtags: '#behindthescenes #bts #creatorlife #sleepstories #howimadeit #contentcreation #mysleepytale', status: 'todo' },
  { day: 29, date: 'Jul 06', title: 'A Hammock Between Two Pines', reel: 'A hammock swaying gently between pine trees; dappled sunlight; birds; a book face-down.', voiceover: 'The pines sway. The hammock sways. The book fell open three pages ago and you didn\'t notice. That is exactly the point.', caption: 'Tonight\'s story: A Hammock Between Two Pines. \ud83c\udf32 Swaying trees, a forgotten book, and the slowest afternoon of your life.', cta: '\ud83c\udf19 Full story \u2192 link in bio. Already drifting? DM us ONE word for how it made you feel. \ud83d\udca4', hashtags: '#bedtime #sleeptok #asmrvibes #winddown #restwell #sleepmeditation #cozyaesthetic #mysleepytale', status: 'todo' },
  { day: 30, date: 'Jul 07', title: 'MILESTONE \u2014 30 nights, thank you', variety: true, reel: 'Montage of all 30 visuals \u2014 quick gentle dissolves; counter ticking up 1-30; final frame: thank you.', voiceover: 'Thirty nights. Thirty stories. And you showed up for every one. Thank you for letting us put you to sleep.', caption: '30 nights. 30 stories. \ud83c\udf19 We started this 30 days ago with a quiet train and a rainy window. Tonight we end with something better: you. Thank you for every DM, every follow, every "I fell asleep." This is just the beginning.', cta: '\ud83c\udf19 Follow @mysleepytale_official \u2014 the stories don\'t stop. Something new is coming. \ud83d\udc9b', hashtags: '#sleepstories #bedtimestories #30daychallenge #milestone #thankyou #community #mysleepytale', status: 'todo' },
];

const PLATFORM_X_PLAN = [
  { day: 1, date: 'Jun 08', pillar: 'Why I built this', format: 'Thread', post: "I couldn't sleep for most of 2 years.\n\nNot the romantic kind of insomnia. The 3am, staring-at-the-ceiling, dreading-tomorrow kind.\n\nSo I started building the thing I wished existed. It's called mysleepytale, and I'm going to build it in public. \ud83e\uddf5\n\n\u2014\u2014\u2014\n2/ Every sleep app I tried did one of two things: rain sounds on a loop, or a story so interesting I stayed up to hear the end.\n\nI wanted the opposite. A story warm enough to follow, boring enough to lose. Designed to make you stop listening.", status: 'todo' },
  { day: 2, date: 'Jun 09', pillar: 'What it is', format: 'Single', post: "mysleepytale in one line: short, narrated bedtime stories, written and paced specifically to make you fall asleep before they end.\n\nThat last part is the whole product. If you hear the ending, I failed.", status: 'todo' },
  { day: 3, date: 'Jun 10', pillar: 'Design decision', format: 'Single', post: "Design decision I keep defending: no plot.\n\nPeople expect stories to build toward something. But tension keeps you awake. So mysleepytale stories go nowhere on purpose \u2014 a train ride, a quiet garden, a slow river.\n\nThe reward isn't the ending. It's the drifting.", status: 'todo' },
  { day: 4, date: 'Jun 11', pillar: 'Behind-the-scenes', format: 'Single', post: "Spent today writing 'The Lighthouse Keeper.'\n\nWriting for sleep is strange. I delete every sentence that's too interesting. No conflict, no surprises, no clever turns.\n\nIt feels wrong as a writer. It works as a sleep aid. That tension is the job.", status: 'todo' },
  { day: 5, date: 'Jun 12', pillar: 'Choosing the voice', format: 'Single', post: "The hardest choice so far: the voice.\n\nI tested 14 AI voices. The 'good' ones all sound like audiobook narrators \u2014 too polished, too awake.\n\nThe one I picked sounds slightly tired. A little worn. Like someone reading to you who's also about to fall asleep.\n\nThat's the voice.", status: 'todo' },
  { day: 6, date: 'Jun 13', pillar: 'First story done', format: 'Single', post: "First story done: 'The Last Train Home.'\n\nIt's 6 minutes long. The plot is: you're on a train. It's raining. That's it.\n\nI played it at midnight. Fell asleep at minute 4. Didn't hear the ending.\n\nShipped it.", status: 'todo' },
  { day: 7, date: 'Jun 14', pillar: 'Question', format: 'Single', post: "Genuine question: what puts you to sleep?\n\nRain sounds? Podcasts? Audiobooks? TV on low? A fan? Silence?\n\nNo wrong answer. I'm studying this.", status: 'todo' },
  { day: 8, date: 'Jun 15', pillar: 'Mistake', format: 'Single', post: "Made a mistake last week. Wrote a story about a fox solving a problem. Classic structure: character wants thing, overcomes obstacle, achieves thing.\n\nTesters stayed awake to hear if the fox won.\n\nDeleted the whole thing. The fox now sits in a field doing nothing. Much better.", status: 'todo' },
  { day: 9, date: 'Jun 16', pillar: 'Lesson', format: 'Single', post: "The most underrated ingredient in a sleep story: silence.\n\nNot literal silence. But moments where nothing happens. A pause. A breath. A sentence that goes nowhere.\n\nYour brain expects input. When input stops, it starts to let go.\n\nI'm building those gaps in on purpose.", status: 'todo' },
  { day: 10, date: 'Jun 17', pillar: 'Honest numbers', format: 'Single', post: "Week 2 numbers, honest:\n\n- 3 stories written\n- 2 recorded\n- 1 I'm happy with\n- 0 users yet\n- 1 person who fell asleep to it (me)\n\nBuilding in public means showing the ugly part too. This is the ugly part.", status: 'todo' },
  { day: 11, date: 'Jun 18', pillar: 'Feature', format: 'Single', post: "Feature I'm most proud of: the fade-out.\n\nmysleepytale stories don't end. They fade. The narrator's voice gets a tiny bit quieter every 30 seconds. The music softens. The pauses get longer.\n\nBy the time it's 'over,' you're already gone.", status: 'todo' },
  { day: 12, date: 'Jun 19', pillar: 'Reflection', format: 'Single', post: "Building in public is scarier than I expected.\n\nNot the code or the content \u2014 the vulnerability. Saying 'I'm making a sleep story app' out loud feels ridiculous some days.\n\nBut the alternative is building in silence, and nobody cares about things they don't know exist.", status: 'todo' },
  { day: 13, date: 'Jun 20', pillar: 'Story craft', format: 'Single', post: "Story trick I learned: dissolve, don't end.\n\nA normal story builds to a climax and resolves. That resolution is satisfying. Satisfaction is a feeling. Feelings keep you awake.\n\nmysleepytale stories dissolve. Like sugar in warm water. You don't notice when it's gone.", status: 'todo' },
  { day: 14, date: 'Jun 21', pillar: 'A DM', format: 'Single', post: "Got a DM today: 'I played The Lighthouse Keeper for my 4-year-old. She fell asleep in 3 minutes. Usually it takes 40.'\n\nI've been staring at this message for an hour. This is the entire reason.", status: 'todo' },
  { day: 15, date: 'Jun 22', pillar: 'Halfway recap', format: 'Thread', post: "Halfway through 30 days of building mysleepytale in public. Here's what I know now that I didn't know on Day 1. \ud83e\uddf5\n\n\u2014\u2014\u2014\n2/ Writing for sleep is the opposite of writing for engagement. Every instinct that makes content 'good' \u2014 hooks, tension, stakes \u2014 is wrong here. The best sleep story is the one you can't remember finishing.\n\n\u2014\u2014\u2014\n3/ The voice matters more than the words. I can write a perfect script and ruin it with a voice that's too sharp, too fast, or too clear. The ideal voice sounds like it's reading from the next room, through a closed door.", status: 'todo' },
  { day: 16, date: 'Jun 23', pillar: 'Tech decision', format: 'Single', post: "Tech decision that changed everything: instant playback.\n\nEarly version made you wait 8 seconds for audio to buffer. In those 8 seconds, 80% of people left.\n\nNow it plays in under 1 second. Retention doubled. Sometimes the product problem is just\u2026 loading time.", status: 'todo' },
  { day: 17, date: 'Jun 24', pillar: 'Library update', format: 'Single', post: "The library just hit 8 stories.\n\nA train. A lighthouse. A cabin. A tea garden. A boat. A bookshop. A meadow. A grandmother's kitchen.\n\nEach one is about 6 minutes long. Each one goes nowhere in particular. That's the point. That's the whole point.", status: 'todo' },
  { day: 18, date: 'Jun 25', pillar: 'Poll', format: 'Single', post: "What should the next story be about?\n\n\ud83c\udfd4\ufe0f A mountaintop hut in the clouds\n\ud83c\udf0a A beach at low tide, alone\n\ud83c\udf27\ufe0f A rainy afternoon in a library\n\ud83c\udfd5\ufe0f A campfire going out, slowly\n\nMost votes wins. I'll write it this week.", status: 'todo' },
  { day: 19, date: 'Jun 26', pillar: 'The flat days', format: 'Single', post: "Day 19 and I don't feel like building.\n\nThe flat days are part of it. Not every day is a breakthrough or a lesson. Some days you just move files around and stare at a screen and go to bed.\n\nShowing up is the only skill that compounds.", status: 'todo' },
  { day: 20, date: 'Jun 27', pillar: 'Pricing thoughts', format: 'Single', post: "Thinking out loud about pricing.\n\nFree tier: 2 stories. Enough to know if it works for you.\nPaid: unlimited, maybe $3-5/month.\n\nI keep going back and forth. Part of me wants it free forever because sleep shouldn't be a luxury.\n\nBut servers aren't free and neither am I. What do you think?", status: 'todo' },
  { day: 21, date: 'Jun 28', pillar: 'Recording day', format: 'Single', post: "Recording day. Here's what my desk looks like:\n\n- Laptop open to the script\n- Cheap USB mic with a sock over it (real studio)\n- Glass of water (voice cracks are not soothing)\n- Cat asleep on the keyboard (unhelpful but on-brand)\n\nThree stories recorded. Two are good. One made me laugh, which means it's too interesting. Deleted.", status: 'todo' },
  { day: 22, date: 'Jun 29', pillar: 'Detail obsession', format: 'Single', post: "A detail I spent 2 hours on that nobody will notice: the silence between sentences.\n\nI adjusted every pause to be between 1.8 and 2.4 seconds. Not random \u2014 calibrated. Shorter pauses feel rushed. Longer ones feel broken.\n\n1.8 to 2.4 seconds. That's the sweet spot. You'll never notice. That's the point.", status: 'todo' },
  { day: 23, date: 'Jun 30', pillar: 'Why so slow', format: 'Single', post: "People keep asking: why is the narration so slow?\n\nBecause your brain processes speech 3x faster than sleep allows. Normal conversation pace keeps your prefrontal cortex active. Slow pace lets it disengage.\n\nI'm not being artistic. I'm being neurological.", status: 'todo' },
  { day: 24, date: 'Jul 01', pillar: 'Shoutout', format: 'Single', post: "Shoutout to the 23 people who signed up in the first two weeks.\n\nYou took a chance on something with zero social proof, a weird name, and a promise that it would bore you to sleep.\n\nThat takes a specific kind of trust. I won't waste it.", status: 'todo' },
  { day: 25, date: 'Jul 02', pillar: 'Lesson', format: 'Single', post: "Day 25 lesson: consistency > intensity.\n\nI could have spent 25 days making one perfect story. Instead I made 10 imperfect ones. The 10th one is better than the 1st by a mile.\n\nYou can't edit your way to good. You have to ship your way there.", status: 'todo' },
  { day: 26, date: 'Jul 03', pillar: 'Sneak peek', format: 'Single', post: "Sneak peek at something I'm building: mood-matching.\n\nBefore bed, you pick a feeling: anxious, restless, wired, lonely, overthinking.\n\nmysleepytale picks the story that fits. Not random \u2014 mapped to specific narrative patterns that address each state.\n\nAnxious \u2192 contained spaces (cabin, greenhouse)\nRestless \u2192 motion (train, river, ferry)\nLonely \u2192 populated warmth (village, kitchen, caf\u00e9)\n\nShipping next week.", status: 'todo' },
  { day: 27, date: 'Jul 04', pillar: 'Hardest part', format: 'Single', post: "The hardest part of building this isn't the tech or the writing. It's the doubt.\n\nEvery day: 'Is this too niche? Will anyone pay for this? Am I just building a fancy podcast?'\n\nThen someone DMs: 'I slept through the night for the first time in weeks.'\n\nAnd the doubt shuts up. For a day.", status: 'todo' },
  { day: 28, date: 'Jul 05', pillar: 'Almost there', format: 'Single', post: "Almost 30 days in.\n\nThe library has 12 stories. The narration is dialed in. The fade-out works. The silence gaps work. The voice works.\n\nIt's not perfect. It's not even close. But it's real, and it works, and people are sleeping.\n\nThat's enough for now.", status: 'todo' },
  { day: 29, date: 'Jul 06', pillar: 'Teaser', format: 'Single', post: "Something's launching this week.\n\nCan't say what yet. But if you've been following along for 29 days, you're going to like it.\n\nStay tuned. \ud83c\udf19", status: 'todo' },
  { day: 30, date: 'Jul 07', pillar: '30-day recap', format: 'Thread', post: "30 days ago I started building mysleepytale in public. Here's the honest recap. \ud83e\uddf5\n\n\u2014\u2014\u2014\n2/ What I built: 12 narrated bedtime stories designed to make you fall asleep. A web player. A mood-matching system. A brand. A community of 100+ people who just want to sleep.\n\n\u2014\u2014\u2014\n3/ What I learned: Writing for sleep is deletion. The voice matters more than the words. Silence is a feature. Loading time is a product decision. Consistency beats intensity. Showing up scared still counts as showing up.\n\n\u2014\u2014\u2014\n4/ What's next: More stories. A mobile experience. Paid tier. And something I've been working on quietly that I'll share next week.\n\nThank you for following along. The 30 days are done. The building isn't.\n\n\ud83c\udf19 mysleepytale.com", status: 'todo' },
];

// ─── Weekday labels ───
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Toast component ───
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        background: GOLD, color: BLACK, fontFamily: SANS, fontWeight: 700, fontSize: 14,
        padding: '10px 24px', borderRadius: 12, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {message}
    </motion.div>
  );
}

// ─── Status badge ───
function StatusBadge({ status, onClick }) {
  const s = STATUS_META[status] || STATUS_META.todo;
  return (
    <button
      onClick={onClick}
      style={{
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700,
        fontFamily: SANS, cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.2s',
      }}
    >
      {s.label}
    </button>
  );
}

// ─── Main component ───
export default function Studio() {
  const [tab, setTab] = useState('calendar');
  const [statuses, setStatuses] = useState(loadStatuses);
  const [expandedDay, setExpandedDay] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1); // 1-5 (week selector)

  const WEEKS = [
    { id: 1, label: 'Week 1', days: [1, 2, 3, 4, 5, 6, 7], range: 'Jun 8 – 14' },
    { id: 2, label: 'Week 2', days: [8, 9, 10, 11, 12, 13, 14], range: 'Jun 15 – 21' },
    { id: 3, label: 'Week 3', days: [15, 16, 17, 18, 19, 20, 21], range: 'Jun 22 – 28' },
    { id: 4, label: 'Week 4', days: [22, 23, 24, 25, 26, 27, 28], range: 'Jun 29 – Jul 5' },
    { id: 5, label: 'Week 5', days: [29, 30], range: 'Jul 6 – 7' },
  ];
  const currentWeek = WEEKS.find(w => w.id === selectedWeek);
  const weekDays = new Set(currentWeek.days);

  const showToast = useCallback((msg) => setToast(msg), []);

  const getStatus = (platform, day) => statuses[`${platform}_${day}`] || 'todo';
  const cycleStatus = (platform, day) => {
    setStatuses(prev => {
      const key = `${platform}_${day}`;
      const cur = prev[key] || 'todo';
      const idx = STATUS_CYCLE.indexOf(cur);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      const updated = { ...prev, [key]: next };
      saveStatuses(updated);
      return updated;
    });
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label}!`);
    } catch {
      showToast('Copy failed -- try again');
    }
  };

  const TABS = [
    { id: 'calendar', label: 'Calendar', icon: '\ud83d\udcc5' },
    { id: 'instagram', label: 'Instagram', icon: '\ud83d\udcf7' },
    { id: 'xposts', label: 'X Posts', icon: '\ud835\udd4f' },
    { id: 'creatives', label: 'Creatives', icon: '\ud83c\udfa8' },
  ];

  // ─── Calendar grid logic ───
  // Jun 8, 2026 is a Monday (day index 1)
  const startDate = new Date(2026, 5, 8); // Jun 8
  const startDayOfWeek = startDate.getDay(); // 1 = Monday
  const emptySlots = startDayOfWeek; // blank cells before Day 1

  // ─── Progress stats ───
  const igDone = INSTAGRAM_PLAN.filter((_, i) => getStatus('ig', i + 1) === 'done').length;
  const xDone = PLATFORM_X_PLAN.filter((_, i) => getStatus('x', i + 1) === 'done').length;
  const totalDone = igDone + xDone;
  const totalPosts = 60;

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: BLACK, color: CREAM, fontFamily: SANS }}>
        {/* Header */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 0' }}>
          <Link to="/" style={{ color: MUTED, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>&larr;</span> Back to home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 36 }}>\ud83c\udf19</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 5vw, 42px)', margin: 0, color: CREAM, fontWeight: 700 }}>Studio</h1>
          </div>
          <p style={{ color: MUTED, fontSize: 15, margin: '0 0 8px', maxWidth: 500 }}>
            30-day content calendar & creative pipeline
          </p>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, height: 6, background: '#1e1e2a', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalDone / totalPosts) * 100}%` }}
                transition={{ duration: 0.6 }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${GREEN})`, borderRadius: 4 }}
              />
            </div>
            <span style={{ color: MUTED, fontSize: 13, whiteSpace: 'nowrap' }}>{totalDone}/{totalPosts} posts done</span>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #222', marginBottom: 24, overflowX: 'auto' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: tab === t.id ? '#1e1e2a' : 'transparent',
                  color: tab === t.id ? GOLD : MUTED,
                  border: 'none', borderBottom: tab === t.id ? `2px solid ${GOLD}` : '2px solid transparent',
                  padding: '10px 18px', cursor: 'pointer', fontFamily: SANS, fontWeight: 600,
                  fontSize: 14, whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Week selector */}
          {tab !== 'creatives' && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {WEEKS.map(w => {
                const weekIgDone = w.days.filter(d => getStatus('ig', d) === 'done').length;
                const weekXDone = w.days.filter(d => getStatus('x', d) === 'done').length;
                const weekTotal = w.days.length * 2;
                const weekDone = weekIgDone + weekXDone;
                return (
                  <button key={w.id} onClick={() => setSelectedWeek(w.id)}
                    style={{
                      background: selectedWeek === w.id ? `${GOLD}20` : '#12121e',
                      color: selectedWeek === w.id ? GOLD : MUTED,
                      border: `1px solid ${selectedWeek === w.id ? GOLD + '50' : '#222'}`,
                      borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontFamily: SANS,
                      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 90,
                    }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{w.label}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{w.range}</span>
                    <span style={{ fontSize: 9, color: weekDone === weekTotal ? GREEN : MUTED }}>{weekDone}/{weekTotal}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
          <AnimatePresence mode="wait">
            {tab === 'calendar' && <CalendarTab key="cal" statuses={statuses} getStatus={getStatus} cycleStatus={cycleStatus} expandedDay={expandedDay} setExpandedDay={setExpandedDay} emptySlots={emptySlots} startDate={startDate} weekDays={weekDays} />}
            {tab === 'instagram' && <InstagramTab key="ig" getStatus={getStatus} cycleStatus={cycleStatus} copyToClipboard={copyToClipboard} weekDays={weekDays} />}
            {tab === 'xposts' && <XPostsTab key="x" getStatus={getStatus} cycleStatus={cycleStatus} copyToClipboard={copyToClipboard} weekDays={weekDays} />}
            {tab === 'creatives' && <CreativesTab key="cr" />}
          </AnimatePresence>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// Calendar Tab
// ═══════════════════════════════════════════════════
function CalendarTab({ getStatus, cycleStatus, expandedDay, setExpandedDay, emptySlots, startDate, weekDays }) {
  const getDayDate = (dayNum) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayNum - 1);
    return d;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      {/* Weekday headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4, marginBottom: 4,
      }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: 'center', color: MUTED, fontSize: 12, fontWeight: 600, padding: '6px 0' }}>{w}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
      }}
        className="studio-cal-grid"
      >
        {/* Day cells — filtered by selected week */}
        {INSTAGRAM_PLAN.filter(ig => weekDays.has(ig.day)).map((ig) => {
          const xp = PLATFORM_X_PLAN[ig.day - 1];
          const igStatus = getStatus('ig', ig.day);
          const xStatus = getStatus('x', ig.day);
          const isExpanded = expandedDay === ig.day;
          const dateObj = getDayDate(ig.day);
          const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          // Determine overall day status (worst of the two)
          const overallStatus = (igStatus === 'done' && xStatus === 'done') ? 'done'
            : (igStatus === 'in_progress' || xStatus === 'in_progress') ? 'in_progress' : 'todo';
          const cellBorder = STATUS_META[overallStatus].border;

          return (
            <motion.div
              key={ig.day}
              layoutId={`day-${ig.day}`}
              onClick={() => setExpandedDay(isExpanded ? null : ig.day)}
              style={{
                background: '#12121e', border: `1px solid ${isExpanded ? GOLD : cellBorder + '44'}`,
                borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
                minHeight: 90, position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: MUTED }}>{dateStr}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: CREAM }}>{ig.day}</span>
              </div>
              <div style={{ fontSize: 11, color: GOLD_LIGHT, fontWeight: 600, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ig.variety ? '\u2728 ' : '\ud83d\udcf7 '}{ig.title.length > 18 ? ig.title.slice(0, 18) + '\u2026' : ig.title}
              </div>
              <div style={{ fontSize: 10, color: '#7a7a9a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                \ud835\udd4f {xp?.pillar || ''}
              </div>
              {/* Status dots */}
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_META[igStatus].color, opacity: 0.9 }} title={`IG: ${STATUS_META[igStatus].label}`} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_META[xStatus].color, opacity: 0.9 }} title={`X: ${STATUS_META[xStatus].label}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded day detail */}
      <AnimatePresence>
        {expandedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: 16 }}
          >
            <ExpandedDayCard day={expandedDay} getStatus={getStatus} cycleStatus={cycleStatus} onClose={() => setExpandedDay(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 640px) {
          .studio-cal-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .studio-cal-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </motion.div>
  );
}

// ─── Expanded day card ───
function ExpandedDayCard({ day, getStatus, cycleStatus, onClose }) {
  const ig = INSTAGRAM_PLAN[day - 1];
  const xp = PLATFORM_X_PLAN[day - 1];
  if (!ig || !xp) return null;

  return (
    <div style={{ background: '#16162a', border: `1px solid ${GOLD}44`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontFamily: SERIF, fontSize: 22, margin: 0, color: CREAM }}>
          Day {day} &middot; {ig.date}
        </h3>
        <button onClick={onClose} style={{ background: '#222', border: 'none', color: MUTED, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>Close</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Instagram section */}
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>\ud83d\udcf7 Instagram</span>
            <StatusBadge status={getStatus('ig', day)} onClick={() => cycleStatus('ig', day)} />
          </div>
          <h4 style={{ fontFamily: SERIF, color: CREAM, margin: '0 0 8px', fontSize: 16 }}>{ig.title}</h4>
          <p style={{ color: MUTED, fontSize: 13, margin: '0 0 6px' }}><strong style={{ color: '#aaa' }}>Reel:</strong> {ig.reel}</p>
          <p style={{ color: MUTED, fontSize: 13, margin: '0 0 6px' }}><strong style={{ color: '#aaa' }}>VO:</strong> {ig.voiceover}</p>
          <p style={{ color: '#ccc', fontSize: 13, margin: '0 0 4px' }}>{ig.caption}</p>
          <p style={{ color: GOLD_LIGHT, fontSize: 12, margin: '0 0 4px' }}>{ig.cta}</p>
          <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>{ig.hashtags}</p>
        </div>

        {/* X section */}
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>\ud835\udd4f Platform X</span>
            <StatusBadge status={getStatus('x', day)} onClick={() => cycleStatus('x', day)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ background: '#2a2a3e', color: MUTED, borderRadius: 6, padding: '2px 10px', fontSize: 12 }}>{xp.pillar}</span>
            <span style={{ background: xp.format === 'Thread' ? '#3d2e00' : '#2a2a3e', color: xp.format === 'Thread' ? GOLD : MUTED, borderRadius: 6, padding: '2px 10px', fontSize: 12 }}>{xp.format}</span>
          </div>
          <p style={{ color: '#ccc', fontSize: 13, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{xp.post}</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Instagram Tab
// ═══════════════════════════════════════════════════
function InstagramTab({ getStatus, cycleStatus, copyToClipboard, weekDays }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {INSTAGRAM_PLAN.filter(ig => weekDays.has(ig.day)).map(ig => {
          const isOpen = expanded === ig.day;
          const fullCaption = `${ig.caption}\n\n${ig.cta}\n\n${ig.hashtags}`;

          return (
            <motion.div
              key={ig.day}
              layout
              style={{
                background: '#12121e', border: `1px solid ${isOpen ? GOLD + '66' : '#222'}`,
                borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s',
              }}
            >
              {/* Header row */}
              <div
                onClick={() => setExpanded(isOpen ? null : ig.day)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer',
                  justifyContent: 'space-between', flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: SERIF, minWidth: 32 }}>{ig.day}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: CREAM, fontSize: 15 }}>{ig.title}</div>
                    <div style={{ color: MUTED, fontSize: 12 }}>{ig.date}{ig.variety ? ' \u2022 Variety Post' : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusBadge status={getStatus('ig', ig.day)} onClick={(e) => { e.stopPropagation(); cycleStatus('ig', ig.day); }} />
                  <span style={{ color: MUTED, fontSize: 18, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>\u25bc</span>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1e1e2a' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 14 }}>
                        <div>
                          <Label>Reel Concept</Label>
                          <p style={{ color: '#bbb', fontSize: 13, margin: '4px 0 12px', lineHeight: 1.5 }}>{ig.reel}</p>
                          <Label>Voiceover</Label>
                          <p style={{ color: '#ccc', fontSize: 13, margin: '4px 0', lineHeight: 1.5, fontStyle: 'italic' }}>"{ig.voiceover}"</p>
                        </div>
                        <div>
                          <Label>Caption</Label>
                          <p style={{ color: '#ccc', fontSize: 13, margin: '4px 0 8px', lineHeight: 1.5 }}>{ig.caption}</p>
                          <Label>CTA</Label>
                          <p style={{ color: GOLD_LIGHT, fontSize: 13, margin: '4px 0 8px' }}>{ig.cta}</p>
                          <Label>Hashtags</Label>
                          <p style={{ color: MUTED, fontSize: 12, margin: '4px 0 14px', wordBreak: 'break-all' }}>{ig.hashtags}</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <ActionButton onClick={() => copyToClipboard(fullCaption, 'caption')} label="Copy Caption" />
                            <ActionButton onClick={() => {}} label="Generate Reel" disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// X Posts Tab
// ═══════════════════════════════════════════════════
function XPostsTab({ getStatus, cycleStatus, copyToClipboard, weekDays }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PLATFORM_X_PLAN.filter(xp => weekDays.has(xp.day)).map(xp => {
          const isOpen = expanded === xp.day;

          return (
            <motion.div
              key={xp.day}
              layout
              style={{
                background: '#12121e', border: `1px solid ${isOpen ? GOLD + '66' : '#222'}`,
                borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s',
              }}
            >
              {/* Header row */}
              <div
                onClick={() => setExpanded(isOpen ? null : xp.day)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer',
                  justifyContent: 'space-between', flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: SERIF, minWidth: 32 }}>{xp.day}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: CREAM, fontSize: 15 }}>{xp.pillar}</div>
                    <div style={{ color: MUTED, fontSize: 12 }}>{xp.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    background: xp.format === 'Thread' ? '#3d2e00' : '#2a2a3e',
                    color: xp.format === 'Thread' ? GOLD : MUTED,
                    borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                  }}>{xp.format}</span>
                  <StatusBadge status={getStatus('x', xp.day)} onClick={(e) => { e.stopPropagation(); cycleStatus('x', xp.day); }} />
                  <span style={{ color: MUTED, fontSize: 18, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>\u25bc</span>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1e1e2a' }}>
                      <div style={{
                        background: '#0e0e1a', borderRadius: 10, padding: 16, marginTop: 14,
                        border: '1px solid #1e1e2a',
                      }}>
                        <p style={{ color: '#ddd', fontSize: 14, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7, fontFamily: SANS }}>{xp.post}</p>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <ActionButton onClick={() => copyToClipboard(xp.post, 'post')} label="Copy Post" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// Creatives Tab
// ═══════════════════════════════════════════════════
function CreativesTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div style={{
        background: '#12121e', borderRadius: 20, padding: '48px 32px',
        textAlign: 'center', border: '1px solid #222',
      }}>
        <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>\ud83c\udfa8</span>
        <h2 style={{ fontFamily: SERIF, color: CREAM, fontSize: 28, margin: '0 0 12px' }}>Marketing Creatives</h2>
        <p style={{ color: MUTED, fontSize: 15, margin: '0 0 28px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Design and download print-ready posters, social posts, standees, and more -- all in the My Sleepy Tale brand.
        </p>
        <Link
          to="/creatives"
          style={{
            display: 'inline-block', background: GOLD, color: BLACK,
            fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 12,
            textDecoration: 'none', fontFamily: SANS, transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: `0 4px 20px ${GOLD}44`,
          }}
        >
          Open Creatives Studio &rarr;
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Shared small components ───

function Label({ children }) {
  return (
    <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
      {children}
    </span>
  );
}

function ActionButton({ onClick, label, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#1e1e2a' : GOLD,
        color: disabled ? '#555' : BLACK,
        border: 'none', borderRadius: 8, padding: '8px 18px',
        fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: SANS, opacity: disabled ? 0.5 : 1, transition: 'transform 0.15s',
      }}
    >
      {label}
    </button>
  );
}
