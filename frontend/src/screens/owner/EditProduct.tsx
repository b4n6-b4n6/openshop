import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Spinner } from "../../components/ui/Spinner";
import { getProduct, updateProduct } from "../../api/products";
import { ProductFormBody } from "./EditProductBody";
import { ErrorNotice } from "../../components/ui/ErrorNotice";
import { useToast } from "../../app/providers/ToastProvider";
import { errorMessage } from "../../lib/errors";

export function EditProduct() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  if (isLoading) {
    return (
      <AppFrame title="Edit Product" back="/shop/products">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppFrame>
    );
  }

  if (isError) {
    return (
      <AppFrame title="Edit Product" back="/shop/products">
        <ErrorNotice error={error} title="Couldn't load this product" onRetry={() => void refetch()} />
      </AppFrame>
    );
  }

  if (!data) {
    return (
      <AppFrame title="Edit Product" back="/shop/products">
        <p className="px-5 py-10 text-center text-[14px] text-muted">
          Product not found.
        </p>
      </AppFrame>
    );
  }

  return (
    <ProductFormBody
      product={data}
      saving={saving}
      onSubmit={async (input) => {
        setSaving(true);
        try {
          await updateProduct(id, input);
          await queryClient.invalidateQueries({ queryKey: ["products"] });
          navigate("/shop/products", { replace: true });
        } catch (mutationError) {
          push(errorMessage(mutationError, "The product could not be updated."), "danger");
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}
