"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CompanyInfoState = {
  companyName: string;
  industry: string;
  size: string;
  website: string;
  address: string;
};

export default function CompanyInfoForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CompanyInfoState>({
    companyName: "",
    industry: "",
    size: "",
    website: "",
    address: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/team");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="companyName" className="block text-sm font-medium">
          Nom de l’entreprise
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Support OS"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="industry" className="block text-sm font-medium">
            Secteur
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Customer Support"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="size" className="block text-sm font-medium">
            Taille de l’équipe
          </label>
          <input
            id="size"
            name="size"
            type="number"
            value={formData.size}
            onChange={handleChange}
            placeholder="10"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="website" className="block text-sm font-medium">
          Site web
        </label>
        <input
          id="website"
          name="website"
          type="text"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://company.com"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="address" className="block text-sm font-medium">
          Adresse
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Adresse de l’entreprise"
          className="min-h-[120px] w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg border px-5 py-2 font-medium transition hover:bg-muted"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}