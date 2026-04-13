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
    setValues((prev) => ({ ...prev, [name]: checked }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3">
        <div>
          <p className="font-medium">Canal WhatsApp connecte</p>
          <p className="text-sm text-muted-foreground">Activez si votre canal WhatsApp est deja configure.</p>
        </div>
        <input type="checkbox" name="whatsappConnected" checked={values.whatsappConnected} onChange={handleChange} />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3">
        <div>
          <p className="font-medium">Base de connaissances prete</p>
          <p className="text-sm text-muted-foreground">Activez si vos articles ont deja ete importes.</p>
        </div>
        <input type="checkbox" name="knowledgeBaseReady" checked={values.knowledgeBaseReady} onChange={handleChange} />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3">
        <div>
          <p className="font-medium">Notifications activees</p>
          <p className="text-sm text-muted-foreground">Recevoir les alertes importantes de la plateforme.</p>
        </div>
        <input type="checkbox" name="notificationsEnabled" checked={values.notificationsEnabled} onChange={handleChange} />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90">
          Terminer
        </button>
      </div>
    </form>
  );
}
