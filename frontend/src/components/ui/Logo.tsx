import { cn } from "../../lib/cn";

/**
 * The onion logo (/logo.svg) is a solid black silhouette, so we tint it by
 * using it as a CSS mask and painting with a background color. `color` accepts
 * any CSS color (default: Monero accent).
 */
export function Logo({
  size = 96,
  color = "var(--color-accent)",
  glow = false,
  className,
}: {
  size?: number;
  color?: string;
  glow?: boolean;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="OpenShop"
      className={cn("inline-block", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: "url(/logo.svg)",
        maskImage: "url(/logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        filter: glow ? "drop-shadow(0 0 24px rgba(255,102,0,0.45))" : undefined,
      }}
    />
  );
}
