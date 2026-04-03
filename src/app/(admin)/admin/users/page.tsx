const users = [
  {
    id: "1",
    name: "Emna Jawadi",
    email: "owner@supportos.com",
    role: "OWNER",
    company: "Support OS",
    status: "Active",
  },
  {
    id: "2",
    name: "Majdi Abbes",
    email: "agent@supportos.com",
    role: "AGENT",
    company: "Support OS",
    status: "Active",
  },
  {
    id: "3",
    name: "Platform Admin",
    email: "admin@platform.com",
    role: "SUPER_ADMIN",
    company: "-",
    status: "Active",
  },
];

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gérez les comptes utilisateurs et leurs rôles.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 text-sm font-semibold">Nom</th>
                <th className="px-4 py-3 text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-sm font-semibold">Rôle</th>
                <th className="px-4 py-3 text-sm font-semibold">Entreprise</th>
                <th className="px-4 py-3 text-sm font-semibold">Statut</th>
                <th className="px-4 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3 text-sm">{user.company}</td>
                  <td className="px-4 py-3 text-sm">{user.status}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button className="rounded-lg border px-3 py-1 text-sm transition hover:bg-muted">
                        Voir
                      </button>
                      <button className="rounded-lg border px-3 py-1 text-sm transition hover:bg-muted">
                        Désactiver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    Aucun utilisateur trouvé.
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