import type { ReactNode } from "react";

type FiltersBarProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function FiltersBar({ children, actions }: FiltersBarProps) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/95 p-4 shadow-sm md:p-6 fade-up-delay-1">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{children}</div>
        {actions ? <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
