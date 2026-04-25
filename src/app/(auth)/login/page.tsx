import Link from "next/link";
import { AuthShell } from "@/src/components/auth/auth-shell";
import LoginForm from "@/src/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Espace client"
      title="Connectez-vous et pilotez votre support en temps reel"
      subtitle="Accedez a vos conversations WhatsApp, suivez les performances et coordonnez votre equipe depuis un seul espace."
      panelTitle="Un dashboard pense pour vos operations support"
      panelDescription="Conversations, escalades, knowledge base et supervision agent: tout est centralise pour accelerer votre service client."
      footer={
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
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
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
