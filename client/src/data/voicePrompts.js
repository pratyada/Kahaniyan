// Voice prompts for kid recordings — optional voice clips woven into stories.
// Each episode has 3 prompts. Kid records a short clip for each.
// If no recording exists, the story plays normally (narrator only).

export const VOICE_PROMPTS = {
  'rk_ep1_canoe': {
    seriesId: 'rainbow-kindergarten-jlps-yr25-26',
    episodeTitle: 'Shapes at Canoe Landing',
    prompts: [
      {
        id: 'shape_found',
        label: 'What shape did you find at the park?',
        hint: 'Say it loud! Like "Hexagons!" or "Triangles everywhere!"',
        emoji: '🔷',
        maxSeconds: 5,
        // Timestamp in narrator audio where this clip plays (seconds)
        // Will be set once narrator audio is segmented
        insertAfterText: 'We\'re going on a shape hunt!',
      },
      {
        id: 'favourite_spot',
        label: 'What was your favourite spot at Canoe Landing?',
        hint: 'The climbing frame? The boardwalk? The big canoe?',
        emoji: '🏞️',
        maxSeconds: 8,
        insertAfterText: 'Shapes are everywhere!',
      },
      {
        id: 'cn_tower',
        label: 'What shape is the CN Tower?',
        hint: 'Tell us what you think!',
        emoji: '🗼',
        maxSeconds: 5,
        insertAfterText: 'What shape is that, Mr. Zak?',
      },
    ],
  },
  'rk_ep2_concert': {
    seriesId: 'rainbow-kindergarten-jlps-yr25-26',
    episodeTitle: 'What a Wonderful World',
    prompts: [
      {
        id: 'song_line',
        label: 'Sing your favourite line from the song!',
        hint: '"I see trees of green..." or "What a wonderful world!"',
        emoji: '🎵',
        maxSeconds: 8,
        insertAfterText: 'What a Wonderful World',
      },
      {
        id: 'feeling',
        label: 'How did you feel before going on stage?',
        hint: 'Nervous? Excited? Brave? Tell us!',
        emoji: '💓',
        maxSeconds: 6,
        insertAfterText: 'I\'m nervous',
      },
      {
        id: 'after_concert',
        label: 'What did you say to your mummy/daddy after?',
        hint: 'What was the first thing you told them?',
        emoji: '🤗',
        maxSeconds: 8,
        insertAfterText: 'You were wonderful',
      },
    ],
  },
  'rk_ep3_brickworks': {
    seriesId: 'rainbow-kindergarten-jlps-yr25-26',
    episodeTitle: 'The Field Trip to Brick Works',
    prompts: [
      {
        id: 'animal_seen',
        label: 'What animal did you see at Brick Works?',
        hint: '"Turtles!" or "Bats!" or "Dragonflies!"',
        emoji: '🐢',
        maxSeconds: 5,
        insertAfterText: 'Evergreen Brick Works',
      },
      {
        id: 'turtle_touch',
        label: 'What did the turtle feel like?',
        hint: 'Hard? Smooth? Warm? Bumpy?',
        emoji: '✋',
        maxSeconds: 6,
        insertAfterText: 'touched a TURTLE',
      },
      {
        id: 'bus_memory',
        label: 'What do you remember about the school bus?',
        hint: 'Was it bouncy? Loud? Fun?',
        emoji: '🚌',
        maxSeconds: 6,
        insertAfterText: 'yellow school bus',
      },
    ],
  },
};

// Check if an episode has voice prompts
export const hasVoicePrompts = (episodeId) => !!VOICE_PROMPTS[episodeId];

// Get prompts for an episode
export const getVoicePrompts = (episodeId) => VOICE_PROMPTS[episodeId] || null;
