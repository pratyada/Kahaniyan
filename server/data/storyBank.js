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
  // ─── Added in v0.0.2: deeper bank, more variety per topic ───
  {
    id: 'tpl_courage_thunder',
    title: 'The Night the Sky Drummed',
    value: 'courage',
    ageBand: '2-4',
    plotType: 'weather-fear',
    cultures: ['indian'],
    body: `One evening, big grey clouds gathered over {childName}'s house. The wind whooshed. The trees waved. And then — BOOM — the sky drummed loud, and {childName} jumped under the blanket.

{grandmother} sat beside the bed. "Do you know what thunder is?" she whispered. {childName} peeked out, eyes wide.

"It is the clouds clapping for the rain," said {grandmother}. "They are very excited because the earth has been thirsty for many days."

BOOM. The sky drummed again. But this time, {childName} thought of clapping clouds, and it did not feel quite as scary.

{pet} climbed up onto the bed and curled into a warm ball next to {childName}. {sibling} brought a soft toy and tucked it under the blanket too. The whole bed became a little fort.

The rain began to fall, soft at first, then a steady silver music on the roof. Drip, drip, drip. {childName} listened. The clouds clapped. The earth drank. And slowly, the storm started to feel less like a noise and more like a song.

{grandfather} brought warm milk in a tiny cup. "Brave little cloud-listener," he said with a smile.

{childName} held the cup with both hands, sipped slowly, and decided that storms were not scary if you knew what they were really doing.

That night, the clouds clapped {childName} all the way to sleep. And in the morning, the world was washed clean and shining.`,
  },
  {
    id: 'tpl_courage_first_swim',
    title: 'The Day the River Said Hello',
    value: 'courage',
    ageBand: '8-10',
    plotType: 'first-attempt',
    cultures: ['indian'],
    body: `It was the hottest week of summer, and {grandfather} had promised to teach {childName} how to swim in the slow river behind the village.

{childName} stood on the bank in their swimming clothes. The water looked friendly from up here. But standing in it was different — the river was cool and pulled gently at the ankles, like it was asking a question.

"Come a little deeper," said {grandfather}, already standing waist-deep. "I will hold you. The river will not pull you anywhere I cannot reach."

{childName} took one step. Then another. The water rose to the knees, then the belly. {sibling} cheered from the bank. Even {pet} barked encouragement.

"Now lie back," said {grandfather}, his big hands ready under {childName}'s back. "Let the water hold you. It is older than all of us. It knows how."

{childName} closed their eyes and leaned back. The river caught them. It was the strangest, calmest feeling — like being held by something enormous and gentle.

{grandfather} slowly took his hands away. {childName} did not sink. The river was holding them all by itself.

When {childName} opened their eyes, the sky was wide and blue and the world was upside down and right side up at the same time. {grandmother} on the bank was clapping and laughing.

That night, lying in bed, {childName} could still feel the river under their back, holding them up. Courage, they understood, is not jumping in. It is taking one step deeper, and then trusting that the world has been getting ready to hold you.`,
  },
  {
    id: 'tpl_courage_speak_up',
    title: 'The Quiet Hand That Rose',
    value: 'courage',
    ageBand: '11-13',
    plotType: 'speak-up',
    cultures: ['indian'],
    body: `{childName} had noticed something at school. A new boy in the next class was being teased — gently at first, then less gently. Nobody said anything. Not the teachers, who had not seen. Not the other students, who were busy looking away.

{childName} had been looking away too. It felt safer.

But that night, {childName} could not sleep. They lay in bed thinking about the new boy. They thought about how they would feel if it were them, alone in a new school, and everyone in the whole place had decided not to see them.

In the morning, {childName} talked to {grandmother} over chai. {grandmother} did not give an easy answer. She just said, "When you do not know what is right, ask yourself what the bravest version of you would do. Then do half of that, today."

At lunchtime, {childName} walked over to the new boy and sat down beside him. Just sat. Did not give a speech. Did not announce anything. Just opened their tiffin and offered him a piece of paratha.

The new boy looked surprised. Then he smiled, very small. "Thank you," he said.

The next day, {sibling} sat with them too. The day after, two more students. By the end of the week, the teasing had quietly stopped — not because anyone had been told off, but because the room had simply become a different room.

That night, {childName} understood. Courage is not always loud. Sometimes it is one quiet hand reaching across a table at lunchtime, asking nothing, offering everything.

And as {childName} closed their eyes, they thought of the new boy, finally sleeping easy too.`,
  },
  {
    id: 'tpl_honesty_small_lie',
    title: 'The Cracked Cup',
    value: 'honesty',
    ageBand: '2-4',
    plotType: 'small-mistake',
    cultures: ['indian'],
    body: `{childName} loved {grandmother}'s favourite tea cup. It had little blue flowers all around it, and a tiny chip on the handle from many years of love.

One morning, while running through the kitchen, {childName} bumped the table. The cup wobbled. Then it fell. And then it cracked, right down the middle.

{childName} stood very still. The cup looked sad in two pieces.

The first thought was to hide it. To push the pieces behind a basket and pretend nothing happened. But {childName} thought about {grandmother}'s kind face, and about how the cup had blue flowers, and about how a hidden truth feels heavy in the tummy all day.

So {childName} went to find {grandmother}.

"I broke your cup," said {childName}, voice very small. "I am sorry."

{grandmother} knelt down and looked at the pieces. Then she looked at {childName}. Her eyes were soft.

"Cups can be glued," she said gently. "But the truth, once it is gone, is much harder to put back. Thank you for telling me."

That afternoon, they sat at the table together. {grandmother} mixed a tiny bit of glue and showed {childName} how to fit the pieces back. The crack was still there — a thin silver line. But the cup was whole again.

{grandmother} held it up to the light. "Some say a broken thing fixed with care is more beautiful than a thing that never broke at all."

That night, {childName} fell asleep feeling light. The cup was on the shelf with its silver crack. And the truth was where it belonged.`,
  },
  {
    id: 'tpl_honesty_test',
    title: 'The Answer in the Pocket',
    value: 'honesty',
    ageBand: '8-10',
    plotType: 'temptation',
    cultures: ['indian'],
    body: `{childName} had been studying for the maths test all week. But there was one chapter — the one about fractions — that just would not stay in their head no matter how many times {grandfather} explained it.

The morning of the test, {childName} found a tiny folded paper in their pencil box. It was a note from a classmate — all the fraction answers, written in small, careful handwriting. {childName}'s heart did a strange flip. Nobody would know.

In class, the test was placed face down. The room was quiet. {childName} could feel the small folded paper in their pocket, like a stone.

The teacher said, "Begin."

{childName} turned the paper over. The fraction questions were the very first ones. The pocket felt heavier.

But then {childName} thought of {grandfather}, patiently drawing pizza slices on the back of an old envelope to explain halves and thirds. {childName} thought of the small light in {grandfather}'s eyes when {childName} got one right. And {childName} knew — even if no one else would ever know — that {grandfather} would feel it. Because {childName} would feel it.

So {childName} reached into the pocket, took out the paper, and quietly walked it up to the teacher's desk. "Someone left this with me," {childName} said. "I do not want it."

The teacher's eyes widened, just a little. Then she nodded once and put the paper away.

{childName} went back to the seat and tried the fractions on their own. Some answers were probably wrong. That was alright.

That night, {grandfather} asked how the test went. "I do not know if I passed," said {childName}. "But I know I did not cheat."

{grandfather} hugged {childName} for a long time. Some kinds of passing, he said, do not need a mark on a paper.`,
  },
  {
    id: 'tpl_honesty_apology',
    title: 'The Letter Under the Door',
    value: 'honesty',
    ageBand: '11-13',
    plotType: 'making-amends',
    cultures: ['indian'],
    body: `{childName} had said something unkind to a friend at school. It had slipped out in front of other people, and everyone had laughed, and the friend had gone quiet for the rest of the day.

By the time {childName} got home, the unkind thing was sitting in the middle of their chest like a stone. Even dinner could not push it out.

That night, {childName} sat down with a piece of paper. {grandmother} had once said, "When the words are too heavy for your mouth, give them to a pen."

{childName} wrote a letter. It said: "I am sorry. I do not know why I said what I said. It was not true, and even if it had been, I should not have said it for a laugh. You are my friend, and I value you, and I am writing this so you know that I am the one who feels small now, not you. I will say all of this to your face tomorrow, but I wanted you to have it in writing too, in case my mouth is not brave enough."

In the morning, {childName} walked to school early and slipped the letter under the friend's classroom door.

At lunch, the friend found {childName} in the courtyard. They did not say much. They just sat down, side by side, and ate their food in the quiet way old friends sometimes do — the way that means: it is alright. We are alright.

That night, the stone was gone from {childName}'s chest. In its place was something softer and wiser. {childName} understood that honesty is not just telling the truth when it makes you look good. It is telling the truth when it makes you look small — and trusting that the people who love you will love you for it more, not less.`,
  },
  {
    id: 'tpl_kindness_old_man',
    title: 'The Man Who Sold Umbrellas',
    value: 'kindness',
    ageBand: '8-10',
    plotType: 'helping-stranger',
    cultures: ['indian'],
    body: `Every monsoon, an old man set up a small stall at the corner of {childName}'s street, selling umbrellas. He was thin, his glasses were taped together, and he always smiled even when no one was buying.

This year, the rains came late. The old man waited every day at his stall, but the sky stayed dry, and people walked past with no need for umbrellas. {childName} noticed his shoulders getting smaller as the days went by.

One afternoon, {childName} sat with {grandmother} and asked, "Can we help him?"

{grandmother} thought. Then she said, "We cannot make it rain. But we can do something else."

That weekend, {childName}, {sibling}, and {grandmother} took all the family's old umbrellas — the ones that were broken or forgotten in cupboards — and walked them down to the old man's stall. "Could you fix these?" {grandmother} asked. "We will pay you for the work."

The old man's face brightened like a window when the sun comes through. "Yes, yes," he said quickly. "I can fix anything."

For the next two weeks, he worked on the umbrellas, one by one. {childName} visited every day after school to watch. He showed {childName} how to bend a wire, how to stitch a torn cloth, how to oil a stuck spring.

When all the umbrellas were fixed, {grandmother} paid him properly. And just as he handed over the last one — clouds gathered overhead, and the first big rain of the season finally arrived. People rushed to his stall. He sold every new umbrella within an hour.

That night, {childName} understood something quiet but big. Kindness is not always about giving money. Sometimes it is about giving someone a way to do the work they are good at, until the rain finally comes.`,
  },
  {
    id: 'tpl_kindness_listening',
    title: 'The Friend Who Just Listened',
    value: 'kindness',
    ageBand: '11-13',
    plotType: 'emotional-support',
    cultures: ['indian'],
    body: `{childName}'s best friend had been quiet for three days. Not the usual kind of quiet — the kind where their face looked far away even when their body was right there.

{childName} did not know what was wrong. But they did know that asking "what's wrong?" again and again was making it worse, not better.

So that afternoon, {childName} did something different. They did not ask. They just walked over and sat down beside the friend on the school steps. They opened a packet of biscuits and offered one. They did not say anything at all.

For a long time, the two of them just sat. The sun moved a little. A bird fought with another bird. A scooter went past.

Then, very slowly, the friend started to talk. Not about the big thing — about small things first. The maths homework. A song they had heard on the bus. Then, eventually, the big thing too. There had been a fight at home. Things had been said that were hard to unhear.

{childName} did not try to fix it. {childName} did not say "everything will be fine" or "you should do this". {childName} just nodded, and listened, and once or twice said, "That sounds really hard."

By the time the school bell rang, the friend was not fixed. But their face was a little closer. Their shoulders had come down. And as they walked away, they squeezed {childName}'s hand once, very lightly, and said, "Thank you for not asking me to be okay."

That night, {childName} thought about it for a long time. Kindness, they realized, is not always about doing something. Sometimes the most useful thing in the whole world is to be the quiet space beside a person until they find their own words.`,
  },
  {
    id: 'tpl_patience_kite',
    title: 'The Tangled String',
    value: 'patience',
    ageBand: '2-4',
    plotType: 'small-frustration',
    cultures: ['indian'],
    body: `{childName} had a beautiful red kite. But the string was all tangled up — a big knotted ball of string with no beginning and no end that anyone could find.

{childName} pulled at one end. The knot got tighter. {childName} pulled at the other end. The knot got even tighter. {childName} stamped a foot.

{grandmother} came over and sat down on the floor. "Hand me the string," she said softly.

{grandmother} did not pull. She did not yank. She just held the knot in her hands and gently, gently, started to find the loops.

"Look," she said. "If you pull when it is tangled, the knot only gets stronger. But if you go slowly, and follow each little loop, the string remembers how to be string again."

{childName} sat down and watched. {grandmother}'s fingers moved like little birds. One loop. Then another. Then another.

After a while, {childName} tried too. At first the fingers were too quick and the knot pulled tight. But {childName} took a deep breath and slowed down. One loop. Then another.

The knot got smaller. And smaller. And then — pop — the string was free.

{childName} laughed. The whole long string lay on the floor like a soft red snake.

That afternoon, the red kite went up, up, up into the blue sky. And {childName} understood, in a little kind of way, that the string had not been the problem. The hurry had been the problem.

That night, in bed, {childName} closed their eyes and remembered the feeling of the knot coming loose. Slow hands, soft hands, kind hands. And then the kite flew, and so did sleep.`,
  },
  {
    id: 'tpl_patience_practice',
    title: 'The Hundred Days',
    value: 'patience',
    ageBand: '11-13',
    plotType: 'mastery',
    cultures: ['indian'],
    body: `{childName} wanted to learn the tabla. {grandfather} agreed to teach, but with one condition: "Practise every day. Even just five minutes. For one hundred days. Then we will see."

The first week was exciting. {childName} learnt to sit properly, to hold the hands right, to make the first soft beats. Tin. Tin. Na.

The second week was harder. The wrists hurt. The beats sounded clumsy. {sibling} laughed kindly. {childName} began to wonder if maybe tabla was not for them.

By the third week, {childName} wanted to quit. The hundred days felt like a hundred years. "I am not good at this," {childName} told {grandfather}.

{grandfather} did not argue. He just said, "Day twenty-one is when most people quit. That is the day when the work stops being fun and the music has not yet started. If you can walk through the next ten days, the music will come."

So {childName} walked. Day twenty-two. Day twenty-five. Day thirty. Slowly, slowly, the wrists stopped hurting. The hands started to remember things on their own. The beats began to feel like they were arriving from somewhere inside, not being forced out from the outside.

By day fifty, {childName} could play a small rhythm without thinking. By day eighty, {childName} could play it with feeling. And on day one hundred, {childName} sat down and played a full pattern for the family — not a great pattern, not a perfect one, but a real one. Theirs.

{grandmother} cried a little, in the proud way grandmothers cry. {grandfather} did not say much. He just touched {childName}'s shoulder once and nodded.

That night, {childName} understood something that does not fit in a sentence: patience is not waiting. Patience is showing up on day twenty-two, when nothing has worked yet, and trusting that day fifty is somewhere up ahead.`,
  },
  {
    id: 'tpl_gratitude_morning_chai',
    title: 'The Cup of Morning Chai',
    value: 'gratitude',
    ageBand: '2-4',
    plotType: 'noticing-small',
    cultures: ['indian'],
    body: `Every morning, {grandmother} made a small cup of warm milk for {childName} and a big cup of hot chai for herself. {childName} usually drank the milk fast and ran off to play.

But one morning, {grandmother} said, "Today, let us drink slowly. Let us notice."

{childName} sat down at the little table. The milk was warm in the cup. {grandmother} pointed to it.

"Where did this milk come from?" she asked.

{childName} thought. "From a cow!"

"Yes. And the cow ate green grass. And the grass grew because of the rain. And the rain came from the clouds. So your milk has clouds in it, and grass, and a cow, and the kindness of the man who carries the milk to our door every morning."

{childName} looked at the cup with very big eyes. The milk seemed bigger now. Like a whole little world fit inside it.

"Can you say thank you to all of them?" asked {grandmother}.

{childName} closed their eyes and whispered, "Thank you cloud. Thank you grass. Thank you cow. Thank you milk man. Thank you {grandmother}."

Then {childName} took one slow sip. It was the most delicious sip of milk in the whole world. Because {childName} had remembered everyone who helped to make it.

That night, before bed, {childName} looked up at the dark window. Somewhere out there were the clouds, and the grass, and the cow. {childName} whispered "good night" to all of them.

And the world, very gently, whispered back: you are welcome, little one. You are very, very welcome.`,
  },
  {
    id: 'tpl_gratitude_old_photos',
    title: 'The Box of Old Photos',
    value: 'gratitude',
    ageBand: '11-13',
    plotType: 'family-history',
    cultures: ['indian'],
    body: `One rainy afternoon, {grandmother} pulled down an old wooden box from the top of the cupboard. It was full of black-and-white photographs — wedding photos, baby photos, photos of houses {childName} had never seen.

"Who is this?" asked {childName}, holding up a picture of a serious young man in a kurta.

"That is my father," said {grandmother}. "Your great-grandfather. He walked twenty kilometres each way to school every day. Through monsoons. Through summers."

"And this?"

"That is your great-grandmother. She taught herself to read at the age of forty, after raising six children. She used to read the newspaper out loud to anyone in the village who could not read it themselves."

Photo after photo, {grandmother} told the stories. The uncle who lost three jobs and then started his own business at fifty. The aunt who refused to marry the wrong man and eventually built her own school. The cousin who left home with nothing and sent money back every month.

{childName} looked at all the faces. They were strangers, and yet they were not. They were the reason {childName} existed at all. Each one had walked through their own hard weather so that one day, somewhere down the line, a child would sit on a sofa on a rainy afternoon with a warm cup of chai and a soft blanket.

"I never even met them," {childName} said quietly.

"That is why we keep the box," said {grandmother}. "So you can meet them in the only way left."

That night, {childName} could not sleep right away. They thought about how their own life was being held up by hundreds of hands they would never get to thank. And they made a small promise — to live in a way that would be worth all that walking, all that reading, all that quiet, brave work.

Gratitude, they realized, is a kind of inheritance. You receive it, and one day, somebody else inherits it from you.`,
  },
  {
    id: 'tpl_sharing_drawings',
    title: 'The Empty Page',
    value: 'sharing',
    ageBand: '5-7',
    plotType: 'creative-gift',
    cultures: ['indian'],
    body: `{childName} had a brand new sketchbook. The pages were thick and white and beautiful. {childName} loved the smell of the new paper.

{sibling} sat down nearby, looking at the sketchbook with curious eyes. "Can I draw too?"

{childName} held the sketchbook close. The pages were so clean. So new. What if {sibling} drew something messy and ruined them?

But {childName} looked at {sibling}'s hopeful face, and remembered how it felt when no one wanted to share with them. So {childName} took a deep breath and tore one page out, very carefully, and gave it to {sibling}.

{sibling} sat down with the page and a fat orange crayon and began to draw. It was a wobbly orange sun with a smiling face.

{childName} drew on the next page in the book — a careful picture of {pet} curled up on a cushion. It came out quite well.

Then {sibling} held up the orange sun. "It is for you!" they said proudly.

{childName} took the wobbly orange sun and looked at it. It was not careful or pretty. But it was made just for {childName}. And somehow that made it the best drawing in the whole sketchbook.

{childName} stuck the orange sun on the very first page of the book — the page everyone would see first.

That afternoon, {childName} tore out three more pages and gave them to {sibling}. They both drew until the sky got dark. The sketchbook was no longer brand new. It had crayon smudges and crooked lines and folded corners.

But it was full of two children's drawings now, instead of one. And that, {childName} understood, was much better than full of careful, lonely lines.

That night, the sketchbook sat by the bed, and {childName} smiled at the wobbly orange sun before falling asleep.`,
  },
  {
    id: 'tpl_sharing_credit',
    title: 'The Project that Took Two Hands',
    value: 'sharing',
    ageBand: '8-10',
    plotType: 'shared-credit',
    cultures: ['indian'],
    body: `{childName} and a classmate had built a science project together — a tiny model of a working windmill, using paper, sticks, and a small motor {grandfather} had helped them find. It had taken three weekends.

On the day of the school fair, the windmill won first prize. The teacher called {childName} forward to receive the certificate. The classmate was sitting in the back, looking happy but quiet.

{childName} could have walked up alone. Everyone was clapping for {childName}. It would have been easy.

Instead, {childName} turned around, called the classmate by name, and said, "Come up. We built it together."

The classmate's face changed. They came up, half shy, half glowing. The two of them stood side by side, holding the windmill between them, and the certificate was given to both.

After school, the classmate walked home with {childName} part of the way. They did not say much, but at the corner, the classmate said, "Thank you for not forgetting me up there."

{childName} shrugged and smiled. "We built it with two pairs of hands. It would not be honest for one pair to take the prize."

That evening, {grandmother} listened to the story over chai. She did not give a big speech. She just said, "When you give someone the credit they earned, you do not lose any of yours. You gain a little of their respect, and you keep all of your own."

That night, the certificate was on {childName}'s desk. It had two names on it now — written carefully, by {childName}, with the school's permission.

And {childName} fell asleep feeling lighter than any prize had ever made them feel before.`,
  },
  {
    id: 'tpl_respect_listen_first',
    title: 'The Tea That Took an Hour',
    value: 'respect',
    ageBand: '11-13',
    plotType: 'elder-conversation',
    cultures: ['indian'],
    body: `Every Sunday afternoon, {grandfather} liked to sit on the verandah and have his tea slowly. Very slowly. So slowly that one cup could last almost an hour.

{childName} usually rushed past, busy with phones and friends and homework. But this Sunday, {grandmother} said, "Sit with him. Just for one cup."

{childName} sat down on the verandah, expecting to be bored. {grandfather} did not say anything for a long time. He just sipped his tea and watched the bougainvillea move in the wind.

After ten minutes of silence, {childName} got restless. "Don't you have anything to say?"

{grandfather} smiled. "I have many things. I am waiting to see which one wants to come out."

Then, slowly, he started to talk. He told {childName} about the time he had walked to a wedding three villages away because there was no transport. He told {childName} about the first time he had ever seen the sea, and how he had cried, and not been ashamed of crying. He told {childName} about a friend he had lost in his twenties, and how he still thought about that friend every Sunday afternoon during tea.

{childName} listened. The hour passed without anyone noticing.

When {grandfather} finally finished his tea, he set the cup down and looked at {childName} with quiet eyes. "Thank you for sitting," he said. "It is hard to be old in a fast world. Sundays are easier when someone slows down with me."

{childName} did not know what to say. So they just reached out and held {grandfather}'s hand for a moment.

That night, {childName} understood that respect is not just standing up when an elder enters the room. Sometimes respect is sitting down. Slowing down. Letting someone else's pace be the pace of the afternoon, until their stories have somewhere to go.

And when {childName} fell asleep, they thought about the friend {grandfather} had lost in his twenties — a person {childName} had never met, but would now remember, every Sunday, forever.`,
  },
  {
    id: 'tpl_bravery_speak_truth',
    title: 'The Wrong Answer',
    value: 'bravery',
    ageBand: '11-13',
    plotType: 'standing-firm',
    cultures: ['indian'],
    body: `In {childName}'s history class, the teacher was telling the students about a famous event from many years ago. {childName} had been reading about it — properly, in three different books — and one important thing the teacher said was simply not correct.

{childName}'s hand felt heavy. To raise it would mean correcting an adult. In front of the whole class. {childName} was not even sure if the teacher would appreciate it.

But the wrong fact sat in the air, getting bigger and bigger. {childName} thought about {grandmother}'s words: "If you know something is wrong and you stay silent, you have agreed with it."

So {childName} raised their hand, slowly.

"Sir, I think I read something different. Could I check?"

The teacher looked surprised. The class went very quiet. {childName}'s hands were shaking a little under the desk.

"Go on," the teacher said.

{childName} explained, calmly, what they had read. They named the books. They did not say "you are wrong". They just shared what they knew, and asked if maybe both versions could be true, or if perhaps the new research had found something different.

The teacher listened. And then — to {childName}'s great surprise — the teacher said, "You may be right. I will check tonight. Thank you for bringing it up."

The next day, the teacher came in and said, in front of the whole class, "Yesterday {childName} corrected me. I checked at home. {childName} was right. I am sorry for the wrong information, and I am proud that one of my students cared enough about the truth to speak up."

{childName}'s ears went red. Two classmates clapped, and then the whole class clapped, and {childName} did not know where to look.

That night, lying in bed, {childName} felt something steady and quiet inside them. Bravery, they realized, is not always about big dragons. Sometimes it is about a small hand raised in a quiet classroom, defending something nobody else thought was worth defending. The truth, even when it is small. The truth, even when it is awkward. The truth, especially then.`,
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
