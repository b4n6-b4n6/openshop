import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { Logo } from "../components/ui/Logo";
import { createShop } from "../api/shops";
import type { WalletInput } from "../api/types";
import { useSession } from "../app/providers/SessionProvider";

export function ShopOpening() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOwnerShop } = useSession();
  const input = (location.state as { input?: WalletInput } | null)?.input;
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!input) {
      navigate("/create", { replace: true });
      return;
    }

    createShop(input)
      .then((shop) => {
        setOwnerShop(shop);
        navigate("/shop", { replace: true });
      })
      .catch(() => {
        navigate("/create", { replace: true });
      });
  }, [input, navigate, setOwnerShop]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-base px-8 text-center">
      <Logo size={72} glow />
      <Spinner size="lg" />
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-wide text-text">SPINNING UP ONION</h2>
        <p className="text-[13px] text-muted">Publishing your shop to the Tor network…</p>
      </div>
    </div>
  );
}
