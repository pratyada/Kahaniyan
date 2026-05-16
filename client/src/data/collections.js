// Story collections — themed groups beyond value/tradition.
// Each collection has a title, icon, description, and stories array.
// Stories can be IDs referencing culturalLessons OR custom inline stories.

export const COLLECTIONS = [
  {
    id: 'pets-animals',
    title: '🐾 Pets & Animals',
    subtitle: 'Stories about furry friends and wild adventures',
    icon: '🐾',
    stories: [
      { id: 'col_loyal_dog', title: 'The Dog Who Waited Every Day', durationMinutes: 5, tradition: 'universal', theme: 'compassion-animals', body: 'A golden retriever named Buddy waited at the school gate every afternoon...', source: 'Original' },
      { id: 'col_lost_kitten', title: 'The Kitten Who Found a Home', durationMinutes: 5, tradition: 'universal', theme: 'compassion-animals', body: 'Under the big rain, a tiny orange kitten shivered behind the grocery store...', source: 'Original' },
      { id: 'col_brave_rabbit', title: 'The Brave Little Rabbit', durationMinutes: 6, tradition: 'universal', theme: 'courage', body: 'In the meadow beyond the old oak tree, a small white rabbit named Cotton lived...', source: 'Original' },
      { id: 'col_parrot_truth', title: 'The Parrot Who Told the Truth', durationMinutes: 5, tradition: 'universal', theme: 'honesty', body: 'In a busy market in Mumbai, there was a green parrot named Mitthu...', source: 'Original' },
      { id: 'col_elephant_memory', title: 'The Elephant Who Never Forgot a Friend', durationMinutes: 7, tradition: 'universal', theme: 'compassion-animals', body: 'Deep in the Nilgiri hills, a young elephant named Gajju had a best friend...', source: 'Original' },
    ],
  },
  {
    id: 'vehicles',
    title: '🚗 Cars, Bikes & Vehicles',
    subtitle: 'Zoom! Adventures on wheels',
    icon: '🚗',
    stories: [
      { id: 'col_fire_truck', title: 'The Fire Truck That Was Afraid of Fire', durationMinutes: 5, tradition: 'universal', theme: 'courage', body: 'Engine 7 was the shiniest fire truck in Station 3. But Engine 7 had a secret...', source: 'Original' },
      { id: 'col_bicycle_race', title: 'The Bicycle That Won Without Racing', durationMinutes: 5, tradition: 'universal', theme: 'wisdom', body: 'Every Saturday, the bikes of Maple Street raced down the big hill...', source: 'Original' },
      { id: 'col_train_patience', title: 'The Little Train That Learned to Wait', durationMinutes: 6, tradition: 'universal', theme: 'humility', body: 'Express Train 409 was the fastest train on the mountain route...', source: 'Original' },
      { id: 'col_ambulance', title: 'The Ambulance Who Helped Everyone', durationMinutes: 5, tradition: 'universal', theme: 'sharing', body: 'Amy the Ambulance never said no. Rain or shine, day or night...', source: 'Original' },
    ],
  },
  {
    id: 'superheroes',
    title: '🦸 Superhero Series',
    subtitle: 'Every child has a superpower',
    icon: '🦸',
    stories: [
      { id: 'col_invisible_hero', title: 'The Invisible Hero', durationMinutes: 6, tradition: 'universal', theme: 'humility', body: 'Maya discovered she could turn invisible. But instead of playing tricks...', source: 'Original' },
      { id: 'col_kindness_cape', title: 'The Cape Made of Kindness', durationMinutes: 5, tradition: 'universal', theme: 'compassion-animals', body: 'Every time Arjun did something kind, a golden thread appeared...', source: 'Original' },
      { id: 'col_truth_shield', title: 'The Shield of Truth', durationMinutes: 6, tradition: 'universal', theme: 'honesty', body: 'Captain Honest had one rule: never lie. His shield glowed brighter with every truth...', source: 'Original' },
      { id: 'col_patience_power', title: 'The Slowest Superhero', durationMinutes: 5, tradition: 'universal', theme: 'wisdom', body: 'Everyone laughed at Dheer because his power was patience. Not speed, not strength...', source: 'Original' },
    ],
  },
  {
    id: 'who-would-win',
    title: '⚔️ Who Would Win?',
    subtitle: 'Fun debates that teach critical thinking',
    icon: '⚔️',
    stories: [
      { id: 'col_lion_vs_eagle', title: 'Lion vs Eagle — Who Rules?', durationMinutes: 6, tradition: 'universal', theme: 'wisdom', body: 'The Lion said, "I am the king of the jungle." The Eagle said, "I am the king of the sky..."', source: 'Original' },
      { id: 'col_ant_vs_elephant', title: 'Ant vs Elephant — Who Is Stronger?', durationMinutes: 5, tradition: 'universal', theme: 'humility', body: 'The elephant boasted he was the strongest. But the tiny ant smiled...', source: 'Original' },
      { id: 'col_tortoise_vs_hare', title: 'Tortoise vs Hare — The Rematch', durationMinutes: 6, tradition: 'universal', theme: 'wisdom', body: 'Everyone knows the tortoise won the first race. But this time the hare had a plan...', source: 'Original' },
      { id: 'col_sun_vs_wind', title: 'Sun vs Wind — Who Is More Powerful?', durationMinutes: 5, tradition: 'universal', theme: 'wisdom', body: 'The Wind bragged, "I can blow down houses!" The Sun simply smiled warmly...', source: 'Original' },
    ],
  },
  {
    id: 'sports',
    title: '⚽ Sports Collection',
    subtitle: 'Teamwork, discipline, and fair play',
    icon: '⚽',
    stories: [
      { id: 'col_cricket_team', title: 'The Cricket Team That Had No Ground', durationMinutes: 6, tradition: 'universal', theme: 'courage', body: 'In a small village near Chandigarh, eleven kids wanted to play cricket...', source: 'Original' },
      { id: 'col_swimmer', title: 'The Girl Who Swam Against the Current', durationMinutes: 6, tradition: 'universal', theme: 'courage', body: 'Everyone told Priya she was too small to be a swimmer. The pool was too deep...', source: 'Original' },
      { id: 'col_soccer_share', title: 'The Goal That Belonged to Everyone', durationMinutes: 5, tradition: 'universal', theme: 'sharing', body: 'Ravi could have scored the winning goal himself. But he saw Kiran open on the left...', source: 'Original' },
      { id: 'col_fair_play', title: 'The Race Nobody Lost', durationMinutes: 5, tradition: 'universal', theme: 'honesty', body: 'At the school sports day, something amazing happened in the 100-meter dash...', source: 'Original' },
    ],
  },
  {
    id: 'family',
    title: '👨‍👩‍👧 Family Stories',
    subtitle: 'Love, bonds, and growing together',
    icon: '👨‍👩‍👧',
    stories: [
      { id: 'col_grandpa_wisdom', title: "Grandpa's Secret Garden", durationMinutes: 7, tradition: 'universal', theme: 'wisdom', body: 'Every evening, Grandpa sat in his tiny garden behind the apartment...', source: 'Original' },
      { id: 'col_new_sibling', title: 'The Day I Became a Big Brother', durationMinutes: 6, tradition: 'universal', theme: 'sharing', body: 'When Mummy came home with the tiny bundle, everything changed...', source: 'Original' },
      { id: 'col_moms_hands', title: "The Magic in Mummy's Hands", durationMinutes: 5, tradition: 'universal', theme: 'compassion-animals', body: "When I fall down, Mummy's hands pick me up. When I'm cold...", source: 'Original' },
      { id: 'col_dads_promise', title: "Daddy's Promise", durationMinutes: 6, tradition: 'universal', theme: 'honesty', body: 'Daddy said he would be at the school play. But the meeting ran late...', source: 'Original' },
    ],
  },
  {
    id: 'planets',
    title: '🪐 Planets & Solar System',
    subtitle: 'Adventures beyond Earth',
    icon: '🪐',
    stories: [
      { id: 'col_moon_lonely', title: 'Why the Moon Is Never Lonely', durationMinutes: 5, tradition: 'universal', theme: 'wisdom', body: 'The Moon looked down at Earth and sighed. "Everyone has friends down there..."', source: 'Original' },
      { id: 'col_mars_red', title: 'Why Mars Is Red', durationMinutes: 5, tradition: 'universal', theme: 'courage', body: 'Long ago, Mars was blue like Earth. But one day, Mars decided to be brave...', source: 'Original' },
      { id: 'col_saturn_rings', title: "Saturn's Beautiful Rings", durationMinutes: 6, tradition: 'universal', theme: 'sharing', body: 'Saturn was the loneliest planet. Too far from the Sun, too cold for visitors...', source: 'Original' },
      { id: 'col_pluto_small', title: "Pluto's Big Heart", durationMinutes: 5, tradition: 'universal', theme: 'humility', body: 'When they said Pluto was too small to be a planet, little Pluto cried...', source: 'Original' },
    ],
  },
  {
    id: 'countries',
    title: '🌍 Countries & Places',
    subtitle: 'Discover the world, one bedtime at a time',
    icon: '🌍',
    stories: [
      { id: 'col_japan_cherry', title: 'The Cherry Blossoms of Japan', durationMinutes: 6, tradition: 'universal', theme: 'wisdom', body: 'In a small village near Mount Fuji, a cherry tree bloomed every spring...', source: 'Original' },
      { id: 'col_canada_maple', title: "Canada's Maple Leaf Secret", durationMinutes: 5, tradition: 'universal', theme: 'sharing', body: 'Why is the maple leaf on the Canadian flag? Here is the story...', source: 'Original' },
      { id: 'col_india_river', title: 'The River That Connected Two Villages', durationMinutes: 6, tradition: 'universal', theme: 'compassion-animals', body: 'Between two villages in Rajasthan, there was a river that flowed only in monsoon...', source: 'Original' },
      { id: 'col_egypt_pyramid', title: 'The Smallest Pyramid', durationMinutes: 6, tradition: 'universal', theme: 'humility', body: 'Everyone talks about the Great Pyramid. But next to it stands a tiny one...', source: 'Original' },
    ],
  },
];
