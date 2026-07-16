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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  let rawBody: string;

  try {
    response = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    rawBody = await response.text();
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiError("The request timed out after 30 seconds.", "timeout", { cause: error });
    }
    throw new ApiError(
      "OpenShop could not reach the server. Check the connection and try again.",
      "unreachable",
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }

  let body: unknown;
  if (rawBody) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const payload = body as {
      error?: { message?: string; code?: string; field?: string };
    } | null;
    const fallbackCode = response.status === 404 ? "not_found" : "unknown";
    throw new ApiError(
      payload?.error?.message || `The request failed (${response.status}).`,
      payload?.error?.code || fallbackCode,
      { status: response.status, field: payload?.error?.field },
    );
  }

  if (!rawBody) return undefined as T;
  if (body === null) {
    throw new ApiError("The server returned an invalid response.", "invalid_response", {
      status: response.status,
    });
  }
  return body as T;
}
