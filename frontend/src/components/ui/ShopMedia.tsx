import { ImageIcon, Store } from "lucide-react";
import { cn } from "../../lib/cn";

export function ShopBanner({ src, className }: { src?: string; className?: string }) {
  return (
    <div className={cn("relative h-36 w-full overflow-hidden bg-surface-2", className)}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-faint">
          <ImageIcon className="size-7" />
        </div>
      )}
    </div>
  );
}

export function Avatar({
  src,
  size = 64,
  className,
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full border-2 border-base bg-surface-2 text-faint",
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <Store className="size-1/2" />
      )}
    </div>
  );
}
