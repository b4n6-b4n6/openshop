import { requestJson } from "./client";
import { ApiError, type Shop, type WalletInput } from "./types";

export interface ShopOpeningProgress {
  stage: "wallet" | "onion";
  percent?: number;
}

export async function connectToShop(onion: string): Promise<string> {
  const result = await requestJson<{ path: string }>("/browser", {
    method: "POST",
    body: JSON.stringify({ onion: onion.trim() }),
  });
  return result.path;
}

export async function createShop(
  _input: WalletInput,
  onProgress?: (progress: ShopOpeningProgress) => void,
): Promise<Shop> {
  onProgress?.({ stage: "wallet" });
  await requestJson<{ status: string }>("/shop/open", {
    method: "POST",
    body: JSON.stringify(_input),
  });

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const status = await requestJson<{
      wallet: {
        completed: boolean;
        restoring: boolean;
        error: { message: string; code: string; field?: string } | null;
      };
      onion: {
        address: string | null;
        progress: number;
        error: { message: string; code: string; field?: string } | null;
      };
    }>("/status");

    if (status.wallet.error) {
      throw new ApiError(status.wallet.error.message, status.wallet.error.code, {
        field: status.wallet.error.field,
      });
    }
    if (status.onion.error) {
      throw new ApiError(status.onion.error.message, status.onion.error.code, {
        field: status.onion.error.field,
      });
    }
    if (status.onion.address) return getShop();
    if (status.wallet.completed) {
      onProgress?.({ stage: "onion", percent: status.onion.progress });
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Timed out while opening the shop");
}

export function getShop(): Promise<Shop> {
  return requestJson<Shop>("/shop");
}

export function updateShop(shop: Shop): Promise<Shop> {
  return requestJson<Shop>("/shop", {
    method: "PATCH",
    body: JSON.stringify(shop),
  });
}
