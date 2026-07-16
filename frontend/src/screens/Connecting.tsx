import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { connectToShop } from "../api/shops";
import { errorMessage } from "../lib/errors";

export function Connecting() {
  const navigate = useNavigate();
  const location = useLocation();
  const onion = (location.state as { onion?: string } | null)?.onion;
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!onion) {
      navigate("/browse", { replace: true });
      return;
    }

    connectToShop(onion)
      .then((path) => {
        window.location.assign(path);
      })
      .catch((error: unknown) => {
        navigate("/browse/error", {
          replace: true,
          state: { onion, error: errorMessage(error) },
        });
      });
  }, [onion, navigate]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-base px-8 text-center">
      <Spinner size="lg" />
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-wide text-text">CONNECTING</h2>
        <p className="font-mono text-[12px] text-faint break-all">{onion}</p>
      </div>
    </div>
  );
}
