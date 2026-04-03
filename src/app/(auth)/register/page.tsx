import Link from "next/link";
import RegisterForm from "@/src/components/auth/register-form";


export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-6 py-10">
      <div className="w-full max-w-2xl rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez un compte entreprise ou un compte d’administration
            plateforme.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-medium underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}