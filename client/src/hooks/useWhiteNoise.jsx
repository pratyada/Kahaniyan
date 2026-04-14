import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// useWhiteNoise — procedurally generated ambient sounds via
// the Web Audio API. No audio files needed, no costs, no CORS.
//
// 4 noise types:
//   - rain   : pink noise filtered to mid-highs
//   - ocean  : brown noise with slow LFO modulation
//   - fan    : white noise with notch filter
//   - drone  : low sine drone with subtle harmonics
//
// All run through a master gain so we can fade them in / out
// as the bedtime story narration fades down.
// ─────────────────────────────────────────────────────────────

export const NOISE_TYPES = [
  { key: 'rain', label: 'Soft Rain', icon: '🌧️', description: 'Steady rain on a tin roof' },
  { key: 'ocean', label: 'Ocean Waves', icon: '🌊', description: 'Slow waves on a quiet shore' },
  { key: 'fan', label: 'Water Stream', icon: '💧', description: 'Gentle flowing water' },
  { key: 'drone', label: 'Sleep Drone', icon: '🌙', description: 'Deep ambient pad' },
];

const NoiseCtx = createContext(null);

function createNoiseBuffer(audioCtx, type) {
  const length = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'rain' || type === 'fan') {
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'ocean') {
    // Brown noise (integrated white noise)
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }
  return buffer;
}

export function WhiteNoiseProvider({ children }) {
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);
  const droneNodesRef = useRef([]);

  const [active, setActive] = useState(null); // noise type key
  const [volume, setVolumeState] = useState(0.4);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtxRef.current = new AC();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = volume;
      gainRef.current.connect(audioCtxRef.current.destination);
    }
    return audioCtxRef.current;
  }, [volume]);

  const stop = useCallback(() => {
    try {
      sourceRef.current?.stop?.();
      sourceRef.current?.disconnect?.();
    } catch {
      // ignore
    }
    droneNodesRef.current.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        // ignore
      }
    });
    droneNodesRef.current = [];
    sourceRef.current = null;
    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch {
        // ignore
      }
      lfoRef.current = null;
    }
    setActive(null);
  }, []);

  const start = useCallback(
    (type) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      stop();

      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'drone') {
        // Layered low sine drones
        const freqs = [110, 165, 220];
        droneNodesRef.current = freqs.map((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = i === 2 ? 'triangle' : 'sine';
          osc.frequency.value = f;
          g.gain.value = 0.18 - i * 0.04;
          osc.connect(g);
          g.connect(gainRef.current);
          osc.start();
          return osc;
        });
        setActive(type);
        return;
      }

      // Buffer-based noise
      const buffer = createNoiseBuffer(ctx, type);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      // Filter chain per type
      let lastNode = src;
      if (type === 'rain') {
        // Gentle rain — lower frequencies, softer
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2500;
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 300;
        const softGain = ctx.createGain();
        softGain.gain.value = 0.3; // much quieter
        src.connect(lp);
        lp.connect(hp);
        hp.connect(softGain);
        lastNode = softGain;
      } else if (type === 'ocean') {
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 800;
        src.connect(lp);
        // Slow LFO on volume to simulate waves
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.13;
        lfoGain.gain.value = 0.35;
        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.55;
        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);
        lp.connect(waveGain);
        lfo.start();
        lfoRef.current = lfo;
        lastNode = waveGain;
      } else if (type === 'fan') {
        // Water stream — gentle low-mid flow, very soft
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 1800;
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 200;
        const softGain = ctx.createGain();
        softGain.gain.value = 0.25;
        src.connect(lp);
        lp.connect(hp);
        hp.connect(softGain);
        lastNode = softGain;
      }

      lastNode.connect(gainRef.current);
      src.start();
      sourceRef.current = src;
      setActive(type);
    },
    [ensureCtx, stop]
  );

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(v, audioCtxRef.current.currentTime + 0.05);
    }
  }, []);

  const fadeTo = useCallback((target, seconds) => {
    if (gainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainRef.current.gain.cancelScheduledValues(now);
      gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
      gainRef.current.gain.linearRampToValueAtTime(target, now + seconds);
      setVolumeState(target);
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return createElement(
    NoiseCtx.Provider,
    { value: { active, volume, setVolume, start, stop, fadeTo } },
    children
  );
}

export function useWhiteNoise() {
  const ctx = useContext(NoiseCtx);
  if (!ctx) throw new Error('useWhiteNoise must be used inside WhiteNoiseProvider');
  return ctx;
}
