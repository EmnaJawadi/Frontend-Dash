// src/components/dashboard/escalation-summary.tsx

import type { EscalationSummaryData } from "@/src/features/dashboard/types/dashboard.types";

type EscalationSummaryProps = {
  data: EscalationSummaryData;
};

export function EscalationSummary({ data }: EscalationSummaryProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="mb-6">
          <h3 className="text-base font-semibold md:text-lg">
            Résumé des escalades
          </h3>
          <p className="text-sm text-muted-foreground">
            Suivez les transferts vers un agent, les escalades en attente et les raisons les plus fréquentes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total des escalades</p>
            <p className="mt-2 text-2xl font-bold">{data.total}</p>
          </div>

          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="mt-2 text-2xl font-bold">{data.pending}</p>
          </div>

          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Résolues</p>
            <p className="mt-2 text-2xl font-bold">{data.resolved}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            Temps moyen de traitement
          </p>
          <p className="mt-2 text-lg font-semibold">{data.averageHandlingTime}</p>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold">
            Principales raisons d’escalade
          </p>

          <div className="space-y-3">
            {data.reasons.map((reason) => (
              <div
                key={reason.label}
                className="flex items-center justify-between rounded-xl border bg-background px-4 py-3"
              >
                <span className="text-sm text-foreground">{reason.label}</span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {reason.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}