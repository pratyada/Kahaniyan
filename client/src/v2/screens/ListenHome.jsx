// V2 Listen — DATA CONTAINER. Computes props and hands them to <ListenView>,
// which reuses the EXISTING production cover cards (StoryTile / SeriesCard —
// the ones you prefer) inside the new night-sky shell.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { usePlayer } from '../../hooks/usePlayer.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { playLesson } from '../../utils/storyHelpers.js';
import { SERIES } from '../../data/series.js';
import ListenView from './ListenView.jsx';

export default function ListenHome() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { allLessons, wisdomImageUrls, wisdomAudioUrls, loading } = useWisdomData();
  const { load } = usePlayer();
  const { user } = useAuth();

  const childName = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;
  const streak = Number((typeof localStorage !== 'undefined' && localStorage.getItem('mst:streak')) || 1);
  const cover = (s) => (s.episodes || []).map((e) => wisdomImageUrls?.[e.id] || e.coverImage).find(Boolean) || null;

  const seriesRaw = useMemo(() => (SERIES || []).filter((s) => !s.comingSoon && s.episodes?.length), []);
  const lessonsRaw = useMemo(() => (allLessons || []).filter((l) => l && l.body && l.title), [allLessons]);

  const stories = useMemo(
    () => lessonsRaw.slice(0, 14).map((l) => ({ lesson: l, imageUrl: wisdomImageUrls?.[l.id] || null })),
    [lessonsRaw, wisdomImageUrls]
  );
  const series = useMemo(
    () => seriesRaw.map((s) => ({ series: s, coverImage: cover(s) })),
    [seriesRaw, wisdomImageUrls]
  );
  const highlights = useMemo(
    () => seriesRaw.slice(0, 6).map((s) => ({ series: s, coverImage: cover(s) })),
    [seriesRaw, wisdomImageUrls]
  );
  const tonight = seriesRaw[0] ? { series: seriesRaw[0], coverImage: cover(seriesRaw[0]) } : null;

  return (
    <ListenView
      childName={childName}
      streak={streak}
      tonight={tonight}
      highlights={highlights}
      stories={stories}
      series={series}
      loading={loading && stories.length === 0}
      onPlay={(lesson) => playLesson(lesson, profile, wisdomAudioUrls || {}, load, navigate, user)}
      onOpenSeries={(id) => navigate(`/series/${id}`)}
      onOpenVoice={() => navigate('/v2/profile')}
    />
  );
}
