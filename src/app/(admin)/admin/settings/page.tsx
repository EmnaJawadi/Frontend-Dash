"use client";

import { useState } from "react";

type AdminSettingsState = {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettingsState>({
    platformName: "WhatsApp Support Dashboard",
    supportEmail: "support@platform.com",
    maintenanceMode: false,
    allowRegistrations: true,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Paramètres enregistrés avec succès.");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configurez les paramètres globaux de maintenance et de plateforme.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border bg-background p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="platformName" className="block text-sm font-medium">
              Nom de la plateforme
            </label>
            <input
              id="platformName"
              name="platformName"
              type="text"
              value={settings.platformName}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="supportEmail" className="block text-sm font-medium">
              Email support
            </label>
            <input
              id="supportEmail"
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="font-medium">Mode maintenance</p>
              <p className="text-sm text-muted-foreground">
                Désactiver temporairement l’accès aux utilisateurs.
              </p>
            </div>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="font-medium">Autoriser les inscriptions</p>
              <p className="text-sm text-muted-foreground">
                Permettre aux nouvelles entreprises de créer un compte.
              </p>
            </div>
            <input
              type="checkbox"
              name="allowRegistrations"
              checked={settings.allowRegistrations}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg border px-5 py-2 font-medium transition hover:bg-muted"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}