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
      <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-4 text-sm text-green-700">
        Votre mot de passe a ete reinitialise. Vous pouvez maintenant vous connecter.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

      <div className="space-y-1">
        <label className="block text-sm font-medium">Nouveau mot de passe</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Confirmer le mot de passe</label>
        <input
          type="password"
          placeholder="******"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Mise a jour..." : "Reinitialiser le mot de passe"}
      </button>
    </form>
  );
}
