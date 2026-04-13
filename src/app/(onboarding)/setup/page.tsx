import SetupForm from "@/src/components/onboarding/setup-form";

export default function SetupPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 md:px-6">
      <div className="rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl md:p-8 fade-up">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Onboarding</p>
          <h1 className="text-2xl font-bold md:text-3xl">Configuration initiale</h1>
          <p className="text-sm text-muted-foreground">Finalisez les derniers reglages avant d'acceder a votre espace.</p>
        </div>

        <SetupForm />
      </div>
    </main>
  );
}
