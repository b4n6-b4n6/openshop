import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-colors duration-150 select-none disabled:opacity-50 " +
  "disabled:pointer-events-none active:scale-[0.99]";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-press",
  secondary:
    "bg-surface-2 text-text border border-border hover:border-border-strong",
  ghost: "bg-transparent text-text hover:bg-surface-2",
  danger:
    "bg-transparent text-danger border border-danger/40 hover:bg-danger/10",
};

export function Button({
  variant = "primary",
  fullWidth = true,
  loading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...rest
}: {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        fullWidth ? "w-full" : "",
        "h-12 px-5 text-[15px]",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
}
