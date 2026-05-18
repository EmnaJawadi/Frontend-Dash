// src/components/dashboard/stats-card.tsx

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { DashboardStat } from "@/src/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  stat: DashboardStat;
};

export function StatsCard({ stat }: StatsCardProps) {
  const isPositive = stat.trend === "up";
  const isNegative = stat.trend === "down";
  const isNeutral = stat.trend === "neutral" || !stat.trend;

  return (
    <div className="section-card h-full">
      <div className="section-card-content">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {stat.value}
            </h3>

            {stat.subtitle && (
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
              isPositive && "border-emerald-200 bg-emerald-50 text-emerald-600",
              isNegative && "border-red-200 bg-red-50 text-red-600",
              isNeutral && "border-blue-200 bg-blue-50 text-blue-600"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : isNegative ? (
              <ArrowDownRight className="h-5 w-5" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
          </div>
        </div>

        {typeof stat.change === "number" && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                isPositive && "bg-green-100 text-green-700",
                isNegative && "bg-red-100 text-red-700",
                isNeutral && "bg-slate-100 text-slate-700"
              )}
            >
              {stat.change > 0 ? "+" : ""}
              {stat.change}%
            </span>

            <span className="text-xs text-muted-foreground">
              par rapport à la période précédente
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
