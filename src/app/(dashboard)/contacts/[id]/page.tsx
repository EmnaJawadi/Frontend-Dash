"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  StickyNote,
  CalendarDays,
  UserRound,
  Globe,
  Clock3,
  CircleAlert,
  Pencil,
  ExternalLink,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContactStatus = "active" | "inactive" | "blocked";
type ContactSource = "whatsapp" | "manual" | "import";
type ContactSegment = "vip" | "lead" | "customer" | "inactive";

type ContactTag = {
  id: string;
  label: string;
};

type ContactActivity = {
  id: string;
  type: "conversation" | "note" | "status";
  content: string;
  createdAt: string;
};

type ContactConversation = {
  id: string;
  subject: string;
  channel: "whatsapp";
  status: "open" | "closed" | "pending";
  updatedAt: string;
};

type ContactNote = {
  id: string;
  content: string;
  createdAt: string;
  author: string;
};

type ContactDetails = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  language?: "fr" | "ar" | "en";
  status: ContactStatus;
  source: ContactSource;
  segment: ContactSegment;
  tags: ContactTag[];
  notesCount: number;
  conversationsCount: number;
  lastConversationAt?: string | null;
  createdAt: string;
  assignedAgent?: string | null;
  activities: ContactActivity[];
  recentConversations: ContactConversation[];
  internalNotes: ContactNote[];
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
    notesCount: 3,
    conversationsCount: 18,
    lastConversationAt: "2026-03-12T14:20:00.000Z",
    createdAt: "2026-01-05T09:00:00.000Z",
    assignedAgent: "Emna",
    activities: [
      {
        id: "act_1",
        type: "conversation",
        content: "Le client a demandé le statut de sa commande.",
        createdAt: "2026-03-12T14:20:00.000Z",
      },
      {
        id: "act_2",
        type: "note",
        content: "Client VIP, prioriser les réponses en moins de 10 minutes.",
        createdAt: "2026-03-10T11:00:00.000Z",
      },
      {
        id: "act_3",
        type: "status",
        content: "Le contact est repassé en actif après validation du dossier.",
        createdAt: "2026-03-08T09:30:00.000Z",
      },
    ],
    recentConversations: [
      {
        id: "conv_101",
        subject: "Suivi commande #4587",
        channel: "whatsapp",
        status: "open",
        updatedAt: "2026-03-12T14:20:00.000Z",
      },
      {
        id: "conv_102",
        subject: "Réclamation délai livraison",
        channel: "whatsapp",
        status: "closed",
        updatedAt: "2026-03-09T16:10:00.000Z",
      },
      {
        id: "conv_103",
        subject: "Demande disponibilité produit",
        channel: "whatsapp",
        status: "pending",
        updatedAt: "2026-03-05T12:45:00.000Z",
      },
    ],
    internalNotes: [
      {
        id: "note_1",
        content: "Toujours vérifier l’adresse de livraison avant confirmation.",
        createdAt: "2026-03-10T11:00:00.000Z",
        author: "Emna",
      },
      {
        id: "note_2",
        content: "Préférence de contact en français.",
        createdAt: "2026-02-28T09:15:00.000Z",
        author: "Support Team",
      },
      {
        id: "note_3",
        content: "Historique d’achats élevé sur les 3 derniers mois.",
        createdAt: "2026-02-20T15:35:00.000Z",
        author: "Sales Ops",
      },
    ],
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
    notesCount: 1,
    conversationsCount: 7,
    lastConversationAt: "2026-03-11T10:15:00.000Z",
    createdAt: "2026-01-18T08:40:00.000Z",
    assignedAgent: "Mariem",
    activities: [
      {
        id: "act_4",
        type: "conversation",
        content: "Le client a signalé un produit endommagé.",
        createdAt: "2026-03-11T10:15:00.000Z",
      },
    ],
    recentConversations: [
      {
        id: "conv_201",
        subject: "Produit endommagé",
        channel: "whatsapp",
        status: "open",
        updatedAt: "2026-03-11T10:15:00.000Z",
      },
    ],
    internalNotes: [
      {
        id: "note_4",
        content: "Envoyer une proposition d’échange si la photo est valide.",
        createdAt: "2026-03-11T11:00:00.000Z",
        author: "SAV Team",
      },
    ],
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
    notesCount: 0,
    conversationsCount: 2,
    lastConversationAt: "2026-02-27T16:30:00.000Z",
    createdAt: "2026-02-02T11:00:00.000Z",
    assignedAgent: null,
    activities: [],
    recentConversations: [],
    internalNotes: [],
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
    notesCount: 4,
    conversationsCount: 11,
    lastConversationAt: "2026-03-01T12:00:00.000Z",
    createdAt: "2025-12-21T07:45:00.000Z",
    assignedAgent: "Support Team",
    activities: [
      {
        id: "act_5",
        type: "status",
        content: "Le contact a été bloqué suite à des abus répétés.",
        createdAt: "2026-03-01T12:00:00.000Z",
      },
    ],
    recentConversations: [
      {
        id: "conv_401",
        subject: "Historique avant blocage",
        channel: "whatsapp",
        status: "closed",
        updatedAt: "2026-03-01T12:00:00.000Z",
      },
    ],
    internalNotes: [
      {
        id: "note_5",
        content: "Ne plus engager sans validation d’un manager.",
        createdAt: "2026-03-01T12:30:00.000Z",
        author: "Admin",
      },
    ],
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
    notesCount: 2,
    conversationsCount: 23,
    lastConversationAt: "2026-03-13T08:10:00.000Z",
    createdAt: "2026-01-10T10:10:00.000Z",
    assignedAgent: "Emna",
    activities: [
      {
        id: "act_6",
        type: "conversation",
        content: "Le client a demandé une recommandation produit complémentaire.",
        createdAt: "2026-03-13T08:10:00.000Z",
      },
    ],
    recentConversations: [
      {
        id: "conv_501",
        subject: "Suggestion produit complémentaire",
        channel: "whatsapp",
        status: "open",
        updatedAt: "2026-03-13T08:10:00.000Z",
      },
    ],
    internalNotes: [
      {
        id: "note_6",
        content: "Proposer systématiquement bundle premium.",
        createdAt: "2026-03-12T13:00:00.000Z",
        author: "Sales Team",
      },
    ],
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
    notesCount: 1,
    conversationsCount: 5,
    lastConversationAt: "2026-03-10T17:45:00.000Z",
    createdAt: "2026-02-14T12:20:00.000Z",
    assignedAgent: null,
    activities: [
      {
        id: "act_7",
        type: "conversation",
        content: "Lead entrant depuis campagne WhatsApp Ads.",
        createdAt: "2026-03-10T17:45:00.000Z",
      },
    ],
    recentConversations: [
      {
        id: "conv_601",
        subject: "Qualification lead",
        channel: "whatsapp",
        status: "pending",
        updatedAt: "2026-03-10T17:45:00.000Z",
      },
    ],
    internalNotes: [
      {
        id: "note_7",
        content: "Relancer sous 48h si pas de réponse.",
        createdAt: "2026-03-10T18:00:00.000Z",
        author: "Marketing Ops",
      },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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

function languageLabel(language?: "fr" | "ar" | "en") {
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

function phoneToWhatsapp(phone: string) {
  return phone.replace(/\D/g, "");
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const classes =
    status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "inactive"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <Badge variant="outline" className={`rounded-full ${classes}`}>
      {statusLabel(status)}
    </Badge>
  );
}

function ConversationStatusBadge({
  status,
}: {
  status: "open" | "closed" | "pending";
}) {
  const classes =
    status === "open"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "closed"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  const label =
    status === "open"
      ? "Ouverte"
      : status === "closed"
      ? "Clôturée"
      : "En attente";

  return (
    <Badge variant="outline" className={`rounded-full ${classes}`}>
      {label}
    </Badge>
  );
}

function StatMiniCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{title}</span>
        </div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function EmptyBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ContactDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const contact = React.useMemo(
    () => contactsDetailsMock.find((item) => item.id === id),
    [id]
  );

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
          <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Contact introuvable</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Aucun contact ne correspond à cet identifiant. Vérifie le lien ou retourne à la liste des contacts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux contacts
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <a href={`tel:${contact.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Appeler
            </a>
          </Button>

          <Button asChild variant="outline" className="rounded-xl">
            <a
              href={`https://wa.me/${phoneToWhatsapp(contact.phone)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/contacts/${contact.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-16 w-16 border border-border/60">
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(contact.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold tracking-tight">
                    {contact.fullName}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge status={contact.status} />
                    <Badge variant="secondary" className="rounded-full">
                      {segmentLabel(contact.segment)}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {sourceLabel(contact.source)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span>{contact.email ?? "—"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  <span>{contact.city ?? "—"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4" />
                  <span>{languageLabel(contact.language)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <UserRound className="h-4 w-4" />
                  <span>{contact.assignedAgent ?? "Non assigné"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4" />
                  <span>Créé le {formatDate(contact.createdAt)}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.length ? (
                    contact.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {tag.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Aucun tag</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatMiniCard
              icon={<MessageSquare className="h-4 w-4" />}
              title="Conversations"
              value={contact.conversationsCount}
              subtitle="Interactions enregistrées"
            />

            <StatMiniCard
              icon={<StickyNote className="h-4 w-4" />}
              title="Notes internes"
              value={contact.notesCount}
              subtitle="Contexte disponible"
            />

            <StatMiniCard
              icon={<Clock3 className="h-4 w-4" />}
              title="Dernière activité"
              value={formatDate(contact.lastConversationAt)}
              subtitle="Dernière mise à jour connue"
            />
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.activities.length === 0 ? (
                <EmptyBlock
                  title="Aucune activité récente"
                  description="Ce contact n’a pas encore d’activité enregistrée."
                />
              ) : (
                <div className="space-y-4">
                  {contact.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <Badge variant="outline" className="rounded-full">
                          {activity.type === "conversation"
                            ? "Conversation"
                            : activity.type === "note"
                            ? "Note"
                            : "Statut"}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/90">{activity.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Conversations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.recentConversations.length === 0 ? (
                <EmptyBlock
                  title="Aucune conversation"
                  description="Aucune conversation récente n’est liée à ce contact."
                />
              ) : (
                <div className="space-y-4">
                  {contact.recentConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-medium">{conversation.subject}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Canal: WhatsApp
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <ConversationStatusBadge status={conversation.status} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Notes internes</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.internalNotes.length === 0 ? (
                <EmptyBlock
                  title="Aucune note interne"
                  description="Tu peux ajouter des notes plus tard pour ce contact."
                />
              ) : (
                <div className="space-y-4">
                  {contact.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                    >
                      <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm font-medium">{note.author}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}