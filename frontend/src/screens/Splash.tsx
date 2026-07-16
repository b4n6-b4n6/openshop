import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../app/providers/CurrencyProvider";
import { useReducedMotion, useTimeout } from "../lib/hooks";

/**
 * Branded launch screen. While visible we boot the app: fetch currency rates
 * (the spec's hard-block). On success we hand off to /welcome; on failure we
 * stay here with a Retry (we never enter the app on stale/absent rates).
 */
export function Splash() {
  const navigate = useNavigate();
  const { status, error, ensureLoaded, retry } = useCurrency();
  const [minElapsed] = useTimeout(900);
  const reduced = useReducedMotion();

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  useEffect(() => {
    if (status === "ready" && minElapsed) {
      navigate("/welcome", { replace: true });
    }
  }, [status, minElapsed, navigate]);

  const failed = status === "error";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-base px-8 text-center">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-5"
      >
        <motion.div
          animate={reduced || failed ? {} : { opacity: [1, 0.82, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Logo size={108} glow />
        </motion.div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-text">OpenShop</h1>
        </div>
      </motion.div>

      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        {failed ? (
          <div className="w-64 space-y-3">
            <p role="alert" className="text-[13px] text-danger">
              {error || "Couldn't fetch currency rates."}
            </p>
            <Button variant="secondary" onClick={() => void retry()}>
              Retry
            </Button>
          </div>
        ) : (
          <p className="text-[12px] text-faint">Updating currency rates…</p>
        )}
      </div>
    </div>
  );
}
