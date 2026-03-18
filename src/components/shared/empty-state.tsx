// src/components/shared/empty-state.tsx

import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="section-card">
      <div className="section-card-content flex flex-col items-center justify-center py-10 text-center">
        {icon ? (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        ) : null}

        <h3 className="text-lg font-semibold">{title}</h3>

        {description ? (
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}

        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}