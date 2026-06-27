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

/** Toggle global mock mode (always true until the Node API is wired). */
export const USE_MOCKS = true;
