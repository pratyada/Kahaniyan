// ─────────────────────────────────────────────────────────────
// castStoryBuilder — generates a fresh story for a chosen cast.
//
// Unlike the template bank (which uses fixed slots), this builder
// constructs a story scaffold-by-scaffold so EVERY selected
// character gets a real beat in the plot. Each cast member is
// introduced by name and given a moment that uses their relation.
//
// Five scaffolds rotate to keep variety:
//   1. The Garden Adventure
//   2. The Lost Treasure
//   3. The Quiet Evening
//   4. The Festival of Lights
//   5. The Rooftop Stargazers
//
// Each scaffold takes the cast + value + child name and weaves
// a real story. Length is fitted afterwards by fitToDuration.
// ─────────────────────────────────────────────────────────────

const VALUE_PHRASES = {
  kindness: 'a small, kind thing',
  courage: 'a brave little step',
  honesty: 'the truth, even when it was hard',
  patience: 'the slow, careful way of waiting',
  gratitude: 'a quiet thank-you',
  sharing: 'something small that became bigger when shared',
  respect: 'a gentle bow toward something old and wise',
  bravery: 'one more step into the dark',
};

const VALUE_LESSONS = {
  kindness: "Kindness is not loud. It is the small things, done again and again, by the people who love you.",
  courage: "Courage is not the absence of fear. It is taking one more step anyway, with your family beside you.",
  honesty: "The truth, even when it makes you small, is what makes your inside as wide as the sky.",
  patience: "Patience is not waiting with empty hands. It is taking care of small things until they are ready to be big.",
  gratitude: "The days that shine the brightest are the ones we remember to thank.",
  sharing: "Sharing does not make things smaller. It makes hearts bigger.",
  respect: "Respect is not just for people. It is for the old, the small, and the quiet — for everything that holds us up.",
  bravery: "Bravery is showing up with shaky hands, and trying anyway.",
};

// Helper — describes a character based on their relation
function describe(c) {
  const r = c.relation || 'other';
  if (r === 'sibling' || r === 'bhaiya' || r === 'didi') return `${c.name}, brave and full of jokes`;
  if (r === 'dada' || r === 'nana' || r === 'grandfather') return `${c.name}, with his slow, kind voice`;
  if (r === 'dadi' || r === 'nani' || r === 'grandmother') return `${c.name}, with her warm hands and her old stories`;
  if (r === 'mummy') return `${c.name}, who always knows what to say`;
  if (r === 'daddy') return `${c.name}, with his big, steady laugh`;
  if (r === 'pet') return `${c.name}, the softest, most loyal little companion`;
  if (r === 'imaginary') return `${c.name}, who only ${'{childName}'} could see`;
  if (r === 'friend') return `${c.name}, ${'{childName}'}'s very best friend`;
  if (r === 'chacha' || r === 'mama') return `${c.name}, the funniest uncle in the whole village`;
  if (r === 'chachi' || r === 'mami') return `${c.name}, who could turn flour into clouds and clouds into halwa`;
  return `${c.name}`;
}

function beatFor(c, contextNoun = 'the path') {
  const r = c.relation || 'other';
  const name = c.name;
  if (r === 'pet') {
    return `${name} padded along beside {childName}, ears pricked at every sound, tail moving like a quiet flag in the wind. ${name} could not speak, but ${name} knew the way home, and that was its own kind of magic.`;
  }
  if (r === 'imaginary') {
    return `${name} skipped along beside {childName}, sometimes visible, sometimes not, but always close. "I will go first," ${name} whispered. "I am made of bravery and starlight, and that is enough for both of us."`;
  }
  if (r === 'sibling' || r === 'bhaiya' || r === 'didi') {
    return `${name} ran ahead, then ran back, the way only a sibling can — half guarding, half teasing. "Come on, slow one," ${name} laughed. But ${name}'s eyes were watchful, the way an older heart watches a younger one.`;
  }
  if (r === 'dada' || r === 'nana' || r === 'grandfather') {
    return `${name} walked slowly, the way old wise people walk, his hand resting lightly on {childName}'s shoulder. "I have walked this same path a thousand times," ${name} said gently, "and every time, the world has had something new to say."`;
  }
  if (r === 'dadi' || r === 'nani' || r === 'grandmother') {
    return `${name} stopped to point at a small wildflower beside ${contextNoun}. "Do you know its name?" she asked softly. {childName} did not. "It is called ${ ['the moon-tear flower', 'the night-singer', 'the small candle'][Math.floor(Math.random()*3)] }," ${name} smiled. "It only blooms for children who are paying attention."`;
  }
  if (r === 'daddy' || r === 'mummy') {
    return `${name} was right there, the way a parent's love is always right there — quiet, steady, and bigger than any story. "I am here," ${name} whispered. "I will always be here."`;
  }
  if (r === 'chacha' || r === 'chachi' || r === 'mama' || r === 'mami') {
    return `${name} appeared out of nowhere with a packet of warm jalebis, the way only an uncle or an aunt knows how. "I knew you would be hungry," ${name} laughed. "An adventure without sweets is not really an adventure."`;
  }
  if (r === 'friend') {
    return `${name}, who was {childName}'s very best friend, walked along close enough that their shoulders bumped sometimes. They did not need to talk much. The best friendships are the ones where the silence is also a kind of speaking.`;
  }
  return `${name} came along too, because every story needs as many hearts as it can hold.`;
}

// ───────── Scaffolds ─────────

function scaffoldGardenAdventure({ childName, cast, value }) {
  const beats = cast.map((c, i) => beatFor(c, ['the gravel path', 'the lemon tree', 'the lotus pond'][i % 3]));
  const intro = cast.map(describe).join(', and ');
  const phrase = VALUE_PHRASES[value] || 'a small, kind thing';

  return `It was the kind of evening when the sky goes the colour of warm honey, and the garden behind ${childName}'s house grew quiet with bees.

That night, ${childName} was not alone. With them came ${intro}.

Together, they walked into the garden to look for something — though ${childName} could not have said exactly what. Sometimes the most important things have no name until you find them.

${beats.join('\n\n')}

At the very end of the garden, by an old stone bench that nobody used anymore, ${childName} found it — the small thing they had been looking for all along. It was not a treasure. It was not a key. It was ${phrase}, and it was waiting just for them.

Each member of the small group looked at it, and each one nodded, the way old families nod when they understand something together without speaking.

${VALUE_LESSONS[value] || VALUE_LESSONS.kindness}

That night, ${childName}, when you close your eyes, remember the garden, and the people who walked it with you, and the small thing you found together. Sleep well, little one. The garden is still there. The honey-coloured sky is waiting for tomorrow.`;
}

function scaffoldLostTreasure({ childName, cast, value }) {
  const beats = cast.map((c) => beatFor(c, 'the dusty road'));
  const phrase = VALUE_PHRASES[value] || 'a small, kind thing';
  const intro = cast.map(describe).join(', and ');

  return `One bright morning, ${childName} realized something very important was missing. It was not a toy. It was not a coin. It was something quieter — a feeling, perhaps, or a small certainty about how the world worked.

${childName} did not know where to look. So they did the only sensible thing: they asked their family.

And that is how ${intro} all set out together to find the missing thing.

They walked through the village. They walked past the temple, and the school, and the old mango tree where the parrots gathered in the afternoon.

${beats.join('\n\n')}

Hours passed. The sun grew low. ${childName}'s feet were tired, and so were everyone else's. They sat down on a smooth flat stone and looked at each other.

And then, in the middle of all that quiet looking, ${childName} understood. The missing thing had not been lost out in the world. It had been here all along — in the people who had walked beside them, in their slowness, in their willingness to look together for something that did not even have a name. The missing thing was ${phrase}, and they had found it without even noticing.

${VALUE_LESSONS[value] || VALUE_LESSONS.kindness}

That night, ${childName}, when you close your eyes, remember that the most important things do not stay missing for long when you have people who will walk beside you. Goodnight, little adventurer. Tomorrow has more stones to sit on, and more roads to walk slowly down.`;
}

function scaffoldQuietEvening({ childName, cast, value }) {
  const beats = cast.map((c) => beatFor(c, 'the verandah'));
  const phrase = VALUE_PHRASES[value] || 'a small, kind thing';
  const intro = cast.map((c) => c.name).join(', ');

  return `Some evenings are loud. Some evenings are full of running, and shouting, and laughing, and the splash of water in metal buckets.

This was not one of those evenings.

This evening was quiet. The kind of quiet you can hear, like a soft breath underneath everything. ${childName} was sitting on the verandah with everyone they loved most: ${intro}.

Nobody was doing anything in particular. And yet — somehow — everything was happening.

${beats.join('\n\n')}

${childName} watched all of this and felt something settle inside their chest. Not a big feeling. A small, important one. They understood, in a way that was hard to put into words, that ${phrase} was not something you had to chase. It was something you had to sit still for. Long enough that it could come and find you.

${VALUE_LESSONS[value] || VALUE_LESSONS.kindness}

That night, ${childName}, when you climb into bed, try to remember the quiet of this verandah. Some of the best moments in your whole life will look exactly like this — nothing happening, with the people you love most, while the world turns slowly outside. Goodnight, sweet one. The verandah will still be there tomorrow.`;
}

function scaffoldFestivalOfLights({ childName, cast, value }) {
  const beats = cast.map((c) => beatFor(c, 'the courtyard'));
  const phrase = VALUE_PHRASES[value] || 'a small, kind thing';
  const intro = cast.map(describe).join(', and ');

  return `The whole street was getting ready. Diyas were being lit, one by one, on every doorstep. Strings of marigolds hung between the windows. Somewhere, a child was already setting off a single sparkler, which made everyone laugh.

It was a festival night. And ${childName}, with ${intro}, was right in the middle of it all.

${beats.join('\n\n')}

When all the lamps had been lit and the courtyard was glowing like a small piece of the sky had fallen down to earth, ${childName} stood very still and looked at everything.

So many lights. So many faces. So many small kindnesses, each one barely noticed, each one important.

${childName} understood, then, that the festival was not really about the lamps. The festival was about ${phrase}. The lamps were just a way of pointing at it, so that nobody could miss it.

${VALUE_LESSONS[value] || VALUE_LESSONS.kindness}

That night, ${childName}, as you fall asleep, imagine the courtyard glowing like a little galaxy, with everyone you love standing inside it. That is what a real festival is. Sweet dreams, little light. The lamps will burn until morning.`;
}

function scaffoldRooftopStargazers({ childName, cast, value }) {
  const beats = cast.map((c) => beatFor(c, 'the rooftop'));
  const phrase = VALUE_PHRASES[value] || 'a small, kind thing';
  const intro = cast.map((c) => c.name).join(', ');

  return `On certain nights — the very best nights — ${childName} climbed up to the flat rooftop of the house and looked at the stars. Tonight was one of those nights. And tonight, ${childName} was not alone. With them, climbing up the narrow stairs one by one, came ${intro}.

The sky was wide and dark and full of soft, slow stars. The kind of stars that have been there longer than anyone in the family, longer than the village, longer than the language they spoke.

${beats.join('\n\n')}

${childName} lay back on a folded blanket and looked straight up. The stars looked back. They had been doing this — looking back at children — for a very, very long time.

After a while, ${childName} understood something important. The whole sky was made of ${phrase}. Every star was a small one. Every star, on its own, looked like nothing. But all of them together made the night beautiful enough to remember forever.

${VALUE_LESSONS[value] || VALUE_LESSONS.kindness}

That night, ${childName}, when you finally close your eyes, the stars will still be up there. They are not going anywhere. And neither are the people who climbed up to the rooftop with you. Goodnight, little stargazer. The sky has been waiting for you, and it will wait again tomorrow.`;
}

const SCAFFOLDS = [
  { id: 'garden-adventure', plotType: 'cast-garden', fn: scaffoldGardenAdventure, title: 'The Garden Adventure' },
  { id: 'lost-treasure', plotType: 'cast-search', fn: scaffoldLostTreasure, title: 'The Missing Thing' },
  { id: 'quiet-evening', plotType: 'cast-quiet', fn: scaffoldQuietEvening, title: 'The Quietest Evening' },
  { id: 'festival-lights', plotType: 'cast-festival', fn: scaffoldFestivalOfLights, title: 'The Night of Lamps' },
  { id: 'rooftop-stars', plotType: 'cast-stars', fn: scaffoldRooftopStargazers, title: 'The Rooftop Stargazers' },
];

export function buildCastStory({ childName, cast, value, recentPlotTypes = [] }) {
  if (!cast || cast.length === 0) return null;

  // Exclude the protagonist from the cast — the scaffolds always
  // refer to the hero by name separately. Cast = supporting cast.
  const supporting = cast.filter((c) => c.relation !== 'self');
  if (supporting.length === 0) return null;

  // Pick a scaffold not in recent history if possible
  const fresh = SCAFFOLDS.filter((s) => !recentPlotTypes.includes(s.plotType));
  const pool = fresh.length > 0 ? fresh : SCAFFOLDS;
  const scaffold = pool[Math.floor(Math.random() * pool.length)];

  const text = scaffold.fn({ childName, cast: supporting, value });
  // Replace any leftover {childName} tokens (used inside describe/beatFor literals)
  const cleaned = text.replace(/\{childName\}/g, childName || 'little one');

  return {
    title: scaffold.title,
    body: cleaned,
    plotType: scaffold.plotType,
    templateId: `cast_${scaffold.id}`,
  };
}
