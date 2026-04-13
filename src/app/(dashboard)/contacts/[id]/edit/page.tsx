"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
};

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [isBlocked, setIsBlocked] = React.useState(false);

  const loadContact = React.useCallback(async () => {
    if (!id) {
      setError("Contact introuvable.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contact = (await contactsService.getById(id)) as ContactDetails;
      const names = (contact.fullName ?? "").trim().split(/\s+/);

      setFirstName(contact.firstName ?? names[0] ?? "");
      setLastName(contact.lastName ?? names.slice(1).join(" "));
      setPhoneNumber(contact.phoneNumber ?? "");
      setEmail(contact.email ?? "");
      setNotes(contact.notes ?? "");
      setTags((contact.tags ?? []).join(", "));
      setIsBlocked(Boolean(contact.isBlocked));
    } catch (err) {
      console.error("Failed to load contact for edit", err);
      setError("Impossible de charger ce contact.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void loadContact();
  }, [loadContact]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstName.trim() || !phoneNumber.trim()) {
      setError("Prenom et telephone sont obligatoires.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await contactsService.update(id, {
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null,
        tags: tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isBlocked,
      });

      router.push(`/contacts/${id}`);
    } catch (err) {
      console.error("Failed to save contact", err);
      setError("Impossible d'enregistrer les modifications.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement du formulaire...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button asChild variant="outline">
        <Link href={`/contacts/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Modifier contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Prenom *</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telephone *</Label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (separes par virgule)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Notes internes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={isBlocked} onCheckedChange={setIsBlocked} />
              <span className="text-sm">Contact bloque</span>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
