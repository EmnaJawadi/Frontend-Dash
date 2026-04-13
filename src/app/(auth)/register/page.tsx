import Link from "next/link";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl md:p-8 fade-up">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Creation de compte</p>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Creer un compte</h1>
          <p className="text-sm text-muted-foreground">Creez un compte entreprise (owner) ou un compte agent (employe).</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous avez deja un compte ?{" "}
          <Link href="/login" className="font-medium underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
