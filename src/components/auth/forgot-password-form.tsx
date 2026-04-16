"use client";

import { useState } from "react";
import { authService } from "@/src/services/auth.service";
import { isApiError } from "@/src/lib/api-error";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSmtpConfigError =
    error.toLowerCase().includes("smtp") ||
    error.toLowerCase().includes("app password") ||
    error.toLowerCase().includes("service unavailable");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await authService.forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (error) {
      if (isApiError(error)) {
        const details = error.details as { message?: string } | string | undefined;
        const backendMessage =
          typeof details === "object" && details && typeof details.message === "string"
            ? details.message
            : error.message;

        setError(backendMessage || "Impossible d'envoyer l'email pour le moment. Veuillez reessayer.");
      } else {
        setError("Impossible d'envoyer l'email pour le moment. Veuillez reessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-4 text-sm text-green-700">
        Un lien de reinitialisation a ete envoye a <strong>{email}</strong>.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          <div>{error}</div>
          {isSmtpConfigError ? (
            <div className="mt-2 text-xs text-red-800/90">
              Action requise: configurez SMTP_PASS (mot de passe d&apos;application Gmail) dans
              le fichier backend <code>.env</code>, puis redemarrez le backend.
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="email@entreprise.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/25"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
      >
        {isSubmitting ? "Envoi..." : "Envoyer le lien"}
      </button>
    </form>
  );
}
