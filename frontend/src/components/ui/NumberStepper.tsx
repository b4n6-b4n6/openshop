import { Minus, Plus } from "lucide-react";
import { FieldLabel } from "./Field";

export function NumberStepper({
  label,
  value,
  onChange,
  min = 1,
  max = Infinity,
}: {
  label?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const dec = () => onChange(clamp(value - 1));
  const inc = () => onChange(clamp(value + 1));

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
        <button
          aria-label="Decrease"
          onClick={dec}
          disabled={value <= min}
          className="inline-flex size-10 items-center justify-center rounded-lg text-text transition-colors hover:bg-surface disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <input
          inputMode="numeric"
          aria-label={label ?? "Quantity"}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^0-9]/g, ""));
            onChange(clamp(Number.isFinite(n) ? n : min));
          }}
          className="w-12 bg-transparent text-center text-[16px] font-semibold text-text outline-none"
        />
        <button
          aria-label="Increase"
          onClick={inc}
          disabled={value >= max}
          className="inline-flex size-10 items-center justify-center rounded-lg text-text transition-colors hover:bg-surface disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
