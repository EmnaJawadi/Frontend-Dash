// src/features/dashboard/services/dashboard.service.ts

import type { DashboardData } from "@/src/features/dashboard/types/dashboard.types";

const dashboardMock: DashboardData = {
  stats: [
    {
      key: "totalConversations",
      title: "Total Conversations",
      value: 1284,
      change: 12.4,
      trend: "up",
      subtitle: "vs last 7 days",
    },
    {
      key: "activeConversations",
      title: "Active Conversations",
      value: 86,
      change: 4.2,
      trend: "up",
      subtitle: "currently open",
    },
    {
      key: "automationRate",
      title: "Automation Rate",
      value: "78%",
      change: 3.1,
      trend: "up",
      subtitle: "resolved by bot",
    },
    {
      key: "escalationsToday",
      title: "Escalations Today",
      value: 19,
      change: -6.8,
      trend: "down",
      subtitle: "handed to agents",
    },
    {
      key: "avgFirstResponseTime",
      title: "Avg First Response",
      value: "1m 42s",
      change: -9.5,
      trend: "down",
      subtitle: "bot + human",
    },
  ],
  chart: [
    { date: "Mon", conversations: 142, resolvedByBot: 105, escalated: 18 },
    { date: "Tue", conversations: 167, resolvedByBot: 121, escalated: 22 },
    { date: "Wed", conversations: 151, resolvedByBot: 112, escalated: 19 },
    { date: "Thu", conversations: 189, resolvedByBot: 141, escalated: 26 },
    { date: "Fri", conversations: 173, resolvedByBot: 129, escalated: 21 },
    { date: "Sat", conversations: 118, resolvedByBot: 92, escalated: 11 },
    { date: "Sun", conversations: 96, resolvedByBot: 77, escalated: 8 },
  ],
  botPerformance: {
    automationRate: 78,
    averageConfidence: 91,
    averageResponseTime: "12s",
    fallbackRate: 9,
    metrics: [
      {
        label: "Resolved by Bot",
        value: "78%",
        hint: "without human intervention",
      },
      {
        label: "Avg Confidence",
        value: "91%",
        hint: "intent matching confidence",
      },
      {
        label: "Avg Response Time",
        value: "12s",
        hint: "time to first automated reply",
      },
      {
        label: "Fallback Rate",
        value: "9%",
        hint: "requests routed to fallback flow",
      },
    ],
  },
  recentConversations: [
    {
      id: "conv_001",
      contactName: "Sarah Ben Ali",
      phone: "+216 20 123 456",
      lastMessage: "I still haven’t received my order confirmation.",
      updatedAt: "5 min ago",
      status: "human_assigned",
      priority: "high",
      unreadCount: 2,
      assignedAgent: "Emna Jawadi",
    },
    {
      id: "conv_002",
      contactName: "Omar Khaled",
      phone: "+216 55 987 321",
      lastMessage: "Can I change my delivery address?",
      updatedAt: "12 min ago",
      status: "bot_active",
      priority: "medium",
      unreadCount: 0,
      assignedAgent: null,
    },
    {
      id: "conv_003",
      contactName: "Nour Haddad",
      phone: "+216 29 444 210",
      lastMessage: "Thank you, that solved my issue.",
      updatedAt: "28 min ago",
      status: "closed",
      priority: "low",
      unreadCount: 0,
      assignedAgent: null,
    },
    {
      id: "conv_004",
      contactName: "Karim Trabelsi",
      phone: "+216 98 765 100",
      lastMessage: "I need to speak to a real person please.",
      updatedAt: "34 min ago",
      status: "waiting_customer",
      priority: "high",
      unreadCount: 1,
      assignedAgent: "Sarra Mnif",
    },
  ],
  escalationSummary: {
    total: 56,
    pending: 14,
    resolved: 42,
    averageHandlingTime: "6m 18s",
    reasons: [
      { label: "Low confidence", count: 18 },
      { label: "Customer requested human", count: 15 },
      { label: "Order issue", count: 13 },
      { label: "Payment issue", count: 10 },
    ],
  },
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    await wait(400);
    return dashboardMock;
  },
};