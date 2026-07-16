import { requestJson } from "./client";
import type { IndicatorState, WalletState } from "./types";

interface RuntimeStatus {
  connectivity: IndicatorState;
  wallet?: { sync?: WalletState | null };
}

export interface RuntimeIndicators {
  connectivity: IndicatorState;
  wallet: WalletState | null;
}

export async function probeRuntimeIndicators(): Promise<RuntimeIndicators> {
  const status = await requestJson<RuntimeStatus>("/status");
  return {
    connectivity: status.connectivity,
    wallet: status.wallet?.sync ?? null,
  };
}
