import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { formatFiat } from "../../lib/format";
import type { Product } from "../../api/types";

export function Thumb({ src, size = 56 }: { src?: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-faint"
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <ImageIcon className="size-5" />
      )}
    </div>
  );
}

export function ProductCard({
  product,
  action,
}: {
  product: Product;
  action?: ReactNode;
}) {
  const out = product.quantity <= 0;
  return (
    <Card className={cn("flex items-center gap-3", out && "opacity-60")}>
      <Thumb src={product.photo} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-text">{product.name}</p>
        <p className="text-[13px] text-muted">
          {formatFiat(product.price, product.currency)}
        </p>
        <div className="mt-1">
          {out ? (
            <Badge tone="danger">Out of stock</Badge>
          ) : (
            <span className="text-[12px] text-faint">{product.quantity} in stock</span>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Card>
  );
}
