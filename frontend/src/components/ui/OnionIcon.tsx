import { cn } from "../../lib/cn";

/**
 * The Tor onion glyph (/onion.svg) is a solid monochrome shape, so we tint it
 * via CSS mask. Defaults to `currentColor` so it inherits the surrounding text
 * color (used by the connectivity status indicator).
 */
export function OnionIcon({
  size = 14,
  color = "currentColor",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: "url(/onion.svg)",
        maskImage: "url(/onion.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
