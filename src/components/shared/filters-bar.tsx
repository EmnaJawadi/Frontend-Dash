import type { ReactNode } from "react";

type FiltersBarProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function FiltersBar({ children, actions }: FiltersBarProps) {
  return (
    <div className="app-surface p-4 md:p-5 fade-up-delay-1">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{children}</div>
        {actions ? <div className="app-toolbar justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}
