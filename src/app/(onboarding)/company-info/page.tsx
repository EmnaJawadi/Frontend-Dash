import CompanyInfoForm from "@/src/components/onboarding/company-info-form";
import { OnboardingShell } from "@/src/components/onboarding/onboarding-shell";

export default function CompanyInfoPage() {
  return (
    <OnboardingShell
      currentStep={1}
      title="Informations entreprise"
      description="Renseignez les informations de base de votre entreprise pour continuer la configuration."
    >
      <CompanyInfoForm />
    </OnboardingShell>
  );
}
