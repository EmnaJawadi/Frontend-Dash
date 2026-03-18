// src/components/shared/filters-bar.tsx

import type { ReactNode } from "react";

type FiltersBarProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function FiltersBar({ children, actions }: FiltersBarProps) {
  return (
    <div className="rounded-[24px] border bg-background">
      <div className="p-8">
        <div className="flex flex-col gap-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {children}
          </div>

          {actions ? (
            <div className="flex items-center justify-end">{actions}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}