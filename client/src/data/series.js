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
// ─── 1. INDIA ──────────────────────────────────────────────
  {
    id: 'discover-india',
    title: '🇮🇳 Discover India',
    icon: '🇮🇳',
    gradient: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 40%, #4caf50 100%)',
    description: 'Fly across the land of spices, tigers, and ancient wonders — 5 bedtime adventures through incredible India.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'india_ep1_geo', episodeNumber: 1, title: 'The Land of India',
        subtitle: 'Fly over snowy mountains, golden deserts, and emerald jungles.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover India · Episode 1',
        body: `Close your eyes and imagine you are a bird — a great golden eagle soaring high above the Earth. Below you, a land shaped like a giant kite stretches out in every direction. Welcome to India.

Up in the north, you see the tallest mountains in the entire world — the Himalayas. Their peaks are white with snow, even in summer. They are so high that clouds float beneath them, not above. Somewhere down there, rivers are born — melting snow trickling into streams, streams joining into mighty rivers like the Ganges that flow thousands of miles to the sea.

Now fly south. The mountains give way to wide, flat plains where farmers grow rice and wheat in fields so green they glow. Golden mustard flowers stretch to the horizon. You can almost smell the earth after rain — Indians call that smell "petrichor," and they love it.

Keep going. The land turns dry and sandy — the Thar Desert, where camels walk in long lines and the sand dunes shift like golden waves. At night, the desert sky has more stars than you have ever seen.

Now turn east. Thick, tangled jungles appear — the Sundarbans, where Bengal tigers swim through mangrove forests. Yes, tigers that swim! The trees here grow right out of the water, their roots twisting like fingers.

Fly to the very bottom of the kite, and the land narrows to a point surrounded by warm, turquoise ocean. Palm trees line beaches that stretch for miles. Fishermen push colorful wooden boats into gentle waves every morning.

India is enormous — the seventh largest country on Earth. Over a billion people live here, more than almost any other country. From frozen mountains to tropical beaches, from roaring rivers to silent deserts, India holds almost every kind of landscape you can imagine, all in one place.

That night, {childName}, remember India's incredible land. One country can hold snow and sand, jungles and oceans, all at once. The world is bigger and more beautiful than we think — and every corner has a story waiting to be discovered.`,
      },
      {
        id: 'india_ep2_history', episodeNumber: 2, title: 'Stories From Long Ago',
        subtitle: 'Ancient cities, clever inventors, and the world\'s oldest stories.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover India · Episode 2',
        body: `Picture this — almost five thousand years ago, while most of the world was still living in simple huts, people in India built entire cities. Real cities, with straight roads, brick houses, and — here is the amazing part — indoor bathrooms with running water. This was the Indus Valley Civilization, one of the oldest in the world.

The people of these ancient cities were clever. They invented weights and measures so merchants could trade fairly. They carved tiny seals with pictures of animals — bulls, elephants, and a mysterious unicorn-like creature that nobody has fully explained to this day.

Centuries later, India gave the world one of its greatest gifts — the number zero. Before zero, math was very difficult. Imagine trying to write the number one hundred without a zero. It was an Indian mathematician named Aryabhata who helped the world count, calculate, and eventually build everything from bridges to computers. Every time you see a zero, you can thank ancient India.

India is also the birthplace of some of the world's oldest stories. The Ramayana and the Mahabharata are epic tales of princes, adventures, loyalty, and wisdom. They were first told around campfires thousands of years ago and are still loved today — turned into plays, cartoons, and movies.

Great teachers walked this land too. The Buddha sat under a Bodhi tree in India and discovered ideas about kindness and peace that spread across all of Asia. Emperor Ashoka, who once fought terrible battles, became so sorry for the suffering he caused that he spent the rest of his life planting trees, building hospitals, and spreading messages of peace carved into stone pillars — some of which still stand today.

India's history is like a river that never stops flowing — ancient wisdom pouring into the modern world every single day.

That night, {childName}, remember India's story. People thousands of years ago dreamed, invented, and created things we still use today. Every big idea starts with one curious mind — and your mind is just as powerful as theirs.`,
      },
      {
        id: 'india_ep3_places', episodeNumber: 3, title: 'Wonders of India',
        subtitle: 'The Taj Mahal, golden temples, and palaces that float on lakes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover India · Episode 3',
        body: `Imagine standing in front of a building so beautiful that people cry when they first see it. That is the Taj Mahal. It sits in the city of Agra, made entirely of white marble that changes color throughout the day — pinkish at dawn, blazing white at noon, and golden when the sun sets. An emperor named Shah Jahan built it almost four hundred years ago as a monument of love for his wife. Twenty thousand workers spent twenty-two years creating it. Every inch is covered in delicate flower patterns carved into the stone, some with real gemstones pressed inside.

Now travel north to Amritsar, where the Golden Temple glows like a jewel floating on water. Its walls are covered in real gold, and it sits in the middle of a shimmering pool called the Pool of Nectar. The most wonderful thing about this temple is its kitchen — it feeds over one hundred thousand people every single day, for free. Anyone can walk in, sit on the floor, and receive a warm meal, no matter who they are.

Fly to the deserts of Rajasthan and you will find forts and palaces that look like they belong in fairy tales. The Hawa Mahal, the Palace of Winds, has nine hundred and fifty-three tiny windows so the queens could watch the streets below without being seen. In Udaipur, a white marble palace seems to float on a lake, its reflection shimmering in the still water.

In southern India, temples rise like mountains, covered from top to bottom in thousands of colorful statues of gods, animals, and dancers. The Meenakshi Temple has over thirty-three thousand sculptures, each one hand-carved and painted in bright blues, greens, yellows, and reds.

And deep in the hills of Maharashtra, ancient monks carved entire temples out of solid rock at Ajanta and Ellora — no bricks, no cement, just rock chiseled away to reveal pillars, statues, and halls inside the mountain itself.

That night, {childName}, remember India's wonders. People built incredible things not with machines, but with patience, love, and bare hands. Anything you build with care and heart becomes something the world will remember.`,
      },
      {
        id: 'india_ep4_culture', episodeNumber: 4, title: 'Colors, Spices & Celebrations',
        subtitle: 'Festivals of light, plates of flavor, and kids who love cricket.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover India · Episode 4',
        body: `If India had one word to describe itself, it might be "colorful." Everything in India bursts with color — the clothes, the food, the festivals, the trucks, even the rickshaws painted with flowers and movie stars.

Let us start with festivals. During Holi, the Festival of Colors, people run through the streets throwing powdered colors at each other — pink, yellow, blue, green — until everyone is covered head to toe in a rainbow. Strangers hug. Enemies become friends. Nobody cares about being neat. It is pure, joyful chaos.

Then there is Diwali, the Festival of Lights. Families line their homes with tiny clay lamps called diyas, turning every street into a river of golden light. Children set off sparklers and eat sweets, and the whole country glows like a sky full of earthbound stars.

Now, the food. Oh, the food! India uses more spices than almost any country on Earth — turmeric that turns everything golden, cumin that smells like warm earth, cardamom that tastes like a sweet forest. A single meal might have ten different dishes on one round metal plate called a thali — rice, lentil soup called dal, crispy bread called roti, spicy vegetable curries, tangy pickles, cool yogurt, and something sweet to finish.

Indian kids love cricket the way some kids love soccer. In every street, park, and empty lot, you will find children playing cricket with whatever they have — a proper bat or a plank of wood, a real ball or a taped-up tennis ball. When India wins a big cricket match, the entire country celebrates like it is a holiday.

India has over twenty-two official languages and hundreds more. A child in the north might speak Hindi, while a child in the south speaks Tamil — completely different languages. Yet they are all Indian, united by a love of family, food, festivals, and telling stories.

That night, {childName}, remember India's colors and flavors. The world is richer when we celebrate our differences. Every language, every festival, every spice adds something beautiful to the great big recipe of life.`,
      },
      {
        id: 'india_ep5_facts', episodeNumber: 5, title: 'Amazing India',
        subtitle: 'World records, surprising facts, and things that make you say "wow!"',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover India · Episode 5',
        body: `Get ready, because India is full of facts that will make your eyes go wide.

Did you know that India has the largest postal system in the entire world? Over one hundred and fifty thousand post offices — more than any other country. There is even a floating post office on a lake in Kashmir, bobbing gently on the water while postal workers sort letters inside.

Here is another one — India is home to the wettest place on Earth. A tiny village called Mawsynram gets so much rain that people carry umbrellas made from entire banana leaves. It rains almost every single day, and the forests there are so green they seem to glow.

India launched a spacecraft to Mars — and it cost less than the budget of many Hollywood movies. The Indian Space Research Organisation did it on their very first try, something even some of the richest countries in the world had not managed before.

The country has a bridge made entirely of living tree roots. In the northeast, the Khasi people train the roots of rubber trees to grow across rivers, weaving them together over years until they form bridges strong enough to hold fifty people. These living bridges get stronger as they age, not weaker.

India is home to the snow leopard, the one-horned rhinoceros, the king cobra, and the Asiatic lion — animals found nowhere else on Earth in the wild. The country has over five hundred wildlife sanctuaries protecting these incredible creatures.

And here is one more — the game of chess was invented in India. It was originally called Chaturanga, and it was played by Indian kings and queens over fifteen hundred years ago. So every time someone says "checkmate," they are using a word that traces back to ancient India.

From floating post offices to living bridges, from Mars missions to the invention of chess, India is a land where the extraordinary is ordinary.

That night, {childName}, remember India's amazing facts. The world is full of wonders hiding in plain sight. Stay curious, keep asking "did you know?" — and you will never run out of incredible things to discover.`,
      },
    ],
  },

  // ─── 2. CANADA ─────────────────────────────────────────────
  {
    id: 'discover-canada',
    title: '🇨🇦 Discover Canada',
    icon: '🇨🇦',
    gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 50%, #ffffff 100%)',
    description: 'Journey through maple forests, frozen tundras, and friendly cities — 5 bedtime adventures across the Great White North.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'canada_ep1_geo', episodeNumber: 1, title: 'The Land of Canada',
        subtitle: 'Endless forests, frozen lakes, and mountains touching the sky.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Canada · Episode 1',
        body: `Close your eyes and imagine flying over the second largest country on Earth. Below you, forests stretch so far they seem to go on forever — dark green spruce and pine trees, millions and millions of them, covering the land like a thick, soft blanket. Welcome to Canada.

Canada is enormous. If you drove from one side to the other without stopping, it would take you over five days. The country stretches from the Atlantic Ocean in the east to the Pacific Ocean in the west, and all the way up to the Arctic Ocean in the north, where polar bears walk on sea ice under skies that shimmer with green and purple northern lights.

In the west, the Rocky Mountains rise like giant stone teeth. Their peaks are covered in snow and glaciers — rivers of ice that have been slowly sliding downhill for thousands of years. Turquoise lakes sit at the base of these mountains, their water so blue-green it looks like someone poured melted gemstones into the valleys. Lake Louise and Moraine Lake are so beautiful that people travel from all over the world just to sit beside them and stare.

Canada has more lakes than all other countries in the world combined. Over two million lakes! Some are so big they look like oceans. The Great Lakes along the southern border hold one-fifth of all the fresh water on Earth's surface.

Travel north and the trees thin out, then disappear entirely. This is the tundra — a vast, flat, frozen land where the ground stays frozen even in summer. It looks empty, but caribou travel across it in herds of thousands, and Arctic foxes with fur as white as snow hunt quietly in the silence.

On the east coast, massive icebergs float past the shores of Newfoundland — chunks of ancient ice that broke off glaciers in Greenland and drifted south. Some are as tall as ten-story buildings, glowing blue and white in the sunlight.

That night, {childName}, remember Canada's vast land. A country of forests and ice, lakes and mountains, stretching wider than you can imagine. Nature built something magnificent here — and it is still wild, still free, still waiting to be explored.`,
      },
      {
        id: 'canada_ep2_history', episodeNumber: 2, title: 'Stories From Long Ago',
        subtitle: 'First peoples, fur traders, and the building of a nation.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Canada · Episode 2',
        body: `Long before Canada had a name, this land belonged to the Indigenous peoples — the First Nations, Inuit, and Métis — who had lived here for over fifteen thousand years. They knew every river, every forest trail, every animal by name and habit.

The Haida people of the Pacific coast carved towering totem poles from giant cedar trees, each pole telling the story of a family — their history, their spirit animals, their dreams. These poles still stand today, some taller than a four-story building, their painted faces watching over the misty coastline.

In the Arctic, the Inuit built igloos from blocks of packed snow — and here is the surprising part — it was warm inside. Body heat and a small oil lamp could raise the temperature inside an igloo to a cozy level, even when it was forty degrees below zero outside. The Inuit also invented the kayak, a sleek, fast boat made from animal skins stretched over a wooden frame, perfect for hunting seals in icy waters.

When European explorers arrived — first the French, then the British — they found a land rich in beaver fur. Beaver fur hats were the most fashionable thing in Europe, and fur trading became a massive business. French and British traders built forts and trading posts, and slowly, towns grew around them — Québec City, Montréal, Halifax.

In 1867, four provinces joined together to form a new country called Canada. It was not born from war but from conversation — people sitting around tables, talking, arguing politely, and eventually agreeing. Over time, more provinces and territories joined, stretching the country from sea to sea to sea.

Canada also built a railway across the entire country — thousands of miles of track through mountains, forests, and prairies. Workers from all over the world, including thousands of brave Chinese laborers, blasted through solid rock to connect the east coast to the west. It was one of the greatest building projects of its time.

That night, {childName}, remember Canada's story. A nation built by many peoples — Indigenous wisdom, French and British traditions, and immigrants from every corner of the globe — all woven together like threads in a great, warm blanket.`,
      },
      {
        id: 'canada_ep3_places', episodeNumber: 3, title: 'Wonders of Canada',
        subtitle: 'Thundering waterfalls, sky-high towers, and castles in the mountains.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Canada · Episode 3',
        body: `Imagine standing at the edge of a cliff, and below you, a wall of water wider than ten football fields crashes down with a roar so loud you cannot hear the person next to you. This is Niagara Falls, one of the most powerful waterfalls on Earth. Every second, more than seven hundred thousand gallons of water thunder over the edge. The mist rises so high it creates permanent rainbows in the sunlight. People come from everywhere just to stand in that mist and feel the power of nature shaking the ground beneath their feet.

Now fly west to the Rocky Mountains, where the Fairmont Banff Springs Hotel rises from the forest like a castle from a fairy tale. Built over a hundred years ago, this enormous stone hotel has turrets, towers, and over seven hundred rooms nestled between snow-capped peaks. Guests can look out their windows and see elk grazing on the lawn.

In Toronto, the CN Tower stretches five hundred and fifty-three meters into the sky — it was the tallest freestanding structure in the world for over thirty years. The bravest visitors can walk on a glass floor high above the city, looking straight down through their feet at the tiny streets below. Some even walk along the outside edge, attached to a harness, with nothing but air between them and the ground far, far below.

Travel to the east coast and you will find the Bay of Fundy, where the tides are the highest on the planet. The water rises and falls over twelve meters twice a day — imagine a four-story building appearing and disappearing with the tide. At low tide, you can walk on the ocean floor among strange, mushroom-shaped rocks carved by centuries of water.

In the far north, the historic Inuit village of Ivvavik sits where rivers meet the Arctic Ocean. And in Québec City, the old walled town looks like a piece of Europe dropped into North America — cobblestone streets, stone buildings, and the grand Château Frontenac perched on a cliff above the Saint Lawrence River.

That night, {childName}, remember Canada's wonders. From thundering water to glass floors in the sky, this country reminds us that adventure is always waiting — you just have to step outside and look up.`,
      },
      {
        id: 'canada_ep4_culture', episodeNumber: 4, title: 'Maple Syrup, Hockey & Kindness',
        subtitle: 'Sweet syrup, fast skates, and the friendliest people on Earth.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Canada · Episode 4',
        body: `If there is one thing Canada is famous for, it might be maple syrup. Every spring, when the days get warm but the nights are still cold, maple trees start pushing sweet sap up through their trunks. Farmers drill tiny holes in the trees, collect the sap in buckets, and boil it down into thick, golden maple syrup. It takes about forty liters of sap to make just one liter of syrup — that is why it is so precious. Canada makes over seventy percent of all the maple syrup in the world. Pancakes have never been the same.

Now, hockey. Canadians love hockey the way the sun loves shining — it is simply part of who they are. In winter, kids across the country lace up their skates and play on frozen ponds, backyard rinks, and neighborhood arenas. The crack of a hockey stick, the scrape of blades on ice, the cheer when a puck hits the net — these are the sounds of a Canadian winter. The sport was born here, and Canadians have played it with passion for over a hundred and fifty years.

Canada is officially bilingual — people speak both English and French. In the province of Québec, almost everyone speaks French. Street signs, school lessons, songs on the radio — all in French. It gives Canada a unique flavor, like a country with two hearts beating in two languages.

Canadians are known around the world for being polite and kind. The joke is that Canadians say "sorry" even when someone bumps into them. But it is not just politeness — Canada welcomes more immigrants and refugees per capita than almost any country on Earth. People arrive from Syria, India, the Philippines, Nigeria, and dozens of other countries, and they find communities ready to help them start new lives.

Children in Canada grow up with poutine — french fries covered in cheese curds and hot gravy — butter tarts, Nanaimo bars, and Tim Hortons hot chocolate on cold mornings. They go camping in summer, skating in winter, and say "eh" at the end of sentences without even noticing.

That night, {childName}, remember Canada's warmth. A country that proves you can be strong and gentle at the same time, that sweetness — in syrup and in spirit — is something worth sharing with the world.`,
      },
      {
        id: 'canada_ep5_facts', episodeNumber: 5, title: 'Amazing Canada',
        subtitle: 'Polar bears, dinosaur bones, and the longest coastline on Earth.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Canada · Episode 5',
        body: `Ready for some facts about Canada that will blow your mind? Let us go.

Canada has the longest coastline of any country in the world. If you walked along every twist and turn of Canada's shore, it would take you over two hundred and forty thousand kilometers — that is six times around the entire Earth. You could walk for your whole life and never see it all.

In the town of Churchill, Manitoba, polar bears wander right through town every autumn. They are waiting for the ice on Hudson Bay to freeze so they can go hunting for seals. Churchill is called the Polar Bear Capital of the World, and they have special "bear patrol" officers who gently guide bears away from schools and houses.

Canada is hiding one of the greatest dinosaur graveyards on the planet. In the badlands of Alberta, a place called Dinosaur Provincial Park has produced more dinosaur fossils than almost anywhere on Earth — over forty different species, including the mighty Tyrannosaurus Rex and the duck-billed Hadrosaur.

Here is a wild one — there is a lake in Canada that has an island, and on that island there is a lake, and in that lake there is another island. It is like nature's version of a nesting doll, found on Victoria Island in the Arctic.

The Canadian territory of Nunavut is larger than Western Europe, but fewer than forty thousand people live there. That means there is so much open space that a person could walk for days and see nothing but tundra, caribou, and sky.

Canada invented basketball. A Canadian teacher named James Naismith created the game in 1891 using a soccer ball and two peach baskets nailed to a gym balcony. He just wanted a fun indoor game for winter — and accidentally created one of the most popular sports on Earth.

And the northern lights — the aurora borealis — dance across Canadian skies in ribbons of green, purple, and pink, especially in the Yukon and Northwest Territories. Indigenous peoples have told stories about these lights for thousands of years.

That night, {childName}, remember Canada's surprises. Even the quietest, coldest places on Earth are full of wonders. Keep exploring — the best facts are the ones you have not found yet.`,
      },
    ],
  },

  // ─── 3. UNITED STATES ──────────────────────────────────────
  {
    id: 'discover-united-states',
    title: '🇺🇸 Discover United States',
    icon: '🇺🇸',
    gradient: 'linear-gradient(135deg, #1565c0 0%, #e53935 50%, #ef5350 100%)',
    description: 'Coast to coast across America — 5 bedtime adventures through a land of big dreams and even bigger landscapes.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'usa_ep1_geo', episodeNumber: 1, title: 'The Land of America',
        subtitle: 'From purple mountains to golden plains, sea to shining sea.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United States · Episode 1',
        body: `Close your eyes and imagine soaring like an eagle from one ocean to another. Below you stretches the United States of America — a land so big and so different from place to place that it feels like fifty countries stitched together into one.

Start on the east coast, where the Appalachian Mountains roll gently through morning mist. These mountains are ancient — some of the oldest on Earth — worn soft and round by hundreds of millions of years of wind and rain. In autumn, their forests explode into red, orange, and gold, like the whole land is on fire with color.

Fly west over the Great Plains — an ocean of grass stretching flat to the horizon. Farmers grow enough wheat and corn here to feed much of the world. In summer, thunderstorms march across the plains like giants, with lightning bolts as tall as skyscrapers and thunder that shakes the ground.

Keep going and the Rocky Mountains rise up suddenly — sharp, jagged, and covered in snow. These are young mountains, still growing, still wild. Grizzly bears fish in their rivers. Mountain goats balance on cliffs so steep they seem impossible.

Now something magical — the deserts of the Southwest. The Grand Canyon, carved by the Colorado River over millions of years, is so deep and wide that you could fit an entire city inside it. The rock layers glow red, orange, pink, and purple, each layer a different chapter of Earth's history going back almost two billion years.

Fly to the Pacific coast, where giant redwood trees grow taller than the Statue of Liberty. These trees have been alive for over two thousand years — they were already old when the Roman Empire existed.

And do not forget the surprises — Hawaii's volcanic islands in the middle of the Pacific Ocean, where lava meets the sea in clouds of steam, and Alaska's vast wilderness, where glaciers calve icebergs into fjords under the midnight sun.

That night, {childName}, remember America's landscapes. One country holds ancient mountains and young canyons, endless plains and tropical islands. The Earth is an artist, and America is one of its biggest canvases.`,
      },
      {
        id: 'usa_ep2_history', episodeNumber: 2, title: 'Stories From Long Ago',
        subtitle: 'First peoples, bold dreamers, and the idea that changed the world.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United States · Episode 2',
        body: `Long before there were roads or cities, this land was home to hundreds of Indigenous nations, each with their own language, stories, and way of life. The Navajo wove rugs with patterns that told the story of the Earth. The Lakota followed great herds of bison across the plains, using every part of the animal and wasting nothing. The Haudenosaunee — the Iroquois — created a system of government where leaders were chosen by the people, an idea so good that it later inspired the founders of the United States.

In the Pacific Northwest, nations like the Tlingit and Kwakwaka'wakw carved magnificent totem poles and held great feasts called potlatches, where the wealthiest families showed their generosity by giving everything away. To them, true richness was not how much you kept, but how much you shared.

Centuries later, people from many different countries began arriving. They came for many reasons — for freedom, for opportunity, for a fresh start. In 1776, a group of colonists wrote a document called the Declaration of Independence, which said something revolutionary — that all people are created equal and deserve life, liberty, and the pursuit of happiness. It was a bold idea, and the country has spent the centuries since trying to live up to it.

Not everyone was treated equally at first. It took brave people — like Harriet Tubman, who led enslaved people to freedom along secret routes called the Underground Railroad, and like the many who marched and spoke out for civil rights — to push the country closer to its own promise.

Immigrants kept coming — from Ireland, Italy, China, Mexico, and every other corner of the Earth — each group adding their food, their music, their stories to the American quilt. The country grew, made mistakes, learned, and kept reaching forward.

That night, {childName}, remember America's story. It is not a finished tale — it is one still being written. And the most important part of any country's story is what its people choose to do next. Including you.`,
      },
      {
        id: 'usa_ep3_places', episodeNumber: 3, title: 'Wonders of America',
        subtitle: 'Lady Liberty, the Grand Canyon, and a mountain with four faces.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United States · Episode 3',
        body: `Imagine sailing into New York Harbor on a ship, tired from a long journey, and seeing her for the first time — the Statue of Liberty. She stands over ninety meters tall, her green copper skin gleaming, her torch held high above the water. For millions of immigrants arriving in America, she was the first thing they saw — a giant woman saying "welcome." France gave her to America as a gift of friendship in 1886, and she has been standing there ever since, watching over the harbor.

Now fly west to South Dakota, where four enormous faces are carved into the side of a granite mountain. Mount Rushmore shows the faces of four presidents — Washington, Jefferson, Roosevelt, and Lincoln — each face about eighteen meters tall. Workers spent fourteen years blasting and carving the rock. From far away it looks like the mountain itself is staring at you.

Down in Arizona, the Grand Canyon takes your breath away. It is over four hundred kilometers long, up to twenty-nine kilometers wide, and more than a mile deep. Stand at the edge and you feel tiny — a speck on the rim of something the Earth spent six million years creating. Ravens soar through the canyon on warm air currents, and far below, the Colorado River looks like a thin green ribbon.

In Washington, D.C., the capital, the Lincoln Memorial glows white at night. Inside, a giant marble Abraham Lincoln sits in a chair, looking out over a long reflecting pool. People come here to remember and to dream — it is where Martin Luther King Jr. gave his famous "I Have a Dream" speech to hundreds of thousands of people.

On the west coast, the Golden Gate Bridge stretches across the entrance to San Francisco Bay, its orange-red towers disappearing into the famous fog. And in the middle of the Pacific, Hawaii's volcanoes still erupt, adding new land to the Earth — the islands are literally still growing.

That night, {childName}, remember America's wonders. People carved mountains and built bridges, but nature carved canyons and built volcanoes. The best things in this world are made by humans and nature working together — or sometimes, just by nature showing off.`,
      },
      {
        id: 'usa_ep4_culture', episodeNumber: 4, title: 'Music, Movies & Apple Pie',
        subtitle: 'Jazz, pizza slices, basketball, and a country made of many cultures.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United States · Episode 4',
        body: `America is a country where a kid can eat tacos for lunch, sushi for dinner, and apple pie for dessert — all in the same town. That is because people from every country in the world live here, and they brought their food, their music, and their traditions with them.

Let us talk about music first, because America gave the world some of its greatest sounds. Jazz was born in New Orleans, where African American musicians blended African rhythms, blues melodies, and pure improvisation into something the world had never heard before. Rock and roll came from the same roots, electrified and amplified until it shook entire stadiums. Hip hop started on the streets of the Bronx in New York, where DJs and poets turned turntables and microphones into instruments of storytelling.

American kids grow up with sports woven into their lives. Basketball was invented here — remember, by a Canadian teacher! — and today, kids shoot hoops on driveways and playground courts in every state. Baseball is called "America's pastime," with hot dogs and peanuts at the ballpark on summer evenings. And on Friday nights in small towns, entire communities come together to watch high school football under the lights.

Hollywood, in Los Angeles, is where most of the world's favorite movies are made. From animated adventures to superhero stories, the dreams cooked up in California travel to every screen on the planet.

American food is a delicious mix of everything. New York pizza with its thin, foldable slices. Southern fried chicken and cornbread. Texas barbecue smoked low and slow for hours. Clam chowder in bread bowls in San Francisco. And the classic — a cheeseburger with fries, invented right here and now loved worldwide.

One thing that ties it all together is a simple idea — that no matter where your family came from, you belong here. The country is not perfect at this, but the dream remains: many people, many traditions, one shared home.

That night, {childName}, remember America's blend of cultures. The most beautiful music happens when different instruments play together. And the most delicious life is one where you taste, listen to, and learn from as many cultures as you can.`,
      },
      {
        id: 'usa_ep5_facts', episodeNumber: 5, title: 'Amazing America',
        subtitle: 'Moon landings, supervolcanoes, and a river that flows backwards.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United States · Episode 5',
        body: `Hold on tight, because the United States is packed with facts that sound made up — but are completely true.

In 1969, American astronauts became the first humans to walk on the Moon. Neil Armstrong stepped onto the dusty surface and said, "That's one small step for man, one giant leap for mankind." The American flag they planted is still up there, though scientists say the sun has bleached it completely white by now.

Underneath Yellowstone National Park sits a supervolcano — a magma chamber so enormous that if it ever erupted, it could cover half the country in ash. But do not worry — it has not erupted in over six hundred thousand years, and scientists watch it very carefully. In the meantime, Yellowstone puts on a wonderful show — Old Faithful, a geyser that shoots boiling water over forty meters into the air almost every ninety minutes, like clockwork.

The Mississippi River is one of the longest rivers in the world, stretching over three thousand seven hundred kilometers from Minnesota to the Gulf of Mexico. During a massive earthquake in 1812, witnesses said the river appeared to flow backwards for several hours. The shaking was so powerful it created new lakes overnight.

Alaska, the largest state, is so big that if you placed it on top of the lower forty-eight states, it would stretch from coast to coast. Yet it has fewer people than most American cities.

The Library of Congress in Washington, D.C. is the largest library in the world, with over one hundred and seventy million items — books, maps, recordings, photographs. If you read five books a day, it would take you over ninety thousand years to read them all.

And here is a sweet one — Americans eat about one hundred acres of pizza every single day. That is roughly the size of ninety football fields, covered in cheese, sauce, and toppings, devoured in twenty-four hours.

That night, {childName}, remember America's surprises. A country that walked on the Moon, sits on a supervolcano, and eats ninety football fields of pizza a day. Dream big, stay curious, and never stop reaching — even if what you are reaching for is the Moon itself.`,
      },
    ],
  },

  // ─── 4. UNITED KINGDOM ─────────────────────────────────────
  {
    id: 'discover-united-kingdom',
    title: '🇬🇧 Discover United Kingdom',
    icon: '🇬🇧',
    gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #c62828 100%)',
    description: 'Castles, kings, and cozy countryside — 5 bedtime adventures through England, Scotland, Wales, and Northern Ireland.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'uk_ep1_geo', episodeNumber: 1, title: 'The Land of the United Kingdom',
        subtitle: 'Rolling green hills, misty highlands, and an island full of surprises.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United Kingdom · Episode 1',
        body: `Close your eyes and imagine flying over a group of islands in the North Atlantic, where the land is green in a hundred different shades and the sky changes its mood every hour. Welcome to the United Kingdom — a small country with a very big personality.

The United Kingdom is actually four countries in one — England, Scotland, Wales, and Northern Ireland — all joined together under one flag and one crown. Imagine four siblings sharing one house, each with their own room and their own character.

England, the largest, is a patchwork of gentle, rolling hills, golden wheat fields, and hedge-lined lanes. In the south, white chalk cliffs drop straight into the English Channel — the famous White Cliffs of Dover, gleaming like a wall of snow against the grey-blue sea. London, the capital, sits on the River Thames, a city of eight million people, red buses, and old stone buildings standing shoulder to shoulder with glass skyscrapers.

Fly north into Scotland, and the landscape turns wild. The Scottish Highlands are rugged mountains, deep glens, and misty lochs — that is the Scottish word for lakes. Loch Ness, the most famous of all, is so deep and dark that people have wondered for centuries whether a mysterious creature lives in its waters. The hills here are covered in purple heather in late summer, and eagles circle overhead.

Wales, to the west, is a land of green valleys, ancient castles, and a language so old it was spoken before English even existed. Welsh words look impossible to pronounce — Llanfairpwllgwyngyll is the name of an actual town — but the sound of Welsh is musical and beautiful.

Northern Ireland has its own magic — the Giant's Causeway, where forty thousand columns of dark rock step down into the sea like a staircase built by a giant. Legend says an Irish giant named Finn McCool built it to walk across the sea to Scotland.

Despite being an island smaller than many American states, the United Kingdom packs in an astonishing variety of landscapes — from moorlands to sea cliffs, from gentle rivers to fierce highland storms.

That night, {childName}, remember the United Kingdom's green and misty land. Even a small place can hold enormous wonders. It is not the size of the country that matters — it is the depth of its stories.`,
      },
      {
        id: 'uk_ep2_history', episodeNumber: 2, title: 'Stories From Long Ago',
        subtitle: 'Ancient stones, brave queens, and a playwright who changed words forever.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United Kingdom · Episode 2',
        body: `Five thousand years ago, long before anyone wrote a single word in English, ancient people in Britain dragged enormous stones across miles of countryside and stacked them in a circle on a wide, windy plain. That circle is Stonehenge, and to this day, nobody knows exactly how they moved stones weighing as much as four elephants, or why they arranged them to line up perfectly with the sunrise on the longest day of the year.

The Romans came next, building roads so straight you can still drive on some of them today. They built Hadrian's Wall across the north of England — a stone wall stretching over a hundred kilometers, built to mark the edge of their empire. Roman soldiers stood on that wall and looked north into the wild unknown, wondering what was out there.

In medieval times, England, Scotland, and Wales were lands of kings, queens, and castles. Over a thousand castles were built across Britain — stone fortresses with moats, drawbridges, and towers. Some were built by Norman invaders who crossed the English Channel in 1066 and changed the country forever. The Tower of London, almost a thousand years old, has been a palace, a prison, and a zoo — and today it still holds the Crown Jewels, guarded by ravens. Legend says that if the ravens ever leave the Tower, the kingdom will fall. So the ravens are very well fed.

Queen Elizabeth the First ruled England for forty-five years and was so clever that she spoke six languages and outsmarted kings and princes who underestimated her. During her reign, a playwright named William Shakespeare wrote plays so powerful that people still perform them today, over four hundred years later. He invented over seventeen hundred words that we use every day — including "eyeball," "lonely," and "bedroom."

The United Kingdom also led the Industrial Revolution, building the first steam engines, railways, and factories. For better and worse, this tiny island changed the way the entire world works, travels, and builds.

That night, {childName}, remember Britain's long story. From mysterious stones to words we speak every day, the past is never really gone — it lives in the roads we walk, the words we say, and the stories we tell before bed.`,
      },
      {
        id: 'uk_ep3_places', episodeNumber: 3, title: 'Wonders of Britain',
        subtitle: 'Big Ben, Edinburgh Castle, and a clock that keeps the world on time.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United Kingdom · Episode 3',
        body: `Imagine standing beside the River Thames in London at night. The Houses of Parliament glow golden, and beside them, the Elizabeth Tower rises into the dark sky — home to Big Ben, one of the most famous clocks in the world. Big Ben is actually the name of the giant bell inside, not the tower. It weighs over thirteen tons and has been chiming on the hour since 1859. Its deep, resonant bong travels across the city and is broadcast on the radio so people can set their watches by it.

Cross the river and you will see the Tower Bridge, a magnificent blue and white bridge that can split in half and lift up to let tall ships pass through. When it opens, traffic stops and people stare — it is like watching a giant do a slow-motion stretch.

Now travel north to Edinburgh, Scotland's capital, where a medieval castle sits on top of an extinct volcano right in the middle of the city. Edinburgh Castle has watched over the town for over a thousand years. At one o'clock every afternoon, a cannon fires from its walls — a tradition so old that people set their watches by it, just like Big Ben.

In the English countryside, the University of Oxford has been teaching students for over nine hundred years. Its golden stone buildings look like something from a fantasy novel — in fact, the dining hall of Christ Church College was used as inspiration for the Great Hall in the Harry Potter films.

Speaking of Harry Potter — if you visit Platform Nine and Three-Quarters at King's Cross Station in London, you will find a luggage trolley half-embedded in the wall, as if someone is about to push through to a magical world. Thousands of people visit it every day.

In Bath, ancient Roman baths still steam with naturally hot water that rises from deep underground. People bathed here two thousand years ago, and the green, steaming pools remain, surrounded by Roman columns and statues.

And on a tiny island off the coast of Cornwall, St Michael's Mount rises from the sea — a fairy-tale castle on a tidal island, reachable on foot only when the tide is out.

That night, {childName}, remember Britain's wonders. A country where cannons tell the time, castles sit on volcanoes, and a luggage trolley promises that magic might be real — if you just believe enough to push through the wall.`,
      },
      {
        id: 'uk_ep4_culture', episodeNumber: 4, title: 'Tea, Football & Fish and Chips',
        subtitle: 'Afternoon tea, the beautiful game, and stories that enchanted the world.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United Kingdom · Episode 4',
        body: `Every afternoon, something wonderful happens across the United Kingdom. Kettles click on. Teapots warm. Biscuits appear on plates. It is tea time. The British drink over one hundred million cups of tea every single day. Tea is not just a drink here — it is a hug in a mug, a pause in a busy day, a reason to sit with someone and talk. "Shall I put the kettle on?" might be the most British sentence ever spoken.

Now, football — and in Britain, football means the game played with your feet, the one much of the world calls "the beautiful game." England is where modern football was born. The rules were written in London in 1863, and the game spread from British shores to every country on Earth. On match days, stadiums roar with singing fans, and entire neighborhoods go quiet as everyone gathers around televisions, holding their breath.

The United Kingdom has given the world some of its most beloved stories. J.K. Rowling wrote Harry Potter in a café in Edinburgh while her baby daughter slept beside her. J.R.R. Tolkien created Middle-earth, with its hobbits and wizards, while teaching at Oxford. Roald Dahl dreamed up Willy Wonka, Matilda, and the BFG from his writing hut in the English countryside. Paddington Bear, Peter Rabbit, Winnie-the-Pooh — all British.

British music changed the world too. The Beatles, from Liverpool, became the most famous band in history. Their songs are still played on radios every single day, more than fifty years later. After them came David Bowie, Queen, the Spice Girls, Adele, and Ed Sheeran — a small island producing an enormous amount of music.

Fish and chips is the classic British meal — battered fish and thick-cut chips wrapped in paper, eaten by the seaside with salt and vinegar. Sunday roast is another tradition — roasted meat, crispy potatoes, Yorkshire pudding, gravy, and vegetables, the whole family gathered around a table.

British children grow up with bonfire night in November, Christmas pantomimes where the audience shouts at the actors, and the constant, gentle presence of rain — which is why the British talk about weather more than almost anything else.

That night, {childName}, remember Britain's cozy traditions. A cup of tea, a good story, a song, and a rainy day — sometimes the simplest things create the warmest memories. And the best stories, like the best tea, are meant to be shared.`,
      },
      {
        id: 'uk_ep5_facts', episodeNumber: 5, title: 'Amazing Britain',
        subtitle: 'Royal corgis, underground trains, and a language spoken everywhere.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover United Kingdom · Episode 5',
        body: `Ready for some facts about the United Kingdom that will make you smile and say "really?"

The English language started right here — and it has become the most widely spoken language in the world. Over one and a half billion people speak English, even though the country where it was born is smaller than the state of Oregon. Words from Old English, French, Latin, Norse, and dozens of other languages were all mixed together over centuries to create the language you are listening to right now.

The London Underground — called "the Tube" — was the first underground railway in the world, opened in 1863. Passengers rode in wooden carriages pulled by steam locomotives through tunnels lit by gas lamps. Today, over a billion journeys are made on it every year. The famous voice that says "Mind the gap" at stations has become one of the most recognized phrases on Earth.

Queen Elizabeth the Second, who reigned for seventy years, was famous for her love of corgis. She owned more than thirty corgis during her lifetime. The little dogs had their own room in Buckingham Palace and were fed by the queen herself from a silver tray.

The UK is home to the shortest scheduled commercial flight in the world — from the island of Westray to the island of Papa Westray in Scotland. It takes about ninety seconds. By the time you buckle your seatbelt, you are practically landing.

Britain invented the World Wide Web. In 1989, a British scientist named Tim Berners-Lee created the system that lets you browse websites, watch videos, and explore the internet. He could have become the richest person in history, but he gave his invention to the world for free. Every time you go online, you are using a British invention.

Scotland's national animal is the unicorn. Yes, really. The Scots chose the unicorn centuries ago because in legends, it was the only creature strong enough to defeat the English lion. You will find unicorns carved into buildings and statues all across Scotland.

That night, {childName}, remember Britain's amazing facts. A tiny island gave the world its language, its internet, its football, and its unicorn. Never underestimate small places — sometimes the smallest islands make the biggest waves.`,
      },
    ],
  },

  // ─── 5. JAPAN ──────────────────────────────────────────────
  {
    id: 'discover-japan',
    title: '🇯🇵 Discover Japan',
    icon: '🇯🇵',
    gradient: 'linear-gradient(135deg, #c62828 0%, #ffffff 50%, #f48fb1 100%)',
    description: 'Cherry blossoms, bullet trains, and ancient temples — 5 bedtime adventures through the Land of the Rising Sun.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'japan_ep1_geo', episodeNumber: 1, title: 'The Land of Japan',
        subtitle: 'A chain of islands where mountains meet the sea and volcanoes steam.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Japan · Episode 1',
        body: `Close your eyes and imagine a chain of islands curving gently through the blue Pacific Ocean, like a string of emerald jewels scattered on silk. Welcome to Japan — the Land of the Rising Sun.

Japan is made up of nearly seven thousand islands, though most people live on the four biggest ones. The country is long and narrow, stretching from the cold, snowy north to the warm, tropical south. Imagine this — in the same country, on the same day, one person can be skiing through deep powder snow while another swims in a turquoise sea.

The most famous sight in all of Japan is Mount Fuji — a nearly perfect cone-shaped volcano that rises three thousand seven hundred and seventy-six meters above the land. On clear days, you can see it from over a hundred kilometers away, its snow-capped peak floating above the clouds like a painting come to life. Artists and poets have been inspired by Mount Fuji for thousands of years.

Japan sits on the Pacific Ring of Fire, a zone where the Earth's underground plates push and pull against each other. This means Japan has many volcanoes — over a hundred — and frequent earthquakes. But it also means something wonderful: hot springs. All across Japan, naturally heated water bubbles up from deep underground, and people have been soaking in these warm, mineral-rich pools for centuries. Even monkeys bathe in hot springs during winter, their faces red and content, steam rising from the water around them.

In spring, Japan transforms. Cherry blossom trees — called sakura — burst into clouds of pale pink and white flowers. Entire parks and riverbanks become tunnels of soft petals, and when the wind blows, the petals fall like pink snow. The Japanese call this "hanami" — flower viewing — and families spread blankets under the trees to picnic and watch the blossoms drift.

The forests are dense with bamboo — tall, green stalks that grow so thick they form natural corridors. Walking through a bamboo grove, with the stalks creaking and swaying overhead, feels like entering another world.

That night, {childName}, remember Japan's beautiful land. An island country where fire burns beneath the earth and flowers bloom above it. Even in a place where the ground shakes, beauty finds a way to grow.`,
      },
      {
        id: 'japan_ep2_history', episodeNumber: 2, title: 'Stories From Long Ago',
        subtitle: 'Samurai honor, ancient emperors, and the way of peace.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Japan · Episode 2',
        body: `Japan's story begins thousands of years ago with the Jomon people, who made some of the oldest pottery in the world. They pressed rope patterns into wet clay, creating beautiful pots and figures that still survive today, over ten thousand years old. They lived in harmony with the forest, fishing, gathering nuts, and building small villages near rivers and coasts.

Over time, Japan developed its own unique civilization. Emperors ruled from ancient capitals, and the Japanese believed their emperor was descended from the sun goddess Amaterasu. The imperial family of Japan is the oldest continuous monarchy in the world — stretching back over two thousand years.

Then came the samurai — warriors who followed a strict code of honor called bushido, "the way of the warrior." Samurai trained not just in sword fighting, but in poetry, calligraphy, and tea ceremony. They believed a true warrior must be as gentle with a brush as they were fierce with a blade. Their swords, called katana, were forged by master craftsmen who folded the steel thousands of times, creating blades so sharp and strong they became works of art.

During the Edo period, Japan closed itself off from most of the world for over two hundred years. While other countries traded and traveled, Japan turned inward and created an extraordinary culture — kabuki theater with dramatic face paint and sweeping costumes, ukiyo-e woodblock prints that captured daily life in stunning detail, and haiku poetry that said everything in just seventeen syllables.

When Japan finally opened its doors to the world in the 1850s, it transformed itself at remarkable speed. Within decades, it built railways, factories, and modern cities. After the devastation of World War Two, Japan rebuilt itself from rubble into one of the most prosperous, peaceful, and technologically advanced nations on Earth — a transformation that amazed the entire world.

Through it all, the Japanese held onto their traditions — their temples, their tea ceremonies, their deep respect for nature and for each other.

That night, {childName}, remember Japan's journey. A country that learned the art of the sword also mastered the art of peace. True strength is not about being fierce — it is about knowing when to fight and when to put the sword away and pick up a paintbrush.`,
      },
      {
        id: 'japan_ep3_places', episodeNumber: 3, title: 'Wonders of Japan',
        subtitle: 'Golden temples, floating gates, and a castle white as a heron.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Japan · Episode 3',
        body: `Imagine a temple covered entirely in gold, its reflection shimmering in a mirror-still pond surrounded by perfectly shaped pine trees. This is Kinkaku-ji, the Golden Pavilion, in the city of Kyoto. Every surface gleams with real gold leaf, and the building seems to float between the water below and the sky above. It was built over six hundred years ago, and on a clear day, you cannot tell where the real temple ends and its reflection begins.

Now picture this — a giant red gate standing in the sea. The Torii gate of Itsukushima Shrine, on Miyajima Island, rises from the water at high tide as if it grew from the ocean floor. At low tide, you can walk right up to it on the wet sand. It has stood here for centuries, marking the boundary between the everyday world and the sacred world beyond.

Himeji Castle is called the White Heron because its white walls and graceful curved roofs look like a great bird about to take flight. It is the finest surviving medieval castle in Japan, with eighty-three buildings connected by winding corridors, hidden rooms, and defensive mazes designed to confuse invaders. The castle has survived earthquakes, typhoons, and even wartime bombing — still standing, still white, still beautiful.

In Nara, an ancient capital, a giant bronze Buddha sits inside the largest wooden building in the world. The statue is fifteen meters tall, and its open hand alone is big enough for a person to sit in. Outside, over a thousand friendly deer roam freely through the temple parks. They bow to visitors — yes, really bow — and visitors bow back.

The Fushimi Inari Shrine in Kyoto has over ten thousand bright orange gates — called torii — lined up in rows that snake up an entire mountainside. Walking through them feels like moving through a tunnel of orange light, each gate placed by someone giving thanks for a wish that came true.

And in Tokyo, the ancient Senso-ji Temple sits in the middle of the modern city, with a giant red paper lantern at its entrance weighing over seven hundred kilograms. Past meets present every day at its gates.

That night, {childName}, remember Japan's wonders. Gold temples, floating gates, bowing deer, and ten thousand wishes. In Japan, even stones and trees are treated with respect — because wonder lives in everything, if you look carefully enough.`,
      },
      {
        id: 'japan_ep4_culture', episodeNumber: 4, title: 'Sushi, Festivals & Kindness',
        subtitle: 'Chopsticks, cherry blossom picnics, and a culture built on respect.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Japan · Episode 4',
        body: `In Japan, when you enter someone's home, you take off your shoes. When you greet someone, you bow. When you receive a gift, you use both hands. These small gestures are not just politeness — they are a way of showing respect, and respect is at the heart of everything in Japanese culture.

Let us start with food, because Japanese food is like edible art. Sushi — small pieces of fresh fish on little pillows of seasoned rice — is Japan's most famous dish, but there is so much more. Ramen is a steaming bowl of noodles in rich broth, topped with egg, pork, and vegetables — the perfect food for a cold day. Bento boxes are packed lunches arranged so beautifully they look like tiny paintings, with rice shaped like animals and vegetables cut into flowers.

Japanese children eat school lunch together in their classroom, serving each other and cleaning up afterwards. There are no janitors in most Japanese schools — the students clean the school themselves, sweeping hallways and scrubbing floors. They learn that taking care of shared spaces is everyone's responsibility.

Festivals, called matsuri, fill the Japanese calendar. During summer festivals, children wear colorful cotton robes called yukata, eat shaved ice and grilled squid from street stalls, and watch fireworks paint the night sky. Giant portable shrines called mikoshi are carried through the streets on the shoulders of chanting, sweating teams.

The Japanese art of origami turns a single flat sheet of paper into cranes, flowers, dragons, and butterflies — all without scissors or glue, just folding. Japanese children learn that something simple can become something extraordinary with patience and precision.

Manga — Japanese comic books — and anime are loved by children and adults alike. Characters like Astro Boy, Sailor Moon, Pikachu, and Totoro were all born in Japan, and their stories have traveled to every corner of the globe.

Even the way Japanese people wrap a gift, pour tea, or arrange a single flower in a vase is done with care. There is a word for this attention to beauty in everyday life — "wabi-sabi" — the idea that imperfection and simplicity are beautiful.

That night, {childName}, remember Japan's gentle ways. Kindness does not have to be loud. Sometimes the most powerful thing you can do is bow, take off your shoes, and treat the world around you with quiet, careful respect.`,
      },
      {
        id: 'japan_ep5_facts', episodeNumber: 5, title: 'Amazing Japan',
        subtitle: 'Robot hotels, vending machines everywhere, and trains that never run late.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 3,
        source: 'Discover Japan · Episode 5',
        body: `Get ready, because Japan is a country where the future and the past live side by side — and the facts are absolutely wild.

Japan's bullet trains — called Shinkansen — travel at over three hundred kilometers per hour, fast enough to cover the distance between two cities in the time it takes to watch a cartoon. But here is the truly amazing part — they are almost never late. The average delay is less than one minute per year. If a train is even a few seconds late, the railway company issues a formal apology to passengers.

Japan has more than five million vending machines — that is roughly one for every twenty-three people. You can buy almost anything from them: hot coffee, cold noodles, fresh eggs, umbrellas, flowers, and even entire meals. In some places, you can find vending machines on remote mountain hiking trails, quietly humming and offering drinks to tired hikers.

There is a hotel in Japan staffed almost entirely by robots. At the front desk, a robot dinosaur checks you in. A robot arm carries your luggage. A robot fish swims in the lobby tank — okay, that one is just a regular fish. But you get the idea.

Japan is the birthplace of karaoke — the word means "empty orchestra" — where people sing along to music tracks in small private rooms with their friends. It was invented in the early 1970s, and now you can find karaoke in almost every country on Earth.

The country has a "Cat Island" — Aoshima — where cats outnumber humans six to one. Cats roam freely, nap on porches, and are treated like royalty by the handful of human residents.

Japanese toilets are the most advanced in the world. Many have heated seats, built-in speakers that play nature sounds, and buttons for everything you can imagine. Visitors from other countries are often amazed — and sometimes confused — by all the options.

And here is one that shows the Japanese spirit perfectly — if you lose your wallet in Japan, there is an incredibly high chance you will get it back, cash and all. Japanese people return lost items at a rate that astonishes the rest of the world. Honesty is not just valued — it is simply how things are done.

That night, {childName}, remember Japan's wonders. A country where trains apologize for being a minute late and strangers return your lost wallet. The future they are building runs not just on technology — but on trust, care, and doing things right.`,
      },
    ],
  },,
// ─── 1. China 🇨🇳 ───────────────────────────────────────────────────────────
  {
    id: 'discover-china',
    title: 'Discover China',
    icon: '🇨🇳',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 40%, #f59e0b 100%)',
    description: 'Five bedtime journeys across China — mountains, emperors, palaces, dumplings, and records that will blow your mind.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_cn_ep1_geo', episodeNumber: 1, title: 'Mountains, Rivers & Rice',
        subtitle: 'Fly over the tallest peaks and longest rivers on Earth.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover China · Episode 1',
        body: `Close your eyes and imagine you are a little bird soaring high above the clouds. Below you stretches China — one of the biggest countries in the whole wide world, so big that when the sun rises on one side, it is still nighttime on the other.

First, you fly toward the west. The air gets colder. Snow swirls around your feathers. You have reached the Himalayas — the tallest mountains on the entire planet. Mount Everest, the very highest peak, sits right on the border between China and Nepal. Its top pokes above the clouds like a white crown. Tibetan yaks with shaggy fur wander the meadows below, munching grass at heights where most people would gasp for air.

Now turn east and follow the Yangtze River. It is the third longest river in the world, winding through deep gorges where limestone cliffs rise so steeply they look like giant walls. Fishermen in bamboo boats drift on the emerald water, just as their great-great-grandparents did hundreds of years ago.

Keep flying south. The land turns warm and green. Terraced rice paddies step down the hillsides like a giant staircase carved into the earth. Each terrace is filled with water that reflects the sky, so from above it looks like a mountain made of mirrors. Farmers in wide straw hats wade knee-deep, planting rice seedlings one by one. Rice feeds more people in the world than any other grain, and much of it grows right here.

Swing north and you will cross the Gobi Desert — a sea of golden sand and rocky plains where wild camels roam and the wind sings lonely songs at night. Then forests of bamboo appear, so thick and green that giant pandas hide among the stalks, munching their favourite snack.

China's land holds nearly every kind of landscape you can dream of — snowy peaks, steamy jungles, wide deserts, and misty rivers.

Tonight, {childName}, remember that the world is wonderfully big, and every landscape has a story waiting for a curious traveller like you. Sweet dreams, little explorer.`,
      },
      {
        id: 'dc_cn_ep2_history', episodeNumber: 2, title: 'Emperors & Dragons',
        subtitle: 'Ancient stories of the first emperor and his terracotta army.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover China · Episode 2',
        body: `Long, long ago — more than two thousand years before you were born — China was not one country. It was many small kingdoms, always fighting. Then a fierce young king named Qin Shi Huang united them all and said: "From now on, we are one."

He became the very first emperor of China. He wore robes of golden silk and a crown studded with jade. He ordered thousands of workers to connect old walls into one enormous wall — the Great Wall of China — stretching over mountains and valleys like a stone dragon protecting the land.

But Qin Shi Huang did something even more astonishing. Deep underground, he built a secret army to guard him in the afterlife. Not living soldiers — statues made of clay called terracotta. More than eight thousand life-sized warriors, each with a different face, a different hairstyle, a different expression. Some kneel with crossbows. Some stand tall with swords. There are even clay horses and chariots. For over two thousand years, this silent army waited in the dark, forgotten — until a farmer digging a well in 1974 struck something hard with his shovel and uncovered a warrior's head.

Before the emperors, the Chinese people told stories of magical dragons. Unlike the scary dragons in some tales, Chinese dragons were kind and wise. They brought rain to the rice fields and good luck to families. During festivals, people danced under long silk dragons held up by poles, weaving through the streets like a river of colour.

The ancient Chinese also invented things the whole world still uses — paper, so you can draw and write; silk, the softest cloth you have ever touched; fireworks, which paint the night sky with light; and the compass, which always points north so travellers never get lost.

Tonight, {childName}, remember that history is like a treasure buried underground — sometimes all it takes is one curious person with a shovel to bring it back to life. Goodnight, little historian.`,
      },
      {
        id: 'dc_cn_ep3_places', episodeNumber: 3, title: 'The Great Wall & Forbidden City',
        subtitle: 'Walk along the longest wall ever built and peek inside a palace of 9,999 rooms.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover China · Episode 3',
        body: `Imagine you are standing on top of a wall so long that if you started walking at sunrise, you would still be walking when the stars came out — for weeks and weeks. That is the Great Wall of China. It stretches over twenty-one thousand kilometres across mountains, deserts, and grasslands. Watchtowers dot the wall like beads on a necklace. Soldiers once lit fires on top of them to send signals — one puff of smoke meant a small group was coming, three puffs meant a big army. It was like texting, but with smoke.

From above, the wall looks like a grey ribbon draped across green hills. In autumn, the trees around it turn gold and crimson, and the wall seems to float on a sea of fire-coloured leaves.

Now fly south to Beijing, the capital city. Hidden behind tall red walls is the Forbidden City — the biggest palace complex on Earth. It has nearly ten thousand rooms, and for five hundred years only the emperor and his court were allowed inside. Everyone else was forbidden — that is how it got its name.

The roofs are covered in golden tiles that gleam in the sun. Stone lions guard every gate, their manes curled like clouds. Inside, throne rooms are painted in red and gold, and ceilings are carved with swirling dragons. The emperor's throne sits at the very centre, facing south, because the Chinese believed the south wind brought warmth and good fortune.

Beyond Beijing, there are other wonders too — the Li River in Guilin, where pointy green mountains rise from the water like something from a painting. And the round tulou houses of Fujian, built in circles like giant doughnuts, where whole families lived together and shared one courtyard under the stars.

Tonight, {childName}, remember that people have been building incredible things for thousands of years, and every wall, palace, and tower started with one single stone placed by one brave hand. Sleep well, little architect.`,
      },
      {
        id: 'dc_cn_ep4_culture', episodeNumber: 4, title: 'Dumplings, Dragons & Lanterns',
        subtitle: 'The food, festivals, and family traditions that make China magical.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover China · Episode 4',
        body: `In China, food is not just something you eat — it is a way of saying "I love you." And the most loved food of all might be the dumpling. Picture a tiny parcel of soft dough, folded and pinched at the edges, filled with pork, vegetables, or shrimp. Families gather in the kitchen before Chinese New Year and make hundreds of dumplings together, chatting and laughing while their fingers fold and press. Some families hide a coin inside one lucky dumpling — whoever bites into it will have good fortune all year long.

Chinese New Year is the biggest celebration in the country. It falls in January or February, when winter is fading. Streets explode with red — red lanterns, red banners, red envelopes stuffed with money that grandparents give to children. Red is the colour of luck and happiness. Firecrackers pop and bang to scare away a mythical beast called Nian, who was said to be afraid of loud noises and the colour red.

On the fifteenth night, the Lantern Festival lights up the sky. Children carry glowing lanterns shaped like rabbits, fish, and dragons through the streets. Some lanterns float into the air, drifting up like tiny orange moons. Riddles are written on paper and hung from the lanterns — if you solve one, you win a small prize.

In autumn comes the Mid-Autumn Festival, when families sit outside under the full moon and eat mooncakes — round pastries with sweet filling inside. They tell the story of Chang'e, a goddess who flew to the moon and lives there still, with a jade rabbit for company.

Chinese people greet each other by saying "ni hao," which means "you good?" It is a little wish for the other person's happiness packed into two small words.

Tonight, {childName}, remember that the most delicious meals and the brightest festivals always taste better when shared with the people you love. Goodnight, little dumpling.`,
      },
      {
        id: 'dc_cn_ep5_facts', episodeNumber: 5, title: 'Record-Breaking China',
        subtitle: 'The fastest trains, tallest bridges, and most pandas on the planet.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover China · Episode 5',
        body: `Get ready, because China is a land of records that will make your jaw drop.

Start with trains. China has the fastest trains in the world — bullet trains that zoom at over three hundred and fifty kilometres per hour. That is faster than a cheetah, faster than most racing cars. The train network stretches more than forty-five thousand kilometres, enough to wrap around the Earth. You can eat breakfast in Beijing and have lunch in Shanghai, over a thousand kilometres away.

Now look up — way, way up. The Danyang-Kunshan Grand Bridge is the longest bridge on Earth, stretching one hundred and sixty-four kilometres. It carries trains over lakes, rice paddies, and river channels. It took four years and ten thousand workers to build.

Speaking of tall, the Shanghai Tower spirals into the sky at over six hundred metres. It twists as it rises, like a giant corkscrew, and on windy days it actually sways gently, though the people inside barely feel it.

China is home to nearly all of the world's giant pandas — fluffy black-and-white bears that spend about fourteen hours a day eating bamboo. A baby panda is born pink, blind, and no bigger than a stick of butter. Panda reserves in Sichuan province take care of these gentle giants, and thanks to years of protection, their numbers are slowly growing.

Here is a fun one — China has a festival where people race boats shaped like dragons. Dragon boat racing started over two thousand years ago and now teams from all over the world compete, paddling to the beat of a big drum at the front of the boat.

And did you know? Ice cream was first enjoyed in China, thousands of years ago, when people mixed snow with fruit and honey. So the next time you lick a cone, you can thank ancient China.

Tonight, {childName}, remember that records are made to be broken, and somewhere right now someone is dreaming up the next amazing thing. Maybe one day that someone will be you. Goodnight, little record-breaker.`,
      },
    ],
  },

  // ─── 2. Australia 🇦🇺 ────────────────────────────────────────────────────────
  {
    id: 'discover-australia',
    title: 'Discover Australia',
    icon: '🇦🇺',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 40%, #facc15 100%)',
    description: 'Five bedtime journeys across Australia — coral reefs, ancient stories, opera houses, meat pies, and the wildest wildlife on Earth.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_au_ep1_geo', episodeNumber: 1, title: 'Reefs, Rocks & Red Deserts',
        subtitle: 'Dive into the Great Barrier Reef and fly over a giant red rock.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Australia · Episode 1',
        body: `Close your eyes and imagine you are floating in warm, turquoise water. Below you is the Great Barrier Reef — the biggest living structure on the entire planet, so huge that astronauts can see it from space. It stretches over two thousand three hundred kilometres along the coast of Queensland, like an underwater rainbow made of coral.

Fish of every colour dart between the coral — clownfish hiding in waving anemones, bright blue tangs, and enormous manta rays gliding like underwater birds. Sea turtles paddle past lazily, and if you are very lucky, a gentle whale shark as big as a school bus drifts by, its spotted skin shimmering.

Now rise out of the water and fly west. The land dries out. Trees thin. The soil turns orange, then deep red. Welcome to the Outback — the vast, dusty heart of Australia where the sky feels wider than anywhere on Earth. In the very centre sits Uluru, a giant rock that rises three hundred and fifty metres from the flat desert floor. At sunrise it glows orange. At sunset it turns deep crimson. Indigenous Australians, whose ancestors have lived here for over sixty-five thousand years, consider Uluru sacred.

Fly south and you will find rainforests dripping with moisture, where tree ferns grow taller than houses and cassowaries — enormous birds with bright blue necks and a bony helmet on their heads — stroll through the undergrowth.

Head to the island of Tasmania, and the air turns cool. Forests of ancient Huon pines, some over two thousand years old, stand quietly beside mirror-still rivers.

Australia is an island, a country, and a continent all at once — the only place on Earth that is all three. From coral seas to red deserts to misty forests, it is a land of wild contrasts.

Tonight, {childName}, remember that the most extraordinary places on Earth are also the most fragile — and they need gentle, caring explorers like you. Sweet dreams, little adventurer.`,
      },
      {
        id: 'dc_au_ep2_history', episodeNumber: 2, title: 'Dreamtime & Ancient Fires',
        subtitle: 'The oldest stories ever told — passed down for sixty-five thousand years.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Australia · Episode 2',
        body: `Before any castle was built, before any book was written, the Aboriginal and Torres Strait Islander peoples of Australia were already telling stories. Their history stretches back over sixty-five thousand years, making it the oldest continuous culture on the planet. Think about that — sixty-five thousand years of grandparents whispering stories to grandchildren under the stars.

Their creation stories are called the Dreamtime. In the Dreamtime, ancestor spirits rose from the earth and walked across the land. As they walked, they sang — and their songs created mountains, rivers, waterholes, and animals. The Rainbow Serpent, one of the most important Dreamtime spirits, slithered across the dry land and wherever its body pressed into the earth, rivers formed and water filled the valleys.

These stories were never written in books. They were painted on rock walls, danced around campfires, and sung along ancient paths called songlines — invisible trails that crisscross Australia like a map made of music. If you knew the right song, you could find your way across hundreds of kilometres of desert without ever getting lost.

Aboriginal Australians were also the first people on Earth to use fire to care for the land. They burned small patches of grass on purpose, gently and carefully, to encourage new plants to grow and to prevent bigger, dangerous fires. Scientists today call this fire-stick farming, and modern firefighters are learning from this ancient wisdom.

Thousands of years later, in 1770, a British explorer named Captain James Cook sailed to Australia's east coast. After that, many people arrived from Europe, and the story of Australia changed forever — sometimes in painful ways that the country is still learning from.

Tonight, {childName}, remember that the oldest stories in the world were not written in books — they were sung under the stars by people who loved the land. And those stories still matter. Goodnight, little listener.`,
      },
      {
        id: 'dc_au_ep3_places', episodeNumber: 3, title: 'Opera House & Harbour Bridge',
        subtitle: 'Visit the sail-shaped wonder and climb the world\'s widest bridge.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Australia · Episode 3',
        body: `Imagine you are standing at the edge of Sydney Harbour. The water sparkles blue. Ferries criss-cross the bay. And right there, on a point of land reaching into the harbour, sits the Sydney Opera House — one of the most famous buildings on Earth.

Its roof is made of huge white shells — or maybe sails, or maybe the petals of a giant flower opening to the sky. The architect, a Danish man named Jorn Utzon, was inspired by peeling an orange. He figured out that every curved piece of the roof could be cut from the surface of a single sphere, like slices of the same orange. It took sixteen years to build and over a million tiles cover those gleaming shells.

Right next door rises the Sydney Harbour Bridge, nicknamed "The Coathanger" because of its arched shape. It is the widest steel arch bridge in the world, and brave visitors can actually climb all the way to the top — one hundred and thirty-four metres above the water — and look out over the whole sparkling city.

Fly north to Queensland and you will find the Daintree Rainforest, one of the oldest rainforests on Earth — over one hundred and eighty million years old. Dinosaurs once walked under these same trees. Today, tiny tree kangaroos hop through the canopy and electric-blue butterflies the size of your hand flutter between the ferns.

Travel to the middle of Australia and you will find Coober Pedy, a tiny town where people live underground to escape the scorching desert heat. Their homes, churches, and even a hotel are carved right into the rock. Above ground it looks like a dusty moonscape, but below the surface, cool rooms glow with the shimmer of opal — a precious gem that flashes every colour of the rainbow.

Tonight, {childName}, remember that the most wonderful buildings and places are born when someone dares to imagine something nobody has ever seen before. Goodnight, little dreamer.`,
      },
      {
        id: 'dc_au_ep4_culture', episodeNumber: 4, title: 'Meat Pies, Mateship & Surf',
        subtitle: 'The food, friendships, and beach culture that make Australia special.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Australia · Episode 4',
        body: `In Australia, if someone offers you a meat pie at the footy, you have just made a friend for life. Australians love their meat pies — flaky golden pastry filled with savoury beef and gravy, topped with a squirt of tomato sauce. You will find them at every sports game, every bakery, and every petrol station from Sydney to Perth.

But food in Australia is a delicious mix of cultures. Because people have come to Australia from all over the world — Greece, Italy, Vietnam, India, Lebanon, China — the food is wonderfully varied. You can eat Vietnamese pho for breakfast, Italian gelato after lunch, and a classic Aussie barbecue for dinner, all in the same suburb.

Australians have a special word — mateship. It means friendship, loyalty, and looking out for each other. If your car breaks down on a dusty Outback road, a stranger will stop to help. If a bushfire threatens a town, neighbours show up with hoses, sandwiches, and open arms. Mateship is the glue that holds this big, spread-out country together.

The beach is the heart of Australian life. Over eighty-five percent of Australians live within fifty kilometres of the coast. Children learn to swim almost as soon as they can walk. Surf lifesavers in their red and yellow caps patrol the beaches, keeping swimmers safe. The nippers program teaches kids as young as five how to read the ocean — where the rip currents hide, how to float if you get tired, and how to signal for help.

Australians also shorten nearly every word. Breakfast is "brekkie." Afternoon is "arvo." A barbecue is a "barbie." A kangaroo is a "roo." If an Aussie says "no worries," it means everything is perfectly fine, relax, and maybe have another meat pie.

Tonight, {childName}, remember that the best communities are built by people who look out for one another — just like the lifesavers watching the waves. Goodnight, little mate.`,
      },
      {
        id: 'dc_au_ep5_facts', episodeNumber: 5, title: 'Wild Australia',
        subtitle: 'Kangaroos that box, spiders that dance, and a fence longer than the Great Wall.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Australia · Episode 5',
        body: `Australia is the land of "wait, that is REAL?" So get ready for some facts that sound made up but are absolutely true.

Kangaroos cannot walk backwards. Their big, powerful tails and long hind legs are built for bouncing forward, not reversing. That is one reason the kangaroo appears on Australia's coat of arms — it represents a country that only moves forward.

The platypus is one of the strangest animals on Earth. It has the bill of a duck, the tail of a beaver, the feet of an otter, and it lays eggs — even though it is a mammal. Oh, and the males have venomous spurs on their hind legs. When European scientists first saw a preserved platypus, they thought someone had glued animal parts together as a joke.

There is a fence in Australia called the Dingo Fence. It stretches five thousand six hundred and fourteen kilometres — longer than the Great Wall of China — and its job is to keep wild dingoes away from sheep farms. It takes a team of workers driving along its length constantly, fixing holes and replacing wire.

The box jellyfish, found in Australian waters, is one of the most venomous creatures alive. Its tentacles can stretch three metres long. But do not worry — beaches have special stinger nets and warning signs to keep swimmers safe.

Now for something wonderful. Peacock spiders are tiny — smaller than your fingernail — and the males dance to impress females. They raise two colourful, patterned legs like fans and wiggle their bodies side to side. Scientists have filmed these dances, and they look like the spider is doing a little disco routine.

Australia has more beaches than any other country — over ten thousand. If you visited a new beach every day, it would take you more than twenty-seven years to see them all.

Tonight, {childName}, remember that nature is the wildest, most creative inventor of all — and Australia is its most playful laboratory. Goodnight, little naturalist.`,
      },
    ],
  },

  // ─── 3. Brazil 🇧🇷 ────────────────────────────────────────────────────────────
  {
    id: 'discover-brazil',
    title: 'Discover Brazil',
    icon: '🇧🇷',
    gradient: 'linear-gradient(135deg, #15803d 0%, #22c55e 40%, #facc15 100%)',
    description: 'Five bedtime journeys across Brazil — the Amazon, ancient peoples, towering statues, samba rhythms, and jaw-dropping records.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_br_ep1_geo', episodeNumber: 1, title: 'The Amazon & Endless Green',
        subtitle: 'Fly over the biggest rainforest and the mightiest river on Earth.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Brazil · Episode 1',
        body: `Close your eyes and imagine you are a tiny parrot with bright green feathers, soaring over a sea of trees that stretches from horizon to horizon. Welcome to Brazil — the biggest country in South America and home to the largest rainforest on the planet.

The Amazon Rainforest covers an area bigger than all of Western Europe. From above, it looks like a giant green carpet, thick and endless. But zoom down into the canopy and you enter a world buzzing with life. Monkeys swing between branches. Toucans with enormous orange beaks hop from tree to tree. Poison dart frogs — tiny, bright blue or red — sit on wet leaves, warning everything with their colours: "Do not eat me."

Winding through the forest is the Amazon River, the mightiest river on Earth. It carries more water than the next seven largest rivers combined. During the rainy season, the river swells so wide in places that you cannot see the other side. Pink river dolphins — yes, pink! — leap and play in its muddy waters. They are one of only a few dolphin species that live in freshwater.

Fly south and the forest gives way to wide, flat grasslands called the Cerrado. Then further south, the land turns into the Pantanal — the largest tropical wetland in the world, where jaguars prowl the riverbanks and giant otters the size of a grown-up swim in family groups, chattering to each other.

Along the coast, golden beaches stretch for over seven thousand kilometres. Waves crash against cliffs in the northeast, and in the south, the land cools into rolling green hills perfect for growing coffee — Brazil grows more coffee than any other country on Earth.

Tonight, {childName}, remember that one forest can hold more life than you could count in a lifetime — and every single creature in it matters. Sweet dreams, little parrot.`,
      },
      {
        id: 'dc_br_ep2_history', episodeNumber: 2, title: 'Ancient Peoples & Hidden Kingdoms',
        subtitle: 'The first Brazilians — twelve thousand years of stories in the forest.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Brazil · Episode 2',
        body: `Long before skyscrapers rose in Sao Paulo, long before ships arrived from Portugal, the land we now call Brazil was home to millions of Indigenous people who had lived there for at least twelve thousand years.

Deep in the Amazon, the Tupi people fished the rivers, grew cassava — a starchy root vegetable — and told stories of a great creator called Tupa, the god of thunder, whose voice boomed across the sky during storms. They believed the forest was alive with spirits, and every tree, river, and animal had a soul that deserved respect.

Scientists have recently discovered something astonishing. Hidden beneath the thick forest canopy, ancient peoples built enormous earthworks — huge geometric shapes carved into the ground, circles and squares as big as football fields. Using special tools that can see through trees from aeroplanes, researchers have found hundreds of these earthworks. This means the Amazon was not always wild and untouched — thriving communities lived there, farming, building, and creating art.

In the Serra da Capivara National Park in northeast Brazil, rock walls are covered with paintings made over twelve thousand years ago. Stick figures dance, hunt deer, and hold hands in circles. These are some of the oldest artworks in the Americas — ancient bedtime stories told in paint instead of words.

In 1500, Portuguese explorers arrived on Brazil's coast. They found a tree that produced a deep red dye, which they called pau-brasil — and that is how Brazil got its name. Over the centuries, people from Africa, Europe, Asia, and the Middle East came to Brazil, blending their languages, foods, and traditions into the vibrant culture you see today.

Tonight, {childName}, remember that beneath every forest and beneath every city, there are layers of history — stories of people who came before, whose footprints are still in the earth. Goodnight, little archaeologist.`,
      },
      {
        id: 'dc_br_ep3_places', episodeNumber: 3, title: 'Christ the Redeemer & Iguazu Falls',
        subtitle: 'Stand beneath open arms on a mountaintop and feel the thunder of waterfalls.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Brazil · Episode 3',
        body: `Imagine you are riding a tiny red train up a steep, green mountain above the city of Rio de Janeiro. The trees thin out. The air gets misty. And then, towering above you, arms stretched wide as if ready to give the whole city a hug, stands Christ the Redeemer.

This enormous statue is thirty metres tall — about the height of a ten-storey building — and stands on top of Mount Corcovado, seven hundred metres above the sparkling sea. Made of concrete and covered in thousands of tiny soapstone tiles, it has watched over Rio since 1931. At night, lights make the statue glow white against the dark sky, and from the beaches below it looks like a guardian floating among the stars.

From the statue's feet, you can see Sugarloaf Mountain — a dome of smooth grey rock rising from the harbour like a giant gumdrop. A cable car carries visitors to the top, swinging gently over the treetops and the blue bay below.

Now fly a thousand kilometres south to the border with Argentina, and you will hear Iguazu Falls before you see them. A deep rumble, like distant thunder that never stops. Then the mist hits your face. And then — the falls appear. Two hundred and seventy-five separate waterfalls plunge over cliffs in a massive horseshoe shape, surrounded by lush jungle. Rainbows shimmer in the mist. Butterflies with wings as blue as the sky flutter around you. A walkway stretches right to the edge of a section called the Devil's Throat, where the water drops so powerfully that the spray rises like a cloud.

In the northeast sits the colourful city of Salvador, with cobblestone streets, pastel-painted buildings, and the sound of drums drifting from every corner. It was the first capital of Brazil and still pulses with Afro-Brazilian heritage.

Tonight, {childName}, remember that whether it is a statue with open arms or a waterfall that roars like thunder, the most magnificent places on Earth remind us how beautiful it is to be alive. Goodnight, little traveller.`,
      },
      {
        id: 'dc_br_ep4_culture', episodeNumber: 4, title: 'Samba, Football & Acai Bowls',
        subtitle: 'The rhythms, games, and flavours that make Brazil dance.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Brazil · Episode 4',
        body: `If Brazil had a heartbeat, it would sound like a samba drum. Samba is the music and dance that flows through Brazil like a river of rhythm. It started in the Afro-Brazilian communities of Bahia, blending African drumming traditions with Portuguese melodies. The beat is fast, joyful, and impossible to resist — even your toes will start tapping.

Every year before Lent, Brazil throws the biggest party on Earth — Carnival. In Rio de Janeiro, samba schools — huge community groups that spend the entire year preparing — parade down a giant avenue called the Sambadrome. Dancers wear costumes covered in feathers, sequins, and glitter, some so tall they need wheels to support them. Drummers pound out rhythms that shake the ground. The whole city dances for four days straight.

Now let us talk about football — or as Brazilians say, futebol. Brazil has won the FIFA World Cup five times, more than any other country. Children play on beaches, in alleyways, on dirt fields — anywhere they can find space. The legendary Pele, who grew up too poor to afford a ball, practised with a sock stuffed with newspaper. He went on to score over a thousand goals and became one of the greatest athletes in history.

Brazilian food is a warm hug. Feijoada, the national dish, is a rich stew of black beans and pork, served with rice, orange slices, and farofa — crunchy toasted cassava flour. On hot days, Brazilians cool down with acai bowls — thick, frozen purple pulp from a palm berry, topped with granola, banana, and honey. Acai comes straight from the Amazon.

Brazilians greet friends with a kiss on each cheek and the word "oi," which means "hi." Family gatherings are loud, warm, and filled with laughter — Sunday lunch at grandma's house can last all afternoon.

Tonight, {childName}, remember that the happiest communities are the ones that make time to dance, play, and eat together. Goodnight, little samba dancer.`,
      },
      {
        id: 'dc_br_ep5_facts', episodeNumber: 5, title: 'Record-Breaking Brazil',
        subtitle: 'The loudest animals, widest rivers, and a city built from nothing.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Brazil · Episode 5',
        body: `Brazil is so full of records that your head might spin. Ready? Let us go.

The Amazon River is not just the mightiest river — scientists recently discovered that beneath it flows another river, underground, at a depth of about four thousand metres. This hidden river is just as long as the Amazon above it, slowly moving through porous rock. A secret twin river flowing in the dark.

Brazil is the most biodiverse country on Earth. It is home to more species of plants, freshwater fish, and mammals than anywhere else. The Amazon alone contains about ten percent of all the species on the planet. Scientists find new species there every year — a tiny frog here, an unusual orchid there.

The howler monkey, found in Brazil's forests, is the loudest land animal in the world. Its call can be heard from five kilometres away. Imagine your alarm clock being heard from the other side of town — that is a howler monkey at sunrise.

In 1960, Brazil did something extraordinary. It built a brand-new capital city from scratch — Brasilia — in the middle of empty grassland. The architect Oscar Niemeyer designed buildings that looked like they came from the future — swooping curves, white domes, and towers that seemed to float. From above, the city is shaped like an aeroplane.

Brazil's coastline is the longest in the Atlantic Ocean — over seven thousand four hundred kilometres of beaches. The country spans three time zones. And the Amazon River's mouth is so wide — over three hundred and twenty kilometres — that you could fit the entire country of England inside it.

One more: the Itaipu Dam, on the border with Paraguay, was once the largest hydroelectric dam in the world. It produces enough clean energy to power entire countries.

Tonight, {childName}, remember that a country this big holds enough wonders for a lifetime of exploring — and the adventure is always just beginning. Goodnight, little explorer.`,
      },
    ],
  },

  // ─── 4. France 🇫🇷 ────────────────────────────────────────────────────────────
  {
    id: 'discover-france',
    title: 'Discover France',
    icon: '🇫🇷',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #f8fafc 50%, #dc2626 100%)',
    description: 'Five bedtime journeys across France — lavender fields, knights, the Eiffel Tower, croissants, and records that sparkle.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_fr_ep1_geo', episodeNumber: 1, title: 'Lavender, Alps & Atlantic Waves',
        subtitle: 'Fly over purple fields, snowy peaks, and golden coastlines.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover France · Episode 1',
        body: `Close your eyes and imagine you are a butterfly drifting over a country shaped like a hexagon — six beautiful sides surrounded by mountains, oceans, and rivers. Welcome to France, sitting right in the heart of Western Europe.

Start in the south, in a region called Provence. Below you stretch endless rows of lavender — purple as far as you can see, humming with bees, filling the warm air with a scent so sweet it makes you sleepy. Sunflowers stand tall in neighbouring fields, their golden faces always turned toward the sun. Olive trees twist their silver-green leaves in the breeze, their roots deep in sandy soil.

Now fly east and the land rises sharply. You have reached the French Alps — jagged, snow-capped peaks where Mont Blanc, the tallest mountain in Western Europe, towers at four thousand eight hundred and eight metres. Skiers carve down white slopes in winter, and in summer, hikers walk through meadows dotted with wildflowers and the gentle clanging of cowbells.

Turn north and you will cross rolling green countryside — vineyards in neat rows in Burgundy, fields of golden wheat in the Loire Valley, and thick forests in the Vosges where deer hide among ancient oak trees.

The west coast faces the Atlantic Ocean. In Brittany, dramatic cliffs drop into crashing waves, and lighthouses perch on lonely rocks. In the south-west, the Dune of Pilat is the tallest sand dune in Europe — over one hundred metres high — and from its top you can see dark pine forest on one side and sparkling ocean on the other.

Four great rivers wind through France — the Seine through Paris, the Loire through castle country, the Rhone through wine country, and the Garonne through the sunny south-west.

Tonight, {childName}, remember that even a country small enough to cross in a day can hold a universe of beauty within its borders. Sweet dreams, little butterfly.`,
      },
      {
        id: 'dc_fr_ep2_history', episodeNumber: 2, title: 'Knights, Kings & a Girl Named Joan',
        subtitle: 'Castles, crowns, and the teenager who changed history.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover France · Episode 2',
        body: `Once upon a very real time, France was a land of castles, knights in shining armour, and kings who wore crowns heavy with jewels. But the most incredible story of all belongs to a teenage girl.

Over a thousand years ago, France was ruled by powerful kings — the Franks. A king named Charlemagne united much of Europe and was crowned emperor on Christmas Day in the year 800. He loved books and learning so much that he set up schools across his empire, even though most people at the time could not read.

The Loire Valley filled up with castles — over three hundred of them, with tall towers, drawbridges over moats, and gardens trimmed into perfect shapes. Knights trained from boyhood, learning to joust on horseback and follow a code of honour — be brave, be kind, protect those weaker than you.

Then came a dark time. England and France fought a war that lasted over a hundred years — the Hundred Years' War. France was losing badly. Whole regions were captured. Hope was fading.

And then, from a tiny village called Domremy, came Joan of Arc — a seventeen-year-old girl who had never held a sword. She believed she heard voices telling her to save France. She cut her hair short, put on armour, and rode to meet the prince. She was so brave and so certain that soldiers twice her age followed her into battle. She helped lift the siege of Orleans, a turning point in the war. Joan was captured and tragically killed at just nineteen — but her courage changed the course of history. Today, she is one of France's greatest heroes.

Centuries later, in 1789, the French people rose up and said that all citizens deserved equal rights. The French Revolution gave the world the words liberty, equality, and fraternity — freedom, fairness, and friendship for all.

Tonight, {childName}, remember Joan of Arc. You do not need to be big or old to be brave. Sometimes the quietest voice in the room can change the world. Goodnight, little knight.`,
      },
      {
        id: 'dc_fr_ep3_places', episodeNumber: 3, title: 'The Eiffel Tower & the Louvre',
        subtitle: 'Climb the iron lady of Paris and meet the most famous smile in the world.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover France · Episode 3',
        body: `Imagine you are standing on a wide green lawn in Paris, your neck tilted all the way back, looking straight up at the Eiffel Tower. It soars three hundred and thirty metres into the sky — taller than an eighty-storey building — and it is made entirely of iron. Eighteen thousand pieces of iron held together by two and a half million rivets. When it was built in 1889 for a world fair, many people hated it. They called it an eyesore, a metal monster. But Parisians grew to love it, and now it is the most visited paid monument on Earth. At night, twenty thousand light bulbs make it sparkle for five minutes every hour, like a giant golden candle.

Walk along the River Seine and you will reach the Louvre — the biggest art museum in the world. It used to be a royal palace, and you can still feel its grandeur in the long marble hallways and golden ceilings. Inside hangs the Mona Lisa, a small painting by Leonardo da Vinci of a woman with a mysterious half-smile. Millions of people travel from around the world just to stand in front of her for a few minutes and wonder: what is she thinking?

Take a train south to the coast, and you will reach the Palace of Versailles — a palace so enormous it has over two thousand three hundred rooms and gardens that stretch for kilometres, with fountains that shoot water high into the air in perfect choreography.

In Normandy, on the northwest coast, cliffs rise above beaches where one of the most important events of the twentieth century took place — D-Day, when thousands of brave soldiers landed on the shore to free Europe during World War Two. Today, peaceful meadows and white crosses mark the spot.

And in the south, the hilltop village of Mont-Saint-Michel rises from the sea like a fairy-tale castle, cut off from the mainland when the tide rolls in.

Tonight, {childName}, remember that the Eiffel Tower was once the most hated building in Paris — and now it is the most loved. Sometimes the best ideas just need time. Goodnight, little artist.`,
      },
      {
        id: 'dc_fr_ep4_culture', episodeNumber: 4, title: 'Croissants, Berets & Bonjour',
        subtitle: 'The food, fashion, and daily rituals that make France magnifique.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover France · Episode 4',
        body: `In France, breakfast starts with a warm croissant — a crescent-shaped pastry made of thin layers of buttery dough, so flaky that crumbs rain down on the table like golden confetti. Dip it in a bowl of hot chocolate — yes, a bowl, not a mug — and you have the most perfect morning in the world.

French food is treated like an art form. Bakers wake at three in the morning to make fresh baguettes — long, crispy loaves of bread with soft, fluffy insides. By law, a traditional French baguette can only contain four ingredients: flour, water, salt, and yeast. Simple things, done perfectly.

Lunch is not rushed. Families sit down together, eat slowly, and talk. A typical meal might be a savoury quiche Lorraine — a warm egg and cheese tart — followed by a green salad, then cheese (France has over a thousand types of cheese!), and finally a small dessert like a fruit tart or a delicate cream puff.

French children say "bonjour" — good day — to every grown-up they meet. It is considered the most important word in France. Walking into a shop without saying bonjour is like walking into someone's home without knocking.

France is also the birthplace of fashion. Paris Fashion Week draws designers from around the world twice a year. But everyday French style is simpler than you might think — a striped shirt, good shoes, and confidence. The French believe that being well-dressed is a way of being polite to the people around you.

French children play petanque — a game where you toss metal balls toward a small wooden target ball on a sandy court. It is played in village squares everywhere, usually by people of all ages, with plenty of friendly arguing about whose ball is closest.

The Tour de France, the world's most famous bicycle race, winds through the country every July, climbing mountain passes and speeding through sunflower fields.

Tonight, {childName}, remember that the best things — a warm croissant, a slow lunch, a kind bonjour — are often the simplest. Goodnight, magnifique dreamer.`,
      },
      {
        id: 'dc_fr_ep5_facts', episodeNumber: 5, title: 'Ooh La La — French Records',
        subtitle: 'The most visited country, the fastest trains, and a bridge taller than the Eiffel Tower.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover France · Episode 5',
        body: `France holds some records that will make you say "ooh la la!" Ready? Here we go.

France is the most visited country on the entire planet. Every year, more than ninety million tourists arrive — that is more than the entire population of France itself. They come for the food, the art, the history, and of course, that sparkling tower.

The TGV — Train a Grande Vitesse, which means "high speed train" — once set a world speed record of five hundred and seventy-four kilometres per hour. That is faster than a small aeroplane. Regular TGV trains cruise at three hundred and twenty kilometres per hour, zooming passengers from Paris to the south of France in just three hours.

The Millau Viaduct is a bridge so tall that its highest point — three hundred and forty-three metres — is taller than the Eiffel Tower. It crosses a valley in the south of France, and when morning mist fills the valley below, the bridge looks like it is floating in the clouds.

France gave the world the metric system — metres, kilograms, litres — the measuring system used by almost every country on Earth. French scientists in the 1790s decided the world needed one simple system that everyone could share.

The Louvre museum is so big that if you spent thirty seconds looking at each piece of art, it would take you over one hundred days to see everything — without sleeping.

Here is a sweet one. The eclair, the macaron, the souffle, the crepe, and the croissant — five of the world's most beloved pastries — all come from France. French patisseries treat baking like chemistry, measuring every gram with precision.

And France has a village called Saint-Louis-de-Montferrand where the postbox is a baguette. Well, shaped like one. Because in France, even the mail has style.

Tonight, {childName}, remember that a country does not need to be the biggest to be the most wonderful — it just needs to do things with love. Goodnight, little record-keeper.`,
      },
    ],
  },

  // ─── 5. Egypt 🇪🇬 ────────────────────────────────────────────────────────────
  {
    id: 'discover-egypt',
    title: 'Discover Egypt',
    icon: '🇪🇬',
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 40%, #d4a574 100%)',
    description: 'Five bedtime journeys across Egypt — the Nile, pharaohs, pyramids, spices, and records carved in stone.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_eg_ep1_geo', episodeNumber: 1, title: 'The Nile & the Golden Desert',
        subtitle: 'Follow the world\'s longest river through a land of sand and green.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Egypt · Episode 1',
        body: `Close your eyes and imagine you are a hawk, circling high above a land of gold. Below you stretches Egypt — mostly desert, vast and quiet, where sand dunes ripple like a frozen ocean. The Sahara Desert covers almost the entire country, and it is the largest hot desert on Earth.

But look — there, cutting through the golden sand like a long green ribbon, is the Nile River. The Nile is the longest river in Africa, flowing over six thousand six hundred kilometres from deep in the heart of the continent all the way north to the Mediterranean Sea. Without the Nile, Egypt would be nothing but sand. The river brings life. Along its banks, palm trees sway, fields of wheat and cotton grow thick and green, and farmers called fellahin work the soil just as their ancestors did thousands of years ago.

Every year, the Nile used to flood, spreading rich black mud across the land. This mud was so good for growing crops that the ancient Egyptians called their country Kemet — "the black land." The floods were so regular that farmers could plan their whole year around them.

Fly south and you will reach Lake Nasser, one of the largest man-made lakes in the world, created when the Aswan High Dam was built in the 1960s. The dam controls the Nile's floods and provides electricity to millions of people.

Along the coast of the Red Sea, the desert drops into crystal-clear water filled with coral reefs almost as colourful as the Great Barrier Reef. Fish striped in orange and purple dart through underwater gardens of pink and blue coral.

In the western desert, an oasis called Siwa hides among the dunes — a green pocket of palm trees and freshwater springs where people have lived for thousands of years, far from any city, under the most star-filled sky you have ever seen.

Tonight, {childName}, remember that life always finds a way — even in the driest desert, a river can bring a world of green. Sweet dreams, little hawk.`,
      },
      {
        id: 'dc_eg_ep2_history', episodeNumber: 2, title: 'Pharaohs & the River of Time',
        subtitle: 'Gods, queens, and a civilisation that lasted three thousand years.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Egypt · Episode 2',
        body: `Imagine a civilisation so powerful it lasted over three thousand years — longer than any other in human history. That is ancient Egypt.

It all began along the Nile. Around five thousand years ago, a king named Narmer united Upper and Lower Egypt into one kingdom. He wore a double crown — one for each region — and became the first pharaoh. Pharaohs were believed to be part human, part god, chosen by the heavens to rule the land.

The Egyptians worshipped many gods. Ra, the sun god, sailed across the sky each day in a golden boat. Anubis, with the head of a jackal, guarded the dead. And Isis, the great mother goddess, was said to have magical powers strong enough to bring the dead back to life.

One of the most fascinating pharaohs was Hatshepsut — a woman who became pharaoh in a time when only men were supposed to rule. She wore the royal false beard, built magnificent temples, and sent trading ships to faraway lands. Her temple at Deir el-Bahari, carved into the side of a cliff, still stands today — three thousand five hundred years later.

Then there was Tutankhamun — the boy king, who became pharaoh at just nine years old. When his tomb was discovered in 1922, it was filled with golden treasures that had been sealed in darkness for over three thousand years. His golden death mask, with its calm, young face, is one of the most famous objects ever found.

The ancient Egyptians invented hieroglyphics — a writing system made of tiny pictures. A bird meant one thing, a wavy line meant water, an eye meant to see. For centuries, nobody could read them — until a stone slab called the Rosetta Stone was found, and a clever scholar cracked the code.

Tonight, {childName}, remember that the most powerful people in history were often the ones who built things that lasted — not weapons, but temples, stories, and knowledge. Goodnight, little pharaoh.`,
      },
      {
        id: 'dc_eg_ep3_places', episodeNumber: 3, title: 'Pyramids & the Sphinx',
        subtitle: 'Stand before the last surviving wonder of the ancient world.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Egypt · Episode 3',
        body: `Imagine you are standing at the edge of the desert, just outside the city of Cairo. The sand is warm under your feet. And there, rising before you against the pale blue sky, are the Great Pyramids of Giza — the last surviving wonder of the ancient world.

The biggest one, the Great Pyramid, was built for Pharaoh Khufu over four thousand five hundred years ago. It is made of more than two million stone blocks, each weighing as much as a car. It stood as the tallest structure on Earth for nearly four thousand years. And here is the most astonishing part — it was built without modern machines. Workers cut limestone blocks, dragged them on wooden sleds, and stacked them with incredible precision. The base is so perfectly level that the difference between the highest and lowest corners is just two centimetres.

Guarding the pyramids is the Great Sphinx — a massive statue with the body of a lion and the face of a pharaoh, carved from a single ridge of limestone. It is seventy-three metres long and twenty metres tall. Sand has buried it up to its shoulders many times over the centuries, and each time, someone has dug it out again.

Sail up the Nile to Luxor, and you will find the Valley of the Kings — a hidden desert valley where sixty-three royal tombs are cut deep into the rock. The walls inside are painted with scenes of the afterlife — boats sailing through a starry underworld, gods weighing hearts on golden scales, and pharaohs joining the sun on its eternal journey.

Across the river stands the Temple of Karnak, so large that ten European cathedrals could fit inside it. Its columns, painted in faded reds and blues, are as thick as ancient trees and rise higher than a five-storey building.

In the south, the temples of Abu Simbel feature four giant statues of Pharaoh Ramesses II, each twenty metres tall, carved directly into the cliff face, gazing out across the desert with calm, eternal eyes.

Tonight, {childName}, remember that the pyramids were built one block at a time — and anything you build with patience and care can last for thousands of years. Goodnight, little builder.`,
      },
      {
        id: 'dc_eg_ep4_culture', episodeNumber: 4, title: 'Spices, Stars & Sweet Tea',
        subtitle: 'The food, music, and warm hospitality that fill Egyptian homes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Egypt · Episode 4',
        body: `In Egypt, when a guest arrives, the very first thing that happens is tea. Sweet, dark, amber-coloured tea in a small glass, sometimes with fresh mint leaves floating on top. Offering tea is a way of saying: "You are welcome here. Sit. Stay. Tell me about your day."

Egyptian food is warm, hearty, and full of flavours that have been perfected over centuries. The national dish is koshari — a big, comforting bowl of rice, lentils, macaroni, and chickpeas, topped with tangy tomato sauce and crispy fried onions. It sounds simple, but every bite is a little symphony of textures and tastes. Street vendors serve it from huge pots, and it costs almost nothing — because good food should be for everyone.

For breakfast, many Egyptians eat ful medames — slow-cooked fava beans mashed with garlic, lemon, and olive oil, scooped up with warm flatbread. It has been eaten in Egypt for thousands of years. Pharaohs probably ate something very similar.

Egyptian music fills the air like perfume. The oud — a pear-shaped stringed instrument — plays melodies that can make you feel happy and melancholy at the same time. The great singer Umm Kulthum, known as the Star of the East, had a voice so powerful that when she sang on the radio, the streets of Cairo would go quiet as millions of people stopped to listen.

Family is at the centre of everything. Egyptian families are often large and close-knit. Friday is the day for gathering — grandparents, aunts, uncles, and cousins fill the house with laughter, stories, and enormous meals that take all morning to prepare.

During the holy month of Ramadan, Muslims fast from sunrise to sunset and then break their fast with a special meal called iftar. Lanterns called fanoos are hung from balconies, glowing in every colour, and children run through the streets singing traditional Ramadan songs.

Tonight, {childName}, remember that hospitality — making someone feel at home — is one of the most beautiful gifts you can give. Goodnight, little host.`,
      },
      {
        id: 'dc_eg_ep5_facts', episodeNumber: 5, title: 'Ancient Records & Modern Marvels',
        subtitle: 'The oldest board game, the busiest canal, and toothpaste from the pharaohs.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Egypt · Episode 5',
        body: `Egypt is a land where records were being set before most countries even existed. Let us dive in.

The ancient Egyptians invented one of the first forms of toothpaste — a mixture of crushed rock salt, dried flowers, pepper, and mint. They also invented breath mints made of cinnamon and honey. Even five thousand years ago, people wanted fresh breath.

The oldest known board game, Senet, was played in Egypt over five thousand years ago. The board had thirty squares and players moved pieces based on the throw of sticks. Pharaohs were buried with Senet boards so they could play in the afterlife. Imagine loving a board game so much you wanted to take it with you forever.

The Suez Canal, opened in 1869, is one of the most important waterways on Earth. It connects the Mediterranean Sea to the Red Sea, allowing ships to travel between Europe and Asia without going all the way around Africa. About fifty ships pass through it every single day, carrying goods that fill shops all over the world.

Here is an amazing engineering fact. In the 1960s, the temples of Abu Simbel were about to be flooded by the new Aswan Dam. So engineers cut the entire temple into blocks — over a thousand of them, some weighing thirty tonnes — and moved it to higher ground, piece by piece. It took five years. They reassembled it so perfectly that on the same two days each year, sunlight still shines through the temple entrance and illuminates the statues inside, exactly as it did three thousand years ago.

Ancient Egyptians were some of the first people to use a calendar with three hundred and sixty-five days. They divided the year into twelve months and three seasons — flood, growth, and harvest — based on the Nile.

The Great Pyramid was once covered in smooth white limestone that gleamed so brightly in the sun it could be seen from miles away. People called it "the mountain that shines."

Tonight, {childName}, remember that the people of Egypt have been inventing, building, and dreaming for five thousand years — and the story is still being written. Maybe you will add a chapter of your own. Goodnight, little inventor.`,
      },
    ],
  },,
// ── 🇲🇽 Mexico ──────────────────────────────────────────────────────────
  {
    id: 'discover-mexico',
    title: 'Discover Mexico',
    icon: '🇲🇽',
    gradient: 'linear-gradient(135deg, #166534 0%, #dc2626 50%, #fafafa 100%)',
    description: 'Five bedtime journeys through Mexico — volcanoes, pyramids, bright colors, and amazing flavors.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_mx_ep1_geo', episodeNumber: 1, title: 'Mountains of Fire & Turquoise Seas',
        subtitle: 'Mexico\'s wild landscapes — from smoking volcanoes to glowing caves.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Mexico · Episode 1',
        body: `Imagine you are a tiny hummingbird, hovering above a country shaped like a giant horn. Welcome to Mexico, where the land itself tells stories.

Down the middle of the country runs a chain of enormous mountains called the Sierra Madre — the "Mother Mountains." They are so tall that clouds get stuck on their peaks like fluffy white hats. Between the mountains sit high, flat valleys where cities sparkle at night like bowls full of stars.

Now fly south and you will find two volcanoes standing side by side near Mexico City. Their names are Popocatépetl and Iztaccíhuatl — Popo and Izta for short. Popo is still alive! Sometimes he sends puffs of smoke into the sky, like a sleeping dragon breathing in his dreams. Izta is quiet and covered in snow. An old legend says she is a princess who fell into an endless sleep, and Popo watches over her forever.

Zoom to the east coast and the land flattens into the Yucatán Peninsula — a limestone shelf hiding thousands of underground rivers and magical pools called cenotes. Picture a hole in the jungle floor filled with crystal-clear water that glows turquoise when sunlight pours in. Ancient people believed cenotes were doorways to another world.

Head northwest and you will cross the Sonoran Desert, where cactuses grow taller than houses. The giant saguaro cactus can live for two hundred years and hold enough water inside to fill a bathtub. Even in the driest places, life finds a way.

And if you fly all the way to the coast of Baja California, gray whales swim close to shore every winter to have their babies in warm, shallow lagoons. Mama whales sometimes lift their calves to the surface so people in boats can say hello.

Tonight, {childName}, remember that Mexico's land stretches from smoking volcanoes to glowing underwater caves. Even the Earth has a wild imagination — and so do you.`,
      },
      {
        id: 'dc_mx_ep2_hist', episodeNumber: 2, title: 'Pyramids, Calendars & Chocolate',
        subtitle: 'The ancient civilizations that built wonders in the jungle.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Mexico · Episode 2',
        body: `Long before cars or phones or even writing in English, brilliant people built cities in Mexico that amazed the world.

The Olmec people came first, over three thousand years ago. They carved enormous stone heads — some taller than a grown-up — out of volcanic rock and rolled them through the jungle. Nobody is quite sure how they moved stones that heavy. Some heads weigh as much as four elephants!

Then came the Maya, who built gleaming white cities in the jungle of the Yucatán. The Maya loved math and stars. They invented a calendar so accurate that it could predict eclipses hundreds of years into the future. At the city of Chichén Itzá, they built a pyramid called El Castillo — "The Castle." Twice a year, when the sun sets on the spring and autumn equinox, shadows slide down the pyramid stairs and form the shape of a giant feathered serpent slithering to the ground. The Maya designed that on purpose, thousands of years ago!

In central Mexico, the Aztecs built their capital, Tenochtitlán, on an island in the middle of a lake. They created floating gardens called chinampas — rafts of woven reeds piled with soil where they grew corn, beans, squash, and flowers. The city had wide canals instead of streets, bridges, and a marketplace so big that sixty thousand people visited it every single day.

And here is a delicious secret: the Aztecs invented chocolate! They ground cacao beans into a bitter, spicy drink they called xocolātl. They believed it was a gift from the gods. When European explorers tasted it, they added sugar — and that is how the chocolate you know was born.

Close your eyes, {childName}, and picture those ancient builders, stargazers, and chocolate makers. They proved that curiosity and cleverness can build wonders that last forever — and your ideas can too.`,
      },
      {
        id: 'dc_mx_ep3_places', episodeNumber: 3, title: 'Colors Everywhere You Look',
        subtitle: 'From Frida\'s blue house to the floating gardens of Xochimilco.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Mexico · Episode 3',
        body: `Mexico is one of the most colorful countries on Earth, and tonight we are going to visit its most magical places.

Start in Mexico City, one of the biggest cities in the world. Over twenty-one million people live here! In the heart of the city stands the Palacio de Bellas Artes — the Palace of Fine Arts — a building made of white marble that glows golden at sunset. Inside, enormous murals painted by Diego Rivera cover the walls, telling the story of Mexico in swirling colors.

Now hop on a brightly painted boat called a trajinera and float through the canals of Xochimilco, the last remaining piece of those ancient Aztec floating gardens. Musicians play guitars on passing boats. Flower sellers paddle alongside you. The water reflects every color of the rainbow.

Travel south to the town of Oaxaca, where buildings are painted in terracotta, mustard yellow, and turquoise. The streets smell like roasting chocolate and fresh tortillas. Every July, the Guelaguetza festival fills the hillside stadium with dancers in spectacular costumes, each village sharing its own special dance.

In the small city of Guanajuato, houses are stacked up the hillsides in every crayon color you can imagine — pink, orange, lime green, sky blue. The streets are so narrow that people on opposite balconies can shake hands across the alley. Underground tunnels, once river beds, now serve as roads for cars driving beneath the city.

And do not forget the Casa Azul — the Blue House — in the Coyoacán neighborhood of Mexico City. This cobalt-blue building was the home of the famous artist Frida Kahlo. Her paintings, her garden, and even her kitchen are still there, bright and bold, just as she left them.

Dream in color tonight, {childName}. Mexico shows us that the world is more beautiful when you are not afraid to paint it bright.`,
      },
      {
        id: 'dc_mx_ep4_culture', episodeNumber: 4, title: 'Tacos, Mariachi & Day of the Dead',
        subtitle: 'The food, music, and celebrations that make Mexico unforgettable.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Mexico · Episode 4',
        body: `Let us start with the most important question: what is for dinner in Mexico?

The answer is tacos — but not the kind you might be picturing. In Mexico, a taco can be almost anything wrapped in a soft, warm corn tortilla. Street vendors called taqueros set up little stands on every corner, grilling meat over charcoal, chopping cilantro and onions, and squeezing fresh lime on top. There are tacos al pastor — thin slices of pork cooked on a spinning spit with a pineapple on top. There are tacos de canasta — "basket tacos" — carried through the streets in cloth-lined baskets, steaming and soft. Every region has its own special taco, and people argue lovingly about whose is best.

Now listen — do you hear that? Trumpets! Violins! Guitars! That is a mariachi band, and they are the soundtrack of Mexico. Mariachi musicians wear elegant suits with silver buttons and wide-brimmed sombreros. They play at weddings, birthdays, and sometimes just under someone's window at midnight as a surprise serenade. The music swells with joy and sometimes with beautiful sadness — because mariachi is not afraid of big feelings.

The most magical celebration in Mexico is Día de los Muertos — the Day of the Dead — on November first and second. Families build colorful altars called ofrendas decorated with bright marigold flowers, candles, sugar skulls, and photos of loved ones who have passed away. They set out the favorite foods and drinks of those they miss. It is not a sad holiday — it is a joyful reunion. Families believe that for one night, their loved ones return to share a meal and a laugh.

The marigold petals are scattered in paths from the cemetery to the house, so the spirits can follow the bright orange trail home.

As you drift to sleep, {childName}, remember that in Mexico, love does not end — it just changes shape, like marigold petals glowing in the candlelight.`,
      },
      {
        id: 'dc_mx_ep5_facts', episodeNumber: 5, title: 'World Records & Wild Wonders',
        subtitle: 'The jaw-dropping facts that make Mexico one of a kind.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Mexico · Episode 5',
        body: `Get ready, because Mexico is full of facts that will make your eyes go wide.

Mexico is home to the world's smallest volcano. Cuexcomate, near the city of Puebla, is only thirteen meters tall — about as high as a four-story building. You can walk down a spiral staircase inside it and stand at the bottom of a real volcanic crater. It has not erupted in a very long time, so do not worry!

In the Cave of Crystals deep beneath the Chihuahuan Desert, scientists discovered crystals as long as school buses. These giant selenite crystals grew slowly over hundreds of thousands of years in water heated by magma far below. The cave is so hot — over fifty degrees Celsius — that people can only survive inside for a few minutes, even wearing special cooling suits.

Mexico has more species of reptiles than any other country on Earth — over nine hundred kinds of lizards, snakes, and turtles. The axolotl, a smiling pink salamander that lives in the lakes near Mexico City, can regrow its legs, heart, and even parts of its brain. Scientists study it hoping to learn the secret of healing.

The world's largest pyramid by volume is not in Egypt — it is in Cholula, Mexico! The Great Pyramid of Cholula is so enormous that it looks like a hill with a church built on top. It is wider at the base than the Great Pyramid of Giza and was built layer upon layer over a thousand years by different civilizations.

And every winter, millions of monarch butterflies travel over four thousand kilometers from Canada and the United States to a tiny patch of forest in the mountains of Michoacán, Mexico. The trees bend under the weight of so many orange wings. Nobody taught the butterflies the route — they just know.

Goodnight, {childName}. Like those monarch butterflies, you carry something amazing inside you — an instinct for wonder that will guide you wherever you need to go.`,
      },
    ],
  },

  // ── 🇮🇹 Italy ──────────────────────────────────────────────────────────
  {
    id: 'discover-italy',
    title: 'Discover Italy',
    icon: '🇮🇹',
    gradient: 'linear-gradient(135deg, #166534 0%, #fafafa 50%, #dc2626 100%)',
    description: 'Five bedtime journeys through Italy — rolling hills, Roman roads, art, pasta, and impossible records.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_it_ep1_geo', episodeNumber: 1, title: 'The Boot in the Sea',
        subtitle: 'Italy\'s shape, volcanoes, and the bluest water you have ever seen.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Italy · Episode 1',
        body: `Look at a map of Europe and you will spot Italy right away — it is shaped like a tall leather boot, kicking a little triangle-shaped ball. That ball is the island of Sicily, and just above it, the toe of the boot nearly touches it. Italy is surrounded on three sides by the Mediterranean Sea, which is why the water is so beautifully blue.

Running down the back of the boot like a spine is a mountain chain called the Apennines. These green and rocky mountains stretch almost the entire length of the country, and shepherds have walked their flocks along these ridges for thousands of years.

Up in the very north, Italy shares the mighty Alps with its neighbors. Mont Blanc, the tallest peak in the Alps, sits right on the border with France. In winter, the peaks are frosted white. In summer, wildflowers carpet the meadows in purple, yellow, and pink.

Now here is where it gets exciting. Italy has three famous volcanoes. Mount Etna, on the island of Sicily, is the tallest active volcano in Europe. It rumbles and glows so often that locals call it "Mama Etna" — she is always grumbling about something. Mount Vesuvius sits near the city of Naples. Nearly two thousand years ago, it erupted so violently that it buried an entire Roman city called Pompeii under ash. And tiny Stromboli, a volcanic island, has been erupting almost nonstop for over two thousand years — sailors call it the "Lighthouse of the Mediterranean" because its glow guides ships at night.

Between the mountains and coasts lie gentle rolling hills covered in grapevines and olive trees. Tuscany's hills turn golden in summer, and the light there is so warm and soft that painters have traveled from around the world just to capture it.

Sleep well, {childName}. Italy is a land of fire, water, and golden light — proof that beauty comes in every element.`,
      },
      {
        id: 'dc_it_ep2_hist', episodeNumber: 2, title: 'Roads, Gladiators & Emperors',
        subtitle: 'The Roman Empire that shaped the world — told as a bedtime story.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Italy · Episode 2',
        body: `Once upon a time — and this part is true — a tiny village on seven hills beside a river grew into the most powerful empire the world had ever seen. This is the story of Rome.

According to legend, Rome was founded by twin brothers named Romulus and Remus, who were raised by a mother wolf. Whether or not you believe that part, the city they built became extraordinary. The Romans were brilliant builders. They invented concrete, built roads so straight and strong that some are still used today, and created aqueducts — stone bridges that carried water across valleys and into cities. Fresh water flowed from mountains to fountains, and every Roman could drink for free.

At the heart of the city stood the Colosseum, an arena so large it could seat fifty thousand people. Gladiators — warriors who were often slaves — fought wild animals and each other while the crowd cheered. It was thrilling and terrible at the same time. The Colosseum had trapdoors, elevators powered by pulleys, and even a system to flood the floor with water for pretend sea battles.

But Rome was not only about fighting. Roman children went to school, learned math and public speaking, and played with dolls made of clay and bone. Roman engineers heated floors with underground furnaces so families could walk barefoot in winter. They built public baths where people soaked, exercised, read books, and chatted — like a combination of a library, gym, and swimming pool.

At its biggest, the Roman Empire stretched from England to Egypt. Roman roads connected it all — over eighty thousand kilometers of them — so that a letter sent from London could reach Rome in just a few weeks.

Eventually the empire grew too large to manage and slowly faded. But its ideas — laws, roads, arches, even the alphabet you read today — live on in every corner of the modern world.

Goodnight, {childName}. The Romans showed us that one small village can change the whole world — and so can one small idea of yours.`,
      },
      {
        id: 'dc_it_ep3_places', episodeNumber: 3, title: 'Towers, Canals & Painted Ceilings',
        subtitle: 'Italy\'s most famous places — from the leaning tower to the floating city.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Italy · Episode 3',
        body: `Italy has more UNESCO World Heritage Sites than any other country on Earth — over fifty! Tonight, let us visit some of the most magical.

Start in Pisa, where a round white bell tower leans to one side like it is trying to peek around a corner. The Leaning Tower of Pisa was not supposed to lean — the ground beneath it was too soft on one side, and by the time builders noticed, they were already three stories up. They kept building anyway! It took almost two hundred years to finish, and it has been leaning for over eight hundred years. Engineers recently straightened it just a tiny bit so it would not fall, but they left the lean because, well, that is what makes it special.

Now travel north to Venice, a city built on water. There are no cars in Venice — only boats. Instead of streets, there are canals. Gondolas glide silently under arched stone bridges while the buildings seem to float on the lagoon. The most famous square, Piazza San Marco, sometimes floods when the tides rise, and pigeons scatter across the wet marble while musicians keep playing from café balconies.

In Rome, step inside the Pantheon, a temple built almost two thousand years ago with a giant hole in the roof called the oculus — the eye. Rain falls through it, sunlight pours through it, and on a clear night, you can see stars through that ancient circle. The dome is still the largest unreinforced concrete dome in the world.

And in Vatican City — the world's tiniest country, sitting right inside Rome — look up inside the Sistine Chapel. The ceiling was painted by Michelangelo, who lay on his back on scaffolding for four years to create scenes from the Bible. The most famous image shows two hands reaching toward each other, fingers almost touching — one belonging to a man, the other to God.

Dream of towers, canals, and painted skies tonight, {childName}. Italy reminds us that humans can build things so beautiful they make the whole world hold its breath.`,
      },
      {
        id: 'dc_it_ep4_culture', episodeNumber: 4, title: 'Pasta, Gelato & Family Sundays',
        subtitle: 'The food, family, and feeling that make Italy warm from the inside.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Italy · Episode 4',
        body: `In Italy, food is not just dinner — it is love you can taste.

Every region has its own special pasta. In Bologna, they make tagliatelle — long, flat ribbons of golden egg pasta served with a slow-cooked meat sauce that simmers for hours. In Naples, they serve spaghetti with simple tomato sauce, garlic, and fresh basil — because the best flavors do not need to be complicated. In Rome, cacio e pepe is just pasta, cheese, and pepper — three ingredients that somehow taste like magic.

There are over three hundred shapes of pasta in Italy. Some look like little ears (orecchiette), some like butterflies (farfalle), some like tiny tubes (penne), and some like sheets for layering into lasagna. Italian grandmothers — called nonnas — often make pasta by hand, rolling the dough on big wooden boards and cutting it with practiced fingers. Every nonna believes her recipe is the best, and every nonna is right.

After lunch, there is gelato — Italian ice cream that is denser and creamier than regular ice cream because it has less air. Flavors range from pistachio and hazelnut to lemon and dark chocolate. A proper gelato shop — a gelateria — might have forty flavors in a rainbow of colors behind the glass.

But the most important ingredient in Italian life is family. Sunday lunch is sacred. Grandparents, parents, children, aunts, uncles, and cousins all squeeze around one long table. The meal might last three hours — primo (pasta), secondo (meat or fish), contorno (vegetables), dolce (dessert), and then espresso in tiny cups. The adults talk loudly. The children run between chairs. Nobody checks the clock.

Italians also invented opera — stories told entirely through singing, with emotions so big they fill whole theaters. When an Italian feels something, they do not whisper it. They sing it.

As you fall asleep, {childName}, remember the Italian way: fill your table with people you love, take your time, and never rush a good thing.`,
      },
      {
        id: 'dc_it_ep5_facts', episodeNumber: 5, title: 'Supercars, Fountains & Cheese Vaults',
        subtitle: 'The incredible records and surprises hiding in Italy.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Italy · Episode 5',
        body: `Italy is a country of surprises, and tonight we are collecting the most amazing ones.

In the city of Maranello, a factory paints almost every car the same shade of red. This is Ferrari, and that red is called Rosso Corsa — "racing red." Every Ferrari is partly assembled by hand, and when the engine roars for the first time, the workers cheer. Italy is also home to Lamborghini, Maserati, and Pagani. Nobody makes supercars quite like the Italians.

Now here is a strange and wonderful fact: in the Emilia-Romagna region, banks accept wheels of Parmigiano-Reggiano cheese as collateral for loans. Yes, cheese. These giant golden wheels, each weighing about thirty-nine kilograms, are stored in enormous bank vaults with thousands of other wheels, aging for years while gaining value. The cheese vaults are climate-controlled and guarded like treasure — because to Italians, great cheese IS treasure.

Italy has a fountain in Rome called the Trevi Fountain where visitors toss coins over their left shoulder with their right hand to guarantee they will return to Rome someday. About three thousand euros in coins are thrown in every single day. The money is collected each night and donated to charity.

The oldest university in the world that has been running nonstop is the University of Bologna, founded in 1088 — almost a thousand years ago. Students have been studying there since before the printing press existed.

And deep inside a mountain in central Italy, scientists built a laboratory to study the tiniest particles in the universe. They chose the mountain because the rock above blocks interfering signals from space. Some of the biggest discoveries about how the universe works have come from deep inside an Italian mountain.

Italy even gave the world the piano, the thermometer, eyeglasses, and the radio. Not bad for a boot-shaped country!

Goodnight, {childName}. Italy proves that great things come in all shapes — even the shape of a boot kicking a ball across the sea.`,
      },
    ],
  },

  // ── 🇩🇪 Germany ──────────────────────────────────────────────────────────
  {
    id: 'discover-germany',
    title: 'Discover Germany',
    icon: '🇩🇪',
    gradient: 'linear-gradient(135deg, #171717 0%, #dc2626 50%, #eab308 100%)',
    description: 'Five bedtime journeys through Germany — forests, castles, inventions, pretzels, and record-breaking feats.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_de_ep1_geo', episodeNumber: 1, title: 'The Dark Forest & the Fairy-Tale River',
        subtitle: 'Germany\'s deep forests, mighty rivers, and snow-capped Alps.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Germany · Episode 1',
        body: `Close your eyes and picture a forest so thick and green that sunlight barely reaches the ground. Moss covers every rock. Mushrooms glow faintly in the shadows. Somewhere, a woodpecker taps a rhythm on an ancient oak. This is the Black Forest — the Schwarzwald — in southwest Germany, and it is as magical as it sounds.

Germany sits right in the heart of Europe. To the north, flat plains stretch to the cold seas — the North Sea and the Baltic Sea, where seals rest on sandbars and lighthouses blink through the fog. Sandy islands dot the coastline, and in summer, families build the most elaborate sandcastles you have ever seen because the tides leave long, flat beaches that go on forever.

In the middle of the country, gentle hills and river valleys create a patchwork of vineyards, meadows, and small towns with half-timbered houses — buildings with dark wooden beams crisscrossing white walls, like something from a storybook.

The Rhine River is Germany's most famous waterway. It flows for over a thousand kilometers, carving steep valleys through rocky cliffs. Ruined castles perch on nearly every hilltop along its banks — over forty of them in one stretch alone! Legend says a maiden named Lorelei sat on a rock above the narrowest part of the Rhine, singing so beautifully that sailors forgot to steer and crashed into the rocks below.

Down in the south, the land rises dramatically into the Bavarian Alps. Germany's tallest mountain, the Zugspitze, stands almost three thousand meters high. On a clear day from its peak, you can see into four countries at once — Germany, Austria, Switzerland, and Italy.

Between the Alps and the forests lie sparkling lakes so clear you can see fish swimming near the bottom, surrounded by meadows full of wildflowers and the sound of cowbells.

Sleep tight, {childName}. Germany is a land of dark forests and bright meadows, where every river bend hides a story waiting to be told.`,
      },
      {
        id: 'dc_de_ep2_hist', episodeNumber: 2, title: 'Knights, Kingdoms & a Wall That Fell',
        subtitle: 'From medieval castles to the night the Berlin Wall came down.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Germany · Episode 2',
        body: `Germany's history is like a thick storybook with chapters that range from thrilling to heartbreaking — and one chapter with an ending so happy that people danced in the streets.

A thousand years ago, Germany was not one country but hundreds of tiny kingdoms, duchies, and free cities, each ruled by its own lord or prince. Knights in heavy armor rode through the forests, and castles popped up on every hilltop. Some lords were kind. Some were not. But the craftspeople in the towns — blacksmiths, bakers, weavers — formed groups called guilds to protect each other and share skills. Those guilds helped build the strong, careful engineering culture Germany is famous for today.

Around the year 1440, a German goldsmith named Johannes Gutenberg changed the world forever. He invented the printing press with movable type. Before Gutenberg, books had to be copied by hand, one page at a time. A single Bible took a monk years to write. Gutenberg's press could print a page in minutes. Suddenly books were affordable. Ideas spread like wildfire. Some historians say the printing press was the most important invention of the last thousand years.

Centuries later, Germany went through its darkest chapter. Two World Wars brought terrible suffering to Europe and the world. After the second war ended in 1945, the country was split in two — West Germany and East Germany — divided by borders, fences, and in Berlin, a thick concrete wall. Families were separated. Friends could not visit each other. The Wall stood for twenty-eight years.

Then, on the night of November ninth, 1989, something incredible happened. The gates opened. People streamed through, crying and hugging strangers. They chipped away at the Wall with hammers. They danced on top of it. Germany was whole again.

Tonight, {childName}, remember the Wall that fell. No barrier lasts forever when people believe in togetherness — and the best chapters are the ones where everyone comes home.`,
      },
      {
        id: 'dc_de_ep3_places', episodeNumber: 3, title: 'The Fairy-Tale Castle & the Clock Tower',
        subtitle: 'Germany\'s most famous buildings — from dream castles to glass domes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Germany · Episode 3',
        body: `High on a cliff in Bavaria, surrounded by pine forests and misty mountains, stands a castle so beautiful it looks like it belongs in a dream. Neuschwanstein Castle was built by King Ludwig II, who loved fairy tales and music so much that he designed a real castle to match his imagination. White towers rise into the clouds. Inside, murals of swans and legends cover every wall. Walt Disney visited this castle and loved it so much that it inspired Sleeping Beauty's castle at Disneyland.

In Berlin, the Reichstag building — Germany's parliament — has a modern glass dome on top that visitors can walk through on a spiral ramp. The dome is transparent on purpose. It symbolizes that the government should be open and visible to the people. From the top, you can look down and see the politicians working below.

The city of Cologne is famous for its enormous cathedral — the Kölner Dom. Construction started in 1248 and was not finished until 1880, over six hundred years later! For four years, it was the tallest building in the world. Its twin spires reach one hundred fifty-seven meters into the sky, and the stained glass windows paint the stone floor in rainbows of colored light every afternoon.

In the town of Rothenburg ob der Tauber, time seems to have stopped five hundred years ago. The entire medieval town is still surrounded by its original stone wall, and you can walk along the top of it, looking down at cobblestone streets, flower boxes, and tiny shops selling wooden toys and Christmas ornaments — all year round.

And in the Black Forest, master clockmakers have been building cuckoo clocks for over three hundred years. The world's largest cuckoo clock is the size of a house, and every hour a wooden bird the size of a child pops out and calls.

Dream of towers and cuckoo birds tonight, {childName}. Germany shows us that when people pour love into what they build, even stones can tell stories.`,
      },
      {
        id: 'dc_de_ep4_culture', episodeNumber: 4, title: 'Pretzels, Polka & Kindness in a Kinder Egg',
        subtitle: 'The food, music, and traditions that warm the German heart.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Germany · Episode 4',
        body: `In Germany, bread is serious business. Germans bake over three hundred different kinds of bread — more varieties than any other country in the world. Dark rye bread, sunflower seed bread, pumpernickel so dense you could use it as a doorstop (but it tastes wonderful), and of course, the pretzel — the Brezel.

A perfect German pretzel is golden brown on the outside, soft and chewy on the inside, with coarse salt crystals that crunch between your teeth. Bakers twist the dough into its famous knot shape, and the secret to that dark, shiny crust is dipping it in a special solution before baking. You can buy a fresh pretzel from a bakery on almost every street corner in Germany, and many children eat one for breakfast on the way to school.

Christmas in Germany is pure magic. The tradition of the Christmas tree started here! Families bring a real pine tree indoors, hang glass ornaments, and light real candles on the branches. In December, every town sets up a Weihnachtsmarkt — a Christmas market — with wooden stalls selling gingerbread, roasted almonds, hand-carved wooden figurines, and mugs of warm spiced cider. The air smells like cinnamon and pine, and twinkling lights turn every town square into a wonderland.

German children also get to celebrate something extra: on the eve of December sixth, they leave their shoes outside the door. Saint Nikolaus fills them with chocolate coins, oranges, and small toys. It is like a bonus Christmas two and a half weeks early!

Music runs deep in Germany. Ludwig van Beethoven, one of the greatest composers who ever lived, was born in the city of Bonn. He wrote some of his most powerful music after he had gone completely deaf. He could not hear a single note — but he felt every one.

Close your eyes, {childName}. Like Beethoven, you do not need everything to be perfect to create something beautiful. Just feel it — and let it out.`,
      },
      {
        id: 'dc_de_ep5_facts', episodeNumber: 5, title: 'Autobahns, Gummy Bears & Record Breakers',
        subtitle: 'The surprising facts that make Germany truly extraordinary.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Germany · Episode 5',
        body: `Hold on tight, because Germany has some facts that are going to zoom past you.

Germany has a highway system called the Autobahn, and on large stretches of it, there is no speed limit. That is right — drivers can go as fast as their cars can handle. Despite this, the Autobahn is one of the safest highway systems in the world because drivers follow strict rules: always pass on the left, never stop unless it is an emergency, and always pay attention. Germans prove that freedom and responsibility go hand in hand.

The gummy bear was invented in Germany in 1922 by a candy maker named Hans Riegel in the city of Bonn. He called his company Haribo — the first two letters of his first name, last name, and hometown: HA-RI-BO. Today, Haribo makes over one hundred million gummy bears every single day. Lined up in a row, one day's production would stretch around the Earth.

Germany is a world leader in renewable energy. On some sunny, windy days, the country produces so much electricity from solar panels and wind turbines that they actually have more power than they can use. Germany has shown the world that a big, industrial country can run on clean energy.

The world's narrowest street is in the city of Reutlingen. Called Spreuerhofstrasse, it is only thirty-one centimeters wide at its narrowest point. You would have to turn sideways to squeeze through!

Germans also love football — soccer — with a passion that unites the whole nation. The German national team has won the FIFA World Cup four times, and on game days, entire cities go quiet as everyone gathers around televisions, then erupt in cheers that echo for blocks.

And one more: the kindergarten — the very idea of a playful school for young children — was invented in Germany. The word means "children's garden," because the founder believed kids should grow like flowers: with sunlight, freedom, and gentle care.

Goodnight, {childName}. From gummy bears to gardens for children, Germany reminds us that the best inventions make life a little sweeter for everyone.`,
      },
    ],
  },

  // ── 🇰🇷 South Korea ──────────────────────────────────────────────────────
  {
    id: 'discover-southkorea',
    title: 'Discover South Korea',
    icon: '🇰🇷',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)',
    description: 'Five bedtime journeys through South Korea — misty mountains, ancient palaces, K-pop beats, and mind-blowing tech.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_kr_ep1_geo', episodeNumber: 1, title: 'Mountains, Islands & the Morning Calm',
        subtitle: 'South Korea\'s beautiful land — from volcanic peaks to bamboo forests.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Korea · Episode 1',
        body: `South Korea is a small country on a peninsula in East Asia, shaped a bit like a rabbit standing on its hind legs. Despite being smaller than many US states, it holds mountains, forests, beaches, islands, and one of the biggest cities in the world — all packed together like treasures in a jewelry box.

The country's old name is "The Land of the Morning Calm," and if you stand on a mountaintop at dawn, you will understand why. Mist rolls through the valleys like slow rivers of cloud, and the first sunlight paints everything gold and pink.

Mountains cover about seventy percent of South Korea. The most famous is Hallasan, a dormant volcano on Jeju Island in the south. At the very top is a crystal-clear crater lake called Baengnokdam — "White Deer Lake" — because legend says white deer once drank from its waters. The hike to the top passes through subtropical forest, then temperate forest, then alpine meadow — like walking through three different countries in one day.

Jeju Island itself is a wonder. Lava tubes — tunnels carved by ancient volcanic rivers — run beneath the island, and some are large enough to drive a car through. Above ground, curious volcanic rocks are carved into grandfather figures called dolhareubang, with big eyes and gentle smiles, guarding the island like friendly stone giants.

Back on the mainland, the Seoraksan mountains in the northeast are famous for their granite peaks that turn fiery red and orange in autumn when the maple leaves change color. The forests here are home to the Asiatic black bear, the Korean water deer, and the red-crowned crane — one of the rarest birds in the world.

Along the coast, over three thousand small islands scatter across the sea, many uninhabited and wild. Fishermen harvest seaweed that will be dried, seasoned, and eaten as a crispy snack across the country.

Rest now, {childName}. South Korea is proof that even a small land can hold enormous beauty — and so can a small heart full of wonder.`,
      },
      {
        id: 'dc_kr_ep2_hist', episodeNumber: 2, title: 'Kingdoms, Warriors & a Genius King',
        subtitle: 'The ancient rulers who shaped Korea — including one who gave his people an alphabet.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Korea · Episode 2',
        body: `Korea's history stretches back over four thousand years, filled with brilliant kings, brave warriors, and one of the cleverest inventions in all of human history.

Long ago, the Korean peninsula was divided into three kingdoms: Goguryeo in the north, mighty and warlike; Baekje in the southwest, known for art and elegance; and Silla in the southeast, famous for a group of young warrior-scholars called the Hwarang. These teenagers trained in sword fighting, poetry, horseback riding, and kindness — because they believed a true warrior must be gentle as well as strong. Eventually Silla united all three kingdoms, bringing peace to the peninsula.

Centuries later, during the Joseon dynasty, Korea's greatest king was born. King Sejong the Great ruled in the 1400s, and he cared deeply about one thing above all: that every person in his kingdom — rich or poor, man or woman — should be able to read and write. At that time, Koreans used Chinese characters, which took years to learn. Most common people could never master them.

So King Sejong gathered his smartest scholars and together they invented an entirely new alphabet called Hangul. It was designed to be so logical and simple that anyone could learn it in a single day. The shapes of the letters are based on the shape your mouth makes when you say them! Hangul is now considered one of the most scientific writing systems ever created. Every year on October ninth, South Korea celebrates Hangul Day in the king's honor.

Korea also built one of the world's first ironclad warships — the geobukseon, or "turtle ship." Covered in iron spikes and shaped like a turtle's shell, it could ram enemy boats without being boarded. Admiral Yi Sun-sin used these ships to defeat a much larger invading fleet, winning one of the greatest naval victories in history.

Dream of brave scholars and clever kings tonight, {childName}. King Sejong taught us that the greatest gift a leader can give is knowledge — and you already hold that gift every time you open a book.`,
      },
      {
        id: 'dc_kr_ep3_places', episodeNumber: 3, title: 'Palaces, Temples & the City That Never Sleeps',
        subtitle: 'South Korea\'s most stunning places — from ancient gardens to neon skylines.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Korea · Episode 3',
        body: `South Korea is a place where ancient and modern live side by side — sometimes on the very same street.

In the heart of Seoul, the capital, stands Gyeongbokgung Palace, built in 1395. Its name means "Palace Greatly Blessed by Heaven." Step through the massive gate and the noise of the modern city fades. Courtyards stretch out in perfect symmetry, wooden halls painted in vivid green and orange sit beneath curved tile roofs, and a throne room with a painted ceiling of phoenixes and dragons waits at the center. Every day, guards in traditional costumes stand perfectly still at the entrance, and tourists love to dress in hanbok — the flowing, colorful traditional Korean clothing — to stroll the grounds and take photos.

Just behind the palace is the neighborhood of Bukchon, where hundreds of traditional houses called hanok line narrow, hilly streets. These houses have gracefully curved roofs and heated floors — a system called ondol that Koreans invented over two thousand years ago. Hot air flows beneath the stone floor, so the entire room becomes warm and toasty. Koreans still prefer heated floors today.

Now step into modern Seoul, and the contrast will take your breath away. The Dongdaemun Design Plaza is a building that looks like a giant silver spaceship landed in the middle of the city — all curves, no straight lines, glowing at night with thousands of LED roses. Nearby, the Cheonggyecheon Stream flows through downtown — a beautiful, lantern-lit waterway that used to be buried under a highway until the city tore the road down and brought the stream back to life.

On Jeju Island, the Haenyeo — women sea divers — free-dive to the ocean floor without oxygen tanks to harvest shellfish, continuing a tradition that is centuries old. Most are grandmothers in their sixties and seventies, and they are considered national treasures.

Sleep peacefully, {childName}. South Korea teaches us to honor the old while reaching for the new — heated floors and silver spaceships, grandmothers and glowing roses, all in one beautiful place.`,
      },
      {
        id: 'dc_kr_ep4_culture', episodeNumber: 4, title: 'Kimchi, K-pop & the Art of Sharing',
        subtitle: 'The food, music, and family traditions that make Korea glow.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Korea · Episode 4',
        body: `In South Korea, every meal is a celebration of sharing. When food arrives at a Korean table, it does not come on one plate — it comes in many small dishes called banchan. Little bowls of seasoned vegetables, tofu, fish cakes, pickled radish, and always, always kimchi. Kimchi is fermented cabbage seasoned with chili pepper, garlic, ginger, and fish sauce. Every Korean family has their own recipe, passed down through generations, and in late autumn families gather for kimjang — a big community event where neighbors make hundreds of jars of kimchi together to last through winter.

Korean barbecue is another beloved tradition. A grill sits right in the middle of the table, and everyone cooks thin slices of marinated beef or pork together, wrapping the sizzling meat in lettuce leaves with rice, garlic, and spicy sauce. The sizzle, the laughter, the passing of food — eating together is the Korean way of saying "I care about you."

Now turn up the volume, because K-pop has taken over the world! Groups like BTS, BLACKPINK, and Stray Kids perform choreographed dances so precise that every finger, every head tilt, is synchronized perfectly. K-pop idols train for years — sometimes starting as teenagers — learning singing, dancing, and even multiple languages so they can connect with fans everywhere. The fan communities, called fandoms, are incredibly organized and kind, often raising money for charity in their favorite group's name.

Korea also has a beautiful tradition called jeong — a deep feeling of affection and attachment that builds between people over time. It is more than friendship, more than love. It is the warm bond that grows when you share meals, share struggles, and share life with someone. Koreans say that even strangers can build jeong by simply being kind to each other consistently.

As you drift off, {childName}, think about jeong. Every small act of sharing — a meal, a song, a smile — adds a thread to the invisible web of warmth that connects us all.`,
      },
      {
        id: 'dc_kr_ep5_facts', episodeNumber: 5, title: 'Robots, Speed & the Smartest Toilet',
        subtitle: 'The jaw-dropping records and innovations of South Korea.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Korea · Episode 5',
        body: `South Korea is one of the most high-tech countries on the planet, and its facts are going to blow your mind.

South Korea has the fastest average internet speed in the world. Downloading a full movie takes about one second. Almost the entire country is connected to super-fast broadband, and free public Wi-Fi is everywhere — on buses, in parks, even deep inside subway tunnels. Korean subway stations, by the way, have heated seats in winter and screen doors that keep you safe from the tracks.

Speaking of the subway — Seoul's metro system is one of the longest in the world, with over seven hundred kilometers of track. Every station has digital maps, phone chargers, and sometimes even small libraries where you can borrow a book for your ride.

South Korea is also the world capital of esports. Professional video game players are treated like sports stars, with packed stadiums, screaming fans, and salaries that can reach millions of dollars. The country even has a television channel dedicated entirely to watching people play games.

Here is a cozy fact: South Korea has more coffee shops per person than almost any country in the world. But Korean cafés are not just about coffee — there are cat cafés where you sip a latte while kittens climb on your shoulders, dog cafés, raccoon cafés, and even sheep cafés. There are also study cafés where students pay by the hour for a quiet desk, free drinks, and a focused atmosphere.

The country recycles over fifty percent of its food waste by turning it into animal feed and fertilizer. Special biodegradable bags are required, and some apartment buildings have smart bins that weigh your food waste and charge you — so wasting less saves money.

And one last one: South Korea's birth flower is the mugunghwa — the Rose of Sharon — a flower that blooms, falls, and blooms again all summer long. Koreans see it as a symbol of resilience. No matter how many times it falls, it comes back.

Goodnight, {childName}. Like the mugunghwa, you can always bloom again — faster internet not required.`,
      },
    ],
  },

  // ── 🇷🇺 Russia ──────────────────────────────────────────────────────────
  {
    id: 'discover-russia',
    title: 'Discover Russia',
    icon: '🇷🇺',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #fafafa 50%, #dc2626 100%)',
    description: 'Five bedtime journeys through Russia — frozen tundra, golden domes, ballet, borscht, and breathtaking records.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_ru_ep1_geo', episodeNumber: 1, title: 'The Biggest Country on Earth',
        subtitle: 'From frozen Siberia to volcanoes of fire — Russia\'s unbelievable landscapes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Russia · Episode 1',
        body: `Russia is the biggest country in the entire world. It is so enormous that it stretches across eleven time zones. When children in Moscow are eating breakfast, children on Russia's Pacific coast are already getting ready for bed. If you drove from one end to the other without stopping, it would take over a week.

In the north lies the Arctic tundra — a flat, frozen land where the ground stays frozen all year long, even in summer. This permanently frozen earth is called permafrost, and it has been frozen for thousands of years. In winter, the sun barely rises. But in summer, the sun never fully sets — for weeks, it just circles the horizon, painting the sky in endless shades of orange and pink. This is the land of the midnight sun.

South of the tundra stretches the taiga — the world's largest forest. It is made almost entirely of pine, spruce, and birch trees, and it covers an area bigger than the Amazon rainforest. Siberian tigers — the largest cats on Earth — prowl through the eastern taiga. They can weigh over three hundred kilograms and leave paw prints the size of dinner plates in the snow.

In the middle of Siberia lies Lake Baikal, the deepest and oldest lake in the world. It holds one-fifth of all the fresh water on Earth's surface. The water is so pure and clear that in winter, when the lake freezes, you can see right through the ice to the depths below. Strange creatures live in Baikal that exist nowhere else — including a freshwater seal called the nerpa, the only seal in the world that lives entirely in fresh water.

Far to the east, the Kamchatka Peninsula is a wild land of erupting volcanoes, steaming geysers, and brown bears catching salmon as they leap upstream. The Valley of Geysers shoots boiling water and steam into the freezing air, creating clouds that drift through a landscape that feels like another planet.

Dream of endless forests and frozen lakes tonight, {childName}. Russia reminds us that our world is so big that you could explore it every day and never run out of new wonders.`,
      },
      {
        id: 'dc_ru_ep2_hist', episodeNumber: 2, title: 'Tsars, Trains & a Revolution',
        subtitle: 'Russia\'s dramatic history — from powerful rulers to the railway that crossed a continent.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Russia · Episode 2',
        body: `Russia's history reads like the grandest story ever written — full of powerful rulers, impossible journeys, and moments that changed the entire world.

For centuries, Russia was ruled by tsars — emperors who held enormous power. The most famous early tsar was Ivan the Terrible, who earned his scary name not because he was always cruel, but because "terrible" in old Russian meant "fearsome" and "awe-inspiring." He united the many small Russian territories into one vast kingdom and built Saint Basil's Cathedral in Moscow — the one with those wild, colorful, onion-shaped domes that look like swirled candy.

Then came Peter the Great, a tsar who was nearly seven feet tall and bursting with curiosity. Peter traveled in disguise to Europe to learn shipbuilding, and he returned home determined to modernize Russia. He built an entirely new capital city — Saint Petersburg — on swampy marshland near the sea, declaring it Russia's "window to Europe." Thousands of workers built palaces, canals, and bridges where nothing but mud had existed before.

In the 1800s, Russia began building something that seemed impossible: a railway that would cross the entire country. The Trans-Siberian Railway stretches over nine thousand kilometers from Moscow to Vladivostok on the Pacific coast. It took twenty-five years to build, through frozen wilderness, across mighty rivers, and along the shores of Lake Baikal. Today, the full journey takes about six days and passes through hundreds of small towns and seven time zones. Passengers watch the landscape change from farmland to forest to steppe to mountains, all from a warm compartment with a cup of tea.

In 1961, Russia launched the first human being into space. Yuri Gagarin, a young pilot with a wide smile, orbited the Earth in a tiny capsule called Vostok 1. The entire flight lasted just one hundred eight minutes, but it changed humanity forever. When Gagarin looked down at our planet, he said: "The Earth is blue. How wonderful."

Goodnight, {childName}. Like Yuri Gagarin, sometimes the bravest journey starts with simply saying yes to something no one has tried before.`,
      },
      {
        id: 'dc_ru_ep3_places', episodeNumber: 3, title: 'Golden Domes & Frozen Palaces',
        subtitle: 'Russia\'s most breathtaking buildings and places.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Russia · Episode 3',
        body: `Russia's buildings are some of the most dramatic on Earth — as if the architects wanted every structure to take your breath away.

Start in Moscow's Red Square, where Saint Basil's Cathedral rises like a forest of colorful lollipops. Nine domes, each a different shape and pattern — striped, swirled, checkered — in reds, greens, blues, and golds. Legend says that Ivan the Terrible was so amazed by the cathedral that he asked the architects if they could build anything more beautiful. When they said yes, he — well, this is a bedtime story, so let us just say he made sure they would never build anything else. The cathedral has stood for over four hundred sixty years and is still the most photographed building in Russia.

Now take the train to Saint Petersburg and enter the Hermitage Museum, one of the largest art museums in the world. It fills five connected buildings, including the magnificent Winter Palace, where tsars once lived. The museum holds over three million items — paintings, sculptures, jewels, and even Egyptian mummies. If you spent one minute looking at each piece, it would take over eleven years to see everything.

The halls themselves are works of art. The Malachite Room is covered in bright green stone. The Peacock Clock, a golden mechanical sculpture of a peacock, owl, and rooster, still works after over two hundred fifty years — the peacock spreads its tail, the rooster crows, and the owl blinks.

In winter, Saint Petersburg holds something magical. When the rivers and canals freeze, the city hosts ice sculpture festivals. Artists carve enormous palaces, animals, and fairy-tale scenes out of solid blocks of ice, lit from inside with colored lights. An entire ice castle you can walk through, glowing blue and purple against the snowy sky.

And deep beneath Moscow, the metro stations are underground palaces. Chandeliers hang from painted ceilings. Marble columns line the platforms. Mosaics and statues decorate every wall. Muscovites call their metro "the people's palace" because beauty should belong to everyone.

Tonight, {childName}, dream of golden domes and ice palaces. Russia shows us that beauty is not a luxury — it is a gift meant to be shared with everyone who walks by.`,
      },
      {
        id: 'dc_ru_ep4_culture', episodeNumber: 4, title: 'Borscht, Ballet & Nesting Dolls',
        subtitle: 'The food, art, and cozy traditions that warm the Russian soul.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Russia · Episode 4',
        body: `When the snow is deep and the wind howls outside, Russians gather around the kitchen table — and the first thing they reach for is soup.

Borscht is Russia's most famous dish — a deep red soup made from beets, cabbage, potatoes, and herbs, served with a big spoonful of sour cream that swirls like a white cloud in a ruby sky. Every family makes it differently. Some add beef. Some keep it vegetarian. But every version warms you from the inside out, and there is always enough to share with a neighbor who drops by unannounced — because in Russia, the door is always open for guests.

Russian hospitality is legendary. When someone visits, the host offers tea from a samovar — a tall, beautiful metal urn that keeps water hot for hours. Tea comes with jam — not in the tea, but on a little spoon that you eat between sips. Strawberry jam, raspberry jam, even pine cone jam. Yes, pine cones! They are sweet, sticky, and taste like the forest smells.

Now picture a theater with red velvet seats and a glittering chandelier. The curtain rises and dancers float across the stage as if gravity has forgotten them. This is Russian ballet. The Bolshoi Theatre in Moscow and the Mariinsky Theatre in Saint Petersburg are two of the most famous ballet houses in the world. Tchaikovsky, a Russian composer, wrote the music for Swan Lake, The Nutcracker, and Sleeping Beauty — ballets that are performed all over the world every winter.

Russian children grow up with matryoshka dolls — those round, painted wooden dolls that nest inside each other, each one smaller than the last. Open the big doll, and a slightly smaller one is hiding inside. Open that one, and another. And another. The tiniest one, no bigger than your fingernail, is always solid — the heart of the whole family.

And when Russian children are small, their grandmothers — called babushkas — tell them fairy tales about Baba Yaga, a wild witch who lives in a house that walks on chicken legs. She is scary, she is funny, and she always teaches a lesson.

Sleep warmly, {childName}. Like a matryoshka doll, there are layers of kindness inside you — and the smallest, deepest one holds the most love.`,
      },
      {
        id: 'dc_ru_ep5_facts', episodeNumber: 5, title: 'Space Dogs, Chess Kings & the Coldest Town',
        subtitle: 'The record-breaking, mind-bending facts about Russia.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Russia · Episode 5',
        body: `Russia holds some of the most incredible records on the planet, and here they come — one after another.

Russia is so big that it has the most neighbors of any country — it shares borders with fourteen different nations. And its land area is larger than the entire surface of the dwarf planet Pluto. Let that sink in: a country bigger than a planet.

The coldest permanently inhabited place on Earth is the village of Oymyakon in Siberia. Winter temperatures regularly drop to minus fifty degrees Celsius. At that temperature, a cup of boiling water thrown into the air freezes before it hits the ground — turning into a cloud of instant snow. Children in Oymyakon still go to school unless it drops below minus fifty-two. Their eyelashes freeze on the walk there.

Before humans went to space, dogs went first. In 1957, a small stray dog from the streets of Moscow named Laika became the first living creature to orbit the Earth. Later, two dogs named Belka and Strelka orbited and came safely home, becoming the most famous dogs in history. Strelka's puppy was later given as a gift to the American president's family.

Russia has produced more chess grandmasters than any other country. Chess is so popular that children learn it in school, and parks across the country have giant outdoor chessboards where strangers challenge each other to games on sunny afternoons.

Lake Baikal, which we visited on our first night, holds another surprise: in winter, the frozen surface cracks and reforms in patterns so beautiful they look like stained glass windows made of ice. Photographers travel from around the world just to lie on the ice and take pictures of the turquoise bubbles frozen beneath the surface — methane gas trapped in layers of crystal-clear ice.

And Russia's national animal is the brown bear. Bears appear on coats of arms, in fairy tales, and as the mascot for the 1980 Olympics — a cartoon bear named Misha who was so beloved that people cried when his giant balloon floated away at the closing ceremony.

Goodnight, {childName}. In a world this big and surprising, you will never run out of things to wonder about — and that is the best kind of record to hold.`,
      },
    ],
  },,
// ─── SOUTH AFRICA ───────────────────────────────────────────────
  {
    id: 'discover-southafrica',
    title: 'Discover South Africa',
    icon: '🇿🇦',
    gradient: 'linear-gradient(135deg, #166534 0%, #eab308 50%, #1c1917 100%)',
    description: 'Five bedtime journeys through the Rainbow Nation — from Table Mountain to the Big Five.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_za_ep1_geo', episodeNumber: 1, title: 'The Land at the Bottom of Africa',
        subtitle: 'Where two oceans meet and mountains touch the clouds.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Africa · Episode 1',
        body: `If you could fly like a sunbird all the way to the southern tip of Africa, you would find a land so beautiful it would make your wings tremble. This is South Africa — a country shaped like a giant diamond, sitting right where the warm Indian Ocean shakes hands with the cold Atlantic Ocean.

At the very bottom, there is a rocky cape called the Cape of Good Hope. Sailors long ago thought it was the edge of the world. The waves there crash and roar like two oceans having a friendly argument about who is stronger. Neither one ever wins.

Now fly north and you will see Table Mountain — a flat-topped mountain that looks like someone took a giant knife and sliced the peak clean off. Clouds roll over its top like a white tablecloth, and the people of Cape Town call it "the tablecloth." On misty mornings the whole mountain disappears, and children wonder if it went to sleep.

Keep flying and the land turns golden. The savanna stretches out like a honey-colored blanket, dotted with acacia trees that look like giant umbrellas. This is where the Big Five live — lions, elephants, buffalo, leopards, and rhinoceroses. They roam through places like Kruger National Park, one of the largest game reserves on Earth.

In the east, the Drakensberg Mountains rise like dragon teeth — jagged and purple against the sunset. Their name actually means "Dragon Mountains." Waterfalls tumble down their cliffs, and ancient San people painted pictures on the rock walls thousands of years ago.

South Africa has deserts too. The Kalahari in the northwest is home to meerkats who stand on their hind legs like tiny guards, watching for eagles.

Tonight, {childName}, imagine standing where two oceans meet, feeling one warm wave and one cold wave touch your toes at the same time. That is South Africa — a place where different things come together and make something wonderful.`,
      },
      {
        id: 'dc_za_ep2_hist', episodeNumber: 2, title: 'Stories Older Than Stone',
        subtitle: 'From ancient cave paintings to the courage of Nelson Mandela.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Africa · Episode 2',
        body: `Long before cities or roads, long before anyone wrote words on paper, people lived in southern Africa. The San people — some of the oldest communities on Earth — made their home among the rocks and rivers. They painted pictures on cave walls using ochre, charcoal, and even egg whites. Giraffes, eland antelope, dancing figures — thousands of paintings that have survived for tens of thousands of years.

These were not just pretty pictures. They were stories. The San believed that some paintings could bring rain, heal the sick, or connect the living world with the spirit world. Each brushstroke carried meaning, like a letter in a language only the heart could read.

Centuries later, many different peoples called this land home — the Zulu, Xhosa, Sotho, and Tswana, among others. The Zulu kingdom, led by the great King Shaka in the early 1800s, became one of the most powerful nations in Africa. Shaka trained his warriors to be disciplined and brave, but he also believed that true strength meant protecting your people, not just fighting.

Then came a long, difficult time. For many years, a system called apartheid separated people by the color of their skin. Black South Africans could not go to the same schools, beaches, or hospitals as white South Africans. It was deeply unfair.

But the people resisted. A man named Nelson Mandela spent twenty-seven years in prison on a small island called Robben Island because he believed all people deserved to be equal. When he finally walked free, he did not seek revenge. He chose forgiveness. He became the first Black president of South Africa and called it the Rainbow Nation — a place where every color belongs.

Tonight, {childName}, remember that even after the longest night, morning always comes. And the people who wait with courage and kindness in their hearts are the ones who build the brightest days.`,
      },
      {
        id: 'dc_za_ep3_places', episodeNumber: 3, title: 'Mountains, Bridges, and Golden Cities',
        subtitle: 'Table Mountain, Johannesburg, and the Garden Route.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Africa · Episode 3',
        body: `Let us visit three of South Africa's most famous places tonight, one by one, like turning pages in a picture book.

First — Table Mountain. It rises above Cape Town like a giant stage. You can ride a cable car that spins slowly as it climbs, giving you a view of the city, the ocean, and even penguins waddling on the beach far below. Yes — penguins in Africa! African penguins live at Boulders Beach, and they waddle around like little gentlemen in tuxedos, completely unbothered by the tourists snapping photos.

Next — Johannesburg, the City of Gold. Long ago, a farmer stumbled upon a glittering rock on his land. That rock contained gold, and within years, thousands of people rushed to the area hoping to find fortune. Johannesburg grew from a dusty mining camp into Africa's largest and richest city. Today its skyline glitters at night like a jewelry box. But the real treasure of Johannesburg is the Apartheid Museum, where visitors walk through the story of South Africa's struggle for freedom, and children learn why equality matters.

Finally — the Garden Route. Imagine a road that hugs the coastline for three hundred kilometers, winding through forests, over bridges, past lagoons, and alongside cliffs where whales leap out of the water in winter. The Bloukrans Bridge along this route is the highest commercial bungee jump in the world — two hundred sixteen meters above the river. People scream all the way down and laugh all the way back up.

Along the Garden Route you will also find Tsitsikamma Forest, where yellowwood trees have been growing for eight hundred years. Walking among them feels like stepping into a cathedral built by nature.

Tonight, {childName}, close your eyes and ride the spinning cable car up Table Mountain. Feel the wind on your face. Look down at the penguins. And know that some of the most magical places on Earth are real — you just have to go find them.`,
      },
      {
        id: 'dc_za_ep4_culture', episodeNumber: 4, title: 'Braai, Biltong, and Ubuntu',
        subtitle: 'The food, music, and spirit of South Africa.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Africa · Episode 4',
        body: `In South Africa, there is a word that has no perfect translation in English. The word is ubuntu. It means something close to "I am because we are." It means that a person becomes a person through other people — that kindness, sharing, and community are what make us truly human.

Ubuntu lives in the way South Africans gather. And the most beloved gathering of all is the braai. A braai is a barbecue, but calling it "just a barbecue" would be like calling the ocean "just water." A braai is an event. Families and friends come together around an open fire, grilling boerewors sausages that sizzle and curl, thick steaks rubbed with spices, and mielies — corn on the cob roasted until the kernels are smoky and sweet.

While the fire crackles, someone always brings biltong — dried, seasoned meat that South Africans snack on the way other countries eat chips. It is chewy, salty, and completely addictive.

South Africa has eleven official languages — eleven! — including Zulu, Xhosa, Afrikaans, and English. The Xhosa language has special click sounds that visitors find almost impossible to make. Children who grow up speaking Xhosa can click and talk at the same time as easily as you blink.

Music fills the air everywhere. In townships, a style called kwaito blends house music with African rhythms. Choirs sing in harmonies so beautiful they can make strangers cry. The gumboot dance, created by gold miners who were not allowed to speak underground, turned rubber boots into drums — stomping, slapping, and clapping to communicate and celebrate.

And every September, South Africans celebrate Heritage Day by having a braai. The whole country cooks together. Because in a nation with so many languages and traditions, fire and food are the one language everyone speaks.

Tonight, {childName}, remember ubuntu. You are who you are because of the people who love you. And the kindness you give comes back to you like warmth from a fire.`,
      },
      {
        id: 'dc_za_ep5_facts', episodeNumber: 5, title: 'Records, Wonders, and Surprises',
        subtitle: 'The amazing facts that make South Africa one of a kind.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover South Africa · Episode 5',
        body: `Ready for some facts that will make your eyebrows jump? South Africa is full of surprises.

First — the world's first heart transplant happened in Cape Town. In 1967, a doctor named Christiaan Barnard took a healthy heart from one person and placed it inside another person's chest. The whole world held its breath. The patient lived for eighteen days — and medicine was changed forever.

South Africa is home to the oldest meteor crater visible on Earth. The Vredefort Crater is about two billion years old and three hundred kilometers wide. A rock from space hit so hard it left a scar that can be seen from space even today.

The country has the third-highest waterfall in the world — Tugela Falls in the Drakensberg Mountains. Water drops nine hundred forty-eight meters, which is nearly five times taller than the Statue of Liberty stacked on top of itself.

Here is a fun one. South Africa has a penguin colony, a desert, tropical forests, snowy mountains, and shark-filled oceans — all in one country. It is like six different planets squeezed into one beautiful place.

The Big Hole in Kimberley is the largest hole ever dug by human hands. Miners dug it with picks and shovels looking for diamonds. It is two hundred fifteen meters deep and you could fit several football fields inside it.

South Africa also has the longest wine route in the world — Route 62 stretches over eight hundred fifty kilometers through valleys dotted with vineyards and farms.

And one more — the protea, South Africa's national flower, is one of the oldest flower families on Earth. It has been blooming for over three hundred million years, long before dinosaurs even existed.

Tonight, {childName}, remember that South Africa is a land of firsts, biggests, and oldests. It reminds us that the world is full of wonders — and the best ones are the ones you have not discovered yet.`,
      },
    ],
  },

  // ─── TURKEY ─────────────────────────────────────────────────────
  {
    id: 'discover-turkey',
    title: 'Discover Turkey',
    icon: '🇹🇷',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #fefefe 100%)',
    description: 'Five bedtime journeys through the land where East meets West — bazaars, balloons, and ancient empires.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_tr_ep1_geo', episodeNumber: 1, title: 'The Bridge Between Two Worlds',
        subtitle: 'A land that sits on two continents at once.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Turkey · Episode 1',
        body: `Imagine a country so special it lives on two continents at the same time. One foot in Europe, one foot in Asia, with a shimmering blue strait of water running right through the middle. This is Turkey — the bridge between two worlds.

That strip of water is called the Bosphorus. Ships from every corner of the Earth sail through it, honking their horns as they pass beneath bridges that connect the European side of Istanbul to the Asian side. You can eat breakfast in Europe and have lunch in Asia without ever boarding a plane.

Now fly east and the land changes. The green hills near the coast give way to a vast, high plateau called Anatolia. It is dry and golden in summer, white with snow in winter. Strange rock formations rise from the ground like giant mushrooms and chimneys — this is Cappadocia, where wind and rain sculpted soft volcanic rock into shapes that look like a fairy tale.

In eastern Turkey, Mount Ararat stands alone, covered in snow year-round, rising over five thousand meters into the sky. Many people believe it is the mountain where Noah's Ark came to rest after the great flood. Whether that is true or not, seeing Ararat at sunrise — pink and gold and enormous — is enough to make anyone believe in wonders.

Turkey's coastline stretches for over eight thousand kilometers. The turquoise waters of the Mediterranean lap against white sand beaches in the south. In the north, the Black Sea coast is misty, green, and full of tea plantations — yes, Turkey is one of the biggest tea-drinking countries in the world.

And hidden underground, entire cities were carved into rock thousands of years ago. Derinkuyu, the deepest underground city, goes eight levels down and could hold twenty thousand people.

Tonight, {childName}, imagine standing on a bridge with one foot in Europe and one in Asia. Feel both continents beneath you. That is Turkey — where two worlds become one.`,
      },
      {
        id: 'dc_tr_ep2_hist', episodeNumber: 2, title: 'Empires That Shook the World',
        subtitle: 'From Troy to Constantinople to the Ottoman golden age.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Turkey · Episode 2',
        body: `The land we call Turkey has been home to some of the greatest empires the world has ever known. Close your eyes and let us travel back in time.

Three thousand years ago, on the western coast, there was a city called Troy. You may have heard the story — a great war fought over ten long years, a giant wooden horse, and a trick that ended it all. For centuries people thought Troy was just a legend. Then archaeologists dug into a hill in Turkey and found it — layer after layer of ancient cities, built on top of each other like a stack of pancakes. Troy was real.

Centuries later, a Roman emperor named Constantine chose a small town on the Bosphorus and turned it into one of the greatest cities ever built. He called it Constantinople. It had enormous walls, golden churches, and a hippodrome where chariot races drew a hundred thousand screaming fans. For over a thousand years, it was the capital of the Byzantine Empire and the richest city in the world.

Then in 1453, a young Ottoman sultan named Mehmed — only twenty-one years old — did what no one had managed in a thousand years. He conquered Constantinople. His soldiers dragged ships over a hill on wooden rollers to get around the chain blocking the harbor. It was so bold, so impossible, that even his enemies admired him. The city was renamed Istanbul.

The Ottoman Empire that followed lasted over six hundred years. At its peak it stretched from Hungary to Egypt to the gates of Vienna. The Ottomans built mosques with domes that seemed to float, created intricate tiles painted in blue and white, and ran a government that was remarkably organized for its time.

Every layer of Turkey's history is a story of transformation — cities rebuilt, empires reimagined, old ideas made new.

Tonight, {childName}, remember that even the greatest things start small. A boy of twenty-one changed the world. A wooden horse ended a war. And a tiny town on a strait became the capital of empires.`,
      },
      {
        id: 'dc_tr_ep3_places', episodeNumber: 3, title: 'Mosques, Balloons, and Underground Cities',
        subtitle: 'The Hagia Sophia, Cappadocia, and Pamukkale.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Turkey · Episode 3',
        body: `Turkey has places so magical they seem like they were borrowed from a dream. Let us visit three of them tonight.

First — the Hagia Sophia in Istanbul. For almost a thousand years it was the largest cathedral in the world. Its dome is so high that when you stand inside and look up, you feel like the sky decided to come indoors. Sunlight pours through forty windows at the base of the dome, making it glow like a golden crown. It was a church, then a mosque, then a museum, then a mosque again. Walls covered in golden mosaics and Arabic calligraphy stand side by side — two faiths sharing one masterpiece.

Next — Cappadocia. Every morning before sunrise, hundreds of hot air balloons rise into the cold Anatolian sky. They drift silently over a landscape of fairy chimneys — tall rock pillars topped with boulder caps that look like stone mushrooms. Below them, entire homes, churches, and even hotels are carved into the soft rock. People have been living inside these rocks for thousands of years. Imagine sleeping in a cave — warm in winter, cool in summer — and waking up to see balloons floating past your window like colorful jellyfish in a sky ocean.

Finally — Pamukkale, which means "Cotton Castle." And it really does look like a castle made of cotton. Hot mineral water flows down a white limestone hillside, filling natural terraces that look like frozen waterfalls. The water is warm and turquoise, and people have been bathing in these pools since Roman times. At sunset, the white terraces turn pink and gold, and the whole hillside looks like it is glowing from inside.

At the top of Pamukkale sit the ruins of Hierapolis, an ancient Roman spa city. People came from across the empire to heal in these waters two thousand years ago.

Tonight, {childName}, imagine floating in a balloon over Cappadocia as the sun rises. Below you — fairy chimneys. Above you — a sky full of color. And inside you — the wonderful feeling of a world full of places waiting to be explored.`,
      },
      {
        id: 'dc_tr_ep4_culture', episodeNumber: 4, title: 'Tea, Tulips, and the Grand Bazaar',
        subtitle: 'The flavors, traditions, and warmth of Turkish life.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Turkey · Episode 4',
        body: `In Turkey, friendship begins with tea. Not a big mug — a tiny tulip-shaped glass filled with dark red tea, served on a small saucer with two sugar cubes on the side. Turkish people drink more tea per person than almost any country on Earth. Tea is offered in shops, in homes, even at the mechanic while your car is being fixed. Saying no to tea is almost impossible. Saying yes is the beginning of a conversation.

Speaking of tulips — did you know the tulip did not come from the Netherlands? It came from Turkey. Ottoman sultans loved tulips so much that there was a period called the Tulip Era. Gardens in Istanbul blazed with every color, and tulip festivals lit up the night with lanterns floating among the flowers.

Now let us step inside the Grand Bazaar. Built in 1461, it is one of the oldest and largest covered markets in the world. Over four thousand shops line its winding corridors. Lanterns hang from arched ceilings. Spice sellers stack pyramids of bright red, orange, and yellow powders. Carpet merchants unroll silk rugs with patterns so detailed they take months to weave by hand.

Turkish food is legendary. Kebabs come in dozens of styles — juicy lamb on skewers, minced meat wrapped around flatbread, vegetables stuffed with spiced rice. For breakfast, Turkish families spread a feast across the whole table — white cheese, olives, tomatoes, cucumbers, honey, clotted cream called kaymak, and fresh bread still warm from the oven.

And then there is baklava — layers of paper-thin pastry filled with crushed pistachios and soaked in sweet syrup. Each bite crackles and melts at the same time.

Turkish people have a saying: "A cup of coffee commits one to forty years of friendship." It means that sharing something small can create something that lasts a lifetime.

Tonight, {childName}, remember that the best things are often the simplest — a glass of tea, warm bread, and someone to share them with.`,
      },
      {
        id: 'dc_tr_ep5_facts', episodeNumber: 5, title: 'Records, Legends, and Surprises',
        subtitle: 'The jaw-dropping facts that make Turkey extraordinary.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Turkey · Episode 5',
        body: `Get ready — Turkey has some facts that will make you say "wait, really?" at least three times.

Turkey is home to one of the oldest known temples on Earth. Gobekli Tepe was built around twelve thousand years ago — that is seven thousand years before the Egyptian pyramids. Giant stone pillars carved with animals stand in circles on a hilltop, and archaeologists still cannot fully explain who built them or why. It changed everything we thought we knew about ancient people.

The country sits on two tectonic plates, which means earthquakes happen. But it also means Turkey has natural hot springs everywhere. The ancient Romans built entire cities around these warm waters, and you can still soak in them today.

Turkey has more than eighty thousand mosques — more than any other country. The call to prayer echoes across cities five times a day, a sound so familiar it is woven into the rhythm of daily life.

Here is a delicious fact — Turkey produces about seventy percent of the world's hazelnuts. That means most of the chocolate hazelnut spread you eat probably started as a nut growing on a Turkish hillside.

Turkish ice cream, called dondurma, is so thick and stretchy that sellers play tricks on customers — pulling the cone away, flipping it upside down, handing you an empty cone first — all while laughing. It is made with a special root that makes it chewy and nearly impossible to melt.

Santa Claus has Turkish roots too. Saint Nicholas, the real person behind the legend, was born in a town called Patara on Turkey's southern coast. He was known for secretly giving gifts to children and families in need.

And one more — Turkey's Mediterranean coast is a nesting ground for endangered loggerhead sea turtles. Every summer, mother turtles crawl onto the beach at night to lay their eggs in the sand.

Tonight, {childName}, remember Turkey — where the oldest temple on Earth and the stretchiest ice cream on Earth exist in the same wonderful country. The world is full of surprises if you keep your eyes open.`,
      },
    ],
  },

  // ─── UAE ────────────────────────────────────────────────────────
  {
    id: 'discover-uae',
    title: 'Discover UAE',
    icon: '🇦🇪',
    gradient: 'linear-gradient(135deg, #166534 0%, #fefefe 50%, #1c1917 100%)',
    description: 'Five bedtime journeys through the land of sand dunes and skyscrapers — where the desert touches the future.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_ae_ep1_geo', episodeNumber: 1, title: 'Dunes, Oases, and the Sparkling Gulf',
        subtitle: 'A desert land that stretches from mountains to sea.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover UAE · Episode 1',
        body: `Close your eyes and imagine a land made of sand. Golden sand dunes rolling like frozen waves under a blazing sun. This is the United Arab Emirates — the UAE — a small country on the eastern edge of the Arabian Peninsula, tucked between the Persian Gulf and the Gulf of Oman.

The desert here is called the Rub' al Khali — the Empty Quarter — and it is the largest sand desert in the world. Some dunes rise over two hundred fifty meters, taller than many skyscrapers. The sand shifts and reshapes every day, so the desert is never quite the same twice. It is like a painting that keeps painting itself.

But the UAE is not all sand. In the east, the Hajar Mountains rise sharply from the flat plains. These rocky peaks are millions of years old, and hidden between them are wadis — dry riverbeds that fill with emerald-green water after rainstorms. Children splash in wadi pools that appear like magic after a storm and disappear days later.

Along the coast, the Persian Gulf sparkles turquoise and warm. The water is shallow enough in places that you can wade far from shore and still see your toes. Mangrove forests grow along parts of the coast, their tangled roots creating underwater nurseries for baby fish, crabs, and turtles.

In the desert, oases dot the landscape — patches of green surrounded by gold. The Al Ain Oasis has over one hundred forty-seven thousand date palm trees, all fed by an ancient underground irrigation system called a falaj that has been working for over three thousand years.

And at the edges where desert meets sea, you will find salt flats called sabkhas — flat, white, and sparkling, like a beach that forgot to add the ocean.

Tonight, {childName}, imagine walking through a desert where the sand whispers under your feet. In the UAE, even the emptiest places are full of life — you just have to know where to look.`,
      },
      {
        id: 'dc_ae_ep2_hist', episodeNumber: 2, title: 'Pearl Divers, Traders, and a Bold Dream',
        subtitle: 'From Bedouin camps to a nation born in one generation.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover UAE · Episode 2',
        body: `Before the skyscrapers, before the airports, before the highways — there was the sea. And the pearl.

For thousands of years, the people of the Gulf coast made their living diving for pearls. Young men would take a deep breath, clip a wooden peg on their nose, tie a stone to their foot, and sink to the bottom of the warm Persian Gulf. Down in the murky water, they searched for oysters, prying them open one by one, hoping to find a gleaming pearl inside. Most oysters had nothing. But every now and then — a pearl so perfect it could buy a whole house.

Pearl diving was dangerous. Divers stayed underwater for minutes at a time. Jellyfish stung. Sharks circled. But families depended on the pearl harvest, and every diver knew the sea was both provider and challenge.

On land, Bedouin tribes crossed the desert with their camels, trading goods between coastal villages and mountain settlements. They navigated by the stars and survived on dates, camel milk, and an unbreakable code of hospitality — any stranger who arrived at your tent was given food, water, and shelter, no questions asked.

Then everything changed. In 1958, oil was discovered. Black gold beneath the sand. Within a single generation, fishing villages became cities. But the true miracle was what happened in 1971, when seven small emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah — decided to unite as one country. Sheikh Zayed bin Sultan Al Nahyan, the leader of Abu Dhabi, was the architect of this union. He believed that together they would be strong, and apart they would remain small.

He was right. In just fifty years, the UAE went from pearl-diving villages to one of the most modern nations on Earth.

Tonight, {childName}, remember the pearl divers. They dove into the dark unknown, hoping for something precious. And sometimes, the most valuable thing you find is not a pearl — it is the courage to keep diving.`,
      },
      {
        id: 'dc_ae_ep3_places', episodeNumber: 3, title: 'Towers, Mosques, and Desert Palaces',
        subtitle: 'The Burj Khalifa, Sheikh Zayed Mosque, and the Louvre Abu Dhabi.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover UAE · Episode 3',
        body: `Let us visit three places in the UAE that will take your breath away — each one more astonishing than the last.

First — the Burj Khalifa in Dubai. It is the tallest building in the world. Eight hundred twenty-eight meters high — that is over one hundred sixty floors. Standing at its base and looking up, you cannot even see the top on a cloudy day. The tip disappears into the sky like a silver needle stitching the earth to the heavens. At sunset, the tower glows orange and pink, and from the observation deck on the one hundred forty-eighth floor, you can see the curve of the Earth.

Building it took six years and twelve thousand workers from all over the world. The foundation alone goes fifty meters deep. On the hottest days, the top of the Burj Khalifa is six degrees cooler than the bottom — it literally has its own weather.

Next — the Sheikh Zayed Grand Mosque in Abu Dhabi. It is one of the most beautiful buildings ever created. Eighty-two white marble domes sit atop a structure that can hold forty thousand worshippers. One thousand columns line the courtyards. The floor is covered by the world's largest hand-knotted carpet — it took twelve hundred artisans two years to make. At night, the mosque is lit to reflect the phases of the moon — bluish-grey on new moon nights, brilliant white on full moons.

Finally — the Louvre Abu Dhabi. A museum built on an island, covered by a massive dome made of eight thousand metal stars layered in a pattern. When the sun shines through, it creates a "rain of light" — thousands of tiny sunbeams dancing on the floor and walls like stars fallen indoors. Inside, art from every civilization sits side by side — Egyptian, Chinese, European, Islamic — showing how all human cultures are connected.

Tonight, {childName}, imagine standing in the rain of light inside the Louvre Abu Dhabi. Each tiny sunbeam is a story. And together, they remind us that all our stories are part of one big, beautiful story.`,
      },
      {
        id: 'dc_ae_ep4_culture', episodeNumber: 4, title: 'Dates, Dances, and Desert Hospitality',
        subtitle: 'The food, traditions, and generous spirit of the Emirates.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover UAE · Episode 4',
        body: `In the UAE, when a guest arrives, the first thing offered is Arabic coffee and dates. The coffee is light, golden, flavored with cardamom and saffron, and poured from a long-spouted pot called a dallah. The dates are plump, sticky, and sweet — like nature's candy. This tradition of welcoming visitors is thousands of years old, and it is the heart of Emirati culture.

Hospitality is not just polite here — it is sacred. Bedouin tradition says you must offer food and shelter to anyone who comes to your door, even a stranger, for three days. No questions asked. Generosity is considered one of the greatest virtues.

Emirati food tells the story of the land. Machboos is spiced rice cooked with meat or fish, seasoned with dried limes called loomi that add a tangy, smoky flavor. Luqaimat are little dumplings, deep-fried until golden and drizzled with date syrup — crunchy on the outside, soft and warm on the inside. Harees is a comforting porridge of wheat and slow-cooked meat, often served during Ramadan.

During Ramadan, the holy month, families fast from sunrise to sunset. When the evening call to prayer sounds, everyone gathers for iftar — breaking the fast together. Streets fill with the smell of food, and strangers share meals. It is a time of patience, gratitude, and community.

Emirati culture also celebrates the desert. Falconry — hunting with trained falcons — has been practiced for thousands of years and is a proud tradition. Falcons are treated like family. Some falcons even have their own passports for traveling to competitions.

The Al-Ayyala is a traditional dance where rows of men move in rhythm, holding thin canes and swaying together while drums beat. It looks like the desert itself is dancing.

Tonight, {childName}, remember the golden coffee and the plump date. In the UAE, sharing what you have — even if it is small — is the greatest thing a person can do. Generosity is not about being rich. It is about being kind.`,
      },
      {
        id: 'dc_ae_ep5_facts', episodeNumber: 5, title: 'Records, Firsts, and Desert Wonders',
        subtitle: 'The jaw-dropping facts that make the UAE extraordinary.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover UAE · Episode 5',
        body: `The UAE loves to break records. Get ready — this tiny country has some enormous surprises.

The Burj Khalifa is the tallest building in the world, but the UAE does not stop there. Dubai also has the largest shopping mall by total area — the Dubai Mall. It has over twelve hundred shops, an aquarium with thirty-three thousand sea creatures, an ice-skating rink, and a waterfall three stories tall. You could visit a different shop every day and not finish for more than three years.

The UAE built palm-shaped islands in the sea. The Palm Jumeirah was made by pouring millions of tons of sand into the Persian Gulf to create a tree-shaped island visible from space. It has hotels, homes, and beaches — all on land that did not exist thirty years ago.

Here is a wild fact — the UAE has more camels than people in some emirates. Camel racing is a major sport, and the jockeys are tiny robots strapped onto the camels' backs, controlled by remote control from pickup trucks driving alongside. It is one of the most unusual sports you will ever see.

The country went from having no space program to sending an astronaut to the International Space Station and launching a probe to Mars — the Hope Probe — which arrived in 2021, making the UAE the first Arab nation to reach Mars.

Abu Dhabi has the world's fastest roller coaster — Formula Rossa at Ferrari World. It goes from zero to two hundred forty kilometers per hour in under five seconds. Riders have to wear goggles because the wind is too strong for bare eyes.

And despite being mostly desert, the UAE has one of the best wifi networks on the planet. Even remote desert camps often have internet.

Tonight, {childName}, remember the UAE — a country that looked at the desert and saw possibility. It reminds us that it does not matter where you start. What matters is how big you dare to dream.`,
      },
    ],
  },

  // ─── SPAIN ──────────────────────────────────────────────────────
  {
    id: 'discover-spain',
    title: 'Discover Spain',
    icon: '🇪🇸',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #eab308 100%)',
    description: 'Five bedtime journeys through the land of flamenco, fiestas, and golden sun.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_es_ep1_geo', episodeNumber: 1, title: 'The Sun-Kissed Peninsula',
        subtitle: 'Mountains, mesetas, and the bluest Mediterranean waters.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Spain · Episode 1',
        body: `Spain sits on a great peninsula in southwestern Europe, like a slightly tilted square reaching toward Africa. Only fourteen kilometers of water — the Strait of Gibraltar — separate Spain from Morocco. On clear days, you can stand on the southern coast and see another continent.

The heart of Spain is the meseta — a vast, high plateau that stretches across the center of the country. It is dry and golden in summer, cold and windswept in winter. Windmills still stand on some hilltops, and centuries ago a famous character in a book mistook them for giants and charged at them with a lance. That character was Don Quixote, and those windmills are still there.

In the north, the Pyrenees Mountains form a massive wall between Spain and France. Snow-capped peaks, green valleys, and mountain villages where shepherds still tend their flocks. The Pyrenees are home to brown bears, golden eagles, and a type of wild goat called the ibex that climbs nearly vertical cliff faces as easily as you walk on flat ground.

Spain's coastline is one of the most beautiful in Europe. The Costa Brava in the northeast has rocky coves and crystal-clear water. The Costa del Sol in the south has over three hundred days of sunshine per year. And the Canary Islands, off the coast of Africa, have volcanic beaches made of black sand.

In the northwest, Galicia is green and misty, more like Ireland than the Spain you see in postcards. Rain falls often, rivers carve through granite hills, and the seafood — octopus, mussels, and percebes barnacles — is some of the best on Earth.

And then there is Mallorca — an island in the Mediterranean with turquoise coves so beautiful that pirates once used them as hiding spots.

Tonight, {childName}, imagine standing on a Spanish hilltop as the sun sets golden over the meseta. The windmills turn slowly. The air smells of wild thyme. And the whole world feels warm and still and good.`,
      },
      {
        id: 'dc_es_ep2_hist', episodeNumber: 2, title: 'Empires, Explorers, and the Golden Age',
        subtitle: 'From Roman roads to the ships that crossed the ocean.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Spain · Episode 2',
        body: `Spain's story is one of layers — like a cake baked over thousands of years, each layer adding something new and delicious.

The Romans came first and stayed for six hundred years. They built roads, aqueducts, and theatres. The aqueduct of Segovia still stands today — a towering bridge of stone blocks stacked without any cement or mortar, holding strong for two thousand years. Engineers still marvel at how it was done.

Then came the Moors — Muslim rulers from North Africa who crossed the Strait of Gibraltar in the year 711. For nearly eight hundred years, they ruled parts of Spain and brought incredible knowledge with them. They introduced new crops like oranges, rice, and almonds. They built the Alhambra in Granada — a palace so beautiful that its walls are covered in poetry carved into plaster. Water flows through its courtyards in narrow channels, and the sound of fountains fills every room. During this time, Muslim, Jewish, and Christian scholars worked side by side in cities like Cordoba, translating ancient Greek texts and inventing new mathematics.

In 1492, three things happened that changed the world. The Catholic monarchs Ferdinand and Isabella completed the Reconquista, reclaiming all of Spain. That same year, Christopher Columbus sailed west with three small ships — the Nina, the Pinta, and the Santa Maria — looking for Asia and stumbling upon the Americas instead.

Spain's Golden Age followed. Spanish ships sailed every ocean. Gold and silver flowed in. Painters like Velazquez created masterpieces. Writers like Cervantes wrote Don Quixote, considered the first modern novel.

But empires rise and fall. Spain learned, like all great nations, that true wealth is not gold — it is the ideas, art, and culture you leave behind.

Tonight, {childName}, remember the aqueduct of Segovia — stones balanced perfectly for two thousand years with no glue. Some things last not because they are forced together, but because they are placed together with patience and care.`,
      },
      {
        id: 'dc_es_ep3_places', episodeNumber: 3, title: 'Cathedrals, Castles, and a Church Still Growing',
        subtitle: 'The Alhambra, Sagrada Familia, and the Santiago trail.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Spain · Episode 3',
        body: `Spain has buildings that make your jaw drop open and forget to close. Let us visit three tonight.

First — the Alhambra in Granada. Perched on a hilltop with the snow-capped Sierra Nevada mountains behind it, this palace was built by Moorish rulers over centuries. Every surface is covered in intricate patterns — geometric shapes that repeat and interlock like an endless puzzle. No pictures of people or animals, just pure geometry, because the artists believed the beauty of patterns could reflect the infinite. The Court of the Lions has a fountain held up by twelve marble lions, with water flowing in channels that divide the courtyard into four perfect gardens. Standing there at sunset, with golden light pouring through carved archways, feels like being inside a jewel box.

Next — the Sagrada Familia in Barcelona. This church was designed by Antoni Gaudi, an architect who looked at nature and said, "That is how buildings should look." He started building it in 1882, and it is still not finished — over one hundred forty years later. Its towers look like melting candles or dripping sand castles. Inside, columns branch like trees, and stained glass windows throw rainbows across the walls. Gaudi knew he would not live to see it completed. He said, "My client is not in a hurry" — meaning God.

Finally — the Camino de Santiago. This is not a building but a path. For over a thousand years, people have walked across Spain to reach the cathedral of Santiago de Compostela in the northwest. The journey takes about a month on foot. Walkers carry a scallop shell as their symbol. Strangers become friends along the way. The point is not just the destination — it is what you discover about yourself during the walk.

Tonight, {childName}, think about the Sagrada Familia. Some beautiful things take longer than a lifetime to finish. The important thing is to start, and to trust that others will continue what you began.`,
      },
      {
        id: 'dc_es_ep4_culture', episodeNumber: 4, title: 'Flamenco, Paella, and the Joy of Living',
        subtitle: 'The music, food, and fiery spirit of Spanish life.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Spain · Episode 4',
        body: `In Spain, life is not meant to be rushed. It is meant to be tasted, danced, and shared.

Let us start with flamenco — a dance that comes from deep inside the soul. A guitarist plays fast, intricate patterns. A singer wails with a voice full of longing and joy mixed together. And the dancer — stomping, clapping, spinning — tells a story without words. Flamenco was born in Andalusia, in the south of Spain, created by a mix of cultures over centuries. When you watch flamenco up close, you can feel the floor vibrating under the dancer's feet. It is not just a performance. It is an earthquake of emotion.

Now let us eat. Spanish food is all about sharing. Tapas are small plates — a little dish of olives, a few slices of jamon serrano (cured ham that hangs from ceilings in bars), patatas bravas (crispy potatoes with spicy sauce), and tortilla espanola (a thick potato omelette that every grandmother makes differently and every grandmother insists hers is the best).

Paella is Spain's most famous dish. It started in Valencia, cooked over an open fire in a wide, flat pan. Saffron turns the rice golden yellow. Depending on the region, it is filled with chicken, rabbit, seafood, or vegetables. Families argue lovingly about the "right" way to make it. There is no right way. Every paella is right.

Spanish life follows its own clock. Lunch is at two or three in the afternoon. Dinner is at ten at night. In between, some people still take a siesta — a short afternoon nap that recharges the whole body. Children play outside until late in the evening, because the sun does not set until almost ten in the summer.

Fiestas happen constantly. La Tomatina is a festival where an entire town throws tomatoes at each other. Las Fallas in Valencia builds enormous sculptures and then burns them all in one spectacular night.

Tonight, {childName}, remember that life is a feast. Eat slowly. Dance freely. And stay up late enough to watch the sunset paint the sky red and gold — the colors of Spain.`,
      },
      {
        id: 'dc_es_ep5_facts', episodeNumber: 5, title: 'Records, Wonders, and Surprises',
        subtitle: 'The astonishing facts that make Spain unforgettable.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover Spain · Episode 5',
        body: `Spain is full of facts that will make you lean forward and say "tell me more." Here we go.

Spain has the second-highest number of UNESCO World Heritage Sites in the world — over fifty. That means more protected treasures than almost any country on Earth. Ancient Roman walls, medieval cathedrals, cave paintings, and entire historic cities.

Speaking of cave paintings — the Cave of Altamira in northern Spain has paintings that are over thirty-six thousand years old. Ancient artists used the bumps and curves of the cave ceiling to make bison look three-dimensional. When the cave was first discovered, experts refused to believe the paintings were real because they were too beautiful.

Spain has a restaurant called El Bulli that was voted the best restaurant in the world five times. The chef, Ferran Adria, made food that looked like science experiments — olive oil spheres that burst in your mouth, disappearing ravioli, and ice cream that tasted like parmesan cheese.

Here is a fun one — there is a town in Spain called Setenil de las Bodegas where houses are built into and under massive rock overhangs. The rock IS the roof. People live under boulders the size of buildings, perfectly comfortable.

The oldest restaurant in the world is in Madrid. Sobrino de Botin has been serving food continuously since 1725. The famous painter Francisco Goya once worked there as a waiter before he became an artist.

Spain's high-speed trains are among the fastest in Europe, connecting Madrid to Barcelona in just two and a half hours at speeds of over three hundred kilometers per hour.

And one more — La Liga, Spain's football league, is home to some of the greatest football clubs and players the world has ever seen. The roar of a hundred thousand fans in a Spanish stadium is a sound you never forget.

Tonight, {childName}, remember Spain — a country where ancient cave paintings and high-speed trains exist side by side. It teaches us that you can honor the past and race toward the future at the same time.`,
      },
    ],
  },

  // ─── NEW ZEALAND ────────────────────────────────────────────────
  {
    id: 'discover-newzealand',
    title: 'Discover New Zealand',
    icon: '🇳🇿',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #166534 50%, #1c1917 100%)',
    description: 'Five bedtime journeys through the land of the long white cloud — mountains, geysers, and Maori legends.',
    ageRange: '4-8',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dc_nz_ep1_geo', episodeNumber: 1, title: 'The Land of the Long White Cloud',
        subtitle: 'Volcanoes, fjords, and a country that glows green.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover New Zealand · Episode 1',
        body: `Far, far away, in the bottom corner of the Pacific Ocean, there is a country so green and so wild that it looks like the Earth is showing off. This is New Zealand — or as the Maori people call it, Aotearoa, the Land of the Long White Cloud.

New Zealand is made of two main islands — the North Island and the South Island — plus hundreds of tiny ones scattered around like crumbs from a giant's sandwich. It is one of the last large landmasses that humans ever settled, so nature had millions of years to create things here that exist nowhere else on Earth.

The North Island is where the ground is alive. Volcanoes rumble beneath the surface. In Rotorua, the earth hisses and bubbles — boiling mud pools plop and splatter like porridge cooking in a giant pot. Geysers shoot scalding water twenty meters into the air. The whole town smells like rotten eggs because of the sulphur, but locals barely notice anymore. They are used to living on a planet that breathes.

The South Island is where the mountains take over. The Southern Alps run down the island like a spine, and the tallest peak — Aoraki Mount Cook — rises three thousand seven hundred twenty-four meters into clouds that cling to its shoulders like a white scarf. Glaciers creep down valleys, blue and ancient, grinding rock into powder.

And then — the fjords. Milford Sound is a narrow channel of water surrounded by cliffs so steep that waterfalls tumble straight down into the sea. When it rains, hundreds of temporary waterfalls appear, turning the cliffs into curtains of falling silver.

New Zealand sits on the Pacific Ring of Fire, which means earthquakes and volcanic eruptions are part of life. The country literally grows and shifts and shakes.

Tonight, {childName}, imagine standing at the edge of Milford Sound as mist rises from the water and waterfalls whisper all around you. That is New Zealand — a place where the earth itself feels alive and full of wonder.`,
      },
      {
        id: 'dc_nz_ep2_hist', episodeNumber: 2, title: 'Voyagers, Warriors, and a Treaty',
        subtitle: 'The Maori navigators who found paradise at the bottom of the world.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover New Zealand · Episode 2',
        body: `About seven hundred years ago, the greatest ocean voyagers the world has ever known set out across the vast Pacific in wooden canoes. They had no maps, no compasses, no GPS. They navigated by the stars, the ocean swells, the flight paths of birds, and the patterns of clouds on the horizon. These were the Polynesian ancestors of the Maori people, and they were looking for a new home.

Imagine the courage it took. Loading your family, your food, your seeds, and your hopes into a double-hulled canoe and sailing into the unknown. The Pacific Ocean is enormous — the largest body of water on Earth. They could have sailed for weeks and found nothing. But they trusted their knowledge of the sea, and one day, they saw a long white cloud on the horizon. Beneath it — land. Aotearoa.

The Maori settled these islands and built a rich culture. They carved elaborate meeting houses called wharenui, decorated with spiraling patterns that told the stories of their ancestors. They performed the haka — a powerful ceremonial dance with stomping feet, slapping chests, wide eyes, and extended tongues. The haka was not just a war dance. It was a way to express identity, pride, grief, and welcome.

In 1840, the British Crown and Maori chiefs signed the Treaty of Waitangi. It was meant to be a partnership, but the English and Maori versions said different things, and misunderstandings led to years of conflict and injustice. Today, New Zealand continues to work toward honoring the treaty's promises, and the Maori language and culture are experiencing a powerful revival.

Te reo Maori — the Maori language — is taught in schools. Maori place names are used alongside English. And the haka is performed by New Zealand's national rugby team, the All Blacks, before every match, sending chills down the spines of opponents and spectators alike.

Tonight, {childName}, remember the voyagers who sailed into the unknown with nothing but courage and starlight. They remind us that the bravest journeys begin before you can see where they end.`,
      },
      {
        id: 'dc_nz_ep3_places', episodeNumber: 3, title: 'Glowworms, Geysers, and Middle-earth',
        subtitle: 'Milford Sound, the Waitomo Caves, and the Hobbiton movie set.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover New Zealand · Episode 3',
        body: `New Zealand has places so magical that a famous filmmaker chose it to create a fantasy world. But the truth is — New Zealand was already a fantasy world. Let us visit three places that prove it.

First — the Waitomo Glowworm Caves. Deep underground, in pitch darkness, you climb into a small boat. A guide pulls you along a rope through a silent, narrow cave. Then you look up. The ceiling is alive with thousands of tiny blue-green lights. They look like stars — a galaxy underground. These are glowworms — larvae that produce light to attract insects into their sticky silk threads. They glow brightest in total silence. No one speaks. The only sound is the gentle drip of water. It feels like floating through outer space.

Next — Wai-O-Tapu, the geothermal wonderland near Rotorua. The ground here is every color you can imagine. The Champagne Pool is a hot spring the color of orange juice, rimmed with bright yellow sulphur. The Devil's Bath is an acid-green pool that looks like someone poured neon paint into the earth. Steam rises everywhere. The ground is warm beneath your feet. At ten-fifteen every morning, the Lady Knox Geyser erupts — a column of water shooting up to twenty meters high, as punctual as an alarm clock.

Finally — Hobbiton. When director Peter Jackson needed a home for hobbits, he searched the entire world and found the perfect green hills near Matamata. Forty-four hobbit holes were built into the hillside, with round doors painted in bright colors, tiny gardens, and a working pub called the Green Dragon. Even if you have never seen the movies, walking through Hobbiton feels like stepping into a storybook where everything is cozy and safe and sized just right.

New Zealand is one of the few places where reality is more magical than fiction.

Tonight, {childName}, imagine floating through the glowworm cave, looking up at a ceiling of living stars. The most wonderful things are sometimes hiding in the darkest places, waiting for you to be quiet enough to see them.`,
      },
      {
        id: 'dc_nz_ep4_culture', episodeNumber: 4, title: 'Haka, Hangi, and the Kiwi Spirit',
        subtitle: 'The food, traditions, and big heart of little New Zealand.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover New Zealand · Episode 4',
        body: `New Zealanders call themselves Kiwis — named after the kiwi bird, a small, round, flightless bird with a long beak and whiskers. The kiwi is shy, comes out only at night, and is surprisingly fierce for its size. New Zealanders think that describes them perfectly — humble, tough, and quietly remarkable.

The haka is the cultural tradition New Zealand is most famous for. When the All Blacks rugby team performs the haka before a match, eighty thousand people go silent. The players stamp their feet, slap their arms, bulge their eyes, and chant words that shake the stadium. "Ka mate, ka mate — ka ora, ka ora" — it is about facing death and choosing life. The haka is not about scaring opponents. It is about honoring ancestors, showing unity, and declaring that you are present, alive, and ready.

Food in New Zealand is shaped by the land and sea. The traditional Maori feast is called a hangi. A pit is dug in the ground, stones are heated in a fire, and food — chicken, lamb, kumara sweet potatoes, pumpkin, and stuffing — is wrapped in leaves and lowered onto the hot stones. The pit is covered with earth, and the food slow-cooks for hours, absorbing a smoky, earthy flavor that no oven can replicate. Uncovering the hangi is a celebration. Steam rises. Everyone gathers. The food is tender and deeply flavorful.

New Zealand's pavlova is a dessert made of meringue — crispy on the outside, marshmallowy in the middle — topped with whipped cream and fresh kiwifruit. New Zealanders and Australians have argued for decades over who invented it. Both claim it. Neither will surrender.

The Kiwi spirit is about being resourceful. Number eight wire mentality — the idea that you can fix or build anything with a piece of wire and determination — is a national pride. It comes from early settlers who had no shops nearby and had to solve every problem themselves.

Tonight, {childName}, remember the kiwi bird — small, humble, and braver than it looks. You do not have to be the biggest or the loudest. Sometimes the quietest ones are the strongest.`,
      },
      {
        id: 'dc_nz_ep5_facts', episodeNumber: 5, title: 'Records, Wonders, and Surprises',
        subtitle: 'The incredible facts that make New Zealand one of a kind.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Discover New Zealand · Episode 5',
        body: `New Zealand is small — only about five million people — but it is packed with facts that make big countries jealous.

New Zealand was the first country in the world to give women the right to vote, back in 1893. A woman named Kate Sheppard led the campaign, and her face is now on the ten-dollar note. She changed history by refusing to accept that things could not change.

There are more sheep than people in New Zealand. About six sheep for every human. That means if the sheep ever held an election, they would win every time.

The country has no native land mammals except for two species of bat. Before humans arrived, birds ruled. The now-extinct moa was the tallest bird that ever lived — over three and a half meters tall. The kiwi, unable to fly, evolved to behave like a mammal, sniffing the ground with nostrils at the tip of its beak — the only bird in the world with nostrils there.

New Zealand was the first place on Earth to see each new day. The East Cape gets the first sunrise. Every New Year, Kiwis celebrate before almost everyone else on the planet.

Bungee jumping as a commercial sport was invented in New Zealand. A man named AJ Hackett jumped off the Eiffel Tower with an elastic cord (illegally) and then came home and opened the world's first commercial bungee operation in Queenstown.

The Whanganui River was granted the same legal rights as a person in 2017 — the first river in the world to receive this status. If someone pollutes it, it is treated as harming a living being.

And finally — New Zealand's Fiordland crested penguin is one of the rarest penguins in the world, with only about three thousand breeding pairs. They live in the rainy, wild forests of the South Island, far from any city.

Tonight, {childName}, remember New Zealand — a small country at the bottom of the world that keeps being first. It reminds us that size does not determine what you can achieve. Courage does.`,
      },
    ],
  },,
];

