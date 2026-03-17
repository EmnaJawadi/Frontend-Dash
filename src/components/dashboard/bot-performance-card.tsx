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
          <h3 className="text-base font-semibold md:text-lg">
            Performance du bot
          </h3>
          <p className="text-sm text-muted-foreground">
            Suivez la qualité de l’automatisation et l’efficacité des réponses.
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
            <span className="text-muted-foreground">Taux d’automatisation :</span>
            <span className="ml-2 font-semibold">{data.automationRate}%</span>
          </div>

          <div>
            <span className="text-muted-foreground">Confiance moyenne :</span>
            <span className="ml-2 font-semibold">{data.averageConfidence}%</span>
          </div>

          <div>
            <span className="text-muted-foreground">Temps de réponse moyen :</span>
            <span className="ml-2 font-semibold">{data.averageResponseTime}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Taux de bascule :</span>
            <span className="ml-2 font-semibold">{data.fallbackRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}