import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/cn";
import { ConnectivityPill, WalletPill } from "./StatusPill";
import { connInfo, toneBg, walletInfo, type StatusInfo } from "./statusInfo";
import { useIndicators } from "../../app/providers/IndicatorsProvider";

type Panel = "conn" | "wallet";

function Detail({ title, info }: { title: string; info: StatusInfo }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full", toneBg[info.tone])} />
        <span className="text-[13px] font-semibold text-text">{title}</span>
        <span className="ml-auto text-[12px] text-muted">{info.text}</span>
      </div>
      <p className="text-[12px] leading-relaxed text-muted">{info.detail}</p>
    </div>
  );
}

/** Tappable connectivity + wallet indicators with a detail popover. */
export function StatusIndicators() {
  const { connectivity, wallet } = useIndicators();
  const [open, setOpen] = useState<Panel | null>(null);

  function toggle(panel: Panel) {
    setOpen((cur) => (cur === panel ? null : panel));
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {wallet && (
        <button aria-label="Wallet sync status" onClick={() => toggle("wallet")}>
          <WalletPill state={wallet} />
        </button>
      )}
      <button aria-label="Connectivity status" onClick={() => toggle("conn")}>
        <ConnectivityPill state={connectivity} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-border bg-surface p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              {open === "conn" ? (
                <Detail title="Connectivity" info={connInfo[connectivity]} />
              ) : (
                wallet && <Detail title="Wallet sync" info={walletInfo[wallet]} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
