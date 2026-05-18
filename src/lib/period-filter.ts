export type PeriodFilter = "7d" | "30d" | "90d";

export const PERIOD_QUERY_KEY = "period";
export const PERIOD_CHANGE_EVENT = "app-period-change";

export const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "90d", label: "90 derniers jours" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export function isPeriodFilter(value: unknown): value is PeriodFilter {
  return value === "7d" || value === "30d" || value === "90d";
}

export function getPeriodLabel(period: PeriodFilter): string {
  return PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? PERIOD_OPTIONS[1].label;
}

export function getPeriodDays(period: PeriodFilter): number {
  if (period === "7d") return 7;
  if (period === "90d") return 90;
  return 30;
}

export function getPeriodFromSearch(search: string, fallback: PeriodFilter = "30d"): PeriodFilter {
  const params = new URLSearchParams(search);
  const period = params.get(PERIOD_QUERY_KEY);
  return isPeriodFilter(period) ? period : fallback;
}

export function getPeriodDateRange(period: PeriodFilter, now = new Date()) {
  const days = getPeriodDays(period);
  const startDate = new Date(now.getTime() - (days - 1) * DAY_MS);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  return { days, startDate, endDate };
}
