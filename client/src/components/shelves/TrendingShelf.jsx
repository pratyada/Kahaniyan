// "Trending Stories" shelf — ranks stories by play count.

import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import StoryTile from '../cards/StoryTile.jsx';
import { getPlayCounts } from '../../utils/storyHelpers.js';
import { buildTrendingShelf } from '../../utils/shelfBuilder.js';

export default function TrendingShelf({ allLessons, wisdomImageUrls, onPlay }) {
  const playCounts = getPlayCounts();
  const shelf = buildTrendingShelf(allLessons, playCounts);

  if (!shelf) return null;

  return (
    <ShelfSection title={shelf.title}>
      <ShelfRow>
        {shelf.stories.map((lesson) => (
          <StoryTile
            key={lesson.id}
            lesson={lesson}
            imageUrl={wisdomImageUrls?.[lesson.id]}
            onPlay={onPlay}
          />
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
