import { ApiError } from "../api/types";

export function errorMessage(
  error: unknown,
  fallback = "OpenShop could not complete that action. Please try again.",
): string {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

export function errorField(error: unknown): string | undefined {
  return error instanceof ApiError ? error.field : undefined;
}
