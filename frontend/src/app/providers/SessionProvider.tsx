import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Shop } from "../../api/types";

type Role = "none" | "owner" | "customer";

interface SessionValue {
  role: Role;
  ownerShop: Shop | null;
  browsedShop: Shop | null;
  setOwnerShop: (shop: Shop | null) => void;
  setBrowsedShop: (shop: Shop | null) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ownerShop, setOwnerShop] = useState<Shop | null>(null);
  const [browsedShop, setBrowsedShop] = useState<Shop | null>(null);

  const value = useMemo<SessionValue>(() => {
    const role: Role = ownerShop ? "owner" : browsedShop ? "customer" : "none";
    return { role, ownerShop, browsedShop, setOwnerShop, setBrowsedShop };
  }, [ownerShop, browsedShop]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
