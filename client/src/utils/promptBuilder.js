// Builds the API request body. In the POC this just shapes the
// payload — when Claude is wired up, this same builder will create
// the prompt instead.
import { mapCharactersToFamilyMembers } from './constants.js';

export function buildStoryRequest({
  profile,
  value,
  duration,
  language,
  voice,
  recentPlotTypes,
  whisper,
  whisperOverridesValue,
  selectedCharacters,
}) {
  // Only include family members and cast when the user explicitly
  // chose "Cast" mode. Whisper mode = just the child, no characters.
  let familyMembers = {};
  let preferredSlots = [];
  let castNames = [];
  let selectedCast = [];

  if (selectedCharacters && selectedCharacters.length > 0) {
    // Cast mode — use selected characters
    familyMembers = {
      sibling: profile.sibling || '',
      grandfather: profile.grandfather || '',
      grandmother: profile.grandmother || '',
      pet: profile.pet || '',
    };
    const overrides = mapCharactersToFamilyMembers(selectedCharacters);
    for (const slot of Object.keys(overrides)) {
      if (overrides[slot]) {
        familyMembers[slot] = overrides[slot];
        preferredSlots.push(slot);
      }
    }
    castNames = selectedCharacters
      .filter((c) => c.relation !== 'self')
      .map((c) => c.name);
    selectedCast = selectedCharacters.map((c) => {
      const obj = {
        name: c.relation === 'self' && c.adventureName ? c.adventureName : c.name,
        relation: c.relation,
        traits: c.traits || (c.tags || []).join(', ') || '',
      };
      if (c.petType) obj.petType = c.petType;
      return obj;
    });
  }

  return {
    childName: (() => {
      const hero = profile.characters?.find((c) => c.relation === 'self');
      return (hero?.adventureName?.trim() || profile.childName);
    })(),
    gender: profile.gender || '',
    age: profile.age,
    value,
    duration,
    language,
    voice,
    familyMembers,
    preferredSlots,
    castNames,
    selectedCast,
    recentPlotTypes,
    whisper: whisper || '',
    whisperOverridesValue: !!whisperOverridesValue,
    beliefs: profile.beliefs || [],
    country: profile.country || '',
  };
}
