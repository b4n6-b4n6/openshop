import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-[480px] rounded-t-[20px] border-t border-border bg-surface pb-safe"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border-strong" />
            {title && (
              <h3 className="px-5 pb-1 pt-3 text-[15px] font-bold text-text">{title}</h3>
            )}
            <div className="px-5 py-3">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
