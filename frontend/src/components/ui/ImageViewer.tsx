import { AnimatePresence, motion } from "motion/react";

/** Fullscreen image viewer. Tap anywhere to close. */
export function ImageViewer({
  src,
  open,
  onClose,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <img
            src={src}
            alt=""
            className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
