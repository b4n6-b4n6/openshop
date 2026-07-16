import { useLocation, type Location } from "react-router-dom";
import type { ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SessionProvider } from "./app/providers/SessionProvider";
import { CurrencyProvider, useCurrency } from "./app/providers/CurrencyProvider";
import { IndicatorsProvider } from "./app/providers/IndicatorsProvider";
import { ToastProvider } from "./app/providers/ToastProvider";
import { BlockingOverlay } from "./components/ui/BlockingOverlay";
import { ToastViewport } from "./components/ui/ToastViewport";
import { useReducedMotion } from "./lib/hooks";
import { GlobalErrorReporter } from "./app/providers/GlobalErrorReporter";
import { MessageNotificationProvider } from "./app/providers/MessageNotificationProvider";


function CurrencyGate() {
  const { blocking, status, error, retry } = useCurrency();
  const { pathname } = useLocation();
  if (!blocking || pathname === "/") return null;
  const failed = status === "error";
  return (
    <BlockingOverlay
      title={failed ? "Couldn't update currency rates" : "Updating currency rates…"}
      detail={
        failed
          ? error || "OpenShop won't run on stale rates. Reconnect and retry."
          : "Fetching the latest Monero exchange rates…"
      }
      failed={failed}
      onRetry={() => void retry()}
    />
  );
}

/**
 * Cross-fade between routes. Opacity-only on purpose — a lingering transform on
 * an ancestor would re-anchor position:fixed overlays (modals, QR, blocking
 * overlay), so we never animate translate here.
 */
interface RoutesProps {
  location?: Location;
}

function AnimatedRoutes({ RoutesComponent }: { RoutesComponent: ComponentType<RoutesProps> }) {
  const location = useLocation();
  const reduced = useReducedMotion();
  return (
    <div className="h-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
        >
          <RoutesComponent location={location} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App({ RoutesComponent }: { RoutesComponent: ComponentType<RoutesProps> }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <IndicatorsProvider>
          <ToastProvider>
            <MessageNotificationProvider>
              <GlobalErrorReporter />
              <AnimatedRoutes RoutesComponent={RoutesComponent} />
              <CurrencyGate />
              <ToastViewport />
            </MessageNotificationProvider>
          </ToastProvider>
        </IndicatorsProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
