import CompanyInfoForm from "@/src/components/onboarding/company-info-form";


export default function CompanyInfoPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Informations de l’entreprise</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complétez les informations de votre société pour continuer
            l’onboarding.
          </p>
        </div>

        <CompanyInfoForm />
      </div>
    </main>
  );
}