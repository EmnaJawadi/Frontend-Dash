import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import ForgotPasswordForm from "@/src/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Recuperation"
      title="Mot de passe oublie"
      subtitle="Entrez votre email professionnel et recevez un lien de reinitialisation securise."
      panelTitle="Securite sans friction"
      panelDescription="Le processus de recuperation protege vos comptes tout en restant simple pour vos collaborateurs."
      footer={
        <p className="text-muted-foreground">
          Retour a{" "}
          <Link href="/login" className="font-medium underline underline-offset-4">
            la connexion
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
