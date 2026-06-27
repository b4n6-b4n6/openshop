import { useState } from "react";
import { Input, TextArea } from "../../components/ui/Input";
import { PhotoField } from "../../components/ui/PhotoField";
import { Select } from "../../components/ui/Select";
import { NumberStepper } from "../../components/ui/NumberStepper";
import { SUPPORTED_CURRENCIES } from "../../api/currency";
import type { ProductInput } from "../../api/products";
import type { Product } from "../../api/types";

export function useProductForm(initial?: Product) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [photo, setPhoto] = useState(initial?.photo);
  const [currency, setCurrency] = useState(initial?.currency ?? "USD");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  function validate(): ProductInput | null {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Required";
    const priceNum = Number(price);
    if (!price.trim() || !Number.isFinite(priceNum) || priceNum <= 0)
      next.price = "Enter a valid price";
    setErrors(next);
    if (Object.keys(next).length > 0) return null;
    return { name: name.trim(), description, photo, currency, price: priceNum, quantity };
  }

  const fields = (
    <div className="space-y-5">
      <Input
        label="Name"
        placeholder="Product name"
        value={name}
        error={errors.name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextArea
        label="Description"
        placeholder="Describe the product… (markdown supported)"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <PhotoField label="Product photo" value={photo} onChange={setPhoto} />
      <Select
        label="Currency"
        title="Currency"
        value={currency}
        options={SUPPORTED_CURRENCIES}
        onChange={setCurrency}
      />
      <Input
        label="Price"
        placeholder="0.00"
        inputMode="decimal"
        value={price}
        error={errors.price}
        onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
      />
      <NumberStepper label="Quantity" value={quantity} onChange={setQuantity} min={0} />
    </div>
  );

  return { fields, validate };
}
