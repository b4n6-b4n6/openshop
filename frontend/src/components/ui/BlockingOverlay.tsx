import type { ReactNode } from "react";
import { Spinner } from "./Spinner";
import { Button } from "./Button";

/**
 * Fullscreen hard-block. Used for the currency-rate gate (DESIGN §9): while
 * fetching, show a spinner; on failure, stay up indefinitely with a Retry and
 * block all input behind it.
 */
export function BlockingOverlay({
  title,
  detail,
  failed = false,
  onRetry,
  children,
}: {
  title: string;
  detail?: string;
  failed?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-base/95 px-8 text-center backdrop-blur-sm">
      {failed ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-danger/15 text-danger text-2xl">
          !
        </div>
      ) : (
        <Spinner size="lg" />
      )}
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-text">{title}</h2>
        {detail && <p className="text-[14px] text-muted">{detail}</p>}
      </div>
      {failed && onRetry && (
        <div className="w-full max-w-xs pt-1">
          <Button onClick={onRetry}>Retry</Button>
        </div>
      )}
      {children}
    </div>
  );
}
