// Search hook — client-side search across stories, series, and episodes.

import { useMemo, useState, useCallback } from 'react';
import { TRADITIONS, THEMES } from '../data/culturalLessons.js';

const LS_KEY = 'mst:recentSearches';
const MAX_RECENT = 8;

// Build searchable text from an item's fields
function searchText(item) {
  const tradition = TRADITIONS.find(t => t.key === item.tradition);
  const theme = THEMES.find(t => t.key === item.theme);
  return [
    item.title,
    item.subtitle,
    item.description,
    item.source,
    item.id?.replace(/[_-]/g, ' '),
    item.seriesTitle,
    tradition?.label,
    tradition?.key,
    theme?.label,
    theme?.key,
  ].filter(Boolean).join(' ').toLowerCase();
}

function matchesQuery(text, tokens) {
  return tokens.every(t => text.includes(t));
}

export function useSearch({ allLessons = [], series = [], collections = [], beliefs = [] }) {
  const [query, setQuery] = useState('');
  const [traditionFilter, setTraditionFilter] = useState(null);
  const [themeFilter, setThemeFilter] = useState(null);

  // Belief filter (same logic as Home.jsx)
  const passesBeliefFilter = useCallback((item) => {
    if (beliefs.length > 0 && !beliefs.includes('universal')) {
      return beliefs.includes(item.tradition) || item.tradition === 'universal';
    }
    return item.tradition === 'universal' || !item.tradition;
  }, [beliefs]);

  // All episodes flattened with series reference
  const allEpisodes = useMemo(() => {
    const eps = [];
    series.forEach(s => {
      (s.episodes || []).forEach(ep => {
        eps.push({ ...ep, seriesId: s.id, seriesTitle: s.title, seriesIcon: s.icon });
      });
    });
    return eps;
  }, [series]);

  // Collection stories (deduplicated against allLessons)
  const collectionStories = useMemo(() => {
    const lessonIds = new Set(allLessons.map(l => l.id));
    const stories = [];
    collections.forEach(c => {
      (c.stories || []).forEach(s => {
        if (!lessonIds.has(s.id)) {
          stories.push(s);
          lessonIds.add(s.id);
        }
      });
    });
    return stories;
  }, [allLessons, collections]);

  const results = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hasQuery = tokens.length > 0;
    const hasFilters = traditionFilter || themeFilter;

    if (!hasQuery && !hasFilters) return { stories: [], series: [], episodes: [], total: 0 };

    const filterItem = (item) => {
      if (!passesBeliefFilter(item)) return false;
      if (traditionFilter && item.tradition !== traditionFilter) return false;
      if (themeFilter && item.theme !== themeFilter) return false;
      if (hasQuery && !matchesQuery(searchText(item), tokens)) return false;
      return true;
    };

    const storyResults = [...allLessons, ...collectionStories].filter(filterItem);

    const seriesResults = series.filter(s => {
      if (traditionFilter || themeFilter) {
        const hasMatchingEp = (s.episodes || []).some(ep => {
          if (traditionFilter && ep.tradition !== traditionFilter) return false;
          if (themeFilter && ep.theme !== themeFilter) return false;
          return passesBeliefFilter(ep);
        });
        if (!hasMatchingEp) return false;
      }
      if (hasQuery) {
        const text = [s.title, s.description, s.icon].filter(Boolean).join(' ').toLowerCase();
        if (!matchesQuery(text, tokens)) return false;
      }
      return true;
    });

    const episodeResults = allEpisodes.filter(filterItem);

    return {
      stories: storyResults,
      series: seriesResults,
      episodes: episodeResults,
      total: storyResults.length + seriesResults.length + episodeResults.length,
    };
  }, [query, traditionFilter, themeFilter, allLessons, collectionStories, series, allEpisodes, passesBeliefFilter]);

  // Recent searches (localStorage)
  const getRecent = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, []);

  const addRecent = useCallback((q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    try {
      const prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const next = [trimmed, ...prev.filter(x => x !== trimmed)].slice(0, MAX_RECENT);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const clearRecent = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch {}
  }, []);

  const toggleTradition = useCallback((key) => {
    setTraditionFilter(prev => prev === key ? null : key);
  }, []);

  const toggleTheme = useCallback((key) => {
    setThemeFilter(prev => prev === key ? null : key);
  }, []);

  return {
    query, setQuery,
    traditionFilter, toggleTradition,
    themeFilter, toggleTheme,
    results,
    getRecent, addRecent, clearRecent,
  };
}
