import { mockDelay, withTimeout } from "./client";
import { mockShop } from "./mocks/data";
import type { Shop, WalletInput } from "./types";
import { ApiError } from "./types";

/**
 * Connect to a shop by onion address. Mock rules for demoing failure paths:
 *  - address containing "fail" or "offline" -> unreachable error
 *  - address containing "slow" -> exceeds the 30s timeout
 *  - anything else -> returns the mock shop (with the given onion)
 */
export async function connectToShop(onion: string): Promise<Shop> {
  const trimmed = onion.trim();
  if (!trimmed) throw new ApiError("Enter a shop address", "not_found");

  return withTimeout(
    (async () => {
      await mockDelay(1400);
      if (/fail|offline/i.test(trimmed)) {
        throw new ApiError("Shop is unreachable", "unreachable");
      }
      if (/slow/i.test(trimmed)) {
        await mockDelay(60_000); // will trip the 30s timeout
      }
      return { ...mockShop, onion: trimmed };
    })(),
  );
}

/** Spin up a new shop from view-only wallet inputs. Returns the owner's shop. */
export async function createShop(_input: WalletInput): Promise<Shop> {
  return withTimeout(
    (async () => {
      await mockDelay(200); // "spinning up onion" — backend derives the onion from the wallet
      const onion = `${randomOnion()}.onion`;
      return {
        onion,
        name: "My Shop",
        description: "",
        currency: "USD",
      } satisfies Shop;
    })(),
  );
}

function randomOnion(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz234567";
  let out = "";
  for (let i = 0; i < 56; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
