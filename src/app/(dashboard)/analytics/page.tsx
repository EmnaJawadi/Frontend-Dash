"use client";

import * as React from "react";
import {
  BarChart3,
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Clock3,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PeriodFilter = "7d" | "30d" | "90d";
type ChannelFilter = "all" | "whatsapp";
type TeamFilter = "all" | "bot" | "human";

type AnalyticsDay = {
  day: string;
  totalMessages: number;
  botMessages: number;
  humanMessages: number;
  escalations: number;
};

const analyticsData: AnalyticsDay[] = [
  {
    day: "Lun",
    totalMessages: 120,
    botMessages: 80,
    humanMessages: 40,
    escalations: 8,
  },
  {
    day: "Mar",
    totalMessages: 150,
    botMessages: 110,
    humanMessages: 40,
    escalations: 10,
  },
  {
    day: "Mer",
    totalMessages: 170,
    botMessages: 120,
    humanMessages: 50,
    escalations: 14,
  },
  {
    day: "Jeu",
    totalMessages: 140,
    botMessages: 90,
    humanMessages: 50,
    escalations: 11,
  },
  {
    day: "Ven",
    totalMessages: 190,
    botMessages: 140,
    humanMessages: 50,
    escalations: 16,
  },
  {
    day: "Sam",
    totalMessages: 130,
    botMessages: 95,
    humanMessages: 35,
    escalations: 7,
  },
  {
    day: "Dim",
    totalMessages: 110,
    botMessages: 75,
    humanMessages: 35,
    escalations: 5,
  },
];

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
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une métrique ou un segment..."
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
          <div className="rounded-xl bg-muted p-2 text-muted-foreground">
            {icon}
          </div>
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
            <p className="text-sm text-muted-foreground">
              Vue hebdomadaire simplifiée
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex h-56 items-end gap-3">
          {data.map((item) => {
            const value = item[valueKey];
            const height = `${Math.max((value / maxValue) * 100, 8)}%`;

            return (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
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

export default function AnalyticsPage() {
  const [search, setSearch] = React.useState("");
  const [period, setPeriod] = React.useState<PeriodFilter>("7d");
  const [channel, setChannel] = React.useState<ChannelFilter>("all");
  const [team, setTeam] = React.useState<TeamFilter>("all");

  const filteredData = React.useMemo(() => {
    let data = [...analyticsData];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      data = data.filter(
        (item) =>
          item.day.toLowerCase().includes(query) ||
          "messages".includes(query) ||
          "bot".includes(query) ||
          "human".includes(query) ||
          "escalations".includes(query)
      );
    }

    return data;
  }, [search, period, channel, team]);

  const totals = React.useMemo(() => {
    const totalMessages = filteredData.reduce(
      (sum, item) => sum + item.totalMessages,
      0
    );
    const botMessages = filteredData.reduce(
      (sum, item) => sum + item.botMessages,
      0
    );
    const humanMessages = filteredData.reduce(
      (sum, item) => sum + item.humanMessages,
      0
    );
    const escalations = filteredData.reduce(
      (sum, item) => sum + item.escalations,
      0
    );

    const botRate =
      totalMessages > 0 ? ((botMessages / totalMessages) * 100).toFixed(1) : "0";

    const avgResponseTime = "2m 14s";

    return {
      totalMessages,
      botMessages,
      humanMessages,
      escalations,
      botRate,
      avgResponseTime,
    };
  }, [filteredData]);

  const maxMessages = Math.max(...filteredData.map((item) => item.totalMessages), 1);
  const maxBot = Math.max(...filteredData.map((item) => item.botMessages), 1);
  const maxHuman = Math.max(...filteredData.map((item) => item.humanMessages), 1);
  const maxEscalations = Math.max(...filteredData.map((item) => item.escalations), 1);

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
          title="Réponses bot"
          value={String(totals.botMessages)}
          subtitle={`${totals.botRate}% du total`}
          icon={<Bot className="h-4 w-4" />}
        />
        <StatCard
          title="Réponses humaines"
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
          subtitle="Part des réponses automatisées"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Temps de réponse moyen"
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
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as PeriodFilter)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">90 jours</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={channel}
                onValueChange={(value) => setChannel(value as ChannelFilter)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous canaux</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={team}
                onValueChange={(value) => setTeam(value as TeamFilter)}
              >
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
            <h3 className="mb-1 text-lg font-semibold">Aucune donnée trouvée</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Essaie de modifier les filtres ou la recherche pour afficher plus
              de résultats.
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
            label="Messages traités par le bot"
          />

          <MiniBarChart
            data={filteredData}
            valueKey="humanMessages"
            maxValue={maxHuman}
            label="Messages traités par humain"
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