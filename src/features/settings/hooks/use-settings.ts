"use client";

import { useCallback, useEffect, useState } from "react";
import { settingsService } from "@/src/features/settings/services/settings.service";
import type {
  SettingsData,
  UpdateSettingsPayload,
} from "@/src/features/settings/types/settings.types";

export function useSettings() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await settingsService.getSettings();
      setData(response);
    } catch (err) {
      console.error("Echec du chargement des parametres:", err);
      setError("Impossible de charger les parametres. Veuillez reessayer.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (payload: UpdateSettingsPayload) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      const response = await settingsService.updateSettings(payload);
      setData(response);
      return response;
    } catch (err) {
      console.error("Echec de sauvegarde des parametres:", err);
      const message =
        "Impossible d'enregistrer les parametres. Veuillez reessayer.";
      setSaveError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
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
