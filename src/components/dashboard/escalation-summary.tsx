// src/components/dashboard/escalation-summary.tsx

import type { EscalationSummaryData } from "@/src/features/dashboard/types/dashboard.types"  /*"@/features/dashboard/types/dashboard.types";*/

type EscalationSummaryProps = {
  data: EscalationSummaryData;
};

export function EscalationSummary({ data }: EscalationSummaryProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="mb-6">
          <h3 className="text-base font-semibold md:text-lg">
            Escalation Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            Track human handoffs, pending escalations, and common escalation reasons.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Escalations</p>
            <p className="mt-2 text-2xl font-bold">{data.total}</p>
          </div>

          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-2 text-2xl font-bold">{data.pending}</p>
          </div>

          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="mt-2 text-2xl font-bold">{data.resolved}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Average Handling Time</p>
          <p className="mt-2 text-lg font-semibold">{data.averageHandlingTime}</p>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold">Top Escalation Reasons</p>

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