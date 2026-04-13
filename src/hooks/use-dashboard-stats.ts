"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/src/services/dashboard.service";

export type DashboardStats = {
  totalUsers: number;
  totalMessages: number;
  totalTickets: number;
  activeSubscriptions: number;
};

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.stats(),
  });
}