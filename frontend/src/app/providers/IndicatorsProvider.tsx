import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { probeRuntimeIndicators } from "../../api/indicators";
import type { IndicatorState, WalletState } from "../../api/types";
import { usePolling } from "../../lib/hooks";
import { useSession } from "./SessionProvider";

interface IndicatorsValue {
  connectivity: IndicatorState;
  wallet: WalletState | null; // null when not an owner
}

const IndicatorsContext = createContext<IndicatorsValue | null>(null);

const CONNECTIVITY_POLL_MS = 8000;

export function IndicatorsProvider({ children }: { children: ReactNode }) {
  const { role } = useSession();
  const [connectivity, setConnectivity] = useState<IndicatorState>("checking");
  const [wallet, setWallet] = useState<WalletState | null>(null);

  usePolling(async () => {
    try {
      const next = await probeRuntimeIndicators();
      setConnectivity(next.connectivity);
      setWallet(role === "owner" ? next.wallet ?? "syncing" : null);
    } catch (error) {
      console.error("Runtime status check failed", error);
      setConnectivity("offline");
      setWallet(role === "owner" ? "error" : null);
    }
  }, CONNECTIVITY_POLL_MS);

  const value = useMemo<IndicatorsValue>(
    () => ({ connectivity, wallet: role === "owner" ? wallet : null }),
    [connectivity, wallet, role],
  );

  return (
    <IndicatorsContext.Provider value={value}>{children}</IndicatorsContext.Provider>
  );
}

export function useIndicators(): IndicatorsValue {
  const ctx = useContext(IndicatorsContext);
  if (!ctx) throw new Error("useIndicators must be used within IndicatorsProvider");
  return ctx;
}
