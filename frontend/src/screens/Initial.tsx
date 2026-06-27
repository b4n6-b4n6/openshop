import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { ConnectivityPill } from "../components/ui/StatusPill";
import { useIndicators } from "../app/providers/IndicatorsProvider";

export function Initial() {
  const navigate = useNavigate();
  const { connectivity } = useIndicators();

  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col bg-base px-6">
      <div className="flex justify-end px-1 pt-[calc(env(safe-area-inset-top)+3rem)]">
        <ConnectivityPill state={connectivity} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-16 text-center">
        <div className="flex flex-col items-center gap-5">
          <Logo size={92} glow />
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-text">OpenShop</h1>
            <p className="max-w-[16rem] text-[14px] text-muted">
              Spin up your own Monero shop, or browse one by its onion address.
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button onClick={() => navigate("/create")}>Open New Shop</Button>
          <Button variant="secondary" onClick={() => navigate("/browse")}>
            Browse Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
