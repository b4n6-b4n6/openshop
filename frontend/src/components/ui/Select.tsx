import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./Field";
import { BottomSheet } from "./BottomSheet";

export function Select({
  label,
  value,
  options,
  onChange,
  title = "Select",
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text"
      >
        {value}
        <ChevronDown className="size-4 text-muted" />
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={title}>
        <div className="flex flex-col">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] text-text transition-colors hover:bg-surface-2",
              )}
            >
              {opt}
              {opt === value && <Check className="size-4 text-accent" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
