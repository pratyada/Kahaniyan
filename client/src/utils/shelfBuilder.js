// Build shelf data arrays from wisdom stories for the Netflix-style home page.

import { TRADITIONS, THEMES } from '../data/culturalLessons.js';

export function buildTraditionShelves(allLessons, beliefs) {
  const shelves = [];
  const userTraditions = beliefs?.length > 0 ? beliefs : [];

  // User's belief traditions first
  for (const tradition of userTraditions) {
    const meta = TRADITIONS.find((t) => t.key === tradition);
    if (!meta) continue;
    const stories = allLessons.filter((l) => l.tradition === tradition);
    if (stories.length < 2) continue;
    shelves.push({
      id: `tradition-${tradition}`,
      title: `${meta.icon} ${meta.label} Stories`,
      stories,
    });
  }

  // Universal stories
  const universal = allLessons.filter((l) => l.tradition === 'universal');
  if (universal.length >= 2) {
    shelves.push({
      id: 'tradition-universal',
      title: '🌍 Universal Stories',
      stories: universal,
    });
  }

  // Discover more — traditions the user hasn't selected
  const otherTraditions = TRADITIONS.filter(
    (t) => t.key !== 'universal' && !userTraditions.includes(t.key)
  );
  for (const meta of otherTraditions) {
    const stories = allLessons.filter((l) => l.tradition === meta.key);
    if (stories.length < 2) continue;
    shelves.push({
      id: `discover-${meta.key}`,
      title: `${meta.icon} Discover ${meta.label}`,
      stories,
    });
  }

  return shelves;
}

export function buildThemeShelves(allLessons, beliefs) {
  const shelves = [];
  const filterByBelief = (stories) => {
    if (!beliefs?.length) {
      const universal = stories.filter((l) => l.tradition === 'universal');
      return universal.length > 0 ? universal : stories;
    }
    const matched = stories.filter(
      (l) => beliefs.includes(l.tradition) || l.tradition === 'universal'
    );
    return matched.length > 0 ? matched : stories;
  };

  for (const theme of THEMES) {
    const stories = filterByBelief(allLessons.filter((l) => l.theme === theme.key));
    if (stories.length < 2) continue;
    shelves.push({
      id: `theme-${theme.key}`,
      title: `${theme.icon} ${theme.label}`,
      stories,
    });
  }

  return shelves;
}

export function buildTrendingShelf(allLessons, playCounts) {
  if (!playCounts || Object.keys(playCounts).length <= 1) return null;

  const ranked = allLessons
    .map((l) => ({ ...l, plays: playCounts[l.id] || 0 }))
    .filter((l) => l.plays > 0)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 12);

  if (ranked.length < 2) return null;

  return {
    id: 'trending',
    title: '🔥 Trending Stories',
    stories: ranked,
  };
}

export function buildAgeShelf(allLessons, age, beliefs) {
  let maxMinutes = 10;
  if (age <= 4) maxMinutes = 5;
  else if (age <= 6) maxMinutes = 8;
  else if (age >= 9) maxMinutes = 15;

  let pool = allLessons.filter((l) => l.durationMinutes <= maxMinutes);

  if (beliefs?.length > 0) {
    const matched = pool.filter(
      (l) => beliefs.includes(l.tradition) || l.tradition === 'universal'
    );
    if (matched.length >= 3) pool = matched;
  }

  // Shuffle deterministically by day so it feels fresh
  const day = Math.floor(Date.now() / 86400000);
  const shuffled = pool
    .map((l, i) => ({ l, sort: ((i * 2654435761 + day) >>> 0) % 1000 }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.l)
    .slice(0, 10);

  if (shuffled.length < 2) return null;

  return {
    id: 'for-age',
    title: `✨ Perfect for ${age}-year-olds`,
    stories: shuffled,
  };
}
