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

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
      setError("Veuillez remplir l'email et le mot de passe.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login({
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const redirectPath = getDefaultRedirectByRole(user.role);
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible de se connecter. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="auth-alert auth-alert-error">{error}</div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="email@entreprise.com"
          value={formData.email}
          onChange={handleChange}
          className="auth-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="auth-label">
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
          className="auth-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="role" className="auth-label">
          Type de compte
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="auth-select"
        >
          <option value="SUPER_ADMIN">Super Admin (plateforme)</option>
          <option value="OWNER">Admin entreprise (owner)</option>
          <option value="AGENT">Agent (employe)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-button"
      >
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
