"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/src/lib/api-error";
import { contactsService } from "@/src/services/contacts.service";

type BackendContact = {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string | null;
  phoneNumber: string;
  email?: string | null;
  tags?: string[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

type ContactsResponse = {
  data: BackendContact[];
  meta: {
    total: number;
  };
};

function statusLabel(isBlocked: boolean) {
  return isBlocked ? "Bloque" : "Actif";
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  return fallback;
}

export default function ContactsPage() {
  const [contacts, setContacts] = React.useState<BackendContact[]>([]);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingContactId, setDeletingContactId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");

  const loadContacts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = (await contactsService.list({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
      })) as ContactsResponse;

      setContacts(response.data ?? []);
    } catch (err) {
      console.error("Failed to load contacts", err);
      setError("Impossible de charger les contacts.");
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  async function handleCreateContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstName.trim() || !phoneNumber.trim()) {
      setError("Prenom et telephone sont obligatoires.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      await contactsService.create({
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || null,
      });

      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      await loadContacts();
      setSuccess("Contact ajoute avec succes.");
    } catch (err) {
      console.error("Failed to create contact", err);
      setError("Impossible de creer le contact.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteContact(contact: BackendContact) {
    const contactName =
      contact.fullName || `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim() || "ce contact";

    const confirmed = window.confirm(`Supprimer ${contactName} ?`);
    if (!confirmed) return;

    try {
      setDeletingContactId(contact.id);
      setError(null);
      setSuccess(null);
      await contactsService.remove(contact.id);
      await loadContacts();
      setSuccess("Contact supprime avec succes.");
    } catch (err) {
      console.error("Failed to delete contact", err);
      setError(getErrorMessage(err, "Impossible de supprimer le contact."));
    } finally {
      setDeletingContactId(null);
    }
  }

  const stats = React.useMemo(() => {
    const blocked = contacts.filter((item) => item.isBlocked).length;
    return {
      total: contacts.length,
      active: contacts.length - blocked,
      blocked,
    };
  }, [contacts]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
        <p className="text-sm text-muted-foreground">
          Donnees dynamiques chargees depuis le backend.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Actifs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bloques</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.blocked}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateContact} className="grid gap-3 md:grid-cols-5">
            <Input
              placeholder="Prenom *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Telephone *"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Rechercher par nom, telephone ou email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" onClick={() => void loadContacts()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun contact trouve.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nom</th>
                    <th className="px-4 py-3 text-left font-medium">Telephone</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Tags</th>
                    <th className="px-4 py-3 text-left font-medium">Statut</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-t">
                      <td className="px-4 py-3">{contact.fullName || `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()}</td>
                      <td className="px-4 py-3">{contact.phoneNumber}</td>
                      <td className="px-4 py-3">{contact.email || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags ?? []).length ? (
                            (contact.tags ?? []).map((tag) => (
                              <Badge key={`${contact.id}-${tag}`} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={contact.isBlocked ? "destructive" : "secondary"}>
                          {statusLabel(contact.isBlocked)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/contacts/${contact.id}`}>Voir</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/contacts/${contact.id}/edit`}>Modifier</Link>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => void handleDeleteContact(contact)}
                            disabled={deletingContactId === contact.id}
                          >
                            {deletingContactId === contact.id ? (
                              <>
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                Suppression...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-1 h-4 w-4" />
                                Supprimer
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
