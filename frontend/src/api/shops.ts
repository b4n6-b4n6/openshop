import { requestJson } from "./client";
import type { Shop, WalletInput } from "./types";

export async function connectToShop(onion: string): Promise<string> {
  const result = await requestJson<{ path: string }>("/browser", {
    method: "POST",
    body: JSON.stringify({ onion: onion.trim() }),
  });
  return result.path;
}

export async function createShop(_input: WalletInput): Promise<Shop> {
  await requestJson<{ status: string }>("/shop/open", {
    method: "POST",
    body: JSON.stringify(_input),
  });

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const status = await requestJson<{
      wallet: { error: string | null };
      onion: { address: string | null };
    }>("/status");

    if (status.wallet.error) throw new Error(status.wallet.error);
    if (status.onion.address) return getShop();
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
