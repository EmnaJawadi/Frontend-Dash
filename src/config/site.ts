import { env } from "@/src/config/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description:
    "Dashboard support client WhatsApp avec suivi des conversations, analytics et gestion des agents.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "/og-image.png",
  defaultLocale: "fr",
  supportEmail: "support@example.com",
  links: {
    dashboard: "/dashboard",
    conversations: "/conversations",
    contacts: "/contacts",
    knowledgeBase: "/knowledge-base",
    analytics: "/analytics",
    settings: "/settings",
  },
};

export type SiteConfig = typeof siteConfig;