"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/src/services/auth.service";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Lien invalide. Recommencez la recuperation de mot de passe.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
    } catch {
      setError("Le lien est invalide ou expire. Veuillez demander un nouveau lien.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="auth-alert auth-alert-success">
        Votre mot de passe a ete reinitialise. Vous pouvez maintenant vous connecter.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <div className="auth-alert auth-alert-error">{error}</div> : null}

      <div className="space-y-1.5">
        <label className="auth-label">Nouveau mot de passe</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="auth-input"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="auth-label">Confirmer le mot de passe</label>
        <input
          type="password"
          placeholder="******"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="auth-input"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-button"
      >
        {isSubmitting ? "Mise a jour..." : "Reinitialiser le mot de passe"}
      </button>
    </form>
  );
}
