import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function IconButton({
  label,
  children,
  className,
  ...rest
}: {
  label: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl text-muted",
        "transition-colors hover:bg-surface-2 hover:text-text active:scale-95",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
