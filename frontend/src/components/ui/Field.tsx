import type { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}
