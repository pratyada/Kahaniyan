// Multilingual Demo — auto-plays The Lion and the Mouse, redirects to player
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useWisdomData } from '../hooks/useWisdomData.js';
import { CULTURAL_LESSONS } from '../data/culturalLessons.js';
import { playLesson } from '../utils/storyHelpers.js';

export default function MultilingualDemo() {
  const navigate = useNavigate();
  const { load } = usePlayer();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const { wisdomAudioUrls } = useWisdomData();

  useEffect(() => {
    const story = CULTURAL_LESSONS.find(l => l.id === 'multilingual_lion_mouse');
    if (story) {
      playLesson(story, profile, wisdomAudioUrls, load, navigate, user);
    } else {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-bg-base">
      <p className="text-ink-muted text-sm">Loading multilingual demo...</p>
    </div>
  );
}
