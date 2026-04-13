import CompanyInfoForm from "@/src/components/onboarding/company-info-form";

export default function CompanyInfoPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 md:px-6">
      <div className="rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl md:p-8 fade-up">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Onboarding</p>
          <h1 className="text-2xl font-bold md:text-3xl">Informations entreprise</h1>
          <p className="text-sm text-muted-foreground">
            Renseignez les informations de base de votre entreprise pour continuer la configuration.
          </p>
        </div>

        <CompanyInfoForm />
      </div>
    </main>
  );
}
