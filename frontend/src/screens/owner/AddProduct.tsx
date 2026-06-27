import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Button } from "../../components/ui/Button";
import { addProduct } from "../../api/products";
import { useProductForm } from "./ProductForm";

export function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { fields, validate } = useProductForm();
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input = validate();
    if (!input) return;
    setSaving(true);
    await addProduct(input);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    navigate("/shop/products", { replace: true });
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
