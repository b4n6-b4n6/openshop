import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { FieldLabel } from "./Field";

export function PhotoField({
  label,
  value,
  onChange,
  aspect = "square",
}: {
  label?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  aspect?: "square" | "banner";
}) {
  const ref = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-2 text-faint",
            aspect === "banner" ? "h-16 w-28" : "size-16",
          )}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="size-5" />
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          fullWidth={false}
          onClick={() => ref.current?.click()}
          className="h-10 px-4 text-[13px]"
        >
          {value ? "Change photo" : "Add photo"}
        </Button>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
}
