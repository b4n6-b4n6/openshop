import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { OrderCard } from "../../components/ui/OrderCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { listOrders } from "../../api/orders";

export function Orders() {
  const { onion = "" } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: listOrders });

  return (
    <AppFrame title="Orders" back={`/s/${onion}`}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="size-8" />}
          title="No orders yet"
          description="Your purchases will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2.5 px-5 py-5">
          {data.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </AppFrame>
  );
}
