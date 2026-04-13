"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactsService } from "@/src/services/contacts.service";

type ContactDetails = {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string | null;
  phoneNumber: string;
  email?: string | null;
  notes?: string | null;
  tags?: string[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [contact, setContact] = React.useState<ContactDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadContact = React.useCallback(async () => {
    if (!id) {
      setError("Contact introuvable.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = (await contactsService.getById(id)) as ContactDetails;
      setContact(response);
    } catch (err) {
      console.error("Failed to load contact details", err);
      setError("Impossible de charger ce contact.");
      setContact(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void loadContact();
  }, [loadContact]);

  async function handleDelete() {
    if (!contact) return;

    const confirmed = window.confirm("Supprimer ce contact ?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);
      await contactsService.remove(contact.id);
      router.push("/contacts");
    } catch (err) {
      console.error("Failed to delete contact", err);
      setError("Impossible de supprimer ce contact.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement du contact...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="space-y-4 p-6">
        <Button asChild variant="outline">
          <Link href="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <p className="text-destructive">{error ?? "Contact introuvable."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline">
          <Link href="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/contacts/${contact.id}/edit`}>Modifier</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{contact.fullName || `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Telephone: </span>
            {contact.phoneNumber}
          </div>
          <div>
            <span className="font-medium">Email: </span>
            {contact.email || "-"}
          </div>
          <div>
            <span className="font-medium">Statut: </span>
            <Badge variant={contact.isBlocked ? "destructive" : "secondary"}>
              {contact.isBlocked ? "Bloque" : "Actif"}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Tags: </span>
            {(contact.tags ?? []).length
              ? (contact.tags ?? []).join(", ")
              : "-"}
          </div>
          <div>
            <span className="font-medium">Notes: </span>
            {contact.notes || "-"}
          </div>
          <div>
            <span className="font-medium">Cree le: </span>
            {new Date(contact.createdAt).toLocaleString("fr-FR")}
          </div>
          <div>
            <span className="font-medium">Mis a jour le: </span>
            {new Date(contact.updatedAt).toLocaleString("fr-FR")}
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
