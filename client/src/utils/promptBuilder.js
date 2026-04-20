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
  // Build character data for the story
  let familyMembers = {
    sibling: profile.sibling || '',
    grandfather: profile.grandfather || '',
    grandmother: profile.grandmother || '',
    pet: profile.pet || '',
  };
  let preferredSlots = [];
  let castNames = [];
  let selectedCast = [];

  // All characters from profile
  const allChars = profile.characters || [];
  const nonSelf = allChars.filter((c) => c.relation !== 'self');

  if (selectedCharacters && selectedCharacters.length > 0) {
    // Cast mode — use explicitly selected characters
    const overrides = mapCharactersToFamilyMembers(selectedCharacters);
    for (const slot of Object.keys(overrides)) {
      if (overrides[slot]) {
        familyMembers[slot] = overrides[slot];
        preferredSlots.push(slot);
      }
    }
    castNames = selectedCharacters.filter((c) => c.relation !== 'self').map((c) => c.name);
    selectedCast = selectedCharacters.map((c) => buildCastEntry(c));
  } else if (nonSelf.length > 0) {
    // Whisper / default mode — randomly pick 2-3 characters from profile
    const shuffled = [...nonSelf].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(3, shuffled.length));
    const overrides = mapCharactersToFamilyMembers(picked);
    for (const slot of Object.keys(overrides)) {
      if (overrides[slot]) {
        familyMembers[slot] = overrides[slot];
        preferredSlots.push(slot);
      }
    }
    castNames = picked.map((c) => c.name);
    selectedCast = [
      ...allChars.filter((c) => c.relation === 'self').map((c) => buildCastEntry(c)),
      ...picked.map((c) => buildCastEntry(c)),
    ];
  }

  function buildCastEntry(c) {
    const obj = {
      name: c.relation === 'self' && c.adventureName ? c.adventureName : c.name,
      relation: c.relation,
      gender: c.gender || '',
      traits: c.traits || (c.tags || []).join(', ') || '',
      nickname: c.nickname || '',
      tags: c.tags || [],
    };
    if (c.petType) obj.petType = c.petType;
    return obj;
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
