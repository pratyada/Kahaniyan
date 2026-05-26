// Standardized image prompt framework for My Sleepy Tale.
// Ensures visual consistency across all story thumbnails, blog images,
// share cards, and marketing content.

// Master style prefix — appended to EVERY image prompt
export const STYLE_PREFIX = 'Digital children\'s storybook illustration, soft watercolor textures, warm golden hour lighting, rounded gentle shapes, cozy bedtime palette with deep purples and warm ambers, age-appropriate and inviting, Pixar-meets-Ghibli warmth, no text on image, 16:9 aspect ratio';

// Style variants for different contexts
export const STYLES = {
  thumbnail: `${STYLE_PREFIX}, close-up scene, single focal point, vibrant but soft colors, suitable as a story cover`,
  blog: `${STYLE_PREFIX}, wide landscape composition, atmospheric, editorial quality, room for text overlay on left side`,
  share: `${STYLE_PREFIX}, portrait 9:16 ratio, dramatic lighting, bold composition, Instagram-story style`,
  marketing: `${STYLE_PREFIX}, clean composition, brand-friendly, warm gold and deep navy palette, professional but playful`,
};

// Generate a complete prompt from a scene description
export function buildPrompt(scene, style = 'thumbnail') {
  const prefix = STYLES[style] || STYLES.thumbnail;
  return `${prefix}. Scene: ${scene}`;
}

// All 99 story prompts — standardized for visual consistency
export const STORY_PROMPTS = {
  // ══════ WISDOM STORIES ══════
  krishna_squirrel: 'A tiny illustrated squirrel lovingly carrying a single grain of rice near a silver river at sunset, a gentle boy with a peacock feather crown softly petting its back, lush Indian village with temple spires in the background, fireflies glowing',
  prophet_camel: 'A kind bearded man in flowing white robes gently stroking the ears of a tall brown camel in a moonlit garden, palm trees and stars above, ancient Middle Eastern architecture, warm amber lantern light, peaceful and tender moment',
  jesus_birds: 'A gentle figure sitting cross-legged in a wildflower meadow with dozens of small brown birds perched on his hands and shoulders, soft lavender sunset sky, rolling green hills, one bird mid-flight approaching his open palm',
  buddha_swan: 'A young prince in golden robes carefully cradling a wounded white swan near a lotus pond, bamboo forest behind, golden sunlight filtering through leaves, dewdrops on lotus petals, compassion on the prince\'s face',
  guru_nanak_grain: 'A wise bearded man in a white turban kneeling in a golden wheat field sharing grain with villagers, warm sunset painting everything amber, a simple wooden cart nearby, Punjab countryside with mustard flowers',
  mahavir_ant: 'A gentle barefoot prince tiptoeing carefully over a line of tiny ants on a forest path, lush green jungle with dappled sunlight, butterflies and dragonflies in the air, the prince looking down with tender concern',
  jewish_noah: 'A large wooden ark floating on calm indigo waters under a magnificent double rainbow, pairs of illustrated animals — elephants, giraffes, doves — on the deck, fluffy clouds parting to reveal golden sunlight',
  sikh_water_carrier: 'A brave turbaned warrior kneeling beside a fallen soldier on a dusty battlefield, offering water from a leather pouch, golden sunset behind, compassion overcoming conflict, warm amber and dusty tones',
  hanuman_mountain: 'A powerful illustrated monkey warrior flying through dramatic orange and purple clouds carrying an entire mountain peak covered in glowing blue herbs, stars visible in the sky, epic and majestic scale',
  ram_golden_deer: 'A magical golden deer with shimmering crystal antlers leaping through a moonlit Indian forest, a noble prince watching from behind ancient banyan trees, fireflies and starlight, enchanted atmosphere',
  akbar_birbal_well: 'A clever smiling minister in a Mughal turban standing beside an ornate palace well, gesturing cleverly while an amused emperor watches from a carved marble balcony, warm lamplight, intricate Indian architecture',
  panchatantra_monkey_crocodile: 'A clever brown monkey sitting high on a fruit-laden mango tree branch, chatting with a friendly crocodile in the river below, tropical jungle backdrop, colorful parrots, warm afternoon light through canopy',
  panchatantra_crow_pitcher: 'A clever glossy black crow carefully dropping a smooth pebble into a clay water pitcher, water level rising, warm dusty village courtyard with terracotta pots, afternoon golden light, determination in the crow\'s eye',
  krishna_govardhan: 'A small blue-skinned boy cheerfully lifting an enormous green mountain on his little finger like an umbrella, villagers and decorated cows sheltering underneath from dramatic rain, rainbow forming in the background',
  akbar_birbal_lines: 'A clever minister in an ornate Mughal court drawing a long line on a marble floor next to a shorter one, the emperor leaning forward surprised, courtiers watching, ornate pillars and lanterns',
  ganesha_mouse: 'A gentle elephant-headed deity with a golden crown bending down warmly to speak with a tiny brown mouse, ornate Indian temple backdrop with oil lamps and flowers, warm sunset glow through carved stone windows',
  hindu_cow_sage: 'An old white-bearded sage in a forest hermitage gently bandaging the leg of a spotted deer by warm firelight, lush green forest clearing, clay hut with smoke rising, compassionate tender scene',
  krishna_butter: 'A mischievous illustrated blue-skinned toddler with butter smeared on his cheeks grinning up at his loving mother who pretends to scold him, cozy Indian village kitchen with hanging clay pots, warm golden lamplight',
  harishchandra_promise: 'A noble king in torn clothes walking away from a magnificent golden palace into a dramatic sunset, head held high with dignity, orange and purple sky, silhouette of the palace behind, sacrifice and honor',
  yudhishthira_half_truth: 'A golden war chariot slowly sinking to touch the ground on a vast battlefield, a crowned warrior looking down with profound sorrow, dramatic golden light cutting through dust clouds, epic Indian mythology scene',
  sudama_poha: 'A humble man in simple clothes nervously offering a tiny cloth bundle of rice to a magnificent king on a golden throne, the king rising to embrace him with tears of joy, ornate palace hall with oil lamps',
  draupadi_akshaya_patra: 'A graceful woman in a silk sari serving steaming food from a magical golden vessel in a forest clearing to hundreds of seated people, warm light radiating from the vessel, abundance from simplicity',
  karna_golden_armour: 'A muscular warrior standing in dramatic sunset light, peeling radiant golden armour from his own chest to offer to a disguised elder, the armour glowing like molten gold, sacrifice and honor',
  ram_shabari_berries: 'An elderly tribal woman with a wrinkled kind face offering small purple berries on a leaf plate to a noble prince who eats them with genuine joy, simple forest hut, warm firelight, devotion',
  hanuman_chest: 'A powerful monkey warrior dramatically tearing open his chest to reveal a glowing divine couple inside his heart, royal court gasping in wonder, golden light radiating outward, epic devotion scene',
  shiva_kannappa: 'A tribal hunter in the dark forest offering his own eye to a sacred stone linga, divine light suddenly appearing, raw devotion, southern Indian temple forest with ancient trees and moss',
  ram_vibhishana: 'A noble prince warmly embracing a trembling man who kneels before him while armored warriors watch in surprise, golden sunset light, Ramayana epic scene, compassion overcoming suspicion',
  sage_scorpion: 'An old sage sitting by a peaceful river at sunset, gently lifting a black scorpion from the water with his bare weathered hand, golden reflections on water, serene Indian riverside with banyan trees',
  krishna_hundred_chances: 'A serene blue-skinned figure standing perfectly calm in a grand royal court as an angry red-faced king shouts and gestures wildly, patience personified, dramatic contrast of calm and fury',
  prophet_ant_hill: 'A kind figure in white robes carefully moving a small campfire away from a tiny ant hill in the golden desert, baby ants being carried to safety by worker ants, warm sunset, palm trees silhouetted',
  prophet_thirsty_dog: 'A compassionate woman in the desert removing her shoe to fill it with water from a deep well for a panting thirsty dog, warm sunset casting long shadows, palm trees, empathy in action',
  good_samaritan: 'A kind traveler kneeling on a dusty road to bandage the wounds of a fallen stranger, a patient donkey waiting nearby, warm sunset light over Biblical hills and olive trees, compassion to strangers',
  jesus_mustard_seed: 'A tiny glowing golden seed in an open palm magically growing into an enormous spreading tree with birds nesting in its branches, time-lapse transformation effect, warm magical light, wonder',
  buddha_elephant: 'A peaceful orange-robed monk standing perfectly still as a massive decorated elephant bows its great head gently before him, ancient Indian city gates in background, golden afternoon light, serenity',
  buddha_rice_bowl: 'A young village girl in a simple dress offering a golden bowl of rice to a thin peaceful man meditating under an enormous bodhi tree, morning mist, lotus flowers in a pond nearby, gentle reverence',
  jain_true_wealth: 'A wealthy merchant in silk robes humbly removing his ornate turban and placing it at the feet of a simple smiling monk sitting under a spreading tree, golden light, transformation from pride to peace',
  jain_spider_web: 'A delicate spider spinning a magnificent glowing web across a dark cave entrance, each strand catching moonlight like silver threads, a wide-eyed king watching in wonder from inside the cave, patience',
  jewish_one_good_deed: 'A young boy at a wooden table carefully piecing together a torn world map, each connected piece glowing with warm light, cozy study room with candles and old books, discovery and repair',
  jewish_two_pockets: 'A wise old rabbi with twinkling eyes and a kind smile holding two small glowing pieces of paper, one in each weathered hand, starry night sky visible through a window, candlelight on his face',
  sikh_langar: 'A young Sikh boy in a small turban proudly serving golden dal from a large pot to people of all backgrounds sitting cross-legged together on the floor, warm steam rising, Golden Temple kitchen glow',
  universal_lighthouse_keeper: 'A tiny white lighthouse on a rocky island at night, its golden beam cutting through wild storm clouds and crashing waves, a small boat in the distance following the light to safety, dramatic',
  universal_garden_of_mistakes: 'A magical garden where bright orange flowers instantly bloom wherever a young girl steps on the soil, each footprint becoming a flower, enchanted garden at golden sunset, wonder and growth',
  universal_invisible_boy: 'A lonely illustrated boy sitting on a park bench in the rain, wrapping his own jacket around a small shivering stray puppy, warm lamppost light creating a golden circle around them, compassion',
  universal_patience_river: 'A tiny silver stream of water patiently carving through a massive red cliff face over centuries, creating a stunning canyon, golden sunlight streaming through the narrow gap, persistence rewarded',
  universal_sharing_blanket: 'An elderly woman by a small fire in a snowy mountain village tearing her starry blue blanket in half to share with a shivering young traveler, snowflakes falling, warmth despite the cold',
  universal_respect_old_tree: 'A small girl hugging an enormous ancient oak tree in a village square, birds nesting in its massive branches, dappled golden sunlight through leaves, community of people gathered around, respect',
  universal_forgiveness_kite: 'A boy on a hilltop opening his hand to release a colorful kite string, the kite soaring free into a magnificent orange and purple sunset sky, feeling of release and peace, letting go',
  universal_wisdom_two_wolves: 'A grandmother and grandchild sitting by a glowing stone fireplace, two translucent wolf spirits — one golden, one shadow — facing each other in the flames above, wisdom being passed down',
  universal_humility_mountain: 'A proud snow-capped mountain looking down at a small green hill completely covered in wildflowers and playing children, clouds between them, contrast between cold grandeur and warm joy, humility',
  universal_bravery_first_step: 'A small girl in pajamas taking her first brave step down dark wooden stairs, holding the bannister tightly, a tiny warm golden candle glow visible at the bottom, courage in the dark',
  mothers_day_toronto: 'A child joyfully handing a bright yellow tulip to their smiling mother on a sunny bench by Toronto waterfront, CN Tower in soft background, cherry blossoms, spring sunshine, heartwarming love',

  // ══════ COLLECTION STORIES ══════
  col_loyal_dog: 'A golden retriever sitting patiently at a school gate in autumn, fallen leaves around, looking down the empty road waiting, warm afternoon light, loyalty and devotion, children\'s book style',
  col_lost_kitten: 'A tiny orange kitten shivering behind a grocery store in the rain, a kind girl\'s hand reaching down with a warm lunch box, puddle reflections, compassion, soft watercolor style',
  col_brave_rabbit: 'A small white rabbit running bravely through dark moonlit woods carrying a tiny baby bunny by the scruff, a fox shadow in the background, courage despite fear, soft dramatic lighting',
  col_parrot_truth: 'A bright green parrot on a perch in a colorful Indian market stall surrounded by mangoes, the parrot squawking honestly while the shopkeeper looks surprised, funny and warm scene',
  col_elephant_memory: 'A young elephant walking through misty green hills, following a memory of a small bird friend, birdsong notes visible as golden sparkles leading the way, determination and love',
  col_turtle_shell: 'A friendly old turtle with a cozy shell sheltering a tiny mouse, a ladybug, and a caterpillar from a dramatic rainstorm, warm light inside the shell, generosity despite discomfort',
  col_fire_truck: 'A shiny red fire truck with a nervous face approaching a building with orange flames, the truck trembling but moving forward, other trucks cheering from behind, courage despite fear',
  col_bicycle_race: 'A rusty old bicycle with a happy face carrying groceries and a child to school, while shiny racing bikes watch from a showroom, value through service not speed, warm neighborhood scene',
  col_train_patience: 'A sleek express train stopped on mountain tracks, waiting patiently for a stubborn cow on the rails, beautiful mountain scenery, sunset, patience versus speed, humorous and gentle',
  col_ambulance: 'A white ambulance with a kind face radioing for help at night, a fire truck and police car rushing to assist in different directions, teamwork in the city, warm emergency lights',
  col_rocket_dream: 'A shiny rocket on a launch pad trembling nervously, looking up at the enormous starry sky, a small girl whispering encouragement to it, overcoming fear of the unknown, dreamy night scene',
  col_school_bus: 'A cheerful yellow school bus driving over a bump, lunch boxes and kids bouncing and laughing inside, friendships being made through shared chaos, warm morning light, joyful community',
  col_invisible_hero: 'A translucent invisible girl quietly sitting next to a lonely boy at a school lunch table, her presence making him smile without knowing why, warm cafeteria light, gentle heroism',
  col_kindness_cape: 'A young Indian boy with golden threads weaving into a glowing cape behind him as he shares his lunch with a classmate, each kind act adding a thread, warm school playground',
  col_truth_shield: 'A young superhero holding a glowing blue shield that pulses brighter with each truth spoken, standing firm in front of friends, the shield radiating protective light, integrity',
  col_patience_power: 'The slowest superhero sitting calmly while chaos swirls around — other heroes rushing and crashing — waiting for the perfect moment, zen-like patience in costume, humorous contrast',
  col_empathy_girl: 'A girl with visible golden waves connecting her heart to the hearts of everyone around her — each person\'s emotion shown as a soft color aura, empathy as a visible superpower',
  col_forgiveness_hero: 'A female superhero dissolving heavy iron chains thrown at her by touching them, each chain turning into golden butterflies and flying away, forgiveness as power, dramatic transformation',
  col_lion_vs_eagle: 'A majestic lion and a proud eagle facing each other respectfully on a cliff edge between land and sky, neither fighting — just acknowledging each other\'s kingdom, mutual respect',
  col_ant_vs_elephant: 'A tiny determined ant carrying a leaf ten times its size walking past a massive elephant who watches in amazement, size versus strength, humorous scale comparison, warm savanna',
  col_tortoise_vs_hare: 'A hare stopped mid-race to help a baby fox caught in thorns, while the tortoise walks past toward the finish line, choosing kindness over winning, forest racing path',
  col_sun_vs_wind: 'A warm smiling sun gently shining on a traveler who removes his coat happily, while a frustrated wind blows clouds angrily in the background, gentleness versus force, dramatic sky',
  col_brain_vs_muscle: 'A thoughtful figure with a glowing brain building a lever next to a muscular figure pushing a boulder, both needed to solve the problem, teamwork of mind and body, warm village',
  col_ocean_vs_mountain: 'A vast blue ocean and a towering snow mountain facing each other with a small river connecting them, showing their interdependence, epic landscape, golden hour, harmony in nature',
  col_cricket_team: 'Eleven diverse kids standing proudly on a rocky field they cleared by hand over months, holding homemade cricket bats, their first pitch visible behind them, dawn light, determination',
  col_swimmer: 'A small determined girl swimming against a visible current in a pool, water splashing dramatically, other swimmers watching, third-place ribbon waiting at the end, persistence and grit',
  col_soccer_share: 'A boy mid-kick choosing to pass the soccer ball to a wide-open surprised teammate instead of shooting at an empty goal, stadium lights, selfless teamwork moment, freeze-frame action',
  col_fair_play: 'Two boys crossing a running race finish line together — one helping the other who fell — the crowd standing in the background giving a standing ovation, sportsmanship, golden afternoon',
  col_basketball_short: 'The shortest kid on a basketball team dribbling lightning-fast between tall players, passing the ball perfectly to a teammate for a score, speed as strength, dynamic court scene',
  col_marathon: 'A woman running alone on a long empty road at sunset, thirty strangers gradually joining to run alongside her, the last runner finishing together, community and persistence, dramatic light',
  col_grandpa_wisdom: 'An elderly grandfather in a small balcony garden with three pots and a plastic chair, a grandchild listening intently, city skyline behind, golden evening light, wisdom passing between generations',
  col_new_sibling: 'A young child tentatively holding a tiny baby\'s hand for the first time, the baby gripping one finger, both looking at each other with wonder, soft nursery light, new bond forming',
  col_moms_hands: 'A close-up of a mother\'s weathered hands — cooking, bandaging a knee, holding a small hand, buttoning a coat — in a soft montage style, warm golden light, love through action',
  col_dads_promise: 'A father in office clothes running through city streets at dusk, tie flying behind him, rushing to keep a promise to be at his child\'s school play, determination and love, urban scene',
  col_grandma_stories: 'An elderly Indian grandmother on a video call screen, her warm crinkly eyes filling the phone display while a child in Canada presses the phone to their ear, bridge between worlds, love across distance',
  col_family_meal: 'A whole family crowded in a small kitchen making biryani together — everyone bumping elbows, stirring pots, laughing — steam and warm spice colors filling the air, forgiveness through togetherness',
  col_moon_lonely: 'A luminous full moon looking down at Earth through wispy clouds, billions of tiny warm window lights visible on the planet below, the moon realizing it is watched and loved, cosmic loneliness healed',
  col_mars_red: 'A brave red planet standing alone facing an intense sun while other planets hide behind Jupiter, the surface transforming from blue to red, courage and transformation, dramatic space scene',
  col_saturn_rings: 'A lonely ringed planet welcoming broken pieces of a comet into its orbit, the fragments becoming beautiful glittering rings, generosity creating beauty, deep space with stars, warm palette',
  col_pluto_small: 'A tiny blue planet at the dark edge of the solar system with an enormous heart-shaped glacier visible on its surface, a NASA spacecraft approaching, smallness with big heart, touching',
  col_earth_gift: 'Planet Earth at the center of a circle of other planets, showing its blue oceans, green forests, and tiny visible lights of cities, the only planet with life, special and fragile, cosmic view',
  col_shooting_star: 'A small rock burning brilliantly as it falls through Earth\'s atmosphere, leaving a golden trail across the night sky, a child below making a wish, beauty in struggle, hope in the dark',
  col_japan_cherry: 'A small Japanese girl sitting peacefully under a blooming cherry blossom tree, pink petals falling like snow around her, Mount Fuji barely visible in the misty background, transient beauty',
  col_canada_maple: 'A bright red maple leaf on a Canadian flag gently being placed by First Nations and settler hands together, golden maple syrup dripping warmly, sharing as nation-building, autumn forest',
  col_india_river: 'Two children on opposite sides of a dry riverbed in Rajasthan, leaving small gifts for each other — a painted stone, a paper bird — connection across distance, warm desert sunset',
  col_egypt_pyramid: 'A tiny humble pyramid beside the enormous Great Pyramid of Giza, the small one with an open door glowing with warm light inside, size versus soul, dramatic desert sunset, humility',
  col_brazil_rainforest: 'An enormous ancient tree in the Amazon whose roots glow blue as they pull water from underground and release it as mist that becomes rain clouds above, the cycle of giving, magical realism',
  col_toronto_cn: 'The CN Tower soaring above Toronto skyline next to a tiny old brick house with warm light in its windows, tall versus old, new versus historic, Lake Ontario reflecting both, evening glow',

  // ══════ SERIES — DR. SPOCK SAYS ══════
  dsp_ep1_development: 'A warm kindly silver-haired doctor in a white coat sitting in a cozy living room armchair talking gently to a young parent, a preschool child playing with colorful blocks on the floor between them, soft lamp light, bookshelves with parenting books, warm golden atmosphere, trust and reassurance',
  dsp_ep2_ailments: 'A gentle doctor kneeling beside a cozy bed where a small child with a runny nose is tucked under a warm blanket, a cup of soup on the nightstand, soft tissues nearby, warm bedside lamp glowing amber, caring parent watching from doorway, comforting scene',
  dsp_ep3_firstaid: 'A kind doctor showing a parent how to put a bandage on a small child\'s scraped knee, the child sitting on a kitchen counter looking brave with a few tears, a small first aid kit open beside them, sunny kitchen with warm light, courage and care',
  dsp_ep4_behavior: 'A small child mid-tantrum on the floor of a cozy living room while a calm parent sits nearby at eye level with open arms, a kindly doctor figure observing with a gentle smile from an armchair, warm evening light, patience and love, soft watercolor style',
  dsp_ep5_special: 'A diverse group of children playing together in a sunny inclusive playground — one child in a small wheelchair, another with hearing aids, all laughing together, a gentle doctor figure watching proudly from a park bench, rainbow of abilities, warm golden light, joy and belonging',

  // ══════ SERIES — FIRE TRUCK ACADEMY ══════
  fta_ep1_afraid: 'A shiny red fire truck with trembling headlights racing alone through dark city streets at 3 AM toward a house with orange flames, a small girl clutching a stuffed bear visible in a second-floor window, sirens blazing blue and red against the night sky, fear turning into courage',
  fta_ep2_rescue: 'A bright red fire truck gently lowering a thin suction hose into a narrow storm drain on a rainy street, a tiny soaking wet orange kitten popping out of the hose into daylight, a crowd of cheering children with umbrellas, warm puddle reflections',
  fta_ep3_teamwork: 'Three fire trucks working in perfect formation at a school fire drill — one blasting a side window, one extending a ladder to the second floor, one positioned at the north side catching dummy children, all moving as one synchronized team, dramatic dawn light',
  fta_ep4_false_alarm: 'Four fire trucks parked outside a quiet shopping mall in bright noon sunlight, no smoke or flames anywhere, the trucks looking confused and deflated, a prankster kid peeking from behind a fire alarm pull handle, wasted sirens still echoing, frustration and lesson',
  fta_ep5_graduation: 'Four gleaming fire trucks lined up in a decorated fire station with streamers and bunting, a large chrome command truck pinning a small gold star above the headlights of a proud red engine, golden afternoon light streaming through the station bay doors, graduation ceremony',

  // ══════ SERIES — PANCHATANTRA TALES ══════
  pt_ep1_monkey: 'A clever brown monkey leaping from a crocodile\'s back onto a tall mango tree branch overhanging a silver river, the crocodile looking up with a foolish confused expression, ripe golden mangoes hanging from branches, warm tropical afternoon light through jungle canopy',
  pt_ep2_crow: 'A determined glossy black crow carefully dropping a smooth grey pebble into a tall clay pitcher in a dusty village courtyard, the water level inside visibly rising, a pile of small pebbles at the crow\'s feet, golden afternoon light, patience and persistence',
  pt_ep3_tortoise: 'A small green tortoise falling through the air above a patchwork of fields and villages after opening his mouth mid-flight, two geese flying above still holding a wooden stick between their beaks, the stick empty where the tortoise bit, dramatic sky, a haystack below',

  // ══════ SERIES — LIGHTNING WHEELS ══════
  lw_ep1_fastest: 'A shiny red race car with gold stripes stopped on a hill pushing a tiny struggling tricycle up the slope, flowers and sunset visible along the roadside, the race car looking genuinely happy for the first time, warm evening light, kindness over speed',
  lw_ep2_flat_tire: 'A tiny tricycle pedaling furiously down a neighbourhood street carrying a brand-new tire on its back, racing toward a deflated red race car with a flat front tire at a starting line, clocks showing urgency, warm morning light, the smallest friend saving the day',
  lw_ep3_last_race: 'A red race car screeching to a halt inches from a small puppy sitting in the middle of a race track, a shinier blue car zooming past toward a finish line in the background, the puppy safe on the red car\'s hood, crowd standing in ovation, golden sunset',

  // ══════ SERIES — ROCKET ADVENTURES (OLD) ══════
  ra_ep1_heights: 'A gleaming silver rocket trembling on a launchpad under a starry sky, a small girl at the fence below whispering encouragement, the rocket\'s engines just beginning to glow blue, clouds parting above revealing infinite stars, the moment before liftoff, courage',
  ra_ep2_moon: 'A shiny rocket sitting on grey lunar dust beside a small dusty rover with cracked solar panels, a spare battery glowing between them, Earth hanging as a tiny blue marble in the black sky above, two lonely machines becoming friends on the silent Moon',
  ra_ep3_home: 'A rocket and a small rover floating together through black space with no engine fire, drifting slowly toward a growing blue Earth, an orange heat shield beginning to glow, a parachute packed and ready, coming home slow and together, dramatic starfield',

  // ══════ SERIES — KINDNESS SQUAD ══════
  ks_ep1_cape: 'A young Indian boy on a school playground with glowing golden threads weaving themselves into a small cape on his back as he shares his sandwich with a classmate, each thread representing a kind act, warm school-day sunlight, magical realism',
  ks_ep2_feel: 'A girl with visible golden waves of empathy radiating from her chest sitting silently next to a lonely new student surrounded by a heavy grey fog, the golden waves slowly dissolving the grey, empty school cafeteria, warm afternoon light filtering through windows',
  ks_ep3_shield: 'A boy holding a blazing bright blue shield that pulses with white light, standing protectively in a school hallway, a bully stumbling backward blinded by the glow, a golden-caped boy and an empathy-glowing girl flanking him, The Kindness Squad united, dramatic corridor light',

  // ══════ SERIES — PLANET EXPLORERS ══════
  pe_ep1_moon: 'A luminous full moon with a gentle face looking down through wispy clouds at billions of tiny warm window lights on Earth below, the Sun whispering from the edge of the frame, the Moon realizing children look up at her every night, cosmic warmth and connection',
  pe_ep2_mars: 'A brave red planet standing alone facing a fierce blazing sun while other planets hide behind Jupiter in the background, the red surface cracked and scarred but standing tall, solar wind visibly stripping the atmosphere, courage and transformation in deep space',
  pe_ep3_pluto: 'A tiny blue planet at the dark edge of the solar system with an enormous heart-shaped white glacier glowing on its surface, a small NASA spacecraft approaching with camera flashing, the other planets watching in awe from far away, smallness with enormous heart',

  // ══════ SERIES — RAINBOW KINDERGARTEN ══════
  rk_ep1_canoe: 'Twenty small children with backpacks holding a buddy rope walking through Canoe Landing Park in Toronto hunting for shapes, one child pointing excitedly at a hexagonal bolt, the CN Tower rising in the soft background, sunny community walk, warm school-day light',
  rk_ep2_concert: 'Twenty kindergarten children wearing hand-painted Earth globe hats standing on a school stage with arms wide open singing, parents in the audience crying and standing, one hat crooked over a child\'s eyes, warm gym lights, pure joy and imperfection',
  rk_ep3_brickworks: 'A wide-eyed kindergartner reaching out one finger to gently touch the smooth dark green shell of a Midland Painted Turtle in a conservatory at Evergreen Brick Works, yellow and red markings visible on the shell, the turtle blinking slowly, wonder and gentleness',

  // ══════ SERIES — LITTLE ASTRONAUT ══════
  la_ep1_launch: 'A small child in a white-and-blue space suit climbing a metal ladder toward a silver rocket on a launchpad under a pre-dawn starry sky, a green GO button glowing inside the cockpit window above, the moment before the first adventure, courage and wonder',
  la_ep2_moon: 'A tiny astronaut sitting alone on a grey Moon rock with eyes closed, grey dust and craters stretching to the horizon, Earth as a small blue marble in the black sky, absolute silence, the child learning patience from four billion years of stillness',
  la_ep3_mars: 'A child astronaut kneeling in a clear greenhouse dome on the red Martian surface, carefully watering five small pots with a tiny watering can, one pot sprouting a mysterious golden-flowered tree, dim reddish Martian sunlight filtering through, wonder and nurture',
  la_ep4_saturn: 'A small rocket weaving gracefully between enormous chunks of glittering ice in Saturn\'s rings, the golden planet massive below, ice crystals catching starlight in silver and blue, the child astronaut visible through the cockpit window with wide eyes, cosmic beauty',
  la_ep5_home: 'A tiny astronaut standing on a rescue boat in the ocean looking up at the sky, the rocket bobbing nearby with parachute still draped, warm salty air and crying seabirds, Earth\'s blue sky enormous overhead after weeks in space, gratitude and homecoming',

  // ══════ SERIES — WHO WOULD WIN? ══════
  www_ep1_lion_eagle: 'A majestic golden-maned lion and a fierce eagle with six-foot wingspan standing respectfully facing each other on a cliff edge, a forest clearing full of watching animals below, Professor Puzzle with enormous spectacles at a chalkboard writing TEAMWORK, warm sunset',
  www_ep2_ant_elephant: 'A tiny determined ant standing on a microphone speaking to a stunned enormous elephant in a forest clearing, thousands of ants visible sealing a dam crack in the background, Professor Puzzle writing on his chalkboard, dramatic scale contrast, warm savanna light',
  www_ep3_sun_wind: 'A warm smiling golden sun gently shining down on a happy traveller removing his coat on a dusty road, while a frustrated grey wind blows angrily in the dark clouds above, Professor Puzzle watching from the clearing, gentleness defeating force, dramatic sky contrast',
  www_ep4_brain_muscle: 'A small grey owl perched atop a boulder that has split cleanly in two from ice in a crack, a massive gorilla sitting exhausted beside it staring in amazement, water still frozen in the crack, forest village path now open, Professor Puzzle writing on chalkboard, dawn light',
  www_ep5_ocean_mountain: 'A vast blue ocean and a towering snow-capped mountain facing each other with a small silver river connecting them, clouds carrying rain from ocean to mountain peak, Professor Puzzle standing small between them with a final chalkboard reading NOBODY, golden hour, harmony',

  // ══════ SERIES — CAMPING & OUTDOORS ══════
  co_ep1_setup: 'A family of three struggling to set up a lopsided tent in a pine forest clearing beside a still lake at sunset, poles going the wrong way, a child giggling while holding a pole, warm orange sky reflected in the mirror-like lake, imperfect and wonderful',
  co_ep2_night_sounds: 'A child lying wide-eyed in a sleeping bag inside a tent at night, an owl silhouetted on a branch outside visible through the tent fabric, moonlight filtering through trees, a loon calling across a dark lake, the forest alive with gentle mysterious sounds',
  co_ep3_river: 'A child mid-crossing in a rushing shallow river using a walking stick for balance, water splashing around their shins, slippery round stones visible underwater, parents on either bank reaching out, a hidden waterfall visible through trees on the far side, adventure and bravery',
  co_ep4_campfire: 'A family of three sitting on logs around a glowing campfire at night, orange sparks flying upward like fireflies into a star-filled sky, marshmallows on sticks, the child mid-story with animated hands, golden firelight on their faces, no phones anywhere',
  co_ep5_sunrise: 'Three small silhouetted figures standing on a rocky mountain summit at dawn, a spectacular orange and pink sunrise exploding across the horizon, the valley below with a tiny lopsided tent visible by a silver lake, hot chocolate cups steaming in their hands, gratitude',

  // ══════ SERIES — MUSIC LESSONS ══════
  ml_ep1_drum: 'A big red drum with brass edges playing alone in an empty music room, all other instruments silent in their cases, the drum looking confused and lonely, scattered sheet music on the floor, warm afternoon light through dusty windows, the cost of being too loud',
  ml_ep2_violin: 'A shy violin on a concert hall stage under a single spotlight, bow raised trembling before the first note of a solo, an entire orchestra sitting still and silent behind, a packed audience in shadow, the moment between fear and beauty, dramatic warm stage light',
  ml_ep3_piano: 'A piano keyboard seen from above with the black keys and white keys glowing different colours, an old woman\'s gentle hands bringing them together into a single chord, musical notes floating upward as golden light, harmony from difference, warm music room atmosphere',
  ml_ep4_singing: 'A tiny ukulele standing on a stool at the front of a music room singing with a small wobbly voice, a large trumpet and guitar watching in surprise from behind, old Cello crying a single low trembling note in the corner, honest simplicity winning over flashiness',
  ml_ep5_orchestra: 'An orchestra of illustrated instruments playing together in a children\'s hospital ward, a girl in a hospital bed smiling for the first time in days, warm golden sound waves visible in the air, IV stands and rainbow murals on walls, music as medicine, tender scene',

  // ══════ SERIES — WATER & SWIM ══════
  ws_ep1_splash: 'A small girl in a swimsuit standing at the edge of an enormous blue swimming pool, toes curled over the tiles, one toe tentatively dipping into the water, a kind swim coach sitting on the pool edge nearby with feet dangling in, warm community centre light, first step',
  ws_ep2_float: 'A girl floating on her back in a swimming pool with eyes closed and arms spread, the water holding her like a gentle hand, ceiling lights looking like blurry stars from underwater perspective, a peaceful expression replacing fear, warm aqua light, trust and surrender',
  ws_ep3_deep: 'A girl treading water in the dark deep end of a swimming pool, looking down into blue emptiness where the floor disappears, the red-and-white rope divider behind her, a coach swimming beside her, the moment of realizing she doesn\'t need the ground, blue-lit courage',
  ws_ep4_fish: 'A girl swimming in a sun-dappled green lake surrounded by a school of golden sunfish, their scales flashing in filtered sunlight, pine trees reflected in the water, a natural lakeshore with pebbles visible below, swimming with nature, magical and real',
  ws_ep5_lifeguard: 'An older girl sitting on the pool edge with feet in the water next to a scared new girl in a pink swimsuit with curled toes, the older girl offering her hand with a knowing smile, the pool stretching behind them, passing on courage, warm community centre glow',

  // ══════ SERIES — MATHS ADVENTURES ══════
  ma_ep1_garden: 'A boy standing amazed inside a magical garden where flowers grow in numbered rows — one giant sunflower, two red roses, three purple tulips — a cheerful ladybird with five spots on a leaf nearby, a green gate behind him, warm golden light, numbers everywhere in nature',
  ma_ep2_detective: 'A girl detective with a magnifying glass examining hexagonal stickers on a school hallway floor leading toward a playground, a notebook full of shape drawings in her other hand, twelve missing squares arranged in a grid visible in a sandbox through the window, mystery and maths',
  ma_ep3_pattern: 'Two children in a dusty library basement staring at a glowing brass-and-copper machine with gears and levers, the green screen displaying 2-4-6-8-?, golden marbles rolling out of a small drawer, warm mechanical glow, patterns as the language of the universe',
  ma_ep4_feast: 'A young girl carefully cutting a round cake into eight perfect equal slices at a crowded family dinner table, eight people waiting with plates, a rectangular pizza and bowl of strawberries also on the table, warm family kitchen light, fractions as fairness and love',
  ma_ep5_measure: 'A boy and his father measuring the shadow of an enormous oak tree in a sunny garden, the boy holding a tape measure along the tree\'s long shadow, rulers laid end-to-end nearby, a small snail trail being measured with a ruler, golden afternoon light, measuring the world',

  // ══════ SERIES — PLANETS & STARS ══════
  ps_ep1_moon: 'A silver Moon floating near the Sun, catching blazing light and reflecting it softly downward onto sleeping children visible through tiny windows on Earth below, the Moon glowing with pride, gentle silver moonbeams cutting through night clouds, sharing borrowed light',
  ps_ep2_mars: 'A cracked red planet with enormous Olympus Mons mountain and the vast Valles Marineris canyon scar visible, standing alone against a fierce solar wind with no atmosphere, other planets in the far background, scars worn like medals, courage and survival in deep space',
  ps_ep3_jupiter: 'An enormous orange-and-white striped planet with a shrinking Great Red Spot storm, tiny moons orbiting peacefully around it, Saturn floating nearby with golden rings offering gentle advice, the storm visibly smaller than before, patience and letting go, warm space palette',
  ps_ep4_saturn: 'A golden planet surrounded by billions of glittering ice and rock fragments forming magnificent rings, a small lonely asteroid drifting in to join the orbit, other broken comet pieces already circling peacefully, deep space background, generosity creating beauty from broken pieces',
  ps_ep5_pluto: 'A tiny blue-grey planet at the very edge of a dark solar system with a massive heart-shaped white glacier glowing on its surface, a small spacecraft named New Horizons flying close with cameras flashing, the other planets watching from billions of miles away, vindication and love',

  // ══════ SERIES — GEOMETRY & SHAPES ══════
  gs_ep1_circle: 'A smooth yellow circle rolling through Shapeville past streetlights casting circular pools of light, a full moon circle overhead, round clock tower in the background, all the cornered shapes watching from doorways, the circle realizing she is everywhere, warm night glow',
  gs_ep2_triangle: 'A small orange triangle bracing herself underneath a sagging library shelf full of heavy books, her three corners pressing perfectly into wall, shelf, and bookend, the shelf steady again, larger shapes watching in admiration, warm school library light, strength from three sides',
  gs_ep3_square: 'A blue square standing in front of an enormous mosaic mural made of thousands of tiny colourful square tiles forming a sunset over water, the square realizing he is the building block of all visible art, warm community centre wall, ordinariness becoming extraordinary',
  gs_ep4_hexagon: 'A peaceful purple hexagon standing beside a golden beehive on an apple tree branch, the honeycomb visible inside showing thousands of perfect hexagonal cells filled with golden honey, bees buzzing around, warm orchard light, nature\'s perfect patient geometry',
  gs_ep5_city: 'All the shapes of Shapeville working together to build a community centre — triangles forming the roof, squares making walls, circles as windows catching light, hexagons tiling the floor in blue and gold, beautiful open space inside, warm golden construction-day light, unity',

  // ══════ SERIES — ROCKET ADVENTURES (TEAM) ══════
  rat_ep1_build: 'Five diverse kids in a garage building a seven-foot silver-and-red rocket named HOPE-1, one welding fins, one drawing blueprints, one calculating on paper, one mapping stars, the smallest one asking a question, tools and parts scattered everywhere, warm garage workshop light',
  rat_ep2_launch: 'A silver-and-red homemade rocket lifting off from a makeshift launchpad of cinder blocks behind a school, a column of white smoke exploding from the base, five kids and a crowd watching with open mouths, an orange parachute visible at the top, blue morning sky, liftoff moment',
  rat_ep3_asteroid: 'Five kid astronauts inside a spacecraft cockpit staring at a car-sized asteroid tumbling toward them through the window, one child pressing a cargo bay eject button, scientific equipment launching into the void toward the asteroid, tension and sacrifice, dramatic space lighting',
  rat_ep4_station: 'Five kid astronauts floating in the cupola window of the International Space Station with a Japanese commander, Earth glowing enormous and blue below them, solar panel wings visible outside, floating tortillas and equipment around them, wonder and weightlessness',
  rat_ep5_landing: 'A small child astronaut walking down a hill on an alien planet with blue-green grass toward a small shimmering alien figure holding a glowing orb, two moons in a purple sky, dome-shaped dwellings in a spiral valley behind, hands open in peace, first contact, golden alien sunset',
};

// Get prompt for a story (with style prefix)
export function getStoryPrompt(storyId, style = 'thumbnail') {
  const scene = STORY_PROMPTS[storyId];
  if (!scene) return `${STYLES[style]}. Scene: A magical bedtime story illustration with warm golden light`;
  return buildPrompt(scene, style);
}
