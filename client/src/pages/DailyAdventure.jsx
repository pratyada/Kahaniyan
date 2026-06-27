// Daily Adventure — Today's story + mission + reflection for Summer Adventures.
// Route: /summer/day/:dayNumber

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSummerAdventure } from '../hooks/useSummerAdventure.js';
import { usePlayer } from '../hooks/usePlayer.jsx';

const API = import.meta.env.VITE_API_URL || '';

const FEELINGS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤔', label: 'Curious' },
  { emoji: '💪', label: 'Brave' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '🤩', label: 'Excited' },
];

export default function DailyAdventure() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const { adventure, days, completeMission, completeReflection, completeDay } = useSummerAdventure();
  const { load } = usePlayer();

  const [phase, setPhase] = useState('loading'); // loading, story, mission, reflection, done
  const [story, setStory] = useState(null);
  const [mission, setMission] = useState(null);
  const [reflectionQ, setReflectionQ] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [xpGained, setXpGained] = useState(0);

  const dayNum = parseInt(dayNumber);
  const day = days.find(d => d.dayNumber === dayNum);
  const weekNum = day?.weekNumber || Math.ceil(dayNum / 7);

  // Generate or load story
  useEffect(() => {
    if (!adventure?.id || !dayNum || !user) return;

    // If story already generated
    if (day?.story?.title && day?.story?.body) {
      setStory(day.story);
      setMission({ title: day.missionTitle || day.mission?.title, description: day.missionDescription || day.mission?.description, type: day.missionType || day.mission?.type });
      setReflectionQ(day.reflectionQuestion || 'What made you smile today?');
      setPhase('story');
      return;
    }

    // Generate new story
    setGenerating(true);
    (async () => {
      try {
        const res = await fetch(`${API}/api/summer/generate-daily-story`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, adventureId: adventure.id, dayNumber: dayNum }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStory(data.story);
        setMission(data.mission);
        setReflectionQ(data.reflection);
        setPhase('story');
      } catch (e) {
        setError(e.message);
      }
      setGenerating(false);
    })();
  }, [adventure?.id, dayNum, user, day]);

  // Play the story
  const handlePlay = () => {
    if (!story) return;
    load({
      id: `summer_day_${dayNum}`,
      title: story.title,
      text: story.body,
      tradition: 'universal',
      value: day?.targetSkill || 'kindness',
      source: `Summer Adventure · Day ${dayNum}`,
      isWisdom: true,
      estimatedMinutes: 2,
    });
    navigate(`/player?storyId=summer_day_${dayNum}`);
  };

  // Complete mission
  const handleCompleteMission = async () => {
    const result = await completeMission(dayNum);
    setXpGained(prev => prev + (result?.xpEarned || 15));
    setPhase('reflection');
  };

  // Complete reflection
  const handleCompleteReflection = async () => {
    const result = await completeReflection(dayNum, selectedFeeling, '');
    setXpGained(prev => prev + (result?.xpEarned || 5));

    // Complete the day
    const dayResult = await completeDay(dayNum);
    setXpGained(prev => prev + (dayResult?.xpEarned || 10));
    setPhase('done');
  };

  if (!adventure) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <p className="text-center text-ink-muted mt-20">No active adventure. <button onClick={() => navigate('/summer')} className="text-gold">Start one →</button></p>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-4">
        <button onClick={() => navigate('/summer')} className="text-xs text-gold font-bold mb-2">← Summer Adventure</button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Week {weekNum} · Day {dayNum}</p>
            <h1 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
              {day?.weekTheme || 'Today\'s Adventure'}
            </h1>
          </div>
        </div>
        {day?.targetSkill && (
          <p className="mt-1 text-[10px] text-ink-dim">🎯 Focus: {day.targetSkill}</p>
        )}
      </header>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-400 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      {/* Loading / Generating */}
      {(phase === 'loading' || generating) && (
        <div className="text-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <span className="text-5xl block">🔭</span>
          </motion.div>
          <h2 className="mt-4 text-base font-bold text-ink">Creating today's adventure...</h2>
          <p className="mt-1 text-xs text-ink-muted">AI is writing a story just for {adventure.childName}</p>
        </div>
      )}

      {/* Phase: Story */}
      {phase === 'story' && story && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-bg-surface ring-1 ring-gold/20 p-5">
            <h2 className="text-base font-bold text-ink mb-2" style={{ fontFamily: 'Lora, serif' }}>
              📖 {story.title}
            </h2>
            <div className="text-xs text-ink-muted leading-relaxed whitespace-pre-line max-h-[200px] overflow-y-auto mb-4">
              {story.body?.slice(0, 300)}...
            </div>
            <button onClick={handlePlay}
              className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
              ▶ Listen to Story
            </button>
          </div>

          {/* Skip to mission */}
          <button onClick={() => setPhase('mission')}
            className="w-full text-center text-[11px] text-ink-dim py-2">
            Already listened? → Go to mission
          </button>
        </div>
      )}

      {/* Phase: Mission */}
      {phase === 'mission' && mission && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl bg-bg-surface ring-1 ring-purple-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎯</span>
              <h2 className="text-base font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                {mission.title || 'Today\'s Mission'}
              </h2>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              {mission.description}
            </p>
            <p className="text-[10px] text-ink-dim mb-4">⏱ Takes 2-5 minutes · No worksheets, just fun!</p>
            <button onClick={handleCompleteMission}
              className="w-full rounded-full bg-purple-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition active:scale-95">
              ✅ Mission Complete! (+15 XP)
            </button>
          </div>
        </motion.div>
      )}

      {/* Phase: Reflection */}
      {phase === 'reflection' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl bg-bg-surface ring-1 ring-emerald-500/20 p-5 text-center">
            <span className="text-3xl block mb-3">💭</span>
            <h2 className="text-base font-bold text-ink mb-2" style={{ fontFamily: 'Lora, serif' }}>
              {reflectionQ}
            </h2>
            <div className="flex justify-center gap-3 my-4">
              {FEELINGS.map(f => (
                <button key={f.label} onClick={() => setSelectedFeeling(f.label)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-3 transition active:scale-95 ${
                    selectedFeeling === f.label ? 'bg-gold/20 ring-2 ring-gold' : 'bg-white/5 ring-1 ring-white/10'
                  }`}>
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-[9px] text-ink-dim">{f.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleCompleteReflection} disabled={!selectedFeeling}
              className="w-full rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition active:scale-95 disabled:opacity-40">
              Done! (+5 XP)
            </button>
          </div>
        </motion.div>
      )}

      {/* Phase: Done */}
      {phase === 'done' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
            <span className="text-6xl block">⭐</span>
          </motion.div>
          <h2 className="mt-4 text-xl font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>
            Day {dayNum} Complete!
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            +{xpGained} XP earned today
          </p>
          <p className="mt-1 text-xs text-ink-dim">
            {adventure.childName}'s star is now shining bright ✨
          </p>

          <div className="flex gap-3 mt-8 justify-center">
            <button onClick={() => navigate('/summer')}
              className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
              🌌 Back to Adventure
            </button>
          </div>
        </motion.div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
