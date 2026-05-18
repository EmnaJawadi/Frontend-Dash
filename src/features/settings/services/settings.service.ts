import { apiClient } from "@/src/lib/api-client";
import type {
  AgentSettingsSummaryData,
  CompanyAiSettingsData,
  CompanyAdminSettingsData,
  CompanyPreferencesData,
  CompanySupportAssigneeData,
  CompanyWhatsappConfigData,
  CompanyWhatsappConnectPayload,
  CompanyWhatsappQrData,
  CompanyWhatsappInstanceData,
  CompanySettingsData,
  CompanyWorkflowSettingsData,
  PlatformAuditFilters,
  PlatformIntegration,
  PlatformSettingsData,
  TestWhatsappConnectionResult,
  UpdateCompanyAiSettingsPayload,
  UpdateCompanyPreferencesPayload,
  UpdateCompanyAdminSettingsPayload,
  UpdateCompanyWhatsappInstancePayload,
  UpdateCompanySettingsPayload,
  UpdateCompanyWorkflowSettingsPayload,
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

type CompanyAdminSettingsRequestOptions = {
  includeWhatsapp?: boolean;
  includeAiSettings?: boolean;
  includeWorkflowSettings?: boolean;
  includeSupportAssignees?: boolean;
};

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

  async getCompanyAdminSettings({
    includeWhatsapp = false,
    includeAiSettings = false,
    includeWorkflowSettings = false,
    includeSupportAssignees = false,
  }: CompanyAdminSettingsRequestOptions = {}): Promise<CompanyAdminSettingsData> {
    const [
      whatsapp,
      aiSettings,
      workflowSettings,
      preferences,
      supportAssignees,
    ] = await Promise.all([
      includeWhatsapp
        ? apiClient.get<CompanyWhatsappConfigData>("/company/whatsapp/config")
        : Promise.resolve(null),
      includeAiSettings
        ? apiClient.get<CompanyAiSettingsData>("/company/ai-settings")
        : Promise.resolve(null),
      includeWorkflowSettings
        ? apiClient.get<CompanyWorkflowSettingsData>("/company/workflow-settings")
        : Promise.resolve(null),
      apiClient.get<CompanyPreferencesData>("/company/settings"),
      includeSupportAssignees
        ? apiClient.get<CompanySupportAssigneeData[]>("/company/support-assignees")
        : Promise.resolve([]),
    ]);

    return {
      whatsapp,
      aiSettings,
      workflowSettings,
      preferences,
      supportAssignees,
    };
  },

  getCompanyPreferences(): Promise<CompanyPreferencesData> {
    return apiClient.get<CompanyPreferencesData>("/company/settings");
  },

  updateCompanyPreferences(
    payload: UpdateCompanyPreferencesPayload,
  ): Promise<CompanyPreferencesData> {
    return apiClient.patch<CompanyPreferencesData>("/company/settings", payload);
  },

  getCompanyAiSettings(): Promise<CompanyAiSettingsData> {
    return apiClient.get<CompanyAiSettingsData>("/company/ai-settings");
  },

  updateCompanyAiSettings(
    payload: UpdateCompanyAiSettingsPayload,
  ): Promise<CompanyAiSettingsData> {
    return apiClient.patch<CompanyAiSettingsData>("/company/ai-settings", payload);
  },

  getCompanyWorkflowSettings(): Promise<CompanyWorkflowSettingsData> {
    return apiClient.get<CompanyWorkflowSettingsData>("/company/workflow-settings");
  },

  updateCompanyWorkflowSettings(
    payload: UpdateCompanyWorkflowSettingsPayload,
  ): Promise<CompanyWorkflowSettingsData> {
    return apiClient.patch<CompanyWorkflowSettingsData>(
      "/company/workflow-settings",
      payload,
    );
  },

  connectCompanyWhatsapp(
    payload: CompanyWhatsappConnectPayload,
  ): Promise<CompanyWhatsappConfigData> {
    return apiClient.post<CompanyWhatsappConfigData>(
      "/company/whatsapp/connect",
      payload,
    );
  },

  getCompanyWhatsappConfig(): Promise<CompanyWhatsappConfigData> {
    return apiClient.get<CompanyWhatsappConfigData>("/company/whatsapp/config");
  },

  getCompanyWhatsappQr(): Promise<CompanyWhatsappQrData> {
    return apiClient.get<CompanyWhatsappQrData>("/company/whatsapp/qr");
  },

  testCompanyWhatsappConnection(): Promise<TestWhatsappConnectionResult> {
    return apiClient.post<TestWhatsappConnectionResult>(
      "/company/whatsapp/test-connection",
    );
  },

  disconnectCompanyWhatsapp(): Promise<CompanyWhatsappConfigData> {
    return apiClient.post<CompanyWhatsappConfigData>(
      "/company/whatsapp/disconnect",
    );
  },

  resetCompanyWhatsapp(): Promise<CompanyWhatsappConfigData> {
    return apiClient.post<CompanyWhatsappConfigData>("/company/whatsapp/reset");
  },

  getCompanySettings(companyId?: string): Promise<CompanySettingsData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.get<CompanySettingsData>(`/settings/company${query}`);
  },

  getCompanyWhatsappInstance(companyId?: string): Promise<CompanyWhatsappInstanceData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.get<CompanyWhatsappInstanceData>(
      `/whatsapp/company-instance${query}`,
    );
  },

  updateCompanyWhatsappInstance(
    payload: UpdateCompanyWhatsappInstancePayload,
    companyId?: string,
  ): Promise<CompanyWhatsappInstanceData> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.post<CompanyWhatsappInstanceData>(
      `/whatsapp/company-instance${query}`,
      payload,
    );
  },

  testCompanyWhatsappConnectionLegacy(
    companyId?: string,
  ): Promise<TestWhatsappConnectionResult> {
    const query = companyId
      ? toQueryString({
          companyId,
        })
      : "";

    return apiClient.post<TestWhatsappConnectionResult>(
      `/whatsapp/company-instance/test${query}`,
    );
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
