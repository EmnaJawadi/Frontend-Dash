// src/components/dashboard/bot-performance-card.tsx
import type { BotPerformanceCardData } from "@/src/features/dashboard/types/dashboard.types";

type BotPerformanceCardProps = {
  data: BotPerformanceCardData;
};

export function BotPerformanceCard({ data }: BotPerformanceCardProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="mb-6">
          <h3 className="text-base font-semibold md:text-lg">Bot Performance</h3>
          <p className="text-sm text-muted-foreground">
            Monitor automation quality and response efficiency.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border bg-background p-4 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {metric.value}
              </p>
              {metric.hint && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {metric.hint}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border bg-muted/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Automation Rate:</span>
            <span className="ml-2 font-semibold">{data.automationRate}%</span>
          </div>

          <div>
            <span className="text-muted-foreground">Avg Confidence:</span>
            <span className="ml-2 font-semibold">{data.averageConfidence}%</span>
          </div>

          <div>
            <span className="text-muted-foreground">Avg Response Time:</span>
            <span className="ml-2 font-semibold">{data.averageResponseTime}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Fallback Rate:</span>
            <span className="ml-2 font-semibold">{data.fallbackRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}