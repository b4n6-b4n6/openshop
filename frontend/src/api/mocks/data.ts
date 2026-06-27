import type { Chat, Message, Order, Product, Shop } from "../types";

export const MOCK_ONION =
  "openshop7xk3qz2v4r6m8n0p1s5t7w9y2a4c6e8g0i2k4m6o8q0s2u4w6.onion";

export const mockShop: Shop = {
  onion: MOCK_ONION,
  name: "Nightmarket Supply",
  description:
    "Hand-picked goods, shipped discreetly. Payment in Monero only.\n\n**Ships worldwide** · Reships on loss.",
  currency: "USD",
};

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Brass Mechanical Keyboard",
    description: "65% layout, lubed switches, PBT keycaps.",
    currency: "USD",
    price: 129.0,
    quantity: 4,
  },
  {
    id: "p2",
    name: "Privacy USB Data Blocker",
    description: "Blocks data pins, allows charging. 3-pack.",
    currency: "USD",
    price: 14.5,
    quantity: 27,
  },
  {
    id: "p3",
    name: "Faraday Phone Sleeve",
    description: "Signal-blocking sleeve, fits up to 6.9\".",
    currency: "USD",
    price: 22.0,
    quantity: 0, // out of stock — purchase disabled
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    productName: "Privacy USB Data Blocker",
    price: 14.5,
    currency: "USD",
    quantity: 2,
    subaddress: "8AfffsubaddrEXAMPLE9k3m2n7p5q1r4t6w8y0a2c4e6g8i0k2m4o6q8s0u2",
    amountXmr: "0.184210000000",
    amountFiat: 29.0,
    txid: "9f2c1a7be4d3c8051fa6b2e9d7c4a1086b3e5f2c9a8d7b6e4c2a1f0d9e8c7b6a5",
    status: "confirmed",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
];

export const mockChats: Chat[] = [
  { id: "ed25519:7Hk2…q9Lm", lastMessageAt: Date.now() - 1000 * 60 * 12, unread: true },
  { id: "ed25519:Aa31…Zz88", lastMessageAt: Date.now() - 1000 * 60 * 60 * 30, unread: false },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    chatId: "ed25519:7Hk2…q9Lm",
    from: "customer",
    type: "text",
    text: "Hey, is the keyboard still in stock?",
    createdAt: Date.now() - 1000 * 60 * 20,
  },
  {
    id: "m2",
    chatId: "ed25519:7Hk2…q9Lm",
    from: "owner",
    type: "text",
    text: "Yes — 4 left. Ships tomorrow.",
    createdAt: Date.now() - 1000 * 60 * 14,
  },
  {
    id: "m3",
    chatId: "ed25519:7Hk2…q9Lm",
    from: "customer",
    type: "order_created",
    order: mockOrders[0],
    createdAt: Date.now() - 1000 * 60 * 12,
  },
];

/** A plausible per-order Monero subaddress for demos. */
export function mockSubaddress(seed: string): string {
  return "8" + seed.padEnd(94, "k3m2n7p5q1r4t6w8y0a2c4e6g8i0k2m4o6q8s0u2w4y6").slice(0, 94);
}
