// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { BotPerformanceCard } from "@/src/components/dashboard/bot-performance-card";
import { ConversationsChart } from "@/src/components/dashboard/conversations-chart";
import { EscalationSummary } from "@/src/components/dashboard/escalation-summary";
import { RecentConversations } from "@/src/components/dashboard/recent-conversations";
import { StatsCard } from "@/src/components/dashboard/stats-card";
import { LoadingSpinner } from "@/src/components/shared/loading-spinner";
import { SectionCard } from "@/src/components/shared/section-card";
import { useDashboard } from "@/src/features/dashboard/hooks/use-dashboard";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-sm text-muted-foreground">
            Chargement des données...
          </p>
        </div>

        <SectionCard contentClassName="py-12">
          <LoadingSpinner
            size="lg"
            label="Chargement du tableau de bord..."
          />
        </SectionCard>
      </div>
    );
  }

  if (error || !data) {
    return (
      <SectionCard contentClassName="flex flex-col items-start gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Impossible de charger le tableau de bord
          </h2>
          <p className="text-sm text-muted-foreground">
            {error ?? "Une erreur est survenue lors du chargement des données."}
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Réessayer
        </button>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Suivez le volume des conversations, la performance du bot et les escalades.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.stats.map((stat) => (
          <StatsCard key={stat.key} stat={stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ConversationsChart data={data.chart} />
        </div>

        <div>
          <BotPerformanceCard data={data.botPerformance} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentConversations conversations={data.recentConversations} />
        <EscalationSummary data={data.escalationSummary} />
      </section>
    </div>
  );
}