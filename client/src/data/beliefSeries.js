// ─────────────────────────────────────────────────────────────
// Belief Series — multi-episode story arcs rooted in cultural
// and spiritual traditions. Each series is a journey through
// values that children can carry into their dreams.
// ─────────────────────────────────────────────────────────────

export const BELIEF_SERIES = [
  // ─── Indigenous Canadian — Stories from Turtle Island ─────
  {
    id: 'turtle-island-stories',
    title: 'Stories from Turtle Island',
    icon: '🐢',
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #8B4513 100%)',
    description: 'Bedtime stories inspired by the wisdom of Canada\'s First Peoples — respect for the land, the seasons, the animals, and each other.',
    ageRange: '3-8',
    tradition: 'indigenous',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ti_ep1_grandmother_moon',
        episodeNumber: 1,
        title: 'The Grandmother Moon',
        subtitle: 'The moon watches over all children at night and teaches patience and the cycles of nature.',
        tradition: 'indigenous',
        theme: 'patience',
        durationMinutes: 5,
        source: 'Inspired by the values of Canada\'s First Peoples',
        body: `Long ago, before clocks and calendars, the people looked up at the night sky and saw a gentle, glowing face watching over them. They called her Grandmother Moon.

Every night, Grandmother Moon rose above the cedar trees and the still lakes, and she smiled down at every child tucked into their blankets. She was never in a hurry. She did not rush across the sky. She moved slowly, gently, taking her time from one horizon to the other.

{childName} once asked an elder, "Why does the moon change shape? Sometimes she is round, sometimes she is only a sliver."

The elder sat down beside the fire and said, "Grandmother Moon is teaching you something, little one. She shows us that everything in life has a cycle. There is a time to grow full and bright, and a time to rest and become small and quiet. Neither is better than the other. Both are needed."

{childName} looked up at the thin crescent moon hanging above the pine trees. It looked like a silver canoe floating on a dark river.

"When she is small," the elder continued, "she is not gone. She is resting. Gathering her light. And when she is full and round again, she shares that light with the whole world."

A loon called from somewhere on the lake. The fire crackled softly. The stars kept their patient watch.

"Be like Grandmother Moon," the elder whispered. "Take your time. Rest when you need to. And when your light is ready, let it shine for everyone."

That night, {childName} fell asleep under the soft silver glow, knowing that Grandmother Moon was keeping watch — patient, gentle, and always returning.

Inspired by the values of Canada's First Peoples.`,
      },
      {
        id: 'ti_ep2_bear_sharing',
        episodeNumber: 2,
        title: 'The Bear Who Taught Sharing',
        subtitle: 'A bear shows a child how the forest shares everything — food, shelter, warmth.',
        tradition: 'indigenous',
        theme: 'sharing',
        durationMinutes: 5,
        source: 'Inspired by the values of Canada\'s First Peoples',
        body: `Deep in the forest, where the spruce trees grew so thick that sunlight could barely reach the ground, {childName} came upon a great bear sitting beside a bush heavy with ripe berries.

The bear was eating slowly, one berry at a time, leaving most of the bush untouched. {childName} watched quietly from behind a birch tree, wondering why the bear did not eat everything.

The bear looked up, calm and unhurried. Its dark eyes were gentle, like deep pools of still water. It did not growl. It simply nodded its big head toward the berry bush, as if to say, "Come. There is enough."

{childName} stepped closer, carefully, and picked a few berries. They were sweet and warm from the sun.

"Why don't you eat them all?" {childName} asked softly.

The bear looked at the bush, then at the birds waiting in the branches, then at a small red fox peeking out from behind a log, then at a family of mice near the roots.

{childName} understood. The bear was not just eating. The bear was sharing. The bush did not belong to the bear. It belonged to the forest. And the forest belonged to everyone.

The elder back at camp had said something like this once: "The land gives freely. We must do the same. Take only what you need. Leave the rest for the ones who come after."

The bear finished its meal, shook its great furry head, and walked slowly into the trees. The birds flew down. The fox crept forward. The mice nibbled at the roots. Everyone had enough.

That night, {childName} lay under a warm blanket and remembered the bear and the berry bush. Sharing is not losing something. Sharing is how the world stays whole.

Inspired by the values of Canada's First Peoples.`,
      },
      {
        id: 'ti_ep3_turtle_wisdom',
        episodeNumber: 3,
        title: 'Turtle\'s Slow Wisdom',
        subtitle: 'Why the turtle carries its home and what it teaches about being at peace wherever you are.',
        tradition: 'indigenous',
        theme: 'wisdom',
        durationMinutes: 5,
        source: 'Inspired by the values of Canada\'s First Peoples',
        body: `By the edge of a quiet lake, where the water lilies floated like green saucers, {childName} found a turtle resting on a warm, flat rock.

The turtle was very still. Its shell was patterned with beautiful lines, like a map of somewhere ancient and wise. {childName} sat down beside it and waited.

After a long, patient while, the turtle turned its head slowly and looked at {childName} with calm, knowing eyes.

"Grandmother," {childName} had once asked an elder, "why does the turtle carry its home on its back? Is it not heavy?"

The grandmother had smiled and said, "The turtle carries its home so that it is never lost. Wherever the turtle goes, it is already home. It does not need to rush anywhere. It does not need to search for shelter. Everything it needs is right there, always."

{childName} looked at the turtle on the rock. It was not in a hurry. It was not worried. It was simply being — right where it was, right in that moment.

"The turtle teaches us," the grandmother had said, "that home is not always a building. Home is the feeling of peace you carry inside you. When you are calm, when you are kind, when you are gentle with yourself and the world — you are home."

A dragonfly landed on the turtle's shell for a moment, then flew away. The lake rippled softly. A breeze carried the scent of cedar.

{childName} took a deep breath, feeling that warm, still feeling settle inside like a stone sinking gently to the bottom of a clear lake.

Wherever you are, little one, you are already home.

That night, {childName} fell asleep carrying something precious — not on their back, but in their heart. Peace. Quiet. Home.

Inspired by the values of Canada's First Peoples.`,
      },
      {
        id: 'ti_ep4_salmon_journey',
        episodeNumber: 4,
        title: 'The Salmon\'s Long Journey Home',
        subtitle: 'A salmon travels thousands of miles to return home, teaching perseverance and belonging.',
        tradition: 'indigenous',
        theme: 'courage',
        durationMinutes: 5,
        source: 'Inspired by the values of Canada\'s First Peoples',
        body: `Every autumn, when the leaves turned red and gold and the rivers ran cold and clear, something wonderful happened. The salmon came home.

{childName} stood on the riverbank with an elder and watched the silver fish leaping up the rushing water. They jumped over rocks. They pushed through rapids. They swam against the current with every bit of strength they had.

"Where are they going?" {childName} asked.

"Home," said the elder. "They were born in this river, many seasons ago. Then they swam all the way to the great ocean — thousands and thousands of miles away. And now, after years in the wide, deep sea, they are swimming all the way back to the very place where they were born."

{childName} watched a single salmon leap high above the white water, its silver body flashing in the autumn sun, before splashing back down and pushing forward again.

"How do they know the way?" {childName} asked.

The elder knelt down beside the water. "They carry the memory of home inside them. The smell of the river. The feel of the stones. The song of this particular water. No matter how far they travel, they never forget where they come from."

The salmon kept leaping. Some fell back. Some rested in the eddies. But every single one kept trying. Not one turned around.

"The salmon teach us," the elder said softly, "that the journey home is never easy. But it is always worth it. And the place where you belong will always be waiting for you."

That night, {childName} lay under a warm blanket and thought of the salmon swimming through the dark water, guided by memory and love, never giving up.

You belong somewhere, {childName}. And that somewhere will always call you home.

Inspired by the values of Canada's First Peoples.`,
      },
      {
        id: 'ti_ep5_drum_stars',
        episodeNumber: 5,
        title: 'The Drum That Spoke to the Stars',
        subtitle: 'A child learns that the heartbeat of a drum connects the earth to the sky.',
        tradition: 'indigenous',
        theme: 'gratitude',
        durationMinutes: 5,
        source: 'Inspired by the values of Canada\'s First Peoples',
        body: `On a clear night, when the stars were so bright they looked close enough to touch, an elder brought out a drum. It was round, made of stretched hide and wood, and it was old — older than anyone in the community could remember.

The elder sat by the fire and began to play. Not loud. Not fast. Just a slow, steady heartbeat. Boom. Boom. Boom.

{childName} sat very still, listening. The drum did not sound like music. It sounded like something deeper — like the heartbeat of the earth itself.

"Do you hear that?" the elder asked, still drumming softly. "That sound is the same sound you heard before you were born. It is your mother's heartbeat. It is the heartbeat of the land. It is the pulse that connects everything — the roots of the trees, the rivers under the ground, the wings of the eagle, the stars above."

{childName} looked up. The stars seemed to pulse, ever so faintly, in time with the drum.

"When we drum," the elder said, "we are not just making sound. We are speaking to the earth. We are thanking the sky. We are reminding ourselves that we are never separate from the world around us. We are part of it, and it is part of us."

Boom. Boom. Boom.

The fire crackled. The northern lights began to shimmer — green and purple and white — as if they, too, were listening to the drum.

{childName} placed a hand over their own heart. There it was. The same rhythm. Boom. Boom. Boom. The same steady beat that the drum was playing, that the stars were dancing to, that the earth had been humming since the very beginning.

That night, {childName} fell asleep to the softest sound in the world — the sound of belonging.

Inspired by the values of Canada's First Peoples.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // SERIES: Parables for Little Hearts (Christian)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'parables-little-hearts',
    title: 'Parables for Little Hearts',
    icon: '🕊️',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #bfdbfe 100%)',
    description: 'Jesus\'s gentle teachings retold as cozy bedtime parables — five nights of kindness, faith, and love.',
    ageRange: '3-8',
    tradition: 'christian',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'plh_ep1_good_friend', episodeNumber: 1, title: 'The Good Friend',
        subtitle: 'A stranger stops to help someone who looks nothing like him.',
        tradition: 'christian', theme: 'kindness', durationMinutes: 3,
        source: 'Parables for Little Hearts · Episode 1',
        imagePrompt: 'Cinematic scene of a kind traveler kneeling on a dusty road to help a fallen stranger, a gentle donkey waiting nearby, warm sunset over olive tree hills, soft watercolor, NO TEXT',
        body: `Once upon a time, on a dusty road that wound between two villages, a man was walking home. The sun was setting, painting the sky in shades of peach and gold, and the man was tired.

Suddenly, he tripped on a stone and fell. His knee was scraped, his sandal broke, and he could not get back up. He called for help, but the road was quiet.

A busy merchant came walking by. He saw the man on the ground but shook his head. "I have deliveries to make," he muttered, and hurried past.

A teacher came next. She glanced at the man, sighed, and said, "Someone else will help him," and walked on.

Then came a stranger — someone from a different village, someone who dressed differently, spoke differently, and looked nothing like the man on the ground.

But the stranger stopped.

He knelt down gently, cleaned the man's scraped knee with cool water from his flask, and wrapped it with a soft cloth from his own bag. He helped the man onto his donkey and walked beside him all the way to the next village, where he paid for a warm bed and a hot meal.

"Why did you help me?" the man whispered. "We are so different."

The stranger smiled softly. "Because kindness does not check your name before it kneels down, {childName}. It just kneels."

Jesus told this story long ago to teach something simple and beautiful: a good friend is not the one who looks like you. A good friend is the one who stops when you fall.

Tonight, {childName}, close your eyes and remember — the best thing you can ever be is the one who stops. Goodnight, kind heart.`
      },
      {
        id: 'plh_ep2_lost_coin', episodeNumber: 2, title: 'The Lost Coin',
        subtitle: 'A woman searches her whole house for one tiny coin — because every single one matters.',
        tradition: 'christian', theme: 'compassion', durationMinutes: 3,
        source: 'Parables for Little Hearts · Episode 2',
        imagePrompt: 'Cinematic scene of a woman holding a small oil lamp searching a cozy stone cottage floor, warm golden glow, scattered coins gleaming, ancient Middle Eastern home, NO TEXT',
        body: `There was once a woman who had ten silver coins. They were not fancy coins — they were small and round and plain. But to her, each one was precious, because she had worked hard for every single one.

One evening, as she was counting them by lamplight, she gasped. One coin was missing. Only nine sat on the table.

Now, {childName}, some people might say, "Nine is still a lot. Forget the one you lost." But this woman did not think that way. To her, every coin mattered — not because of its shine, but because it was hers to care for.

She lit a small oil lamp and got down on her hands and knees. She swept under the table. She looked behind the door. She searched every corner of her little stone cottage, moving jars and baskets and cushions.

Her neighbours heard her shuffling and called, "What are you doing?"

"I am looking for my lost coin," she said. "I will not stop until I find it."

And she did not stop. She searched and searched until — there! Tucked in a tiny crack between two stones, the coin glinted in the lamplight.

She picked it up, held it to her heart, and smiled the biggest smile. Then she ran to her neighbours and said, "Come celebrate with me! I found the one that was lost!"

Jesus told this story to teach something beautiful: every single person matters. If even one is lost, or sad, or left behind, the whole world should stop and search.

Tonight, {childName}, know this — you are not just one of many. You are the one someone would search the whole house for. You are precious. You are found. You are loved. Goodnight, little treasure.`
      },
      {
        id: 'plh_ep3_tiny_seed', episodeNumber: 3, title: 'The Tiny Seed That Grew',
        subtitle: 'The smallest seed in the garden grows into the biggest tree.',
        tradition: 'christian', theme: 'patience', durationMinutes: 3,
        source: 'Parables for Little Hearts · Episode 3',
        imagePrompt: 'Cinematic scene of a tiny golden seed in a child open palm growing into an enormous tree with birds nesting, magical transformation, warm golden light, NO TEXT',
        body: `One morning, a child walked into a garden carrying the tiniest seed you have ever seen. It was so small it could sit on the tip of a finger. It was so light the wind could carry it away.

"This will never grow," said the gardener, shaking his head. "It is too small."

"This is nothing," said a bird flying past. "I have seen bigger crumbs."

But the child did not listen. The child dug a little hole in the soft brown earth, placed the tiny seed inside, covered it gently, and whispered, "Grow."

Days passed. Nothing happened. The gardener smiled and said, "See? Nothing."

Weeks passed. A tiny green shoot pushed through the soil — no bigger than a blade of grass.

Months passed. The shoot became a stem. The stem became a branch. The branch became many branches.

And one year later, {childName}, that tiny seed had become the tallest tree in the whole garden. Its branches stretched wide like open arms. Birds built nests in it. Children played in its shade. Travellers rested under its leaves.

The gardener stood beneath it, mouth open. "How?" he whispered.

The child smiled. "It just needed someone to believe in it."

Jesus once held a tiny mustard seed and told his friends: faith starts small. It might be no bigger than this seed. But if you plant it, water it, and believe — it can grow into something so big that it shelters the whole world.

Tonight, {childName}, remember the tiny seed. You do not have to be big to do big things. You just have to start. Goodnight, little seed. You are already growing.`
      },
      {
        id: 'plh_ep4_house_on_rock', episodeNumber: 4, title: 'The House on the Rock',
        subtitle: 'Two builders choose differently — and one house stands through the storm.',
        tradition: 'christian', theme: 'wisdom', durationMinutes: 3,
        source: 'Parables for Little Hearts · Episode 4',
        imagePrompt: 'Cinematic scene of two small houses on a hillside, one on solid rock standing firm, one on sand tilting in rain, dramatic but gentle sky, warm watercolor tones, NO TEXT',
        body: `Once there were two friends who each decided to build a house.

The first friend found a big, flat rock on top of a hill. "I will build here," she said. It was hard work. She had to carry stones up the hill, mix mortar in the hot sun, and lay each brick carefully. It took a long time, but she did not rush.

The second friend found a smooth stretch of sand by the river. "This is easier," he said. He built his house quickly — stacking boards, hammering nails, whistling as he worked. By lunchtime, his house was done. He put his feet up and smiled.

"Why are you still working?" he called to his friend on the hill. "My house is already finished!"

She smiled but kept building.

That night, a storm rolled in. Rain poured down in silver sheets. The wind howled and pushed at everything in its path. The river rose higher and higher.

The house on the sand began to shake. The boards creaked. The walls leaned. And then — whoosh — the water swept it away, board by board, nail by nail, until nothing was left but wet sand.

But the house on the rock stood firm. The rain hammered its roof, but the roof held. The wind pushed its walls, but the walls did not move. Inside, the first friend sat warm and dry, reading a book by candlelight.

Jesus told this story to teach something important, {childName}: when you build your life on strong things — kindness, honesty, love, and patience — you can stand through any storm.

Tonight, as you lie safe and warm in your bed, remember — you are building your house right now, one good choice at a time. Build it on the rock. Goodnight, little builder.`
      },
      {
        id: 'plh_ep5_generous_farmer', episodeNumber: 5, title: 'The Generous Farmer',
        subtitle: 'A farmer shares his harvest with everyone — and discovers he has even more.',
        tradition: 'christian', theme: 'sharing', durationMinutes: 3,
        source: 'Parables for Little Hearts · Episode 5',
        imagePrompt: 'Cinematic scene of a kind farmer sharing golden wheat and fruits from overflowing baskets with villagers, warm harvest sunset, rolling green fields, abundant and joyful, NO TEXT',
        body: `There was once a farmer who had a wonderful harvest. His fields were golden with wheat. His trees were heavy with apples and pears. His garden overflowed with tomatoes, beans, and sweet strawberries.

His neighbours had not been so lucky. The rain had missed their fields. Their crops were thin and pale.

The farmer looked at his overflowing barn and then looked at his neighbours' empty ones. He had a choice to make.

"I could keep it all," he thought. "I worked hard. I deserve it."

But something warmer stirred inside his chest — a gentle voice that whispered, "You have more than enough."

So the farmer loaded his cart with sacks of wheat, baskets of fruit, and bundles of fresh vegetables. He drove to the first neighbour's house and said, "This is for you."

The neighbour's eyes filled with tears. "But what about you? Will you have enough?"

The farmer smiled. "I have plenty."

He went to the next house, and the next, and the next. By evening, his cart was empty. He drove home under a sky full of stars, his barn half full now instead of overflowing.

But something strange happened. The next morning, his neighbour brought him fresh bread. Another brought honey. Another mended his fence while he slept. The whole village began sharing — not because they had to, but because the farmer had started something beautiful.

By the end of the week, the farmer's barn was full again — not just with food, but with friendship, with laughter, and with love.

Jesus taught that when you give with an open heart, you never end up with less. You end up with more — more than you could ever carry alone.

Tonight, {childName}, remember the generous farmer. Sharing does not make you smaller. It makes the whole world bigger. Goodnight, generous heart.`
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SERIES: Peaceful Paws — Buddhist Stories
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'peaceful-paws-buddhist',
    title: 'Peaceful Paws — Buddhist Stories',
    icon: '🪷',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #fecaca 100%)',
    description: 'Animal friends discover mindfulness, patience, and peace — five calming nights from the Buddhist tradition.',
    ageRange: '3-8',
    tradition: 'buddhist',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ppb_ep1_monkey_still', episodeNumber: 1, title: 'The Monkey Who Learned to Be Still',
        subtitle: 'A restless monkey discovers that stillness is the greatest adventure.',
        tradition: 'buddhist', theme: 'patience', durationMinutes: 3,
        source: 'Peaceful Paws — Buddhist Stories · Episode 1',
        imagePrompt: 'Cinematic scene of a small brown monkey sitting peacefully with closed eyes on a mossy rock beside a calm forest pond, golden light filtering through bamboo, lotus flowers floating, NO TEXT',
        body: `In a tall green forest where the bamboo grew thick and the rivers sang soft songs, there lived a little monkey named Momo. Momo could not sit still. Not even for a moment.

He swung from branch to branch. He chattered and laughed. He threw mangoes into the river just to watch them splash. He did cartwheels on the tallest trees and somersaults off the biggest rocks.

"Momo, slow down," said the old tortoise by the pond.

"Slow down? Why?" Momo laughed, already swinging to the next tree.

But one day, Momo swung so fast and so far that he got lost. The forest looked different. The trees were unfamiliar. The path had disappeared. And for the first time in his busy, bouncy life — Momo was scared.

He sat down on a mossy rock and did the only thing he could do. He sat still.

At first, it felt terrible. His tail twitched. His fingers drummed. His mind raced. But slowly, something changed.

He heard the river. Not just the splashing — the soft, gentle humming underneath. He felt the breeze on his fur. He saw a blue butterfly land on a flower right beside him. He had never noticed how beautiful a butterfly's wings were.

And in that stillness, Momo heard something else — the sound of the waterfall he knew from home, far away to the east. He followed the sound, slowly this time, and found his way back.

The old tortoise was waiting. "You found your way home," she said.

"I found something else too," Momo whispered. "I found the quiet. And it is beautiful."

Tonight, {childName}, try what Momo learned. Close your eyes. Be still for just a moment. Listen. Feel. Breathe. The quiet is always there, waiting for you — like a friend who never leaves. Goodnight, peaceful one.`
      },
      {
        id: 'ppb_ep2_elephant_kindness', episodeNumber: 2, title: 'The Elephant Who Remembered Kindness',
        subtitle: 'A great elephant never forgets the small acts of love she receives.',
        tradition: 'buddhist', theme: 'gratitude', durationMinutes: 3,
        source: 'Peaceful Paws — Buddhist Stories · Episode 2',
        imagePrompt: 'Cinematic scene of a gentle grey elephant bowing her head toward a small bird perched on a pink lotus flower, golden sunset light in a misty forest clearing, peaceful and tender, NO TEXT',
        body: `Deep in a forest where ancient trees touched the sky, there lived an old elephant named Priya. Priya was the gentlest creature in the whole forest. She walked so softly that even the fallen leaves were not disturbed.

But what made Priya truly special was her memory. She remembered every act of kindness she had ever received — every single one.

She remembered the little bird who had once pulled a thorn from her ear when she was young. Every morning, Priya left a pile of seeds by the bird's favourite tree.

She remembered the deer who had shown her a hidden stream during a drought. Every summer, Priya cleared fallen branches so the deer could reach the water easily.

She remembered the mouse who had once chewed through a vine that was tangled around her ankle. Every night, Priya stood guard near the mouse's burrow so no owl would come too close.

"Why do you do all this?" asked a young elephant one day. "These are such small creatures. They probably do not even remember helping you."

Priya looked at the young elephant with warm, wise eyes. "That is not the point, little one. They were kind to me when I needed it. I carry their kindness in my heart, and I give it back — not because I must, but because remembering kindness makes my heart feel like sunshine."

That evening, the little bird, the deer, and the mouse all came to the clearing where Priya rested. They did not need to say anything. They just sat near her, and she near them, and the forest felt warmer than it ever had.

Tonight, {childName}, think of one kind thing someone did for you today — even something small. Hold it in your heart like Priya does. Kindness remembered is kindness multiplied. Goodnight, grateful heart.`
      },
      {
        id: 'ppb_ep3_lotus_mud', episodeNumber: 3, title: 'The Lotus That Grew in the Mud',
        subtitle: 'A tiny flower grows from the muddiest, darkest place into something beautiful.',
        tradition: 'buddhist', theme: 'courage', durationMinutes: 3,
        source: 'Peaceful Paws — Buddhist Stories · Episode 3',
        imagePrompt: 'Cinematic scene of a single glowing pink lotus flower rising from dark muddy water into golden sunlight, dewdrops on petals, calm pond with lily pads, beautiful transformation, NO TEXT',
        body: `At the bottom of a dark, muddy pond, a tiny seed sat in the cold earth. Above it was murky water. Around it was thick, heavy mud. No sunlight reached it. No breeze touched it. It was the loneliest little seed in the world.

"I will never be anything," the seed thought. "I am stuck here in the dark."

But something deep inside the seed — something warm and quiet — whispered, "Grow."

So the seed pushed. Just a little. A tiny green shoot reached upward through the mud. It was slow and difficult. The mud was heavy. The water was cold. But the shoot kept reaching, kept stretching, kept believing.

Days passed. The shoot became a stem. The stem grew taller, past the mud, through the murky water, stretching and stretching until one morning — the tip of the stem broke through the surface of the pond.

And there, in the warm golden sunlight, the stem opened.

A lotus flower. Pure white and soft pink, with petals like silk and a heart like gold. It floated on the water, clean and beautiful, as if it had never touched the mud at all.

A frog sitting on a lily pad stared in wonder. "How?" he croaked. "How did something so beautiful come from something so dark?"

The lotus smiled gently. "The dark is where I learned to grow. The mud is what made me strong. And the light — the light was always up there, waiting for me."

The Buddha once said that the lotus flower is the most beautiful teacher. It shows us that even from the most difficult places, something wonderful can bloom.

Tonight, {childName}, remember the lotus. If things feel hard or heavy right now, keep reaching. The light is waiting for you — and you are already growing. Goodnight, brave little flower.`
      },
      {
        id: 'ppb_ep4_turtle_slow', episodeNumber: 4, title: 'The Turtle\'s Slow Race',
        subtitle: 'A turtle teaches the forest that there is no hurry when you enjoy the journey.',
        tradition: 'buddhist', theme: 'patience', durationMinutes: 3,
        source: 'Peaceful Paws — Buddhist Stories · Episode 4',
        imagePrompt: 'Cinematic scene of a small green turtle walking peacefully along a forest path surrounded by wildflowers, golden afternoon light, other animals watching from the sides, serene and gentle, NO TEXT',
        body: `Every year in the great forest, the animals held a race. The rabbits always won, of course. They were fast. The deer came second — they were graceful. The squirrels came third — they were quick and clever.

And every year, old Tara the turtle entered the race. And every year, she came last.

"Why do you bother?" laughed a young rabbit, stretching his long legs. "You cannot win. You are too slow."

Tara smiled and said nothing. She just lined up at the starting log with everyone else.

The horn blew. The rabbit zoomed ahead. The deer leapt forward. The squirrels scurried. And Tara — Tara took one slow step. Then another.

The rabbit reached the halfway point in minutes. But he was so far ahead that he got bored. He sat down and started picking berries. The deer stopped to admire her reflection in a puddle. The squirrels began arguing about who was in third place.

Tara kept walking.

She noticed a baby bird that had fallen from its nest. She stopped, gently nudged it back to safety, and kept walking.

She found a patch of wild strawberries and took a moment to enjoy their sweetness.

She walked past the sleeping rabbit, past the posing deer, past the arguing squirrels.

And by the time the sun began to set, painting the sky in orange and purple, Tara crossed the finish line.

Not first — the rabbit woke up and sprinted past her at the last moment. But Tara did not mind. She had seen a baby bird find its nest. She had tasted the sweetest strawberries. She had felt every pebble and every blade of grass beneath her feet.

"Did you lose again?" asked the rabbit.

Tara looked at the sunset and smiled. "I did not lose anything, dear. I found everything."

Tonight, {childName}, there is no rush. Life is not a race. It is a walk — and the slowest walkers see the most beautiful things. Goodnight, patient one.`
      },
      {
        id: 'ppb_ep5_deer_meadow', episodeNumber: 5, title: 'The Deer Who Shared the Meadow',
        subtitle: 'A family of deer learns that sharing space makes everyone stronger.',
        tradition: 'buddhist', theme: 'sharing', durationMinutes: 3,
        source: 'Peaceful Paws — Buddhist Stories · Episode 5',
        imagePrompt: 'Cinematic scene of deer, rabbits, and birds peacefully sharing a golden sunlit meadow with wildflowers, misty forest in background, harmony and community, warm golden hour, NO TEXT',
        body: `In a green meadow at the edge of the forest, a family of deer had lived for as long as anyone could remember. The grass was soft, the stream was clear, and the wildflowers bloomed in every colour.

One spring, a family of rabbits came hopping out of the forest. "Please," said the mother rabbit, "our burrow flooded in the rain. May we share your meadow?"

The oldest deer, a gentle doe named Suri, looked at her family. Some of them shifted nervously. The meadow was not very big.

"There might not be enough room," whispered Suri's brother.

But Suri looked at the tired rabbit family — the mother, the father, and five tiny bunnies with mud on their paws — and said, "There is always enough room."

The rabbits settled in a corner of the meadow. They dug new burrows and nibbled the clover, careful not to take too much.

Then came a family of quails. Their tree had fallen in a storm. "May we stay?" they asked.

"Yes," said Suri.

Then came a hedgehog. Then a family of field mice. The meadow grew busier and busier. Some of the deer grumbled. "There is not enough for everyone."

But Suri noticed something. The rabbits kept the grass short, which helped new flowers grow. The quails ate the bugs that used to bother the deer. The mice dug tiny tunnels that let rainwater reach the roots. The hedgehog kept the slugs away.

The meadow was not smaller. It was richer.

One evening, Suri stood at the centre of the meadow, surrounded by deer, rabbits, quails, hedgehogs, and mice, all resting under the same stars.

"You see?" she said softly. "When we share, we do not have less. We have more — more friends, more help, more life."

Tonight, {childName}, remember Suri's meadow. There is always room for one more friend. And sharing makes everything bloom. Goodnight, gentle heart.`
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SERIES: Gentle Footsteps — Jain Stories
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'gentle-footsteps-jain',
    title: 'Gentle Footsteps — Jain Stories',
    icon: '🦋',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #c7d2fe 100%)',
    description: 'Stories of non-violence, gentleness, and caring for every living thing — five peaceful Jain nights.',
    ageRange: '3-8',
    tradition: 'jain',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'gfj_ep1_butterflies', episodeNumber: 1, title: 'The Boy Who Counted Butterflies',
        subtitle: 'A boy discovers that noticing small creatures changes how you see the whole world.',
        tradition: 'jain', theme: 'compassion', durationMinutes: 3,
        source: 'Gentle Footsteps — Jain Stories · Episode 1',
        imagePrompt: 'Cinematic scene of a young boy sitting in a flower meadow carefully counting colourful butterflies on his fingers, gentle golden light, wildflowers everywhere, peaceful wonder, NO TEXT',
        body: `In a village at the foot of a green hill, there lived a boy named Avi. Avi loved counting things. He counted the stars at night. He counted the stones in the river. He counted the stripes on the bumblebees.

But his favourite thing to count was butterflies.

Every morning, Avi walked through the meadow and counted every butterfly he saw. "One blue, two yellow, three orange, one white with tiny brown dots..."

"Why do you count them?" his sister asked. "They are just bugs."

"They are not just bugs," Avi said softly. "Each one is alive. Each one matters."

His sister rolled her eyes. But Avi kept counting.

One day, a farmer came to the meadow with a big machine. "I am going to clear this field," he said. "I need the land for crops."

"But the butterflies live here," Avi said. "I counted forty-seven this morning. Forty-seven lives."

The farmer laughed. "Forty-seven butterflies? Who cares about butterflies?"

"I do," Avi said. And then he said something that made the farmer stop laughing. "And if forty-seven butterflies do not matter to you, how many lives would it take before they did?"

The farmer was quiet for a long time. He looked at the meadow — really looked at it — and saw what Avi saw. Wings flickering in the sunlight. Tiny creatures sipping nectar from flowers. A world full of small, beautiful lives.

The farmer moved his machine to a different field — one where no butterflies lived.

Avi smiled and went back to counting. "Forty-eight," he whispered, as a new butterfly landed on his shoulder.

The great teacher Mahavir taught that every living being — no matter how small — has a soul that deserves care and respect.

Tonight, {childName}, try counting something small and beautiful. Because when you notice the littlest lives, you are seeing the whole world with a gentle heart. Goodnight, tender soul.`
      },
      {
        id: 'gfj_ep2_walking_softly', episodeNumber: 2, title: 'Walking Softly on the Earth',
        subtitle: 'A girl learns to walk so gently that even the ants are safe beneath her feet.',
        tradition: 'jain', theme: 'kindness', durationMinutes: 3,
        source: 'Gentle Footsteps — Jain Stories · Episode 2',
        imagePrompt: 'Cinematic scene of a barefoot girl walking carefully on a forest path, looking down at tiny creatures with tenderness, soft dappled sunlight, lush green forest floor with moss and ferns, NO TEXT',
        body: `There was once a girl named Meera who walked everywhere in a hurry. She stomped through puddles. She trampled over grass. She ran through the garden without looking down.

One day, her grandmother sat her on the porch steps and said, "Meera, do you know what is under your feet right now?"

Meera looked down. "The ground?"

"Look closer," Grandmother said.

Meera got down on her knees and looked very carefully. And there, in the soft earth between the paving stones, she saw a tiny ant carrying a crumb twice its size. She saw a worm wiggling slowly through the soil. She saw a ladybird climbing a blade of grass.

"There is a whole world down there," Meera whispered.

"Yes," said Grandmother. "And they are all alive. Every one of them feels the sun, just like you. Every one of them has a home, just like you."

From that day on, Meera walked differently. She walked softly. She looked before she stepped. When she saw a line of ants, she walked around them. When she found a snail on the path, she gently moved it to the garden.

Her friends thought she was strange. "Why do you walk so slowly?" they asked.

"Because the earth is full of tiny lives," Meera said. "And I do not want to hurt any of them."

In the Jain tradition, this is called ahimsa — non-violence. It means caring so deeply about every living thing that you choose gentleness in every step you take.

The great teacher Mahavir walked barefoot through the world, placing each foot down softly, so that no creature — not an ant, not a beetle, not a worm — would ever be harmed.

Tonight, {childName}, imagine your feet are as gentle as Meera's. Imagine walking through the world so softly that even the smallest creatures feel safe. That is the kindest way to walk. Goodnight, gentle walker.`
      },
      {
        id: 'gfj_ep3_anthill_prince', episodeNumber: 3, title: 'The Ant Hill and the Kind Prince',
        subtitle: 'Young Mahavir protects an anthill that others want to destroy.',
        tradition: 'jain', theme: 'compassion', durationMinutes: 3,
        source: 'Gentle Footsteps — Jain Stories · Episode 3',
        imagePrompt: 'Cinematic scene of a young prince standing protectively in front of a large anthill in a forest, palace visible in background, golden light, butterflies and small creatures nearby, NO TEXT',
        body: `Long ago, in a palace surrounded by gardens and fountains, a young prince named Vardhamana lived. He would one day be known as Mahavir — the great teacher — but right now, he was just a boy who loved all living things.

One afternoon, the prince was walking through the forest near the palace when he heard voices. The royal gardeners were standing in front of a great anthill, as tall as a small child, and they were holding shovels.

"We must remove it," said the head gardener. "It is in the way of the new path."

"Wait!" the prince called out, running toward them.

The gardeners bowed. "Your Highness, it is only an anthill."

Vardhamana knelt beside the anthill and looked closely. Thousands of tiny ants were moving in and out, carrying food, tending their young, building tunnels — a whole city of tiny lives, busy and beautiful.

"It is not only an anthill," the prince said softly. "It is their home. These ants have built it grain by grain, with their own tiny hands. They have families inside. They have babies. They have a world that matters to them just as much as our palace matters to us."

The gardeners looked at each other, unsure.

"Build the path around it," the prince said gently. "There is always another way."

And so the path curved gently around the anthill, and the ants lived on, safe and undisturbed. The curved path became the most beautiful part of the garden, because the wildflowers that grew near the anthill were the prettiest of all.

Mahavir grew up to teach the world that every life — no matter how small, no matter how different — is sacred. Harming even the tiniest creature is like breaking a piece of the world.

Tonight, {childName}, remember the anthill. Every small life is a whole world. And protecting it is one of the bravest, kindest things you can do. Goodnight, protector of small things.`
      },
      {
        id: 'gfj_ep4_sharing_no_score', episodeNumber: 4, title: 'Sharing Without Keeping Score',
        subtitle: 'Two friends learn that true giving means never counting what you gave.',
        tradition: 'jain', theme: 'sharing', durationMinutes: 3,
        source: 'Gentle Footsteps — Jain Stories · Episode 4',
        imagePrompt: 'Cinematic scene of two children sitting under a tree sharing food from their lunchboxes without counting, warm afternoon light, Indian village background, friendship and generosity, NO TEXT',
        body: `Ravi and Kiran were best friends. They sat together at school, walked home together, and shared everything — almost.

One day, Ravi gave Kiran half his mango at lunch. The next day, Kiran gave Ravi two of his biscuits. The day after that, Ravi shared his water when Kiran forgot his bottle.

But then Ravi started counting.

"I have shared three things this week," he told Kiran. "You have only shared two. That is not fair."

Kiran looked hurt. "I did not know we were counting."

They stopped sharing after that. Lunchtimes were quiet. The walk home felt longer. Something warm between them had gone cold.

One evening, Ravi's grandmother noticed he was sad. "What is wrong, little one?"

Ravi told her about the counting. Grandmother listened, then smiled. "Come, let me show you something."

She took Ravi to the garden and pointed at the mango tree. "Does the mango tree count how many mangoes it gives? Does it say, 'I gave ten to the birds, but they only sang five songs in return, so no more?'"

Ravi shook his head.

"The tree gives because giving is what it does. It does not keep score. And look — the more it gives, the more it grows."

The next day at school, Ravi sat beside Kiran and put half his mango on Kiran's desk. "I am sorry," he said. "I stopped sharing the right way. I was counting instead of caring."

Kiran smiled. "I was counting too. Let us stop."

And they did. They shared freely, warmly, without a tally, without expectation. And their friendship grew as tall and strong as Grandmother's mango tree.

Jain teachers say the purest gift is one given without expecting anything back — not even a thank-you.

Tonight, {childName}, share something tomorrow. And do not count. Just give. It is the most beautiful feeling in the world. Goodnight, generous soul.`
      },
      {
        id: 'gfj_ep5_firefly_light', episodeNumber: 5, title: 'The Firefly\'s Tiny Light',
        subtitle: 'A single firefly proves that even the smallest glow can guide the way.',
        tradition: 'jain', theme: 'courage', durationMinutes: 3,
        source: 'Gentle Footsteps — Jain Stories · Episode 5',
        imagePrompt: 'Cinematic scene of a single glowing firefly illuminating a dark forest path, tiny warm golden light against deep blue darkness, other fireflies appearing one by one, magical and hopeful, NO TEXT',
        body: `In a forest so dark that even the owls squinted, there lived a tiny firefly named Jyoti. Her light was small — barely brighter than a candle flame — and she often felt it did not matter.

"What good is my little light?" she sighed, watching the moon glow above the trees. "The moon lights up the whole sky. I can barely light up a leaf."

One night, a terrible storm put out all the lanterns in the nearby village. The paths were dark. A little girl was lost in the forest, calling out for her family, her voice trembling.

Jyoti heard the girl crying. She flew to her and blinked her tiny light.

"I can see you!" the girl whispered. "But your light is so small — I can barely follow it."

Jyoti knew her light was not enough alone. So she called to her friends. One firefly came. Then another. Then ten. Then fifty. Then hundreds.

The forest filled with tiny golden dots, like a river of floating stars. Together, their light was bright enough to see the path. The little girl followed the fireflies, step by step, until she found her way home.

"Thank you," the girl said, her eyes shining. "You were like a sky full of stars."

Jyoti smiled. Not because her light was big. But because she had learned something important: one small light alone may seem like nothing. But one small light that inspires others to shine — that changes the world.

The Jain tradition teaches that every small act of goodness matters. One kind word. One gentle touch. One tiny light. Alone, it is a spark. Together, it is the sun.

Tonight, {childName}, remember Jyoti. Your light may feel small, but it is yours, and the world needs it. Shine it bravely. Someone in the dark is waiting for exactly your glow. Goodnight, little firefly.`
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SERIES: Wise Nights — Jewish Stories
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wise-nights-jewish',
    title: 'Wise Nights — Jewish Stories',
    icon: '✡️',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #60a5fa 50%, #bfdbfe 100%)',
    description: 'Stories of wisdom, community, and wonder from the Jewish tradition — five cozy nights of learning and love.',
    ageRange: '3-8',
    tradition: 'jewish',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'wnj_ep1_jar_honey', episodeNumber: 1, title: 'The Rabbi\'s Jar of Honey',
        subtitle: 'A wise rabbi teaches that learning is as sweet as honey.',
        tradition: 'jewish', theme: 'wisdom', durationMinutes: 3,
        source: 'Wise Nights — Jewish Stories · Episode 1',
        imagePrompt: 'Cinematic scene of a warm study with a kind rabbi pouring golden honey onto the page of an open book, candlelight, leather-bound books on shelves, cozy and reverent, NO TEXT',
        body: `In a little village with cobblestone streets and chimneys that puffed gentle smoke, there lived a rabbi with twinkling eyes and a long grey beard. His name was Rabbi Lev, and he loved two things above all else: children and learning.

Every year, when the youngest children came to his school for the very first time, Rabbi Lev did something special. He opened a thick, beautiful book and placed it on the table. Then he took out a small jar of golden honey.

The children watched, wide-eyed, as the rabbi dipped his finger in the honey and touched it to the first letter on the page.

"Now," he said with a warm smile, "taste it."

One by one, the children touched the honeyed letter and tasted. Their eyes grew wide. "It is sweet!"

"Yes," said Rabbi Lev, sitting down among them. "Your very first lesson tastes like honey. And do you know why? Because learning is sweet, {childName}. Every letter, every word, every story — it is all honey for your mind and your heart."

The children giggled and licked their fingers.

"But listen," the rabbi said gently. "Not every lesson will feel sweet at first. Some will be hard. Some will make you think so much that your head feels tired. But if you keep going, keep reading, keep asking questions — the sweetness always comes back."

From that day on, whenever the children felt tired of studying, they remembered the honey. They remembered that first sweet taste. And they kept going.

In the Jewish tradition, learning is not a chore. It is a gift — as sweet as honey on the tongue. Every book is a jar of honey waiting to be opened.

Tonight, {childName}, think about something new you learned today. Was it hard? Was it easy? Either way, it was honey. And tomorrow, there will be more. Goodnight, sweet learner.`
      },
      {
        id: 'wnj_ep2_broken_vase', episodeNumber: 2, title: 'The Broken Vase and the Golden Repair',
        subtitle: 'A broken vase becomes more beautiful when mended with gold.',
        tradition: 'jewish', theme: 'forgiveness', durationMinutes: 3,
        source: 'Wise Nights — Jewish Stories · Episode 2',
        imagePrompt: 'Cinematic scene of a beautiful ceramic vase repaired with golden seams glowing warmly on a windowsill, sunset light pouring through, a child looking at it in wonder, cozy room, NO TEXT',
        body: `In a small house on a quiet street, a child was playing near the shelf when — bump — a beautiful blue vase wobbled, tipped, and fell to the floor. It broke into five pieces.

{childName} — I mean, the child — felt terrible. The vase had belonged to Grandmother. It had sat on that shelf for as long as anyone could remember, with dried lavender inside it that smelled like summer.

"I broke it," the child whispered, eyes filling with tears. "It can never be the same."

Grandmother came in, looked at the pieces on the floor, and did something unexpected. She smiled.

"Let me show you something," she said.

Grandmother gathered the pieces gently and took out a tiny jar of gold paint. Carefully, slowly, she glued the pieces back together, painting each crack with a thin line of gold. It took all afternoon. The child watched, sniffling.

When Grandmother finished, the vase sat on the table — mended, whole, and somehow even more beautiful than before. The golden lines shimmered like rivers of sunlight running through blue sky.

"But it is still broken," the child said.

"No," said Grandmother. "It is healed. And the golden lines — those are not hiding the breaks. They are celebrating them. They are saying, 'Something happened here, and I survived. I am still beautiful. Maybe even more beautiful than before.'"

In the Jewish tradition, there is a teaching called tikkun — repair. The world is not perfect. Things break. Hearts crack. Mistakes happen. But every break is a chance to repair with gold — to make something stronger, kinder, and more beautiful than it was.

Tonight, {childName}, if something felt broken today — a friendship, a mistake, a sad moment — remember the golden vase. You can always mend it. And the gold will make it shine. Goodnight, golden heart.`
      },
      {
        id: 'wnj_ep3_miriam_song', episodeNumber: 3, title: 'Miriam\'s Song by the Sea',
        subtitle: 'Miriam sings and dances when her people finally reach safety.',
        tradition: 'jewish', theme: 'courage', durationMinutes: 3,
        source: 'Wise Nights — Jewish Stories · Episode 3',
        imagePrompt: 'Cinematic scene of a young woman dancing joyfully by the seashore at sunrise with a tambourine, waves parting gently behind her, golden and rosy light, celebration and freedom, NO TEXT',
        body: `A long, long time ago, the people of Israel were trapped. They had been working so hard, for so long, building things for a king who was not kind. They were tired. They were sad. And they dreamed of being free.

Among them was a girl named Miriam. Even when everyone else was worried, Miriam held on to hope. She carried a small tambourine everywhere she went — a little drum made of wood and skin with tiny bells around the edge.

"Why do you carry that?" her friends asked. "There is nothing to celebrate."

Miriam smiled. "There will be," she said. "And when that day comes, I want to be ready."

The days were hard. The nights were long. But Miriam never put her tambourine down.

And then, one day, freedom came. The people of Israel left the land where they had been trapped. They walked and walked until they reached the sea. Behind them, danger followed. Ahead, the water stretched wide and deep.

But something miraculous happened. The waters parted, and the people walked through on dry ground — safe, free, together.

When they reached the other side, Miriam lifted her tambourine. She shook it high in the air, and the little bells rang out like laughter. Then she began to sing. She sang about hope. She sang about courage. She sang about never giving up, even when things seemed impossible.

The people joined her. They danced and clapped and cried happy tears under the morning sun.

Miriam's song teaches us something beautiful, {childName}: even in the hardest times, carry your tambourine. Hope is not silly. Hope is brave. And one day — one beautiful day — you will need it.

Tonight, close your eyes and hear Miriam's bells ringing gently. Freedom is real. Hope is real. And your song is coming. Goodnight, brave singer.`
      },
      {
        id: 'wnj_ep4_challah_village', episodeNumber: 4, title: 'The Challah That Fed the Village',
        subtitle: 'One loaf of bread, shared with love, feeds more people than anyone thought possible.',
        tradition: 'jewish', theme: 'sharing', durationMinutes: 3,
        source: 'Wise Nights — Jewish Stories · Episode 4',
        imagePrompt: 'Cinematic scene of a golden braided challah bread on a wooden table surrounded by happy villagers sharing pieces, warm candlelight, Friday evening atmosphere, community and love, NO TEXT',
        body: `In a little village where the houses leaned close together like old friends, Friday evening was the most special time of the week. It was Shabbat — the day of rest — and everyone baked challah, the beautiful braided bread with a golden crust and soft, sweet inside.

But one Friday, the flour ran out. Every family had only enough for one small loaf. Not enough for a feast. Barely enough for a family.

An old woman named Bubbe Ruth looked at her one small challah and made a decision. She cut it in half, wrapped one half in a cloth, and walked next door.

"For you," she said to her neighbour, Mrs. Katz.

Mrs. Katz was surprised. "But Ruth, you need this for yourself!"

"I have enough," said Bubbe Ruth. "Half a challah shared is better than a whole one eaten alone."

Mrs. Katz was so moved that she cut her own challah in half and brought it to the family down the street. That family shared with the next. And the next. And the next.

By the time the Shabbat candles were lit that evening, something magical had happened. Every family had half a challah — not from their own baking, but from their neighbour's love. And somehow, sitting together in the warm candlelight, sharing bread that someone else had baked for them, it tasted sweeter than any challah they had ever eaten.

"I thought we would go hungry tonight," said little Yossi. "But I am full."

"That is the secret of sharing," said Bubbe Ruth, her eyes twinkling. "Love fills the parts that bread cannot."

In the Jewish tradition, Shabbat is about rest, gratitude, and community. It reminds us that we are not meant to eat alone, live alone, or carry our burdens alone.

Tonight, {childName}, imagine the taste of shared challah — warm, golden, and full of love. You are never alone. Goodnight, dear one. Shabbat shalom.`
      },
      {
        id: 'wnj_ep5_stars_jerusalem', episodeNumber: 5, title: 'Stars Over Jerusalem',
        subtitle: 'A child counts the stars and discovers that blessings are too many to number.',
        tradition: 'jewish', theme: 'gratitude', durationMinutes: 3,
        source: 'Wise Nights — Jewish Stories · Episode 5',
        imagePrompt: 'Cinematic scene of a child lying on a rooftop in ancient Jerusalem looking up at a sky full of brilliant stars, golden city walls below, warm lantern light, wonder and peace, NO TEXT',
        body: `On a warm evening in the old city of Jerusalem, a child climbed the stone steps to the rooftop of her family's house. The sun had just set, and the sky was turning from orange to deep, deep blue.

"Grandmother," the child called, "come count the stars with me!"

Grandmother climbed up slowly, wrapped in a soft shawl, and sat beside the child on the warm stones. Together, they looked up.

"One, two, three..." the child began.

"Four, five, six, seven..." Grandmother joined in.

They counted and counted. The sky grew darker, and more stars appeared. Then more. Then more. The sky was so full of stars it looked like someone had spilled a jar of diamonds across dark velvet.

"Grandmother, I have lost count," the child said, laughing. "There are too many!"

Grandmother smiled. "Good. That is exactly the lesson."

"What lesson?"

"Long ago, God told Abraham to look at the sky and try to count the stars. God said, 'Your blessings will be as many as those stars — too many to count.' And do you know what, my love? It is true. Your blessings are uncountable."

The child thought about this. "Like what?"

"Like the breath in your lungs right now. Like the warm stone beneath you. Like the sound of my voice. Like the fact that you are here, alive, looking at the same stars that Abraham looked at thousands of years ago."

The child was quiet for a long time. Then she whispered, "I think I have more blessings than stars."

"You always will," said Grandmother.

In the Jewish tradition, gratitude is not just a feeling — it is a practice. Every morning begins with a thank-you. Every meal begins with a blessing. Because when you start counting your blessings, you discover they are as endless as the stars.

Tonight, {childName}, look up — even if it is just in your imagination — and count three blessings. Then let go of the number, because there are always more. Goodnight, little star-counter. The sky is full of blessings, and so are you.`
      },
    ]
  },
];
