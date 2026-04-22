import { apiClient } from "@/src/lib/api-client";
import type {
  AgentSettingsSummaryData,
  CompanySettingsData,
  PlatformAuditFilters,
  PlatformIntegration,
  PlatformSettingsData,
  UpdateCompanyAdminSettingsPayload,
  UpdateCompanySettingsPayload,
  UpdatePlatformSettingsPayload,
} from "@/src/features/settings/types/settings.types";

function toQueryString(filters: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const settingsService = {
  getPlatformSettings(filters: PlatformAuditFilters = {}): Promise<PlatformSettingsData> {
    const query = toQueryString({
      page: filters.page,
      limit: filters.limit,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      action: filters.action,
      entity: filters.entity,
      userId: filters.userId,
    });

    return apiClient.get<PlatformSettingsData>(`/settings/platform${query}`);
  },

  updatePlatformSettings(payload: UpdatePlatformSettingsPayload): Promise<PlatformSettingsData> {
    return apiClient.patch<PlatformSettingsData>("/settings/platform", payload);
  },

  testPlatformIntegration(
    key: PlatformIntegration["key"],
  ): Promise<PlatformIntegration> {
    return apiClient.post<PlatformIntegration>(
      `/settings/platform/integrations/${key}/test`,
    );
  },

  getCompanySettings(companyId?: string): Promise<CompanySettingsData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.get<CompanySettingsData>(`/settings/company${query}`);
  },

  updateCompanySettings(
    payload: UpdateCompanySettingsPayload,
    companyId?: string,
  ): Promise<CompanySettingsData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.patch<CompanySettingsData>(`/settings/company${query}`, payload);
  },

  updateCompanyAdminSettings(
    payload: UpdateCompanyAdminSettingsPayload,
  ): Promise<CompanySettingsData> {
    return apiClient.patch<CompanySettingsData>(
      "/settings/company/admin-only",
      payload,
    );
  },

  getAgentSettingsSummary(companyId?: string): Promise<AgentSettingsSummaryData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.get<AgentSettingsSummaryData>(`/settings/agent-summary${query}`);
  },
};
