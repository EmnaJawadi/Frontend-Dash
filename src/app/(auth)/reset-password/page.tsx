import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import ResetPasswordForm from "@/src/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Securite"
      title="Definir un nouveau mot de passe"
      subtitle="Choisissez un mot de passe robuste pour proteger votre espace support."
      panelTitle="Protection des acces"
      panelDescription="Chaque reinitialisation est concue pour reduire les risques tout en gardant une experience rapide pour vos equipes."
      footer={
        <p className="text-muted-foreground">
          Retour a{" "}
          <Link href="/login" className="font-medium underline underline-offset-4">
            la connexion
          </Link>
        </p>
      }
    >
      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
