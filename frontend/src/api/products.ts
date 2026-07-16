import { requestJson } from "./client";
import type { Product } from "./types";

export type ProductInput = Omit<Product, "id">;

export async function listProducts(): Promise<Product[]> {
  return requestJson<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return requestJson<Product>(`/products/${encodeURIComponent(id)}`);
}

export async function addProduct(input: ProductInput): Promise<Product> {
  return requestJson<Product>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  return requestJson<Product>(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
