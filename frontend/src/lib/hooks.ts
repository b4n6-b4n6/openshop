import { useCallback, useEffect, useRef, useState } from "react";

/** Run `fn` immediately and then every `intervalMs`. Pauses when disabled. */
export function usePolling(
  fn: () => void | Promise<void>,
  intervalMs: number,
  enabled = true,
) {
  const saved = useRef(fn);
  useEffect(() => {
    saved.current = fn;
  });
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const tick = () => {
      if (active) void saved.current();
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [intervalMs, enabled]);
}

/** True after `ms` has elapsed since mount; reset via the returned fn. */
export function useTimeout(ms: number): [boolean, () => void] {
  const [done, setDone] = useState(false);
  const reset = useCallback(() => setDone(false), []);
  useEffect(() => {
    const id = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return [done, reset];
}

/** Respects the user's prefers-reduced-motion setting. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Fullscreen enlarge toggle for QR codes and chat images. */
export function useEnlarge(): [boolean, () => void, () => void] {
  const [open, setOpen] = useState(false);
  return [open, () => setOpen(true), () => setOpen(false)];
}
