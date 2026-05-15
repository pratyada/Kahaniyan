// Extract the moral/lesson from a story's body text.
// Cultural lessons reliably end with "That night, {childName}..." paragraph.
// Generated stories use the last paragraph as fallback.

import { valueMeta } from './constants.js';

export function extractMoral(story) {
  const text = story?.text || story?.body || '';
  if (!text) {
    const meta = valueMeta(story?.value);
    return {
      moral: `This story was about ${meta?.label || 'an important value'}.`,
      moralShort: meta?.label || 'A valuable lesson',
    };
  }

  // Try "That night, ..." pattern (all cultural lessons use this)
  const thatNightMatch = text.match(/That night,[\s\S]*$/);
  if (thatNightMatch) {
    const moral = thatNightMatch[0]
      .replace(/\{childName\}/g, 'little one')
      .replace(/\{(\w+)\}/g, '')
      .trim();
    return {
      moral,
      moralShort: moral.length > 100 ? moral.slice(0, 97) + '...' : moral,
    };
  }

  // Fallback: last non-empty paragraph
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 20);
  if (paragraphs.length > 0) {
    const last = paragraphs[paragraphs.length - 1]
      .replace(/\{childName\}/g, 'little one')
      .replace(/\{(\w+)\}/g, '')
      .trim();
    return {
      moral: last,
      moralShort: last.length > 100 ? last.slice(0, 97) + '...' : last,
    };
  }

  // Final fallback
  const meta = valueMeta(story?.value);
  return {
    moral: `This story was about ${meta?.label || 'an important value'}.`,
    moralShort: meta?.label || 'A valuable lesson',
  };
}
