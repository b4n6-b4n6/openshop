import { useParams } from "react-router-dom";
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
import { connectToShop } from "../../api/shops";
import { useSession } from "../../app/providers/SessionProvider";

export function ViewShop() {
  const { onion = "" } = useParams();
  const decoded = decodeURIComponent(onion);
  const navigate = useNavigate();
  const { browsedShop } = useSession();

  const { data } = useQuery({
    queryKey: ["shop", decoded],
    queryFn: () => connectToShop(decoded),
    enabled: !browsedShop,
  });
  const shop = browsedShop ?? data;
  const base = `/s/${onion}`;

  if (!shop) {
    return (
      <AppFrame title="Shop" back="/browse">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame title="Shop" back="/browse">
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
            onClick={() => navigate(`${base}/products`)}
          >
            Products
          </Button>
          <Button
            variant="secondary"
            leftIcon={<MessageSquare className="size-4" />}
            onClick={() => navigate(`${base}/chats`)}
          >
            Chat
          </Button>
          <Button
            variant="secondary"
            leftIcon={<ReceiptText className="size-4" />}
            onClick={() => navigate(`${base}/orders`)}
          >
            Orders
          </Button>
        </div>
      </div>
    </AppFrame>
  );
}
