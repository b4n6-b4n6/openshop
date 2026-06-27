import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const fieldBase =
  "w-full rounded-xl bg-surface-2 border border-border px-4 text-[15px] text-text " +
  "placeholder:text-faint transition-colors outline-none " +
  "focus:border-accent focus:ring-2 focus:ring-accent/30";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}

function Hint({ error, hint }: { error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <span className={cn("mt-1.5 block text-[13px]", error ? "text-danger" : "text-faint")}>
      {error ?? hint}
    </span>
  );
}

export function Input({
  label,
  error,
  hint,
  mono,
  className,
  ...rest
}: {
  label?: string;
  error?: string;
  hint?: string;
  mono?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <input
        className={cn(
          fieldBase,
          "h-12",
          mono && "font-mono text-[13px]",
          error && "border-danger focus:border-danger focus:ring-danger/30",
          className,
        )}
        {...rest}
      />
      <Hint error={error} hint={hint} />
    </label>
  );
}

export function TextArea({
  label,
  error,
  hint,
  rows = 4,
  className,
  ...rest
}: {
  label?: string;
  error?: string;
  hint?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <textarea
        rows={rows}
        className={cn(fieldBase, "resize-none py-3 leading-relaxed", className)}
        {...rest}
      />
      <Hint error={error} hint={hint} />
    </label>
  );
}
