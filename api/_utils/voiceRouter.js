// Smart voice routing — picks the best ElevenLabs voice based on
// country, belief, language, and narrator role.
//
// The goal: an Indian Hindu family hears warm Indian-accented narration.
// A British Christian family hears British narration. An Arab Muslim
// family hears Arabic-accented narration. Every family hears a voice
// that sounds like HOME.

// Available voices mapped by accent region
const VOICES = {
  // Indian / South Asian
  // Note: Muskaan (professional voice) requires paid ElevenLabs plan.
  // Using warm premade voices that work on free tier, with multilingual
  // model for Hindi/Tamil which adds natural Indian accent.
  indian: {
    narrator:   { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', accent: 'british', gender: 'female' },   // warm, velvety — great for Indian stories with multilingual model
    mummy:      { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', accent: 'american', gender: 'female' },
    daddy:      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', accent: 'british', gender: 'male' },
    grandfather:{ id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', accent: 'american', gender: 'male' },
    grandmother:{ id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', accent: 'british', gender: 'female' },
  },

  // British
  british: {
    narrator:   { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', accent: 'british', gender: 'male' },
    mummy:      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', accent: 'british', gender: 'female' },
    daddy:      { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', accent: 'british', gender: 'male' },
    grandfather:{ id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', accent: 'british', gender: 'male' },
    grandmother:{ id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', accent: 'british', gender: 'female' },
  },

  // American / Canadian / Western default
  western: {
    narrator:   { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', accent: 'american', gender: 'male' },
    mummy:      { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', accent: 'american', gender: 'female' },
    daddy:      { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', accent: 'american', gender: 'male' },
    grandfather:{ id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', accent: 'american', gender: 'male' },
    grandmother:{ id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', accent: 'american', gender: 'female' },
  },

  // Arabic / Middle Eastern
  // Note: Matthew (professional voice) requires paid ElevenLabs plan.
  // Using premade voices with multilingual model for Arabic accent.
  arabic: {
    narrator:   { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', accent: 'british', gender: 'male' },
    mummy:      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', accent: 'american', gender: 'female' },
    daddy:      { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', accent: 'british', gender: 'male' },
    grandfather:{ id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', accent: 'american', gender: 'male' },
    grandmother:{ id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', accent: 'american', gender: 'female' },
  },

  // Australian
  australian: {
    narrator:   { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', accent: 'australian', gender: 'male' },
    mummy:      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', accent: 'british', gender: 'female' },
    daddy:      { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', accent: 'australian', gender: 'male' },
    grandfather:{ id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', accent: 'american', gender: 'male' },
    grandmother:{ id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', accent: 'british', gender: 'female' },
  },
};

// Country → accent region mapping
const COUNTRY_TO_REGION = {
  IN: 'indian',
  GB: 'british',
  US: 'western',
  CA: 'western',
  AU: 'australian',
  AE: 'arabic',
  SG: 'indian',    // large Indian diaspora
  OTHER: 'western', // safe default
};

// Belief can further refine — e.g. Muslim family in UK might prefer
// a warmer, less "BBC" voice. Hindu family in Canada still wants
// Indian-accented narration for bedtime stories.
const BELIEF_REGION_OVERRIDE = {
  hindu:    'indian',
  sikh:     'indian',
  jain:     'indian',
  buddhist: 'indian',   // South Asian Buddhist families
  muslim:   null,        // use country (could be Arab, South Asian, Western)
  christian: null,       // use country
  jewish:   null,        // use country
  secular:  null,        // use country
};

// Narrator name → role mapping
const NARRATOR_TO_ROLE = {
  'AI Narrator': 'narrator',
  'Mummy':       'mummy',
  'Daddy':       'daddy',
  'Dada ji':     'grandfather',
  'Nani ma':     'grandmother',
};

/**
 * Pick the best voice for this family.
 *
 * @param {string} narrator - "AI Narrator", "Mummy", "Daddy", "Dada ji", "Nani ma"
 * @param {string} country - "IN", "US", "GB", "AE", "CA", "AU", "SG", "OTHER"
 * @param {string[]} beliefs - ["hindu", "sikh"] etc.
 * @param {string} language - "English", "Hindi", "Tamil", "Arabic", "Spanish"
 * @param {string|null} customVoiceId - user's cloned voice (overrides everything)
 * @returns {{ voiceId: string, name: string, model: string }}
 */
export function routeVoice({ narrator, country, beliefs, language, customVoiceId }) {
  // 1. Custom cloned voice always wins
  if (customVoiceId) {
    const model = language === 'English' ? 'eleven_turbo_v2_5' : 'eleven_multilingual_v2';
    return { voiceId: customVoiceId, name: 'Custom', model };
  }

  // 2. Determine region from belief first, then country
  let region = 'western'; // safe default

  // Check if any belief overrides the country
  if (beliefs && beliefs.length > 0) {
    for (const b of beliefs) {
      const override = BELIEF_REGION_OVERRIDE[b];
      if (override) {
        region = override;
        break;
      }
    }
    // If no belief override, use country
    if (!BELIEF_REGION_OVERRIDE[beliefs[0]]) {
      region = COUNTRY_TO_REGION[country] || 'western';
    }
  } else {
    region = COUNTRY_TO_REGION[country] || 'western';
  }

  // 3. Language hint — use regional voice + multilingual model
  if (language === 'Arabic') region = 'arabic';
  if (language === 'Hindi' || language === 'Tamil') region = 'indian';
  if (language === 'Spanish') region = 'western';

  // 4. Pick voice by role
  const role = NARRATOR_TO_ROLE[narrator] || 'narrator';
  const regionVoices = VOICES[region] || VOICES.western;
  const voice = regionVoices[role] || regionVoices.narrator;

  // 5. Pick model
  const model = language === 'English' ? 'eleven_turbo_v2_5' : 'eleven_multilingual_v2';

  return { voiceId: voice.id, name: voice.name, model };
}
