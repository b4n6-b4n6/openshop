import { mockDelay, withTimeout } from "./client";
import type { CurrencyRates } from "./types";
import { ApiError } from "./types";

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

/**
 * Dev hook: set `localStorage.openshop_fail_rates = "1"` to simulate a rate
 * fetch failure and exercise the indefinite hard-block overlay.
 */
function shouldFail(): boolean {
  try {
    return localStorage.getItem("openshop_fail_rates") === "1";
  } catch {
    return false;
  }
}

export async function fetchCurrencyRates(): Promise<CurrencyRates> {
  return withTimeout(
    (async () => {
      await mockDelay(900);
      if (shouldFail()) {
        throw new ApiError("Could not fetch currency rates", "unreachable");
      }
      // mock: XMR price of 1 fiat unit
      return {
        base: "XMR" as const,
        rates: {
          USD: 0.00634,
          EUR: 0.00689,
          GBP: 0.00802,
          JPY: 0.0000421,
          AUD: 0.00418,
          CAD: 0.00463,
        },
        fetchedAt: Date.now(),
      };
    })(),
  );
}

/** Convert a fiat amount to XMR using fetched rates. */
export function fiatToXmr(amount: number, currency: string, rates: CurrencyRates): number {
  const rate = rates.rates[currency] ?? 0;
  return amount * rate;
}
