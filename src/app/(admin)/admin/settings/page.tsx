"use client";

import { useEffect, useState } from "react";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

export default function AdminSettingsPage() {
  const { snapshot, setSnapshot, isLoading, error } = useSuperAdminSnapshot();
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [form, setForm] = useState({
    maintenanceMode: false,
    allowInvitations: true,
    defaultLanguage: "fr",
    supportEmail: "",
  });

  useEffect(() => {
    if (!snapshot) return;
    setForm(snapshot.globalSettings);
  }, [snapshot]);

  async function handleSaveSettings() {
    try {
      setIsSaving(true);
      setActionError(null);
      const nextSnapshot = await superAdminService.updateGlobalSettings(form);
      setSnapshot(nextSnapshot);
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : "Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRunMaintenance() {
    try {
      setIsSaving(true);
      setActionError(null);
      const nextSnapshot = await superAdminService.runMaintenance();
      setSnapshot(nextSnapshot);
    } catch (runError) {
      setActionError(runError instanceof Error ? runError.message : "Erreur maintenance.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement parametres...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger les parametres."}</div>;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Parametres globaux</h2>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
          <span className="text-sm text-slate-700">Mode maintenance</span>
          <input
            type="checkbox"
            checked={form.maintenanceMode}
            onChange={(event) => setForm((prev) => ({ ...prev, maintenanceMode: event.target.checked }))}
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
          <span className="text-sm text-slate-700">Invitations autorisees</span>
          <input
            type="checkbox"
            checked={form.allowInvitations}
            onChange={(event) => setForm((prev) => ({ ...prev, allowInvitations: event.target.checked }))}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Langue par defaut</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.defaultLanguage}
            onChange={(event) => setForm((prev) => ({ ...prev, defaultLanguage: event.target.value }))}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Email support</span>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.supportEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSaveSettings()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleRunMaintenance()}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
          >
            Lancer test maintenance
          </button>
        </div>

        {actionError ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div> : null}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Supervision technique</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Dernier check</p>
            <p className="text-sm font-semibold text-slate-900">{new Date(snapshot.maintenance.checkedAt).toLocaleString("fr-FR")}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Etat API</p>
            <p className="text-sm font-semibold text-slate-900">{snapshot.maintenance.apiLatencyMs} ms</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Backlog</p>
            <p className="text-sm font-semibold text-slate-900">{snapshot.maintenance.queueBacklog}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Succes bot</p>
            <p className="text-sm font-semibold text-slate-900">{snapshot.maintenance.botSuccessRate}%</p>
          </div>
        </div>

        <div className="space-y-2">
          {snapshot.maintenance.services.map((service) => (
            <div key={service.key} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium text-slate-900">{service.label}</p>
              <p className="text-xs text-slate-500">{service.status} - {service.message}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="mb-2 text-sm font-medium text-slate-900">Audit logs recents</p>
          <div className="space-y-2">
            {snapshot.auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-sm text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-500">{log.target} - {new Date(log.createdAt).toLocaleString("fr-FR")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
