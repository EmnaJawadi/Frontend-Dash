"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getDefaultRedirectByRole } from "@/src/lib/auth";
import type { UserRole } from "@/src/types/role";

type LoginFormState = {
  email: string;
  password: string;
  role: UserRole;
};

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
    role: "OWNER",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value as UserRole,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Veuillez remplir l’email et le mot de passe.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = login({
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const redirectPath = getDefaultRedirectByRole(user.role);
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de se connecter. Veuillez réessayer."
      );
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

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="email@company.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}