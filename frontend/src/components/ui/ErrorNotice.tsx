import { AlertTriangle } from "lucide-react";
import { errorMessage } from "../../lib/errors";
import { Button } from "./Button";

export function ErrorNotice({
  error,
  title = "Something went wrong",
  onRetry,
}: {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="mx-5 my-8 rounded-2xl border border-danger/35 bg-danger/10 p-5 text-center">
      <AlertTriangle className="mx-auto mb-3 size-7 text-danger" />
      <h2 className="text-[15px] font-semibold text-text">{title}</h2>
      <p className="mt-1.5 text-[13px] text-muted">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
