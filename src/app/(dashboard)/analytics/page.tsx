"use client";

import * as React from "react";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Clock3,
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalytics } from "@/src/features/analytics/hooks/use-analytics";
import type {
  AnalyticsDay,
  ChannelFilter,
  PeriodFilter,
  TeamFilter,
} from "@/src/features/analytics/types/analytics.types";

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher une metrique ou un segment..."
        className="h-11 rounded-xl pl-10 pr-10"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="rounded-xl bg-muted p-2 text-muted-foreground">{icon}</div>
        </div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function MiniBarChart({
  data,
  valueKey,
  maxValue,
  label,
}: {
  data: AnalyticsDay[];
  valueKey: "totalMessages" | "botMessages" | "humanMessages" | "escalations";
  maxValue: number;
  label: string;
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">Vue simplifiee</p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex h-56 items-end gap-3">
          {data.map((item) => {
            const value = item[valueKey];
            const height = `${Math.max((value / maxValue) * 100, 8)}%`;

            return (
              <div key={`${item.key}-${valueKey}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-xl bg-primary/80"
                    style={{ height }}
                    title={`${item.day}: ${value}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function applyTeamFilter(items: AnalyticsDay[], team: TeamFilter): AnalyticsDay[] {
  if (team === "bot") {
    return items.map((item) => ({
      ...item,
      totalMessages: item.botMessages,
      humanMessages: 0,
    }));
  }

  if (team === "human") {
    return items.map((item) => ({
      ...item,
      totalMessages: item.humanMessages,
      botMessages: 0,
    }));
  }

  return items;
}

export default function AnalyticsPage() {
  const [search, setSearch] = React.useState("");
  const [period, setPeriod] = React.useState<PeriodFilter>("7d");
  const [channel, setChannel] = React.useState<ChannelFilter>("all");
  const [team, setTeam] = React.useState<TeamFilter>("all");

  const requestFilters = React.useMemo(
    () => ({ period, channel }),
    [period, channel],
  );
  const { data, isLoading, error, refetch } = useAnalytics(requestFilters);

  const filteredData = React.useMemo(() => {
    let items = applyTeamFilter(data?.timeline ?? [], team);

    if (!search.trim()) {
      return items;
    }

    const query = search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.day.toLowerCase().includes(query) ||
        "messages".includes(query) ||
        "bot".includes(query) ||
        "humain".includes(query) ||
        "escalades".includes(query),
    );

    return items;
  }, [data, search, team]);

  const totals = React.useMemo(() => {
    const aggregate = filteredData.reduce(
      (acc, item) => {
        acc.totalMessages += item.totalMessages;
        acc.botMessages += item.botMessages;
        acc.humanMessages += item.humanMessages;
        acc.escalations += item.escalations;
        return acc;
      },
      {
        totalMessages: 0,
        botMessages: 0,
        humanMessages: 0,
        escalations: 0,
      },
    );

    const botRate =
      aggregate.totalMessages > 0
        ? ((aggregate.botMessages / aggregate.totalMessages) * 100).toFixed(1)
        : "0.0";

    return {
      ...aggregate,
      botRate,
      avgResponseTime: data?.totals.avgResponseTimeLabel ?? "N/A",
    };
  }, [data, filteredData]);

  const maxMessages = Math.max(...filteredData.map((item) => item.totalMessages), 1);
  const maxBot = Math.max(...filteredData.map((item) => item.botMessages), 1);
  const maxHuman = Math.max(...filteredData.map((item) => item.humanMessages), 1);
  const maxEscalations = Math.max(...filteredData.map((item) => item.escalations), 1);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Chargement des donnees...</p>
        </div>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Recuperation des statistiques en cours...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Suivez le volume des messages, la performance du bot et les escalades.
          </p>
        </div>

        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div>
              <h2 className="text-lg font-semibold">Impossible de charger les donnees</h2>
              <p className="text-sm text-muted-foreground">
                {error ?? "Une erreur est survenue lors du chargement."}
              </p>
            </div>
            <Button type="button" onClick={refetch}>
              Reessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Suivez le volume des messages, la performance du bot et les escalades.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Messages totaux"
          value={String(totals.totalMessages)}
          subtitle="Volume global"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatCard
          title="Reponses bot"
          value={String(totals.botMessages)}
          subtitle={`${totals.botRate}% du total`}
          icon={<Bot className="h-4 w-4" />}
        />
        <StatCard
          title="Reponses humaines"
          value={String(totals.humanMessages)}
          subtitle="Interventions agents"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Escalades"
          value={String(totals.escalations)}
          subtitle="Transferts vers humain"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard
          title="Taux bot"
          value={`${totals.botRate}%`}
          subtitle="Part des reponses automatisees"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Temps de reponse moyen"
          value={totals.avgResponseTime}
          subtitle="Estimation actuelle"
          icon={<Clock3 className="h-4 w-4" />}
        />
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <SearchInput value={search} onChange={setSearch} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Select value={period} onValueChange={(value) => setPeriod(value as PeriodFilter)}>
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">90 jours</SelectItem>
                </SelectContent>
              </Select>

              <Select value={channel} onValueChange={(value) => setChannel(value as ChannelFilter)}>
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous canaux</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={team} onValueChange={(value) => setTeam(value as TeamFilter)}>
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bot + Humain</SelectItem>
                  <SelectItem value="bot">Bot</SelectItem>
                  <SelectItem value="human">Humain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredData.length === 0 ? (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Aucune donnee trouvee</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Modifiez les filtres ou la recherche pour afficher plus de resultats.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <MiniBarChart
            data={filteredData}
            valueKey="totalMessages"
            maxValue={maxMessages}
            label="Volume total des messages"
          />
          <MiniBarChart
            data={filteredData}
            valueKey="botMessages"
            maxValue={maxBot}
            label="Messages traites par le bot"
          />
          <MiniBarChart
            data={filteredData}
            valueKey="humanMessages"
            maxValue={maxHuman}
            label="Messages traites par humain"
          />
          <MiniBarChart
            data={filteredData}
            valueKey="escalations"
            maxValue={maxEscalations}
            label="Escalades"
          />
        </div>
      )}
    </div>
  );
}
