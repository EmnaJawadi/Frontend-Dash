"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ConversationChartItem = {
  name: string;
  conversations: number;
};

type ConversationsChartProps = {
  data?: ConversationChartItem[];
};

const defaultData: ConversationChartItem[] = [
  { name: "Lun", conversations: 24 },
  { name: "Mar", conversations: 31 },
  { name: "Mer", conversations: 28 },
  { name: "Jeu", conversations: 40 },
  { name: "Ven", conversations: 36 },
  { name: "Sam", conversations: 22 },
  { name: "Dim", conversations: 18 },
];

export function ConversationsChart({
  data = defaultData,
}: ConversationsChartProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Volume des conversations</CardTitle>
        <CardDescription>
          Évolution hebdomadaire des conversations WhatsApp.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="currentColor"
                fill="currentColor"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}