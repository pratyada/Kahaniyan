import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import StoryCard from '../components/StoryCard.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
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
        <p className="mt-2 text-sm text-ink-muted">
          {library.length} {library.length === 1 ? 'story' : 'stories'} saved · tap any to replay
        </p>
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
        <div className="card-elevated mt-8 text-center">
          <div className="mb-4 text-5xl">📖</div>
          <p className="font-display text-xl font-bold text-ink">
            {library.length === 0 ? 'Your library is empty' : 'No stories with that value yet'}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {library.length === 0
              ? "Tap Tonight to weave your child's first bedtime story."
              : 'Try a different filter or generate one with this value.'}
          </p>
          <button
            onClick={() => navigate(library.length === 0 ? '/' : '/')}
            className="btn-primary mt-5"
          >
            {library.length === 0 ? 'Weave first story' : 'Back to Tonight'}
          </button>
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

      <VersionFooter />
    </PageTransition>
  );
}
