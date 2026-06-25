// Summer Adventures — Landing hub. Start or continue a summer adventure.
// Route: /summer

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useSummerAdventure } from '../hooks/useSummerAdventure.js';

export default function SummerAdventures() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const { adventure, hasAdventure, currentDay, currentWeek, totalXP, completedDays, loading } = useSummerAdventure();

  if (loading) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="flex items-center justify-center h-64">
          <div className="text-3xl animate-pulse">🌟</div>
        </div>
      </PageTransition>
    );
  }

  // Active adventure — show continue view
  if (hasAdventure && adventure.curriculum) {
    const progress = Math.round((completedDays.length / 56) * 100);
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <header className="mb-6 text-center">
          <span className="text-4xl">🌟</span>
          <h1 className="mt-2 text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
            {adventure.curriculum?.adventureTitle || 'Summer Adventure'}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {adventure.childName}'s personalized learning journey
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Week', value: currentWeek, color: '#f0a500' },
            { label: 'Stars', value: completedDays.length, color: '#7ad9a1' },
            { label: 'XP', value: totalXP, color: '#c084fc' },
            { label: 'Progress', value: `${progress}%`, color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-2.5 text-center">
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8px] text-ink-dim uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Today's adventure CTA */}
        {currentDay && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/summer/day/${currentDay.dayNumber}`)}
            className="w-full rounded-2xl bg-gradient-to-r from-gold/20 to-purple-500/20 ring-1 ring-gold/30 p-5 text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-gold/20 text-2xl">
                ✨
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Day {currentDay.dayNumber} · {currentDay.dayOfWeek || 'Today'}</p>
                <h3 className="text-sm font-bold text-ink mt-0.5">{currentDay.storyPrompt?.slice(0, 60) || "Today's Adventure"}...</h3>
                <p className="text-[10px] text-ink-muted mt-0.5">🎯 {currentDay.targetSkill}</p>
              </div>
              <span className="text-gold text-xl">▶</span>
            </div>
          </motion.button>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => navigate('/summer/map')} className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-4 text-center active:scale-95 transition">
            <span className="text-2xl">🌌</span>
            <p className="text-[10px] font-bold text-ink-muted mt-1">Star Map</p>
          </button>
          <button onClick={() => navigate('/summer/passport')} className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-4 text-center active:scale-95 transition">
            <span className="text-2xl">🛂</span>
            <p className="text-[10px] font-bold text-ink-muted mt-1">Passport</p>
          </button>
          <button onClick={() => navigate('/summer/parent')} className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-4 text-center active:scale-95 transition">
            <span className="text-2xl">📊</span>
            <p className="text-[10px] font-bold text-ink-muted mt-1">Dashboard</p>
          </button>
        </div>

        {/* Growth areas */}
        {adventure.growthProfile?.growthAreas?.length > 0 && (
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">Growth Journey</p>
            <div className="space-y-2">
              {adventure.growthProfile.growthAreas.map((g, i) => {
                const daysForSkill = completedDays.filter(d => d.targetSkill === g.skill).length;
                const totalForSkill = 56 / (adventure.growthProfile.growthAreas.length || 1);
                const pct = Math.min(100, Math.round((daysForSkill / totalForSkill) * 100));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-ink">{g.label}</span>
                      <span className="text-ink-dim">{pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-32" />
      </PageTransition>
    );
  }

  // No adventure yet — show start flow
  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Hero */}
      <div className="text-center mb-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <span className="text-6xl">🌟</span>
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          Summer <span className="text-gold">Adventures</span>
        </h1>
        <p className="mt-3 text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
          Upload {profile?.childName || 'your child'}'s report card. We'll create a magical 8-week learning adventure — personalized to exactly what they need.
        </p>
        <p className="mt-2 text-[11px] text-ink-dim">
          Not homework. Not tutoring. A magical journey.
        </p>
      </div>

      {/* How it works */}
      <div className="space-y-3 mb-8">
        {[
          { icon: '📸', title: 'Upload Report Card', desc: 'Take a photo — AI reads it instantly' },
          { icon: '🧠', title: 'Get Growth Profile', desc: 'See strengths & areas to explore' },
          { icon: '🗺️', title: '8-Week Adventure', desc: 'Daily stories + missions + rewards' },
          { icon: '⭐', title: 'Watch Them Grow', desc: 'Skills radar + end-of-summer report' },
        ].map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-bg-surface ring-1 ring-white/5 p-3">
            <span className="text-2xl">{step.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-ink">{step.title}</h3>
              <p className="text-[11px] text-ink-muted">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (!user) {
            if (window.__triggerLogin) window.__triggerLogin();
            return;
          }
          navigate('/summer/upload');
        }}
        className="w-full rounded-full bg-gold px-8 py-4 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110"
      >
        📸 Upload Report Card
      </motion.button>

      <p className="mt-3 text-center text-[10px] text-ink-dim">
        Works with Ontario, BC, and most Canadian/US report cards
      </p>

      {/* Pricing hint */}
      <div className="mt-6 rounded-xl bg-gold/5 ring-1 ring-gold/20 p-4 text-center">
        <p className="text-xs text-gold font-bold">Summer Pass — CA$29</p>
        <p className="text-[10px] text-ink-muted mt-1">8 weeks of personalized learning for less than one hour of tutoring</p>
        <p className="text-[10px] text-ink-dim mt-0.5">Free with Pro or Family subscription</p>
      </div>

      <div className="h-32" />
    </PageTransition>
  );
}
