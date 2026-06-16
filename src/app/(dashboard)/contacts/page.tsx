"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/src/components/shared/data-table";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { isApiError } from "@/src/lib/api-error";
import { contactsService } from "@/src/services/contacts.service";
import { useToast } from "@/src/contexts/toast-context";

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
  return isBlocked ? "Bloqué" : "Actif";
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  return fallback;
}

export default function ContactsPage() {
  const { showToast } = useToast();

  const [contacts, setContacts] = React.useState<BackendContact[]>([]);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);
  const [deletingContactId, setDeletingContactId] = React.useState<string | null>(null);
  const [selectedContactIds, setSelectedContactIds] = React.useState<Set<string>>(new Set());

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");

  const loadContacts = React.useCallback(async () => {
    try {
      setIsLoading(true);

      const response = (await contactsService.list({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
      })) as ContactsResponse;

      setContacts(response.data ?? []);
    } catch (err) {
      console.error("Failed to load contacts", err);
      showToast({ message: "Impossible de charger les contacts.", type: "error" });
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  React.useEffect(() => {
    setSelectedContactIds((prev) => {
      const visibleIds = new Set(contacts.map((item) => item.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (visibleIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [contacts]);

  async function handleCreateContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstName.trim() || !phoneNumber.trim()) {
      showToast({ message: "Prénom et téléphone sont obligatoires.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);

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
      showToast({ message: "Contact ajouté avec succès.", type: "success" });
    } catch (err) {
      console.error("Failed to create contact", err);
      showToast({ message: "Impossible de créer le contact.", type: "error" });
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
      await contactsService.remove(contact.id);
      await loadContacts();
      showToast({ message: "Contact supprimé avec succès.", type: "success" });
    } catch (err) {
      console.error("Failed to delete contact", err);
      showToast({ message: getErrorMessage(err, "Impossible de supprimer le contact."), type: "error" });
    } finally {
      setDeletingContactId(null);
    }
  }

  function toggleContactSelection(contactId: string, checked: boolean) {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(contactId);
      } else {
        next.delete(contactId);
      }
      return next;
    });
  }

  function toggleSelectAllVisible(checked: boolean) {
    if (checked) {
      setSelectedContactIds(new Set(contacts.map((contact) => contact.id)));
      return;
    }
    setSelectedContactIds(new Set());
  }

  async function handleDeleteSelectedContacts() {
    if (selectedContactIds.size === 0) return;

    const confirmed = window.confirm(
      `Supprimer ${selectedContactIds.size} contact(s) sélectionné(s) ?`,
    );
    if (!confirmed) return;

    try {
      setIsBulkDeleting(true);

      const ids = Array.from(selectedContactIds);
      const deletions = await Promise.allSettled(
        ids.map((id) => contactsService.remove(id)),
      );

      const deletedCount = deletions.filter((item) => item.status === "fulfilled").length;
      const failedCount = ids.length - deletedCount;

      await loadContacts();
      setSelectedContactIds(new Set());

      if (failedCount > 0) {
        showToast({
          message: `${deletedCount} contact(s) supprimé(s), ${failedCount} échec(s).`,
          type: "warning",
        });
      } else {
        showToast({ message: `${deletedCount} contact(s) supprimé(s) avec succès.`, type: "success" });
      }
    } catch (err) {
      console.error("Failed to delete selected contacts", err);
      showToast({ message: getErrorMessage(err, "Impossible de supprimer la sélection."), type: "error" });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  const selectedCount = selectedContactIds.size;
  const allVisibleSelected =
    contacts.length > 0 && selectedCount === contacts.length;
  const partiallySelected =
    selectedCount > 0 && selectedCount < contacts.length;
  const selectAllRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = partiallySelected;
  }, [partiallySelected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateContact} className="grid gap-4 md:grid-cols-5">
            <Input
              placeholder="Prénom *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Téléphone *"
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
                placeholder="Rechercher par nom, téléphone ou email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadContacts()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleDeleteSelectedContacts()}
              disabled={selectedCount === 0 || isBulkDeleting}
            >
              {isBulkDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Supprimer la sélection ({selectedCount})
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          ) : (
            <DataTable
              data={contacts}
              rowKey={(contact) => contact.id}
              emptyMessage="Aucun contact trouvé."
              columns={[
                {
                  key: "select",
                  header: (
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={(event) =>
                          toggleSelectAllVisible(event.target.checked)
                        }
                        aria-label="Sélectionner tous les contacts"
                        className="app-checkbox"
                      />
                  ),
                  className: "w-[48px]",
                  render: (contact) => (
                    <input
                      type="checkbox"
                      checked={selectedContactIds.has(contact.id)}
                      onChange={(event) =>
                        toggleContactSelection(contact.id, event.target.checked)
                      }
                      aria-label={`Sélectionner ${contact.fullName || contact.phoneNumber}`}
                      className="app-checkbox"
                    />
                  ),
                },
                {
                  key: "name",
                  header: "Nom",
                  className: "min-w-[220px]",
                  render: (contact) => (
                    <span className="font-semibold text-foreground">
                      {contact.fullName || `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()}
                    </span>
                  ),
                },
                {
                  key: "phone",
                  header: "Téléphone",
                  className: "min-w-[150px]",
                  render: (contact) => contact.phoneNumber,
                },
                {
                  key: "email",
                  header: "Email",
                  className: "min-w-[190px]",
                  render: (contact) => contact.email || "-",
                },
                {
                  key: "tags",
                  header: "Tags",
                  className: "min-w-[140px]",
                  render: (contact) => (
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
                  ),
                },
                {
                  key: "status",
                  header: "Statut",
                  className: "min-w-[110px]",
                  render: (contact) => (
                    <StatusBadge variant={contact.isBlocked ? "danger" : "success"}>
                      {statusLabel(contact.isBlocked)}
                    </StatusBadge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  className: "min-w-[390px] text-right",
                  render: (contact) => (
                        <div className="app-action-row justify-end">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/contacts/${contact.id}`}>Voir détails</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/contacts/${contact.id}/edit`}>Modifier</Link>
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDeleteContact(contact)}
                            disabled={deletingContactId === contact.id || isBulkDeleting}
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
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
