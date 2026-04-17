"use client";

import { useCallback, useEffect, useState } from "react";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import type { SuperAdminSnapshot } from "@/src/features/super-admin/types/super-admin.types";

export function useSuperAdminSnapshot() {
  const [snapshot, setSnapshot] = useState<SuperAdminSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const next = await superAdminService.getSnapshot();
      setSnapshot(next);
      return next;
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Impossible de charger les donnees admin.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    snapshot,
    setSnapshot,
    isLoading,
    error,
    refresh,
  };
}
