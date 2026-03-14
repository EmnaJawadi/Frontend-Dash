"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  X,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Mail,
  MapPin,
  MessageSquare,
  StickyNote,
  Phone,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type ContactTag = {
  id: string;
  label: string;
};

type Contact = {
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
};

const contactsMock: Contact[] = [
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
    dateStyle: "short",
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
      return "Customer";
    case "inactive":
      return "Inactive";
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

function StatusBadge({ status }: { status: ContactStatus }) {
  const classes =
    status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "inactive"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <Badge variant="outline" className={classes}>
      {statusLabel(status)}
    </Badge>
  );
}

function TagList({ tags }: { tags: ContactTag[] }) {
  if (!tags.length) {
    return <span className="text-xs text-muted-foreground">Aucun tag</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="rounded-full border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher par nom, téléphone, email, ville ou tag..."
        className="h-11 rounded-xl pl-10 pr-10"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="rounded-xl bg-muted p-2 text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

function ContactMobileCard({ contact }: { contact: Contact }) {
  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback>{getInitials(contact.fullName)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">{contact.fullName}</h3>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
          </div>

          <StatusBadge status={contact.status} />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full">
            {segmentLabel(contact.segment)}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {sourceLabel(contact.source)}
          </Badge>
        </div>

        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          {contact.email ? (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{contact.email}</span>
            </div>
          ) : null}

          {contact.city ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{contact.city}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{contact.conversationsCount} conversation(s)</span>
          </div>

          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            <span>{contact.notesCount} note(s)</span>
          </div>
        </div>

        <div className="mb-4">
          <TagList tags={contact.tags} />
        </div>

        <div className="mb-4 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
          Dernière conversation: {formatDate(contact.lastConversationAt)}
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1 rounded-xl">
            <Link href={`/contacts/${contact.id}`}>Voir détail</Link>
          </Button>

          <Button variant="outline" size="icon" className="rounded-xl">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContactsPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ContactStatus | "all">("all");
  const [segment, setSegment] = React.useState<ContactSegment | "all">("all");
  const [source, setSource] = React.useState<ContactSource | "all">("all");
  const [tag, setTag] = React.useState<string | "all">("all");

  const filteredContacts = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return contactsMock
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.fullName.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          (item.email?.toLowerCase().includes(query) ?? false) ||
          (item.city?.toLowerCase().includes(query) ?? false) ||
          item.tags.some((t) => t.label.toLowerCase().includes(query));

        const matchesStatus = status === "all" || item.status === status;
        const matchesSegment = segment === "all" || item.segment === segment;
        const matchesSource = source === "all" || item.source === source;
        const matchesTag =
          tag === "all" || item.tags.some((t) => t.label === tag);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesSegment &&
          matchesSource &&
          matchesTag
        );
      })
      .sort((a, b) => {
        const aDate = a.lastConversationAt
          ? new Date(a.lastConversationAt).getTime()
          : 0;
        const bDate = b.lastConversationAt
          ? new Date(b.lastConversationAt).getTime()
          : 0;

        return bDate - aDate;
      });
  }, [search, status, segment, source, tag]);

  const stats = React.useMemo(() => {
    return {
      total: filteredContacts.length,
      active: filteredContacts.filter((item) => item.status === "active")
        .length,
      inactive: filteredContacts.filter((item) => item.status === "inactive")
        .length,
      blocked: filteredContacts.filter((item) => item.status === "blocked")
        .length,
    };
  }, [filteredContacts]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos contacts, segmentez-les et retrouvez rapidement leur
            activité.
          </p>
        </div>

        <Button className="rounded-xl">+ Nouveau contact</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total contacts"
          value={stats.total}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Actifs"
          value={stats.active}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Inactifs"
          value={stats.inactive}
          icon={<UserX className="h-4 w-4" />}
        />
        <StatCard
          title="Bloqués"
          value={stats.blocked}
          icon={<ShieldAlert className="h-4 w-4" />}
        />
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <SearchInput value={search} onChange={setSearch} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as ContactStatus | "all")
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="blocked">Bloqué</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={segment}
                onValueChange={(value) =>
                  setSegment(value as ContactSegment | "all")
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous segments</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={source}
                onValueChange={(value) =>
                  setSource(value as ContactSource | "all")
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes sources</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="manual">Manuel</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="h-11 w-full rounded-xl xl:w-[160px]">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous tags</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Livraison">Livraison</SelectItem>
                  <SelectItem value="Réclamation">Réclamation</SelectItem>
                  <SelectItem value="SAV">SAV</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Blacklist">Blacklist</SelectItem>
                  <SelectItem value="Fidèle">Fidèle</SelectItem>
                  <SelectItem value="Upsell">Upsell</SelectItem>
                  <SelectItem value="Nouveau">Nouveau</SelectItem>
                  <SelectItem value="Campagne">Campagne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {filteredContacts.length} contact(s) trouvé(s)
      </div>

      {filteredContacts.length === 0 ? (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Aucun contact trouvé</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Essaie de modifier les filtres ou la recherche pour afficher plus
              de résultats.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border bg-background shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Coordonnées</th>
                  <th className="px-4 py-3 font-medium">Segment</th>
                  <th className="px-4 py-3 font-medium">Tags</th>
                  <th className="px-4 py-3 font-medium">Activité</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>

              <tbody>
                {filteredContacts.map((item) => (
                  <tr key={item.id} className="border-t align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(item.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">{item.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {item.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{item.email}</span>
                          </div>
                        ) : (
                          <span>—</span>
                        )}
                        <div>{item.city ?? "—"}</div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="w-fit rounded-full">
                          {segmentLabel(item.segment)}
                        </Badge>
                        <Badge variant="outline" className="w-fit rounded-full">
                          {sourceLabel(item.source)}
                        </Badge>
                      </div>
                    </td>

                    <td className="max-w-[220px] px-4 py-4">
                      <TagList tags={item.tags} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{item.conversationsCount} conversation(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StickyNote className="h-4 w-4" />
                          <span>{item.notesCount} note(s)</span>
                        </div>
                        <div>
                          Dernière activité: {formatDate(item.lastConversationAt)}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-4">
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/contacts/${item.id}`}>Voir détail</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredContacts.map((contact) => (
              <ContactMobileCard key={contact.id} contact={contact} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}