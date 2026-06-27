/** Truncate a long hash-like string in the middle: abcd…wxyz */
export function truncateMiddle(value: string, head = 6, tail = 6): string {
  if (!value) return "";
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

/** Format an XMR amount: trim trailing zeros, keep up to 12 decimals. */
export function formatXmr(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "0";
  return n
    .toFixed(12)
    .replace(/\.?0+$/, "")
    .replace(/^(\d+)$/, "$1");
}

/** Format a fiat amount with its currency code, e.g. "39.98 USD". */
export function formatFiat(amount: number, currency: string): string {
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

/** Relative time for lists ("just now", "2h ago", "3d ago"). */
export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

/** Absolute date+time for detail screens. */
export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString();
}
