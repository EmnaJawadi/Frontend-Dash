"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SetupState = {
  whatsappConnected: boolean;
  knowledgeBaseReady: boolean;
  notificationsEnabled: boolean;
};

export default function SetupForm() {
  const router = useRouter();

  const [values, setValues] = useState<SetupState>({
    whatsappConnected: false,
    knowledgeBaseReady: false,
    notificationsEnabled: true,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="font-medium">WhatsApp connecté</p>
          <p className="text-sm text-muted-foreground">
            Activez si votre canal WhatsApp est déjà configuré.
          </p>
        </div>
        <input
          type="checkbox"
          name="whatsappConnected"
          checked={values.whatsappConnected}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="font-medium">Base de connaissances prête</p>
          <p className="text-sm text-muted-foreground">
            Activez si vos articles ont déjà été importés.
          </p>
        </div>
        <input
          type="checkbox"
          name="knowledgeBaseReady"
          checked={values.knowledgeBaseReady}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="font-medium">Notifications activées</p>
          <p className="text-sm text-muted-foreground">
            Recevoir les alertes importantes de la plateforme.
          </p>
        </div>
        <input
          type="checkbox"
          name="notificationsEnabled"
          checked={values.notificationsEnabled}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg border px-5 py-2 font-medium transition hover:bg-muted"
        >
          Terminer
        </button>
      </div>
    </form>
  );
}