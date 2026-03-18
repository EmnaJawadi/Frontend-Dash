// src/components/shared/section-card.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <div className={cn("section-card", className)}>
      <div className={cn("section-card-content", contentClassName)}>
        {children}
      </div>
    </div>
  );
}