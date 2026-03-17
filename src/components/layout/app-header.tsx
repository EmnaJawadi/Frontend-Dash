// src/components/layout/header.tsx

"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/conversations": "Conversations",
  "/contacts": "Contacts",
  "/knowledge-base": "Base de connaissances",
  "/analytics": "Analyses",
  "/settings": "Paramètres",
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/conversations/")) {
    return "Détails de la conversation";
  }

  return pageTitles[pathname] ?? "Tableau de bord";
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Suivez l’activité, gérez la boîte de réception et consultez les conversations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border bg-background px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-muted-foreground transition hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              EJ
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">Majdi Abbes</p>
              <p className="text-xs text-muted-foreground">Agent de support</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}