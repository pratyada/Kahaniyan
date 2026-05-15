// Gold floating action button for "Create Story".
// Positioned above BottomNav + PlayerBar, opens the CreateSheet.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer.jsx';

export default function CreateFAB({ onClick }) {
  const { current } = usePlayer();
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const nav = document.getElementById('bottom-nav');
      if (nav) setNavHeight(nav.offsetHeight);
    };
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  // When PlayerBar is visible, push FAB higher
  const bottomOffset = current ? navHeight + 72 : navHeight + 12;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="fixed right-5 lg:bottom-8 lg:right-8 z-30 grid h-14 w-14 place-items-center rounded-full shadow-lg"
      style={{
        bottom: bottomOffset,
        background: 'linear-gradient(135deg, #ffd98a 0%, #f0a500 50%, #b87f00 100%)',
        boxShadow: '0 4px 24px rgba(240,165,0,0.4), 0 0 60px rgba(240,165,0,0.15)',
        transition: 'bottom 0.3s ease',
      }}
    >
      <PenLine size={22} className="text-bg-base" />
    </motion.button>
  );
}
