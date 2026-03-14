"use client";

import { useParams } from "next/navigation";

export default function ArticleDetailsPage() {
  const params = useParams();

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-3xl font-semibold">
        Article Details
      </h1>

      <p className="text-muted-foreground">
        Article ID: {params.id}
      </p>

      <div className="border rounded-xl p-4">
        <h2 className="font-semibold text-xl mb-2">
          Exemple Article
        </h2>

        <p className="text-sm text-muted-foreground">
          Ceci est un exemple de contenu d'article.
        </p>
      </div>

    </div>
  );
}