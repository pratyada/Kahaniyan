// ─────────────────────────────────────────────────────────────
// Local story bank — POC stand-in for Claude API generation.
//
// Each story uses {tokens} that are swapped with the family
// profile values. Stories are tagged by value, age band, and
// "plotType" so the non-repetition engine can avoid serving
// the same structure twice in a row.
//
// Word counts are intentionally short for the POC. The runtime
// trims/extends to roughly hit the requested duration target
// (~150 words/min reading speed).
// ─────────────────────────────────────────────────────────────

export const STORY_BANK = [
  {
    id: 'tpl_moonlit_lantern',
    title: 'The Moonlit Lantern',
    value: 'courage',
    ageBand: '5-7',
    plotType: 'night-journey',
    cultures: ['indian'],
    body: `Once upon a time in a quiet little village near the foothills, there lived a brave child named {childName}. {childName} loved the soft hush of evening when fireflies blinked between the neem trees and the sky turned the colour of warm honey.

One night, the village lantern at the edge of the forest went dark. Without it, travellers would lose their way. {grandfather} sighed and said, "Someone must walk the old path and light it again." But the path was long and the woods were quiet.

{childName} stood up. "I will go," they whispered. {sibling} looked worried, but {childName} smiled and said, "I have a small light, and a big heart."

With {pet} padding softly beside them, {childName} stepped into the trees. The wind moved like a sleepy song. Twigs cracked. An owl asked questions only owls know how to ask. {childName}'s small light flickered, but it did not go out.

When they reached the old lantern, {childName} climbed up gently and lit the wick. A warm gold glow spread across the path, reaching all the way back to the village. Travellers far away saw the light and smiled.

Back home, {grandmother} wrapped {childName} in a soft shawl and whispered, "Courage is not the absence of fear. It is the small light you carry into the dark."

And as {childName} drifted to sleep, the lantern at the edge of the forest kept shining, kept watching, kept waiting for tomorrow's stars.`,
  },
  {
    id: 'tpl_honest_mango',
    title: 'The Honest Mango',
    value: 'honesty',
    ageBand: '5-7',
    plotType: 'small-mistake',
    cultures: ['indian'],
    body: `In a sunny corner of the world, where mango trees leaned over courtyards and the air smelled of cardamom tea, lived a child named {childName}.

One golden afternoon, {grandmother} placed a basket of ripe mangoes on the table. "These are for tonight," she said, "after dinner." {childName} nodded, but oh, how the mangoes smelled. Like sunshine bottled in fruit.

When no one was looking, {childName} took the smallest one. Just one. They hid behind the curtain and ate it quickly. The juice was sweet, but their tummy felt a little heavy. Not from the mango — from the secret.

That evening, {grandmother} counted the mangoes and said softly, "I think a tiny bird took one." {sibling} giggled. {pet} wagged its tail. {childName} looked down.

Then {childName} took a deep breath. "It wasn't a bird. It was me. I'm sorry." Their voice was small but steady.

{grandmother} did not frown. She knelt down and said, "The bravest thing a small heart can do is tell the truth, even when no one would have known." She kissed {childName}'s forehead.

That night, {childName} slept easily. There were no secrets under the pillow — only good dreams, and the soft scent of mangoes drifting in from the kitchen.`,
  },
  {
    id: 'tpl_kindness_kite',
    title: 'The Kite That Came Back',
    value: 'kindness',
    ageBand: '2-4',
    plotType: 'shared-treasure',
    cultures: ['indian'],
    body: `On a breezy blue morning, {childName} held a brand new kite. It was orange and gold, with a long ribbon tail. {childName} ran and ran, and the kite went up, up, up into the sky.

{sibling} watched from the wall, eyes wide. "Can I try?" {sibling} asked, very softly.

{childName} thought about it. The kite was new. The kite was beautiful. The kite was theirs. But {sibling}'s eyes were so hopeful.

"Yes," said {childName}, and held out the string.

{sibling} laughed and the kite climbed higher. {pet} barked happily. {grandfather} clapped from the porch.

Later, the wind grew stronger and tugged the kite far, far away. It flew over the rooftops and disappeared. {childName} felt a little sad, but {sibling} hugged them tight.

The next morning, a neighbour knocked. In her hands was the orange and gold kite. "I think this belongs to a kind child," she smiled.

{childName} held the kite again, but this time they knew — sharing it had not made it smaller. It had made the day bigger.

And as the stars came out, {childName} curled up under the warm blanket, ready for sweet dreams of skies full of kites and friends.`,
  },
  {
    id: 'tpl_patient_seed',
    title: 'The Seed That Waited',
    value: 'patience',
    ageBand: '5-7',
    plotType: 'slow-growth',
    cultures: ['indian'],
    body: `{grandfather} placed a tiny brown seed in {childName}'s palm. "Plant it," he said. "And then wait."

{childName} planted the seed in a small clay pot near the window. They watered it. They watched. Nothing happened.

The next day, nothing. The day after, still nothing. {childName} began to worry. "Maybe it is a sleepy seed," said {sibling}. {pet} sniffed the pot and walked away.

{childName} almost gave up. But {grandfather} said, "Some things grow under the ground first, where you cannot see. That is the most important kind of growing."

So {childName} kept watering. Kept singing soft songs to the pot. Kept waiting.

One morning, when the sun came in like warm milk, {childName} saw it. A tiny green curl, no bigger than a fingernail, peeking out of the soil.

{childName} laughed and clapped. {grandmother} brought tea to celebrate. The little green curl grew into a leaf, and then another, and one day it would be a tree.

That night, {childName} understood. Patience is not waiting with empty hands. Patience is taking care of small things until they are ready to be big.

And just like the seed, {childName} closed their eyes and grew quietly, dreaming under the stars.`,
  },
  {
    id: 'tpl_grateful_river',
    title: 'A Letter to the River',
    value: 'gratitude',
    ageBand: '8-10',
    plotType: 'reflective-walk',
    cultures: ['indian'],
    body: `Every morning, the river outside {childName}'s village glittered like spilled silver. {childName} had walked beside it a hundred times and never really looked.

One day, {grandmother} said, "Why don't you write a thank-you note today? Not to a person — to something else." {childName} laughed, but {grandmother} was serious.

So {childName} took a piece of paper, a pencil, and {pet}, and walked to the river. They sat on the warm stones and watched the water move. The river was carrying leaves, light, and the small reflections of birds.

{childName} began to write.

"Dear River, thank you for the cool water in summer. Thank you for the boats that carry our rice. Thank you for the fish that {grandfather} catches. Thank you for the songs you make at night that help me sleep."

The more {childName} wrote, the more they noticed. The river had been doing kind things every day, quietly, without being asked.

When the letter was done, {childName} folded it into a tiny boat and let it float away. The river carried it gently downstream.

That night, {childName} thought about everything else they had not yet thanked — the moon, the soft pillow, {sibling}'s laughter, {grandmother}'s hands. There was so much.

And with a grateful heart, {childName} drifted into a sleep as deep and easy as a slow-moving river.`,
  },
  {
    id: 'tpl_brave_drum',
    title: 'The Festival Drum',
    value: 'bravery',
    ageBand: '8-10',
    plotType: 'public-performance',
    cultures: ['indian'],
    body: `The village festival was three days away. The drummer who always played at the opening had fallen ill. The elders looked worried. Without the drum, the festival could not begin.

{childName} had been learning the drum for one whole year. Quietly. In the back of {grandfather}'s workshop, where no one could hear the wrong notes.

{grandfather} looked at {childName}. "Will you play?"

{childName}'s heart turned to butterflies. The whole village would be watching. Aunties, uncles, cousins, the boys from the next street. What if they got it wrong?

That night, {childName} could not sleep. {sibling} came and sat beside them. "You know the rhythm," {sibling} said. "Even {pet} has heard it a hundred times. It knows you."

On the day of the festival, {childName} sat behind the big drum. Their hands shook. The crowd grew quiet. {grandmother}'s eyes were soft and proud.

{childName} closed their eyes and remembered the very first beat {grandfather} ever taught them. Then they began.

The drum spoke. The village answered with cheers. The festival lights came on, one by one, like stars agreeing to shine.

When it was over, {childName} understood. Bravery is not having no fear. It is showing up with shaky hands and playing anyway.

And tonight, the drum was quiet, but {childName}'s heart was still humming as sleep came gently in.`,
  },
  {
    id: 'tpl_sharing_sweets',
    title: 'The Box of Sweets',
    value: 'sharing',
    ageBand: '2-4',
    plotType: 'simple-gift',
    cultures: ['indian'],
    body: `{grandmother} made a big box of sweets. There were laddoos round like little suns, and burfis cut into soft squares. They smelled like ghee and rose water and love.

She gave the box to {childName}. "These are for you," she said. "But sweets taste sweeter when they are shared."

{childName} held the box very tight. The sweets were warm. The box was theirs.

Then {sibling} walked in. {childName} hesitated. Then {childName} opened the box and gave {sibling} a laddoo. {sibling} smiled the biggest smile.

Then {grandfather} walked by. {childName} gave him a burfi. He laughed and patted {childName}'s head.

Even {pet} got a tiny crumb (because {pet} was looking very, very hopeful).

By the end of the day, the box was almost empty. But the house was full of happy faces. And somehow, the sweets {childName} had eaten tasted nicer than they would have if {childName} had eaten them all alone.

That night, {grandmother} tucked {childName} in. "You see?" she whispered. "Sharing doesn't make things smaller. It makes hearts bigger."

{childName} closed their eyes, dreaming of laddoo suns rolling across a sky of warm honey.`,
  },
  {
    id: 'tpl_respect_elder_tree',
    title: 'The Old Banyan Tree',
    value: 'respect',
    ageBand: '8-10',
    plotType: 'elder-wisdom',
    cultures: ['indian'],
    body: `At the centre of {childName}'s village stood an old banyan tree. It was so old that nobody remembered planting it. Its roots fell from its branches like long beards, and people sat under it to talk, to rest, to remember.

One day, some workers came with ropes and saws. "We need this space," they said. "The tree must come down."

{childName} ran to {grandfather}. "They cannot cut it!" they cried. "The birds live there. {grandmother} says her mother was married under it!"

{grandfather} thought for a long moment. Then he said, "Come. Bring {sibling}. And bring your respect."

They walked together to the banyan. {grandfather} bowed his head to the tree first — the way one greets an elder. Then he turned to the workers and spoke, calmly and kindly. He told them stories. He told them of weddings, of cool afternoons, of birds that had nested there for a hundred years.

The workers listened. They had not known. They put down their ropes.

That evening, the whole village gathered under the banyan. They tied small ribbons to its branches and thanked it for its long life. {childName} touched the rough old bark gently.

That night, lying in bed, {childName} understood. Respect is not just for people. It is for old trees, old songs, old stories — anything that has held us up for a long time.

And under the same stars the banyan had always known, {childName} fell asleep.`,
  },
  {
    id: 'tpl_curiosity_constellation',
    title: 'The Constellation Hunter',
    value: 'courage',
    ageBand: '8-10',
    plotType: 'sky-discovery',
    cultures: ['indian'],
    body: `{childName} loved looking at the night sky from the rooftop. {grandfather} had taught them the names of three stars. {childName} wanted to know all of them.

One winter night, {childName} took out a small notebook and began to draw the stars. It was hard. The sky was too big. The stars kept moving. {pet} curled up beside them and yawned.

"This is impossible," {childName} sighed.

{sibling} climbed up onto the roof with two cups of warm milk. "Don't try to draw the whole sky," {sibling} said. "Pick one little patch. Just that one."

So {childName} drew one tiny patch above the rooftop. Five stars. Then they connected them with lines. The shape looked like a tiny boat.

{childName} laughed. "I made a constellation!"

{grandfather} climbed up too. "What will you name it?"

{childName} thought. "{pet}'s Boat," they said. Because {pet} was sleeping right under it.

The whole family laughed together on the cold rooftop, sipping warm milk under their very own constellation.

That night, {childName} learned that the world is too big to understand all at once. But it is not too big for one small patch, drawn with love and a steady hand.

And as sleep came, {childName} sailed away on {pet}'s Boat, past the moon, into dreams.`,
  },
  {
    id: 'tpl_responsibility_lamp',
    title: 'The Diya at Dusk',
    value: 'respect',
    ageBand: '5-7',
    plotType: 'small-duty',
    cultures: ['indian'],
    body: `Every evening at sunset, someone in {childName}'s family lit the small diya at the doorway. It was a quiet, important job. It welcomed the night and kept the home warm.

This week, {grandmother} had said, "{childName}, the diya is your job now."

The first day, {childName} forgot. The second day, {childName} forgot again. {sibling} reminded them. {childName} blushed.

On the third day, {childName} set a tiny pebble in their pocket. Every time they touched it, they remembered the diya. Right at sunset, {childName} ran to the doorway, lit the small flame, and watched it dance.

On the fourth day, {childName} lit it without needing the pebble. On the fifth day, {childName} began to look forward to it.

By the end of the week, the diya at dusk had become the most peaceful moment of {childName}'s day. {pet} would sit beside the doorway and watch the little gold flicker. {grandmother} would smile from the kitchen.

{grandfather} said, "Small duties are how big people are made."

That night, {childName} understood. Being responsible is not heavy. It is the warm feeling of knowing that something tiny and important would not have happened without you.

And as the diya glowed softly into the night, {childName} closed their eyes and slept proudly.`,
  },
  {
    id: 'tpl_empathy_stray',
    title: 'The Quiet Visitor',
    value: 'kindness',
    ageBand: '5-7',
    plotType: 'helping-stranger',
    cultures: ['indian'],
    body: `It had been raining all evening. The streets were shiny and the lamps wore little halos. {childName} was inside, warm and dry, listening to the rain on the tin roof.

Then {childName} heard a small sound. Not the rain. Something else. A soft, tired sound, near the door.

{childName} opened it just a little. There, on the step, was a small stray cat, very wet, very scared. Its eyes were big and shining.

{childName} called for {grandmother}. Together, they brought the cat inside, dried it with a soft cloth, and gave it a tiny bowl of warm milk. The cat drank slowly, like it had not eaten in a long time.

{pet} watched from the corner, surprised but kind. {sibling} brought a basket and a soft scarf to make a bed.

The cat slept. And as it slept, {childName} understood that the world is full of small, quiet visitors who just need a dry place and a warm bowl.

In the morning, the rain was gone. The cat stretched, looked at {childName} once with grateful eyes, and slipped back into the bright wet street.

That night, {childName} hoped the cat had found a doorway somewhere — and a child who would open it.

And just before sleep, {childName} whispered, "I will always open the door."`,
  },
  {
    id: 'tpl_imagination_sky_bridge',
    title: 'The Bridge of Clouds',
    value: 'bravery',
    ageBand: '5-7',
    plotType: 'dream-quest',
    cultures: ['indian'],
    body: `One night, {childName} dreamed of a great bridge made entirely of clouds. It stretched from their bedroom window all the way up to the moon.

A small voice said, "Will you walk it?"

{childName} looked. The bridge was soft and white and very, very high. It did not look quite safe. But it also looked very, very wonderful.

{childName} took {pet} by the paw and stepped onto the first cloud. It held them. They took another step. And another.

Halfway up, the wind grew strong. {childName} wobbled. {pet} held on tight. Far below, the village glittered like spilled stars.

"I am scared," {childName} whispered.

The moon answered, very gently, "Bravery is not when there is no fear. It is when you take one more step anyway."

So {childName} took one more step. And another. And the wind softened. And soon, {childName} stood on the moon, which felt cool and silvery and surprisingly cosy.

The moon gave {childName} a small handful of star-dust. "This is for the journey home. Sprinkle a little wherever you need a brave heart."

{childName} climbed back down the cloud bridge with {pet}. By the time they reached the window, the dream was almost over. But the star-dust felt real in their pocket.

When {childName} woke up, the pocket was empty — and yet, somehow, the brave feeling was still there.`,
  },
];

// Quick lookups
export const STORIES_BY_VALUE = STORY_BANK.reduce((acc, s) => {
  (acc[s.value] ||= []).push(s);
  return acc;
}, {});

export const ALL_PLOT_TYPES = [...new Set(STORY_BANK.map((s) => s.plotType))];
