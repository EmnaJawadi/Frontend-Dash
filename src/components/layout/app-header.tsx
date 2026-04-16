"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/src/components/theme-toggle";
import { getCurrentUser } from "@/src/lib/auth";
import { knowledgeAlertsService, type KnowledgeSuggestionAlert } from "@/src/services/knowledge-alerts.service";
import { headerSearchService, type HeaderSearchResult } from "@/src/services/header-search.service";
import { ROLE_LABELS } from "@/src/types/role";

const pageTitles: Record<string, string> = {
  "/super-admin": "Super Admin",
  "/dashboard": "Tableau de bord",
  "/conversations": "Conversations",
  "/contacts": "Contacts",
  "/knowledge-base": "Base de connaissances",
  "/analytics": "Analytique",
  "/settings": "Parametres",
  "/settings/profile": "Mon profil",
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/super-admin")) {
    return "Super Admin";
  }

  if (pathname.startsWith("/conversations/")) {
    return "Details de la conversation";
  }

  if (pathname.startsWith("/contacts/")) {
    return "Details du contact";
  }

  if (pathname.startsWith("/knowledge-base/")) {
    return "Base de connaissances";
  }

  return pageTitles[pathname] ?? "Tableau de bord";
}

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return `${first}${last}` || "U";
}

function getResultTypeLabel(type: HeaderSearchResult["type"]) {
  switch (type) {
    case "conversation":
      return "Conversation";
    case "contact":
      return "Contact";
    case "knowledge":
      return "Article";
    default:
      return "Resultat";
  }
}

function truncate(value: string, max = 70) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Compte connecte");
  const [avatarInitials, setAvatarInitials] = useState("U");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HeaderSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [alerts, setAlerts] = useState<KnowledgeSuggestionAlert[]>([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const alertsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      const fullName =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();

      setUserName(fullName || "Utilisateur");
      setUserRole(ROLE_LABELS[currentUser.role] || "Compte connecte");
      setAvatarInitials(getInitials(currentUser.firstName, currentUser.lastName));
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      setIsAlertsLoading(true);
      const pending = await knowledgeAlertsService.listPendingKnowledgeSuggestions();
      setAlerts(pending);
    } catch (error) {
      console.error("Failed to load alerts", error);
      setAlerts([]);
    } finally {
      setIsAlertsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();

    const id = window.setInterval(() => {
      void loadAlerts();
    }, 30000);

    return () => window.clearInterval(id);
  }, [loadAlerts]);

  useEffect(() => {
    const q = searchQuery.trim();

    if (q.length < 2) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);

    const timeout = window.setTimeout(async () => {
      try {
        const results = await headerSearchService.search(q);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Failed to search", error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }

      if (alertsRef.current && !alertsRef.current.contains(target)) {
        setIsAlertsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchEnter = useCallback(() => {
    const first = searchResults[0];
    if (!first) return;

    setIsSearchOpen(false);
    router.push(first.href);
  }, [router, searchResults]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:h-[4.5rem] md:px-6">
        <div className="min-w-0 fade-up">
          <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">{title}</h1>
          <p className="hidden text-sm text-muted-foreground md:block">
            Suivi en temps reel des conversations, de l'activite equipe et des actions support.
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 fade-up-delay-1">
          <div ref={searchRef} className="relative hidden lg:block">
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/90 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearchEnter();
                  }

                  if (event.key === "Escape") {
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Recherche dynamique..."
                className="w-48 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {isSearchOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[26rem] rounded-2xl border border-border bg-background p-2 shadow-xl">
                {isSearchLoading ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Recherche...</p>
                ) : searchResults.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Aucun resultat.</p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="block rounded-xl px-3 py-2 transition hover:bg-muted"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {getResultTypeLabel(result.type)}
                        </p>
                        <p className="text-sm font-medium text-foreground">{result.label}</p>
                        <p className="text-xs text-muted-foreground">{truncate(result.description)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <ThemeToggle />

          <div ref={alertsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                const next = !isAlertsOpen;
                setIsAlertsOpen(next);
                if (next) {
                  void loadAlerts();
                }
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted"
              aria-label="Alertes connaissance"
            >
              <Bell className="h-4 w-4" />
              {alerts.length > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                  {alerts.length}
                </span>
              ) : null}
            </button>

            {isAlertsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[25rem] rounded-2xl border border-border bg-background p-2 shadow-xl">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-semibold text-foreground">Alertes apprentissage bot</p>
                  <button
                    type="button"
                    onClick={() => void loadAlerts()}
                    className="text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    Actualiser
                  </button>
                </div>

                {isAlertsLoading ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Chargement...</p>
                ) : alerts.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">
                    Aucune alerte. Quand une conversation passe du bot a l'humain, elle apparait ici.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {alerts.map((alert) => (
                      <Link
                        key={alert.id}
                        href={alert.href}
                        onClick={() => setIsAlertsOpen(false)}
                        className="block rounded-xl px-3 py-2 transition hover:bg-muted"
                      >
                        <p className="text-sm font-medium text-foreground">
                          Ajouter un article pour {alert.contactName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {truncate(alert.lastMessage)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 md:px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground md:h-9 md:w-9">
              {avatarInitials}
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
