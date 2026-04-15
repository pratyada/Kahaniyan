import { motion } from 'framer-motion';

const PHRASES = [
  'Weaving your story…',
  'Gathering the characters…',
  'Painting the night sky…',
  'Finding the perfect words…',
  'Lighting the lanterns…',
  'Whispering to the moon…',
];

export default function StoryLoading() {
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg-base overflow-hidden">
      {/* Star field */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Aurora glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(40% 40% at 50% 50%, rgba(240,165,0,0.12), transparent)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative h-24 w-24"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Moon body */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffd98a, #f0a500 50%, #b87f00)',
              boxShadow: '0 0 60px rgba(240,165,0,0.4), 0 0 120px rgba(240,165,0,0.15)',
            }}
          />
          {/* Moon shadow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 65% 40%, transparent 40%, rgba(10,10,15,0.85) 80%)',
            }}
          />
        </motion.div>

        {/* Orbiting sparkle */}
        <motion.div
          className="absolute h-2 w-2 rounded-full bg-gold"
          style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [-50, 0, 50, 0, -50],
            opacity: [1, 0.6, 1, 0.6, 1],
            scale: [1, 0.6, 1, 0.6, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="font-display text-2xl font-bold text-gold">{phrase}</h2>

        {/* Animated dots */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-gold"
              animate={{
                y: [0, -12, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.p
          className="mt-6 text-sm text-ink-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          A fresh story, just for tonight
        </motion.p>
        <motion.p
          className="mt-3 text-xs text-ink-dim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          We'll notify once ready
        </motion.p>
      </motion.div>
    </div>
  );
}
