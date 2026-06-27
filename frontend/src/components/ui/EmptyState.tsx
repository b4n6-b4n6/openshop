import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && <div className="text-faint">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold text-text">{title}</h3>
        {description && <p className="text-[13px] text-muted">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
