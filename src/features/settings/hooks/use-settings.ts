"use client";

import { useCallback, useEffect, useState } from "react";
import { isApiError } from "@/src/lib/api-error";
import { settingsService } from "@/src/features/settings/services/settings.service";
import type {
  CompanySettingsData,
  UpdateCompanySettingsPayload,
} from "@/src/features/settings/types/settings.types";

export function useSettings() {
  const [data, setData] = useState<CompanySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (companyId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await settingsService.getCompanySettings(companyId);
      setData(response);
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 401) {
          setError("Session expiree. Veuillez vous reconnecter.");
        } else {
          setError(err.message || "Impossible de charger les parametres. Veuillez reessayer.");
        }
      } else {
        console.error("Echec du chargement des parametres:", err);
        setError("Impossible de charger les parametres. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(
    async (payload: UpdateCompanySettingsPayload, companyId?: string) => {
      try {
        setIsSaving(true);
        setSaveError(null);
        const response = await settingsService.updateCompanySettings(
          payload,
          companyId,
        );
        setData(response);
        return response;
      } catch (err) {
        const message = isApiError(err)
          ? err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible d'enregistrer les parametres. Veuillez reessayer."
          : "Impossible d'enregistrer les parametres. Veuillez reessayer.";

        if (!isApiError(err)) {
          console.error("Echec de sauvegarde des parametres:", err);
        }

        setSaveError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  return {
    data,
    isLoading,
    isSaving,
    error,
    saveError,
    refetch: fetchSettings,
    saveSettings,
  };
}
