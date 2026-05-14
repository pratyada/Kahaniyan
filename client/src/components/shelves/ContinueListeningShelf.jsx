// "Continue Listening" shelf — shows stories the user hasn't finished.

import { useListeningHistory } from '../../hooks/useListeningHistory.js';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import StoryTileWide from '../cards/StoryTileWide.jsx';

export default function ContinueListeningShelf({ wisdomImageUrls, onPlay }) {
  const { getInProgress } = useListeningHistory();
  const inProgress = getInProgress();

  if (inProgress.length === 0) return null;

  return (
    <ShelfSection title="Continue Listening">
      <ShelfRow>
        {inProgress.map((entry) => (
          <StoryTileWide
            key={entry.storyId}
            story={entry}
            imageUrl={wisdomImageUrls?.[entry.storyId]}
            progress={entry.position}
            onPlay={onPlay}
          />
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
