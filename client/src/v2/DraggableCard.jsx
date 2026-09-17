// Draggable, 3D-tilt card with a glare sweep and velocity "throw" — ported from the
// 21st.dev/shadcn draggable-card to OUR stack: framer-motion (not motion/react), plain
// JSX (no TypeScript), no shadcn, no external assets. Kept the physics feel intact.
import React, { useRef, useState, useEffect } from 'react';
import {
  motion, useMotionValue, useSpring, useTransform, animate, useVelocity, useAnimationControls,
} from 'framer-motion';

export function DraggableCardContainer({ className = '', children }) {
  return <div className={className} style={{ perspective: '2600px' }}>{children}</div>;
}

export function DraggableCardBody({ className = '', style, constraintsRef, children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);
  const controls = useAnimationControls();
  const [winConstraints, setWinConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);
  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-14, 14]), springConfig);
  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.85, 1, 0.85]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.16, 0, 0.16]), springConfig);

  useEffect(() => {
    const upd = () => {
      if (typeof window !== 'undefined') {
        setWinConstraints({ top: -window.innerHeight / 2, left: -window.innerWidth / 2, right: window.innerWidth / 2, bottom: window.innerHeight / 2 });
      }
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  const handleMouseMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0, top: 0 };
    mouseX.set(e.clientX - (r.left + r.width / 2));
    mouseY.set(e.clientY - (r.top + r.height / 2));
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraintsRef || winConstraints}
      dragElastic={0.18}
      onDragStart={() => { document.body.style.cursor = 'grabbing'; }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = 'default';
        controls.start({ rotateX: 0, rotateY: 0, transition: { type: 'spring', ...springConfig } });
        const vx = velocityX.get();
        const vy = velocityY.get();
        const mag = Math.sqrt(vx * vx + vy * vy);
        const bounce = Math.min(0.8, mag / 1000);
        animate(info.point.x, info.point.x + vx * 0.3, { duration: 0.8, ease: [0.2, 0, 0, 1], bounce, type: 'spring', stiffness: 50, damping: 15, mass: 0.8 });
        animate(info.point.y, info.point.y + vy * 0.3, { duration: 0.8, ease: [0.2, 0, 0, 1], bounce, type: 'spring', stiffness: 50, damping: 15, mass: 0.8 });
      }}
      style={{ rotateX, rotateY, opacity, willChange: 'transform', ...style }}
      animate={controls}
      whileHover={{ scale: 1.03 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl shadow-2xl touch-none select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
      <motion.div style={{ opacity: glareOpacity }} className="pointer-events-none absolute inset-0 bg-white mix-blend-overlay" />
    </motion.div>
  );
}
