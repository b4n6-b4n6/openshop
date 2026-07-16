import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { probeConnectivity, probeWalletSync } from "../../api/indicators";
import type { IndicatorState, WalletState } from "../../api/types";
import { usePolling } from "../../lib/hooks";
import { useSession } from "./SessionProvider";

interface IndicatorsValue {
  connectivity: IndicatorState;
  wallet: WalletState | null; // null when not an owner
}

const IndicatorsContext = createContext<IndicatorsValue | null>(null);

const CONNECTIVITY_POLL_MS = 8000;
const WALLET_POLL_MS = 10000;

export function IndicatorsProvider({ children }: { children: ReactNode }) {
  const { role } = useSession();
  const [connectivity, setConnectivity] = useState<IndicatorState>("checking");
  const [wallet, setWallet] = useState<WalletState | null>(null);

  usePolling(async () => {
    setConnectivity((c) => (c === "checking" ? c : "checking"));
    try {
      const next = await probeConnectivity();
      setConnectivity(next);
    } catch (error) {
      console.error("Connectivity check failed", error);
      setConnectivity("offline");
    }
  }, CONNECTIVITY_POLL_MS);

  usePolling(
    async () => {
      try {
        const next = await probeWalletSync();
        setWallet(next);
      } catch (error) {
        console.error("Wallet sync check failed", error);
        setWallet("error");
      }
    },
    WALLET_POLL_MS,
    role === "owner",
  );

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
