"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  Tags,
  UserRound,
  Eye,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ArticleCategory =
  | "commandes"
  | "paiements"
  | "livraison"
  | "retours"
  | "general";

function categoryLabel(category: ArticleCategory) {
  switch (category) {
    case "commandes":
      return "Commandes";
    case "paiements":
      return "Paiements";
    case "livraison":
      return "Livraison";
    case "retours":
      return "Retours";
    case "general":
      return "Général";
    default:
      return category;
  }
}

export default function NewArticlePage() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ArticleCategory>("commandes");
  const [author, setAuthor] = React.useState("Emna");
  const [saveMessage, setSaveMessage] = React.useState("");

  const handleSave = () => {
    setSaveMessage("Article enregistré avec succès.");
    setTimeout(() => setSaveMessage(""), 2500);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la base
          </Link>
        </Button>

        <Button
          onClick={handleSave}
          className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
        >
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      {saveMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      ) : null}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Nouvel article</h1>
        <p className="text-sm text-muted-foreground">
          Ajoutez un contenu qui pourra être utilisé par le bot pour répondre
          aux clients.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Contenu de l’article</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Titre</Label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de l’article"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as ArticleCategory)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commandes">Commandes</SelectItem>
                      <SelectItem value="paiements">Paiements</SelectItem>
                      <SelectItem value="livraison">Livraison</SelectItem>
                      <SelectItem value="retours">Retours</SelectItem>
                      <SelectItem value="general">Général</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Auteur</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="Nom de l’auteur"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez ici le contenu de l’article..."
                  className="min-h-[220px] rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Aperçu rapide</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-semibold">
                  {title || "Titre de l’article"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Auteur: {author || "Non défini"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {categoryLabel(category)}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Brouillon
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                {content
                  ? content.slice(0, 220) + (content.length > 220 ? "..." : "")
                  : "Aucun contenu saisi pour le moment."}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Tags className="h-4 w-4" />
                Conseils
              </div>
              <p className="text-sm text-muted-foreground">
                Utilisez des réponses courtes, claires et faciles à réutiliser
                par le bot dans les conversations clients.
              </p>

              <div className="mt-4">
                <Button variant="outline" className="w-full rounded-xl">
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}