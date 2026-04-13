import Link from "next/link";
import LoginForm from "@/src/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl md:p-8 fade-up">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Espace client</p>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Connexion</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous selon votre type de compte.</p>
        </div>

        <LoginForm />

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <Link href="/register" className="font-medium underline underline-offset-4">
              Creer un compte
            </Link>
          </p>
          <p className="text-muted-foreground">
            <Link href="/forgot-password" className="font-medium underline underline-offset-4">
              Mot de passe oublie
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
