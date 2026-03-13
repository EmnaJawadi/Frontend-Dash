"use client";

import { useParams } from "next/navigation";

export default function EditArticlePage() {
  const params = useParams();

  return (
    <div className="p-6 space-y-6 max-w-3xl">

      <h1 className="text-3xl font-semibold">
        Modifier Article
      </h1>

      <p className="text-sm text-muted-foreground">
        Article ID: {params.id}
      </p>

      <div className="space-y-4">

        <input
          type="text"
          defaultValue="Titre article"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          defaultValue="Contenu article..."
          className="w-full border p-3 rounded-lg h-40"
        />

        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Sauvegarder
        </button>

      </div>

    </div>
  );
}