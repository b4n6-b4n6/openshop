import { cn } from "../../lib/cn";
import { Thumb } from "./ProductCard";
import { formatRelative, formatXmr, truncateMiddle } from "../../lib/format";
import type { Message } from "../../api/types";

export function ChatBubble({
  message,
  me = "owner",
  onImageClick,
}: {
  message: Message;
  /** which side is "me" — own messages align right */
  me?: "owner" | "customer";
  onImageClick?: (src: string) => void;
}) {
  const own = message.from === me;
  const row = own ? "justify-end" : "justify-start";

  if (message.type === "order_created" && message.order) {
    const o = message.order;
    return (
      <div className={cn("flex", row)}>
        <div className="max-w-[82%] rounded-2xl border border-accent/30 bg-accent-soft p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-accent">
            New order
          </p>
          <div className="flex items-center gap-2">
            <Thumb src={o.productPhoto} size={40} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-text">
                {o.productName}
              </p>
              <p className="text-[12px] text-muted">
                {o.quantity} × · {formatXmr(o.amountXmr)} XMR
              </p>
            </div>
          </div>
          {o.txid && (
            <p className="mt-2 break-all font-mono text-[11px] text-muted">
              {truncateMiddle(o.txid, 8, 8)}
            </p>
          )}
          <span className="mt-1 block text-[10px] text-faint">
            {formatRelative(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", row)}>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3 py-2",
          own ? "bg-accent text-on-accent" : "border border-border bg-surface text-text",
        )}
      >
        {message.type === "image" && message.media ? (
          <button onClick={() => onImageClick?.(message.media!)} className="block">
            <img src={message.media} alt="" className="max-h-48 rounded-lg" />
          </button>
        ) : (
          <p className="whitespace-pre-wrap break-words text-[14px]">{message.text}</p>
        )}
        <span
          className={cn(
            "mt-1 block text-[10px]",
            own ? "text-on-accent/70" : "text-faint",
          )}
        >
          {formatRelative(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
