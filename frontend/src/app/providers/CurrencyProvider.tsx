import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchCurrencyRates } from "../../api/currency";
import type { CurrencyRates } from "../../api/types";
import { errorMessage } from "../../lib/errors";

type Status = "idle" | "loading" | "ready" | "error";

const REFRESH_MS = 10 * 60 * 1000; // spec: refresh every ~10 min

interface CurrencyValue {
  status: Status;
  rates: CurrencyRates | null;
  error: string | null;
  /** true while the app must be hard-blocked (no valid rates / refresh failed) */
  blocking: boolean;
  ensureLoaded: () => Promise<void>;
  retry: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const inflight = useRef<Promise<void> | null>(null);

  const load = useCallback(async () => {
    if (inflight.current) return inflight.current;
    setStatus((s) => (s === "ready" ? s : "loading"));
    const p = (async () => {
      try {
        const r = await fetchCurrencyRates();
        setRates(r);
        setLastError(null);
        setStatus("ready");
      } catch (error) {
        setLastError(errorMessage(error, "Currency rates could not be fetched."));
        setStatus("error");
      } finally {
        inflight.current = null;
      }
    })();
    inflight.current = p;
    return p;
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (status === "ready") return;
    await load();
  }, [status, load]);

  // fetch on mount so rates load no matter which route the app starts on
  // (reload / deep-link), not only via the Splash screen at "/"
  useEffect(() => {
    void load();
  }, [load]);

  // periodic refresh; a failed refresh flips us back into the blocking state
  useEffect(() => {
    const id = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const value = useMemo<CurrencyValue>(
    () => ({
      status,
      rates,
      error: lastError,
      blocking: status === "error" || (status !== "ready" && rates === null),
      ensureLoaded,
      retry: load,
    }),
    [status, rates, lastError, ensureLoaded, load],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
