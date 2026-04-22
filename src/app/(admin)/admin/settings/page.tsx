"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  RefreshCw,
  Save,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { settingsService } from "@/src/features/settings/services/settings.service";
import type {
  PlatformAuditFilters,
  PlatformSettings,
  PlatformSettingsData,
} from "@/src/features/settings/types/settings.types";

const INITIAL_FILTERS: PlatformAuditFilters = {
  page: 1,
  limit: 10,
  action: "",
  entity: "",
  userId: "",
  dateFrom: "",
  dateTo: "",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR");
}

function statusColor(status: "healthy" | "warning" | "error") {
  if (status === "healthy") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (status === "warning") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

export default function AdminSettingsPage() {
  const [data, setData] = useState<PlatformSettingsData | null>(null);
  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [filters, setFilters] = useState<PlatformAuditFilters>(INITIAL_FILTERS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = useCallback(async (nextFilters: PlatformAuditFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await settingsService.getPlatformSettings(nextFilters);
      setData(snapshot);
      setForm(snapshot.settings);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les parametres plateforme.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings(filters);
  }, [fetchSettings, filters]);

  const canSave = useMemo(() => !isSaving && !!form, [form, isSaving]);

  async function handleSave() {
    if (!form) return;
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      await settingsService.updatePlatformSettings({
        configuration: form.configuration,
        security: form.security,
        aiGlobal: {
          ...form.aiGlobal,
          provider: "Google Gemini",
          model: "gemini-2.5-flash",
        },
      });
      await fetchSettings(filters);
      setSuccess("Parametres plateforme enregistres.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Echec de la sauvegarde des parametres.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTestIntegration(key: string) {
    try {
      setError(null);
      setSuccess(null);
      await settingsService.testPlatformIntegration(
        key as
          | "backend_api"
          | "postgresql"
          | "redis"
          | "n8n"
          | "smtp"
          | "whatsapp_meta"
          | "file_storage"
          | "queue_jobs",
      );
      await fetchSettings(filters);
      setSuccess("Test de connexion execute.");
    } catch (testError) {
      setError(
        testError instanceof Error ? testError.message : "Test de connexion echoue.",
      );
    }
  }

  function handleApplyFilters() {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function handlePrevPage() {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) - 1),
    }));
  }

  function handleNextPage() {
    const totalPages = data?.auditLogs.totalPages ?? 1;
    setFilters((prev) => ({
      ...prev,
      page: Math.min(totalPages, (prev.page ?? 1) + 1),
    }));
  }

  if (isLoading && !data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Chargement des parametres plateforme...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => void fetchSettings(filters)}
          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium hover:bg-red-100"
        >
          Reessayer
        </button>
      </div>
    );
  }

  if (!data || !form) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Parametres Plateforme
          </h2>
          <p className="text-sm text-slate-500">
            Configuration globale, securite, IA, integrations et audit.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void fetchSettings(filters)}
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => void handleSave()}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <SlidersHorizontal className="h-5 w-5" />
            1. Configuration generale
          </h3>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm text-slate-700">Mode maintenance</span>
            <input
              type="checkbox"
              checked={form.configuration.maintenanceMode}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        configuration: {
                          ...prev.configuration,
                          maintenanceMode: event.target.checked,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm text-slate-700">Invitations autorisees</span>
            <input
              type="checkbox"
              checked={form.configuration.allowInvitations}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        configuration: {
                          ...prev.configuration,
                          allowInvitations: event.target.checked,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Langue par defaut</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.configuration.defaultLanguage}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        configuration: {
                          ...prev.configuration,
                          defaultLanguage: event.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Fuseau horaire plateforme</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.configuration.platformTimezone}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        configuration: {
                          ...prev.configuration,
                          platformTimezone: event.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Email support plateforme</span>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.configuration.supportEmail}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        configuration: {
                          ...prev.configuration,
                          supportEmail: event.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">
                Politique d'inscription entreprises
              </span>
              <select
                value={form.configuration.companySignupPolicy}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          configuration: {
                            ...prev.configuration,
                            companySignupPolicy: event.target.value as
                              | "open"
                              | "invite_only"
                              | "closed",
                          },
                        }
                      : prev,
                  )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="open">Open</option>
                <option value="invite_only">Invite only</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
              <span className="text-sm text-slate-700">Validation manuelle</span>
              <input
                type="checkbox"
                checked={form.configuration.manualCompanyValidation}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          configuration: {
                            ...prev.configuration,
                            manualCompanyValidation: event.target.checked,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5" />
            2. Securite plateforme
          </h3>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm text-slate-700">
              Forcer 2FA pour les admins
            </span>
            <input
              type="checkbox"
              checked={form.security.enforceAdmin2fa}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        security: {
                          ...prev.security,
                          enforceAdmin2fa: event.target.checked,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">
                Duree session admin (minutes)
              </span>
              <input
                type="number"
                min={15}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.security.adminSessionDurationMinutes}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          security: {
                            ...prev.security,
                            adminSessionDurationMinutes:
                              Number(event.target.value) || 15,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600">
                Max tentatives de connexion
              </span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.security.maxLoginAttempts}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          security: {
                            ...prev.security,
                            maxLoginAttempts: Number(event.target.value) || 1,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">
                Duree blocage apres echecs (minutes)
              </span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.security.lockDurationMinutes}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          security: {
                            ...prev.security,
                            lockDurationMinutes: Number(event.target.value) || 1,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
              <span className="text-sm text-slate-700">
                Autoriser la reinitialisation mot de passe
              </span>
              <input
                type="checkbox"
                checked={form.security.allowPasswordReset}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          security: {
                            ...prev.security,
                            allowPasswordReset: event.target.checked,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Email alertes securite</span>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.security.securityAlertEmail}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        security: {
                          ...prev.security,
                          securityAlertEmail: event.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Bot className="h-5 w-5" />
            3. IA globale
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Provider IA par defaut</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                value={form.aiGlobal.provider}
                readOnly
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Modele global par defaut</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                value={form.aiGlobal.model}
                readOnly
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Seuil de confiance global</span>
              <input
                type="number"
                min={0}
                max={1}
                step="0.01"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.aiGlobal.confidenceThreshold}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          aiGlobal: {
                            ...prev.aiGlobal,
                            confidenceThreshold: Number(event.target.value) || 0,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Timeout IA (ms)</span>
              <input
                type="number"
                min={1000}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.aiGlobal.timeoutMs}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          aiGlobal: {
                            ...prev.aiGlobal,
                            timeoutMs: Number(event.target.value) || 1000,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Max tokens</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.aiGlobal.maxTokens}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          aiGlobal: {
                            ...prev.aiGlobal,
                            maxTokens: Number(event.target.value) || 1,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
              <span className="text-sm text-slate-700">Logs IA actives</span>
              <input
                type="checkbox"
                checked={form.aiGlobal.logsEnabled}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          aiGlobal: {
                            ...prev.aiGlobal,
                            logsEnabled: event.target.checked,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
              <span className="text-sm text-slate-700">
                Masquage donnees sensibles
              </span>
              <input
                type="checkbox"
                checked={form.aiGlobal.maskSensitiveDataInLogs}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          aiGlobal: {
                            ...prev.aiGlobal,
                            maskSensitiveDataInLogs: event.target.checked,
                          },
                        }
                      : prev,
                  )
                }
              />
            </label>
          </div>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm text-slate-700">Fallback humain global</span>
            <input
              type="checkbox"
              checked={form.aiGlobal.humanFallbackEnabled}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        aiGlobal: {
                          ...prev.aiGlobal,
                          humanFallbackEnabled: event.target.checked,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Prompt systeme global</span>
            <textarea
              className="h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.aiGlobal.systemPrompt}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        aiGlobal: {
                          ...prev.aiGlobal,
                          systemPrompt: event.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
          </label>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ServerCog className="h-5 w-5" />
            4. Integrations globales
          </h3>
          <div className="space-y-3">
            {data.integrations.map((integration) => (
              <div
                key={integration.key}
                className="rounded-xl border border-slate-200 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{integration.label}</p>
                    <p className="text-xs text-slate-500">{integration.message}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusColor(
                      integration.status,
                    )}`}
                  >
                    {integration.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">
                    Dernier check: {formatDateTime(integration.lastCheck)}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleTestIntegration(integration.key)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Tester connexion
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Activity className="h-5 w-5" />
            5. Supervision technique
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Latence API</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.apiLatencyMs} ms
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Backlog jobs</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.queueBacklog}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Uptime</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.uptimePercent}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Succes bot global</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.globalBotSuccessRate}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Erreurs recentes</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.recentErrorsCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Derniere erreur critique</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.supervision.lastCriticalError ?? "Aucune"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.supervision.services.map((service) => (
              <div
                key={service.key}
                className={`rounded-xl border px-3 py-2 ${statusColor(service.status)}`}
              >
                <p className="text-sm font-semibold">{service.label}</p>
                <p className="text-xs">{service.message}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <CheckCircle2 className="h-5 w-5" />
            6. Pilotage global
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Entreprises totales</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.totalCompanies}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Entreprises actives</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.activeCompanies}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Utilisateurs actifs</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.activeUsers}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Agents actifs</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.activeAgents}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Conversations globales</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.globalConversations}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Taux automatisation global</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.globalAutomationRate}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Taux handoff global</p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.globalHandoffRate}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Abonnements proches expiration
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {data.steering.subscriptionsExpiringSoon}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs text-red-600">Alertes critiques</p>
            <p className="text-base font-semibold text-red-700">
              {data.steering.criticalAlerts}
            </p>
          </div>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">7. Audit logs</h3>
        <div className="grid gap-3 md:grid-cols-5">
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, dateTo: event.target.value }))
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <input
            type="text"
            placeholder="Action"
            value={filters.action ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, action: event.target.value }))
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <input
            type="text"
            placeholder="Entite"
            value={filters.entity ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, entity: event.target.value }))
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <input
            type="text"
            placeholder="Utilisateur"
            value={filters.userId ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, userId: event.target.value }))
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Appliquer filtres
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reinitialiser
          </button>
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                limit: 100,
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Voir tout
          </button>
        </div>
        <div className="space-y-2">
          {data.auditLogs.data.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-900">{log.action}</p>
              <p className="text-xs text-slate-500">
                Entite: {log.entity} {log.entityId ? `(${log.entityId})` : ""}
              </p>
              <p className="text-xs text-slate-500">
                Utilisateur: {log.userId ?? "N/A"} - {formatDateTime(log.createdAt)}
              </p>
            </div>
          ))}
          {data.auditLogs.data.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Aucun log pour ce filtre.
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {data.auditLogs.page} / {data.auditLogs.totalPages} -{" "}
            {data.auditLogs.total} logs
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={(filters.page ?? 1) <= 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Precedent
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={(filters.page ?? 1) >= data.auditLogs.totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
