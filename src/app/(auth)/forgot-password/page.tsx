import Link from "next/link";
import ForgotPasswordForm from "@/src/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl md:p-8 fade-up">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recuperation</p>
          <h1 className="text-2xl font-bold text-foreground">Mot de passe oublie</h1>
          <p className="text-sm text-muted-foreground">Entrez votre email pour recevoir un lien de reinitialisation.</p>
        </div>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Retour a{" "}
          <Link href="/login" className="font-medium underline underline-offset-4">
            la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
