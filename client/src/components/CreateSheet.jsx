// Bottom sheet with Write + Cast tabs for story creation.
// Extracted from Home.jsx to keep the home page as a pure content browser.

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenLine, Users } from 'lucide-react';
import BottomSheet from './BottomSheet.jsx';
import LengthStrip from './LengthStrip.jsx';
import ValuePill from './ValuePill.jsx';
import WhisperBox, { saveRecentWhisper } from './WhisperBox.jsx';
import UpgradeModal from './UpgradeModal.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useStoryGenerator } from '../hooks/useStoryGenerator.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useRadio } from '../hooks/useRadio.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { VALUES, DURATIONS, RELATION_EMOJI } from '../utils/constants.js';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { recommendedValueFor } from '../utils/storyHelpers.js';
import { maxDurationFor, storiesThisWeek } from '../utils/tierGate.js';
import { trackStoryGenerated } from '../utils/analytics.js';

export default function CreateSheet({ open, onClose }) {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { generate, loading } = useStoryGenerator();
  const { load, clear } = usePlayer();
  const radio = useRadio();
  const { isUnlimited } = useAdmin();

  const tier = profile?.tier || 'free';
  const recommended = useMemo(() => recommendedValueFor(profile?.age || 6), [profile?.age]);
  const characters = profile?.characters || [];
  const nonProtagonist = characters.filter((c) => c.relation !== 'self');
  const maxDuration = maxDurationFor(tier, isUnlimited);

  const [tab, setTab] = useState('write');
  const [value, setValue] = useState(recommended[0]);
  const [duration, setDuration] = useState(2);
  const [whisper, setWhisper] = useState('');
  const [whisperOverridesValue, setWhisperOverridesValue] = useState(true);
  const [selectedCharIds, setSelectedCharIds] = useState([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [storyError, setStoryError] = useState(null);

  const toggleChar = (id) => {
    setSelectedCharIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const handleStart = async () => {
    setStoryError(null);
    if (window.__triggerLogin) {
      window.__triggerLogin();
      const { auth } = await import('../lib/firebase.js');
      if (auth && !auth.currentUser) return;
    }
    if (!profile) { setStoryError('Profile not loaded.'); return; }

    const isWrite = tab === 'write';
    const isCast = tab === 'cast';
    const selectedCharacters = characters.filter(
      (c) => selectedCharIds.includes(c.id) || c.relation === 'self'
    );

    clear();
    onClose();
    navigate('/player');

    const raagNidra = RADIO_STATIONS.find((s) => s.id === 'raag-nidra') || RADIO_STATIONS[0];
    try { radio.play(raagNidra); } catch {}

    if (whisper.trim()) saveRecentWhisper(whisper.trim());
    generate({
      profile,
      value,
      duration,
      language: profile.language || 'English',
      voice: profile.defaultVoice || 'AI Narrator',
      whisper: isWrite ? whisper : '',
      whisperOverridesValue: isWrite ? whisperOverridesValue : false,
      selectedCharacters: isCast ? selectedCharacters : undefined,
    }).then((story) => {
      trackStoryGenerated(isWrite ? 'whisper' : isCast ? 'cast' : 'quick', value, duration);
      radio.stop();
      load(story);
      try { navigator.vibrate?.([200, 100, 200]); } catch {}
    }).catch((e) => {
      radio.stop();
      setStoryError(e.message || 'Could not generate story.');
      navigate('/');
    });
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose}>
        {/* Tab bar */}
        <div className="mb-5 flex gap-2 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
          <TabButton active={tab === 'write'} onClick={() => setTab('write')} icon={<PenLine size={14} />} label="Write" />
          <TabButton active={tab === 'cast'} onClick={() => setTab('cast')} icon={<Users size={14} />} label="Cast" />
        </div>

        {/* Write tab — input first (thumb-reach), options below */}
        {tab === 'write' && (
          <div>
            {/* Start button at top for visibility */}
            <StartButton loading={loading} onClick={handleStart} />

            <div className="my-4" />

            <WhisperBox
              value={whisper}
              onChange={setWhisper}
              overrideValue={whisperOverridesValue}
              onToggleOverride={setWhisperOverridesValue}
            />

            {/* Auto-pick toggle */}
            <label className="mb-5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
              <div className="min-w-0 flex-1">
                <div className="font-ui text-xs font-bold text-ink">Auto-pick the lesson</div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {whisperOverridesValue ? "We'll choose the best value for you" : 'Pick a value below'}
                </div>
              </div>
              <span
                onClick={(e) => { e.preventDefault(); setWhisperOverridesValue(!whisperOverridesValue); }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                  whisperOverridesValue ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/10'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-bg-base transition ${
                  whisperOverridesValue ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </span>
            </label>

            {!whisperOverridesValue && (
              <ValueSection recommended={recommended} value={value} setValue={setValue} />
            )}

            <LengthStrip
              duration={duration}
              setDuration={setDuration}
              maxDuration={maxDuration}
              setUpgradeReason={setUpgradeReason}
              setUpgradeOpen={setUpgradeOpen}
            />

          </div>
        )}

        {/* Cast tab */}
        {tab === 'cast' && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted">{selectedCharIds.length}/5 selected</span>
              <button onClick={() => { onClose(); navigate('/characters'); }} className="text-[11px] font-bold text-gold">
                + Manage
              </button>
            </div>

            {nonProtagonist.length === 0 ? (
              <div className="rounded-2xl bg-bg-surface p-6 text-center ring-1 ring-white/5">
                <p className="text-sm font-bold text-ink">No characters yet</p>
                <p className="mt-1 text-[11px] text-ink-muted">Add family members to personalize stories</p>
                <button
                  onClick={() => { onClose(); navigate('/characters'); }}
                  className="mt-3 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base"
                >
                  Add characters
                </button>
              </div>
            ) : (
              <div className="-mx-5 overflow-x-auto px-5 mb-4">
                <div className="flex w-max gap-2">
                  {nonProtagonist.map((c) => {
                    const active = selectedCharIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleChar(c.id)}
                        disabled={!active && selectedCharIds.length >= 5}
                        className={`flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl p-3 text-center transition disabled:opacity-40 ${
                          active ? 'bg-gold text-bg-base shadow-glow' : 'bg-bg-surface text-ink ring-1 ring-white/5'
                        }`}
                      >
                        <span className="text-2xl">{c.emoji || RELATION_EMOJI[c.relation]}</span>
                        <span className="text-[11px] font-bold leading-tight">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <ValueSection recommended={recommended} value={value} setValue={setValue} />

            <LengthStrip
              duration={duration}
              setDuration={setDuration}
              maxDuration={maxDuration}
              setUpgradeReason={setUpgradeReason}
              setUpgradeOpen={setUpgradeOpen}
            />

            <StartButton
              loading={loading}
              onClick={handleStart}
              disabled={selectedCharIds.length === 0}
              hint={selectedCharIds.length === 0 ? 'Pick at least one character' : null}
            />
          </div>
        )}

        {/* Error banner */}
        {storyError && (
          <div className="mt-4 rounded-2xl bg-negative/10 p-4 ring-1 ring-negative/20">
            <div className="text-sm font-bold text-negative">Story failed</div>
            <div className="mt-1 text-xs text-ink-muted">{storyError}</div>
          </div>
        )}
      </BottomSheet>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason={upgradeReason} />
    </>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
        active ? 'bg-gold text-bg-base shadow-glow' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ValueSection({ recommended, value, setValue }) {
  return (
    <section className="mb-6">
      <h2 className="ui-label mb-3">What should the story teach?</h2>
      <div className="relative -mx-5">
        <div className="overflow-x-auto px-5 py-1 scrollbar-hide">
          <div className="flex w-max gap-2.5 pr-8">
            {recommended.map((v) => (
              <ValuePill key={`rec-${v}`} value={v} active={value === v} onClick={() => setValue(v)} />
            ))}
            {VALUES.filter((v) => !recommended.includes(v.key)).map((v) => (
              <ValuePill key={v.key} value={v.key} active={value === v.key} onClick={() => setValue(v.key)} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-elevated to-transparent" />
      </div>
    </section>
  );
}

function StartButton({ loading, onClick, disabled, hint }) {
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={loading || disabled}
        className="w-full rounded-2xl bg-gold py-4 text-center text-base font-bold text-bg-base shadow-[0_4px_24px_rgba(240,165,0,0.3)] transition disabled:opacity-40"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {loading ? 'Weaving...' : "Start Tonight's Story"}
      </motion.button>
      {hint && (
        <p className="mt-2 text-center text-[10px] text-ink-dim">{hint}</p>
      )}
    </>
  );
}
