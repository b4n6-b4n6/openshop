import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Thumb } from "../../components/ui/ProductCard";
import { Markdown } from "../../components/ui/Markdown";
import { NumberStepper } from "../../components/ui/NumberStepper";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { formatFiat } from "../../lib/format";
import { getProduct } from "../../api/products";
import { createOrder } from "../../api/orders";
import { useCurrency } from "../../app/providers/CurrencyProvider";

export function PurchaseProduct() {
  const { onion = "", id = "" } = useParams();
  const navigate = useNavigate();
  const base = `/s/${onion}`;
  const { rates } = useCurrency();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });
  const [qty, setQty] = useState(1);
  const [placing, setPlacing] = useState(false);

  if (isLoading) {
    return (
      <AppFrame title="Purchase" back={`${base}/products`}>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppFrame>
    );
  }
  if (!product) {
    return (
      <AppFrame title="Purchase" back={`${base}/products`}>
        <p className="px-5 py-10 text-center text-[14px] text-muted">Product not found.</p>
      </AppFrame>
    );
  }

  const out = product.quantity <= 0;

  async function purchase() {
    if (!rates || !product || out) return;
    setPlacing(true);
    const order = await createOrder(product, qty, rates);
    navigate(`${base}/orders/${order.id}`, { replace: true });
  }

  return (
    <AppFrame
      title="Purchase"
      back={`${base}/products`}
      bottomBar={
        <Button loading={placing} disabled={out} onClick={purchase}>
          {out ? "Out of stock" : `Purchase · ${formatFiat(product.price * qty, product.currency)}`}
        </Button>
      }
    >
      <div className="space-y-5 px-5 py-6">
        <div className="flex items-center gap-3">
          <Thumb src={product.photo} size={64} />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-text">{product.name}</h2>
            <p className="text-[14px] text-muted">
              {formatFiat(product.price, product.currency)}
            </p>
          </div>
        </div>

        {product.description && <Markdown>{product.description}</Markdown>}

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted">Availability</span>
          {out ? (
            <Badge tone="danger">Out of stock</Badge>
          ) : (
            <span className="text-[13px] text-text">{product.quantity} in stock</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted">Purchase quantity</span>
          <NumberStepper
            value={qty}
            onChange={setQty}
            min={1}
            max={Math.max(1, product.quantity)}
          />
        </div>
      </div>
    </AppFrame>
  );
}
