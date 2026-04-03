"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) return;

    setIsSubmitted(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border px-4 py-2 font-medium transition hover:bg-muted"
            >
              Envoyer le lien
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Retour à{" "}
          <a href="/login" className="font-medium underline">
            la connexion
          </a>
        </p>
      </div>
    </main>
  );
}