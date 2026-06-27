import { cn } from "../../lib/cn";
import { OnionIcon } from "./OnionIcon";
import { connInfo, toneBg, toneText, walletInfo, type Tone } from "./statusInfo";
import type { IndicatorState, WalletState } from "../../api/types";

function Dot({ tone, pulse }: { tone: Tone; pulse?: boolean }) {
  return (
    <span className="relative inline-flex size-2.5">
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            toneBg[tone],
          )}
        />
      )}
      <span className={cn("relative inline-flex size-2.5 rounded-full", toneBg[tone])} />
    </span>
  );
}

const pillShell =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-2 pr-2.5 text-[12px] font-medium text-muted";

export function ConnectivityPill({ state }: { state: IndicatorState }) {
  const i = connInfo[state];
  return (
    <span className={pillShell}>
      <OnionIcon size={13} className={cn(toneText[i.tone], i.pulse && "animate-pulse")} />
      {i.text}
    </span>
  );
}

export function WalletPill({ state }: { state: WalletState }) {
  const i = walletInfo[state];
  return (
    <span className={pillShell}>
      <Dot tone={i.tone} pulse={i.pulse} />
      {i.text}
    </span>
  );
}
