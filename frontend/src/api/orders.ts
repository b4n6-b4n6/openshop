import { mockDelay } from "./client";
import { fiatToXmr } from "./currency";
import { mockSubaddress } from "./mocks/data";
import { nextId, store } from "./mocks/store";
import { formatXmr } from "../lib/format";
import type { CurrencyRates, Order, Product } from "./types";

export async function listOrders(): Promise<Order[]> {
  await mockDelay(500);
  return [...store.orders].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  await mockDelay(300);
  return store.orders.find((o) => o.id === id);
}

/**
 * Create a pending order: snapshot the product, compute XMR + fiat amounts from
 * current rates, and issue a unique per-order subaddress (ADR-0006).
 */
export async function createOrder(
  product: Product,
  quantity: number,
  rates: CurrencyRates,
): Promise<Order> {
  await mockDelay(800);
  const id = nextId("o");
  const amountFiat = product.price * quantity;
  const amountXmr = formatXmr(fiatToXmr(amountFiat, product.currency, rates));
  const order: Order = {
    id,
    productName: product.name,
    productPhoto: product.photo,
    productDescription: product.description,
    price: product.price,
    currency: product.currency,
    quantity,
    subaddress: mockSubaddress(id),
    amountXmr,
    amountFiat,
    status: "pending",
    createdAt: Date.now(),
  };
  store.orders = [order, ...store.orders];
  return order;
}
