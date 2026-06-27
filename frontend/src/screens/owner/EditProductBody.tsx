import { AppFrame } from "../../app/AppFrame";
import { Button } from "../../components/ui/Button";
import { useProductForm } from "./ProductForm";
import type { ProductInput } from "../../api/products";
import type { Product } from "../../api/types";

export function ProductFormBody({
  product,
  saving,
  onSubmit,
}: {
  product: Product;
  saving: boolean;
  onSubmit: (input: ProductInput) => void;
}) {
  const { fields, validate } = useProductForm(product);
  return (
    <AppFrame
      title="Edit Product"
      back="/shop/products"
      bottomBar={
        <Button
          loading={saving}
          onClick={() => {
            const input = validate();
            if (input) onSubmit(input);
          }}
        >
          Update
        </Button>
      }
    >
      <div className="px-5 py-6">{fields}</div>
    </AppFrame>
  );
}
