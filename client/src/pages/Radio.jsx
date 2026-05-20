// Radio — globe + station picker for 10 global bedtime stations.

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import RadioGlobe from '../components/RadioGlobe.jsx';
import SoundBars from '../components/SoundBars.jsx';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { useRadio } from '../hooks/useRadio.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { db } from '../lib/firebase.js';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';

export default function Radio() {
  const { t } = useTranslation();
  const { stationId, playing, loading, error, togglePlayPause, volume, setVolume } = useRadio();
  const { user } = useAuth();
  const [likes, setLikes] = useState({});
  const [toast, setToast] = useState(null);
  const [countryFilter, setCountryFilter] = useState(null);

  // Unique countries for filter chips
  const countries = useMemo(() => {
    const seen = new Map();
    RADIO_STATIONS.forEach((s) => {
      if (!seen.has(s.country)) seen.set(s.country, s.flag);
    });
    return [...seen.entries()].map(([name, flag]) => ({ name, flag }));
  }, []);

  const filtered = useMemo(
    () => countryFilter ? RADIO_STATIONS.filter((s) => s.country === countryFilter) : RADIO_STATIONS,
    [countryFilter]
  );

  // Globe markers from stations
  const globeMarkers = useMemo(
    () => RADIO_STATIONS.map((s) => ({ id: s.id, location: s.location })),
    []
  );

  // Real-time likes from Firestore
  useEffect(() => {
    if (!db) return;
    const unsubs = RADIO_STATIONS.map((s) =>
      onSnapshot(doc(db, 'radioLikes', s.id), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLikes((prev) => ({
            ...prev,
            [s.id]: {
              count: data.likes || 0,
              liked: user ? (data.likedBy || []).includes(user.uid) : false,
            },
          }));
        }
      }, () => {})
    );
    return () => unsubs.forEach((u) => u());
  }, [user]);

  const handleLike = async (station) => {
    if (!user) { showToast('Sign in to like'); return; }
    if (!db) return;
    const ref = doc(db, 'radioLikes', station.id);
    const current = likes[station.id] || { count: 0, liked: false };
    setLikes((prev) => ({
      ...prev,
      [station.id]: { count: current.liked ? current.count - 1 : current.count + 1, liked: !current.liked },
    }));
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { likes: 1, likedBy: [user.uid], name: station.name });
      } else if (current.liked) {
        await updateDoc(ref, { likes: increment(-1), likedBy: arrayRemove(user.uid) });
      } else {
        await updateDoc(ref, { likes: increment(1), likedBy: arrayUnion(user.uid) });
      }
    } catch {
      setLikes((prev) => ({ ...prev, [station.id]: current }));
    }
  };

  const handleShare = async (station) => {
    const url = `https://mysleepytale.com/radio?station=${station.id}`;
    const text = `Listening to ${station.name} on My Sleepy Tale Radio — ${station.tagline}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${station.name} — My Sleepy Tale Radio`, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast('Link copied!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') showToast('Could not share');
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handlePlay = (station) => {
    if (!user) {
      if (window.__triggerLogin) window.__triggerLogin();
      else showToast('Sign in to listen');
      return;
    }
    togglePlayPause(station);
  };

  const activeStation = RADIO_STATIONS.find((s) => s.id === stationId);

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-4 lg:mb-6">
        <p className="ui-label">Radio</p>
        <h1 className="display-title mt-1 text-ink">
          Global <span className="text-gold">Stations</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          10 handpicked streams from around the world. Spin the globe or pick a country.
        </p>
      </header>

      {/* Globe + Now Playing — side by side on desktop */}
      <div className="lg:flex lg:items-start lg:gap-8 mb-6">
        {/* Globe */}
        <div className="mx-auto mb-6 w-64 lg:w-80 lg:shrink-0 lg:mb-0">
          <RadioGlobe
            markers={globeMarkers}
            activeId={stationId}
          />
        </div>

        {/* Now Playing card (shows when a station is active) */}
        <AnimatePresence>
          {activeStation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 rounded-3xl bg-bg-elevated p-5 ring-1 ring-gold/30 shadow-lift mb-6 lg:mb-0"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
                  style={{ background: `linear-gradient(135deg, ${activeStation.accent}aa, ${activeStation.accent}22)` }}
                >
                  {activeStation.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {playing && <SoundBars />}
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                      {loading ? t('radio.connecting') : playing ? t('player.nowPlaying') : t('radio.paused')}
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
                    {activeStation.name}
                  </h2>
                  <p className="text-xs text-ink-muted">{activeStation.flag} {activeStation.country} · {activeStation.tagline}</p>
                </div>
                <button
                  onClick={() => handlePlay(activeStation)}
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95"
                >
                  {playing ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <span className="text-sm">🔉</span>
                <input
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="kahaniyo-range flex-1" aria-label="Volume"
                />
                <span className="w-8 text-right text-[11px] font-bold text-ink-muted">
                  {Math.round(volume * 100)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Country filter chips */}
      <div className="relative mb-4 -mx-5">
        <div className="overflow-x-auto px-5 py-1 scrollbar-hide">
          <div className="flex w-max gap-2 pr-8">
            <button
              onClick={() => setCountryFilter(null)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                !countryFilter ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
              }`}
            >
              🌍 All
            </button>
            {countries.map((c) => (
              <button
                key={c.name}
                onClick={() => setCountryFilter(countryFilter === c.name ? null : c.name)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                  countryFilter === c.name ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
                }`}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-base to-transparent" />
      </div>

      {/* Station grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s, i) => {
          const isActive = stationId === s.id;
          const isPlaying = isActive && playing;
          const isLoading = isActive && loading;
          const likeData = likes[s.id] || { count: 0, liked: false };

          return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`overflow-hidden rounded-2xl ring-1 transition ${
                isActive ? 'bg-bg-elevated shadow-lift ring-gold/40' : 'bg-bg-surface shadow-card ring-white/5'
              }`}
            >
              {/* Station card */}
              <button
                onClick={() => handlePlay(s)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl"
                  style={{ background: `linear-gradient(135deg, ${s.accent}aa, ${s.accent}22)` }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{s.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-dim">{s.country}</span>
                  </div>
                  <h3 className="mt-0.5 text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
                    {s.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-muted">{s.tagline}</p>
                </div>
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                  isActive ? 'bg-gold text-bg-base shadow-glow' : 'bg-bg-card text-gold'
                }`}>
                  {isLoading ? (
                    <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current" />
                  ) : isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Bottom row: best for + like + share */}
              <div className="flex items-center gap-2 border-t border-white/5 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">
                  {isPlaying ? '' : s.bestFor}
                </span>
                {isPlaying && <SoundBars />}
                {isPlaying && <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{t('radio.live')}</span>}
                <div className="flex-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(s); }}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                    likeData.liked ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-ink-muted'
                  }`}
                >
                  {likeData.liked ? '❤️' : '🤍'} {likeData.count || ''}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(s); }}
                  className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold transition active:scale-95"
                >
                  ↗
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl bg-warning/10 p-3 text-[11px] leading-relaxed text-warning ring-1 ring-warning/20">
            Some streams may be blocked by your network or browser. Try another station or a different network.
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-[10px] text-ink-dim">
        Streams provided by SomaFM — free and community-supported.
      </p>

      <div className="h-32" />
    </PageTransition>
  );
}
