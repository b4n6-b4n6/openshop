import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Button } from "../../components/ui/Button";
import { addProduct } from "../../api/products";
import { useProductForm } from "./ProductForm";
import { useToast } from "../../app/providers/ToastProvider";
import { errorMessage } from "../../lib/errors";

export function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { fields, validate } = useProductForm();
  const { push } = useToast();
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input = validate();
    if (!input) return;
    setSaving(true);
    try {
      await addProduct(input);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/shop/products", { replace: true });
    } catch (error) {
      push(errorMessage(error, "The product could not be added."), "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppFrame
      title="Add Product"
      back="/shop/products"
      bottomBar={
        <Button loading={saving} onClick={submit}>
          Add
        </Button>
      }
    >
      <div className="px-5 py-6">{fields}</div>
    </AppFrame>
  );
}
