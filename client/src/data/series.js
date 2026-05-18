// Series — multi-episode story arcs with recurring characters.
// Each episode is standalone (complete arc) but same characters across the series.

export const SERIES = [
  {
    id: 'fire-truck-academy',
    title: 'Fire Truck Academy',
    icon: '🚒',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fca5a5 100%)',
    description: 'Engine 7 joins the fire academy. 3 nights of courage, teamwork, and finding your bravery.',
    ageRange: '4-7',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'fta_ep1_afraid', episodeNumber: 1, title: 'Afraid of Fire',
        subtitle: 'Engine 7 has a secret — he is afraid of fire.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 1',
        body: `Engine 7 was the shiniest fire truck in Station 3. Red paint, chrome bumper, loudest siren. But Engine 7 had a secret — he was afraid of fire.

Every time the alarm rang, his engine stuttered. His wheels shook. The other trucks raced ahead while Engine 7 followed slowly behind.

"Come ON, Seven!" shouted Pumper 4. "You're supposed to be the fastest!"

But every time he saw orange flames, something inside him froze. His water pump locked. His ladder wouldn't extend.

One night, the alarm rang at 3 AM. A house on Oak Street. A family was trapped. All the other trucks were busy across town. It was just Engine 7.

His engine stuttered. But then he heard a child crying through his radio. Not screaming. Just crying softly. Like they had given up.

Something bigger than fear roared to life. He drove. Faster than ever. Ladder up. Water flowing. The family came down safely.

That night, {childName}, remember Engine 7. Everyone is afraid of something. But when someone needs you, fear gets smaller. And courage gets louder.`,
      },
      {
        id: 'fta_ep2_big_test', episodeNumber: 2, title: 'The Big Test',
        subtitle: 'The academy exam is tomorrow. Engine 7 is not ready.',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 2',
        body: `Captain Hydrant announced: "Academy exams next week. Every truck must pass the Obstacle Course of Flames."

The course was legendary. Stage 1: drive through a tunnel of fire. Stage 2: extend ladder to the 5th floor while water cannons spray you. Stage 3: rescue a dummy from a smoke-filled room in 90 seconds.

Engine 7 watched Pumper 4 pass easily. Even little Brush 9 passed on her first try. Engine 7 tried Stage 1. He froze in the tunnel.

"Failed," said Captain Hydrant.

That night, old Ladder 12 — the most respected truck in the fleet — parked beside him. "I failed that test four times," Ladder 12 said.

"You? Failed?"

"The first three times, I tried to be brave. To push through. The fourth time, I stopped fighting the fear. I just drove WITH it. Let it be a passenger."

The next morning, Engine 7 let the fear sit in his engine. And he drove. Through the tunnel. Up to the 5th floor. Dummy rescued in 71 seconds. "Passed."

That night, {childName}, remember Engine 7 and Ladder 12. Sometimes the bravest thing is not fighting your fear — it's letting it ride along while you do what needs to be done.`,
      },
      {
        id: 'fta_ep3_saving_day', episodeNumber: 3, title: 'Saving the Day',
        subtitle: 'A real emergency. No more practice.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 3',
        body: `Graduation day at Station 3. Engine 7 had his certificate. Then the real alarm rang.

"Apartment complex on Maple Avenue. Fourth floor. Multiple families trapped."

When they arrived, it was worse than any practice. The entire fourth floor was engulfed. People on balconies screaming.

"Engine 7! North side. Fifth floor. Family trapped. You're the only one with a ladder tall enough."

The north side was the worst. Flames shooting from every window on the fourth floor. His ladder would have to go THROUGH the fire.

His engine stuttered. The old fear was back. "Hello, old friend," Engine 7 whispered.

Then from the fifth floor: "Is anyone coming? Please."

"Let's go," he said to the fear. "We're both going up."

His ladder extended through the flames. A father carrying a toddler. A mother with a baby. Four people came down safely.

Captain Hydrant said: "Engine 7 performed the most difficult rescue in Station 3 history. And I'm told he did it while shaking the entire time."

Engine 7 was still shaking. But now he knew: being afraid and showing up anyway — that was his superpower.

That night, {childName}, the bravest people are not fearless. They shake and show up anyway.`,
      },
    ],
  },

  {
    id: 'panchatantra-tales',
    title: 'Panchatantra Tales',
    icon: '🐒',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #6ee7b7 100%)',
    description: 'Ancient Indian stories of clever animals — the monkey, the crow, and the crocodile.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'pt_ep1_monkey', episodeNumber: 1, title: 'The Monkey and the Crocodile',
        subtitle: 'A clever monkey outsmarts a dangerous friend.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Panchatantra Tales · Episode 1',
        body: `In a forest by a great river, a clever brown monkey named Chiku lived in a tall mango tree. Every day, he ate sweet mangoes and threw some down to a crocodile named Makara who lived in the river below.

They became friends. But Makara's wife wanted to eat the monkey's heart. "A monkey who eats such sweet mangoes must have the sweetest heart," she said.

One day, Makara invited Chiku to his home across the river. "Hop on my back!" Halfway across, Makara confessed: "My wife wants your heart."

Chiku's own heart pounded. But he stayed calm. "Oh dear! I left my heart in the mango tree. Take me back and I'll get it!"

Makara, not very clever, swam back. Chiku leaped to his tree and never came down again.

"Where's the heart?" called Makara.

"A monkey who gives away his heart is no monkey at all," said Chiku. "And a friend who betrays you was never a friend."

That night, {childName}, remember Chiku. Quick thinking saves you when strength cannot. And real friends never ask you to give up who you are.`,
      },
      {
        id: 'pt_ep2_crow', episodeNumber: 2, title: 'The Crow and the Pitcher',
        subtitle: 'A thirsty crow finds water at the bottom of a pitcher.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Panchatantra Tales · Episode 2',
        body: `On a burning hot afternoon, a glossy black crow named Kaaki flew over a dusty village. Her throat was dry. Her wings were heavy. She had been searching for water all day.

Then she spotted a clay pitcher in a courtyard. She landed on the rim and peered inside. Water! But only at the very bottom. Her beak could not reach it.

She tried tilting the pitcher. Too heavy. She tried breaking it. Too strong. Other birds would have flown away. But Kaaki sat on the rim and thought.

Then she noticed small pebbles on the ground. She picked one up in her beak and dropped it into the pitcher. Plop. The water rose a tiny bit. She dropped another. Plop. And another. Plop. Plop. Plop.

One pebble at a time. For twenty minutes. The other birds laughed. "Just find another pond, Kaaki!"

But Kaaki kept dropping pebbles. And slowly, slowly, the water rose. Until finally — she dipped her beak in and drank.

That night, {childName}, remember Kaaki the crow. The biggest problems are not solved in one big move. They are solved one small step at a time. Patience and persistence beat everything.`,
      },
      {
        id: 'pt_ep3_tortoise', episodeNumber: 3, title: 'The Tortoise and the Geese',
        subtitle: 'A tortoise who talks too much learns a hard lesson.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Panchatantra Tales · Episode 3',
        body: `A tortoise named Mandu lived by a lake with two geese friends — Hansa and Padma. When the lake began to dry up, the geese said: "We're flying to a bigger lake. Come with us!"

"But I can't fly!" said Mandu.

The geese had an idea. They held a stick between their beaks. "Bite the middle and hold on tight. We'll carry you. But whatever you do — do NOT open your mouth."

Mandu bit hard and they flew. Over fields, over villages, over forests. It was wonderful!

Below, villagers looked up and pointed. "Look! A tortoise flying! How clever!"

Mandu felt proud. He wanted to shout: "Yes, it was MY idea!" He opened his mouth — and fell.

Lucky for Mandu, he fell into a haystack and was fine. But the lesson stayed with him forever.

The geese landed beside him. "What happened?"

"I wanted to tell everyone how clever I was. And that's the least clever thing I've ever done."

That night, {childName}, remember Mandu. Sometimes the smartest thing you can do is keep your mouth closed and hold on tight. Not every moment needs your words. Some moments just need your grip.`,
      },
    ],
  },

  {
    id: 'lightning-wheels',
    title: 'Lightning Wheels',
    icon: '🏎️',
    gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fcd34d 100%)',
    description: 'Flash the race car learns that winning isn\'t everything. Speed, friendship, and the road ahead.',
    ageRange: '4-7',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'lw_ep1_fastest', episodeNumber: 1, title: 'The Fastest Car in Town',
        subtitle: 'Flash wins every race. But nobody wants to race him anymore.',
        tradition: 'universal', theme: 'humility', durationMinutes: 4,
        source: 'Lightning Wheels · Episode 1',
        body: `Flash was the fastest car on Maple Street. Red paint. Gold stripes. Engine that purred like a tiger.

Every Saturday, the cars raced down the big hill. Flash always won. By a LOT. He'd cross the finish line, spin his wheels, and shout: "I'm the FASTEST!"

But one Saturday, nobody showed up to race. Flash drove to the starting line. Empty. He drove to the park where the other cars hung out.

"Where is everyone?" Flash asked old Pickup Pete.

"They stopped coming," Pete said. "It's no fun racing someone who always wins and always brags."

Flash felt a strange feeling. Not the thrill of winning. Something heavier. Loneliness.

He drove home slowly — the slowest he had ever driven. And for the first time, he noticed things. The flowers by the road. The sunset. A little tricycle struggling up a hill.

Flash stopped. "Need a push?" The tricycle's eyes went wide. "You're FLASH! You'd help ME?"

Flash pushed the tricycle up the hill. It took five minutes. It was the best five minutes Flash had ever spent.

That night, {childName}, remember Flash. Being the fastest means nothing if you're racing alone. The best thing you can do with your speed is slow down for someone who needs you.`,
      },
      {
        id: 'lw_ep2_flat_tire', episodeNumber: 2, title: 'The Flat Tire',
        subtitle: 'Flash gets a flat tire on race day. Who will help?',
        tradition: 'universal', theme: 'sharing', durationMinutes: 4,
        source: 'Lightning Wheels · Episode 2',
        body: `The big championship race was tomorrow. Flash had been practicing all week. New tires. Fresh oil. Perfect alignment.

But on the morning of the race — PSSSSHH. Flat tire. The front left. A nail on the road.

Flash panicked. "The race starts in one hour! I can't drive on a flat!"

He called Pickup Pete. "Sorry, Flash. I'm hauling hay today." He called Sporty SUV. "Can't help, busy." One by one, every car said no. Flash remembered — he had never helped any of THEM when they needed it.

Then a tiny voice: "I can help." It was Trike — the little tricycle Flash had pushed up the hill last week.

"You? But you're so small!"

"Small, but I know the tire shop owner. He's my uncle." Trike pedaled to the shop and came back with a brand-new tire in twelve minutes.

Flash made it to the race. He came in second place. SECOND. Not first. But when he crossed the finish line, he looked back and saw Trike cheering from the sideline, and it felt better than any first place ever had.

That night, {childName}, remember: the help you need tomorrow comes from the kindness you show today. Every small person you help might be the one who saves your biggest day.`,
      },
      {
        id: 'lw_ep3_last_race', episodeNumber: 3, title: 'The Last Race',
        subtitle: 'Flash\'s final race — but the real prize isn\'t the trophy.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Lightning Wheels · Episode 3',
        body: `The final race of the season. Winner takes the Golden Hubcap — the most famous trophy on Maple Street.

Flash was fast. But so was Turbo, the new car in town. Turbo was younger, shinier, and maybe — just maybe — faster.

The race started. Flash took the lead. Turbo was right behind. Into the first curve — Flash ahead. Down the hill — Turbo gaining.

Then, on the last stretch, Flash saw something. A small puppy had wandered onto the road. Right in the middle of the track.

Turbo didn't see it. He was going too fast, eyes locked on Flash's bumper.

Flash had a choice. Keep racing and win. Or stop and save the puppy.

He hit the brakes. SCREECH. He stopped inches from the puppy. Scooped it onto his hood. Turbo flew past and crossed the finish line.

Turbo won the Golden Hubcap. The crowd cheered for Turbo.

But then something unexpected happened. The crowd turned to Flash — sitting in the middle of the track with a puppy on his hood — and gave him a standing ovation. Louder than any trophy cheer.

The puppy licked Flash's windshield. Flash laughed.

Old Pickup Pete drove over. "You know, Flash, Turbo won the race. But you won something bigger."

"What's that?"

"The thing that matters when the races are over."

That night, {childName}, remember Flash's last race. Trophies collect dust. But the moment you chose to stop — to save something small and helpless — that moment lives forever. In you. And in everyone who saw it.`,
      },
    ],
  },

  {
    id: 'rocket-adventures',
    title: 'Rocket Adventures',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #a5b4fc 100%)',
    description: 'Rocket 5 overcomes her fear of heights and explores the solar system.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'ra_ep1_heights', episodeNumber: 1, title: 'Afraid of Heights',
        subtitle: 'Rocket 5 was built to fly. But she\'s terrified of heights.',
        tradition: 'universal', theme: 'courage', durationMinutes: 4,
        source: 'Rocket Adventures · Episode 1',
        body: `Rocket Number 5 was built to fly to the Moon. Powerful. Shiny. Perfectly engineered. But she had never left the ground. Because she was terrified of heights.

The engineers checked her engines — perfect. Fuel — full. Navigation — flawless. But every countdown, Rocket 5 shook so hard it stopped.

"What if I fall?" she whispered.

One day, a small girl visited the launch site. She looked up at Rocket 5 and said: "I'm scared of the dark. But my mummy tells me: the dark is just the world resting. Maybe heights are just the world getting smaller."

Rocket 5 thought about that. The world getting smaller. Not falling. Just... rising.

The next countdown: 3... 2... 1... She flew. Past the clouds. Past the blue sky. Into the black. And the world below didn't disappear — it became a beautiful blue marble.

"It's not scary up here," Rocket 5 whispered. "It's beautiful."

That night, {childName}, sometimes you just need someone to show you a different way to look at your fear. The thing you're afraid of might be the most beautiful thing you've ever seen — from the other side.`,
      },
      {
        id: 'ra_ep2_moon', episodeNumber: 2, title: 'Landing on the Moon',
        subtitle: 'Rocket 5 reaches the Moon. But it\'s lonelier than she expected.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'Rocket Adventures · Episode 2',
        body: `Rocket 5 landed on the Moon. She expected fanfare. Celebrations. But the Moon was quiet. Very quiet.

Grey dust. No wind. No birds. No voices. Just silence so deep it hummed.

"Hello?" Rocket 5 called. Nothing.

She drove around craters. Found old footprints from astronauts long gone. Found a flag, faded and still. Found a small rover — dusty, solar panels cracked, battery dead.

"Are you okay?" Rocket 5 asked the rover.

No response. But she could see it had been there for years. Alone. Forgotten.

Rocket 5 opened her cargo bay. Inside was a spare battery — meant for emergencies. She connected it to the rover. A light flickered. Then another.

"Thank you," said a tiny electronic voice. "I've been sleeping for so long."

"What's your name?"

"Luna. I was sent to study the Moon. But my battery died and no one came back."

Rocket 5 sat beside Luna on the grey dust, looking at Earth together — a blue marble hanging in the black sky. Neither of them was alone anymore.

That night, {childName}, remember: the loneliest places have someone waiting to be found. And sometimes the most important mission isn't the one you were sent on — it's the one you discover along the way.`,
      },
      {
        id: 'ra_ep3_home', episodeNumber: 3, title: 'Coming Home',
        subtitle: 'Rocket 5 must choose — stay in space or bring Luna home.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 3',
        body: `Rocket 5 had a problem. She had enough fuel to fly home. But not enough fuel to carry Luna the rover AND fly home.

"Leave me," Luna said. "You need to go back. People are waiting for you."

"I'm not leaving you here alone again."

"But if you stay, we'll both be stuck."

Rocket 5 thought. She thought about the little girl who taught her about heights. She thought about the Moon being lonely. She thought about what matters.

Then she had an idea. "Luna, if I use all my fuel in one giant burst — straight up — we'll escape the Moon's gravity. Then we'll just... float. Toward Earth. Slowly. It might take days instead of hours."

"That's risky."

"Everything worth doing is."

3... 2... 1... BLAST. Every drop of fuel. Every ounce of power. Rocket 5 and Luna shot off the Moon's surface and into the space between worlds.

Then silence. No engine. No fuel. Just floating. Earth growing slowly, slowly larger.

Mission Control was confused. "Rocket 5, why are you approaching at 1/10th speed?"

"Because I'm carrying a friend."

Three days later, Rocket 5 and Luna entered Earth's atmosphere. The heat shield glowed orange. The parachute deployed. They splashed down in the Pacific Ocean.

When they opened the cargo bay, Luna's camera turned on and took a photo of the ocean. Her first photo of Earth. Ever.

The little girl from the launch site was watching on TV. She smiled and whispered: "She brought someone home."

That night, {childName}, remember Rocket 5's choice. She could have come home fast and alone. Instead she came home slow and together. The best journeys are the ones where you bring someone with you.`,
      },
    ],
  },

  {
    id: 'kindness-squad',
    title: 'The Kindness Squad',
    icon: '🦸',
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fbcfe8 100%)',
    description: '3 kids discover their superpowers — and they\'re all about kindness.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'ks_ep1_cape', episodeNumber: 1, title: 'The Golden Thread',
        subtitle: 'Arjun does something kind — and a golden thread appears.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'The Kindness Squad · Episode 1',
        body: `It started on a Tuesday. Arjun held the door for his teacher. A tiny golden thread appeared on his sleeve. He thought it was a loose thread and tried to pull it off. It wouldn't budge.

At lunch, he shared his sandwich with Rohan who forgot his lunch box. Another thread appeared. Then another when he picked up someone's dropped books.

By the end of the day, the threads had woven together into something. A cape. A small, golden, glowing cape.

And Arjun could fly. Just a little — two feet off the ground. Enough to reach the top shelf. Enough to float over puddles.

But the next morning, Arjun was rude to his sister at breakfast. A thread unraveled. He sank an inch.

He understood then: the cape wasn't magic. It was a measurement. Every kindness added a thread. Every unkindness removed one.

That afternoon, Arjun helped his neighbor carry groceries. Two threads appeared. He apologized to his sister. Three more. By bedtime, he was flying again.

That night, {childName}, your kindness is not invisible. It builds something real. Thread by thread. Day by day. One day you'll look back and see the cape you've been weaving all along.`,
      },
      {
        id: 'ks_ep2_feel', episodeNumber: 2, title: 'The Girl Who Feels Everything',
        subtitle: 'Zara can feel what others feel. It\'s overwhelming — until she learns to use it.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'The Kindness Squad · Episode 2',
        body: `Zara's power was different from Arjun's. She couldn't fly. She could FEEL. Whatever anyone near her felt, she felt too.

When her classmate Priya was sad, Zara's chest ached. When her dog was happy, Zara smiled for no reason. When the whole school was anxious before exams, Zara could barely breathe.

"It's too much," she told Arjun at lunch. "Everyone's feelings are so LOUD."

Arjun thought about this. "Maybe that's the point. You're not supposed to carry their feelings. You're supposed to understand them."

That afternoon, a new student arrived. Meera. She sat alone. She didn't talk. The other kids ignored her.

But Zara felt it — a heavy grey fog of loneliness pouring off Meera. Not sadness. Worse. Invisibility.

Zara sat next to her. Didn't say anything. Just sat. And after ten minutes, Meera whispered: "How did you know?"

"Know what?"

"That I needed someone to just... be here."

Zara smiled. Because she DID know. That was her superpower. Not feeling pain. Feeling the right moment to show up.

That night, {childName}, empathy — feeling what others feel — is not a weakness. It is perhaps the greatest superpower there is. It lets you help people before they even ask.`,
      },
      {
        id: 'ks_ep3_shield', episodeNumber: 3, title: 'The Shield of Truth',
        subtitle: 'Dheer\'s power is honesty. But the truth isn\'t always easy.',
        tradition: 'universal', theme: 'honesty', durationMinutes: 5,
        source: 'The Kindness Squad · Episode 3',
        body: `Dheer had one rule: never lie. His shield — a small blue disc that appeared one morning — glowed brighter with every truth he spoke. It could block anything. Bullies. Insults. Even thrown objects.

The three of them — Arjun with his cape, Zara with her empathy, and Dheer with his shield — became The Kindness Squad.

But one day, a bully cornered their friend Rohan and asked Dheer: "Where is Rohan hiding?"

The truth would put Rohan in danger. A lie would save him. Dheer's shield dimmed, waiting for his choice.

Then Dheer said: "I will not answer that question."

The bully laughed. "So you CAN'T always tell the truth!"

"I didn't lie," said Dheer. "I chose silence. There is a difference between honesty and giving away someone else's secret."

His shield blazed brighter than ever. The bully, blinded by the light, stumbled away.

Arjun's cape fluttered. Zara felt pride radiating from Dheer — warm and gold.

"We're a team," Arjun said.

"We always were," Zara said.

Dheer smiled. His shield hummed softly — the sound of truth, held gently.

That night, {childName}, remember The Kindness Squad. A cape woven from kindness. A heart that feels others' pain. A shield that grows stronger with truth. These aren't fantasy powers. They are things YOU already have. You just haven't given them names yet.`,
      },
    ],
  },

  {
    id: 'planet-explorers',
    title: 'Planet Explorers',
    icon: '🪐',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #fbbf24 100%)',
    description: 'Travel the solar system — Moon, Mars, and Pluto each have a story to tell.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'pe_ep1_moon', episodeNumber: 1, title: 'Why the Moon Is Never Lonely',
        subtitle: 'The Moon thinks nobody cares. The Sun shows her the truth.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Planet Explorers · Episode 1',
        body: `The Moon looked down at Earth and sighed. "Everyone has friends down there. Birds fly together. Fish swim in schools. Children play in groups. But I am alone up here."

The Sun heard this and said: "Moon, look again. Every night, billions of children look up at you before they sleep. You are the last thing they see. The thing that makes them feel safe in the dark."

The Moon blinked. "They look at me?"

"Every single night. You are never alone, Moon. You just can't see your friends from up there. But they see you."

The Moon glowed a little brighter that night. Not from the Sun's reflection. From something else. Something warmer.

That night, {childName}, remember the Moon. Sometimes when you feel alone, it's not because nobody cares. It's because you can't see how many people are thinking of you right now. Look up at the Moon tonight — and know that the Moon is looking back at you.`,
      },
      {
        id: 'pe_ep2_mars', episodeNumber: 2, title: 'Why Mars Is Red',
        subtitle: 'Mars was blue once. Then he chose to face the Sun.',
        tradition: 'universal', theme: 'courage', durationMinutes: 4,
        source: 'Planet Explorers · Episode 2',
        body: `Long ago, Mars was blue like Earth. Oceans, rivers, rain. But one day, the Sun grew hotter. The oceans began to boil.

Mars had a choice: hide behind Jupiter or face the Sun directly.

Mars chose to face it. Alone. The heat burned his oceans away. Turned his soil red with iron. Changed him forever. But Mars never moved. Never hid.

Now, when humans look up, they see that red planet and say: "One day, we will live there." Because something about Mars — his stubbornness, his refusal to hide — makes humans want to be near him.

Jupiter, who had offered to shield Mars, asked: "Do you regret it?"

Mars looked at his red, dusty surface. No oceans. No rivers. No rain. "I am not who I was," he said. "But I am still here. And I faced it."

That night, {childName}, remember Mars. Facing something hard might change you. But hiding from it changes you more — and not in a good way. Be like Mars. Face it. Even if it turns you red.`,
      },
      {
        id: 'pe_ep3_pluto', episodeNumber: 3, title: 'Pluto\'s Big Heart',
        subtitle: 'They said Pluto was too small. Then NASA found something incredible.',
        tradition: 'universal', theme: 'humility', durationMinutes: 4,
        source: 'Planet Explorers · Episode 3',
        body: `When they said Pluto was too small to be a planet, little Pluto cried. All his life, he had been one of the nine. Now they said eight was enough.

"You're too small," they said. "Too far. Too cold. Not enough."

Pluto drifted away. Alone in the dark edge of the solar system. The other planets stopped talking about him.

But then, a spacecraft came. From Earth. Just to see HIM. It traveled 9 years and 3 billion miles — just for Pluto.

And when it arrived, it photographed something no one expected: a giant, heart-shaped glacier on Pluto's surface. Bigger than Texas. Visible from space.

The whole world gasped. Pluto had the biggest heart in the solar system. You just had to look closely.

Saturn said: "We should have looked closer."

Jupiter said: "We should have visited sooner."

The Moon — who understood loneliness — said: "We should have never stopped calling him family."

That night, {childName}, remember Pluto. Being small does not mean being unimportant. Sometimes the smallest ones have the biggest hearts. And the people who seem the farthest away might be the ones who need your visit the most.`,
      },
    ],
  },
  {
    id: 'rainbow-kindergarten',
    title: 'Rainbow Kindergarten Adventures',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #f472b6 50%, #fbbf24 100%)',
    description: 'The Rainbow batch from JLPS explores Toronto — shapes at Canoe Landing, a concert, and a hike at Evergreen Brick Works.',
    ageRange: '4-6',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'rk_ep1_canoe', episodeNumber: 1, title: 'Shapes at Canoe Landing',
        subtitle: 'Mr. Zak and Shelagh take the Rainbow batch on a community walk to find shapes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Rainbow Kindergarten · Episode 1',
        body: `It was a Tuesday morning and the Rainbow batch was buzzing. Mr. Zak clapped twice and Shelagh held up the buddy rope. "Rainbow class! Today is our community walk to Canoe Landing Park! We're going on a shape hunt!"

The parent volunteers were already lined up at the door — mums and dads with cameras and water bottles, ready to help. Twenty little backpacks bounced out the door of Jean Lumb Public School. {childName} grabbed the buddy rope near the front, eyes already scanning everything.

"I see a rectangle!" {childName} shouted, pointing at a window on the building across the street.

Mr. Zak grinned. "That's one! Today's mission: find every shape you can. Squares, rectangles, circles, triangles, rhombus, trapezium — and 3D shapes too. Spheres, cuboids, cylinders. If you spot one, shout it out!"

Shelagh added: "And parent volunteers — please take photos of every shape the kids find. We're making a shape book when we get back!"

The walk to Canoe Landing Park took just a few minutes. The moment they arrived, shapes were everywhere.

{childName} found a circle first — the round base of a lamp post. "Circle!" Then another circle — a drain cover in the ground. "Another circle! Circles are EVERYWHERE!"

One of the students pointed at the football field. "Mr. Zak! The field is a rectangle!" Mr. Zak walked to the edge and held out his arms. "How do you know it's a rectangle and not a square?" The student thought hard. "Because it's longer this way than that way!" "Perfect," said Mr. Zak.

Shelagh gathered a group near the climbing structure. "Look at this bolt," she said, pointing at a hexagonal bolt on the railing. "How many sides?" The kids counted together. "Six! Hexagon!"

Then someone spotted the giant red canoe sculpture in the middle of the park. "What shape is THAT?" the kids asked.

"It's like a... half oval?" one student said. "Or a crescent?"

Mr. Zak laughed. "Some shapes are hard to name. And that's okay. In math, we sometimes call that a curved 3D shape."

A parent volunteer knelt down near the concrete path tiles. "Hey kids, come look at this!" The tiles were arranged in a pattern — squares and triangles fitting together like a puzzle. "That's called a tessellation," Shelagh explained. "Shapes that fit together with no gaps."

{childName} was on a mission. Cylinder — found it in a rubbish bin. Sphere — found it in a ball left on the grass. Cuboid — the park bench seat was a perfect cuboid. Trapezium — the side view of a slide had a trapezium shape.

Then {childName} looked up. Way up. The CN Tower rose above the downtown buildings like a giant needle poking the sky. "Mr. Zak! What shape is the CN Tower?"

Mr. Zak looked up and smiled. "That's a great question. The base is a hexagon — six sides. The shaft is a cylinder. And the observation pod at the top? That's kind of a... what do you think?"

{childName} squinted. "A sphere? No... a disc. A flat cylinder!"

"Brilliant," said Mr. Zak.

The parent volunteers were snapping photos of everything — kids pointing at shapes, kids measuring things with their hands, kids lying on the ground looking at tiles. One parent said: "I never noticed how many shapes are in this park until today."

On the walk back to Jean Lumb Public School, the students counted shapes the whole way. Rectangles in doors. Squares in windows. Triangles in rooftops. Cylinders in pipes. Circles in wheels.

Back in the classroom, Mr. Zak and Shelagh pinned the photos on the board. "Look what we found today," Shelagh said. "47 shapes. On one community walk. In one park."

{childName} looked at the board and felt proud. The world was full of shapes — hiding in plain sight.

That night, {childName}, remember the community walk. Math is not just in textbooks. It's in lamp posts and drain covers and park benches and the CN Tower. Shapes are the language the world is built in. And now you can read it — everywhere you look.`,
      },
      {
        id: 'rk_ep2_concert', episodeNumber: 2, title: 'What a Wonderful World',
        subtitle: 'The Rainbow batch performs their first concert at Jean Lumb PS.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Rainbow Kindergarten · Episode 2',
        body: `The Rainbow batch had been practicing for three weeks. Their very first concert at Jean Lumb Public School. One song. Four minutes. Every parent, grandparent, and sibling in the audience.

The song was "What a Wonderful World" — and Mr. Zak had told them why they chose it. "This song was written by Louis Armstrong," he said. "He wanted to remind people that even when the world feels big and busy, there is beauty everywhere. Trees, skies, rainbows, friends. That's what we want to share with our families tonight."

For two weeks, the Rainbow batch had been working on something special: their hats. Each child had made a globe hat — a round hat with planet Earth painted in the centre, covered in blue oceans and green continents. Some had glitter. Some had stickers of clouds. {childName}'s hat had a tiny gold star on top, because "Earth deserves a star."

Mr. Zak and Shelagh had arranged the class in three rows on the stage. The tallest kids in the back, the smallest in the front. Everyone wearing their Earth hats. Twenty little globes on twenty little heads.

Behind the curtain, {childName}'s heart was pounding. Through a gap in the fabric, {childName} could see the gym. It was FULL. Hundreds of parents sitting in rows. Cameras out. Phones up. Grandparents in the front row already dabbing their eyes, and the show hadn't even started yet.

"I'm nervous," {childName} whispered.

Mr. Zak kneeled down to {childName}'s level. "You know what? I'm nervous too. Every single time. But here's the secret — when we sing together, the nervousness turns into something else. It turns into magic. Trust me."

Shelagh adjusted a few hats, straightened a few collars, and gave everyone a thumbs up. "Remember your actions. When we sing 'trees of green,' we sway like trees. When we sing 'skies of blue,' we point up. When we sing 'wonderful world,' we open our arms wide. Mr. Zak and I will be right there doing the actions with you."

The curtain opened.

The lights were warm and bright. The gym went silent. Hundreds of eyes looked at twenty children in Earth hats, standing in three rows, looking both terrified and beautiful.

Mr. Zak raised his hand. The music started — gentle, slow, the opening chords filling the gym.

And the Rainbow batch began to sing.

"I see trees of green... red roses too..." Twenty small voices, some loud, some whispery, all together. They swayed like trees, just as Shelagh had taught them.

"I see them bloom... for me and you..." {childName} could see Mummy in the third row, holding up a phone with one hand and wiping a tear with the other.

"And I think to myself..." The whole class paused, just like they had practised, and then — together, arms wide open — "WHAT A WONDERFUL WORLD."

Mr. Zak was doing every action alongside them from the side of the stage. Shelagh was mouthing every word from the other side. The kids looked at their teachers, not the crowd, and sang like they were back in their classroom.

"The colours of the rainbow... so pretty in the sky..." The children pointed at their Earth hats. Some hats were slightly crooked. One had slipped over a child's eyes. Nobody cared. It was perfect.

"Are also on the faces... of people going by..." The kids waved at the audience. The audience waved back. Someone in the back row laughed — the good kind of laugh, the kind that comes from pure joy.

The final notes played. The Rainbow batch held their last pose — arms wide, Earth hats on, twenty little globes facing the world.

Silence.

Then the gym ERUPTED. Every parent stood up. Clapping, cheering, crying. Phones still recording. Grandparents openly weeping. Someone shouted: "BRAVO!"

Mr. Zak wiped his eyes quickly — he thought nobody saw, but {childName} saw. Shelagh was clapping alongside the parents.

Backstage, the Rainbow batch jumped up and down. "We did it! We did it!"

{childName}'s hat had slipped sideways during the performance. The gold star was hanging over one ear. But Mummy said it was the most beautiful thing she had ever seen.

"You were wonderful," Mummy said.

"We ALL were," {childName} said.

That night, {childName}, remember the concert. Twenty kids in homemade Earth hats sang one song about a wonderful world — and for four minutes, every person in that gym believed it. You don't need to be perfect to make something beautiful. You just need to show up, wear your hat, and sing with your whole heart.

That night, {childName}, remember the Spring Concert. Being brave is not about being perfect. It's about starting. Even when your voice shakes. Even when there are two hundred eyes. Even when the words almost don't come. You start. And the rest follows.`,
      },
      {
        id: 'rk_ep3_brickworks', episodeNumber: 3, title: 'The Field Trip to Brick Works',
        subtitle: 'The first field trip! Two classes board the yellow bus for Evergreen Brick Works.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 6,
        source: 'Rainbow Kindergarten · Episode 3',
        body: `This was it. The first REAL field trip. Not a community walk. A FIELD TRIP. With a yellow school bus.

At 9:15 in the morning, two kindergarten classes lined up outside Jean Lumb Public School. The Rainbow batch and the other kindergarten class — almost forty kids in total. Mr. Zak and Shelagh were at the front, holding clipboards and counting heads. Two parent volunteers were there too, wearing bright orange safety vests and carrying first aid kits.

"Has everyone got their lunch? Water bottle? Buddy?" Mr. Zak called out.

"YES MR. ZAK!" forty voices shouted.

The yellow school bus pulled up. {childName}'s eyes went wide. It was enormous. And yellow. SO yellow. The doors opened with a loud PSSSHHH and the stairs looked like they went up forever.

{childName} climbed aboard. The seats were high and bouncy. The windows were huge. The engine rumbled underneath like a sleeping dinosaur. This was the best thing that had ever happened.

The bus rumbled down Bayview Avenue. Kids bouncing in their seats. Parent volunteers counting heads again. Mr. Zak and Shelagh sitting near the front, going over the schedule. "Stick building first, then lunch, then the turtle conservatory, then the nature walk around the pond."

Evergreen Brick Works appeared through the trees like a hidden world. It was a 130-year-old brick factory that had been turned into a nature park — old brick buildings covered in green ivy, tall chimneys reaching into the sky, and paths disappearing into Toronto's beautiful ravines.

Two nature guides were waiting at the entrance. "Welcome, Jean Lumb!" they said. "Today you're going to learn how animals build their homes — and then YOU are going to build one too."

The kids gasped. BUILD a home?

The guides led them to a clearing in the forest. "Animals don't have hammers or nails," one guide explained. "They use what nature gives them: sticks, leaves, mud, bark, moss. Your job: build a shelter big enough for a small animal to hide in. You can only use things you find on the ground."

The Rainbow batch exploded into action. {childName} found long sticks and leaned them against a fallen log, making a triangle shape — like a tent. Other kids stuffed leaves into the gaps to block wind. Someone packed mud along the bottom to keep out rain. Shelagh helped one group weave thin branches together. Mr. Zak showed another group how to make the roof stronger by crossing sticks in an X pattern.

"Why are sticks so important?" Mr. Zak asked.

"Because they're strong AND bendy!" {childName} said.

"Exactly. Nature's building material. Free, everywhere, and perfectly designed."

The guides inspected each shelter and gave every team a thumbs up. "You just thought like an animal," they said. "You asked: what does this creature NEED? Not what looks pretty. What keeps it safe."

After all that building, everyone was hungry. The kids sat on logs and benches and ate their lunches in the sunshine. Sandwiches, juice boxes, apple slices. Parent volunteers passed out extra water. {childName} traded a cookie for a cheese stick. Fair deal.

After lunch came the part everyone had been waiting for: the turtle conservatory.

The group walked into a special indoor area where the Evergreen team cared for turtles. Two real Midland Painted Turtles were there — their shells dark green with bright yellow and red markings.

"These turtles have been living in the Don Valley for years," the guide said. "We protect them here because their habitat is shrinking. They lay their eggs in sandy soil near the pond, and if people walk on that area, the eggs get crushed. Each egg is smaller than a grape."

The room went quiet. Forty kids suddenly VERY aware of their feet.

"Now — would you like to touch one?"

The room went UN-quiet. "YES!"

"One finger only. Gently. On the shell."

One by one, the kids stepped forward. Some were nervous. Some were excited. Some were both — what {childName} called "nexcited."

{childName} reached out one finger and touched the turtle's shell. It was hard and smooth and warm. The turtle didn't move. It just blinked slowly, as if to say: "I've been here for thirty years. You're fine."

"I touched a turtle," {childName} whispered. "I actually touched a TURTLE."

Then came the nature walk around the pond. The group split into two: one group went left around the pond with Mr. Zak and a parent volunteer, the other went right with Shelagh and the guides.

{childName}'s group went right. Within minutes, they spotted Turtle Island — a small rocky island in the middle of the pond where more than thirty turtles were sunbathing. Painted turtles, Snapping turtles, tiny baby turtles stacked on top of big ones.

"Turtles are cold-blooded," the guide explained. "They need the sun to warm up. That's why they pile on those rocks. It's their version of a hot bath."

"Why do they pile on top of each other?" someone asked.

"Because there are more turtles than rocks. They share. Even turtles know how to share."

The guide pointed out how mother turtles dig nests in the sandy banks, lay their eggs, and then LEAVE. "The babies hatch on their own and crawl to the water by themselves. No mummy to help. That's how tough baby turtles are."

Further along the trail, the group stopped at the bat house — a tall wooden box on a pole. "Hundreds of bats sleep inside during the day," the guide said. "At night, they fly out and eat thousands of mosquitoes. Without bats, summer in Toronto would be unbearable."

Some kids thought bats were scary. The guide said: "They're actually very shy. They've never once bothered a human. They just sleep, fly, and eat bugs. Best neighbours you could ask for."

Then the guide pointed at a plant with three shiny leaves. "See that? That's poison ivy. THREE leaves — let it BE. Never touch it. It makes your skin very itchy and red."

Everyone took three steps back. Mr. Zak took a photo of it. "Good to know what it looks like so you can avoid it," he said.

The group also saw wildflowers, ferns, and herbs growing along the trail. "These are native plants," the guide said. "They've been growing in this ravine for hundreds of years, long before Toronto was a city."

The two groups met back at the meeting point. Forty kids, buzzing with stories. "We saw THIRTY turtles!" "We touched the shell!" "There are BATS!" "Poison ivy has THREE leaves!"

By 1:30, everyone was back on the yellow school bus. Tired. Happy. A little muddy. {childName} pressed against the window one more time, but this time, instead of looking at buildings and cars, {childName} was looking at trees. Wondering which ones had birds inside. Wondering which rocks had turtles underneath. Wondering where the bats were sleeping.

The bus pulled up to Jean Lumb Public School at 1:35. The kids tumbled out, running toward their parents who were waiting at the pickup area.

"How was it?" Mummy asked.

{childName} held up one finger. "I touched a turtle. With THIS finger. And it blinked at me."

That night, {childName}, remember the field trip to Evergreen Brick Works. The turtles who share their sunny rocks. The bats who eat mosquitoes so we don't have to. The baby turtles who crawl to the water all by themselves. And the poison ivy with three shiny leaves — let it BE. The world is full of tiny creatures living their tiny lives, in their tiny homes, right next to ours. All they need is for us to notice them, respect them, and step carefully.`,
      },
    ],
  },
];

