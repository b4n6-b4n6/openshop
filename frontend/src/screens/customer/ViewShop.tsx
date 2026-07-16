import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Boxes, MessageSquare, ReceiptText } from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { Avatar, ShopBanner } from "../../components/ui/ShopMedia";
import { Button } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { Markdown } from "../../components/ui/Markdown";
import { Spinner } from "../../components/ui/Spinner";
import { truncateMiddle } from "../../lib/format";
import { getShop } from "../../api/shops";
import { ErrorNotice } from "../../components/ui/ErrorNotice";

export function ViewShop() {
  const navigate = useNavigate();

  const { data, isError, error, refetch } = useQuery({
    queryKey: ["shop", "public"],
    queryFn: getShop,
  });
  const shop = data;
  const openedThroughProxy = window.location.pathname.startsWith("/browser");
  const leaveProxy = openedThroughProxy
    ? () => window.location.assign("/browse")
    : undefined;

  if (isError) {
    return (
      <AppFrame title="Shop" onBack={leaveProxy}>
        <ErrorNotice error={error} title="Couldn't load this shop" onRetry={() => void refetch()} />
      </AppFrame>
    );
  }

  if (!shop) {
    return (
      <AppFrame title="Shop" onBack={leaveProxy}>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame title="Shop" onBack={leaveProxy}>
      <ShopBanner src={shop.bannerPhoto} />
      <div className="px-5">
        <div className="relative z-10 -mt-8 mb-3 w-fit">
          <Avatar src={shop.profilePhoto} size={72} />
        </div>
        <h2 className="text-xl font-bold text-text">{shop.name}</h2>
        <div className="mt-1 flex items-center gap-1">
          <span className="truncate font-mono text-[12px] text-muted">
            {truncateMiddle(shop.onion, 10, 10)}
          </span>
          <CopyButton value={shop.onion} label="Copy address" compact />
        </div>

        {shop.description && (
          <div className="mt-3">
            <Markdown>{shop.description}</Markdown>
          </div>
        )}

        <div className="mb-6 mt-5 flex flex-col gap-2.5">
          <Button
            leftIcon={<Boxes className="size-4" />}
            onClick={() => navigate("/products")}
          >
            Products
          </Button>
          <Button
            variant="secondary"
            leftIcon={<MessageSquare className="size-4" />}
            onClick={() => navigate("/chats")}
          >
            Chat
          </Button>
          <Button
            variant="secondary"
            leftIcon={<ReceiptText className="size-4" />}
            onClick={() => navigate("/orders")}
          >
            Orders
          </Button>
        </div>
      </div>
    </AppFrame>
  );
}
