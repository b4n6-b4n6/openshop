import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Boxes } from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { listProducts } from "../../api/products";

export function Products() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  return (
    <AppFrame title="Products" back="/">
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={<Boxes className="size-8" />} title="No products" />
      ) : (
        <div className="flex flex-col gap-2.5 px-5 py-5">
          {data.map((p) => {
            const out = p.quantity <= 0;
            return (
              <ProductCard
                key={p.id}
                product={p}
                action={
                  <Button
                    fullWidth={false}
                    disabled={out}
                    className="h-9 px-3 text-[13px]"
                    onClick={() => navigate(`/products/${p.id}/purchase`)}
                  >
                    Purchase
                  </Button>
                }
              />
            );
          })}
        </div>
      )}
    </AppFrame>
  );
}
