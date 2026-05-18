import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Inscription"
      title="Creer un compte"
      subtitle="Choisissez le type de compte, puis renseignez les informations demandees."
      panelTitle="Acces controle au support"
      panelDescription="Les entreprises soumettent leur creation et les agents rejoignent une entreprise existante apres validation."
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
