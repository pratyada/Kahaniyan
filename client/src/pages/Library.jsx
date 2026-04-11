import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import StoryCard from '../components/StoryCard.jsx';
import ValuePill from '../components/ValuePill.jsx';
import { getLibrary, pruneArchive } from '../utils/storyCache.js';
import { archiveDaysFor } from '../utils/tierGate.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { VALUES } from '../utils/constants.js';

export default function Library() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    pruneArchive(archiveDaysFor(profile?.tier || 'free'));
    setLibrary(getLibrary());
  }, [profile?.tier]);

  const filtered = useMemo(
    () => (filter ? library.filter((s) => s.value === filter) : library),
    [library, filter]
  );

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Library</p>
        <h1 className="display-title mt-1 text-ink">
          Stories <span className="text-gold">{profile?.childName}</span> has heard
        </h1>
      </header>

      {/* Filters */}
      <div className="mb-6 -mx-5 overflow-x-auto px-5">
        <div className="flex w-max gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`btn-pill px-4 py-2 text-sm font-bold ${
              !filter ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink'
            }`}
          >
            All
          </button>
          {VALUES.map((v) => (
            <ValuePill
              key={v.key}
              value={v.key}
              size="sm"
              active={filter === v.key}
              onClick={() => setFilter(filter === v.key ? null : v.key)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card-elevated mt-12 text-center">
          <div className="mb-3 text-4xl">📖</div>
          <p className="font-ui text-sm font-bold text-ink">No stories yet</p>
          <p className="mt-1 text-xs text-ink-muted">
            Generate your first story from the home screen.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => {
                load(story);
                navigate('/player');
              }}
            />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
