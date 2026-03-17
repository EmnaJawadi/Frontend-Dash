// src/features/dashboard/services/dashboard.service.ts

import type { DashboardData } from "@/src/features/dashboard/types/dashboard.types";

const dashboardMock: DashboardData = {
  stats: [
    {
      key: "totalConversations",
      title: "Total des conversations",
      value: 1284,
      change: 12.4,
      trend: "up",
      subtitle: "par rapport aux 7 derniers jours",
    },
    {
      key: "activeConversations",
      title: "Conversations actives",
      value: 86,
      change: 4.2,
      trend: "up",
      subtitle: "actuellement ouvertes",
    },
    {
      key: "automationRate",
      title: "Taux d’automatisation",
      value: "78%",
      change: 3.1,
      trend: "up",
      subtitle: "résolues par le bot",
    },
    {
      key: "escalationsToday",
      title: "Escalades aujourd’hui",
      value: 19,
      change: -6.8,
      trend: "down",
      subtitle: "transférées aux agents",
    },
    {
      key: "avgFirstResponseTime",
      title: "Temps moyen de première réponse",
      value: "1m 42s",
      change: -9.5,
      trend: "down",
      subtitle: "bot + humain",
    },
  ],
  chart: [
    { date: "Lun", conversations: 142, resolvedByBot: 105, escalated: 18 },
    { date: "Mar", conversations: 167, resolvedByBot: 121, escalated: 22 },
    { date: "Mer", conversations: 151, resolvedByBot: 112, escalated: 19 },
    { date: "Jeu", conversations: 189, resolvedByBot: 141, escalated: 26 },
    { date: "Ven", conversations: 173, resolvedByBot: 129, escalated: 21 },
    { date: "Sam", conversations: 118, resolvedByBot: 92, escalated: 11 },
    { date: "Dim", conversations: 96, resolvedByBot: 77, escalated: 8 },
  ],
  botPerformance: {
    automationRate: 78,
    averageConfidence: 91,
    averageResponseTime: "12s",
    fallbackRate: 9,
    metrics: [
      {
        label: "Résolues par le bot",
        value: "78%",
        hint: "sans intervention humaine",
      },
      {
        label: "Confiance moyenne",
        value: "91%",
        hint: "niveau de confiance de correspondance d’intention",
      },
      {
        label: "Temps de réponse moyen",
        value: "12s",
        hint: "temps jusqu’à la première réponse automatisée",
      },
      {
        label: "Taux de bascule",
        value: "9%",
        hint: "requêtes redirigées vers le flux de secours",
      },
    ],
  },
  recentConversations: [
    {
      id: "conv_001",
      contactName: "Sarah Ben Ali",
      phone: "+216 20 123 456",
      lastMessage: "Je n’ai toujours pas reçu ma confirmation de commande.",
      updatedAt: "il y a 5 min",
      status: "human_assigned",
      priority: "high",
      unreadCount: 2,
      assignedAgent: "Emna Jawadi",
    },
    {
      id: "conv_002",
      contactName: "Omar Khaled",
      phone: "+216 55 987 321",
      lastMessage: "Puis-je modifier mon adresse de livraison ?",
      updatedAt: "il y a 12 min",
      status: "bot_active",
      priority: "medium",
      unreadCount: 0,
      assignedAgent: null,
    },
    {
      id: "conv_003",
      contactName: "Nour Haddad",
      phone: "+216 29 444 210",
      lastMessage: "Merci, cela a résolu mon problème.",
      updatedAt: "il y a 28 min",
      status: "closed",
      priority: "low",
      unreadCount: 0,
      assignedAgent: null,
    },
    {
      id: "conv_004",
      contactName: "Karim Trabelsi",
      phone: "+216 98 765 100",
      lastMessage: "J’ai besoin de parler à une vraie personne, s’il vous plaît.",
      updatedAt: "il y a 34 min",
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
      { label: "Faible confiance", count: 18 },
      { label: "Le client a demandé un agent", count: 15 },
      { label: "Problème de commande", count: 13 },
      { label: "Problème de paiement", count: 10 },
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