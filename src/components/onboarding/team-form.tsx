"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TeamState = {
  managerName: string;
  managerEmail: string;
  agentsCount: string;
  shifts: string;
};

export default function TeamForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<TeamState>({
    managerName: "",
    managerEmail: "",
    agentsCount: "",
    shifts: "Jour",
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/setup");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="managerName" className="block text-sm font-medium">Responsable equipe</label>
          <input
            id="managerName"
            name="managerName"
            type="text"
            value={formData.managerName}
            onChange={handleChange}
            placeholder="Nom du responsable"
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="managerEmail" className="block text-sm font-medium">Email responsable</label>
          <input
            id="managerEmail"
            name="managerEmail"
            type="email"
            value={formData.managerEmail}
            onChange={handleChange}
            placeholder="responsable@entreprise.com"
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="agentsCount" className="block text-sm font-medium">Nombre d'agents</label>
          <input
            id="agentsCount"
            name="agentsCount"
            type="number"
            value={formData.agentsCount}
            onChange={handleChange}
            placeholder="6"
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="shifts" className="block text-sm font-medium">Mode de couverture</label>
          <select
            id="shifts"
            name="shifts"
            value={formData.shifts}
            onChange={handleChange}
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          >
            <option value="Jour">Jour</option>
            <option value="Jour et nuit">Jour et nuit</option>
            <option value="24/7">24/7</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90">
          Continuer
        </button>
      </div>
    </form>
  );
}
