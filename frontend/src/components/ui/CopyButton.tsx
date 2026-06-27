import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/cn";

export function CopyButton({
  value,
  label = "Copy",
  compact = false,
  className,
}: {
  value: string;
  label?: string;
  /** icon-only (keeps `label` as the accessible name) */
  compact?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={onCopy}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-medium",
        "text-muted transition-colors hover:bg-surface-2 hover:text-text",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {!compact && (copied ? "Copied" : label)}
    </button>
  );
}
