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
};

// Get prompt for a story (with style prefix)
export function getStoryPrompt(storyId, style = 'thumbnail') {
  const scene = STORY_PROMPTS[storyId];
  if (!scene) return `${STYLES[style]}. Scene: A magical bedtime story illustration with warm golden light`;
  return buildPrompt(scene, style);
}
