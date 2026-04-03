import Link from "next/link";
import LoginForm from "@/src/components/auth/login-form";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous selon votre type de compte.
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Vous n’avez pas de compte ?{" "}
            <Link href="/register" className="font-medium underline">
              Créer un compte
            </Link>
          </p>
          <p className="text-muted-foreground">
            <Link href="/forgot-password" className="font-medium underline">
              Mot de passe oublié
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}