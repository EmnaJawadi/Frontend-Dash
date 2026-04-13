import { apiClient } from "@/src/lib/api-client";
import type {
  SettingsData,
  UpdateSettingsPayload,
} from "@/src/features/settings/types/settings.types";

export const settingsService = {
  getSettings(): Promise<SettingsData> {
    return apiClient.get<SettingsData>("/settings");
  },

  updateSettings(payload: UpdateSettingsPayload): Promise<SettingsData> {
    return apiClient.patch<SettingsData>("/settings", payload);
  },
};
