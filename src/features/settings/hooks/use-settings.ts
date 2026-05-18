"use client";

import { useCallback, useEffect, useState } from "react";
import { isApiError } from "@/src/lib/api-error";
import { canAccessCompanySettingsCard } from "@/src/features/settings/settings-permissions";
import { settingsService } from "@/src/features/settings/services/settings.service";
import type {
  CompanyAdminSettingsData,
  CompanyWhatsappQrData,
  TestWhatsappConnectionResult,
  UpdateCompanyAiSettingsPayload,
  UpdateCompanyPreferencesPayload,
  UpdateCompanyWorkflowSettingsPayload,
} from "@/src/features/settings/types/settings.types";
import type { UserRole } from "@/src/types/role";

type SaveCompanyAdminSettingsPayload = {
  aiSettings?: UpdateCompanyAiSettingsPayload;
  workflowSettings?: UpdateCompanyWorkflowSettingsPayload;
  preferences?: UpdateCompanyPreferencesPayload;
};

type UseSettingsOptions = {
  role: UserRole | null;
};

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    if (error.status === 401) {
      return "Session expiree. Veuillez vous reconnecter.";
    }

    return error.message || fallback;
  }

  return fallback;
}

export function useSettings({ role }: UseSettingsOptions) {
  const [data, setData] = useState<CompanyAdminSettingsData | null>(null);
  const [qrCode, setQrCode] = useState<CompanyWhatsappQrData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!role) {
      setIsLoading(false);
      return;
    }

    const includeWhatsapp = canAccessCompanySettingsCard(role, "whatsapp");
    const includeAiSettings = canAccessCompanySettingsCard(role, "ai");
    const includeWorkflowSettings = canAccessCompanySettingsCard(role, "workflow");

    try {
      setIsLoading(true);
      setError(null);
      const response = await settingsService.getCompanyAdminSettings({
        includeWhatsapp,
        includeAiSettings,
        includeWorkflowSettings,
        includeSupportAssignees: includeWorkflowSettings,
      });
      setData(response);
    } catch (err) {
      setError(
        resolveErrorMessage(
          err,
          "Impossible de charger les parametres. Veuillez reessayer.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  const saveSettings = useCallback(
    async (payload: SaveCompanyAdminSettingsPayload) => {
      try {
        setIsSaving(true);
        setSaveError(null);

        const [preferences, aiSettings, workflowSettings] = await Promise.all([
          payload.preferences
            ? settingsService.updateCompanyPreferences(payload.preferences)
            : Promise.resolve(data?.preferences ?? null),
          payload.aiSettings
            ? settingsService.updateCompanyAiSettings(payload.aiSettings)
            : Promise.resolve(data?.aiSettings ?? null),
          payload.workflowSettings
            ? settingsService.updateCompanyWorkflowSettings(
                payload.workflowSettings,
              )
            : Promise.resolve(data?.workflowSettings ?? null),
        ]);

        setData((current) =>
          current
            ? {
                ...current,
                preferences: preferences ?? current.preferences,
                aiSettings: aiSettings ?? current.aiSettings,
                workflowSettings: workflowSettings ?? current.workflowSettings,
              }
            : current,
        );
      } catch (err) {
        const message = resolveErrorMessage(
          err,
          "Impossible d'enregistrer les parametres. Veuillez reessayer.",
        );
        setSaveError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [data],
  );

  const connectWhatsapp = useCallback(async (evolutionInstanceName: string) => {
    try {
      setIsConnecting(true);
      setSaveError(null);
      const whatsapp = await settingsService.connectCompanyWhatsapp({
        evolutionInstanceName,
      });
      setData((current) => (current ? { ...current, whatsapp } : current));
      return whatsapp;
    } catch (err) {
      const message = resolveErrorMessage(
        err,
        "Impossible de connecter WhatsApp.",
      );
      setSaveError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const loadQrCode = useCallback(async () => {
    try {
      setIsQrLoading(true);
      setSaveError(null);
      const qr = await settingsService.getCompanyWhatsappQr();
      setQrCode(qr);
      setData((current) =>
        current?.whatsapp
          ? {
              ...current,
              whatsapp: {
                ...current.whatsapp,
                connectionStatus: qr.status,
              },
            }
          : current,
      );
      return qr;
    } catch (err) {
      const message = resolveErrorMessage(
        err,
        "Impossible de recuperer le QR code WhatsApp.",
      );
      setSaveError(message);
      throw err;
    } finally {
      setIsQrLoading(false);
    }
  }, []);

  const testWhatsappConnection =
    useCallback(async (): Promise<TestWhatsappConnectionResult> => {
      try {
        setIsTestingConnection(true);
        setSaveError(null);
        const response = await settingsService.testCompanyWhatsappConnection();
        const whatsapp = await settingsService.getCompanyWhatsappConfig();
        setData((current) => (current ? { ...current, whatsapp } : current));
        return response;
      } catch (err) {
        const message = resolveErrorMessage(
          err,
          "Echec du test de connexion WhatsApp.",
        );
        setSaveError(message);
        throw err;
      } finally {
        setIsTestingConnection(false);
      }
    }, []);

  const disconnectWhatsapp = useCallback(async () => {
    try {
      setIsDisconnecting(true);
      setSaveError(null);
      const whatsapp = await settingsService.disconnectCompanyWhatsapp();
      setQrCode(null);
      setData((current) => (current ? { ...current, whatsapp } : current));
      return whatsapp;
    } catch (err) {
      const message = resolveErrorMessage(
        err,
        "Impossible de deconnecter WhatsApp.",
      );
      setSaveError(message);
      throw err;
    } finally {
      setIsDisconnecting(false);
    }
  }, []);

  const resetWhatsapp = useCallback(async () => {
    try {
      setIsResetting(true);
      setSaveError(null);
      const whatsapp = await settingsService.resetCompanyWhatsapp();
      setQrCode(null);
      setData((current) => (current ? { ...current, whatsapp } : current));
      return whatsapp;
    } catch (err) {
      const message = resolveErrorMessage(
        err,
        "Impossible de reinitialiser la connexion WhatsApp.",
      );
      setSaveError(message);
      throw err;
    } finally {
      setIsResetting(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  return {
    data,
    qrCode,
    isLoading,
    isSaving,
    isConnecting,
    isTestingConnection,
    isQrLoading,
    isDisconnecting,
    isResetting,
    error,
    saveError,
    refetch: fetchSettings,
    saveSettings,
    connectWhatsapp,
    loadQrCode,
    testWhatsappConnection,
    disconnectWhatsapp,
    resetWhatsapp,
  };
}
