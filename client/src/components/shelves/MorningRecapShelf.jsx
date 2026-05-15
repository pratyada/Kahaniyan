// Morning wisdom recap — shown before noon on Home page.
// Shows stories played last night with their morals.

import { useMemo, useState } from 'react';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import RecapCard from '../cards/RecapCard.jsx';
import { useListeningHistory } from '../../hooks/useListeningHistory.js';
import { useReflections } from '../../utils/reflectionStore.js';
import { extractMoral } from '../../utils/moralExtractor.js';

export default function MorningRecapShelf() {
  const [dismissed, setDismissed] = useState(false);
  const { progress } = useListeningHistory();
  const { reflections, getDeferredReflections } = useReflections();

  // Only show before noon
  const isMorning = new Date().getHours() < 12;

  // Stories played last night (6 PM yesterday to 6 AM today)
  const lastNightStories = useMemo(() => {
    const now = new Date();
    const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0).getTime();
    const yesterdayEvening = todayMorning - 12 * 60 * 60 * 1000; // 6 PM yesterday

    return Object.values(progress)
      .filter((e) => {
        const t = e.updatedAt || 0;
        return t > yesterdayEvening && t < todayMorning && e.position >= 0.8;
      })
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }, [progress]);

  // Also include deferred reflections
  const deferred = getDeferredReflections();

  // Merge: stories from last night + deferred reflections
  const recapItems = useMemo(() => {
    const seen = new Set();
    const items = [];

    // Deferred reflections first
    deferred.forEach((r) => {
      seen.add(r.storyId);
      items.push({ story: r, moral: r.moral || 'A valuable lesson', reflection: r });
    });

    // Then last night stories without reflections
    lastNightStories.forEach((s) => {
      const id = s.storyId;
      if (seen.has(id)) return;
      const ref = reflections[id];
      const { moralShort } = extractMoral(s);
      items.push({ story: s, moral: ref?.moral || moralShort, reflection: ref });
    });

    return items;
  }, [deferred, lastNightStories, reflections]);

  // Hide if already dismissed this session
  const sessionKey = 'mst:recapDismissed';
  const alreadyDismissed = sessionStorage.getItem(sessionKey) === 'true';

  if (!isMorning || recapItems.length === 0 || alreadyDismissed || dismissed) return null;

  const handleDismissAll = () => {
    sessionStorage.setItem(sessionKey, 'true');
    setDismissed(true);
  };

  return (
    <ShelfSection
      title="🌅 Morning Recap"
      subtitle="What you learned last night"
      onSeeAll={handleDismissAll}
    >
      <ShelfRow>
        {recapItems.map((item, i) => (
          <RecapCard
            key={item.story.storyId || item.story.id || i}
            story={item.story}
            moral={item.moral}
            reflection={item.reflection}
            onDismiss={() => {
              if (recapItems.length <= 1) handleDismissAll();
            }}
          />
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
