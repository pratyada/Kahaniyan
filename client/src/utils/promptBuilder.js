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
  // Always start from the legacy onboarding fields so unfilled slots
  // keep the real family members. Then override with whatever the
  // selected cast provides — selected characters take priority.
  const familyMembers = {
    sibling: profile.sibling || '',
    grandfather: profile.grandfather || '',
    grandmother: profile.grandmother || '',
    pet: profile.pet || '',
  };
  let preferredSlots = []; // bias the story picker toward these slots
  let castNames = [];
  let selectedCast = []; // full character objects for the cast builder

  if (selectedCharacters && selectedCharacters.length > 0) {
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
