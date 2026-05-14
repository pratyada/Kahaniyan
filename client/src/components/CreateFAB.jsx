// Gold floating action button for "Create Story".
// Positioned above BottomNav, opens the CreateSheet.

import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';

export default function CreateFAB({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 z-30 grid h-14 w-14 place-items-center rounded-full shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #ffd98a 0%, #f0a500 50%, #b87f00 100%)',
        boxShadow: '0 4px 24px rgba(240,165,0,0.4), 0 0 60px rgba(240,165,0,0.15)',
      }}
    >
      <PenLine size={22} className="text-bg-base" />
    </motion.button>
  );
}
