"use client";

export default function NewArticlePage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-semibold">Nouvel Article</h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Titre"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          placeholder="Contenu de l'article..."
          className="w-full border p-3 rounded-lg h-40"
        />

        <select className="w-full border p-3 rounded-lg">
          <option>Catégorie</option>
          <option>Commandes</option>
          <option>Livraison</option>
          <option>Paiements</option>
          <option>Retours</option>
        </select>

        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Enregistrer
        </button>

      </div>
    </div>
  );
}