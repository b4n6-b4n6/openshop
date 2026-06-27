import ReactMarkdown from "react-markdown";
import { cn } from "../../lib/cn";

/** Renders sanitized markdown for shop/product descriptions (rich text). */
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[14px] leading-relaxed text-muted",
        "[&_p]:mb-2 last:[&_p]:mb-0",
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_a]:text-accent [&_a]:underline",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1",
        className,
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
