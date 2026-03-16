// src/components/dashboard/conversations-chart.tsx

"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ConversationsChartPoint } from /*"@/features/dashboard/types/dashboard.types";*/ "@/src/features/dashboard/types/dashboard.types";

type ConversationsChartProps = {
  data: ConversationsChartPoint[];
};

export function ConversationsChart({ data }: ConversationsChartProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="mb-6">
          <h3 className="text-base font-semibold md:text-lg">
            Conversations Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Track conversation volume, bot resolutions, and escalations.
          </p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversations"
                strokeWidth={2}
                dot={false}
                name="Total Conversations"
              />
              <Line
                type="monotone"
                dataKey="resolvedByBot"
                strokeWidth={2}
                dot={false}
                name="Resolved by Bot"
              />
              <Line
                type="monotone"
                dataKey="escalated"
                strokeWidth={2}
                dot={false}
                name="Escalated"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}