"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default function KnowledgeBasePage() {
  const articles = [
    {
      id: "kb_001",
      title: "Comment suivre une commande",
      category: "Commandes",
      status: "Publié",
      author: "Emna",
    },
    {
      id: "kb_002",
      title: "Politique de remboursement",
      category: "Paiements",
      status: "Publié",
      author: "Mariem",
    },
    {
      id: "kb_003",
      title: "FAQ Livraison",
      category: "Livraison",
      status: "Brouillon",
      author: "Ahmed",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les articles utilisés par le bot.
          </p>
        </div>

        <Link
          href="/knowledge-base/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white"
        >
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Auteur</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <FileText size={16} />
                  {article.title}
                </td>

                <td className="p-3">{article.category}</td>
                <td className="p-3">{article.status}</td>
                <td className="p-3">{article.author}</td>

                <td className="p-3 flex gap-2">
                  <Link
                    href={`/knowledge-base/${article.id}`}
                    className="text-blue-600"
                  >
                    Voir
                  </Link>

                  <Link
                    href={`/knowledge-base/${article.id}/edit`}
                    className="text-gray-600"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}