const companies = [
  {
    id: "1",
    name: "Support OS",
    owner: "Emna Jawadi",
    email: "contact@supportos.com",
    plan: "Premium",
    status: "Active",
  },
  {
    id: "2",
    name: "Client Bridge",
    owner: "Majdi Abbes",
    email: "hello@clientbridge.com",
    plan: "Standard",
    status: "Active",
  },
  {
    id: "3",
    name: "Help Desk Pro",
    owner: "Sara Ben Ali",
    email: "admin@helpdeskpro.com",
    plan: "Basic",
    status: "Inactive",
  },
];

export default function AdminCompaniesPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Entreprises</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gérez les entreprises clientes qui utilisent la plateforme.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 text-sm font-semibold">Entreprise</th>
                <th className="px-4 py-3 text-sm font-semibold">Propriétaire</th>
                <th className="px-4 py-3 text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-sm font-semibold">Plan</th>
                <th className="px-4 py-3 text-sm font-semibold">Statut</th>
                <th className="px-4 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm">{company.name}</td>
                  <td className="px-4 py-3 text-sm">{company.owner}</td>
                  <td className="px-4 py-3 text-sm">{company.email}</td>
                  <td className="px-4 py-3 text-sm">{company.plan}</td>
                  <td className="px-4 py-3 text-sm">{company.status}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button className="rounded-lg border px-3 py-1 text-sm transition hover:bg-muted">
                        Voir
                      </button>
                      <button className="rounded-lg border px-3 py-1 text-sm transition hover:bg-muted">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {companies.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    Aucune entreprise trouvée.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}