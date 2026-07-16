import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { Logo } from "../components/ui/Logo";
import { createShop, type ShopOpeningProgress } from "../api/shops";
import type { WalletInput } from "../api/types";
import { useSession } from "../app/providers/SessionProvider";
import { errorField, errorMessage } from "../lib/errors";

export function ShopOpening() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOwnerShop } = useSession();
  const input = (location.state as { input?: WalletInput } | null)?.input;
  const started = useRef(false);
  const [progress, setProgress] = useState<ShopOpeningProgress>({ stage: "wallet" });

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!input) {
      navigate("/create", { replace: true });
      return;
    }

    createShop(input, setProgress)
      .then((shop) => {
        setOwnerShop(shop);
        navigate("/shop", { replace: true });
      })
      .catch((error: unknown) => {
        navigate("/create", {
          replace: true,
          state: {
            input,
            error: errorMessage(error, "The shop could not be opened."),
            field: errorField(error),
          },
        });
      });
  }, [input, navigate, setOwnerShop]);

  const startingOnion = progress.stage === "onion";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-base px-8 text-center">
      <Logo size={72} glow />
      <Spinner size="lg" />
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-wide text-text">
          {startingOnion ? "STARTING SHOP ONION" : "RESTORING VIEW-ONLY WALLET"}
        </h2>
        <p className="text-[13px] text-muted">
          {startingOnion
            ? "This hidden service is separate from the browsing Tor proxy."
            : "Validating the wallet details before starting Tor…"}
        </p>
        {startingOnion && progress.percent !== undefined && (
          <p className="font-mono text-[12px] text-faint">Tor bootstrap: {progress.percent}%</p>
        )}
      </div>
    </div>
  );
}
