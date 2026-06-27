import { useNavigate } from "react-router-dom";
import { WifiOff } from "lucide-react";
import { Button } from "../components/ui/Button";

export function BrowseError() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-5 bg-base px-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-danger/15 text-danger">
        <WifiOff className="size-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold tracking-wide text-text">ERROR</h2>
        <p className="max-w-[16rem] text-[14px] text-muted">
          Couldn&apos;t reach that shop. It may be offline — that&apos;s normal for P2P shops.
          Try again later.
        </p>
      </div>
      <div className="w-60 pt-2">
        <Button variant="secondary" onClick={() => navigate("/browse")}>
          Back
        </Button>
      </div>
    </div>
  );
}
