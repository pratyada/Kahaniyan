// Reusable bottom sheet with backdrop + drag-to-dismiss.
// Uses Framer Motion for smooth open/close animations.

import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ open, onClose, children, className = '' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className={`fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[640px] rounded-t-3xl bg-bg-elevated ${className}`}
            style={{ maxHeight: '85vh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>
            {/* Content */}
            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 2rem)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
