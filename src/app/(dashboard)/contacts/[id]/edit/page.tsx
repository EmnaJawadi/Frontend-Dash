"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Tags,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContactStatus = "active" | "inactive" | "blocked";
type ContactSource = "whatsapp" | "manual" | "import";
type ContactSegment = "vip" | "lead" | "customer" | "inactive";
type ContactLanguage = "fr" | "ar" | "en";

type ContactTag = {
  id: string;
  label: string;
};

type ContactDetails = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  language?: ContactLanguage;
  status: ContactStatus;
  source: ContactSource;
  segment: ContactSegment;
  tags: ContactTag[];
  createdAt: string;
  assignedAgent?: string | null;
};

const contactsDetailsMock: ContactDetails[] = [
  {
    id: "contact_001",
    fullName: "Ahmed Ben Ali",
    phone: "+216 20 111 222",
    email: "ahmed.benali@gmail.com",
    city: "Tunis",
    language: "fr",
    status: "active",
    source: "whatsapp",
    segment: "vip",
    tags: [
      { id: "tag_1", label: "VIP" },
      { id: "tag_2", label: "Livraison" },
    ],
    createdAt: "2026-01-05T09:00:00.000Z",
    assignedAgent: "Emna",
  },
  {
    id: "contact_002",
    fullName: "Sarra Kefi",
    phone: "+216 25 555 666",
    email: "sarra.kefi@gmail.com",
    city: "Sfax",
    language: "ar",
    status: "active",
    source: "manual",
    segment: "customer",
    tags: [
      { id: "tag_3", label: "Réclamation" },
      { id: "tag_4", label: "SAV" },
    ],
    createdAt: "2026-01-18T08:40:00.000Z",
    assignedAgent: "Mariem",
  },
  {
    id: "contact_003",
    fullName: "Youssef Trabelsi",
    phone: "+216 94 444 000",
    email: null,
    city: "Sousse",
    language: "en",
    status: "inactive",
    source: "import",
    segment: "lead",
    tags: [{ id: "tag_5", label: "Prospect" }],
    createdAt: "2026-02-02T11:00:00.000Z",
    assignedAgent: null,
  },
  {
    id: "contact_004",
    fullName: "Mariem Jaziri",
    phone: "+216 50 123 456",
    email: "mariem.jaziri@gmail.com",
    city: "Nabeul",
    language: "fr",
    status: "blocked",
    source: "whatsapp",
    segment: "inactive",
    tags: [{ id: "tag_6", label: "Blacklist" }],
    createdAt: "2025-12-21T07:45:00.000Z",
    assignedAgent: "Support Team",
  },
  {
    id: "contact_005",
    fullName: "Amira Chaari",
    phone: "+216 29 000 888",
    email: "amira.chaari@gmail.com",
    city: "Monastir",
    language: "fr",
    status: "active",
    source: "whatsapp",
    segment: "customer",
    tags: [
      { id: "tag_7", label: "Fidèle" },
      { id: "tag_8", label: "Upsell" },
    ],
    createdAt: "2026-01-10T10:10:00.000Z",
    assignedAgent: "Emna",
  },
  {
    id: "contact_006",
    fullName: "Nour Haddad",
    phone: "+216 98 333 111",
    email: "nour.haddad@gmail.com",
    city: "Ariana",
    language: "fr",
    status: "active",
    source: "whatsapp",
    segment: "lead",
    tags: [
      { id: "tag_9", label: "Nouveau" },
      { id: "tag_10", label: "Campagne" },
    ],
    createdAt: "2026-02-14T12:20:00.000Z",
    assignedAgent: null,
  },
];

function statusLabel(status: ContactStatus) {
  switch (status) {
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "blocked":
      return "Bloqué";
    default:
      return status;
  }
}

function segmentLabel(segment: ContactSegment) {
  switch (segment) {
    case "vip":
      return "VIP";
    case "lead":
      return "Lead";
    case "customer":
      return "Client";
    case "inactive":
      return "Inactif";
    default:
      return segment;
  }
}

function sourceLabel(source: ContactSource) {
  switch (source) {
    case "whatsapp":
      return "WhatsApp";
    case "manual":
      return "Manuel";
    case "import":
      return "Import";
    default:
      return source;
  }
}

function languageLabel(language?: ContactLanguage) {
  switch (language) {
    case "fr":
      return "Français";
    case "ar":
      return "Arabe";
    case "en":
      return "Anglais";
    default:
      return "—";
  }
}

export default function EditContactPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const contact = React.useMemo(
    () => contactsDetailsMock.find((item) => item.id === id),
    [id]
  );

  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [city, setCity] = React.useState("");
  const [language, setLanguage] = React.useState<ContactLanguage>("fr");
  const [status, setStatus] = React.useState<ContactStatus>("active");
  const [source, setSource] = React.useState<ContactSource>("whatsapp");
  const [segment, setSegment] = React.useState<ContactSegment>("customer");
  const [assignedAgent, setAssignedAgent] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");

  React.useEffect(() => {
    if (!contact) return;

    setFullName(contact.fullName);
    setPhoneNumber(contact.phone);
    setEmail(contact.email ?? "");
    setCity(contact.city ?? "");
    setLanguage(contact.language ?? "fr");
    setStatus(contact.status);
    setSource(contact.source);
    setSegment(contact.segment);
    setAssignedAgent(contact.assignedAgent ?? "");
    setTagsInput(contact.tags.map((tag) => tag.label).join(", "));
  }, [contact]);

  if (!contact) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux contacts
          </Link>
        </Button>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold">Contact introuvable</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Impossible de modifier ce contact car il n’existe pas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tagsPreview = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href={`/contacts/${contact.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au contact
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/contacts/${contact.id}`}>Annuler</Link>
          </Button>

          <Button asChild className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
            <Link href={`/contacts/${contact.id}`}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Modifier le contact</h1>
        <p className="text-sm text-muted-foreground">
          Mettez à jour les informations de ce contact WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Informations du contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="Nom complet"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="+216 ..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="email@exemple.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ville</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="Ville"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue</label>
                  <Select
                    value={language}
                    onValueChange={(value) => setLanguage(value as ContactLanguage)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">Arabe</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as ContactStatus)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="blocked">Bloqué</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Source</label>
                  <Select
                    value={source}
                    onValueChange={(value) => setSource(value as ContactSource)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="manual">Manuel</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Segment</label>
                  <Select
                    value={segment}
                    onValueChange={(value) => setSegment(value as ContactSegment)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="customer">Client</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent assigné</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={assignedAgent}
                      onChange={(e) => setAssignedAgent(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="Nom de l’agent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="relative">
                    <Tags className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="VIP, Livraison, Fidèle..."
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Séparez les tags par des virgules.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-semibold">{fullName || "Nom du contact"}</p>
                <p className="text-sm text-muted-foreground">
                  {phoneNumber || "Téléphone"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full">
                  {statusLabel(status)}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  {segmentLabel(segment)}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {sourceLabel(source)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{email || "Aucun email"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{city || "Aucune ville"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{languageLabel(language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  <span>{assignedAgent || "Non assigné"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Tags détectés</CardTitle>
            </CardHeader>
            <CardContent>
              {tagsPreview.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagsPreview.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun tag saisi pour le moment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}