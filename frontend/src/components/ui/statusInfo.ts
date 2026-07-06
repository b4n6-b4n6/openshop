import type { IndicatorState, WalletState } from "../../api/types";

export type Tone = "success" | "danger" | "warning";

export const toneBg: Record<Tone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
};

export const toneText: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
};

export interface StatusInfo {
  tone: Tone;
  text: string;
  detail: string;
  pulse: boolean;
}

export const connInfo: Record<IndicatorState, StatusInfo> = {
  online: {
    tone: "success",
    text: "Online",
    detail: "Onion service reachable over Tor.",
    pulse: false,
  },
  offline: {
    tone: "danger",
    text: "Offline",
    detail: "Onion unreachable. P2P shops are often offline — this is normal.",
    pulse: false,
  },
  checking: {
    tone: "warning",
    text: "Checking",
    detail: "Checking onion reachability…",
    pulse: true,
  },
};

export const walletInfo: Record<WalletState, StatusInfo> = {
  synced: {
    tone: "success",
    text: "Synced",
    detail: "View-only wallet fully synced.",
    pulse: false,
  },
  syncing: {
    tone: "warning",
    text: "Syncing",
    detail: "Scanning the blockchain for deposits…",
    pulse: true,
  },
  error: {
    tone: "danger",
    text: "Wallet",
    detail: "Wallet sync error. Retrying…",
    pulse: false,
  },
};
