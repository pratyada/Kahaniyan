// Builds the API request body. In the POC this just shapes the
// payload — when Claude is wired up, this same builder will create
// the prompt instead.
export function buildStoryRequest({
  profile,
  value,
  duration,
  language,
  voice,
  recentPlotTypes,
  whisper,
  whisperOverridesValue,
}) {
  return {
    childName: profile.childName,
    age: profile.age,
    value,
    duration,
    language,
    voice,
    familyMembers: {
      sibling: profile.sibling,
      grandfather: profile.grandfather,
      grandmother: profile.grandmother,
      pet: profile.pet,
    },
    recentPlotTypes,
    whisper: whisper || '',
    whisperOverridesValue: !!whisperOverridesValue,
  };
}
