const subscriptions = [
  {
    id: "1",
    company: "Support OS",
    plan: "Premium",
    price: "99€/mois",
    renewalDate: "2026-05-12",
    status: "Active",
  },
  {
    id: "2",
    company: "Client Bridge",
    plan: "Standard",
    price: "49€/mois",
    renewalDate: "2026-04-20",
    status: "Active",
  },
  {
    id: "3",
    company: "Help Desk Pro",
    plan: "Basic",
    price: "19€/mois",
    renewalDate: "2026-03-05",
    status: "Expired",
  },
];

export default function AdminSubscriptionsPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Abonnements</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Suivez les plans, les renouvellements et l’état des abonnements.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 text-sm font-semibold">Entreprise</th>
                <th className="px-4 py-3 text-sm font-semibold">Plan</th>
                <th className="px-4 py-3 text-sm font-semibold">Prix</th>
                <th className="px-4 py-3 text-sm font-semibold">Renouvellement</th>
                <th className="px-4 py-3 text-sm font-semibold">Statut</th>
                <th className="px-4 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm">{subscription.company}</td>
                  <td className="px-4 py-3 text-sm">{subscription.plan}</td>
                  <td className="px-4 py-3 text-sm">{subscription.price}</td>
                  <td className="px-4 py-3 text-sm">{subscription.renewalDate}</td>
                  <td className="px-4 py-3 text-sm">{subscription.status}</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="rounded-lg border px-3 py-1 text-sm transition hover:bg-muted">
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}

              {subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    Aucun abonnement trouvé.
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