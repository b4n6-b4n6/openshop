import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Card } from "../../components/ui/Card";
import { QRView } from "../../components/ui/QRView";
import { CopyButton } from "../../components/ui/CopyButton";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { formatFiat, formatXmr } from "../../lib/format";
import { getOrder } from "../../api/orders";

export function OrderScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  if (isLoading) {
    return (
      <AppFrame title="Order" back="/products">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppFrame>
    );
  }
  if (!order) {
    return (
      <AppFrame title="Order" back="/products">
        <p className="px-5 py-10 text-center text-[14px] text-muted">Order not found.</p>
      </AppFrame>
    );
  }

  const uri = `monero:${order.subaddress}?tx_amount=${order.amountXmr}`;

  return (
    <AppFrame
      title="Order"
      back="/products"
      bottomBar={
        <Button variant="secondary" onClick={() => navigate("/orders")}>
          View my orders
        </Button>
      }
    >
      <div className="space-y-4 px-5 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-text">{order.productName}</h2>
          <OrderStatusBadge status={order.status} />
        </div>

        <Card className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="font-mono text-3xl font-bold text-text">
              {formatXmr(order.amountXmr)}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">XMR</p>
          </div>
          <p className="text-[13px] text-faint">
            ≈ {formatFiat(order.amountFiat, order.currency)}
          </p>

          <QRView value={uri} size={168} caption={order.subaddress} />

          <div className="w-full">
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted">
              Pay to this address
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3">
              <span className="min-w-0 flex-1 break-all font-mono text-[12px] text-text">
                {order.subaddress}
              </span>
              <CopyButton value={order.subaddress} label="Copy" compact />
            </div>
          </div>
        </Card>

        <p className="text-center text-[12px] text-faint">
          Send exactly this amount in Monero. Your order is confirmed automatically once the
          deposit reaches enough confirmations. This address is unique to this order.
        </p>
      </div>
    </AppFrame>
  );
}
