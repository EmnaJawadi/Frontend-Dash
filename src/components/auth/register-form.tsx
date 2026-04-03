"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, getDefaultRedirectByRole } from "@/src/lib/auth";
import type { UserRole } from "@/src/types/role";

type RegisterFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  companyName: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "OWNER",
    companyName: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.role !== "SUPER_ADMIN" && !formData.companyName.trim()) {
      setError("Veuillez saisir le nom de l’entreprise.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        companyName:
          formData.role === "SUPER_ADMIN"
            ? undefined
            : formData.companyName.trim(),
      });

      const redirectPath =
        user.role === "SUPER_ADMIN"
          ? getDefaultRedirectByRole(user.role)
          : "/company-info";

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Impossible de créer le compte. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="firstName" className="block text-sm font-medium">
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Emna"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Jawadi"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@company.com"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="******"
            className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="block text-sm font-medium">
          Type de compte
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        >
          <option value="OWNER">Propriétaire d’entreprise</option>
          <option value="AGENT">Agent</option>
          <option value="SUPER_ADMIN">Admin plateforme</option>
        </select>
      </div>

      {formData.role !== "SUPER_ADMIN" ? (
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
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Création..." : "Créer un compte"}
      </button>
    </form>
  );
}