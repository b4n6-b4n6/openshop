import { mockDelay } from "./client";
import { nextId, store } from "./mocks/store";
import type { Product } from "./types";

export type ProductInput = Omit<Product, "id">;

export async function listProducts(): Promise<Product[]> {
  await mockDelay(500);
  return [...store.ownerProducts];
}

export async function getProduct(id: string): Promise<Product | undefined> {
  await mockDelay(300);
  return store.ownerProducts.find((p) => p.id === id);
}

export async function addProduct(input: ProductInput): Promise<Product> {
  await mockDelay(600);
  const product: Product = { ...input, id: nextId("p") };
  store.ownerProducts = [product, ...store.ownerProducts];
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  await mockDelay(600);
  const product: Product = { ...input, id };
  store.ownerProducts = store.ownerProducts.map((p) => (p.id === id ? product : p));
  return product;
}
