import { useEffect } from "react";
import { errorMessage } from "../../lib/errors";
import { useToast } from "./ToastProvider";

export function GlobalErrorReporter() {
  const { push } = useToast();

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      push(errorMessage(event.error ?? event.message), "danger");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      push(errorMessage(event.reason), "danger");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [push]);

  return null;
}
