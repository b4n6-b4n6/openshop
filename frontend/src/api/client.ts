import { ApiError } from "./types";

/**
 * Per the spec, every onion request has a 30s timeout with a real failure path.
 * This wrapper enforces it for the (future) real HTTP/WS client and the mocks.
 */
export const REQUEST_TIMEOUT_MS = 30_000;

export function withTimeout<T>(
  promise: Promise<T>,
  ms = REQUEST_TIMEOUT_MS,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(
      () => reject(new ApiError("Request timed out", "timeout")),
      ms,
    );
    promise.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      },
    );
  });
}

/** Simulate network latency for the mock layer. */
export function mockDelay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const API_BASE = import.meta.env.MODE === "onion" ? "./api" : "/api";

export async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await withTimeout(
    fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
    }),
  );

  if (!response.ok) {
    const message = await response.text();
    const code = response.status === 404 ? "not_found" : "unknown";
    throw new ApiError(message || `Request failed (${response.status})`, code);
  }

  return response.json() as Promise<T>;
}
