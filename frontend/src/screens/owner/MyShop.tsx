import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  MessageSquare,
  Pencil,
  Power,
  ReceiptText,
} from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { Avatar, ShopBanner } from "../../components/ui/ShopMedia";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CopyButton } from "../../components/ui/CopyButton";
import { QRView } from "../../components/ui/QRView";
import { Markdown } from "../../components/ui/Markdown";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { truncateMiddle } from "../../lib/format";
import { useSession } from "../../app/providers/SessionProvider";

function HubButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-border-strong"
    >
      <span className="text-accent">{icon}</span>
      <span className="flex-1 text-[15px] font-medium text-text">{label}</span>
    </button>
  );
}

export function MyShop() {
  const navigate = useNavigate();
  const { ownerShop, setOwnerShop } = useSession();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!ownerShop) navigate("/welcome", { replace: true });
  }, [ownerShop, navigate]);

  if (!ownerShop) return null;

  return (
    <AppFrame title="My Shop">
      <ShopBanner src={ownerShop.bannerPhoto} />
      <div className="px-5">
        <div className="relative z-10 -mt-8 mb-3 w-fit">
          <Avatar src={ownerShop.profilePhoto} size={72} />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-text">
              {ownerShop.name || "Unnamed shop"}
            </h2>
            <div className="mt-1 flex items-center gap-1">
              <span className="truncate font-mono text-[12px] text-muted">
                {truncateMiddle(ownerShop.onion, 10, 10)}
              </span>
              <CopyButton value={ownerShop.onion} label="Copy address" compact />
            </div>
          </div>
          <QRView value={ownerShop.onion} size={64} caption={ownerShop.onion} />
        </div>

        {ownerShop.description ? (
          <div className="mt-3">
            <Markdown>{ownerShop.description}</Markdown>
          </div>
        ) : (
          <p className="mt-3 text-[14px] text-faint">
            No description yet. Tap “Edit shop” to add one.
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Button
            variant="secondary"
            leftIcon={<Pencil className="size-4" />}
            onClick={() => navigate("/shop/edit")}
          >
            Edit shop
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Boxes className="size-4" />}
            onClick={() => navigate("/shop/products")}
          >
            Products
          </Button>
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          <HubButton
            icon={<ReceiptText className="size-5" />}
            label="View my orders"
            onClick={() => navigate("/shop/orders")}
          />
          <HubButton
            icon={<MessageSquare className="size-5" />}
            label="View my chats"
            onClick={() => navigate("/shop/chats")}
          />
        </div>

        <div className="my-6">
          <Button
            variant="danger"
            leftIcon={<Power className="size-4" />}
            onClick={() => setClosing(true)}
          >
            Close shop
          </Button>
        </div>
      </div>

      <BottomSheet open={closing} onClose={() => setClosing(false)} title="Close shop?">
        <Card className="mb-4 border-0 bg-transparent p-0">
          <p className="text-[14px] text-muted">
            Your onion service will stop and the shop becomes unreachable. You can reopen it
            later with the same wallet.
          </p>
        </Card>
        <div className="flex flex-col gap-2.5">
          <Button
            variant="danger"
            onClick={() => {
              setOwnerShop(null);
              navigate("/welcome", { replace: true });
            }}
          >
            Close shop
          </Button>
          <Button variant="ghost" onClick={() => setClosing(false)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </AppFrame>
  );
}
