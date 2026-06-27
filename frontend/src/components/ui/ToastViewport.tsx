import { cn } from "../../lib/cn";
import { useToast, type ToastKind } from "../../app/providers/ToastProvider";

const accent: Record<ToastKind, string> = {
  info: "border-l-accent",
  success: "border-l-success",
  danger: "border-l-danger",
  warning: "border-l-warning",
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] mx-auto flex max-w-[480px] flex-col gap-2 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            "pointer-events-auto w-full rounded-xl border border-border border-l-4 bg-surface px-4 py-3 text-left text-[14px] text-text shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
            accent[t.kind],
          )}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
