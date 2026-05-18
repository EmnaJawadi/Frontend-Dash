// src/components/shared/status-badge.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info";

type StatusBadgeProps = {
  children: ReactNode;
  variant?: StatusBadgeVariant;
  className?: string;
};

export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[1.65rem] items-center rounded-full border px-2.5 py-1 text-xs font-bold",
        variant === "success" && "status-success",
        variant === "warning" && "status-warning",
        variant === "danger" && "status-danger",
        variant === "neutral" && "status-neutral",
        variant === "info" && "border border-blue-200 bg-blue-50 text-blue-700",
        className
      )}
    >
      {children}
    </span>
  );
}
