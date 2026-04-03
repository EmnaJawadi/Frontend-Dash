export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Entreprises actives",
      value: "24",
      description: "Entreprises utilisant actuellement la plateforme.",
    },
    {
      label: "Utilisateurs",
      value: "132",
      description: "Comptes actifs sur l’ensemble de la plateforme.",
    },
    {
      label: "Abonnements actifs",
      value: "18",
      description: "Plans en cours de validité.",
    },
    {
      label: "Incidents ouverts",
      value: "3",
      description: "Éléments nécessitant une intervention de maintenance.",
    },
  ];

  return (
    <main className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Surveillez l’état global de la plateforme et les indicateurs de maintenance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-background p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-background p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Activité récente</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Nouvelle entreprise inscrite aujourd’hui.</li>
            <li>2 comptes agents ajoutés cette semaine.</li>
            <li>1 ticket de maintenance est en cours de traitement.</li>
            <li>Un abonnement a été renouvelé automatiquement.</li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-background p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Actions rapides</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/admin/companies"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Voir les entreprises
            </a>
            <a
              href="/admin/users"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Voir les utilisateurs
            </a>
            <a
              href="/admin/subscriptions"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Voir les abonnements
            </a>
            <a
              href="/admin/settings"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Paramètres admin
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}