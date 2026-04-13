"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
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
        className="w-full rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
      >
        Envoyer le lien
      </button>
    </form>
  );
}
