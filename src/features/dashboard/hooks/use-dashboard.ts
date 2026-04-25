"use client";

import { useCallback, useEffect, useState } from "react";
import { isApiError } from "@/src/lib/api-error";
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
      if (isApiError(err)) {
        setError(
          err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible de charger les donnees du tableau de bord. Veuillez reessayer.",
        );
      } else {
        console.error("Echec du chargement des donnees du tableau de bord:", err);
        setError("Impossible de charger les donnees du tableau de bord. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
