"use client";

import { useCallback, useEffect, useState } from "react";
import { analyticsService } from "@/src/features/analytics/services/analytics.service";
import type {
  AnalyticsData,
  AnalyticsFilters,
} from "@/src/features/analytics/types/analytics.types";

export function useAnalytics(filters: AnalyticsFilters) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await analyticsService.getAnalyticsData(filters);
      setData(response);
    } catch (err) {
      console.error("Echec du chargement des donnees analytics :", err);
      setError("Impossible de charger les donnees analytics. Veuillez reessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
