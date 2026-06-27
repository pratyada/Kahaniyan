// Growth Profile — Review/edit AI-extracted strengths & growth areas.
// Route: /summer/profile

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSummerAdventure } from '../hooks/useSummerAdventure.js';

const SKILL_OPTIONS = [
  'Reading', 'Writing', 'Math', 'Number Sense', 'Problem Solving',
  'Listening', 'Communication', 'Creativity', 'Confidence',
  'Persistence', 'Self-Regulation', 'Sharing', 'Teamwork',
  'Fine Motor Skills', 'Social Skills', 'Curiosity', 'Focus',
  'Following Instructions', 'Independence', 'Empathy',
];

const ADVENTURE_THEMES = [
  { id: 'explorer', icon: '🧭', label: 'Explorer', desc: 'Discover new worlds' },
  { id: 'scientist', icon: '🔬', label: 'Scientist', desc: 'Experiments & discoveries' },
  { id: 'artist', icon: '🎨', label: 'Artist', desc: 'Create & imagine' },
  { id: 'builder', icon: '🏗️', label: 'Builder', desc: 'Build & solve' },
];

export default function GrowthProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const { createAdventure, generateCurriculum } = useSummerAdventure();

  const [data, setData] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [growthAreas, setGrowthAreas] = useState([]);
  const [adventureTheme, setAdventureTheme] = useState('explorer');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [newStrength, setNewStrength] = useState('');
  const [newGrowth, setNewGrowth] = useState('');

  // Load from session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('mst:reportCardData');
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed);
        if (parsed.extractedData) {
          setStrengths((parsed.extractedData.strengths || []).map(s => ({
            skill: s.skill, label: s.label, evidence: s.evidence || '',
          })));
          setGrowthAreas((parsed.extractedData.growthAreas || []).map(g => ({
            skill: g.skill, label: g.label, level: g.level || 'growing', evidence: g.evidence || '',
          })));
        }
      }
    } catch {}
  }, []);

  const addStrength = (label) => {
    if (!label || strengths.find(s => s.label === label)) return;
    setStrengths([...strengths, { skill: label.toLowerCase().replace(/\s+/g, '-'), label, evidence: '' }]);
    setNewStrength('');
  };

  const addGrowthArea = (label) => {
    if (!label || growthAreas.find(g => g.label === label)) return;
    setGrowthAreas([...growthAreas, { skill: label.toLowerCase().replace(/\s+/g, '-'), label, level: 'growing', evidence: '' }]);
    setNewGrowth('');
  };

  const removeStrength = (i) => setStrengths(strengths.filter((_, idx) => idx !== i));
  const removeGrowth = (i) => setGrowthAreas(growthAreas.filter((_, idx) => idx !== i));

  const handleStart = async () => {
    if (growthAreas.length === 0) { setError('Add at least one growth area'); return; }
    setGenerating(true);
    setError(null);

    try {
      const growthProfile = { strengths, growthAreas };

      // Create adventure in Firestore
      const adventureId = await createAdventure({
        childName: profile?.childName || data?.extractedData?.childName || 'Explorer',
        childAge: profile?.age || 5,
        reportCard: {
          imageUrl: data?.imageUrl || null,
          extractedData: data?.extractedData || null,
        },
        growthProfile,
      });

      // Navigate immediately — curriculum generates in background
      navigate('/summer');

      // Fire curriculum generation in background (don't await)
      generateCurriculum(growthProfile, adventureId).catch(e => {
        console.warn('[Summer] Curriculum generation error:', e.message);
      });
    } catch (e) {
      setError('Failed to generate adventure: ' + e.message);
    }
    setGenerating(false);
  };

  const childName = profile?.childName || data?.extractedData?.childName || 'your child';

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button onClick={() => navigate('/summer/upload')} className="text-xs text-gold font-bold mb-2">← Back</button>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          {childName}'s <span className="text-gold">Growth Profile</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {data?.extractedData ? 'AI extracted these from the report card. Review, edit, or add more.' : 'Tell us what your child is great at and where they could grow.'}
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-400 ring-1 ring-red-500/20">
          {error} <button onClick={() => setError(null)} className="ml-2">✕</button>
        </div>
      )}

      {/* Teacher notes */}
      {data?.extractedData?.teacherNotes?.length > 0 && (
        <div className="mb-4 rounded-xl bg-purple-500/5 ring-1 ring-purple-500/20 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">📝 Teacher Notes</p>
          {data.extractedData.teacherNotes.map((note, i) => (
            <p key={i} className="text-[11px] text-ink-muted italic">"{note}"</p>
          ))}
        </div>
      )}

      {/* Strengths */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-ink mb-2">💪 Strengths</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {strengths.map((s, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3 py-1.5">
              <span className="text-xs text-emerald-400 font-bold">{s.label}</span>
              <button onClick={() => removeStrength(i)} className="text-[10px] text-emerald-400/50 hover:text-red-400">✕</button>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2">
          <select value={newStrength} onChange={e => { addStrength(e.target.value); e.target.value = ''; }}
            className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink ring-1 ring-white/10 outline-none">
            <option value="">+ Add strength...</option>
            {SKILL_OPTIONS.filter(s => !strengths.find(st => st.label === s)).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Growth Areas */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-ink mb-2">🌱 Growth Areas</h2>
        <p className="text-[10px] text-ink-dim mb-2">These are the skills the adventure will focus on</p>
        <div className="space-y-2 mb-2">
          {growthAreas.map((g, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-2 rounded-xl bg-gold/5 ring-1 ring-gold/20 px-3 py-2">
              <span className="text-gold text-sm">🎯</span>
              <span className="text-xs text-ink font-bold flex-1">{g.label}</span>
              <select value={g.level} onChange={e => {
                const updated = [...growthAreas];
                updated[i] = { ...g, level: e.target.value };
                setGrowthAreas(updated);
              }} className="rounded-lg bg-bg-base px-2 py-1 text-[10px] text-ink ring-1 ring-white/10 outline-none">
                <option value="growing">Growing</option>
                <option value="needs-support">Needs Support</option>
                <option value="building">Building</option>
              </select>
              <button onClick={() => removeGrowth(i)} className="text-[10px] text-ink-dim hover:text-red-400">✕</button>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2">
          <select value={newGrowth} onChange={e => { addGrowthArea(e.target.value); e.target.value = ''; }}
            className="flex-1 rounded-lg bg-bg-base px-3 py-2 text-xs text-ink ring-1 ring-white/10 outline-none">
            <option value="">+ Add growth area...</option>
            {SKILL_OPTIONS.filter(s => !growthAreas.find(g => g.label === s)).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Adventure Theme */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-ink mb-2">🎨 Adventure Style</h2>
        <div className="grid grid-cols-4 gap-2">
          {ADVENTURE_THEMES.map(t => (
            <button key={t.id} onClick={() => setAdventureTheme(t.id)}
              className={`rounded-xl p-3 text-center ring-1 transition active:scale-95 ${
                adventureTheme === t.id ? 'bg-gold/10 ring-gold/30' : 'bg-bg-surface ring-white/5'
              }`}>
              <span className="text-xl">{t.icon}</span>
              <p className="text-[9px] font-bold text-ink mt-1">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Adventure Preview</p>
        <p className="text-xs text-ink">
          <strong>{childName}</strong> will explore <strong>{growthAreas.length}</strong> growth area{growthAreas.length !== 1 ? 's' : ''} over <strong>8 weeks</strong> through daily audio stories, mini missions, and rewards.
          {strengths.length > 0 && ` Their strengths in ${strengths.map(s => s.label.toLowerCase()).join(', ')} will be celebrated along the way.`}
        </p>
      </div>

      {/* Start button */}
      <div className="sticky bottom-0 bg-bg-base/95 backdrop-blur-sm pt-3 pb-4 -mx-1 px-1">
        <button onClick={handleStart} disabled={generating || growthAreas.length === 0}
          className="w-full rounded-full bg-gold px-8 py-4 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-40">
          {generating ? '🔭 Generating 8-Week Adventure...' : '🚀 Start Summer Adventure'}
        </button>
        {growthAreas.length === 0 && (
          <p className="text-center text-[10px] text-gold mt-2">Add at least one growth area to start</p>
        )}
      </div>

      <div className="h-8" />
    </PageTransition>
  );
}
