// src/features/dashboard/hooks/use-dashboard.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "@/src/features/dashboard/services/dashboard.service";
import type { DashboardData } from "@/src/features/dashboard/types/dashboard.types";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await dashboardService.getDashboardData();
      setData(response);
    } catch (err) {
      console.error("Échec du chargement des données du tableau de bord :", err);
      setError("Impossible de charger les données du tableau de bord. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}