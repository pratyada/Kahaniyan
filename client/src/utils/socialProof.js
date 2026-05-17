// Social proof — play counts + ratings for story cards.
// Seeded deterministically so every card always shows the same numbers.
// Real plays from localStorage add on top.

function hashSeed(id) {
  return Math.abs((id || '').split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0));
}

export function getPlayCount(storyId) {
  const seed = hashSeed(storyId);
  const base = 2000 + (seed % 8000); // 2K-10K base
  try {
    const plays = JSON.parse(localStorage.getItem('mst:wisdomPlays') || '{}');
    const lessonId = storyId?.startsWith('lesson_') ? storyId.slice(7) : storyId;
    return base + (plays[lessonId] || plays[storyId] || 0);
  } catch { return base; }
}

export function getRating(storyId) {
  const seed = hashSeed(storyId);
  return (43 + (seed % 7)) / 10; // 4.3 to 4.9
}

export function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// Top creator — founder attribution
export const FOUNDER = {
  uid: 'prateekyadav2010',
  email: 'prateekyadav2010@gmail.com',
  name: 'Prateek Yadav',
};
