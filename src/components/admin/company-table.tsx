type Company = {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: string;
  status: string;
};

type CompanyTableProps = {
  companies: Company[];
};

export default function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
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
                    <button className="rounded-lg border px-3 py-1 text-sm">
                      Voir
                    </button>
                    <button className="rounded-lg border px-3 py-1 text-sm">
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
  );
}