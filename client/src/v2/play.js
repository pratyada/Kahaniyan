// Shared V2 play helper — builds the player `current` story object from a lesson
// or series episode and stays in the V2 shell. Free/generic tier: generic text
// ("little one") so it matches the pre-generated stored audio → instant play.
import { fillTokens } from '../utils/storyHelpers.js';

export function buildStory(item, audioUrls = {}, imageUrls = {}, extra = {}) {
  return {
    id: `lesson_${item.id}`,
    title: item.title,
    text: fillTokens(item.body || '', null),
    language: 'English',
    voice: 'AI Narrator',
    tradition: item.tradition,
    source: item.source,
    durationMinutes: item.durationMinutes,
    isWisdom: true,
    audioUrl: audioUrls[item.id] || null,
    coverImage: imageUrls[item.id] || item.coverImage || null,
    ...extra,
  };
}
