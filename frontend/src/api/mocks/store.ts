import { mockMessages, mockOrders, mockProducts } from "./data";
import type { Message, Order, Product } from "../types";

/**
 * In-memory mock store so the UI feels real (add a product → it shows in the
 * list; place an order → it appears in orders). Replaced by the Node API later.
 */
export const store = {
  ownerProducts: [...mockProducts] as Product[],
  orders: [...mockOrders] as Order[],
  messages: [...mockMessages] as Message[],
};

let seq = 100;
export function nextId(prefix: string): string {
  return `${prefix}${seq++}`;
}
