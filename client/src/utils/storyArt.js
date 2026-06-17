// Story art — gradient + icon for each wisdom story.
// Firestore images (config/wisdomImages) are the actual cover images.
// No external stock images — only our own generated art.

const STORY_ART = {
  // FIFA World Cup 2026
  fifa26_ep1_history: { gradient: 'linear-gradient(135deg, #1a472a 0%, #006837 40%, #ffd700 100%)', icon: '⚽', accent: '#ffd700', prompt: 'Vintage 1930 stadium transforming into modern 2026 arena, World Cup trophy glowing, 48 nation flags, diverse fans united, soccer energy, team spirit, warm golden light, childrens book illustration' },
  fifa26_ep2_host_cities: { gradient: 'linear-gradient(135deg, #c41e3a 0%, #002868 40%, #006847 100%)', icon: '🏟️', accent: '#c41e3a', prompt: 'Toronto CN Tower, New York, Vancouver, Mexico City connected by golden soccer ball trail, 48 flags flying, diverse families celebrating in stadiums, three nations united, warm sunset, childrens book style' },
  fifa26_ep3_beautiful_game: { gradient: 'linear-gradient(135deg, #006837 0%, #2d8a4e 40%, #ffffff 100%)', icon: '⚽', accent: '#2d8a4e', prompt: 'Joyful kids of many ethnicities playing soccer together on green pitch, teammates hugging after goal, fans waving flags from every continent, fair play and friendship, stadium lights, dreamy bedtime illustration' },
  fifa26_ep4_legends: { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #ffd700 50%, #006837 100%)', icon: '🏆', accent: '#ffd700', prompt: 'Legendary footballer silhouettes from different eras standing united, golden auras, World Cup trophy shining, diverse national flags forming rainbow arc, fans cheering together, courage and dreams, childrens illustration' },
  fifa26_ep5_your_dream: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #ffd700 40%, #c41e3a 100%)', icon: '🌟', accent: '#ffd700', prompt: 'Child sleeping in bed, dream bubble showing them scoring World Cup winning goal, teammates from many countries group-hugging, golden confetti, 80000 fans united, jersey with heart symbol, magical bedtime glow' },

  // Dallas FIFA
  fifa26_dallas_ep1_history: { gradient: 'linear-gradient(135deg, #003594 0%, #c41e3a 40%, #ffd700 100%)', icon: '⚽', accent: '#ffd700', prompt: 'Vintage 1930 stadium transforming into AT&T Stadium Arlington Texas, World Cup trophy, 48 nation flags, Texas star, warm golden light, childrens book illustration' },
  fifa26_dallas_ep2_city: { gradient: 'linear-gradient(135deg, #003594 0%, #c41e3a 40%, #ffffff 100%)', icon: '🏟️', accent: '#003594', prompt: 'AT&T Stadium Arlington with Texas star above, Fair Park Big Tex statue, Trinity River, diverse families in Dallas, Mexican and American flags, warm Texas sunset, childrens book illustration' },
  fifa26_dallas_ep3_game: { gradient: 'linear-gradient(135deg, #006837 0%, #2d8a4e 40%, #003594 100%)', icon: '⚽', accent: '#2d8a4e', prompt: 'Kids from many ethnicities playing soccer on green pitch inside AT&T Stadium, Texas star on the field, teammates hugging, fans waving flags, dreamy bedtime illustration' },
  fifa26_dallas_ep4_legends: { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #ffd700 50%, #003594 100%)', icon: '🏆', accent: '#ffd700', prompt: 'Legendary footballer silhouettes including Clint Dempsey with Texas star, Pelé, Messi, Marta, golden auras, AT&T Stadium in background, inspirational childrens illustration' },
  fifa26_dallas_ep5_dream: { gradient: 'linear-gradient(135deg, #003594 0%, #ffd700 40%, #c41e3a 100%)', icon: '🌟', accent: '#ffd700', prompt: 'Child sleeping in bed with dream bubble showing them scoring World Cup goal at AT&T Stadium with roof open, Texas stars above, golden confetti, warm magical bedtime glow' },

  fifa26_ep7_vozinha: { gradient: 'linear-gradient(135deg, #003893 0%, #cf2027 40%, #ffd700 100%)', icon: '🧤', accent: '#ffd700', prompt: 'Vozinha in golden goalkeeper kit making an incredible diving save, Cape Verde islands in background, kids looking up at him like a hero, warm golden light, childrens book illustration' },
  fifa26_dallas_ep6_vozinha: { gradient: 'linear-gradient(135deg, #003893 0%, #cf2027 40%, #ffd700 100%)', icon: '🧤', accent: '#ffd700', prompt: 'Vozinha in golden goalkeeper kit making diving save at AT&T Stadium, Cape Verde flag, Texas stars above, kids in stands cheering, warm heroic light, childrens book illustration' },

  fifa26_ep6_draw: { gradient: 'linear-gradient(135deg, #c41e3a 0%, #002868 40%, #ffd700 100%)', icon: '🤝', accent: '#c41e3a', prompt: 'Canadian maple leaf flag and Bosnian blue triangle flag waving together, two kids shaking hands in Toronto stadium, CN Tower background, draw match, sportsmanship, warm childrens book illustration' },

  multilingual_lion_mouse: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 40%, #fde68a 100%)',
    icon: '🦁', accent: '#f59e0b',
    image: '/og/multilingual-story.jpg',
    prompt: 'A majestic lion and a tiny mouse facing each other on a golden savanna, nine different cultural flags waving in the background, warm sunset, childrens book illustration style',
  },
  krishna_squirrel: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #f0a500 100%)',
    icon: '🐿️', accent: '#4ade80',
    prompt: 'A tiny squirrel carrying a single grain of rice near a silver river, a young boy with a flute (Krishna) gently stroking its back, golden sunset, Indian village background',
  },
  prophet_camel: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #c4a35a 100%)',
    icon: '🐪', accent: '#fbbf24',
    prompt: 'A gentle scene of a kind man comforting a crying camel in a garden in ancient Madinah, warm amber light, palm trees, peaceful Arabian atmosphere',
  },
  jesus_birds: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🕊️', accent: '#c084fc',
    prompt: 'A gentle figure sitting in a meadow surrounded by small birds perched on his hands and shoulders, soft lavender sky, wildflowers, peaceful and serene',
  },
  buddha_swan: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #ffd700 100%)',
    icon: '🦢', accent: '#fcd34d',
    prompt: 'A young prince gently holding a wounded swan near a lotus pond, golden light filtering through bamboo trees, peaceful ancient Indian garden',
  },
  guru_nanak_grain: {
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)',
    icon: '🌾', accent: '#f59e0b',
    prompt: 'A wise bearded man in a turban sharing grain with villagers in a golden wheat field, warm sunset light, Punjab countryside',
  },
  mahavir_ant: {
    gradient: 'linear-gradient(135deg, #1a3c34 0%, #2d5a4a 40%, #86efac 100%)',
    icon: '🐜', accent: '#34d399',
    prompt: 'A gentle prince carefully stepping over a line of tiny ants on a forest path, lush green jungle with dappled sunlight, butterflies',
  },
  jewish_noah: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #60a5fa 100%)',
    icon: '🌈', accent: '#60a5fa',
    prompt: 'A large wooden ark on calm waters with pairs of animals boarding, a beautiful rainbow appearing in the sky, doves flying, peaceful after-storm light',
  },
  sikh_water_carrier: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #f97316 100%)',
    icon: '💧', accent: '#fb923c',
    prompt: 'A brave Sikh warrior carrying water to wounded soldiers on a battlefield, golden light, compassion in his eyes, dusty Indian landscape',
  },
  hanuman_mountain: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #fdba74 100%)',
    icon: '⛰️', accent: '#fb923c',
    prompt: 'A powerful monkey-god flying through clouds carrying an entire mountain with glowing herbs on top, dramatic orange sunset, epic and majestic',
  },
  ram_golden_deer: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #fbbf24 100%)',
    icon: '🦌', accent: '#fbbf24',
    prompt: 'A magical golden deer with sparkling antlers running through a lush Indian forest, a prince watching from behind trees, enchanting moonlight',
  },
  akbar_birbal_well: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #a78bfa 100%)',
    icon: '🪣', accent: '#a78bfa',
    prompt: 'A clever minister standing beside a well in a Mughal palace courtyard, the emperor watching amused, ornate Indian architecture, warm lamplight',
  },
  panchatantra_monkey_crocodile: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #6ee7b7 100%)',
    icon: '🐒', accent: '#6ee7b7',
    prompt: 'A clever monkey sitting on a tree branch above a river talking to a crocodile below, tropical jungle, fruits hanging from trees, playful scene',
  },
  panchatantra_crow_pitcher: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #a8a29e 100%)',
    icon: '🏺', accent: '#d6d3d1',
    prompt: 'A clever black crow dropping small pebbles one by one into a clay pitcher, water rising slowly, warm dusty village setting, afternoon light',
  },
  krishna_govardhan: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #93c5fd 100%)',
    icon: '🏔️', accent: '#93c5fd',
    prompt: 'A young boy (Krishna) lifting an enormous mountain on his little finger like an umbrella, villagers and cows sheltering underneath from rain, dramatic clouds',
  },
  akbar_birbal_lines: {
    gradient: 'linear-gradient(135deg, #4a1942 0%, #6b2fa0 40%, #e879f9 100%)',
    icon: '✏️', accent: '#e879f9',
    prompt: 'A clever minister drawing a line on the ground next to a longer line in a Mughal court, the emperor looking surprised, ornate palace setting',
  },
  // ── Hindu batch 2 ──
  ganesha_mouse: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #fcd34d 100%)',
    icon: '🐭', accent: '#fcd34d',
    prompt: 'A gentle elephant-headed god bending down to speak to a tiny brown mouse, golden temple backdrop, warm sunset light, Indian mythology style',
  },
  hindu_cow_sage: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)',
    icon: '🦌', accent: '#86efac',
    prompt: 'An old sage in a forest hut bandaging the leg of a wounded deer by firelight, warm golden glow, lush green forest, peaceful Indian hermitage',
  },
  krishna_butter: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #fde68a 100%)',
    icon: '🧈', accent: '#fde68a',
    prompt: 'A mischievous blue-skinned boy with butter on his cheeks being scolded by his loving mother, clay pots of butter, cozy Indian village kitchen',
  },
  harishchandra_promise: {
    gradient: 'linear-gradient(135deg, #44403c 0%, #78716c 40%, #fbbf24 100%)',
    icon: '👑', accent: '#fbbf24',
    prompt: 'A noble king walking away from his golden palace with nothing but the clothes on his back, dramatic sunset, dignity in sacrifice, Indian epic style',
  },
  yudhishthira_half_truth: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #a5b4fc 100%)',
    icon: '⚖️', accent: '#a5b4fc',
    prompt: 'A majestic chariot sinking to touch the ground as a warrior looks down in sorrow, battlefield in background, dramatic golden light, Mahabharata scene',
  },
  sudama_poha: {
    gradient: 'linear-gradient(135deg, #422006 0%, #92400e 40%, #fcd34d 100%)',
    icon: '🍚', accent: '#fcd34d',
    prompt: 'A poor man with a small bundle of rice meeting a king in a golden palace, the king washing his feet, warm emotional scene, Indian mythology',
  },
  draupadi_akshaya_patra: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #fed7aa 100%)',
    icon: '🫕', accent: '#fed7aa',
    prompt: 'A woman serving food from a magical golden vessel in a forest clearing, many people being fed, warm light, abundance from simplicity, Indian epic style',
  },
  karna_golden_armour: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🛡️', accent: '#fbbf24',
    prompt: 'A warrior peeling golden armour from his own body to give to a disguised god, blood and gold mixing, dramatic sacrifice, Mahabharata epic scene',
  },
  ram_shabari_berries: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 40%, #bbf7d0 100%)',
    icon: '🫐', accent: '#bbf7d0',
    prompt: 'An old woman offering half-eaten berries to a divine prince who eats them with joy, simple forest hut, warm golden light, devotion and humility',
  },
  hanuman_chest: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 40%, #fca5a5 100%)',
    icon: '❤️', accent: '#fca5a5',
    prompt: 'A powerful monkey warrior tearing open his chest to reveal a divine couple glowing inside his heart, royal court gasping, epic Indian mythology scene',
  },
  shiva_kannappa: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #e2e8f0 100%)',
    icon: '👁️', accent: '#e2e8f0',
    prompt: 'A tribal hunter offering his eye to a sacred stone in a forest, divine light appearing, raw devotion, southern Indian temple forest setting',
  },
  ram_vibhishana: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 40%, #93c5fd 100%)',
    icon: '🤗', accent: '#93c5fd',
    prompt: 'A noble prince embracing a trembling man who kneels before him while warriors watch in surprise, warm golden light, Ramayana epic scene',
  },
  sage_scorpion: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #fdba74 100%)',
    icon: '🦂', accent: '#fdba74',
    prompt: 'An old sage by a river gently lifting a scorpion from the water with his bare hand, sunset reflection on water, peaceful Indian riverside',
  },
  krishna_hundred_chances: {
    gradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #c4b5fd 100%)',
    icon: '💯', accent: '#c4b5fd',
    prompt: 'A serene blue-skinned god standing calmly in a royal court as an angry king shouts insults, patience and grace, dramatic Indian court scene',
  },
  // ── New stories ──
  prophet_ant_hill: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 40%, #95d5b2 100%)',
    icon: '🐜', accent: '#95d5b2',
    prompt: 'A kind man in white robes gently moving a fire away from a tiny ant hill in the desert, ants carrying their babies to safety, warm golden light',
  },
  prophet_thirsty_dog: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #457b9d 40%, #a8dadc 100%)',
    icon: '🐕', accent: '#a8dadc',
    prompt: 'A woman in the desert filling her shoe with water from a well for a thirsty dog, warm sunset, palm trees, compassion scene',
  },
  good_samaritan: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🤝', accent: '#c084fc',
    prompt: 'A kind traveller kneeling to help an injured man on a dusty road, donkey waiting nearby, warm sunset light, Biblical landscape',
  },
  jesus_mustard_seed: {
    gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 40%, #95d5b2 100%)',
    icon: '🌱', accent: '#95d5b2',
    prompt: 'A tiny golden seed in an open palm growing into an enormous tree with birds resting in its branches, magical transformation, warm light',
  },
  buddha_elephant: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #e2a94c 100%)',
    icon: '🐘', accent: '#e2a94c',
    prompt: 'A peaceful monk standing calmly as a large elephant bows its head gently before him, golden light, ancient Indian city background',
  },
  buddha_rice_bowl: {
    gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 40%, #ffeaa7 100%)',
    icon: '🍚', accent: '#ffeaa7',
    prompt: 'A village girl offering a golden bowl of rice to a thin man sitting under a big tree, morning mist, lotus flowers, peaceful Indian village',
  },
  jain_true_wealth: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #a5b4fc 100%)',
    icon: '💎', accent: '#a5b4fc',
    prompt: 'A rich merchant removing his silk turban and placing it at the feet of a simple monk under a tree, golden light, transformation of pride to humility',
  },
  jain_spider_web: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #94a3b8 100%)',
    icon: '🕸️', accent: '#94a3b8',
    prompt: 'A tiny spider spinning a delicate web across a dark cave entrance, moonlight catching the silk strands, a king watching in wonder from inside',
  },
  jewish_one_good_deed: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #93c5fd 100%)',
    icon: '🗺️', accent: '#93c5fd',
    prompt: 'A young boy piecing together a torn map on a wooden table, each piece glowing as it connects, warm lamplight, cozy study room',
  },
  jewish_two_pockets: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #fbbf24 100%)',
    icon: '🧥', accent: '#fbbf24',
    prompt: 'A wise old rabbi with a kind smile holding two small glowing pieces of paper, one in each hand, starry night sky, candlelight',
  },
  sikh_langar: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🍲', accent: '#fbbf24',
    prompt: 'A young boy serving food to people sitting together on the floor in a golden temple kitchen, steam rising, warm community meal, Sikh Langar scene',
  },
  // ── Universal stories ──
  universal_lighthouse_keeper: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #fbbf24 100%)',
    icon: '🏠', accent: '#fbbf24',
    prompt: 'A tiny lighthouse on a rocky island at night, its golden beam cutting through a wild storm, a small boat following the light to safety',
  },
  universal_garden_of_mistakes: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 40%, #fcd34d 100%)',
    icon: '🌸', accent: '#10b981',
    prompt: 'A magical garden where bright orange flowers bloom from the ground wherever a girl stands, glowing soil, enchanted garden at sunset',
  },
  universal_invisible_boy: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 40%, #a78bfa 100%)',
    icon: '🐕', accent: '#a78bfa',
    prompt: 'A lonely boy wrapping his jacket around a small shivering stray dog under a bench in the rain, warm lamplight, compassion scene',
  },
  universal_patience_river: {
    gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 40%, #a5f3fc 100%)',
    icon: '🏞️', accent: '#0891b2',
    prompt: 'A tiny stream of water slowly carving through a massive cliff face over time, creating a beautiful canyon, golden light streaming through',
  },
  universal_sharing_blanket: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 40%, #e0e7ff 100%)',
    icon: '🧣', accent: '#818cf8',
    prompt: 'An old woman tearing her starry blue blanket in half to share with a shivering traveller by a small fire, snowy mountain village night',
  },
  universal_respect_old_tree: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 40%, #86efac 100%)',
    icon: '🌳', accent: '#22c55e',
    prompt: 'A girl hugging an enormous ancient oak tree in a town square, birds nesting in branches, dappled golden sunlight, community gathering',
  },
  universal_forgiveness_kite: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 40%, #fed7aa 100%)',
    icon: '🪁', accent: '#ea580c',
    prompt: 'A boy opening his hand to release a kite string, the kite soaring free into a golden sunset sky, feeling of release and peace',
  },
  universal_wisdom_two_wolves: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #57534e 40%, #f59e0b 100%)',
    icon: '🐺', accent: '#f59e0b',
    prompt: 'A grandmother and grandchild sitting by a glowing fireplace, two wolf spirits made of light and shadow facing each other above the flames',
  },
  universal_humility_mountain: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #64748b 40%, #bbf7d0 100%)',
    icon: '⛰️', accent: '#64748b',
    prompt: 'A proud tall mountain with a bare icy peak looking down at a small green hill covered in flowers and children playing, humbling contrast',
  },
  universal_bravery_first_step: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #312e81 40%, #c4b5fd 100%)',
    icon: '🌙', accent: '#8b5cf6',
    prompt: 'A small girl taking her first brave step down dark stairs holding onto the bannister, a tiny warm glow from a candle at the bottom',
  },
  mothers_day_toronto: {
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 40%, #fce7f3 100%)',
    icon: '🌷', accent: '#f472b6',
    prompt: 'A child handing a bright yellow tulip to their mother on a sunny Toronto waterfront bench, CN Tower in background, cherry blossoms, spring sunshine, heartwarming',
  },
  // ─── Sikh standalone stories ───
  sikh_river_teaches: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 40%, #f0a500 100%)', icon: '🌊', accent: '#38bdf8', prompt: 'A calm river in Punjab with golden moonlight reflecting on the water, misty banks, wheat fields, starry night, watercolor style, no people, no text' },
  sikh_needle_thread: { gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)', icon: '🪡', accent: '#f59e0b', prompt: 'A single golden needle and thread resting on a soft cloth beside a flickering oil lamp, simple Punjabi room, moonlight through window, no text' },
  sikh_bhai_lalo_bread: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #fbbf24 100%)', icon: '🫓', accent: '#fbbf24', prompt: 'A humble Punjabi kitchen with warm firelight, simple roti on a tawa, earthen pots, wooden shelf, cozy village atmosphere at night, no text' },
  sikh_jasmine_garden: { gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #a7f3d0 100%)', icon: '🌸', accent: '#6ee7b7', prompt: 'A beautiful Mughal-style garden with jasmine flowers blooming under moonlight, dewdrops on petals, peaceful night, watercolor style, no text' },
  sikh_cobbler_prayer: { gradient: 'linear-gradient(135deg, #422006 0%, #713f12 40%, #d97706 100%)', icon: '🙏', accent: '#f59e0b', prompt: 'A humble cobbler workshop with leather and tools, a small oil lamp glowing warmly, devotional atmosphere, Punjab village night, no text' },
  sikh_milk_jasmine: { gradient: 'linear-gradient(135deg, #f5f5dc 0%, #fffdd0 20%, #f0a500 100%)', icon: '🥛', accent: '#fef3c7', prompt: 'A brass bowl filled with milk and a single jasmine flower floating in it, warm candlelight, simple table, nighttime, no text' },
  sikh_two_swords: { gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #f0a500 100%)', icon: '⚔️', accent: '#f0a500', prompt: 'Two ornate swords crossed gently on a velvet cloth, Khanda symbol glowing softly behind them, candlelight, no text' },
  sikh_bhai_kanhaiya: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #38bdf8 100%)', icon: '💧', accent: '#38bdf8', prompt: 'A leather water pouch resting on a moonlit field, gentle golden glow, dewdrops on grass, peaceful battlefield night, no text' },
  sikh_mata_khivi_langar: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍲', accent: '#fbbf24', prompt: 'A warm langar hall kitchen with large copper pots of food, steam rising, oil lamps, chapati on tawa, community kitchen, no text' },
  sikh_youngest_guru: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '✨', accent: '#fbbf24', prompt: 'A small glowing lamp surrounded by healing herbs and a bowl of water, soft golden light radiating outward, misty peaceful night, no text' },
  sikh_lion_roars: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #f0a500 100%)', icon: '🦁', accent: '#f0a500', prompt: 'A majestic lion sitting peacefully on a hilltop under a starry Punjab sky, moonlight, wheat fields below, calm powerful presence, no text' },
  sikh_string_of_kite: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #c4b5fd 100%)', icon: '🪁', accent: '#c4b5fd', prompt: 'A colorful kite flying high against a deep purple and gold sunset sky over Punjab fields, string catching golden light, no text' },
  sikh_guru_ka_langar: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍛', accent: '#fbbf24', prompt: 'A warm gurdwara langar hall with rows of steel plates on the floor, oil lamps along walls, golden light, community kitchen, no text' },
  sikh_sound_waheguru: { gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #f0a500 100%)', icon: '🕉️', accent: '#f0a500', prompt: 'A child sitting cross-legged on a soft blanket by a window, moonlight, eyes closed in prayer, peaceful bedroom, candle, no text' },
  sikh_stars_amritsar: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #f0a500 40%, #fef3c7 100%)', icon: '🌟', accent: '#f0a500', prompt: 'The Golden Temple reflected perfectly in the sacred pool at night, deep blue starry sky, golden dome glowing, peaceful, no text' },
  // ─── Sikh series episodes ───
  stgl_ep1_first_light: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '🪯', accent: '#f0a500', prompt: 'A glowing golden Ik Onkar symbol floating above a calm Punjabi river, soft moonlight, misty banks, watercolor, no text' },
  stgl_ep2_gift_of_letters: { gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)', icon: '📜', accent: '#f59e0b', prompt: 'Gurmukhi script letters glowing in soft gold on an ancient scroll, candle nearby, ink pot and reed pen, Punjab night, no text' },
  stgl_ep3_sits_together: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍽️', accent: '#fbbf24', prompt: 'A warm langar hall with rows of simple plates on the floor, golden lamplight, steam rising from food, peaceful, no text' },
  stgl_ep4_golden_city: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #f0a500 40%, #fef3c7 100%)', icon: '🏛️', accent: '#f0a500', prompt: 'The Golden Temple reflected in the sacred pool, deep blue starry sky, golden dome, no people, watercolor style, no text' },
  stgl_ep5_holy_book: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #f0a500 40%, #fef3c7 100%)', icon: '📖', accent: '#f0a500', prompt: 'The Guru Granth Sahib on a decorated palki with marigold flowers, soft golden candlelight, silk cloths, serene, no text' },
  stgw_ep1_two_swords: { gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #f0a500 100%)', icon: '⚔️', accent: '#f0a500', prompt: 'Two ornate swords (miri-piri) crossed on velvet, Khanda symbol glowing softly behind, candlelight, no text' },
  stgw_ep2_healing_garden: { gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #a7f3d0 100%)', icon: '🌿', accent: '#6ee7b7', prompt: 'A moonlit herb garden with medicinal plants, mortar and pestle, dewdrops catching starlight, Punjab landscape, no text' },
  stgw_ep3_young_guru: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '✨', accent: '#fbbf24', prompt: 'A small glowing lamp surrounded by healing herbs and water bowl, golden light radiating, misty atmosphere, no text' },
  stgw_ep4_shield_of_faith: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #f0a500 40%, #fef3c7 100%)', icon: '🛡️', accent: '#f0a500', prompt: 'A golden shield with Khanda symbol standing in moonlight, protecting prayer symbols behind it, no text' },
  stgw_ep5_brave_khalsa: { gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fed7aa 100%)', icon: '🚩', accent: '#f97316', prompt: 'Five kesri (saffron) Nishan Sahib flags on a hilltop at dawn, golden light through clouds, Punjab landscape, no text' },
  ssfg_ep1_langar: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍲', accent: '#fbbf24', prompt: 'Large copper pots in a gurdwara kitchen, warm steam, golden light from oil lamps, chapati on tawa, no text' },
  ssfg_ep2_karah_prasad: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '🥣', accent: '#fbbf24', prompt: 'A brass bowl of golden karah prasad with wooden spoon, marigold petals scattered, warm candlelight, no text' },
  ssfg_ep3_kirtan: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #c4b5fd 100%)', icon: '🎵', accent: '#c4b5fd', prompt: 'Harmonium and tabla instruments in a gurdwara, soft golden light, Guru Granth Sahib in silk background, peaceful, no text' },
  ssfg_ep4_seva: { gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #a7f3d0 100%)', icon: '🧹', accent: '#6ee7b7', prompt: 'Clean shoes arranged neatly outside a gurdwara entrance, small broom against wall, moonlight on marble floor, no text' },
  ssfg_ep5_panj_pyare: { gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fed7aa 100%)', icon: '🪯', accent: '#f97316', prompt: 'Five kesri turbans in a circle on the ground, steel bowl of amrit with khanda in center, starlight, no text' },
  sbhp_ep1_kanhaiya: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #38bdf8 100%)', icon: '💧', accent: '#38bdf8', prompt: 'A leather water pouch resting on a moonlit battlefield, water droplets glistening, peaceful contrast, no text' },
  sbhp_ep2_mai_bhago: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #f0a500 100%)', icon: '🐎', accent: '#f0a500', prompt: 'A horse standing proud on a Punjab hilltop at dusk, spear in ground, kesri flag waving, no person visible, no text' },
  sbhp_ep3_banda_singh: { gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #f0a500 100%)', icon: '⚖️', accent: '#f0a500', prompt: 'A simple throne with scales of justice, Punjab fortress background, moonlight, wheat fields, no text' },
  sbhp_ep4_mani_singh: { gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)', icon: '📚', accent: '#f59e0b', prompt: 'Ancient manuscripts and scrolls on a desk, quill pen, oil lamp, Gurmukhi text on pages, library atmosphere, no text' },
  sbhp_ep5_hari_singh: { gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #f0a500 100%)', icon: '🦁', accent: '#f0a500', prompt: 'A majestic fortress gate in mountain pass, lion statues flanking entrance, moonlit mountains, Punjab flag, no text' },
  slbh_ep1_patka: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #c4b5fd 100%)', icon: '👳', accent: '#c4b5fd', prompt: 'A small colorful patka folded neatly on a child bedside table, kangha comb beside it, warm lamplight, cozy bedroom, no text' },
  slbh_ep2_waheguru_before_bed: { gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #f0a500 100%)', icon: '🙏', accent: '#f0a500', prompt: 'A small kara steel bracelet on a prayer cushion beside a bed, moonlight through curtains, stars visible, peaceful, no text' },
  slbh_ep3_first_gurdwara: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '🏛️', accent: '#f0a500', prompt: 'A gurdwara exterior with golden domes against a starry sky, small shoes at entrance, warm welcoming light from inside, no text' },
  slbh_ep4_sharing_plate: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🫓', accent: '#fbbf24', prompt: 'A child small hands placing roti on a shared plate, warm kitchen light, simple Punjabi meal, overhead view, no text' },
  slbh_ep5_everyone_equal: { gradient: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 40%, #fef3c7 100%)', icon: '🤝', accent: '#f0a500', prompt: 'A long row of identical simple plates and glasses for langar, warm golden light from oil lamps along the row, no text' },
  // ─── Indigenous Canadian — Turtle Island series ───
  ti_ep1_grandmother_moon: { gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #c0c0c0 100%)', icon: '🌙', accent: '#e2e8f0', prompt: 'A luminous full moon reflected in a still Canadian lake, cedar trees, campfire on shore, northern stars, soft silver light, no text' },
  ti_ep2_bear_sharing: { gradient: 'linear-gradient(135deg, #1a472a 0%, #3b2c1a 40%, #c0392b 100%)', icon: '🐻', accent: '#c0392b', prompt: 'A gentle brown bear beside a berry bush in a Canadian forest, birds and fox nearby, warm light through spruce trees, no text' },
  ti_ep3_turtle_wisdom: { gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #6ee7b7 100%)', icon: '🐢', accent: '#6ee7b7', prompt: 'A painted turtle on a rock beside a lake with water lilies, dragonflies, morning mist, Canadian wilderness, no text' },
  ti_ep4_salmon_journey: { gradient: 'linear-gradient(135deg, #1a472a 0%, #8B4513 40%, #c0c0c0 100%)', icon: '🐟', accent: '#c0c0c0', prompt: 'Silver salmon leaping upstream through rushing water, autumn maple leaves, rocky Canadian riverbank, golden light, no text' },
  ti_ep5_drum_stars: { gradient: 'linear-gradient(135deg, #1a472a 0%, #2d2d5e 40%, #6ee7b7 100%)', icon: '🥁', accent: '#6ee7b7', prompt: 'A hand drum near a campfire under northern lights, green and purple aurora, sparks rising, Canadian wilderness, no text' },
  // ─── Indigenous Canadian — standalone stories ───
  indigenous_eagle_feather: { gradient: 'linear-gradient(135deg, #1a472a 0%, #8B4513 40%, #fbbf24 100%)', icon: '🪶', accent: '#fbbf24', prompt: 'A single eagle feather on soft cloth beside a quiet Canadian lake, autumn maple leaves, golden afternoon light, no text' },
  indigenous_two_eyed_seeing: { gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #a78bfa 100%)', icon: '👁️', accent: '#a78bfa', prompt: 'Eyes reflected in a still lake at twilight, one reflecting cedar forest, the other starlit sky, Canadian landscape, no text' },
  indigenous_medicine_wheel: { gradient: 'linear-gradient(135deg, #fbbf24 0%, #c0392b 30%, #1a472a 60%, #e2e8f0 100%)', icon: '☀️', accent: '#fbbf24', prompt: 'A medicine wheel on a grassy hilltop with four colours, Canadian prairie under a vast sky, soft golden light, no text' },
  indigenous_river_knows: { gradient: 'linear-gradient(135deg, #1a472a 0%, #0891b2 40%, #a5f3fc 100%)', icon: '🏞️', accent: '#0891b2', prompt: 'A clear stream winding through mossy Canadian forest, smooth pebbles, ferns and birch trees, misty light, no text' },
  indigenous_fire_keeper: { gradient: 'linear-gradient(135deg, #1a472a 0%, #9a3412 40%, #fdba74 100%)', icon: '🔥', accent: '#fdba74', prompt: 'A campfire burning steadily in a forest clearing at night, sparks rising, northern lights, Canadian wilderness, no text' },
  indigenous_cedar_sage_sweetgrass: { gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #fcd34d 100%)', icon: '🌿', accent: '#6ee7b7', prompt: 'Cedar branch, sage, and sweetgrass braid on a woven cloth, meadow background, Canadian wildflowers, gentle light, no text' },
  indigenous_moose_mouse: { gradient: 'linear-gradient(135deg, #1a472a 0%, #3b2c1a 40%, #e2e8f0 100%)', icon: '🫎', accent: '#e2e8f0', prompt: 'A majestic moose beside a tiny mouse on a log in a snowy Canadian boreal forest, spruce trees, blue winter light, no text' },
  indigenous_snow_silence: { gradient: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 40%, #1a472a 100%)', icon: '❄️', accent: '#e2e8f0', prompt: 'Fresh snow covering a Canadian forest at dawn, branches laden with white, small footprints, perfect silence, pink light, no text' },
  indigenous_northern_lights: { gradient: 'linear-gradient(135deg, #1a1a3e 0%, #1a472a 40%, #6ee7b7 100%)', icon: '✨', accent: '#6ee7b7', prompt: 'Northern lights in green purple and gold over snowy Canadian landscape, a silhouette looking up in wonder, magical, no text' },
  indigenous_every_rock: { gradient: 'linear-gradient(135deg, #1a472a 0%, #475569 40%, #8B4513 100%)', icon: '🪨', accent: '#94a3b8', prompt: 'A smooth grey stone on the shore of a clear Canadian lake, distant cliffs, pine trees, a loon, warm sunset light, no text' },

  // ─── Parables for Little Hearts (Christian Series) ───
  plh_ep1_good_friend: { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 40%, #bfdbfe 100%)', icon: '🤝', accent: '#3b82f6', prompt: 'A kind traveler helping a fallen stranger on a dusty road, donkey nearby, olive tree hills, sunset' },
  plh_ep2_lost_coin: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🪙', accent: '#fbbf24', prompt: 'A woman searching a cottage floor by lamplight for a lost coin, warm golden glow' },
  plh_ep3_tiny_seed: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '🌱', accent: '#4ade80', prompt: 'A tiny seed in a palm growing into a great tree with birds, warm golden light' },
  plh_ep4_house_on_rock: { gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #60a5fa 100%)', icon: '🏠', accent: '#60a5fa', prompt: 'Two houses on a hillside, one on rock standing firm in rain, warm watercolor' },
  plh_ep5_generous_farmer: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🌾', accent: '#f59e0b', prompt: 'A farmer sharing harvest baskets with villagers, golden sunset, rolling green fields' },

  // ─── Peaceful Paws — Buddhist Stories (Series) ───
  ppb_ep1_monkey_still: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '🐒', accent: '#4ade80', prompt: 'A monkey meditating peacefully on a mossy rock by a forest pond, bamboo, lotus flowers' },
  ppb_ep2_elephant_kindness: { gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #cbd5e1 100%)', icon: '🐘', accent: '#94a3b8', prompt: 'A gentle elephant bowing to a small bird on a lotus flower, misty forest, golden sunset' },
  ppb_ep3_lotus_mud: { gradient: 'linear-gradient(135deg, #831843 0%, #db2777 40%, #fbcfe8 100%)', icon: '🪷', accent: '#ec4899', prompt: 'A pink lotus rising from muddy water into golden sunlight, dewdrops on petals, transformation' },
  ppb_ep4_turtle_slow: { gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 40%, #6ee7b7 100%)', icon: '🐢', accent: '#34d399', prompt: 'A turtle walking peacefully on a forest path with wildflowers, golden afternoon light' },
  ppb_ep5_deer_meadow: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fde68a 100%)', icon: '🦌', accent: '#fbbf24', prompt: 'Deer, rabbits, and birds sharing a golden meadow, misty forest, harmony, golden hour' },

  // ─── Gentle Footsteps — Jain Stories (Series) ───
  gfj_ep1_butterflies: { gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #c7d2fe 100%)', icon: '🦋', accent: '#818cf8', prompt: 'A boy counting butterflies in a flower meadow, gentle golden light, wonder' },
  gfj_ep2_walking_softly: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '👣', accent: '#4ade80', prompt: 'A barefoot girl walking gently on a forest path, dappled sunlight, moss and ferns' },
  gfj_ep3_anthill_prince: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #f0a500 100%)', icon: '🐜', accent: '#f0a500', prompt: 'A young prince protecting an anthill in a forest, palace background, golden light' },
  gfj_ep4_sharing_no_score: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🥭', accent: '#f59e0b', prompt: 'Two children sharing food under a mango tree, warm afternoon, Indian village' },
  gfj_ep5_firefly_light: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #fbbf24 100%)', icon: '✨', accent: '#fbbf24', prompt: 'A glowing firefly in a dark forest, other fireflies appearing, magical golden light' },

  // ─── Wise Nights — Jewish Stories (Series) ───
  wnj_ep1_jar_honey: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍯', accent: '#fbbf24', prompt: 'A rabbi pouring honey onto a book page, candlelight, warm study, books on shelves' },
  wnj_ep2_broken_vase: { gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #fbbf24 100%)', icon: '🏺', accent: '#fbbf24', prompt: 'A vase repaired with golden seams on a windowsill, sunset light, warm and glowing' },
  wnj_ep3_miriam_song: { gradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 40%, #fda4af 100%)', icon: '🎵', accent: '#fb7185', prompt: 'A woman dancing by the seashore at sunrise with a tambourine, golden and rosy light' },
  wnj_ep4_challah_village: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fef3c7 100%)', icon: '🍞', accent: '#f59e0b', prompt: 'Golden challah bread on a table, villagers sharing, warm candlelight, Shabbat evening' },
  wnj_ep5_stars_jerusalem: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #60a5fa 100%)', icon: '⭐', accent: '#60a5fa', prompt: 'A child on a rooftop in Jerusalem looking at a starry sky, golden city walls, lantern light' },

  // ─── Christian standalone stories ───
  christian_shepherd_blanket: { gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #fef3c7 100%)', icon: '🐑', accent: '#fbbf24', prompt: 'A shepherd boy wrapping a blanket around a lamb on a snowy hillside, starlight' },
  christian_fisherman_net: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #60a5fa 100%)', icon: '🐟', accent: '#60a5fa', prompt: 'A fisherman casting a wide golden net on calm blue water at sunrise' },
  christian_sparrow_watches: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #fbbf24 100%)', icon: '🐦', accent: '#fbbf24', prompt: 'A sparrow perched in rain with a sunbeam breaking through clouds, warm and hopeful' },
  christian_star_led_way: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #fbbf24 100%)', icon: '⭐', accent: '#fbbf24', prompt: 'Three travellers on camels following a brilliant star across a desert at night' },
  christian_well_living_water: { gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 40%, #a5f3fc 100%)', icon: '💧', accent: '#22d3ee', prompt: 'A stone well with clear water overflowing gently, children drinking, golden light' },
  christian_fig_tree_chance: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '🌿', accent: '#4ade80', prompt: 'A fig tree with one small green leaf sprouting, a gardener kneeling beside it, hopeful light' },
  christian_mustard_seed_garden: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🌳', accent: '#f59e0b', prompt: 'An enormous mustard tree in golden bloom, birds and butterflies, children in shade' },
  christian_widow_coins: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🪙', accent: '#fbbf24', prompt: 'An elderly woman placing two copper coins in an offering box, warm temple light' },
  christian_bridges_not_walls: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fde68a 100%)', icon: '🌉', accent: '#f59e0b', prompt: 'A wooden bridge across a stream between two cottages, neighbours meeting, sunset' },
  christian_light_on_hill: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #fbbf24 100%)', icon: '🕯️', accent: '#fbbf24', prompt: 'A cottage with golden candlelight in the window on a green hill, dark evening sky' },

  // ─── Buddhist standalone stories ───
  buddhist_tiger_strawberry: { gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 40%, #fca5a5 100%)', icon: '🍓', accent: '#ef4444', prompt: 'A red strawberry on a cliff vine, golden light, clouds below, present moment beauty' },
  buddhist_empty_cup: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🍵', accent: '#fbbf24', prompt: 'Tea overflowing a cup, monk pouring, scholar watching, warm candlelit room' },
  buddhist_siddhartha_garden: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #fbbf24 100%)', icon: '🌸', accent: '#4ade80', prompt: 'A prince meditating in a lush garden, lotus ponds, deer, golden afternoon light' },
  buddhist_monk_scorpion: { gradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 40%, #fecaca 100%)', icon: '🦂', accent: '#ef4444', prompt: 'A monk lifting a scorpion from a river with a leaf, golden sunset, bamboo forest' },
  buddhist_mountain_moved: { gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #cbd5e1 100%)', icon: '⛰️', accent: '#94a3b8', prompt: 'A misty mountain with water flowing down, carving a valley, dawn light, patient' },
  buddhist_two_hands: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🤲', accent: '#f59e0b', prompt: 'Two hands clapping with golden light ripples, temple background, connection' },
  buddhist_river_found_sea: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0284c7 40%, #7dd3fc 100%)', icon: '🌊', accent: '#0ea5e9', prompt: 'A mountain stream widening toward a golden ocean at sunset, journey and arrival' },
  buddhist_breathing_ocean: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #c4b5fd 100%)', icon: '🌅', accent: '#8b5cf6', prompt: 'A child meditating on a beach at sunset, gentle waves, golden and lavender sky' },
  buddhist_farmer_good_luck: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '🐴', accent: '#4ade80', prompt: 'A farmer beside a wild horse in a green field, amazed villagers, golden light' },
  buddhist_footprints_snow: { gradient: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 40%, #1e293b 100%)', icon: '👣', accent: '#e2e8f0', prompt: 'Footprints in fresh snow leading to a mountain monastery, pink sunrise, serene winter' },

  // ─── Jain standalone stories ───
  jain_prince_never_hurt_fly: { gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #c7d2fe 100%)', icon: '🪰', accent: '#818cf8', prompt: 'A prince releasing a fly through a palace window, golden light, ornate Indian interior' },
  jain_spider_web: { gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #c4b5fd 100%)', icon: '🕸️', accent: '#a78bfa', prompt: 'A spider web with morning dew in golden sunrise, child watching in wonder, garden' },
  jain_merchant_gave_everything: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🧘', accent: '#fbbf24', prompt: 'A merchant placing jewels at a monk feet under a tree, golden sunset, peace' },
  jain_bird_carried_water: { gradient: 'linear-gradient(135deg, #9a3412 0%, #f97316 40%, #fed7aa 100%)', icon: '🐦', accent: '#fb923c', prompt: 'A tiny bird flying with a water drop toward a forest fire, courage, golden orange light' },
  jain_walking_barefoot: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)', icon: '🦶', accent: '#4ade80', prompt: 'Bare feet on soft green grass with wildflowers, golden light, dewdrops, mindful' },
  jain_diamond_dewdrop: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #ddd6fe 100%)', icon: '💎', accent: '#8b5cf6', prompt: 'A dewdrop catching rainbow light beside a diamond, morning garden, simplicity' },
  jain_peacock_dance: { gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 40%, #a5f3fc 100%)', icon: '🦚', accent: '#22d3ee', prompt: 'A peacock dancing in monsoon rain, iridescent feathers, golden light through clouds' },
  jain_farmer_fed_ants: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #f0a500 100%)', icon: '🐜', accent: '#f0a500', prompt: 'A farmer placing grains near an anthill at sunset, Indian farmland, gentle caring' },
  jain_temple_sunrise: { gradient: 'linear-gradient(135deg, #e2e8f0 0%, #f0abfc 40%, #fbbf24 100%)', icon: '🛕', accent: '#fbbf24', prompt: 'A white marble Jain temple glowing in pink and gold sunrise, child at entrance, mist' },
  jain_child_counted_stars: { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #fbbf24 100%)', icon: '🌟', accent: '#fbbf24', prompt: 'A child on grass looking at a vast starry sky, wonder, golden window light nearby' },

  // ─── Jewish standalone stories ───
  jewish_wise_child_chelm: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🏘️', accent: '#fbbf24', prompt: 'A child in a village square, confused adults, lantern glowing, Eastern European shtetl' },
  jewish_golem_heart: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #94a3b8 100%)', icon: '🗿', accent: '#94a3b8', prompt: 'A gentle clay giant kneeling to pick up a flower, moonlit Prague, cobblestones, lanterns' },
  jewish_ruth_naomi: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🤝', accent: '#f59e0b', prompt: 'Two women walking together on a road at sunset, young and elderly, warm golden light' },
  jewish_apple_tree_road: { gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #ef4444 100%)', icon: '🍎', accent: '#ef4444', prompt: 'A boy planting an apple sapling at a road end, golden sunset, green hills, hope' },
  jewish_dreidel_spun: { gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #fbbf24 100%)', icon: '🪩', accent: '#fbbf24', prompt: 'A dreidel spinning on a table, Hanukkah candlelight, warm golden glow, cozy winter' },
  jewish_elijah_chair: { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)', icon: '🪑', accent: '#fbbf24', prompt: 'A Passover table with empty chair and place setting, candlelight, family, door open' },
  jewish_box_beautiful_words: { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #f0a500 100%)', icon: '📦', accent: '#f0a500', prompt: 'A wooden box with glowing folded papers, child hands reaching, warm lamplight, cozy' },
  jewish_shabbat_candles: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 100%)', icon: '🕯️', accent: '#f59e0b', prompt: 'Two Shabbat candles with challah and wine, woman blessing, warm family atmosphere' },
  jewish_vineyard_kindness: { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #c4b5fd 100%)', icon: '🍇', accent: '#8b5cf6', prompt: 'A vineyard owner offering grapes to travellers, golden light, rolling hills, generous' },
  jewish_hanukkah_flame: { gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #fbbf24 100%)', icon: '🕎', accent: '#fbbf24', prompt: 'A menorah with one candle lit by a window, snow outside, warm glow, deep blue night' },
};

// Tradition-level art (for tradition badges/headers)
const TRADITION_ART = {
  hindu: {
    gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff9500 100%)',
    color: '#f97316',
  },
  muslim: {
    gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    color: '#10b981',
  },
  christian: {
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    color: '#3b82f6',
  },
  sikh: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    color: '#f59e0b',
  },
  buddhist: {
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
    color: '#ef4444',
  },
  jain: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
    color: '#6366f1',
  },
  jewish: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #60a5fa 100%)',
    color: '#60a5fa',
  },
  indigenous: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 50%, #8B4513 100%)',
    color: '#2d5a3f',
  },
};

// Colorful fallback gradients for collection stories
const COLLECTION_GRADIENTS = {
  col_loyal: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fcd34d 100%)',
  col_lost: 'linear-gradient(135deg, #9a3412 0%, #f97316 50%, #fed7aa 100%)',
  col_brave: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #93c5fd 100%)',
  col_parrot: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #6ee7b7 100%)',
  col_elephant: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  col_turtle: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
  col_fire: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fca5a5 100%)',
  col_bicycle: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #bfdbfe 100%)',
  col_train: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c4b5fd 100%)',
  col_ambulance: 'linear-gradient(135deg, #166534 0%, #22c55e 50%, #86efac 100%)',
  col_rocket: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #a5b4fc 100%)',
  col_school: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #fde68a 100%)',
  col_invisible: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #c7d2fe 100%)',
  col_kindness: 'linear-gradient(135deg, #78350f 0%, #f0a500 50%, #fcd34d 100%)',
  col_truth: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 50%, #7dd3fc 100%)',
  col_patience: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #ddd6fe 100%)',
  col_empathy: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fbcfe8 100%)',
  col_forgiveness: 'linear-gradient(135deg, #064e3b 0%, #14b8a6 50%, #99f6e4 100%)',
  col_lion: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
  col_ant: 'linear-gradient(135deg, #166534 0%, #4ade80 50%, #bbf7d0 100%)',
  col_tortoise: 'linear-gradient(135deg, #1e3a5f 0%, #0891b2 50%, #67e8f9 100%)',
  col_sun: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fef3c7 100%)',
  col_brain: 'linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #e9d5ff 100%)',
  col_ocean: 'linear-gradient(135deg, #1e3a5f 0%, #0284c7 50%, #7dd3fc 100%)',
  col_cricket: 'linear-gradient(135deg, #166534 0%, #16a34a 50%, #86efac 100%)',
  col_swimmer: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #93c5fd 100%)',
  col_soccer: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #6ee7b7 100%)',
  col_fair: 'linear-gradient(135deg, #92400e 0%, #ea580c 50%, #fed7aa 100%)',
  col_basketball: 'linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #fdba74 100%)',
  col_marathon: 'linear-gradient(135deg, #4c1d95 0%, #9333ea 50%, #d8b4fe 100%)',
  col_grandpa: 'linear-gradient(135deg, #422006 0%, #78350f 50%, #fbbf24 100%)',
  col_new_sibling: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #f9a8d4 100%)',
  col_moms: 'linear-gradient(135deg, #be123c 0%, #f43f5e 50%, #fda4af 100%)',
  col_dads: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #93c5fd 100%)',
  col_grandma: 'linear-gradient(135deg, #78350f 0%, #a16207 50%, #fde68a 100%)',
  col_family: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #ddd6fe 100%)',
  col_moon: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #c4b5fd 100%)',
  col_mars: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #fca5a5 100%)',
  col_saturn: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fef3c7 100%)',
  col_pluto: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #cbd5e1 100%)',
  col_earth: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #6ee7b7 100%)',
  col_shooting: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #fbbf24 100%)',
  col_japan: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fce7f3 100%)',
  col_canada: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fecaca 100%)',
  col_india: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fef3c7 100%)',
  col_egypt: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fcd34d 100%)',
  col_brazil: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #6ee7b7 100%)',
  col_toronto: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #fca5a5 100%)',
};

// Generic bedtime/storytelling images — used when no cover image exists
const GENERIC_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop&q=80', // open book with warm light
  'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&h=600&fit=crop&q=80', // book pages glowing
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&q=80', // stack of books warm tone
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80', // cozy reading nook
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=600&fit=crop&q=80', // fairy lights and books
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80', // book open in nature
];

export function getGenericStoryImage(storyId) {
  // Deterministic pick based on story ID so same story always gets same image
  const hash = (storyId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return GENERIC_STORY_IMAGES[hash % GENERIC_STORY_IMAGES.length];
}

export function getStoryArt(lessonId) {
  if (STORY_ART[lessonId]) return STORY_ART[lessonId];

  // Collection story fallback — match by prefix
  if (lessonId?.startsWith('col_')) {
    const prefix = lessonId.split('_').slice(0, 2).join('_');
    const gradient = COLLECTION_GRADIENTS[prefix] || COLLECTION_GRADIENTS[lessonId] || 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #f0a500 100%)';
    return { gradient, icon: '✨', accent: '#f0a500' };
  }

  return {
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #f0a500 100%)',
    icon: '✨',
    accent: '#f0a500',
  };
}

export function getTraditionArt(traditionKey) {
  return TRADITION_ART[traditionKey] || {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #f0a500 100%)',
    color: '#f0a500',
  };
}
