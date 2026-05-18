import SetupForm from "@/src/components/onboarding/setup-form";
import { OnboardingShell } from "@/src/components/onboarding/onboarding-shell";

export default function SetupPage() {
  return (
    <OnboardingShell
      currentStep={2}
      title="Configuration initiale"
      description="Activez les fonctionnalites cles pour bien demarrer."
    >
      <SetupForm />
    </OnboardingShell>
  );
}
