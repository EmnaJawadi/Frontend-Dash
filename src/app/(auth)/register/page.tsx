import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Inscription entreprise"
      title="Demandez l'acces pour votre equipe"
      subtitle="Soumettez votre entreprise en quelques minutes. Le Super Admin valide ensuite votre acces au dashboard."
      panelTitle="Onboarding fluide pour les entreprises"
      panelDescription="Un parcours clair pour activer rapidement les comptes, structurer les roles et demarrer vos operations support."
      footer={
        <p className="text-muted-foreground">
          Vous avez deja un compte ?{" "}
          <Link href="/login" className="font-medium underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
