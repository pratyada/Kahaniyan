// Series — multi-episode story arcs with recurring characters.
// Each episode is standalone (complete arc) but same characters across the series.

export const SERIES = [
  {
    id: 'fire-truck-academy',
    title: 'Fire Truck Academy',
    icon: '🚒',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fca5a5 100%)',
    description: 'Engine 7 joins the fire academy — 5 nights of courage, teamwork, and finding your bravery.',
    ageRange: '4-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'fta_ep1_afraid', episodeNumber: 1, title: 'Afraid of Fire',
        subtitle: 'Engine 7 has a secret — he is afraid of fire.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 1',
        body: `Engine 7 was the shiniest fire truck in Station 3. Red paint, chrome bumper, loudest siren on the whole block. But Engine 7 had a secret that he kept locked deep inside his engine — he was afraid of fire.

Every time the alarm rang, his engine stuttered. His wheels shook. The other trucks — Pumper 4, Ladder 9, even little Brush 12 — raced ahead while Engine 7 followed slowly behind, his headlights dim with worry.

"Come ON, Seven!" shouted Pumper 4, the toughest truck in the station. "You're supposed to be the fastest!"

But every time Engine 7 saw orange flames licking at a rooftop, something inside him froze. His water pump locked up. His ladder wouldn't extend. He would park at the edge of the scene and watch the other trucks do the work he was built for.

Chief, the big red command truck, noticed. Chief was kind but firm. He never yelled. He just parked beside Engine 7 one evening and said: "Fear is not the problem, Seven. Hiding from it is."

Engine 7 didn't understand. Not yet.

One night, the alarm rang at 3 AM. A house on Oak Street. A family was trapped on the second floor. All the other trucks were busy across town at a warehouse fire. It was just Engine 7.

His engine stuttered. His wheels trembled. But then he heard a child crying through his radio. Not screaming. Just crying softly. Like they had given up hoping someone would come.

Something bigger than fear roared to life inside Engine 7. Something he didn't know he had. He drove. Faster than he had ever driven. Lights blazing. Siren screaming. Ladder up. Water flowing. The family came down his ladder one by one — a mother, a father, a little girl clutching a stuffed bear.

The little girl looked at Engine 7 and said: "Thank you for coming. I knew someone would."

Engine 7's engine was still shaking. But for the first time, the shaking didn't feel like fear. It felt like being alive.

That night, {childName}, remember Engine 7. Everyone is afraid of something. But when someone needs you, fear gets smaller. And courage — that rumbling thing inside your chest — gets louder.`,
      },
      {
        id: 'fta_ep2_rescue', episodeNumber: 2, title: 'The Rescue',
        subtitle: 'A kitten is stuck in a storm drain. Pumper 4 says it is not their job.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 2',
        body: `The morning after Engine 7's big rescue, the station was buzzing. Even Pumper 4, who never gave compliments, grunted: "Not bad, Seven."

But Engine 7 barely heard it. He was listening to the radio. A call had come in — not a fire. A tiny kitten was stuck in a storm drain on Elm Street. Meowing. Scared. Water rising from last night's rain.

"That's not our job," Pumper 4 said, revving his engine. "We fight fires. Call animal control."

Engine 7 looked at Chief. Chief said nothing. He just raised one chrome eyebrow, the way he did when he wanted the trucks to think for themselves.

"I'll go," said Engine 7.

Pumper 4 laughed. "A fire truck rescuing a kitten? The other stations will never let us hear the end of it."

Engine 7 drove to Elm Street anyway. The drain was narrow — too narrow for his hose. Too deep for his ladder. He could hear the kitten crying, a tiny sound echoing off the concrete walls.

Old Ladder 9 rolled up beside him. Ladder 9 was the wisest truck in the fleet. Grey paint, creaky joints, but the sharpest mind in three counties. "Use your suction hose," Ladder 9 said quietly. "Reverse the flow. Gentle. Like breathing in instead of out."

Engine 7 had never used his equipment that way. But he tried. He lowered the thin suction hose into the drain, set it to the gentlest pull, and waited. A moment later — a tiny orange kitten, wet and shivering, popped up the hose and tumbled onto the street.

A crowd had gathered. Children cheered. Someone wrapped the kitten in a towel. The kitten sneezed once, then purred.

When Engine 7 returned to the station, Pumper 4 was quiet for a long time. Then he said: "Maybe rescuing kittens IS our job."

Chief smiled. "Our job is helping whoever needs help. Big fire or small kitten. The size of the emergency doesn't matter. The size of your heart does."

That night, {childName}, remember the kitten in the drain. Helping isn't about doing what's expected. It's about doing what's needed. And sometimes the smallest rescue is the one that matters most.`,
      },
      {
        id: 'fta_ep3_teamwork', episodeNumber: 3, title: 'Teamwork Drill',
        subtitle: 'The trucks must work together — but nobody wants to follow.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 3',
        body: `Chief announced a surprise drill at sunrise. "Today, you work as one unit. Every truck has a role. Nobody moves until all of you agree on the plan."

The scenario: a school on fire. East wing, second floor. Twenty children inside. Three exits blocked. One narrow road in.

Pumper 4 immediately shouted: "I go first! I'm the strongest. I'll blast the front door open with water and—"

"No," said Ladder 9 calmly. "If you blast the door, the rush of air will feed the fire. It will get worse."

"I know what I'm doing!" Pumper 4 growled.

"You know what YOU do," Ladder 9 said. "But this drill is about what WE do."

Engine 7 watched them argue. Pumper 4 wanted to charge in. Ladder 9 wanted to plan for twenty minutes. Neither would listen to the other. The clock was ticking. In a real fire, children would be waiting.

Engine 7 had an idea. He pulled between them. "What if Ladder 9 makes the plan and Pumper 4 leads the charge? Ladder 9 thinks. Pumper 4 acts. And I'll handle the ladder rescue from the back."

Silence.

Pumper 4 frowned. Then nodded. Ladder 9 unrolled his mental blueprint. "Pumper 4, you open a side window — not the door — creating a controlled entry. Engine 7, ladder to the second-floor east window. I'll position at the north side for anyone who runs that way."

They moved as one. Pumper 4 punched the side window open with a controlled burst. Engine 7's ladder rose to the second floor. Ladder 9 caught three dummy-children who jumped from the north side.

All twenty dummies rescued. Time: four minutes twelve seconds. Station record.

Chief rolled forward slowly. "Four minutes. That's faster than any single truck could do alone. Do you know why?"

Pumper 4, still panting steam: "Because... we each did what we're best at?"

"Because you listened to each other," Chief said. "Strength without a plan is chaos. A plan without action is a daydream. But strength AND a plan together? That's a team."

That night, {childName}, remember the teamwork drill. You don't have to do everything yourself. Find someone who's strong where you're wise, and wise where you're strong. Together, you'll be faster than four minutes.`,
      },
      {
        id: 'fta_ep4_false_alarm', episodeNumber: 4, title: 'The False Alarm',
        subtitle: 'Someone pulls the alarm as a joke. Chief teaches the trucks about honesty.',
        tradition: 'universal', theme: 'honesty', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 4',
        body: `The alarm screamed at noon. All four trucks roared out of the station — Engine 7, Pumper 4, Ladder 9, and little Brush 12. Lights. Sirens. Full speed down Main Street.

They arrived at the shopping mall. No smoke. No flames. No heat. People strolled out calmly, confused.

"False alarm," the mall manager said, shrugging. "Some kid pulled the alarm handle as a prank."

Pumper 4 was furious. His engine roared so loud the windows rattled. "We drove twelve blocks at full speed for NOTHING! Someone could have been hurt!"

Engine 7 felt something else. Not anger. Sadness. Because while they were racing to the mall, a REAL call came in — a small kitchen fire on Pine Street. Another station had to respond, arriving three minutes late. The family was safe, but those three minutes could have mattered.

Back at the station, Chief gathered everyone. "What happened today?"

"Someone lied," Pumper 4 said.

"Yes. And what did that lie cost?"

Ladder 9 spoke slowly. "It cost the family on Pine Street three minutes. It cost us fuel. It cost every person who pulled over for our sirens their time. A lie doesn't just hurt the liar. It hurts everyone around the lie."

Chief nodded. "And the boy who pulled the alarm? He thought it was funny. Thirty seconds of laughter. Three minutes of danger for a family he never met."

Engine 7 thought about his own secret — the fear he used to hide. He used to pretend he was fine, that his engine was just "warming up" when really he was too scared to move. That was a kind of lie too.

"I used to hide my fear," Engine 7 said quietly. "I told everyone my engine was acting up. But it was me. I was the one acting up."

The station was silent.

"And when did it get better?" Chief asked.

"When I told the truth. When I stopped pretending."

Chief's chrome grill caught the afternoon sun. "Honesty doesn't just help other people trust you. It helps you trust yourself."

That night, {childName}, remember the false alarm. A small lie can travel far and hurt people you've never even met. But the truth — even a scary truth — keeps everyone safe. Including you.`,
      },
      {
        id: 'fta_ep5_graduation', episodeNumber: 5, title: 'Graduation Day',
        subtitle: 'Engine 7 graduates from Fire Truck Academy. But the biggest lesson is a surprise.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 5,
        source: 'Fire Truck Academy · Episode 5',
        body: `The day finally arrived. Graduation from Fire Truck Academy. The station was decorated with streamers. Every truck had been washed, waxed, and polished until they gleamed.

Chief stood at the front. "Today, four trucks graduate. But before I hand out badges, I want each of you to tell us what you learned."

Pumper 4 went first. He used to charge into every situation alone. "I learned that strength means nothing without a team. The strongest thing I did this year was listen."

Ladder 9 went next. She had always been the planner, the careful one. "I learned that sometimes you have to act before the plan is perfect. A good plan now beats a perfect plan too late."

Little Brush 12, the youngest and smallest truck, rolled forward shyly. "I learned that small trucks can do big things. I rescued the kitten's brother from a tree last week. Nobody even asked me to. I just went."

Then Engine 7. The truck who started the year too afraid to face a campfire.

"I learned..." He paused. His engine hummed softly. "I learned that being brave doesn't mean the shaking stops. It means you drive anyway. I learned that asking for help is not weakness. I learned that every truck in this station made me better — Pumper 4 taught me to be strong, Ladder 9 taught me to think, Brush 12 taught me that size doesn't matter, and Chief taught me that fear is just a passenger, not the driver."

Chief rolled forward. His chrome badge caught the light. He pinned a small gold star on each truck — right above their headlights.

"These stars don't mean you're finished learning," Chief said. "They mean you're ready to learn on the job. The academy taught you skills. The real fires will teach you who you are."

That evening, Engine 7 parked in his spot at Station 3. The gold star glinted. His engine still hummed with a tiny tremor — the fear that never fully left. But now it felt like an old friend. A reminder that he was alive, and awake, and ready.

That night, {childName}, remember graduation day. You don't need to be fearless. You don't need to be the strongest or the smartest or the biggest. You just need to keep showing up, keep learning, and keep driving — even when your engine shakes. That's what makes you brave. Goodnight, little firefighter.`,
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
    id: 'rainbow-kindergarten-jlps-yr25-26',
    title: 'Rainbow Kindergarten Adventures',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #f472b6 50%, #fbbf24 100%)',
    description: 'The Rainbow batch from JLPS explores Toronto — shapes at Canoe Landing, a concert, and a hike at Evergreen Brick Works.',
    createdBy: 'deepti.ramaul@gmail.com', creatorName: 'Deepti Ramaul', creatorUsername: 'deepti-ramaul',
    ageRange: '4-6',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'rk_ep1_canoe', episodeNumber: 1, title: 'Shapes at Canoe Landing',
        subtitle: 'Mr. Zak and Shelagh take the Rainbow batch on a community walk to find shapes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Rainbow Kindergarten · Episode 1',
        body: `Mr. Zak clapped twice and Shelagh held up the buddy rope. "Rainbow class! Community walk to Canoe Landing Park! We're going on a shape hunt!"

Twenty backpacks bounced out the door of Jean Lumb Public School. Parent volunteers had cameras ready. {childName} grabbed the buddy rope, eyes scanning everything.

"I see a rectangle!" {childName} shouted, pointing at a window.

"That's one!" said Mr. Zak. "Find every shape you can — squares, rectangles, circles, triangles, rhombus, trapezium, and 3D shapes too — spheres, cuboids, cylinders!"

At the park, shapes were everywhere. {childName} found circles in lamp posts and drain covers. Someone spotted the football field. "It's a rectangle!" Mr. Zak asked: "How do you know it's not a square?" "Because it's longer this way than that way!"

Shelagh pointed at a hexagonal bolt. "How many sides?" "Six! Hexagon!"

The giant red canoe sculpture stumped everyone. "It's a curved 3D shape," Mr. Zak said. "Some shapes are hard to name — and that's okay."

{childName} went on a mission. Cylinder — the rubbish bin. Sphere — a ball on the grass. Cuboid — the park bench. Trapezium — the side of a slide.

Then {childName} looked up at the CN Tower rising above downtown. "What shape is that, Mr. Zak?"

"The base is a hexagon. The shaft is a cylinder. And the pod at the top?"

{childName} squinted. "A flat cylinder!"

"Brilliant," said Mr. Zak.

Parent volunteers snapped photos of everything. Back at Jean Lumb, Shelagh pinned them on the board. "47 shapes. One walk. One park."

That night, {childName}, remember the community walk. Math is not just in textbooks. It's in lamp posts and park benches and the CN Tower. Shapes are the language the world is built in. And now you can read it — everywhere you look.`,
      },
      {
        id: 'rk_ep2_concert', episodeNumber: 2, title: 'What a Wonderful World',
        subtitle: 'The Rainbow batch performs their first concert at Jean Lumb PS.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Rainbow Kindergarten · Episode 2',
        body: `The Rainbow batch had been practicing for three weeks. Their very first concert at Jean Lumb Public School. The song: "What a Wonderful World."

Mr. Zak told them why they chose it. "Louis Armstrong wrote this to remind us there is beauty everywhere — trees, skies, rainbows, friends. That's what we want to share tonight."

Each child had made a special globe hat — planet Earth painted on a round hat, covered in blue oceans and green continents. {childName} had a hat that had a tiny gold star on top.

Mr. Zak and Shelagh arranged the class in three rows on stage. Twenty little globes on twenty little heads.

Behind the curtain, {childName} felt a heart was pounding. The gym was FULL. Hundreds of parents. Cameras. Grandparents already crying.

"I'm nervous," {childName} whispered.

Mr. Zak kneeled down. "Me too. Every time. But when we sing together, nervousness turns into magic."

Shelagh said: "Remember your actions. 'Trees of green' — sway like trees. 'Skies of blue' — point up. 'Wonderful world' — arms wide open. We'll do the actions with you."

The curtain opened. The gym went silent.

The Rainbow batch began to sing. "I see trees of green... red roses too..." Twenty voices, some loud, some whispery, all together. Mr. Zak did every action from the side. Shelagh mouthed every word from the other side.

"And I think to myself..." The class paused, then — arms wide open — "WHAT A WONDERFUL WORLD."

Some hats were crooked. One had slipped over a child's eyes. Nobody cared. It was perfect.

The final note played. Silence. Then the gym ERUPTED. Every parent standing, clapping, crying. Mr. Zak wiped his eyes.

"You were wonderful," Mummy said.

"We ALL were," {childName} said.

That night, {childName}, remember the concert. Twenty kids in homemade Earth hats sang one song — and for four minutes, every person believed the world was wonderful. You do not need to be perfect. You just need to show up and sing with your whole heart.`,
      },
      {
        id: 'rk_ep3_brickworks', episodeNumber: 3, title: 'The Field Trip to Brick Works',
        subtitle: 'The first field trip! Two classes board the yellow bus for Evergreen Brick Works.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 6,
        source: 'Rainbow Kindergarten · Episode 3',
        body: `The first REAL field trip! At 9:15, two kindergarten classes boarded the yellow school bus outside Jean Lumb Public School. Mr. Zak and Shelagh counted heads. Two parent volunteers wore orange vests.

The bus rumbled down Bayview Avenue. {childName} had wide eyes — the seats were bouncy, the windows were huge, the engine rumbled like a sleeping dinosaur.

Evergreen Brick Works appeared like a hidden world — a 130-year-old brick factory turned nature park, with ivy-covered buildings and paths disappearing into the Toronto ravines.

First: building homes with sticks. The guides said: "Animals use what nature gives them — sticks, leaves, mud. Build a shelter for a small animal!" {childName} leaned sticks against a log to make a tent shape, stuffed leaves in the gaps, and packed mud at the bottom. Mr. Zak showed how crossing sticks in an X makes roofs stronger.

After lunch came the turtle conservatory. Two real Midland Painted Turtles sat inside — dark green shells with yellow and red markings. "They lay eggs in sandy soil," the guide said. "Each egg is smaller than a grape."

"Would you like to touch one? One finger only."

{childName} reached out and touched the shell. Hard, smooth, warm. The turtle blinked slowly. "I touched a TURTLE," {childName} whispered.

The group split in two for a walk around the pond. The group spotted Turtle Island — more than thirty turtles sunbathing, piled on rocks. "They're cold-blooded," the guide said. "Even turtles know how to share."

They saw the bat house — hundreds of bats sleeping inside. "They eat thousands of mosquitoes. Best neighbours ever." Then the guide pointed at a plant with three shiny leaves. "Poison ivy. THREE leaves — let it BE!"

By 1:30, everyone was back on the bus. Tired, happy, a little muddy.

"How was it?" Mummy asked.

{childName} held up one finger. "I touched a turtle. With THIS finger. And it blinked at me."

That night, {childName}, remember the field trip. The turtles who share their sunny rocks. The bats who eat mosquitoes. The baby turtles who crawl to water all by themselves. The world is full of tiny creatures in tiny homes, right next to ours. All they need is for us to step carefully.`,
      },
    ],
  },
  {
    id: 'dr-spock-parenting',
    title: 'Dr. Spock Says',
    icon: '👨‍⚕️',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #93c5fd 100%)',
    createdBy: 'deepti.ramaul@gmail.com', creatorName: 'Deepti Ramaul', creatorUsername: 'deepti-ramaul',
    description: 'Five bedtime conversations with Dr. Spock — the world\'s most trusted baby doctor answers a parent\'s real questions about raising 3-to-5-year-olds.',
    ageRange: '3-5',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dsp_ep1_development', episodeNumber: 1, title: 'Growing So Fast',
        subtitle: 'A parent worries their child is behind. Dr. Spock reassures them.',
        tradition: 'universal', theme: 'development', durationMinutes: 2,
        value: 'wisdom',
        source: 'Dr. Spock Says · Episode 1',
        body: `"Dr. Spock, my {childName} just turned four. Other kids in class are writing their names already. Mine still scribbles. Should I be worried?"

Dr. Spock leaned back and smiled. "Trust yourself. You know more than you think you do. Every child has their own clock. Some walk at nine months, some at fifteen. Neither is better."

"But the other parents keep comparing."

"Comparing is the thief of joy. At three to five, here is what truly matters. Can your child play pretend? Build a tower of blocks? Tell you a little story about their day?"

"Oh, {childName} does all that. Talks to stuffed animals for an hour."

"That is imagination. That is the engine of everything — reading, math, friendships. It all starts with a child who can pretend a banana is a telephone."

"What about the fears? {childName} is suddenly scared of the dark."

"Completely normal. A bigger imagination means bigger fears. The dark, loud sounds, monsters under beds. Do not force your child to be brave. Sit with them. A nightlight is not a weakness — it is a kindness."

"And the questions! Why is the sky blue, why do dogs bark, why why why all day long."

Dr. Spock laughed. "That is your child building a brain, one question at a time. Answer simply and honestly. You do not need to know everything. Saying I do not know, let us find out together is one of the best things a parent can say."

"So {childName} is okay?"

"More than okay. Your child is exactly where they need to be. And so are you."

Good night, {childName}. You are growing at exactly the right speed.`,
      },
      {
        id: 'dsp_ep2_ailments', episodeNumber: 2, title: 'Sniffles and Tummy Aches',
        subtitle: 'When your child is sick — what to worry about and what to let pass.',
        tradition: 'universal', theme: 'health', durationMinutes: 2,
        value: 'wisdom',
        source: 'Dr. Spock Says · Episode 2',
        body: `"Dr. Spock, {childName} has had a runny nose for five days. I have wiped that nose a hundred times. When do I call the doctor?"

"A cold is a cold. Seven to ten days of sniffles, maybe a mild fever, a little cough. That is the body doing its job. Rest, fluids, and patience."

"But what if the fever gets high?"

"Fever is not the enemy. It is your child fighting the infection. Dress them lightly. Offer water, juice, soup. A warm bath can help. But here is when you call — if the fever stays above 102 for more than two days, or your child becomes very drowsy and hard to wake up."

"What about ear infections? Last month {childName} kept pulling at one ear and crying."

"Ah, the ear tug. After a cold, fluid can build behind the eardrum. If there is fever plus ear pain plus trouble sleeping, call your doctor. Ear infections often need medical attention."

"And stomach bugs? Last week there was so much vomiting."

"Small sips. That is the secret. Not a full glass — just a spoonful of water or clear broth every few minutes. The biggest danger with vomiting and diarrhea is dehydration. Watch for dry lips, no tears when crying, and fewer wet diapers."

"How do I know when it is serious?"

"If your gut says something is wrong, call. That is what your pediatrician is for. You are not bothering them. You are being a good parent."

"Thank you, Dr. Spock."

"Thank yourself. You stayed calm. That is the best medicine of all."

Sleep well tonight, {childName}. Your body is strong and knows how to heal.`,
      },
      {
        id: 'dsp_ep3_firstaid', episodeNumber: 3, title: 'Bumps, Burns, and Boo-Boos',
        subtitle: 'What you can handle at home — and when to rush to the ER.',
        tradition: 'universal', theme: 'safety', durationMinutes: 2,
        value: 'courage',
        source: 'Dr. Spock Says · Episode 3',
        body: `"Dr. Spock, {childName} fell off the swing today and scraped both knees. There was so much blood I almost panicked."

"Scrapes always look worse than they are. Wash gently with soap and water. Press a clean cloth on it. Once the bleeding stops, a bandage and a kiss. That is the whole treatment."

"What about the bump on the forehead last week? It swelled up like an egg."

"Bumps on the forehead bleed a lot under the skin, so they swell fast. Ice it, watch your child for a few hours. If {childName} vomits, seems confused, or the pupils look different sizes — that is when you go to the emergency room."

"And burns? {childName} touched the hot pan."

"Cool water. Not ice, not butter, not toothpaste — just cool running water for ten to fifteen minutes. If the burn is small and the skin is just red, you can manage at home. If it blisters, or if it is on the face or hands, see a doctor."

"What scares me most is choking."

"Every parent should know this. If your child is coughing hard, let them cough. The body is trying to clear it. But if they cannot cough, cannot cry, cannot breathe — five firm back blows between the shoulder blades, then five quick chest thrusts. And call for help."

"Should I keep a first aid kit?"

"Absolutely. Bandages, antiseptic cream, tweezers, a thermometer, and the number for poison control. Tape it to the inside of a cabinet."

Good night, {childName}. A few scrapes just mean you had a brave day.`,
      },
      {
        id: 'dsp_ep4_behavior', episodeNumber: 4, title: 'Big Feelings, Little Body',
        subtitle: 'Tantrums, tough questions, and the word NO — Dr. Spock explains.',
        tradition: 'universal', theme: 'behavior', durationMinutes: 2,
        value: 'patience',
        source: 'Dr. Spock Says · Episode 4',
        body: `"Dr. Spock, {childName} threw a full tantrum at the grocery store today. Screaming, kicking, on the floor. Everyone was staring."

"Let them stare. A tantrum is not bad parenting. It is a small person with big feelings and no tools to manage them yet."

"What am I supposed to do?"

"Stay calm. Do not yell back — that is two people having a tantrum. Do not give in, because that teaches your child that screaming works. Just be near them, quiet and steady. When the storm passes, hold them. Say I love you even when you are angry."

"And {childName} has started saying NO to everything."

"Good. That means your child is learning they are their own person. You do not want a child who never says no — that child will not say no to anyone. Set boundaries firmly, but pick your battles. Does it really matter if the socks do not match?"

"There is something else. {childName} asked me where babies come from."

Dr. Spock nodded. "Answer simply and honestly. A baby grows inside a mother, and when the baby is big enough, the baby comes out. That is usually all a four-year-old wants to know. If they ask more, answer more. Use real words for body parts. There is no shame in the human body."

"And the sibling fights? {childName} hit the baby."

"Jealousy is natural. Your child is not mean — they are scared of losing you. Make time for just the two of you. Say you are my first, and nothing changes that."

Good night, {childName}. Your big feelings mean you have a big heart.`,
      },
      {
        id: 'dsp_ep5_special', episodeNumber: 5, title: 'Every Child Shines',
        subtitle: 'When your child is different — Dr. Spock on disability, difference, and love.',
        tradition: 'universal', theme: 'inclusion', durationMinutes: 2,
        value: 'compassion',
        source: 'Dr. Spock Says · Episode 5',
        body: `"Dr. Spock, we just got the diagnosis. The doctor said {childName} has a developmental delay. I have not stopped crying."

"Then cry. Grief is not weakness. You are mourning the path you imagined. That is human."

"I feel guilty. Did I do something wrong?"

"You did nothing wrong. Disabilities are not punishments. They are not caused by something you ate or a thought you had. Your child is still your child — the same laugh, the same eyes, the same little hand reaching for yours."

"But what do I do now?"

"First, breathe. Then, get help early. Early intervention makes a real difference — speech therapy, occupational therapy, special education programs. The earlier you start, the more your child can grow."

"Will other kids be kind?"

"Some will, some will not. That is true for every child. What matters is that {childName} knows, every single day, that they are loved exactly as they are. Not despite who they are. Because of who they are."

"Should I treat {childName} differently?"

"Set the same expectations you would for any child — adjusted, not removed. Let your child try, let them struggle a little, let them succeed. Overprotecting a child with a disability is as harmful as neglecting one."

"I am scared I am not enough."

"No parent is enough alone. Build your team — doctors, teachers, therapists, other parents who understand. And remember what I always say. Trust yourself. You know this child better than any specialist ever will."

Good night, {childName}. You shine in your own way, and the world is brighter because of it.`,
      },
    ],
  },

  {
    id: 'little-astronaut',
    title: 'Little Astronaut',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #7c3aed 100%)',
    description: 'A child astronaut explores the solar system — each planet teaches a new lesson.',
    ageRange: '4-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'la_ep1_launch', episodeNumber: 1, title: 'Launch Day',
        subtitle: 'Today is the day. The countdown begins.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Little Astronaut · Episode 1',
        body: `The morning was still dark when {childName} woke up. Today was different from every other day. Today was Launch Day.

The space suit was laid out on the chair — white with blue stripes, a golden helmet visor, and boots that made a satisfying click-click on the floor. {childName} put it on slowly, carefully, the way Commander Luna had taught during training.

Outside, the rocket waited on the launchpad. It was enormous — taller than any building in town, silver and gleaming, with a small round window near the top. That window was for {childName}.

"Are you scared?" asked Commander Luna through the radio.

{childName} looked at the rocket. At the sky above it, still full of stars. "A little," {childName} whispered.

"Good," Commander Luna said. "Every astronaut who ever flew was scared before launch. The ones who weren't scared weren't paying attention. Fear means you understand how big this is."

{childName} climbed the ladder. One rung at a time. The metal was cold through the gloves. At the top, a small door opened into a cozy cabin — one seat, one window, one control panel with a big green button labeled GO.

"Mission control to Little Astronaut. All systems are green. The solar system is waiting for you."

{childName} strapped in. Took a deep breath. Looked at the green button.

"Ten... nine... eight..."

{childName}'s heart was beating so loud it sounded like a drum inside the helmet.

"Three... two... one..."

{childName} pressed the button.

The rocket shook. The ground disappeared. The sky turned from blue to black in thirty seconds. And then — silence. Beautiful, endless silence. Stars everywhere, like someone had spilled a jar of glitter across black velvet.

{childName} looked down through the window. Earth was a blue marble, glowing softly, getting smaller and smaller.

"I did it," {childName} whispered.

"You did," Commander Luna said. "And the journey has only just begun."

That night, remember Launch Day. The hardest part of any adventure is pressing the button. Once you do, the stars are yours. Courage is not the absence of fear — it is pressing GO anyway. Goodnight, little astronaut.`,
      },
      {
        id: 'la_ep2_moon', episodeNumber: 2, title: 'Walking on the Moon',
        subtitle: 'The Moon is quiet. Too quiet. {childName} learns to listen.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Little Astronaut · Episode 2',
        body: `The Moon grew larger and larger through the window until it filled the entire view — grey and cratered and ancient. {childName} landed with a gentle bump, and the dust rose in slow motion, floating like tiny feathers before settling back down.

{childName} opened the hatch and stepped outside. The first footprint pressed into the grey dust with a soft crunch. No wind. No birds. No cars or music or voices. Just silence.

"Commander Luna? It's so quiet here."

"The Moon has no atmosphere," Commander Luna said through the radio. "No air means no sound can travel. You're in the quietest place any human has ever stood."

{childName} walked across the surface. Each step was a bounce — the Moon's gravity was so gentle that every step felt like floating. It was fun at first. Bounce, bounce, bounce.

But after a while, the silence pressed in. {childName} was used to noise — the hum of the refrigerator, birds outside the window, Mummy's voice from the kitchen. Here, there was nothing.

"I don't like it," {childName} said. "It's too empty."

"Wait," Commander Luna said. "Sit down. Close your eyes. And listen — not with your ears. With your heart."

{childName} sat on a Moon rock and closed both eyes. At first — nothing. Then, slowly, something. A hum. Deep and low, like the Moon itself was breathing. The vibration of ancient rock. The whisper of starlight hitting dust.

"I can feel something," {childName} said.

"That's the Moon's patience. It has been sitting here for four billion years, quiet and steady, waiting for someone to visit. It never rushed. It never complained. It just waited."

{childName} sat for a long time. Longer than ever before without fidgeting or talking or reaching for a toy. Just sitting. And in that stillness, something magical happened — {childName}'s thoughts slowed down. The worries about the journey ahead faded. There was only now. Only here. Only the Moon and one small astronaut.

"Thank you, Moon," {childName} whispered.

The Moon didn't answer. But {childName} felt it smile.

That night, {childName}, remember the quiet Moon. Sometimes the best thing you can do is stop, sit, and listen to the silence. Patience isn't doing nothing — it's letting the world speak when you stop talking. Goodnight, little astronaut.`,
      },
      {
        id: 'la_ep3_mars', episodeNumber: 3, title: 'The Mars Garden',
        subtitle: 'Nothing grows on Mars. Until {childName} plants a seed.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Little Astronaut · Episode 3',
        body: `Mars was red. Everything was red. The sky, the rocks, the dust, the mountains in the distance. {childName} stepped out of the rocket and felt the crunch of iron-rich soil under those space boots.

"It's beautiful," {childName} said. "But also... sad. Nothing is alive here."

"Not yet," Commander Luna said. "But you brought something, remember?"

{childName} reached into the suit pocket and pulled out a small sealed bag. Inside were five seeds — tomato, basil, sunflower, lettuce, and one mystery seed nobody could identify.

"Astronauts on Mars will need to grow food," Commander Luna explained. "These seeds are your experiment. Plant them in the greenhouse dome."

The greenhouse was a clear bubble on the Martian surface, filled with Earth soil and a misting system. {childName} dug five small holes, placed one seed in each, covered them gently, and added water.

"Now what?" {childName} asked.

"Now you share. The water is limited. The sunlight is weaker here. You'll need to decide — do you give each seed the same amount? Or give more to the ones that grow fastest?"

{childName} thought about this. It would be easy to pour all the water on the tomato — it sprouted first, green and eager. The mystery seed showed nothing. No sprout. No movement. Just dirt.

But {childName} divided the water equally. Every seed got the same share. "They all deserve a chance," {childName} said.

Days passed. The tomato grew tall. The basil smelled wonderful. The lettuce spread wide. The sunflower reached toward the Martian sun.

And the mystery seed? Nothing. Until the very last morning on Mars.

{childName} checked the mystery pot and gasped. Overnight, a small tree had burst from the soil — barely six inches tall, but covered in tiny golden flowers that glowed in the dim Martian light. It was the most beautiful plant anyone had ever seen.

"What is it?" {childName} asked.

Commander Luna was silent for a moment. "I have no idea. But I think it's the kind of thing that only grows when someone doesn't give up on it."

That night, {childName}, remember the Mars garden. Share what you have — even with the things that don't seem to be growing yet. Some seeds take longer. Some miracles need patience. And the ones nobody believes in might bloom the brightest. Goodnight, little astronaut.`,
      },
      {
        id: 'la_ep4_saturn', episodeNumber: 4, title: 'Saturn\'s Ring Race',
        subtitle: 'The ice chunks of Saturn challenge {childName} to a race — and a riddle.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Little Astronaut · Episode 4',
        body: `Saturn appeared through the window like a painting — golden and massive, wrapped in rings that sparkled like a billion tiny diamonds. As {childName}'s rocket drew closer, those rings came into focus: they weren't solid at all. They were millions of chunks of ice and rock, spinning endlessly around the giant planet.

"Can I fly through the rings?" {childName} asked.

"Carefully," Commander Luna said. "Very, very carefully."

{childName} guided the rocket into the rings. Ice chunks drifted past the window — some as small as snowballs, some as big as houses. They moved in a slow, graceful dance, spinning and tumbling but never crashing.

Then a voice came through the radio. Not Commander Luna's. Something older.

"Welcome, little one. I am Saturn. I have been spinning here for four and a half billion years. Would you like to play a game?"

{childName}'s eyes went wide. "The planet is talking to me?"

"Everything speaks if you listen long enough," Saturn said with a deep, rumbling laugh. "Here is my game. A race. You fly from this ring to the outer ring. If you go fast, you'll crash into the ice. If you go slow, you'll drift off course. The question is: what is the right speed?"

{childName} thought. Fast was dangerous. Slow was useless. What was in between?

"The right speed," {childName} said slowly, "is the speed where I can see what's coming."

Saturn's rings shimmered. "Wise answer. Most visitors say fastest or slowest. You said clearest. Begin."

{childName} flew. Not the fastest. Not the slowest. But with eyes wide open, adjusting for each ice chunk, turning gently past the big ones, gliding under the small ones. The rings whizzed past in a blur of silver and blue.

At the outer ring, {childName} stopped. The view was breathtaking — Saturn below, its rings stretching to infinity, and beyond them, the deep darkness of the outer solar system.

"You finished," Saturn said. "Not first. Not last. But you saw everything along the way. That is wisdom, little astronaut. Speed shows everyone where you're going. But only wisdom shows you what you passed."

{childName} sat quietly, watching Saturn's rings turn slowly in the starlight.

That night, {childName}, remember Saturn's riddle. Life is not a race to finish first. It's a journey to see clearly. The right speed is the one where you notice the beauty you're flying through. Goodnight, little astronaut.`,
      },
      {
        id: 'la_ep5_home', episodeNumber: 5, title: 'Coming Home',
        subtitle: 'The solar system is behind. Earth is ahead. But {childName} is not the same.',
        tradition: 'universal', theme: 'gratitude', durationMinutes: 5,
        source: 'Little Astronaut · Episode 5',
        body: `The rocket turned toward home. Behind {childName}: the Moon, Mars, Saturn, and a trail of memories stretching across the solar system. Ahead: a small blue dot, growing larger with every passing hour.

Earth.

{childName} had been gone for what felt like a lifetime. The silence of the Moon. The red dust of Mars. The glittering rings of Saturn. Each planet had given a gift — patience, sharing, wisdom. But now, watching Earth grow in the window, {childName} felt something new. Something warm and heavy in the chest, like a hug from the inside.

"Commander Luna? I think I miss home."

"Of course you do. That's the point of leaving."

"What do you mean?"

"You had to go far away to understand what you had close by. Every astronaut comes back changed. Not because space is so amazing — though it is. But because it makes you see Earth differently."

{childName} pressed against the window. The clouds swirled white over blue oceans. Green patches of forests. Brown mountains. Tiny sparkles of cities at night.

"It's so small," {childName} said.

"And so precious," Commander Luna replied. "One planet. One home. For every person, every animal, every tree, every raindrop. Everything you love is on that little marble."

The rocket began its descent. The heat shield glowed orange. The cabin shook. {childName} gripped the seat, remembering how scary Launch Day had been. But this time, the fear was different. It wasn't fear of the unknown. It was excitement to return.

The parachute opened. The shaking stopped. The rocket splashed into the ocean with a great WHOOSH of water and foam.

The hatch opened. Warm air rushed in — real air, with the smell of salt and seaweed and distant rain. Birds cried overhead. Waves lapped at the rocket's sides.

{childName} climbed out and stood on the rescue boat, looking up at the sky. The same sky. But {childName} was not the same.

"Welcome home, Little Astronaut," Commander Luna said.

{childName} took a deep breath of Earth air and smiled. "Thank you. For everything."

That night, {childName}, remember coming home. You went to the Moon and learned patience. You went to Mars and learned sharing. You went to Saturn and learned wisdom. But the biggest lesson was the last one: gratitude. Everything you need, everything you love, is already here. Right here. On this beautiful blue marble we call home. Goodnight, little astronaut. Welcome back.`,
      },
    ],
  },

  {
    id: 'who-would-win-series',
    title: 'Who Would Win?',
    icon: '⚔️',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #fdba74 100%)',
    description: 'Professor Puzzle hosts five legendary debates — who would REALLY win?',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'www_ep1_lion_eagle', episodeNumber: 1, title: 'Lion vs Eagle',
        subtitle: 'The king of the jungle meets the queen of the sky.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Who Would Win? · Episode 1',
        body: `"Welcome, welcome, WELCOME!" Professor Puzzle adjusted his enormous spectacles and tapped his chalkboard with a long wooden pointer. "I am Professor Puzzle, and THIS is Who Would Win — the show where we settle the great debates of the animal kingdom!"

The audience — a packed forest clearing full of rabbits, deer, frogs, and one very sleepy owl — cheered.

"Tonight's matchup: LION versus EAGLE! The king of the jungle against the queen of the sky!"

Lion strutted in from the left, his golden mane flowing. He roared once, shaking the leaves off three trees. The rabbits fainted.

Eagle soared in from above, her wings spanning six feet, talons gleaming like silver hooks. She landed on a high branch and stared down at Lion with fierce golden eyes.

"Lion!" Professor Puzzle said. "State your case."

"I am the strongest," Lion said. "I can take down animals ten times my size. My roar can be heard five miles away. I am built for power."

"Eagle! Your turn."

"I can see a mouse from two miles up," Eagle said. "I fly at 150 miles per hour. I strike from above where no one can reach me. The sky is mine."

Professor Puzzle stroked his chin. "Interesting. Lion, you rule the ground. Eagle, you rule the air. But what happens when the ground and the sky meet?"

He told them a story. Last winter, a great storm had knocked a baby deer into a ravine. Lion had found it but couldn't climb down — the walls were too steep. Eagle had spotted it from above but couldn't lift it — the fawn was too heavy.

"What did you do?" Professor Puzzle asked.

Lion and Eagle looked at each other. They remembered now. Eagle had flown down and guided the fawn to a narrow ledge. Lion had reached his great paw down from the top and pulled it up.

Together. Neither could have done it alone.

"So who would win?" Professor Puzzle asked the audience.

The sleepy owl opened one eye and said: "They both would. If they work together."

Professor Puzzle smiled and wrote on his chalkboard: WINNER — TEAMWORK.

"That's our answer tonight! The strongest on the ground and the fastest in the sky are both unstoppable — but only when they stop competing and start cooperating."

That night, {childName}, remember Lion and Eagle. It doesn't matter who is stronger or faster. What matters is who is wise enough to work together. Goodnight, champion.`,
      },
      {
        id: 'www_ep2_ant_elephant', episodeNumber: 2, title: 'Ant vs Elephant',
        subtitle: 'The tiniest creature faces the biggest. Size is not what you think.',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'Who Would Win? · Episode 2',
        body: `"Welcome back to Who Would Win!" Professor Puzzle polished his spectacles and grinned. "Tonight's matchup is our most UNEVEN yet. In one corner: ELEPHANT — twelve thousand pounds, fourteen feet tall, tusks like swords. In the other corner: ANT — one millionth of an ounce, smaller than a grain of rice."

The audience gasped. A few mice laughed nervously. This was going to be a very short debate.

Elephant stomped in. The ground trembled. Trees swayed. He raised his trunk and trumpeted so loudly that Professor Puzzle's chalkboard cracked.

Ant walked in. Nobody saw her. She was on Professor Puzzle's shoe.

"Elephant! Why would you win?"

"Look at me," Elephant said. "I am the largest land animal on Earth. I can push down trees. I have no predators. One step and this debate is over."

"Ant! Why would you win?"

The audience leaned in. They couldn't hear anything. Professor Puzzle held up a tiny microphone.

"I can carry fifty times my own body weight," Ant said in a voice like a whisper. "Can you, Elephant?"

Elephant blinked. Fifty times his weight would be... six hundred thousand pounds. No. He couldn't.

"I have a colony of ten thousand sisters," Ant continued. "We build cities underground with air conditioning, nurseries, and food storage. We've been doing it for a hundred million years. Before elephants even existed."

The audience murmured. Professor Puzzle raised his pointer.

"Let me tell you what happened last month at the watering hole," he said. "Elephant was drinking, and he didn't notice the crack in the dam. The water was about to burst through and flood the valley."

Elephant nodded, embarrassed.

"But Ant's colony noticed. Ten thousand ants packed mud into the crack all night long. Tiny mouthful by tiny mouthful. By dawn, the dam was sealed. And Elephant — and the entire valley — was safe."

"I didn't even know," Elephant said quietly.

"That's the point," Ant said. "You don't have to know. We do our work whether anyone sees it or not."

Professor Puzzle wrote on his chalkboard: WINNER — THE ONE YOU NEVER SEE COMING.

"Size impresses. But consistency — showing up, doing the small work, day after day, with no applause — that's what saves the valley."

That night, {childName}, remember the ant. You don't have to be the biggest or the loudest. The small things you do every day — the kind words, the tiny helps, the quiet efforts — those are what hold the world together. Goodnight, champion.`,
      },
      {
        id: 'www_ep3_sun_wind', episodeNumber: 3, title: 'Sun vs Wind',
        subtitle: 'Who is more powerful — the one who pushes or the one who warms?',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Who Would Win? · Episode 3',
        body: `"Tonight on Who Would Win," Professor Puzzle announced, "we leave the animal kingdom behind! Our contestants are FORCES OF NATURE. On one side: WIND — invisible, unstoppable, capable of flattening cities. On the other side: SUN — a ball of fire ninety-three million miles away, powering all life on Earth."

Wind arrived first. The audience couldn't see him, but they felt him — a cold gust that knocked over three chairs and sent Professor Puzzle's notes flying across the clearing.

Sun arrived next. She didn't crash in. She simply... appeared. The clearing grew warm. The flowers opened. The audience tilted their faces up and sighed.

"Here's the contest," Professor Puzzle said. "See that traveller on the road?" He pointed to a figure walking along a dusty path, wearing a heavy coat. "Whoever can get the traveller to remove his coat — wins."

Wind laughed. "Easy. Watch this."

Wind blew. Hard. The trees bent sideways. Leaves flew like confetti. The traveller's coat flapped wildly. Wind blew harder — a howling, screaming gale that would terrify anyone.

But the traveller pulled his coat TIGHTER. The harder Wind blew, the more desperately the man clung to his coat. He bent forward, head down, gripping the buttons with white knuckles.

"My turn," Sun said quietly.

She simply shone. Gently at first, then warmer. The clouds parted. The air softened. The traveller stopped hunching. He loosened a button. Then another. He looked up at the golden sky and smiled. Then he took off his coat, folded it over his arm, and walked on, whistling.

Wind was furious. "That's not POWER! That's just... warmth!"

Professor Puzzle wrote on his chalkboard: WINNER — WARMTH OVER FORCE.

"Wind, you are powerful. No one doubts that. You can flatten forests and raise seas. But you could not make one man unbutton his coat. Because force makes people hold on tighter to what they have."

"And Sun?" Wind asked.

"Sun made him WANT to let go. That's not weakness. That's the deepest kind of strength — the kind that changes people from the inside."

The audience was quiet. Even Wind was still for a moment.

"Kindness," Professor Puzzle said, "is warmer than any argument is loud. And it works every single time."

That night, {childName}, remember Sun and Wind. When you want someone to change, don't push harder. Be warmer. Kindness opens what force cannot. Goodnight, champion.`,
      },
      {
        id: 'www_ep4_brain_muscle', episodeNumber: 4, title: 'Brain vs Muscle',
        subtitle: 'Can thinking ever beat pure strength?',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Who Would Win? · Episode 4',
        body: `"Welcome to our MOST controversial episode!" Professor Puzzle hopped with excitement, nearly losing his spectacles. "Tonight: BRAIN versus MUSCLE! Thinking versus Doing! The mind against the body!"

Brain arrived as a small owl named Minerva — quiet, grey-feathered, perched on a stack of books. She blinked calmly.

Muscle arrived as a mighty gorilla named Titan — three hundred pounds of pure strength. He beat his chest once and the ground shook. The rabbits fainted again.

"Here's the challenge," Professor Puzzle said. He pointed to an enormous boulder blocking the path to the river. "The village needs water. That boulder has blocked the path for a hundred years. Whoever moves it — wins."

Titan cracked his knuckles. "Stand back." He pushed. He shoved. He roared and threw his entire weight against the boulder. It moved — maybe an inch. He pushed again. Two inches. His arms trembled. Sweat poured down his silver fur.

After twenty minutes, the boulder had moved about a foot. The path was still blocked. Titan collapsed, exhausted.

"My turn," Minerva said.

She flew around the boulder three times, studying it from every angle. Then she landed on top and tapped it with one small claw.

"There's a crack here," she said. "Running from top to bottom. If we pour water into this crack tonight, it will freeze, expand, and split the boulder in two by morning."

The animals filled the crack with water from the stream. By dawn, just as Minerva predicted, the boulder had split cleanly in half. The two pieces rolled apart easily. The path was open.

Titan stared. "That's not fair. You didn't even push."

"I didn't need to," Minerva said. "I looked first."

Professor Puzzle wrote on his chalkboard: WINNER — THE ONE WHO LOOKS BEFORE PUSHING.

"Titan, your strength is magnificent. The world needs strong hands. But Minerva solved in one night what strength couldn't solve in a hundred years. The lesson is not that brains beat muscles. The lesson is that thinking FIRST and pushing SECOND beats pushing first and thinking never."

Titan sat quietly for a moment. Then he looked at Minerva. "Could you teach me to look at problems like that?"

Minerva smiled. "Could you teach me to push when looking isn't enough?"

"Deal," they said together.

That night, {childName}, remember Brain and Muscle. You have both inside you — a mind that thinks and a body that acts. Use them together. Think first, then push. That's how boulders move. Goodnight, champion.`,
      },
      {
        id: 'www_ep5_ocean_mountain', episodeNumber: 5, title: 'Ocean vs Mountain',
        subtitle: 'The final debate — who is truly mightier?',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'Who Would Win? · Episode 5',
        body: `"This is it!" Professor Puzzle's voice cracked with emotion. "The FINAL episode of Who Would Win! And for our last debate, I have chosen the two greatest forces on Earth. OCEAN — covering seventy percent of our planet, deeper than any mountain is tall. And MOUNTAIN — ancient, immovable, touching the sky."

Ocean spoke first. Her voice was like waves — sometimes a whisper, sometimes a roar. "I am everywhere. I carry ships across the world. I hold more life in my depths than all the land combined. I shaped the coastlines. I carved the cliffs. Everything bows to water."

Mountain spoke next. His voice was like rumbling stone — slow and deep. "I have stood for two hundred million years. Earthquakes could not break me. Storms could not move me. Civilizations have risen and fallen while I watched from above. I am patience made solid."

Professor Puzzle stroked his chin. "Ocean, you are powerful. Mountain, you are enduring. But let me ask you both something. Are you enemies?"

They were silent.

"Think carefully," Professor Puzzle said. "Ocean, where does your rain come from?"

"The clouds carry it to... the mountains. The mountains catch the clouds and send the rain into rivers that flow back to me."

"Mountain, where does the soil that feeds your forests come from?"

"The rivers carry minerals from... the ocean floor. The ocean feeds the rivers that feed my soil."

Professor Puzzle smiled. "You are not opponents. You are partners. The ocean feeds the mountain. The mountain feeds the ocean. You've been helping each other for millions of years — and you didn't even realize it."

Ocean's waves grew still. Mountain's stones creaked softly.

"So who wins?" asked the owl in the audience.

Professor Puzzle put down his pointer. He took off his spectacles and cleaned them slowly. Then he wrote on his chalkboard for the very last time: WINNER — NOBODY. BECAUSE THERE WAS NEVER A FIGHT.

"The greatest truth I've learned in five debates," Professor Puzzle said quietly, "is that the world is not a competition. Lion needs Eagle. Ant needs Elephant. Sun needs Wind. Brain needs Muscle. And Ocean needs Mountain. The moment you stop asking who would win and start asking how can we help each other — that's when everyone wins."

The audience was quiet. Then, slowly, every animal in the clearing began to clap. The rabbits, the deer, the frogs, and the sleepy owl — who was wide awake now, crying a tiny owl tear.

That night, {childName}, remember Professor Puzzle's final lesson. Life is not about winning against someone. It's about winning WITH someone. The strongest force in the world is not the ocean or the mountain. It's two things that need each other, finally realizing it. Goodnight, champion.`,
      },
    ],
  },

  {
    id: 'camping-outdoors',
    title: 'Camping & Outdoors',
    icon: '⛺',
    gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #86efac 100%)',
    description: 'A family goes camping for 5 nights — each night a different adventure and lesson.',
    ageRange: '4-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'co_ep1_setup', episodeNumber: 1, title: 'Setting Up Camp',
        subtitle: 'The family arrives. The tent has other plans.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Camping & Outdoors · Episode 1',
        body: `The car turned off the highway onto a bumpy dirt road, and {childName}'s heart jumped. Trees — hundreds of them — rose on both sides like a green tunnel. The air coming through the open window smelled different out here. Not like home. Like pine and earth and something wild.

"We're here!" Daddy said, parking beside a wooden sign that read CAMPSITE 14 — LAKESIDE.

{childName} tumbled out of the car and stared. A clearing surrounded by tall pine trees. A stone fire pit in the center. And beyond the trees — a lake, dark blue and perfectly still, reflecting the clouds like a mirror.

"First things first," Mummy said, pulling a big canvas bag from the trunk. "We set up the tent."

It looked easy in the videos. In real life, the tent had seventeen poles, forty-two clips, and a rainfly that seemed designed by someone who hated camping. Daddy connected two wrong poles and the whole thing collapsed like a sad pancake.

{childName} giggled. Daddy laughed too. "Okay, let's try again."

{childName} held the poles while Mummy clipped the fabric. Daddy hammered the stakes into the soft ground. It took three tries. The tent was a little lopsided — one side drooped more than the other — but it stood.

"It's not perfect," Daddy said.

"It's ours," {childName} said.

Inside, they unrolled sleeping bags. {childName}'s was blue with silver stars. The floor of the tent was bumpy with roots and pebbles, nothing like a bedroom floor. It smelled like canvas and adventure.

"Are there bears?" {childName} asked.

"Maybe," Mummy said. "But they don't want to meet us any more than we want to meet them. We'll keep our food in the car and they'll keep to themselves."

That first evening, they sat on a log and watched the sun set over the lake. The sky turned orange, then pink, then deep purple. Stars appeared one by one, like someone was turning on tiny lights across the ceiling of the world.

"It's so dark," {childName} whispered.

"It's not dark," Daddy said. "Look up. There are more stars here than we've ever seen. The city hides them. Out here, you see the truth — the sky is full of light. You just have to leave the city to see it."

{childName} lay back on the log and stared up at a thousand stars. The tent was lopsided. The ground was bumpy. There might be bears.

It was perfect.

That night, {childName}, remember setting up camp. Not everything has to be perfect to be wonderful. A lopsided tent, a bumpy floor, and a sky full of stars is more than enough. Goodnight, little camper.`,
      },
      {
        id: 'co_ep2_night_sounds', episodeNumber: 2, title: 'The Night Sounds',
        subtitle: 'Strange sounds in the forest. {childName} learns to listen instead of fear.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Camping & Outdoors · Episode 2',
        body: `The second night at camp, {childName} couldn't sleep. The sleeping bag was warm enough. The pillow was fluffed. But the sounds — the SOUNDS — were nothing like home.

At home, there was the hum of the fridge, the tick of the clock, maybe a car passing on the street. Here, the forest was alive with noises {childName} had never heard before.

CRACK. Something stepped on a branch.

{childName}'s eyes flew open. "Mummy?"

Mummy was awake too, propped on one elbow. "I heard it. Probably a raccoon."

Then: WHOO-WHOOO. Low and hollow, echoing through the trees.

"What was THAT?" {childName} clutched the sleeping bag.

"An owl," Daddy murmured sleepily. "A great horned owl. She's hunting mice."

{childName} lay still, heart thumping. Then another sound — a long, high, wavering cry that rose and fell like singing. It was beautiful and eerie at the same time.

"Loons," Mummy said. "On the lake. They call to each other at night. Listen — there's an answer."

And there was — a second loon, farther away, calling back. Two birds, singing across the dark water.

{childName} stopped clutching the sleeping bag. The sounds were still strange. But knowing what they were changed everything. The crack was just a raccoon — probably looking for dropped marshmallows. The hoot was a mother owl feeding her babies. The cry was two birds saying goodnight to each other.

"It's like the forest is talking," {childName} whispered.

"It is," Mummy said. "It talks all the time. We just can't hear it in the city."

{childName} closed both eyes and listened. Really listened. The rustle of wind through pine needles — like someone gently shaking a thousand tiny bells. The soft lap of water on the lakeshore. A frog chorus, deep and rhythmic, like a heartbeat.

The forest wasn't scary. It was busy. Full of creatures doing exactly what {childName}'s family was doing — settling in, calling to loved ones, getting ready to sleep.

"The forest is going to bed too," {childName} said.

"It is," Mummy said. "And it's been doing this every night for thousands of years. Long before any of us were here."

{childName} fell asleep to the loon's lullaby, the owl's gentle hoot, and the soft breathing of the forest.

That night, {childName}, remember the night sounds. Fear comes from not understanding. But when you stop and listen — really listen — the scary becomes beautiful. Every strange sound has a story. You just have to be patient enough to hear it. Goodnight, little camper.`,
      },
      {
        id: 'co_ep3_river', episodeNumber: 3, title: 'The River Crossing',
        subtitle: 'The trail leads to a river. There is no bridge.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 5,
        source: 'Camping & Outdoors · Episode 3',
        body: `On the third morning, the family went hiking. The trail wound through the forest, past mushrooms growing on fallen logs, past a woodpecker hammering on a dead tree, past a chipmunk who watched them with huge, suspicious eyes.

Then the trail ended at a river.

It wasn't a huge river. Maybe fifteen feet across. But the water was moving fast — clear enough to see the round stones on the bottom, but swift enough that small sticks were carried downstream in seconds.

"The map says the trail continues on the other side," Daddy said, frowning. "But there's no bridge."

{childName} looked at the water. It was knee-deep in the middle — deeper than home, shallower than a pool. The stones underneath were round and slippery-looking.

"I can do it," {childName} said. Then, quieter: "I think."

Mummy tested the water with her boot. "Cold but not deep. Here's what we do. We go together. One at a time. Find a stick to balance with. Step on the biggest, flattest rocks. And if you slip — sit down. Don't fight the water. Let it hold you."

Daddy went first, a long branch in his hand, stepping slowly from rock to rock. The water pushed at his legs. He wobbled twice but made it across, dripping and grinning.

{childName}'s turn. The first step was the hardest. The water was COLD — shockingly cold — rushing against {childName}'s shins like it was trying to push them back. The rocks were slippery but flat. {childName} planted the stick, found a good rock, and stepped.

Step. Balance. Step. Balance. In the middle, the current was strongest. {childName}'s foot slipped. The stick wobbled. For one terrifying second, everything tilted.

Then {childName} remembered: sit down. Don't fight. {childName} sat right down in the river. The water rushed around — cold, fast, but not dangerous. Just wet.

"I'm okay!" {childName} called out, laughing. Soaking wet, sitting in a river, laughing.

Mummy helped {childName} up from the other side. The three of them stood on the far bank, dripping, shoes squelching, and burst out laughing together.

The trail on the other side led to a waterfall — a secret one, hidden in the forest, water cascading down moss-covered rocks into a crystal-clear pool. They never would have found it without crossing the river.

That night, {childName}, remember the river crossing. The best things in life are on the other side of something that scares you. You might slip. You might sit down in the cold water. But you'll stand up laughing. And the waterfall is always worth it. Goodnight, little camper.`,
      },
      {
        id: 'co_ep4_campfire', episodeNumber: 4, title: 'Campfire Stories',
        subtitle: 'The family shares stories around the fire. Each one is a gift.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Camping & Outdoors · Episode 4',
        body: `The fourth night was campfire night. Daddy built the fire carefully — crumpled newspaper at the bottom, then small twigs, then bigger sticks, then a log on top. He struck a match and held it to the paper. A tiny flame caught, flickered, and grew.

{childName} watched the fire grow from a whisper to a roar. Orange and yellow and sometimes blue at the base. Sparks flew upward like tiny fireflies, disappearing into the dark sky.

Mummy brought out marshmallows. {childName} held one on a long stick over the flames, watching it turn golden brown on the outside while the inside became gooey and sweet. The first one caught fire. The second one was perfect.

"Campfire stories," Daddy said, settling into his camp chair. "That's the tradition. Everyone tells one story."

Mummy went first. She told about the time she was little — six years old — and got lost in a department store. She hid inside a circular clothes rack, surrounded by winter coats, and cried until a kind security guard found her. "He gave me a lollipop and called my mother on the loudspeaker," Mummy said. "I've never been so happy to hear my mother's voice."

Daddy went next. He told about his grandfather, who came to this country with one suitcase and seven words of English. "He got a job washing dishes. He learned English from the radio. Twenty years later, he owned the restaurant." Daddy's voice cracked a little. "He always said: start where you are, use what you have, do what you can."

Now it was {childName}'s turn. The fire crackled. The lake was still. The stars were out.

"I don't have a big story," {childName} said.

"The best stories aren't big," Mummy said. "They're real."

{childName} thought for a moment. "Today, when I crossed the river and slipped and sat down in the water — I was really scared. But then I was laughing. And I think... I think that's what brave is. Being scared and then laughing anyway."

The fire popped. An ember floated up. Mummy and Daddy were quiet for a moment.

"That," Daddy said softly, "is the best campfire story I've ever heard."

They sat together, the three of them, watching the fire burn down to glowing coals. No phones. No screens. No distractions. Just a family, a fire, and the stories that hold them together.

That night, {childName}, remember campfire stories. Everyone has one. Your grandmother, your teacher, the person at the grocery store. Everyone is carrying a story inside them. And when you share yours — even a small one — you give someone a gift they'll keep forever. Goodnight, little camper.`,
      },
      {
        id: 'co_ep5_sunrise', episodeNumber: 5, title: 'The Sunrise Hike',
        subtitle: 'The last morning. The family climbs to see the sunrise.',
        tradition: 'universal', theme: 'gratitude', durationMinutes: 5,
        source: 'Camping & Outdoors · Episode 5',
        body: `The alarm buzzed at 4:30 AM. Still dark. Still cold. {childName} groaned and pulled the sleeping bag over both ears.

"Come on," Mummy whispered. "Trust me. This is the best part of the whole trip."

They dressed in the dark — warm layers, hiking boots, headlamps strapped to foreheads. The beams cut through the pre-dawn mist as they started up the trail behind the campsite.

The forest was different in the dark. Every shadow was a mystery. Every sound was amplified. But {childName} wasn't scared — not after the night sounds, not after the river crossing. The forest was a friend now.

The trail climbed steeply. {childName}'s legs burned. Daddy carried the backpack with hot chocolate and muffins. Mummy led the way, her headlamp bobbing like a firefly.

"Almost there," Mummy said.

The trail opened onto a rocky summit. Below, the whole valley was visible — the lake, their campsite (the lopsided tent was a tiny triangle), the river they had crossed, and miles of forest stretching to the horizon.

The sky was grey. Then purple. Then a thin line of orange appeared at the edge of the world.

"Watch," Mummy said.

The orange line grew. It spread like paint across the sky — orange to pink to gold. The clouds caught fire, glowing from underneath. The lake below turned from black to silver to blue.

And then the sun appeared. Just the top edge at first — a sliver of pure light. Then half. Then the whole burning circle rose above the trees, and the world exploded with colour.

{childName} didn't say anything. Neither did Mummy or Daddy. They just stood there, three small figures on a rocky hilltop, watching the sky do something it had done every morning for billions of years — and yet, somehow, it felt like the first time.

Daddy poured hot chocolate. They wrapped their hands around the warm cups and sat on the rocks, feet dangling over the edge, watching the valley come alive. Birds began to sing. Mist rose off the lake in swirling ribbons. A deer stepped out of the treeline below and drank from the water's edge.

"I don't want to go home," {childName} said.

"You're taking all of this with you," Mummy said. "The stars, the loon song, the river, the campfire, and this sunrise. They live in you now."

{childName} took a sip of hot chocolate and looked at the sun, fully risen now, warming everything it touched.

"Thank you," {childName} said. Not to Mummy or Daddy. To the forest. To the lake. To the sunrise. To the whole beautiful, wild, imperfect trip.

That night, {childName}, remember the sunrise hike. The best things require waking up early and climbing in the dark. But when you reach the top and the light comes — you'll understand why. Gratitude is not just saying thank you. It's standing on a mountain and knowing, deep in your bones, that this moment is enough. Goodnight, little camper.`,
      },
    ],
  },

  {
    id: 'music-lessons',
    title: 'Music Lessons',
    icon: '🎵',
    gradient: 'linear-gradient(135deg, #86198f 0%, #d946ef 50%, #f0abfc 100%)',
    description: 'Five instruments, five lessons — music teaches what words cannot.',
    ageRange: '3-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ml_ep1_drum', episodeNumber: 1, title: 'The Drum That Was Too Loud',
        subtitle: 'Boom the drum loves making noise. But nobody wants to listen.',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'Music Lessons · Episode 1',
        body: `Boom was a big red drum with shiny brass edges and the loudest voice in the entire music room. When Boom played, the walls shook. The windows rattled. The sheet music flew off the stands.

And Boom LOVED it.

"LISTEN TO ME!" Boom would shout, banging away — BOOM BOOM BOOM BOOM — during every song, every rehearsal, every quiet moment.

The other instruments tried to speak up. Flute played a gentle melody. "Could you please play a little softer—"

"WHAT? I CAN'T HEAR YOU!" BOOM BOOM BOOM.

Piano tried a delicate passage. The notes were like raindrops — light and clear and beautiful. But Boom drowned them out. BOOM BOOM BOOM.

"Nobody can hear us," Piano whispered to Guitar. "He's too loud."

One by one, the instruments stopped playing. Flute put herself back in her case. Piano closed her lid. Guitar leaned against the wall, silent. Violin hung her bow on a hook.

Boom kept playing. BOOM BOOM BOOM. But something was wrong. The music sounded... empty. Loud but hollow. Like shouting into an empty room.

"Where is everyone?" Boom asked, finally stopping.

Silence.

Old Cello, who had been watching from the corner, spoke in his deep, warm voice. "They left because you wouldn't let them be heard. A drum's job is not to be the loudest. It's to give everyone else a rhythm to follow."

"But I'm a DRUM. I'm SUPPOSED to be loud."

"You're supposed to be steady," Cello said. "A heartbeat is not loud. But without it, the body dies. That's what a drum is — the heartbeat of the music."

Boom sat quietly for a long time. Then he played. Softly. tap... tap... tap... A simple, steady beat. Like a heart.

Flute peeked out of her case. Piano opened her lid. Guitar straightened up. One by one, they came back. And this time, they played together — Flute soaring, Piano dancing, Guitar strumming, Violin singing — all held together by Boom's gentle, steady beat.

The music was more beautiful than anything Boom had ever heard. And for the first time, Boom realized something: the best sound he could make was the one that helped everyone else be heard.

That night, {childName}, remember Boom the drum. Being the loudest in the room doesn't make you the most important. Knowing when to be quiet, when to be steady, when to let others shine — that's the real music. Goodnight, little musician.`,
      },
      {
        id: 'ml_ep2_violin', episodeNumber: 2, title: 'The Shy Violin',
        subtitle: 'Viola has a beautiful voice. But she is too scared to play.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Music Lessons · Episode 2',
        body: `Viola the violin had the most beautiful voice in the music room. When she played alone — late at night, when she thought nobody was listening — the notes floated like silk ribbons, rising and falling with a sadness and sweetness that could make you cry.

But Viola never played when anyone was watching.

During rehearsals, she sat in the back row, bow trembling, playing so softly that no one could hear her. If the conductor pointed at her for a solo, she froze. Her strings went tight. Her bow shook. Nothing came out.

"I can't," she whispered. "They'll think I'm terrible."

"You're not terrible," Flute said. "You're amazing. I've heard you at night."

Viola blushed red — which for a violin means her varnish glowed warm. "That's different. At night, there's no one to judge me."

The big concert was in three days. The program included a violin solo — sixteen bars of a melody so beautiful it could fill a concert hall with just one instrument. The conductor had written it for Viola.

"I can't do it," Viola said.

Old Cello sat beside her. "Let me tell you something. I was terrified once too. My first concert, I was so scared I played the wrong piece entirely. The audience was confused. I was mortified."

"What happened?"

"I kept playing. The wrong piece. All the way through. And when I finished, the audience clapped. Not because it was right. Because it was real. They heard my heart, not my mistakes."

The night of the concert arrived. The hall was full. The lights dimmed. The conductor raised his baton.

The orchestra played. Then silence. The solo.

Viola sat in her chair. Bow raised. The entire hall waiting. One breath. Two.

She played.

The first note wobbled. The second was stronger. By the third bar, Viola forgot about the audience. She forgot about the lights and the silence and the judging. She just played — the way she played alone at night. Free. True. Beautiful.

The melody filled the concert hall like warm light. People closed their eyes. Some wiped tears. The other instruments listened, every one of them still, letting Viola have her moment.

When the last note faded, the hall was silent for three full seconds. Then the applause came — not polite applause. The kind of applause that comes from people who just heard something that touched their soul.

Viola's strings hummed softly. She was shaking. But she was smiling.

That night, {childName}, remember Viola. Your voice is beautiful. The thing you do when nobody is watching — that drawing, that dance, that little song you sing to yourself — the world needs to hear it. You might shake. But play anyway. Goodnight, little musician.`,
      },
      {
        id: 'ml_ep3_piano', episodeNumber: 3, title: 'The Piano\'s Black and White Keys',
        subtitle: 'The black keys and white keys refuse to play together. Until they hear what they sound like apart.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Music Lessons · Episode 3',
        body: `The piano in the music room had 88 keys — 52 white and 36 black. And they did NOT get along.

"We were here first," the white keys said. "The original piano had only white keys. You black keys were added later."

"Without us," the black keys replied, "you can't play jazz. You can't play blues. You can't play any sharp or flat. You're incomplete without us."

"You're too sharp!"

"You're too flat!"

One morning, they decided to separate. The white keys would play their songs. The black keys would play theirs. No mixing. No crossing. No compromise.

The white keys played first. "Mary Had a Little Lamb." "Twinkle Twinkle Little Star." Simple, pretty melodies. But after a while, everything sounded the same. Sweet but predictable. Like eating only vanilla ice cream for every meal.

The black keys played next. Strange, exotic sounds — mysterious and moody. Beautiful in their own way. But incomplete. Like a story with no beginning or end. Interesting but unresolved.

The music room teacher, a gentle old woman named Mrs. Harmony, sat down at the bench. She didn't say a word. She just played.

Her left hand played only white keys. Her right hand played only black keys. Separately, they sounded ordinary. But then — she brought her hands together.

The white and black keys rang out at the same time. And the music that came out was something none of them had ever heard before. It was rich and full and complex. It was sad and happy at the same time. It was jazz and classical and blues and folk all woven together.

It was complete.

Mrs. Harmony stopped. The keys were silent. Then a white key spoke softly. "I didn't know we could sound like THAT together."

A black key next to him said: "I didn't either."

"That's because you never tried," Mrs. Harmony said. "You were so busy arguing about who was better that you forgot what you were made for — to play together. The black keys aren't better. The white keys aren't better. The MUSIC is better when you stop separating and start listening to each other."

From that day on, the 88 keys played as one. Not because they agreed on everything. But because they finally understood that their differences were not the problem. Their differences were the music.

That night, {childName}, remember the piano. The world is full of differences — colours, languages, ideas, people. Some are white keys. Some are black keys. Alone, they're fine. But together? Together, they make the kind of music that fills a room and changes hearts. Goodnight, little musician.`,
      },
      {
        id: 'ml_ep4_singing', episodeNumber: 4, title: 'The Singing Contest',
        subtitle: 'Every instrument wants to win. But the real prize is a surprise.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 5,
        source: 'Music Lessons · Episode 4',
        body: `A poster appeared on the music room wall: GRAND SINGING CONTEST — FRIDAY. EVERY INSTRUMENT MAY ENTER. ONE WINNER.

The music room erupted. Trumpet polished his valves. Guitar tuned her strings. Flute practiced scales until her keys were warm. Even old Cello, who usually stayed quiet, hummed a few bars of Bach.

But the instrument who wanted to win most was little Ukulele. She was the smallest instrument in the room — four strings, a tiny wooden body, and a sound that most instruments considered too simple, too cheerful, too small to matter.

"You're entering?" Trumpet asked, his brass gleaming. "No offense, Uke, but I can fill a stadium. You can barely fill a closet."

"I'm entering," Ukulele said quietly.

Friday arrived. One by one, the instruments performed. Trumpet blasted a powerful jazz solo — the walls vibrated. The judges clapped politely. Guitar played a complicated flamenco piece — fingers flying, notes cascading. Impressive. Flute played a classical sonata — pure and precise.

Then Ukulele walked to the front. She was so small she needed a stool. She climbed up, adjusted her tuning pegs, and played.

It was a simple song. Just four chords. The kind of melody a child might hum while walking to school. No fancy tricks. No complicated runs. Just a warm, happy tune that made you think of sunshine and bare feet and ice cream melting down your hand on a summer day.

And then Ukulele did something brave. She sang. Her voice was small and a little wobbly. Not perfect. But real. And the words were about being small in a big world, and finding out that small things matter too.

When she finished, the room was silent. Then something unexpected happened. Old Cello, who hadn't cried in forty years, let out a low, trembling note — which was how cellos cry.

"Why are you crying?" Trumpet whispered.

"Because she reminded me why I started playing music in the first place. Not to be loud or impressive. Just to make someone feel something."

The judges deliberated. They came back with their decision.

"The winner is... everyone. We're canceling the contest."

"What?" the instruments gasped.

"Music is not a competition," Mrs. Harmony said from the back of the room. "Trumpet, your power is a gift. Guitar, your skill is extraordinary. Flute, your precision is beautiful. But Ukulele — you reminded us all that the bravest thing a musician can do is play simply and honestly, with nothing to hide behind."

Ukulele's four strings hummed softly. She didn't need a trophy. She had something better.

That night, {childName}, remember little Ukulele. You don't need to be the loudest, the fastest, or the fanciest. The bravest thing you can do is be yourself — simply, honestly, with your whole heart. That's a song no one else can play. Goodnight, little musician.`,
      },
      {
        id: 'ml_ep5_orchestra', episodeNumber: 5, title: 'The Orchestra',
        subtitle: 'Every instrument finds its place. The music they make together is magic.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Music Lessons · Episode 5',
        body: `The music room had changed. Where once the instruments argued and competed and tried to outplay each other, now there was something different in the air. Not silence. Something better — listening.

Mrs. Harmony gathered them all. "Tonight," she said, "we play together. Not a rehearsal. Not a competition. A concert. For the children at the hospital down the street. Many of them cannot leave their beds. So we're bringing the music to them."

The instruments looked at each other. This was not about winning or being heard. This was about giving.

They loaded into a van — Boom the drum, Viola the violin, the Piano (a small keyboard version), Guitar, Flute, Trumpet, Cello, and little Ukulele. Mrs. Harmony drove. The hospital was only five blocks away but it felt like crossing into another world.

The children's ward was painted with murals of animals and rainbows, but the children in the beds looked tired. Some had bandages. Some had tubes. Some just stared at the ceiling with eyes that had forgotten how to sparkle.

Mrs. Harmony set up the instruments in the common room. "Play what you feel," she said. "No sheet music tonight."

Boom started. A gentle heartbeat. tap... tap... tap...

Cello joined with a deep, warm hum — like being wrapped in a blanket.

Piano laid down soft chords, like stepping stones across a stream.

Then Viola — brave, beautiful Viola — played a melody. Not the concert piece. Something new. Something she was making up as she went, note by note, listening to the other instruments and weaving between them.

Guitar strummed. Flute sang. Trumpet — who usually played at full blast — played so softly it sounded like a lullaby whispered from far away.

And Ukulele? She played her four simple chords and sang. About sunshine. About tomorrow. About getting better.

A child in a wheelchair began to sway. A boy with a bandaged arm tapped his foot. A girl who hadn't smiled in three days — the nurses had told Mrs. Harmony this — looked up from her pillow and smiled.

The music wasn't perfect. Boom rushed a few beats. Viola's notes wandered. Trumpet cracked once. But nobody noticed the mistakes. They noticed the feeling — warm and golden and alive — filling the room like sunlight filling a window.

When the last note faded, a small boy in the front row whispered: "Can you play one more?"

They played three more.

On the drive back, the instruments were quiet. Not because they had nothing to say. Because they had said everything — with music.

"That," Cello said, "is what we're for."

That night, {childName}, remember the orchestra. Every instrument had learned its lesson — Boom learned to be steady, Viola learned to be brave, Piano learned that differences are beautiful, Ukulele learned to be honest, and tonight they all learned the biggest lesson of all: music is not for the musician. It's for the listener. The best thing you can do with your gift — any gift — is share it with someone who needs it. Goodnight, little musician.`,
      },
    ],
  },
{
    id: 'water-and-swim', 
    title: 'Water & Swim',
    icon: '🏊',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #22d3ee 50%, #a5f3fc 100%)',
    description: 'A child learns to swim over 5 sessions — each time conquering a new fear in the water.',
    ageRange: '4-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ws_ep1_splash', episodeNumber: 1, title: 'First Splash',
        subtitle: 'The pool is big, the water is cold, and everything feels scary.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Water & Swim · Episode 1',
        body: `The swimming pool at the community centre was enormous. Blue water stretched from wall to wall, and it smelled like clean soap and something sharp that made your nose tingle.

Mira stood at the edge in her new swimsuit, toes curled over the tiles. Her swimming teacher, Coach Dani, smiled from the shallow end. "Come on in, Mira! The water is warm today."

But Mira could not move. The water looked alive. It rippled and shimmered and seemed to breathe. What if it swallowed her?

"I don't want to," Mira whispered.

The other kids were already in. Splashing, laughing, blowing bubbles. A boy named Kai floated on his back like a starfish. A girl named Priya was kicking so hard it looked like a fountain.

Coach Dani walked to the edge. She didn't pull Mira in. She didn't push. She sat down on the tiles and put her own feet in the water.

"You know what, Mira? When I was little, I was scared of the water too."

"You were?"

"Terrified. My mum brought me to a pool just like this one. I stood right where you are standing. For twenty minutes."

"What happened?"

"I put one toe in. Just one toe. And the water didn't bite me. It didn't swallow me. It was just... wet."

Mira looked at the water. She uncurled one toe and dipped it in. Warm. Gentle. Just wet.

Then her foot. Then she sat on the edge, legs dangling. The water hugged her calves. It wasn't scary. It was soft.

Coach Dani held out her hand. "One step?"

Mira took her hand and stepped off the edge. The water came up to her waist. She gasped — then laughed. "It's warm!"

"Always is, once you're in."

For the rest of the lesson, Mira just stood in the shallow end. She didn't swim. She didn't float. She just stood in the water and felt it move around her, gentle and patient, like it had been waiting for her all along.

That night, {childName}, remember Mira's first splash. Every big adventure starts with one small toe. You don't have to jump in. You just have to start.`,
      },
      {
        id: 'ws_ep2_float', episodeNumber: 2, title: 'Learning to Float',
        subtitle: 'Mira must learn to trust the water — and let go.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Water & Swim · Episode 2',
        body: `Lesson two. Mira walked into the shallow end without hesitating this time. The water was her friend now — at least up to her waist.

"Today," said Coach Dani, "we learn to float."

"Float?" Mira's eyes went wide. "Like... lie on the water?"

"Exactly. The water will hold you. You just have to trust it."

Mira watched Kai float first. He lay back, spread his arms, and the water lifted him like a magic carpet. His ears went under. His face stayed up. He looked like he was sleeping on a cloud.

"Your turn, Mira."

Mira tried. She leaned back. But the moment her ears touched the water, she panicked. She grabbed for Coach Dani's arm, splashing everywhere.

"I'm sinking!"

"You weren't sinking. You were floating. Your brain just doesn't believe it yet."

They tried again. And again. Each time, Mira lasted a little longer before the panic grabbed her. Two seconds. Four seconds. Six seconds.

"Why can't I do it?" Mira asked, frustrated.

Coach Dani sat on the pool steps. "Floating is not about doing. It's about not doing. You're trying too hard. Your muscles are tight. The water can hold you, but only if you let it."

"That doesn't make sense."

"Try this. Close your eyes. Take a deep breath. And pretend you're lying on your bed at home. The softest bed in the world."

Mira closed her eyes. Breathed in deep. Leaned back. The water touched her ears — she almost grabbed — but then she imagined her bed. Her pillow. Her blanket.

And she floated.

Ten seconds. Twenty. Thirty. The water held her like a giant, gentle hand. She could hear her own heartbeat underwater, slow and calm. The ceiling lights looked like blurry stars.

"Mira," Coach Dani whispered. "Open your eyes."

Mira opened them. She was floating. Really floating. All by herself.

"I'm doing it!"

"You were doing it the whole time. You just finally let yourself."

Mira floated for the rest of the lesson. Not because it was easy, but because she had learned the hardest lesson of all: sometimes, the bravest thing you can do is stop trying so hard and trust.

That night, {childName}, remember Mira floating. Some things in life cannot be forced. They can only be trusted. Close your eyes, breathe deep, and let the world hold you.`,
      },
      {
        id: 'ws_ep3_deep', episodeNumber: 3, title: 'The Deep End',
        subtitle: 'The deep end is dark and bottomless. Mira has to face it.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 5,
        source: 'Water & Swim · Episode 3',
        body: `A red rope with white floats divided the pool in half. On one side: the shallow end, where Mira's feet could touch the bottom. On the other side: the deep end.

Mira had been swimming in the shallow end for three weeks now. She could float. She could kick. She could blow bubbles and glide from one wall to the other. But she never crossed the rope.

The deep end was different. The water was darker there. You couldn't see the bottom. It was like a different world — one where your feet just dangled in blue nothing.

"Today," said Coach Dani, "we swim in the deep end."

Mira's stomach flipped. "But... I can't touch the bottom there."

"That's right. And you don't need to."

Coach Dani showed her how to tread water — arms sweeping gently, legs doing a small scissor kick. "You already know how to float. Treading water is just floating while standing up."

Kai went first. He swam past the rope and treaded water like it was nothing. Priya followed. Then it was Mira's turn.

She swam to the rope. Touched it. The tiles under her feet ended here. Beyond the rope, the pool floor sloped down into shadow.

"I'll be right next to you," Coach Dani said, swimming beside her.

Mira ducked under the rope. One stroke. Two. Her feet kicked and felt nothing below them. No floor. Just water. Her heart hammered.

"Kick gently," Coach Dani said. "Sweep your arms. You're already doing it."

Mira looked down. Blue emptiness. She looked up. The ceiling, the lights, the same pool. Nothing had changed except the floor was gone.

And then something clicked. She didn't need the floor. She had been swimming without touching it for weeks. The floor was a comfort, not a necessity.

She treaded water. One minute. Two. Her breathing slowed. The deep end wasn't scary — it was just the shallow end with more room underneath.

Kai swam over. "Pretty cool, right?"

Mira grinned. "I thought the deep end was different. But it's the same water."

"Always was," said Coach Dani.

That night, Mira's mum asked how the lesson went. Mira said: "I went where my feet couldn't touch the ground. And I was fine."

That night, {childName}, remember Mira in the deep end. The things that look bottomless and dark are often just the same world with more room to grow. You don't need the ground beneath you. You just need to keep moving.`,
      },
      {
        id: 'ws_ep4_fish', episodeNumber: 4, title: 'Swimming with Fish',
        subtitle: 'A trip to the lake — real water, real fish, real nature.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Water & Swim · Episode 4',
        body: `Coach Dani had a surprise. "This Saturday, we're going to Crystal Lake. Real water. Real nature. Real swimming."

Mira had only ever swum in a pool. A lake was different. No tiles. No lanes. No red rope. Just water that went on and on until it touched the trees.

Saturday morning, the swim group stood at the lake's edge. The water was green, not blue. You could see pebbles and sand and little fish darting near the shore.

"It's not clear like the pool," Mira said.

"Nature's water is alive," Coach Dani said. "Fish live here. Plants grow here. The water has a heartbeat."

Mira stepped in. The sand squished between her toes. Tiny fish scattered, then came back, curious. One nibbled at her ankle.

"It tickles!" she laughed.

They waded in deeper. The lake water was cooler than the pool. It smelled like earth and pine trees. Mira floated on her back and watched clouds drift across the sky — real clouds, not ceiling tiles.

Coach Dani pointed to a fish that kept swimming alongside Mira. A small sunfish with gold and green scales. "He likes you."

"Why does he stay so close?"

"Fish are curious. You're something new in their world. They want to understand you the same way you want to understand them."

Mira swam slowly, and the sunfish followed. She kicked, it darted. She floated, it circled. They were swimming together — a girl and a fish, sharing the same water.

Then something amazing happened. Two more fish joined. Then five. Mira was gliding through a small school of sunfish, their scales flashing gold in the sunlight filtering through the water.

Kai shouted from the shore: "Mira! You're like a mermaid!"

But Mira wasn't thinking about mermaids. She was thinking about how the fish didn't know she had once been terrified of water. To them, she belonged here.

On the drive home, Mira was quiet.

"You okay?" her mum asked.

"The pool taught me to swim. But the lake taught me something else."

"What's that?"

"That the water isn't mine. I'm sharing it with a million living things. And they let me in."

That night, {childName}, remember Mira and the sunfish. The world is full of places that aren't yours — but they'll welcome you if you enter gently, move slowly, and respect what was there before you.`,
      },
      {
        id: 'ws_ep5_lifeguard', episodeNumber: 5, title: "The Lifeguard's Lesson",
        subtitle: 'Mira helps a scared child — and learns what her journey was really about.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Water & Swim · Episode 5',
        body: `Months had passed. Mira was a strong swimmer now. She could do freestyle, backstroke, and even a wobbly butterfly. She swam in the deep end without thinking twice. The lake was her favourite place on weekends.

One Tuesday, a new girl appeared at swim class. She stood at the pool's edge in a pink swimsuit, toes curled over the tiles. Her eyes were wide. Her fists were clenched.

Coach Dani was busy with the advanced group. Kai and Priya were practising dives. Nobody noticed the new girl.

But Mira noticed. Because she recognised something. The curled toes. The clenched fists. The way the girl stared at the water like it was a monster.

Mira swam to the edge and climbed out. "Hi. I'm Mira."

"I'm Asha." Her voice was tiny.

"First time?"

Asha nodded. Her lip trembled.

Mira sat on the tiles and put her feet in the water. "Want to know a secret? I used to be exactly where you are. I stood on this edge for my whole first lesson. Didn't even get in."

"Really?"

"Really. The water looked alive. Like it would swallow me."

"That's what it looks like right now."

Mira smiled. "Try one toe."

Asha uncurled one toe and dipped it in. Her eyes went wide. "It's warm."

"Always is."

One toe became a foot. A foot became two legs dangling off the edge. Then Asha was standing in the shallow end, water up to her waist, holding Mira's hand.

"I'm in the water," Asha whispered.

"You're in the water."

Coach Dani swam over, grinning. "Looks like I have a new assistant coach."

Mira blushed. But something inside her glowed. All those weeks of fear, of learning, of floating and sinking and trying again — they weren't just for her. They were for this moment. So she could stand at the edge with someone new and say: "I know. I was scared too. Let me show you."

After class, Asha's mum thanked Mira. "She's been terrified of water for years. How did you get her in?"

Mira thought about it. "I just told her the truth. That I was scared too. And the water was patient."

That night, {childName}, remember Mira and Asha. Everything hard thing you learn, every fear you face — it's not just for you. One day, someone will stand where you once stood, shaking and unsure. And you'll be the one who says: "I know. Come on in. I'll show you."`,
      },
    ],
  },

  {
    id: 'maths-adventures', 
    title: 'Maths Adventures',
    icon: '🔢',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #059669 50%, #6ee7b7 100%)',
    description: 'Math concepts taught through adventures — counting, shapes, patterns, fractions, and measuring.',
    ageRange: '4-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ma_ep1_garden', episodeNumber: 1, title: 'The Number Garden',
        subtitle: 'A magical garden where every flower teaches you to count.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Maths Adventures · Episode 1',
        body: `Behind the old library on Primrose Lane, there was a garden nobody talked about. Not because it was a secret — but because only children who were ready could see the gate.

On Monday morning, a boy named Zain was walking to school when a green gate appeared between two oak trees. It hadn't been there on Friday. A wooden sign read: THE NUMBER GARDEN. COME IN AND COUNT.

Zain pushed the gate open.

Inside was the most extraordinary garden he had ever seen. Flowers grew in perfect rows, and every row had a different number. The first row had one enormous sunflower, tall as Zain himself. The second row had two red roses, leaning toward each other like they were sharing a secret. The third row had three purple tulips swaying in the wind.

"Welcome!" said a cheerful ladybird sitting on a leaf. "I'm Dot. I live on the number five flower. Want to know why?"

Zain counted the spots on Dot's back. One, two, three, four, five. "Because you have five spots!"

"Clever! Everything in the Number Garden matches its row. Count the petals on the flowers in row four."

Zain ran to the fourth row. Four daisies, each with exactly four petals. In row six, six lilies with six petals each. Row seven had seven bluebells, and when the wind blew, they rang seven tiny chimes.

Then Zain reached row ten. Ten towering hollyhocks, each one a different colour. They formed an archway.

"Walk through," said Dot.

On the other side, the rows changed. Row eleven. Row twelve. Row twenty. The garden stretched on forever.

"Does it ever end?" Zain asked.

"Numbers never end," Dot said. "That's the most amazing thing about them. No matter how high you count, there's always one more."

"What's the biggest number?"

"Whatever number you're thinking of right now — add one. That's bigger. And you can do that forever."

Zain sat among the flowers and counted. He counted petals and leaves and ladybird spots. He counted bees visiting blossoms and butterflies resting on stems. Every living thing in the garden was a number waiting to be noticed.

When he left through the green gate, the world outside looked different. Lamp posts in twos. Windows in fours. Leaves in clusters of seven and eight. Numbers were everywhere. He just hadn't been looking.

That night, {childName}, remember Zain's garden. Numbers are not trapped in textbooks. They're in your fingers, in the stars, in the petals of every flower. Start counting — and you'll see the whole world is a Number Garden.`,
      },
      {
        id: 'ma_ep2_detective', episodeNumber: 2, title: 'The Shape Detective',
        subtitle: 'Detective Noor solves mysteries using only shapes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Maths Adventures · Episode 2',
        body: `Detective Noor had a magnifying glass, a notebook, and the sharpest eyes in the whole school. But she didn't solve ordinary mysteries. She solved shape mysteries.

It started when Mr. Amin, the art teacher, reported something strange. "Someone rearranged all the shapes in the art room! The circles are where the triangles should be. The squares are missing entirely!"

Detective Noor arrived at the art room. She examined the scene. The circles were stacked in a corner. The triangles were hung on the wrong wall. And the squares — all twelve of them — had vanished.

"Interesting," she said, writing in her notebook. "Triangles have three sides and three corners. Circles have no sides and no corners. Squares have four equal sides and four corners. Whoever did this knows their shapes."

She found a clue on the floor — a trail of hexagonal stickers leading out the door. She counted the sides. "Six sides each. Hexagons. The trail leads to the playground."

Outside, the trail ended at the sandbox. Inside the sandbox, someone had drawn enormous shapes with a stick. A perfect pentagon — five sides. A rectangle — four sides, but not all equal. And in the middle, all twelve missing squares, arranged into a bigger square. Three across, four down.

"Three times four equals twelve," Noor muttered. "That's a grid."

Then she noticed something. The big square made of little squares had a message written inside each one. Together they spelled: SHAPES ARE EVERYWHERE. LOOK UP.

Noor looked up. The climbing frame was a rectangle. The swings hung from triangles. The merry-go-round was a circle. The tiles on the building wall were hexagons.

She heard giggling. Behind the slide sat three kindergartners with hexagonal stickers on their cheeks.

"Did you take the squares?"

"We didn't steal them!" said the smallest one. "We wanted to show everyone that shapes don't belong in the art room. They belong everywhere!"

Detective Noor smiled. She took a photo of the sandbox shapes, the climbing frame, the hexagonal tiles. She pinned them on the art room wall with a label: SHAPES IN THE WILD.

Mr. Amin loved it so much he made it a permanent display.

That night, {childName}, remember Detective Noor. A triangle is not just a shape on paper — it holds up bridges and rooftops. A circle is not just a drawing — it's every wheel that ever rolled. The shapes you learn today are the building blocks of everything you'll ever see.`,
      },
      {
        id: 'ma_ep3_pattern', episodeNumber: 3, title: 'The Pattern Machine',
        subtitle: 'A mysterious machine that only works if you can find the pattern.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Maths Adventures · Episode 3',
        body: `In the basement of the old library, behind a dusty curtain, Zain and Noor found a machine. It was made of brass and copper, with gears and levers and a screen that glowed soft green. A sign read: THE PATTERN MACHINE. FIND THE PATTERN, EARN THE PRIZE.

The screen lit up: 2, 4, 6, 8, ___

"What comes next?" Noor asked.

Zain thought. "Each number goes up by two. So... ten!"

He typed 10. DING! A small drawer opened and a golden marble rolled out. The machine whirred happily.

New pattern: RED, BLUE, RED, BLUE, RED, ___

"Blue!" said Noor. DING! Another marble.

They were hooked. The patterns got harder.

1, 1, 2, 3, 5, 8, ___

They stared at this one. Zain counted on his fingers. "One plus one is two. One plus two is three. Two plus three is five. Three plus five is eight. So... five plus eight is thirteen!"

DING! The machine's gears spun faster. It seemed excited.

Then came a pattern with shapes. Circle, square, triangle, circle, square, ___

"Triangle!" DING!

Then sounds. The machine played three notes: high, low, high, low, high, ___

"Low!" Noor said. DING!

Then the hardest pattern of all. The screen showed: 🌙🌙⭐🌙🌙⭐🌙🌙___

"Star!" they said together. DING DING!

A bigger drawer opened. Inside was not a marble but a note: PATTERNS ARE THE LANGUAGE OF THE UNIVERSE. SEASONS REPEAT. HEARTBEATS REPEAT. NIGHT FOLLOWS DAY. DAY FOLLOWS NIGHT. EVERYTHING YOU LEARN TO PREDICT MAKES THE WORLD LESS SCARY.

Zain read it twice. He thought about how his mum's routine never changed — wake, breakfast, school, play, dinner, story, sleep. The same pattern every day. And it made him feel safe.

Noor thought about music. Every song had a pattern — verse, chorus, verse, chorus. That's why you could sing along the second time.

They gathered their golden marbles and climbed back upstairs. The library looked different now. The books were arranged in patterns — colours, sizes, subjects. The ceiling tiles formed a repeating grid. Even the way people walked through the door followed a rhythm.

That night, {childName}, remember the Pattern Machine. Patterns are everywhere — in numbers, in colours, in music, in the seasons, in your own heartbeat. Once you learn to see them, nothing ever feels truly random again. And that makes the world a little less scary and a lot more beautiful.`,
      },
      {
        id: 'ma_ep4_feast', episodeNumber: 4, title: 'The Fraction Feast',
        subtitle: 'A feast where everything must be shared fairly — and fractions save the day.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Maths Adventures · Episode 4',
        body: `Grandma Salma was famous for her feasts. Every Sunday, the whole family came — aunties, uncles, cousins, neighbours. And today there were exactly eight people at the table.

The problem? Grandma Salma had made one round cake, one rectangular pizza, and one bowl of fruit salad. Everything had to be shared fairly.

"Aisha," Grandma said to the youngest cousin, "you're in charge of sharing today."

Aisha's eyes went wide. Eight people. One cake. How?

Her big cousin Tariq whispered: "Fractions."

"Frac-whats?"

"When you cut something into equal pieces, each piece is a fraction. If you cut the cake into eight equal slices, each person gets one-eighth."

Aisha looked at the round cake. She cut it in half — two equal pieces. Then she cut each half in half — four pieces. Then each quarter in half — eight pieces. Perfect!

"Each slice is one-eighth of the cake!" she announced proudly.

"Now the pizza," Grandma said.

The pizza was rectangular, cut into twelve slices. Eight people, twelve slices. Tariq helped again. "Twelve divided by eight... that means everyone gets one slice, and there are four slices left over."

"Four out of twelve left over," Aisha said. "That's... one-third of the pizza!"

Grandma's eyes twinkled. "And what should we do with the extra third?"

"Save it for seconds!" everyone shouted.

Then came the fruit salad. Twenty-four strawberries. Aisha counted them carefully. "Twenty-four divided by eight is three. Everyone gets three strawberries. That's three twenty-fourths... no wait. Three twenty-fourths is the same as one-eighth!"

Tariq high-fived her. "You just simplified a fraction!"

The feast was perfect. Every plate had exactly one-eighth of the cake, one-and-a-half slices of pizza, and three strawberries. Fair and square.

After dinner, Aisha helped Grandma wash up. "Grandma, why did you make me share?"

Grandma smiled. "Because sharing is just fractions with love. When you divide fairly, everyone feels full. When you don't, someone always goes hungry."

Aisha dried a plate and thought about that. Fractions weren't just maths. They were fairness. They were making sure everyone had enough.

That night, {childName}, remember Aisha's feast. Fractions are not scary numbers on a page. They are the maths of sharing — of making sure every person at the table gets their fair piece. And the best meals are the ones where everyone has enough.`,
      },
      {
        id: 'ma_ep5_measure', episodeNumber: 5, title: 'The Measurement Mission',
        subtitle: 'How tall is a tree? How far is the moon? Measuring everything in sight.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Maths Adventures · Episode 5',
        body: `Zain woke up on Saturday with a question: "How tall is the tree in our garden?"

"Tall," said his dad, not looking up from breakfast.

"But HOW tall? In numbers?"

His dad put down the newspaper. "You want to measure a tree?"

"I want to measure EVERYTHING."

And so began the Measurement Mission. Zain grabbed a ruler, a tape measure, and a ball of string from the drawer. His dad grabbed his curiosity.

First: the kitchen table. Zain stretched the tape measure across it. "One hundred and twenty centimetres long! That's one metre and twenty centimetres."

"How many rulers is that?" Dad asked.

Zain laid rulers end to end. "Four rulers! Each ruler is thirty centimetres."

Next: the hallway. They measured it with footsteps. Zain's footsteps: twenty-two. Dad's footsteps: fourteen. Same hallway, different measurements.

"Why are our numbers different?" Zain asked.

"Because your feet are smaller than mine. That's why we need standard measurements — centimetres, metres — so everyone agrees."

Then the garden. Zain measured the fence with the tape measure. He measured the width of a flower pot. He measured the length of a snail's trail — eleven centimetres of silver slime.

But the tree. The tree was the mission. You can't hold a tape measure against a thirty-foot oak.

"Here's a trick," Dad said. "Stand by the tree. I'll measure your shadow. Then we measure the tree's shadow. And we use the ratio."

Zain's shadow: one metre. Zain's height: one hundred and ten centimetres. The tree's shadow: eight metres.

"If your shadow is one metre and you're about one metre tall, then the tree is about eight metres tall!" Dad said.

"We measured a tree WITHOUT touching it!"

"That's the power of measurement. You can figure out things you can't reach — the height of buildings, the width of rivers, even the distance to the moon."

"How far is the moon?"

"About three hundred and eighty-four thousand kilometres."

"Can I measure that?"

Dad laughed. "Scientists did. With a laser beam and a mirror the astronauts left on the moon. They measured the time it took the light to bounce back."

Zain looked up at the sky. "Everything can be measured."

"Everything. You just need the right tool and the right question."

That night, {childName}, remember Zain's Measurement Mission. The world is full of things to measure — trees and shadows and snail trails and the distance to the moon. Every question you ask is a ruler. And the more you measure, the better you understand the beautiful, countable, measurable world you live in.`,
      },
    ],
  },

  {
    id: 'planets-and-stars', 
    title: 'Planets & Stars',
    icon: '🪐',
    gradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 50%, #fbbf24 100%)',
    description: 'Each planet has a personality and a lesson — new stories from across the solar system.',
    ageRange: '3-7',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'ps_ep1_moon', episodeNumber: 1, title: 'Why the Moon Glows',
        subtitle: 'The Moon has no light of her own — and that is her greatest strength.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Planets & Stars · Episode 1',
        body: `Long, long ago, when the solar system was young, every planet got a gift. Earth got oceans. Mars got mountains. Jupiter got storms. Saturn got rings. The Sun got the biggest gift of all — light. Blazing, brilliant, endless light.

But the Moon got nothing.

"Where is my gift?" the Moon asked the universe.

"You are small," the universe said. "There was nothing left."

The Moon was heartbroken. She drifted away from the other planets and hid in the dark. Without a gift, what was she for?

Earth noticed. "Moon? Where are you?"

"In the dark. Where I belong."

"Come closer," Earth said gently. "I have oceans, but they're restless at night. They don't know which way to flow."

The Moon drifted closer. Something strange happened. Earth's oceans began to rise toward the Moon — gently pulled by the Moon's gravity. High tide. Low tide. A rhythm. A heartbeat.

"You're doing that," Earth whispered. "You're giving my oceans a rhythm."

The Moon hadn't even known she could do that.

Then the Sun called out: "Moon! Come to me."

The Moon floated toward the Sun. The Sun's light hit her surface and bounced off — soft, silver, gentle. Not blazing like the Sun. Warm. Quiet. Perfect for nighttime.

"Look," said the Sun. "My light is too bright for sleeping children. But YOUR light — reflected, softened — is just right."

The Moon looked down at Earth. Children were lying in bed, looking up at her through their windows. Her soft glow made them feel safe. Not too dark. Not too bright. Just right.

The Moon cried — but not from sadness anymore. "I don't make my own light. I borrow yours."

"The best light," said the Sun, "is the kind that is given and passed on. That's not borrowing. That's sharing."

From that night on, the Moon glowed proudly. Not because the light was hers, but because she had found her purpose — to take something bright and make it gentle enough for the darkest hours.

That night, {childName}, remember the Moon. You don't have to make your own light. Sometimes the most important thing you can do is take someone else's brightness and share it gently with those who need it most.`,
      },
      {
        id: 'ps_ep2_mars', episodeNumber: 2, title: 'Mars the Red Warrior',
        subtitle: 'Mars lost his oceans but refused to give up. A story of standing tall.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Planets & Stars · Episode 2',
        body: `Billions of years ago, Mars was the most beautiful planet in the solar system. Bluer than Earth. Rivers wider than the Amazon. Lakes deeper than the Mariana Trench. Clouds of white cotton drifting across a lavender sky.

The other planets were jealous. "Mars has everything," Jupiter grumbled. "And he's not even the biggest."

But then the solar wind came. A great invisible storm from the Sun — not light, but particles, fierce and relentless. It stripped away Mars's atmosphere, molecule by molecule. Like peeling the skin off a fruit.

Without atmosphere, the oceans boiled. The rivers dried. The lakes became dust. In a few hundred million years, Mars went from paradise to desert.

Earth watched in horror. "Mars! Are you okay?"

Mars stood silent for a long time. His surface was cracked. His sky had turned from lavender to a thin, cold pink. His oceans were gone forever.

"I am... different," Mars finally said. "But I am still here."

Venus offered sympathy. "I could share my clouds." But Venus's clouds were made of acid. Mars politely declined.

Jupiter offered to shield Mars from the solar wind. "Stand behind me." But Mars shook his head. "I've already faced the worst. I won't hide now."

Instead, Mars did something remarkable. He kept his mountains. Olympus Mons — three times taller than Everest — still stood. He kept his canyons. Valles Marineris — a scar across his face so wide it would stretch across all of North America. He wore his scars like medals.

And then, billions of years later, humans looked up and chose Mars. Not beautiful Venus with her clouds. Not giant Jupiter with his storms. Mars. The broken one. The red one. The one who lost everything and stood tall anyway.

"We want to live there," the humans said. "On Mars."

"Why me?" Mars asked.

"Because you survived. And anyone who survived what you survived must be strong enough to hold us too."

Mars felt something he hadn't felt in four billion years. Hope. A tiny green shoot of hope, growing in red dust.

That night, {childName}, remember Mars. Losing everything does not make you less. Standing in the ruins and refusing to disappear — that is the bravest thing a planet, or a person, can ever do.`,
      },
      {
        id: 'ps_ep3_jupiter', episodeNumber: 3, title: "Jupiter's Big Storm",
        subtitle: 'Jupiter has a storm that has raged for 400 years. What if he just... let it go?',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Planets & Stars · Episode 3',
        body: `Jupiter was the biggest planet. Bigger than all the others combined. He had sixty-seven moons. He had stripes of orange and white. And he had a storm.

Not just any storm. A storm the size of Earth. The Great Red Spot. It had been spinning for over four hundred years. Winds at three hundred miles per hour. Lightning bolts a thousand times stronger than anything on Earth.

"Why don't you stop it?" Saturn asked one day, her rings spinning peacefully.

"I can't," Jupiter said. "It started so long ago, I don't even remember why. I was angry about something. And the anger became a storm. And the storm became part of me."

"But it must be exhausting."

"It is. Four hundred years of spinning. I'm tired, Saturn. But I'm afraid if I stop the storm, there'll be nothing left."

Saturn floated closer, her rings casting golden shadows. "Can I tell you something? Your moons — Io, Europa, Ganymede — they love you. But the storm scares them. Io has volcanoes because of how close she orbits to your anger."

Jupiter looked at little Io. She was right. His smallest moon was covered in erupting volcanoes — a mirror of Jupiter's own turmoil.

"What do I do?"

"You don't stop a four-hundred-year storm in one day. You slow it down. Little by little. Let one wind die. Then another. Be patient with yourself."

Jupiter tried. He let the outer winds slow by one mile per hour. Then two. The storm didn't notice. The next year, he slowed it by five. Then ten.

Scientists on Earth noticed. "The Great Red Spot is shrinking!" they announced excitedly.

Jupiter smiled for the first time in centuries. The storm was still there. But it was smaller. And every year, a little smaller still.

Io's volcanoes calmed. Europa's ice stopped cracking. Ganymede slept peacefully for the first time in ages.

"It's still spinning," Jupiter told Saturn.

"But YOU'RE not spinning with it anymore. The storm is in your atmosphere. It's not in your heart."

That night, {childName}, remember Jupiter. Everyone carries a storm inside — an anger, a worry, a sadness that spins and spins. You can't stop it overnight. But you can slow it down, one gentle breath at a time. And one day, you'll look inside and find it's just a small, quiet breeze.`,
      },
      {
        id: 'ps_ep4_saturn', episodeNumber: 4, title: "Saturn's Beautiful Rings",
        subtitle: 'Saturn got her rings by sharing pieces of herself. A story of generosity.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Planets & Stars · Episode 4',
        body: `Of all the planets, Saturn was the quietest. She never boasted like Jupiter. She never glowed red like Mars. She just floated in the dark, golden and calm, circled by the most beautiful rings in the solar system.

But Saturn had not always had rings.

Long ago, Saturn was plain. A big, golden gas giant with nothing special about her. The other planets had their things — Earth had life, Mars had mountains, Jupiter had storms. Saturn had... nothing.

"What makes me special?" she asked the universe.

The universe was quiet for a very long time. Then it answered: "Give something away, and you'll see."

Saturn didn't understand. What did she have to give? She was made of gas and wind and loneliness.

Then a small asteroid drifted by, cold and lost. "I'm so tired," the asteroid said. "I've been floating alone for millions of years."

"Stay with me," Saturn said. She reached out with her gravity and caught the asteroid. It began to orbit her — a tiny rock circling a giant planet.

Word spread. More asteroids came. Comets. Ice chunks. Broken pieces of moons that had nowhere to go. Saturn caught them all. She didn't ask them to be anything. She just let them orbit, each at their own speed, each in their own lane.

Thousands of pieces. Then millions. Then billions. Ice and rock and dust, all circling Saturn in perfect, shimmering bands. In the light of the distant Sun, they sparkled like diamonds.

The other planets stared.

"How did you get those?" Jupiter demanded.

"I didn't get them. They came to me. I just made room."

Earth looked at Saturn with new respect. "You caught everything the solar system threw away. Every broken piece, every lost rock, every forgotten chunk of ice."

"Everyone deserves a home," Saturn said simply.

And so Saturn became the most beautiful planet — not because of what she was born with, but because of what she gathered. Every ring was made of something someone else had lost. And together, those lost things became the most stunning sight in the night sky.

That night, {childName}, remember Saturn. The most beautiful things are often built from broken pieces. When you make room in your life for the lost and lonely — when you welcome what others throw away — you create something the whole universe will admire.`,
      },
      {
        id: 'ps_ep5_pluto', episodeNumber: 5, title: "Pluto's Big Heart",
        subtitle: 'Too small for the planet club. But Pluto had the biggest heart of all.',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'Planets & Stars · Episode 5',
        body: `For seventy-six years, Pluto was the ninth planet. He sat at the edge of the solar system, small and cold and far away, but proud. He was a planet. He belonged.

Then, in 2006, the scientists changed their minds. "Pluto is too small," they said. "He hasn't cleared his orbit. He's a dwarf planet now."

Just like that, Pluto was demoted. The other eight planets didn't say much. Mercury looked away. Venus coughed. Earth felt guilty but said nothing. Jupiter shrugged — he had bigger things to worry about.

Pluto went quiet. He drifted further into the dark. His moon, Charon, stayed close. "You're still a planet to me," Charon whispered.

"I'm not a planet to anyone else."

Years passed. Pluto grew used to the silence. Used to the cold. Used to being forgotten at the edge of everything.

Then he heard something. A signal. Getting louder. Getting closer.

A spacecraft. From Earth. It had been travelling for nine years across three billion miles of empty space. And it was coming to see Pluto.

"New Horizons," the spacecraft introduced itself. "I've been looking forward to meeting you."

"You came all this way? For me?"

"For you."

New Horizons flew past Pluto and took photographs. And there, on Pluto's surface, was something nobody expected. A massive, heart-shaped glacier. Smooth, bright, and unmistakable. A heart so big it could be seen from space.

The photos reached Earth. The whole world gasped. Front page of every newspaper. Scientists cried. Children pointed at screens. "Pluto has a HEART!"

Neptune called out from across the void: "We should have visited you sooner."

Saturn whispered: "I always knew you were special."

But it was little Mercury who said the truest thing: "Being small never meant being unimportant. It meant we had to look harder. And we should have looked sooner."

Pluto's heart glowed in the permanent twilight of the outer solar system. He was still small. Still cold. Still far away. But the whole world knew his name again. And this time, they knew it for the right reason.

That night, {childName}, remember Pluto. You don't have to be the biggest or the closest to matter. Sometimes the smallest, most distant person in the room has the biggest heart of all. And when someone finally takes the time to look — really look — they'll see it shining.`,
      },
    ],
  },

  {
    id: 'geometry-shapes', 
    title: 'Geometry & Shapes',
    icon: '📐',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 50%, #fde047 100%)',
    description: 'Shapes come alive as characters — each one unique, each one important.',
    ageRange: '3-6',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'gs_ep1_circle', episodeNumber: 1, title: 'The Circle Who Had No Corners',
        subtitle: 'Every shape has corners except Circle. Is something wrong with her?',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Geometry & Shapes · Episode 1',
        body: `In Shapeville, every shape had corners. Triangle had three — sharp and proud. Square had four — neat and tidy. Pentagon had five, Hexagon had six, and old Octagon had eight corners and never let anyone forget it.

"Eight corners!" Octagon would say. "That's practically a circle, but with CHARACTER."

And then there was Circle. Zero corners. Zero straight edges. Just one smooth, endless curve that went around and around and came back to where it started.

"What ARE you?" Triangle asked one day in the park. "You don't have any corners."

"I'm a circle."

"But shapes have corners. How can you be a shape without corners?"

Circle didn't know how to answer. She rolled away — because that was the one thing she could do that nobody else could. She rolled. Smoothly, effortlessly, endlessly. But today, rolling felt lonely.

She went to see old Professor Polygon, the wisest shape in Shapeville. He had so many sides you couldn't count them, and he looked almost like a circle himself.

"Professor, is something wrong with me? I don't have any corners."

Professor Polygon chuckled. "My dear Circle, you are perhaps the most important shape in the universe."

"Me? But I'm so plain. No corners, no angles, no straight lines."

"Let me ask you something. What are wheels?"

"Circles."

"What is the sun?"

"A circle."

"What is the moon? What are the planets? What shape are the eyes that see them?"

"All... circles."

"What shape is a coin? A plate? A clock? The ripple when a raindrop hits water?"

Circle was quiet. She had never thought about it.

"You are the shape of everything that moves, everything that shines, and everything that holds together. Corners are wonderful — but they stop. You, dear Circle, never stop. You go on forever. That's not a weakness. That's infinity."

Circle rolled home that night. Past the streetlights — circles of light on the ground. Past the clock tower — a circle with numbers. Past the full moon — the biggest circle of all, hanging in the sky.

She was everywhere. She always had been.

That night, {childName}, remember Circle. Being different is not the same as being less. Sometimes the thing that makes you feel left out — no corners, no edges, nothing sharp — is actually the thing that makes you perfect for rolling through a world that needs you everywhere.`,
      },
      {
        id: 'gs_ep2_triangle', episodeNumber: 2, title: "The Triangle's Three Friends",
        subtitle: 'Triangle only has three sides. But three is all you need.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Geometry & Shapes · Episode 2',
        body: `Triangle had a problem. She only had three sides, which meant she could only have three best friends — one for each side. Square had four. Pentagon had five. Hexagon had six and was always bragging about his enormous birthday parties.

"Only three friends?" Hexagon teased. "That's barely a group."

Triangle felt small. Three sides. Three corners. Three friends. Everything about her was the least.

Her three friends were Line (who was perfectly straight), Dot (who was perfectly round and very, very small), and Arrow (who always pointed the way).

"I wish I had more sides," Triangle told them at lunch.

Line frowned. "Why?"

"So I could have more friends. Like Hexagon."

Arrow pointed at Triangle's heart. "More sides doesn't mean more friends. It means more edges. More places where you can poke someone."

"Besides," said Dot, "do you know what a triangle can do that no other shape can?"

"What?"

"Stand on any side and never fall over. You're the most stable shape there is. That's why they build bridges with triangles. And rooftops. And the frames of skyscrapers."

Triangle had never thought about it that way. She looked at the playground. The swing set — made of triangles. The slide — a triangle from the side. The climbing frame — triangles everywhere, holding everything up.

"Bridges?" she whispered.

"The strongest bridges in the world," Line said, "are made of thousands of triangles. Each one is small. But together, they hold up trains and cars and trucks."

That afternoon, the school building creaked. A shelf in the library was sagging. Books were about to tumble.

Pentagon tried to hold it up. Not strong enough. Square tried to brace it. Too wobbly. Hexagon just stared.

Triangle squeezed underneath the shelf. She pressed her three corners into the wall and the shelf and the bookend. A perfect brace. The shelf stopped sagging. The books stayed put.

Mr. Carpenter the janitor saw it and nailed a wooden triangle bracket underneath. "Strongest shape there is," he said, patting the bracket. "Three sides is all you need."

Triangle glowed. Three sides. Three friends. Three corners. She wasn't the least of anything. She was the foundation of everything.

That night, {childName}, remember Triangle. You don't need the most friends to be strong. You need the right ones. And three real ones — solid, loyal, and true — can hold up the whole world.`,
      },
      {
        id: 'gs_ep3_square', episodeNumber: 3, title: 'The Square Who Wanted to Be Different',
        subtitle: 'Square is boring. Same sides, same corners, same everything. Until he discovers his secret.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Geometry & Shapes · Episode 3',
        body: `Square was bored. Four sides. Four corners. All the same length. All the same angle. Ninety degrees, ninety degrees, ninety degrees, ninety degrees. Nothing surprising. Nothing exciting. Just... square.

"I'm the most boring shape in Shapeville," he complained to his friend Rectangle.

"At least you're symmetrical," Rectangle said. "I'm longer on two sides. I can't even roll."

"Neither can I! Circle rolls everywhere. Triangle stands on her head. Star has those amazing points. What do I do? I just... sit there. Being square."

One morning, Square decided to change. He tried stretching himself into a rectangle. Too uncomfortable. He tried squishing one corner to become a rhombus. It hurt. He tried adding a side to become a pentagon, but you can't just add a side. That's not how geometry works.

Frustrated, Square sat on the playground and watched the other shapes. And he noticed something he had never noticed before.

The building was made of squares. Bricks — squares. Windows — squares. Floor tiles — squares. The chessboard, the chocolate bar, the keyboard keys, the pixels on a screen — all squares.

"Excuse me," said a tiny shape that Square had never seen before. It was a pixel — the smallest square in existence.

"What are you?" Square asked.

"I'm a pixel. I live inside screens. Phones, tablets, televisions — I'm one of millions of tiny squares that work together to make pictures."

"Pictures?"

"Every photo you've ever seen, every video, every game — it's all made of squares like you and me. We are so small that humans can't see us individually. But together, we make everything visible."

Square's mind was blown. "So when someone watches a movie..."

"They're looking at millions of squares changing colour, sixty times per second."

Square looked at his four equal sides with new respect. He wasn't boring. He was fundamental. The building block of the visible digital world. Every picture, every screen, every display — built from shapes exactly like him.

He walked home past a mosaic on the community centre wall. Thousands of tiny square tiles, each a different colour, arranged into a picture of a sunset over water. Each tile was plain. Together, they were art.

"I'm not boring," Square whispered. "I'm the building block."

That night, {childName}, remember Square. Sometimes the most ordinary-looking things are the most essential. You don't have to be flashy or unusual. Sometimes being reliable, consistent, and perfectly square is exactly what the world needs to build something extraordinary.`,
      },
      {
        id: 'gs_ep4_hexagon', episodeNumber: 4, title: "The Hexagon's Secret",
        subtitle: 'Hexagon has a secret — she was designed by bees. The strongest shape in nature.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Geometry & Shapes · Episode 4',
        body: `Hexagon was always a little mysterious. Six sides. Six corners. She didn't brag like Octagon or worry like Circle. She just hummed quietly and smiled when anyone asked about her.

"What's your secret?" Square asked one day. "You always seem so... peaceful."

"I learned it from the bees," Hexagon said.

"The bees?"

"Come. I'll show you."

Hexagon led Square, Triangle, and Circle to the old apple tree in the park. Hanging from a branch was a beehive — a golden, buzzing palace. Through the outer wall, they could see the honeycomb inside.

Every cell was a perfect hexagon. Thousands of them, fitted together without a single gap. No glue. No nails. Just hexagons, side by side, edge to edge.

"Why hexagons?" Circle asked. "Why not circles or squares?"

"Because," Hexagon said, "hexagons fit together perfectly with no wasted space. Circles leave gaps between them. Squares work, but they're not as strong. Hexagons are the only shape that tiles perfectly AND uses the least material for the most storage."

"The bees figured that out?" Triangle asked.

"Millions of years ago. They needed to store honey efficiently. They tried different shapes. Hexagons won. Every time."

Square examined the honeycomb closely. Each cell was identical. Each wall was shared with its neighbour. No wasted wax. No empty space. Maximum honey in minimum material.

"That's... genius," Square admitted.

"It's patience," Hexagon said. "The bees didn't rush. They didn't pick the easiest shape. They picked the best one. And then they built the same perfect cell, over and over, thousands of times."

Circle rolled around the hive. "I see it now. The bees didn't invent you. They discovered you. You were always the answer."

Hexagon hummed. "Nature has been doing maths longer than anyone. Spider webs use geometry. Snowflakes are hexagons too — every single one. Turtle shells, basalt columns, the eyes of a fly — all hexagons."

The shapes walked home in silence, looking at the world differently. Fence wire — hexagons. The drain cover — hexagons. A bolt head — hexagon.

"Your secret isn't a secret at all," Square said. "You're everywhere."

"That's the real secret," Hexagon smiled. "The best shapes don't need to announce themselves. They just quietly hold the world together."

That night, {childName}, remember Hexagon and the bees. The best solutions are often not the loudest or the flashiest. They're the patient ones — the shapes that fit perfectly, waste nothing, and hold the most sweetness inside.`,
      },
      {
        id: 'gs_ep5_city', episodeNumber: 5, title: 'Shapes Build a City',
        subtitle: 'Every shape has a role. Together, they build something none of them could alone.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Geometry & Shapes · Episode 5',
        body: `The Mayor of Shapeville made an announcement: "We need a new community centre. Every shape must contribute. The building must be strong, beautiful, and welcoming."

The shapes gathered in the town square. For the first time in Shapeville history, they would have to work together.

Triangle spoke first. "I'll do the roof. No one is stronger overhead. Rain will slide right off my slopes."

Square nodded. "I'll be the walls and windows. I'm steady and reliable. I'll keep everything straight and even."

Rectangle raised her hand. "Doors. I'm the perfect shape for walking through — taller than I am wide."

Circle bounced forward. "I'll be the clock on the tower. And the round window in the entrance. I'll be the doorknobs and the light fixtures."

Hexagon hummed. "The floor tiles. I'll cover every inch with no gaps and no waste."

Pentagon volunteered for the decorative details. Octagon offered to be the stop sign out front. Even little Dot said she would be the period at the end of the welcome sign.

They started building. Triangle perched on top, pointing at the sky. Square stacked himself up, wall after wall. Rectangle hung herself perfectly between two walls. Circle fitted herself into the tower and started telling time.

Hexagon covered the floor — thousands of tiny hexagons in blue and gold, like a honeycomb palace. Pentagon decorated the archway with star-shaped patterns. Oval became the mirror in the bathroom.

But something was wrong. The building looked correct, but it felt cold. Shapes fitted together perfectly, but it didn't feel like a place you wanted to be.

Old Professor Polygon arrived. He looked at the building for a long time.

"You've built with precision," he said. "But you've forgotten something. The most important shape of all."

"What shape?" they asked together.

"The space between the shapes. The room inside the walls. The gap where the door opens. The emptiness inside Circle's clock where the hands move. A building is not its walls — it's the space those walls protect."

The shapes understood. They adjusted. They made the ceilings higher so sound could travel. They widened the hallways so people could walk side by side. They made the windows bigger so sunlight could flood in.

When the community centre opened, it was perfect. Strong triangles overhead. Steady squares all around. Circles catching light. Hexagons underfoot. And inside — space. Beautiful, open, welcoming space.

That night, {childName}, remember the city the shapes built together. No single shape could have done it alone. Triangle needed Square. Square needed Circle. Circle needed Hexagon. The strongest things in the world are not made of one shape — they're made of all shapes, working together, each doing what they do best.`,
      },
    ],
  },

  {
    id: 'rocket-adventures-team', 
    title: 'Rocket Adventures',
    icon: '🛸',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 50%, #a855f7 100%)',
    description: 'A team of kid astronauts build and fly a rocket — engineering, teamwork, and the stars.',
    ageRange: '5-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'rat_ep1_build', episodeNumber: 1, title: 'Building the Rocket',
        subtitle: 'Five kids. One dream. Zero experience. They build a rocket from scratch.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 1',
        body: `It started with a question in the school science fair. "What would you build if you could build anything?"

Five kids wrote the same answer: A ROCKET.

Their teacher, Ms. Kapoor, read their answers and smiled. "Then build one."

The five kids were: Ravi, who loved maths and could calculate anything. Leila, who drew blueprints so precise they looked like computer printouts. Omar, who could fix any machine — toasters, bicycles, anything with parts. Suki, who knew the name of every star in the sky. And Jin, the smallest, who nobody expected much from, but who asked the best questions.

"How do rockets work?" Jin asked on Day 1.

"Newton's Third Law," Ravi said. "Every action has an equal and opposite reaction. Push gas down, rocket goes up."

"What do we build it from?" Jin asked.

Leila unrolled a blueprint. "Aluminium body. Nose cone made from a recycled traffic cone. Fins from sheet metal. The engine... that's the hard part."

They worked every day after school. The garage became Mission Control. Omar welded fins while Ravi calculated thrust-to-weight ratios. Leila designed the control panel. Suki mapped the trajectory based on star positions.

And Jin? Jin kept asking questions. "What if it rains on launch day?" They added a waterproof coating. "What if the nose cone cracks?" They reinforced it with fibreglass. "What if we get scared?" Nobody had an answer for that one.

Three months in, the rocket stood in the garage. Seven feet tall. Silver and red. A little crooked, a little rough, but real. They named it HOPE-1.

Ms. Kapoor inspected it. "This is remarkable. But I have to ask — are you sure it will fly?"

The five kids looked at each other. No one was sure. They had never done this before. The maths said yes. The blueprint said yes. But the butterflies in their stomachs said maybe.

"There's only one way to find out," Jin said quietly.

And everyone agreed. Because that was the truth about building anything — you never know if it works until you try.

That night, {childName}, remember the team that built HOPE-1. You don't need to know everything before you start. You need a question, a team, and the courage to build something that might not work — because the only way to fly is to try.`,
      },
      {
        id: 'rat_ep2_launch', episodeNumber: 2, title: 'Countdown and Launch',
        subtitle: 'The big day. Ten seconds that change everything.',
        tradition: 'universal', theme: 'patience', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 2',
        body: `Launch day. Saturday morning. The field behind the school. HOPE-1 stood on a makeshift launchpad — four cinder blocks and a metal plate.

The whole school had come. Parents. Teachers. The principal, Mr. Torres, who had signed seventeen permission forms. Even the local news reporter stood with a camera.

Ravi ran final calculations. "Wind speed: twelve kilometres per hour from the west. Temperature: eighteen degrees. Humidity: forty percent. All within parameters."

Leila checked the control panel. Every light green except one — the fuel gauge, which blinked amber. "We have enough fuel for one launch. ONE. If something goes wrong, we can't try again."

Omar tightened every bolt for the third time. "Structural integrity: solid."

Suki checked the trajectory. "If everything goes right, HOPE-1 will reach three hundred metres, arc east, and land in the empty field by the highway."

Jin stood at the microphone. The team had voted — Jin would do the countdown. The one who asked the best questions would speak the final words.

"Ready?" Ms. Kapoor asked.

Five nods. Five hammering hearts.

Jin leaned into the microphone. The crowd went silent.

"Ten."

Omar gripped Leila's arm.

"Nine. Eight. Seven."

Ravi's pencil snapped in his hand.

"Six. Five. Four."

Suki looked at the sky and whispered the name of a star.

"Three. Two. One."

Jin paused. One heartbeat.

"LAUNCH."

The engine roared. A column of white smoke exploded from the base. HOPE-1 trembled — and then LIFTED. Slowly at first. Then faster. Then impossibly fast. A silver streak punching through the morning sky.

The crowd erupted. Screaming. Jumping. Crying. Mr. Torres's mouth hung open.

HOPE-1 climbed. One hundred metres. Two hundred. Two-fifty. Three hundred. The engine cut. The rocket hung in the sky for one perfect moment — silent, weightless, touched by sunlight — and then arced gracefully eastward.

The parachute deployed. Orange and white. HOPE-1 floated down like a dandelion seed and landed softly in the empty field, exactly where Suki had predicted.

The five kids ran. Across the school field, through the gate, across the highway bridge. They reached HOPE-1, still warm, lying on its side in the grass.

Jin touched it. "We did it."

"WE DID IT!" they screamed together, hugging and laughing and falling on the grass.

That night, {childName}, remember the countdown. Ten seconds. That's all it took between fear and flight. Every big moment in your life will have a countdown — and at the end of it, you just have to say the word and let go.`,
      },
      {
        id: 'rat_ep3_asteroid', episodeNumber: 3, title: 'Asteroid Dodge',
        subtitle: 'HOPE-2 is in space. But something is heading straight for them.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 3',
        body: `After HOPE-1's success, the team built HOPE-2. Bigger. Stronger. With a cockpit. This time, they were going to space for real.

Ms. Kapoor had connections. A retired space engineer named Dr. Anand helped them design life support. The town council funded the project. The whole community had adopted the five kid astronauts.

Launch day for HOPE-2 was perfect. Blue sky. No wind. The crowd was ten times bigger.

Jin did the countdown again. HOPE-2 launched flawlessly. Through the atmosphere. Past the blue sky into the black. The five kids floated in zero gravity, looking down at Earth — a blue marble, just like in the pictures, but real. Impossibly real.

"It's so beautiful," Leila whispered, sketching furiously even in zero-g.

Then Ravi's console beeped. Then beeped faster. Then screamed.

"Object detected. Bearing zero-four-five. Distance: twelve kilometres. Closing speed: nine hundred metres per second."

An asteroid. Not huge — about the size of a car. But at that speed, it would rip through HOPE-2 like paper.

"How long?" Omar asked, already unstrapping.

"Seventy seconds."

Panic. Real panic. This wasn't a simulation. There was no teacher to call. No adult to fix it.

"We need to move," Suki said. "Fire the side thrusters."

"We don't have enough fuel for a big burn," Ravi said. "We can't dodge it."

Silence. Fifty seconds.

Then Jin spoke. "We don't need to dodge it. We need to deflect it."

"How?"

"The cargo bay. We packed two hundred kilograms of scientific equipment. If we eject it toward the asteroid, the impact might change its course by a few degrees. Enough to miss us."

"That's our entire experiment payload!" Leila said. "Months of work!"

"It's our experiments or us," Jin said quietly.

Five seconds of silence. Then Omar opened the cargo bay. Ravi calculated the angle. Leila programmed the ejection. Suki tracked the asteroid. Jin pressed the button.

The payload launched. Two hundred kilograms of carefully built experiments, flying into the void.

Contact. The payload hit the asteroid. A silent flash. The asteroid's path shifted — just two degrees. But two degrees at twelve kilometres was enough. It sailed past HOPE-2, close enough to see its cratered surface through the window.

They sat in silence for a full minute. Then Suki exhaled. "Clear."

Omar looked at the empty cargo bay. "All those experiments. Gone."

Jin put a hand on Omar's shoulder. "We can rebuild experiments. We can't rebuild us."

That night, {childName}, remember the asteroid dodge. Sometimes you have to let go of something you worked hard on to save something more important. Sharing isn't just about giving away things you don't need. Sometimes it means giving away things you love — because the people beside you matter more.`,
      },
      {
        id: 'rat_ep4_station', episodeNumber: 4, title: 'The Space Station',
        subtitle: 'HOPE-2 docks with the International Space Station. The kids meet real astronauts.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 4',
        body: `After the asteroid dodge, Mission Control — which was really Ms. Kapoor and Dr. Anand in the school gym — made a decision. "HOPE-2, change of plans. The International Space Station has offered to dock with you. They want to meet the kids who dodged an asteroid."

The five kids looked at each other through their helmets. The ISS. The actual International Space Station. Where real astronauts lived and worked.

Suki navigated. The ISS appeared as a tiny star that grew into a massive structure — solar panels like golden wings, modules connected like train carriages, the whole thing orbiting Earth at seventeen thousand miles per hour.

Ravi guided the docking. Inch by inch. HOPE-2 nudged closer until — CLUNK. Locked in.

The airlock hissed. A door opened. And there stood Commander Yuki Tanaka, a Japanese astronaut with kind eyes and a floating ponytail.

"Welcome aboard," she said, grinning. "We've been watching you since launch. That asteroid dodge was the bravest thing I've seen in twenty years of spaceflight."

The kids floated through the ISS. It was smaller inside than they expected — like a very long, very cramped submarine. But every surface was covered in equipment, experiments, and photographs from home.

"This is where we eat," Commander Tanaka showed them a tiny galley where tortillas floated and water came in pouches. "This is where we sleep." Sleeping bags strapped to the wall. "And this is where we exercise." A treadmill with bungee straps to hold you down.

"You run on a treadmill in SPACE?" Omar asked.

"Every day. Without gravity, your muscles and bones get weak. The bravest thing up here isn't the launch. It's the discipline. Doing the boring, hard work every single day so your body doesn't break down."

Jin asked the question everyone was thinking: "Were you ever scared?"

Commander Tanaka floated to the cupola — the big window at the bottom of the station. Earth glowed below, blue and white and enormous.

"Every day," she said. "There's a millimetre of aluminium between me and the vacuum of space. One leak. One micrometeorite. One system failure."

"Then why do you stay?"

"Because some things are worth being scared for." She pointed at Earth. "That view. The science we do here. The idea that five kids in a homemade rocket can dock with us — that means the future is in good hands."

The kids spent six hours on the ISS. They ran experiments. They ate floating tortillas. They took a photo in the cupola with Earth behind them — five kids and one commander, floating in a tin can above the world.

That night, {childName}, remember the space station. Bravery isn't the absence of fear. It's waking up every morning in the scariest place imaginable and choosing to stay — because the work matters, the view is worth it, and the people beside you need you to be steady.`,
      },
      {
        id: 'rat_ep5_landing', episodeNumber: 5, title: 'Landing on a New World',
        subtitle: 'HOPE-3 reaches a new planet. But what they find changes everything.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Rocket Adventures · Episode 5',
        body: `It took three years. HOPE-3 was the biggest rocket yet — built not just by five kids, but by their entire town. The baker donated aluminium. The mechanic donated engines. The librarian donated books for the journey. Every person contributed something.

The destination: Kepler-442b. A planet orbiting a star four hundred light-years away. Scientists said it might support life. Nobody had ever been there.

Of course, the kids wouldn't really travel four hundred light-years. Dr. Anand had invented something called a fold drive — still experimental, still terrifying, still completely untested. It would compress space like folding a piece of paper, jumping from one point to another.

"If it works," Ravi said, "we'll be the first humans to visit another world."

"If it doesn't?" Omar asked.

Nobody answered that one.

The fold drive activated with a sound like the universe taking a deep breath. HOPE-3 shuddered. The stars outside stretched into lines. Then snapped back. And outside the window was a new sun, a new sky, and a planet — green and blue and swirling with white clouds.

"Kepler-442b," Suki whispered. "We're here."

They landed on a meadow of soft, blue-green grass. The air was breathable. The gravity was slightly lighter — they bounced when they walked. Two moons hung in a purple sky.

Leila sketched everything. Ravi measured the soil. Omar checked the atmosphere readings. Suki mapped the stars from this new position. And Jin walked ahead, quietly, toward a hill.

At the top of the hill, Jin stopped. And stared.

Below was a valley. And in the valley were structures. Not buildings exactly — more like grown shapes. Domes of woven plant material. Paths of smooth stone. Gardens arranged in spirals.

"Someone lives here," Jin said into the radio.

The team gathered on the hilltop. Nobody spoke.

Then, from the valley, a figure emerged. Not human. Smaller. Blue-green skin that shimmered like the grass. Large, dark eyes full of curiosity. It carried something in its hands — a small, glowing orb.

The figure stopped at the bottom of the hill and placed the orb on the ground. Then stepped back.

An offering. A greeting.

Jin looked at the team. "What do we do?"

Ravi said, "We could analyse it." Omar said, "We could scan for threats." Leila said, "We could document it."

But Jin walked down the hill alone. Slowly. Hands open. No tools. No weapons. Just a kid from Earth, walking toward someone new.

Jin sat down across from the figure. Picked up the orb. It was warm. Inside, lights swirled like tiny galaxies.

The figure pointed to itself, then to the orb, then to Jin. A gift.

Jin reached into a pocket and pulled out the one personal item brought from Earth — a small, folded drawing. A picture of five kids standing next to a rocket, drawn by Jin's little sister.

Jin placed it on the ground. The figure picked it up, studied it, and made a sound that could only be laughter.

That night — under alien stars, on a world no human had ever touched — five kids sat on blue-green grass and watched two moons rise. They had crossed the universe. And the first thing they did was share.

That night, {childName}, remember HOPE-3 and the new world. No matter how far you travel, no matter what you discover, the most important thing you can do when you arrive is offer something kind. A drawing. A smile. An open hand. Because the universe doesn't reward the strongest or the smartest. It rewards those who show up gently and say: "We come in peace. What can we share?"`,
      },
    ],
  },
  {
    id: 'who-would-win-animals',
    title: 'Who Would Win? — Animal Battles',
    icon: '🦁',
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fde68a 100%)',
    description: 'Two animals enter. One wins. But BOTH teach you something amazing. Real animal facts, epic showdowns, and a surprise ending every time.',
    ageRange: '4-8',
    totalEpisodes: 10,
    episodes: [
      {
        id: 'wwwa_ep1_lion_tiger', episodeNumber: 1, title: 'Lion vs Tiger',
        subtitle: 'The King of the Jungle meets the Striped Assassin.',
        tradition: 'universal', theme: 'courage', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 1',
        body: `Ladies and gentlemen, boys and girls, welcome to the ULTIMATE animal showdown!

In one corner — the LION! The King of the Jungle. Four hundred pounds of golden muscle with a mane so magnificent it looks like a crown made of fur. Lions live in Africa. They are the ONLY cats that live in groups — called prides. A male lion's roar can be heard from five miles away. FIVE. MILES. That is like standing at your school and hearing a roar from the mall.

In the other corner — the TIGER! The Striped Shadow. Six hundred pounds of orange and black power — even BIGGER than the lion. Tigers live in Asia. They hunt alone, at night, in total silence. A tiger can leap thirty feet in a single jump. That is the length of a school bus. And here is the secret weapon: tigers love water. They SWIM. Lions hate getting wet.

ROUND ONE: Strength. The tiger is heavier by two hundred pounds. Point to the tiger.

ROUND TWO: Teamwork. The lion fights in a group. Tigers fight alone. But this is a one-on-one battle, so... point to the tiger.

ROUND THREE: Speed. Both run about fifty miles per hour. A tie!

ROUND FOUR: Bite force. The tiger bites harder — one thousand and fifty pounds of force. The lion? six hundred and fifty. Point to the tiger.

So who would win?

Most animal experts say... the TIGER. It is bigger, bites harder, and fights solo every day of its life. The lion is brave — but the tiger is built for one-on-one combat.

BUT — and here is the important part — in real life, lions and tigers never meet. Lions live in Africa. Tigers live in Asia. They are both kings of their own worlds.

That night, {childName}, remember this: you do not have to beat everyone to be powerful. You just have to be the best version of yourself, in YOUR world.`,
      },
      {
        id: 'wwwa_ep2_scorpion_tarantula', episodeNumber: 2, title: 'Scorpion vs Tarantula',
        subtitle: 'Stinger meets Fangs. Two tiny nightmares, one winner.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 2',
        body: `Tonight's battle is CREEPY. CRAWLY. And absolutely COOL.

In one corner — the SCORPION! Eight legs, two crushing claws, and a tail with a venomous stinger curled over its back like a tiny sword. Scorpions have been on Earth for FOUR HUNDRED AND THIRTY MILLION years. That is before the dinosaurs. Before trees. Before almost everything. They glow in ultraviolet light — like tiny neon warriors in the dark.

In the other corner — the TARANTULA! Eight legs, eight eyes, and two massive fangs dripping with venom. Tarantulas are the BIGGEST spiders in the world — some are as big as a dinner plate. Their secret weapon? They can flick tiny barbed hairs from their belly at enemies. The hairs sting and itch like a thousand tiny needles.

ROUND ONE: Armour. The scorpion has a hard exoskeleton — like wearing a suit of armour. The tarantula is soft and squishy. Point to the scorpion.

ROUND TWO: Weapons. The scorpion has claws AND a stinger — two weapons! The tarantula has fangs and hair-flicking — also two weapons. A tie!

ROUND THREE: Venom. Most scorpion venom is mild — like a bee sting. Most tarantula venom is also mild. But the scorpion's stinger is FASTER. Point to the scorpion.

ROUND FOUR: Patience. Tarantulas can wait for HOURS without moving. Scorpions are ambush hunters too, but tarantulas are the champions of stillness. Point to the tarantula.

So who would win? In real battles — which DO happen in nature — the scorpion usually wins. Those claws grab the tarantula, hold it still, and the stinger strikes before the spider can bite.

WINNER: The scorpion!

That night, {childName}, remember: the scorpion wins not because it is bigger or scarier, but because it has a PLAN — grab first, sting second. In life, having a plan is more powerful than having strength.`,
      },
      {
        id: 'wwwa_ep3_cheetah_leopard', episodeNumber: 3, title: 'Cheetah vs Leopard',
        subtitle: 'The fastest cat alive meets the strongest climber.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 3',
        body: `They LOOK alike. Spots. Golden fur. Sleek bodies. But these two cats could not be more different.

In one corner — the CHEETAH! The fastest animal on land. Zero to seventy miles per hour in THREE SECONDS. That is faster than a sports car. A cheetah's body is built for speed — long legs, a flexible spine that stretches like a rubber band, and claws that grip the ground like running shoes. But here is the secret: cheetahs are LIGHT. Only a hundred and forty pounds. And they can only run fast for about thirty seconds before they overheat.

In the other corner — the LEOPARD! Not as fast — only thirty-six miles per hour — but STRONG. Insanely strong. A leopard can carry a dead antelope — heavier than itself — UP a tree. Straight up. Using only its mouth and legs. Leopards are built like bodybuilders. They hunt at night, in total darkness, and they can swim, climb, and fight anything their size.

ROUND ONE: Speed. Cheetah wins. Not even close.

ROUND TWO: Strength. Leopard wins. A leopard is nearly twice as strong pound for pound.

ROUND THREE: Fighting skills. Cheetahs almost NEVER fight. They run from lions, from leopards, even from hyenas. If they get injured, they cannot hunt — because their speed IS their survival. Leopards fight everything. They have been known to fight off baboons, hyenas, and even young lions. Massive point to the leopard.

ROUND FOUR: Endurance. The cheetah has thirty seconds of speed, then it is exhausted. The leopard can fight all night. Point to the leopard.

WINNER: The leopard. Speed is amazing, but in a fight, strength and toughness win.

That night, {childName}, remember this: being the fastest does not mean you are the strongest. And being the strongest does not mean you always need to fight. The cheetah survives by knowing when to RUN. The leopard survives by knowing when to STAND. Both are perfect for who they are.`,
      },
      {
        id: 'wwwa_ep4_shark_croc', episodeNumber: 4, title: 'Great White Shark vs Saltwater Crocodile',
        subtitle: "The ocean's top predator meets the river's ancient beast.",
        tradition: 'universal', theme: 'courage', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 4',
        body: `This one is LEGENDARY. Two of the most feared animals on the planet.

In one corner — the GREAT WHITE SHARK! Twenty feet long, five thousand pounds, and three hundred razor-sharp teeth arranged in rows — when one tooth breaks, another slides forward like a conveyor belt of DOOM. Great whites can smell a single drop of blood from a MILE away. They swim at twenty-five miles per hour and attack from below — shooting upward like a torpedo.

In the other corner — the SALTWATER CROCODILE! The largest reptile alive. Twenty-three feet long, two THOUSAND pounds, and the strongest bite force of ANY animal on Earth — three thousand seven hundred pounds per square inch. That is like having a car parked on your finger. Crocs have been around since the DINOSAURS. Two hundred million years of survival. Their armour skin is so tough that arrows bounce off.

ROUND ONE: Bite force. Croc wins — the strongest bite on the planet. The shark's bite is strong but only one-third as powerful.

ROUND TWO: Speed. In water, the shark wins — twenty-five versus eighteen miles per hour. On land? The croc can gallop at eleven miles per hour. The shark cannot walk at all. Split round.

ROUND THREE: Armour. The croc has thick bony plates under its skin. The shark has smooth skin with no protection. Point to the croc.

ROUND FOUR: Senses. The shark can detect electrical signals from other animals' heartbeats. The croc has incredible pressure sensors on its snout. Both are terrifying. Tie!

In deep water — the shark wins. It is faster, more agile, and attacks from below where the croc cannot defend.

In shallow water or on land — the croc wins. That bite, that armour, that death roll.

WINNER: It depends on WHERE they fight. Home advantage matters.

That night, {childName}, remember: where you are matters as much as who you are. A fish out of water struggles — but in its element, it flies.`,
      },
      {
        id: 'wwwa_ep5_eagle_owl', episodeNumber: 5, title: 'Golden Eagle vs Great Horned Owl',
        subtitle: 'Daytime hunter meets the silent night assassin.',
        tradition: 'universal', theme: 'patience', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 5',
        body: `Two rulers of the sky. One owns the day. One owns the night.

In one corner — the GOLDEN EAGLE! Seven-foot wingspan. Talons that grip with FOUR HUNDRED pounds of pressure — strong enough to crack a bowling ball. Golden eagles dive at TWO HUNDRED miles per hour — the fastest dive of any bird. They hunt rabbits, foxes, and even young deer. In Mongolia, people train golden eagles to hunt WOLVES.

In the other corner — the GREAT HORNED OWL! Called "the tiger of the sky." Not as big as the eagle — only four-foot wingspan — but its talons grip with THREE HUNDRED pounds of force. And here is the superpower: SILENCE. An owl's feathers have soft edges that break up air flow. It flies without making ANY sound. Zero. Nothing. Its prey never hears it coming.

ROUND ONE: Eyesight. The eagle sees eight times better than humans — it can spot a rabbit from two miles away. But the owl can see in almost TOTAL darkness. In daylight, eagle wins. At night, owl wins. Tie — depends on time.

ROUND TWO: Talons. Eagle grips harder — four hundred versus three hundred. Point to the eagle.

ROUND THREE: Stealth. The owl is completely silent. The eagle makes noise when it dives — wind rushing through feathers. If you cannot hear your attacker, you cannot defend. Massive point to the owl.

ROUND FOUR: Toughness. Great horned owls are fearless. They attack bald eagles, hawks, and even other owls. They have been known to steal nests from red-tailed hawks and just... move in. Point to the owl.

In the daytime — the eagle. In the nighttime — the owl. Neither would want to mess with the other.

WINNER: A tie! Each is unbeatable in their own time.

That night, {childName}, remember: you do not have to be great at EVERYTHING. Find YOUR time, YOUR strength, YOUR element — and own it completely.`,
      },
      {
        id: 'wwwa_ep6_gorilla_bear', episodeNumber: 6, title: 'Silverback Gorilla vs Grizzly Bear',
        subtitle: 'Raw power meets raw power. The heaviest hitters in nature.',
        tradition: 'universal', theme: 'courage', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 6',
        body: `Two of the most POWERFUL animals on land. No claws versus massive claws. Brains versus brute force.

In one corner — the SILVERBACK GORILLA! Four hundred pounds of pure muscle. A silverback can bench press FOUR THOUSAND pounds — ten times what the strongest human can lift. Their arms are six times stronger than a human's. They are also incredibly SMART — they use tools, solve puzzles, and communicate with over twenty different sounds. In the wild, silverbacks almost never fight. They beat their chests and roar to scare enemies away. Because when you are THAT strong, you do not need to prove it.

In the other corner — the GRIZZLY BEAR! EIGHT hundred pounds — twice the gorilla's weight. Six-inch claws that can tear through a car door. A bite that crushes bones. Grizzlies can run at thirty-five miles per hour — faster than a horse. And they have a layer of fat and muscle on their back so thick that even other bears have trouble hurting them.

ROUND ONE: Strength. The gorilla is stronger pound-for-pound. But the bear weighs TWICE as much. Raw total force? Point to the bear.

ROUND TWO: Intelligence. The gorilla is one of the smartest animals alive. The bear is clever but not in the same league. Point to the gorilla.

ROUND THREE: Weapons. The gorilla has fists and teeth. The bear has fists, teeth, AND six-inch razor claws. Big point to the bear.

ROUND FOUR: Endurance. Bears can fight for hours. Gorillas tire faster in combat. Point to the bear.

WINNER: The grizzly bear — by size, claws, and endurance. But the gorilla would put up the bravest fight of any animal its size.

That night, {childName}, remember the silverback: real strength is not about fighting. The gorilla beats its chest so it does NOT have to fight. The bravest thing is not throwing a punch — it is being strong enough to walk away.`,
      },
      {
        id: 'wwwa_ep7_cobra_mongoose', episodeNumber: 7, title: 'King Cobra vs Mongoose',
        subtitle: 'The deadliest snake meets its only enemy.',
        tradition: 'universal', theme: 'bravery', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 7',
        body: `This is the most UNFAIR battle in nature. And the small one wins.

In one corner — the KING COBRA! The longest venomous snake in the world — EIGHTEEN FEET. That is taller than a giraffe laid on its side. One bite delivers enough venom to kill an elephant. When threatened, it raises the front third of its body off the ground and spreads its hood — looking you straight in the eye. The king cobra's venom attacks the nervous system. One bite and your muscles stop working. Even your lungs stop breathing.

In the other corner — the MONGOOSE! Two feet long. Two pounds. Looks like a fuzzy sausage with legs. Cute little face. Tiny little paws.

This seems like no contest. Eighteen feet of venomous death versus a two-pound furball.

But here is the INCREDIBLE truth.

The mongoose wins. Almost every time.

HOW?

SECRET WEAPON NUMBER ONE: Speed. The mongoose has the fastest reaction time of any mammal. It can dodge a cobra strike — which happens in a fraction of a second — and bite the snake on the back of the head before it can strike again.

SECRET WEAPON NUMBER TWO: Resistance. The mongoose has a special mutation in its cells that makes it partially IMMUNE to cobra venom. A bite that would kill a human barely slows down a mongoose.

SECRET WEAPON NUMBER THREE: Strategy. The mongoose does not just attack. It DANCES. It jumps forward, jumps back, forward, back — tiring the cobra out. Each fake lunge makes the cobra strike and miss. When the cobra is exhausted... the mongoose strikes.

WINNER: The mongoose. Every. Single. Time.

That night, {childName}, remember the mongoose: size does not decide who wins. Speed, smarts, and never giving up — THAT decides who wins. The smallest creature in the fight can be the bravest.`,
      },
      {
        id: 'wwwa_ep8_whale_squid', episodeNumber: 8, title: 'Sperm Whale vs Giant Squid',
        subtitle: 'The deepest battle on Earth. A mile below the ocean surface.',
        tradition: 'universal', theme: 'courage', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 8',
        body: `This battle happens where NO human has ever seen it. A mile below the ocean. In total darkness. Freezing cold. Crushing pressure.

In one corner — the SPERM WHALE! The largest toothed animal that has EVER lived. Sixty feet long. Fifty tons. A head so massive it takes up one THIRD of its entire body — filled with a waxy oil called spermaceti that helps it dive to incredible depths. Sperm whales can dive to THREE THOUSAND feet — deeper than most submarines. They use echolocation — clicking sounds that bounce off objects — to "see" in the pitch dark.

In the other corner — the GIANT SQUID! Up to forty-three feet long — including tentacles. Eyes the size of DINNER PLATES — the largest eyes of any animal ever. Two long feeding tentacles lined with hundreds of suckers, and each sucker has a sharp, serrated ring — like a tiny circular saw. In the dark deep ocean, those tentacles reach out and grab.

This battle is REAL. We know because sperm whales are often found with giant sucker scars on their faces — circular cuts from the squid's tentacles. The squid fights back HARD.

ROUND ONE: Size. The whale is bigger — sixty feet versus forty-three, and twenty times heavier. Point to the whale.

ROUND TWO: Weapons. The squid has eight arms plus two long tentacles with razor suckers. The whale has massive jaws with teeth. The squid has more reach. Split.

ROUND THREE: Senses. Both can operate in pitch darkness. The whale uses sonar. The squid uses enormous eyes. Tie.

ROUND FOUR: The real battle. The whale dives deep, finds the squid with echolocation, and charges. The squid wraps its tentacles around the whale's head — slicing and gripping. But the whale's head is built for this — thick, tough, and enormous. Eventually the whale bites down and swallows the squid.

WINNER: The sperm whale — but those scars prove the squid never goes quietly.

That night, {childName}, remember: even when you are smaller and the odds are against you, fighting with everything you have leaves a mark. The squid's scars on the whale say: "I was here. I fought back."`,
      },
      {
        id: 'wwwa_ep9_rhino_hippo', episodeNumber: 9, title: 'Rhinoceros vs Hippopotamus',
        subtitle: 'Horn versus jaws. Two tanks of the African plains.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 9',
        body: `Two of the most DANGEROUS animals in Africa. They look slow and clumsy. They are anything but.

In one corner — the RHINOCEROS! Five thousand pounds. Two inches of armour-like skin. And a HORN — made of the same stuff as your fingernails — that can be two feet long and sharp as a spear. Rhinos charge at THIRTY miles per hour — five thousand pounds moving at thirty is like being hit by a small truck. Their eyesight is terrible — they can barely see past thirty feet — but their hearing and smell are extraordinary.

In the other corner — the HIPPOPOTAMUS! Four thousand pounds. But here is what most people do not know: the hippo is the DEADLIEST large animal in Africa. More people are killed by hippos than by lions, elephants, or crocodiles. Why? Because hippos are AGGRESSIVE. They are territorial. And their mouth opens ONE HUNDRED AND FIFTY degrees — wider than any other land animal. Their canine teeth are twenty inches long and sharp enough to bite a crocodile in HALF. They have actually done this.

ROUND ONE: Armour. The rhino's skin is thicker and tougher — nearly bulletproof. Point to the rhino.

ROUND TWO: Bite. The hippo's bite force is almost TWO THOUSAND pounds. The rhino does not really bite — it stabs with its horn. The hippo's jaws are terrifying. Point to the hippo.

ROUND THREE: Charge. The rhino is faster on land — thirty versus nineteen miles per hour. And that horn hits like a battering ram. Point to the rhino.

ROUND FOUR: Aggression. The hippo is more aggressive. It will chase boats, fight crocodiles, and charge at anything that enters its territory. Point to the hippo.

WINNER: On land, the rhino's charge and horn give it the edge. In water, the hippo dominates — it is faster, more agile, and those jaws are lethal. Most experts call it a DRAW — neither wants to mess with the other.

That night, {childName}, remember: the toughest creatures in the world know when NOT to pick a fight. The rhino and hippo live side by side in Africa — and they leave each other alone. That is not weakness. That is wisdom.`,
      },
      {
        id: 'wwwa_ep10_wolf_hyena', episodeNumber: 10, title: 'Grey Wolf vs Spotted Hyena',
        subtitle: 'The pack hunter meets the clan fighter. Team versus team.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 3,
        source: 'Who Would Win? Animal Battles · Episode 10',
        body: `This is not just a battle of two animals. This is a battle of two TEAMS.

In one corner — the GREY WOLF! A hundred and seventy-five pounds of lean, fast, intelligent hunting muscle. But the wolf's real power? The PACK. Wolves hunt in groups of six to ten. They communicate with howls, body language, and even facial expressions. A wolf pack is a FAMILY — led by a mother and father, with their children helping on every hunt. They take turns chasing prey, driving it toward teammates who are waiting in ambush. Wolf packs can take down animals TEN TIMES their size — moose, bison, even elk.

In the other corner — the SPOTTED HYENA! A hundred and forty pounds with the most powerful jaws of any mammal its size — ONE THOUSAND pounds of bite force. That is enough to crush bone. Hyenas eat EVERYTHING — meat, bone, hooves, teeth. Nothing is wasted. And hyenas live in CLANS of up to eighty members. Eighty! Led by females — the females are bigger and tougher than the males. Hyena clans defend their territory fiercely.

ROUND ONE: One-on-one. The wolf is bigger and faster. The hyena bites harder. But the wolf's agility and stamina give it the edge in a single fight. Slight point to the wolf.

ROUND TWO: Team tactics. Wolf packs are coordinated hunters — they have STRATEGY. Hyena clans are more of a mob — overwhelming with numbers. Point to the wolf for teamwork.

ROUND THREE: Endurance. Wolves can chase prey for miles at a steady pace. But hyenas can too — and hyenas can run at thirty-seven miles per hour for long distances. Tie.

ROUND FOUR: Numbers. A wolf pack is six to ten. A hyena clan is up to EIGHTY. In a group battle, the hyenas simply overwhelm the wolves. Point to the hyena.

WINNER: In a fair fight — small group versus small group — the wolves win. Their teamwork is unmatched. But in the real wild, hyena clans outnumber wolf packs — and numbers win wars.

That night, {childName}, remember both lessons: the wolves teach us that TEAMWORK beats raw power. The hyenas teach us that SHOWING UP in numbers makes you unstoppable. Either way, the lesson is the same: you are stronger together than alone.`,
      },
    ],
  },
];

