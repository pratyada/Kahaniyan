import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const PHRASES = [
  'Weaving your story…',
  'Gathering the characters…',
  'Painting the night sky��',
  'Finding the perfect words…',
  'Lighting the lanterns…',
  'Whispering to the moon…',
  'Choosing the best sounds…',
  'Making it giggly…',
  'Adding a sprinkle of magic…',
  'Almost there���',
];

const TIPS = [
  'Dim the lights and get cozy',
  'Tuck them in and lower the volume',
  'The story is being crafted just for tonight',
  'A perfect time to wind down together',
];

export default function StoryLoading() {
  const [idx, setIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [volume, setVolume] = useState(null);
  const [radioCtx, setRadioCtx] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PHRASES.length), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Try to connect to radio context to control volume
  useEffect(() => {
    (async () => {
      try {
        const mod = await import('../hooks/useRadio.jsx');
        // We can't use hooks outside React, so we check for global audio
        // The radio audio element is accessible via the context
        setRadioCtx(mod);
      } catch {}
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full overflow-hidden">
      {/* Star field */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/80"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Aurora */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(40% 40% at 50% 50%, rgba(240,165,0,0.12), transparent)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moon */}
      <motion.div className="relative mb-8" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <motion.div className="relative h-24 w-24" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #ffd98a, #f0a500 50%, #b87f00)', boxShadow: '0 0 60px rgba(240,165,0,0.4)' }} />
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 65% 40%, transparent 40%, rgba(10,10,15,0.85) 80%)' }} />
        </motion.div>
        <motion.div
          className="absolute h-2 w-2 rounded-full bg-gold"
          style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
          animate={{ x: [0, 50, 0, -50, 0], y: [-50, 0, 50, 0, -50], opacity: [1, 0.6, 1, 0.6, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Cycling phrase */}
      <div className="relative text-center h-10">
        <AnimatePresence mode="wait">
          <motion.h2
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="font-display text-2xl font-bold text-gold"
          >
            {PHRASES[idx]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-gold"
            animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Cozy tip */}
      <div className="mt-6 text-center h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-ink-muted"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {TIPS[tipIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Volume control */}
      <VolumeControl />

      <motion.p className="mt-4 text-xs text-ink-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
        We'll notify once ready
      </motion.p>
    </div>
  );
}

function VolumeControl() {
  const [vol, setVol] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  // Find any playing audio elements (radio, etc.)
  useEffect(() => {
    const check = () => {
      const audios = document.querySelectorAll('audio');
      for (const a of audios) {
        if (a.src && !a.paused) {
          setVol(a.volume);
          setMuted(a.volume === 0);
          setHasAudio(true);
          return;
        }
      }
      // Check if radio context has a playing stream
      setHasAudio(audios.length > 0);
    };
    check();
    const t = setInterval(check, 1000);
    return () => clearInterval(t);
  }, []);

  const handleVolumeChange = (newVol) => {
    setVol(newVol);
    setMuted(newVol === 0);
    // Apply to all playing audio elements
    document.querySelectorAll('audio').forEach((a) => {
      a.volume = newVol;
    });
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    const newVol = newMuted ? 0 : 0.7;
    setVol(newVol);
    document.querySelectorAll('audio').forEach((a) => {
      a.volume = newVol;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm ring-1 ring-white/10"
      style={{ width: '240px' }}
    >
      <button onClick={toggleMute} className="text-ink-muted transition hover:text-gold active:scale-95">
        {muted || vol === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={vol}
        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5 appearance-none rounded-full bg-white/10 outline-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f0a500 ${vol * 100}%, rgba(255,255,255,0.1) ${vol * 100}%)`,
        }}
      />
      <span className="text-[10px] font-bold text-ink-dim w-7 text-right">{Math.round(vol * 100)}%</span>
    </motion.div>
  );
}
