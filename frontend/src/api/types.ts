// UI-facing data shapes. Mirror docs/data-model.md. The Node backend will
// return these (or be adapted to them in src/api/*); screens never see raw wire types.

export type IndicatorState = "online" | "offline" | "checking";
export type WalletState = "synced" | "syncing" | "error";

export interface CurrencyRates {
  /** fiat code -> XMR price of 1 unit of that fiat (mock units) */
  base: "XMR";
  rates: Record<string, number>;
  fetchedAt: number;
}

export interface Shop {
  onion: string;
  name: string;
  description: string;
  profilePhoto?: string;
  bannerPhoto?: string;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  photo?: string;
  currency: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed";

export interface Order {
  id: string;
  productName: string;
  productPhoto?: string;
  productDescription?: string;
  price: number;
  currency: string;
  quantity: number;
  subaddress: string;
  amountXmr: string;
  amountFiat: number;
  txid?: string;
  status: OrderStatus;
  createdAt: number;
}

export type MessageType = "text" | "image" | "order_created";

export interface Message {
  id: string;
  chatId: string;
  from: "owner" | "customer";
  type: MessageType;
  text?: string;
  media?: string;
  order?: Order;
  createdAt: number;
}

export interface Chat {
  id: string; // customer pubkey (truncated for display)
  lastMessageAt: number;
  unread: boolean;
}

/** Wallet inputs collected on the Create Shop screen (view-only). */
export interface WalletInput {
  primaryAddress: string;
  privateViewKey: string;
  restoreHeight: string;
}

export type ApiErrorCode =
  | "timeout"
  | "unreachable"
  | "not_found"
  | "unknown"
  | (string & {});

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  field?: string;

  constructor(
    message: string,
    code: ApiErrorCode = "unknown",
    options: { status?: number; field?: string; cause?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = options.status;
    this.field = options.field;
    this.cause = options.cause;
  }
}
