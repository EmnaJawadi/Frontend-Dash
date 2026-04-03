import SetupForm from "@/src/components/onboarding/setup-form";

export default function SetupPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Configuration initiale</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Finalisez les derniers réglages avant d’accéder à votre espace.
          </p>
        </div>

        <SetupForm />
      </div>
    </main>
  );
}