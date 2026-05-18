import TeamForm from "@/src/components/onboarding/team-form";
import { OnboardingShell } from "@/src/components/onboarding/onboarding-shell";

export default function TeamPage() {
  return (
    <OnboardingShell
      currentStep={1}
      title="Informations sur l'equipe"
      description="Ajoutez les premieres informations pour votre equipe support."
    >
      <TeamForm />
    </OnboardingShell>
  );
}
