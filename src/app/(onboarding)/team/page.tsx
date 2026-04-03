import TeamForm from "@/src/components/onboarding/team-form";


export default function TeamPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Équipe</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajoutez les premières informations sur votre équipe support.
          </p>
        </div>

        <TeamForm />
      </div>
    </main>
  );
}