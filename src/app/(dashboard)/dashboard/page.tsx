// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { BotPerformanceCard } from "@/src/components/dashboard/bot-performance-card";
import { ConversationsChart } from "@/src/components/dashboard/conversations-chart";
import { EscalationSummary } from "@/src/components/dashboard/escalation-summary";
import { RecentConversations } from "@/src/components/dashboard/recent-conversations";
import { StatsCard } from "@/src/components/dashboard/stats-card";
import { useDashboard } from "@/src/features/dashboard/hooks/use-dashboard";



export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Loading dashboard insights...
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="section-card h-[140px] animate-pulse bg-muted/40"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="section-card h-[380px] animate-pulse bg-muted/40 xl:col-span-2" />
          <div className="section-card h-[380px] animate-pulse bg-muted/40" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="section-card h-[380px] animate-pulse bg-muted/40" />
          <div className="section-card h-[380px] animate-pulse bg-muted/40" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="section-card">
        <div className="section-card-content flex flex-col items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">Unable to load dashboard</h2>
            <p className="text-sm text-muted-foreground">
              {error ?? "Something went wrong while fetching dashboard data."}
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          Monitor conversation volume, bot performance, and escalation activity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.stats.map((stat: unknown) => (
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