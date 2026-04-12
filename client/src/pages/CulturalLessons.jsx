import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { CULTURAL_LESSONS, TRADITIONS, THEMES } from '../data/culturalLessons.js';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { usePlayer } from '../hooks/usePlayer.jsx';

function fillTokens(text, profile) {
  const tokens = {
    childName: profile?.childName || 'little one',
    sibling: profile?.sibling || 'their friend',
    grandfather: profile?.grandfather || 'Dada ji',
    grandmother: profile?.grandmother || 'Nani ma',
    pet: profile?.pet || 'their puppy',
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => tokens[k] ?? `{${k}}`);
}

export default function CulturalLessons() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { load } = usePlayer();
  const [activeTheme, setActiveTheme] = useState('compassion-animals');
  const [traditionFilter, setTraditionFilter] = useState(null);

  const onlyMyTradition = profile?.onlyMyTradition;
  const beliefs = profile?.beliefs || [];

  const filtered = useMemo(() => {
    let list = CULTURAL_LESSONS.filter((l) => l.theme === activeTheme);
    if (traditionFilter) {
      list = list.filter((l) => l.tradition === traditionFilter);
    } else if (beliefs.length > 0) {
      const matched = list.filter((l) => beliefs.includes(l.tradition));
      if (onlyMyTradition || !profile?.openToAllCultures) {
        list = matched;
      } else {
        const others = list.filter((l) => !beliefs.includes(l.tradition));
        list = [...matched, ...others];
      }
    }
    return list;
  }, [activeTheme, traditionFilter, onlyMyTradition, beliefs, profile?.openToAllCultures]);

  const playLesson = (lesson) => {
    const filledText = fillTokens(lesson.body, profile);
    const story = {
      id: `lesson_${lesson.id}_${Date.now()}`,
      title: lesson.title,
      text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: lesson.durationMinutes,
      value: 'kindness',
      language: profile?.language || 'English',
      voice: 'AI Narrator',
      tradition: lesson.tradition,
      source: lesson.source,
      createdAt: new Date().toISOString(),
    };
    load(story);
    navigate('/player');
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <p className="ui-label">Wisdom Stories</p>
        <h1 className="display-title mt-1 text-ink">
          Stories from <span className="text-gold">your beliefs</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Hand-picked stories grouped by theme. Set your beliefs in More → Edit family to filter.
        </p>
      </header>

      {/* Theme tabs */}
      <div className="mb-5 -mx-5 flex gap-2 overflow-x-auto px-5">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTheme(t.key)}
            className={`btn-pill shrink-0 px-4 py-2 text-sm font-bold ${
              activeTheme === t.key ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-ink-muted'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tradition filter (only if not in "only my tradition" mode) */}
      {!onlyMyTradition && (
        <div className="mb-5 -mx-5 flex gap-2 overflow-x-auto px-5">
          <button
            onClick={() => setTraditionFilter(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
              !traditionFilter
                ? 'bg-gold/20 text-gold ring-1 ring-gold'
                : 'bg-bg-surface text-ink-muted ring-1 ring-white/10'
            }`}
          >
            All traditions
          </button>
          {TRADITIONS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTraditionFilter(traditionFilter === t.key ? null : t.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                traditionFilter === t.key
                  ? 'bg-gold/20 text-gold ring-1 ring-gold'
                  : 'bg-bg-surface text-ink-muted ring-1 ring-white/10'
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {onlyMyTradition && beliefs.length > 0 && (
        <div className="mb-4 rounded-2xl bg-bg-surface p-3 text-[11px] text-ink-muted ring-1 ring-white/5">
          Showing only stories from your beliefs. Change this in Settings → Content.
        </div>
      )}

      {/* Lessons */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-elevated text-center">
            <div className="mb-2 text-3xl">🌱</div>
            <p className="text-sm text-ink-muted">
              No stories yet for this theme + filter combination.
            </p>
          </div>
        ) : (
          filtered.map((lesson, idx) => {
            const tradition = TRADITIONS.find((t) => t.key === lesson.tradition);
            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => playLesson(lesson)}
                className="group flex w-full items-center gap-3 rounded-2xl bg-bg-surface p-4 text-left shadow-card ring-1 ring-white/5 transition hover:bg-bg-elevated"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold/15 text-2xl">
                  {tradition?.icon || '🌟'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    {tradition?.label}
                  </div>
                  <h3 className="mt-1 truncate font-ui text-sm font-bold text-ink">
                    {lesson.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-muted">{lesson.source}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-card text-gold transition group-hover:bg-gold group-hover:text-bg-base">
                  ▶
                </span>
              </motion.button>
            );
          })
        )}
      </div>

      <VersionFooter />
    </PageTransition>
  );
}
