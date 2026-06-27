import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { IconButton } from "../components/ui/IconButton";
import { StatusIndicators } from "../components/ui/StatusIndicators";

/**
 * Persistent app frame: sticky status header (back · title · indicators),
 * scrollable content, optional sticky bottom action bar. Centered in a 480px
 * column with safe-area insets.
 */
export function AppFrame({
  title,
  back,
  onBack,
  showIndicators = true,
  bottomBar,
  children,
}: {
  title?: string;
  /** route to navigate to on back; omit to use history.back() */
  back?: string | boolean;
  onBack?: () => void;
  showIndicators?: boolean;
  bottomBar?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const showBack = back !== undefined || onBack !== undefined;
  function handleBack() {
    if (onBack) return onBack();
    if (typeof back === "string") return navigate(back);
    navigate(-1);
  }

  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col bg-base">
      <header className="sticky top-0 z-30 border-b border-border bg-elevated/95 backdrop-blur pt-safe">
        <div className="flex h-14 items-center gap-1 px-2">
          <div className="flex w-11 justify-start">
            {showBack && (
              <IconButton label="Back" onClick={handleBack}>
                <ChevronLeft className="size-6" />
              </IconButton>
            )}
          </div>
          <h1 className="flex-1 truncate text-center text-[15px] font-bold text-text">
            {title}
          </h1>
          <div className="flex min-w-11 items-center justify-end gap-1.5 pr-1">
            {showIndicators && <StatusIndicators />}
          </div>
        </div>
      </header>

      <main className="no-scrollbar flex-1 overflow-y-auto">{children}</main>

      {bottomBar && (
        <div className="sticky bottom-0 border-t border-border bg-elevated/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur">
          {bottomBar}
        </div>
      )}
    </div>
  );
}
