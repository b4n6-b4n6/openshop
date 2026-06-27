import { mockDelay } from "./client";
import type { IndicatorState, WalletState } from "./types";

/**
 * Mock connectivity probe. Mostly online, occasionally flips to offline so the
 * UI's offline/checking states are observable. Real impl pings the onion.
 */
export async function probeConnectivity(): Promise<IndicatorState> {
  await mockDelay(400);
  return Math.random() < 0.12 ? "offline" : "online";
}

/** Mock wallet-sync status (owner only). Occasionally syncing. */
export async function probeWalletSync(): Promise<WalletState> {
  await mockDelay(400);
  const r = Math.random();
  if (r < 0.1) return "error";
  if (r < 0.3) return "syncing";
  return "synced";
}
