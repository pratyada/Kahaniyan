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
  // If a cast was explicitly selected for tonight, derive familyMembers
  // from those characters. Otherwise fall back to legacy onboarding fields.
  const familyMembers =
    selectedCharacters && selectedCharacters.length > 0
      ? mapCharactersToFamilyMembers(selectedCharacters)
      : {
          sibling: profile.sibling,
          grandfather: profile.grandfather,
          grandmother: profile.grandmother,
          pet: profile.pet,
        };

  return {
    childName: profile.childName,
    age: profile.age,
    value,
    duration,
    language,
    voice,
    familyMembers,
    recentPlotTypes,
    whisper: whisper || '',
    whisperOverridesValue: !!whisperOverridesValue,
  };
}
