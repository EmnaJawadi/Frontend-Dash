export type ContactStatus = "active" | "inactive" | "blocked";
export type ContactSource = "whatsapp" | "manual" | "import";
export type ContactSegment = "vip" | "lead" | "customer" | "inactive";
export type ContactLanguage = "fr" | "ar" | "en";

export type ContactTag = {
  id: string;
  label: string;
};

export type ContactActivity = {
  id: string;
  type: "conversation" | "note" | "status";
  content: string;
  createdAt: string;
};

export type ContactConversation = {
  id: string;
  subject: string;
  channel: "whatsapp";
  status: "open" | "closed" | "pending";
  updatedAt: string;
};

export type ContactNote = {
  id: string;
  content: string;
  createdAt: string;
  author: string;
};

export type Contact = {
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
  notesCount: number;
  conversationsCount: number;
  lastConversationAt?: string | null;
  createdAt: string;
};

export type ContactDetails = Contact & {
  assignedAgent?: string | null;
  activities: ContactActivity[];
  recentConversations: ContactConversation[];
  internalNotes: ContactNote[];
};

export const contactsMock: Contact[] = [
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

export const contactsDetailsMock: ContactDetails[] = [
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