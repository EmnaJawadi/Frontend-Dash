import Link from "next/link";
import ForgotPasswordForm from "@/src/components/auth/forgot-password-form";


export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Retour à{" "}
          <Link href="/login" className="font-medium underline">
            la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}