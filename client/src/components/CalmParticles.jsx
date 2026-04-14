import { useEffect, useRef } from 'react';

// Entropy → Calm animation. Particles start scattered/chaotic and
// gradually settle into a peaceful grid — "calming your kid to sleep."
// Adapted from entropy concept, flipped: chaos → order.

export default function CalmParticles({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    let width = parent.clientWidth;
    let height = parent.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const GOLD = [240, 165, 0];
    const CREAM = [245, 240, 232];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 80;

    // Particles start scattered, drift toward their "home" position
    const particles = [];
    const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (width / height)));
    const rows = Math.ceil(PARTICLE_COUNT / cols);
    const spacingX = width / cols;
    const spacingY = height / rows;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const homeX = spacingX * col + spacingX / 2;
      const homeY = spacingY * row + spacingY / 2;
      const isGold = Math.random() < 0.3;
      const color = isGold ? GOLD : CREAM;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        homeX,
        homeY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1.2 + Math.random() * 1.2,
        color,
        alpha: 0.15 + Math.random() * 0.25,
        calm: 0, // 0 = chaotic, 1 = fully calm
      });
    }

    let animId;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time++;

      // Global calm increases over time (full calm in ~10 seconds)
      const globalCalm = Math.min(1, time / 600);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.calm = Math.min(1, p.calm + 0.002 + globalCalm * 0.003);

        // Chaotic force (decreases as calm increases)
        const chaos = 1 - p.calm;
        p.vx += (Math.random() - 0.5) * 0.3 * chaos;
        p.vy += (Math.random() - 0.5) * 0.3 * chaos;

        // Pull toward home (increases as calm increases)
        const dx = p.homeX - p.x;
        const dy = p.homeY - p.y;
        p.vx += dx * 0.003 * p.calm;
        p.vy += dy * 0.003 * p.calm;

        // Gentle breathing when calm (tiny oscillation)
        if (p.calm > 0.8) {
          const breath = Math.sin(time * 0.02 + i) * 0.15;
          p.vy += breath * p.calm;
        }

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary
        if (p.x < 0) p.x = 0;
        if (p.x > width) p.x = width;
        if (p.y < 0) p.y = 0;
        if (p.y > height) p.y = height;

        // Draw particle
        const alpha = p.alpha * (0.5 + p.calm * 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha})`;
        ctx.fill();

        // Connections (only to nearby particles, fade with distance)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < CONNECTION_DIST) {
            const lineAlpha = 0.06 * (1 - dist / CONNECTION_DIST) * Math.min(p.calm, q.calm);
            if (lineAlpha > 0.005) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const onResize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}
