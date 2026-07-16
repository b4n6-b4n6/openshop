import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("React render error", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" className="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-5 bg-base px-8 text-center">
        <AlertTriangle className="size-12 text-danger" />
        <div>
          <h1 className="text-lg font-bold text-text">OpenShop hit an error</h1>
          <p className="mt-2 text-[14px] text-muted">{this.state.error.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Reload OpenShop</Button>
      </div>
    );
  }
}
