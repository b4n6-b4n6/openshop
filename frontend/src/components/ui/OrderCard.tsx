import { Card } from "./Card";
import { OrderStatusBadge } from "./Badge";
import { CopyButton } from "./CopyButton";
import { Thumb } from "./ProductCard";
import {
  formatFiat,
  formatRelative,
  formatXmr,
  truncateMiddle,
} from "../../lib/format";
import type { Order } from "../../api/types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <Thumb src={order.productPhoto} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-text">
            {order.productName}
          </p>
          <p className="text-[13px] text-muted">
            {order.quantity} × · {formatFiat(order.price, order.currency)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2.5 text-[12px]">
        <span className="font-mono text-muted">{formatXmr(order.amountXmr)} XMR</span>
        <span className="text-faint">{formatRelative(order.createdAt)}</span>
      </div>

      {order.txid && (
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-faint">txid</span>
          <span className="flex items-center gap-1 font-mono text-muted">
            {truncateMiddle(order.txid, 8, 8)}
            <CopyButton value={order.txid} label="Copy txid" compact />
          </span>
        </div>
      )}
    </Card>
  );
}
