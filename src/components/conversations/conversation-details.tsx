// src/components/conversations/conversation-details.tsx

import { cn } from "@/lib/utils";
import { HandoffButton } from "./handoff-button";
import { ReactivateBotButton } from "./reactivate-bot-button";
import type { ConversationDetails as ConversationDetailsType } from "@/src/features/conversations/types/conversations.types";

type ConversationDetailsProps = {
  conversation: ConversationDetailsType;
  onHandoff: () => Promise<boolean> | boolean;
  onReactivateBot: () => Promise<boolean> | boolean;
  isHandoffLoading?: boolean;
  isReactivatingBot?: boolean;
};

function getStatusLabel(status: ConversationDetailsType["status"]) {
  switch (status) {
    case "bot_active":
      return "Bot actif";
    case "human_assigned":
      return "Agent assigné";
    case "waiting_customer":
      return "En attente du client";
    case "closed":
      return "Fermée";
    default:
      return status;
  }
}

function getStatusClass(status: ConversationDetailsType["status"]) {
  switch (status) {
    case "bot_active":
      return "status-success";
    case "human_assigned":
      return "status-warning";
    case "waiting_customer":
    case "closed":
    default:
      return "status-neutral";
  }
}

function getPriorityClass(priority: ConversationDetailsType["priority"]) {
  switch (priority) {
    case "high":
      return "status-danger";
    case "medium":
      return "status-warning";
    case "low":
      return "status-success";
    default:
      return "status-neutral";
  }
}

function getPriorityLabel(priority: ConversationDetailsType["priority"]) {
  switch (priority) {
    case "high":
      return "Haute";
    case "medium":
      return "Moyenne";
    case "low":
      return "Basse";
    default:
      return priority;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ConversationDetails({
  conversation,
  onHandoff,
  onReactivateBot,
  isHandoffLoading = false,
  isReactivatingBot = false,
}: ConversationDetailsProps) {
  const botIsActive = conversation.activity.botActive;

  return (
    <div className="section-card">
      <div className="section-card-content space-y-6">
        <div>
          <h3 className="text-base font-semibold md:text-lg">
            Détails de la conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Profil du contact, statut et actions de support.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-base font-semibold">
                {conversation.contact.name}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {conversation.contact.phone}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {getInitials(conversation.contact.name)}
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Email</span>
              <span className="text-right">
                {conversation.contact.email ?? "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Langue</span>
              <span>{conversation.contact.language ?? "—"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Localisation</span>
              <span>{conversation.contact.location ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-3 text-sm font-semibold">Statut et priorité</p>

          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                getStatusClass(conversation.status)
              )}
            >
              {getStatusLabel(conversation.status)}
            </span>

            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                getPriorityClass(conversation.priority)
              )}
            >
              {getPriorityLabel(conversation.priority)}
            </span>

            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                botIsActive ? "status-success" : "status-warning"
              )}
            >
              {botIsActive ? "Bot actif" : "Bot en pause"}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Agent assigné</span>
              <span>{conversation.activity.assignedAgent ?? "—"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Créée le</span>
              <span>{formatDateTime(conversation.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Mise à jour le</span>
              <span>{formatDateTime(conversation.updatedAt)}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Dernier message du bot</span>
              <span>
                {formatDateTime(conversation.activity.lastBotMessageAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">
                Dernière réponse de l'agent
              </span>
              <span>
                {formatDateTime(conversation.activity.lastAgentReplyAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-3 text-sm font-semibold">Étiquettes</p>

          <div className="flex flex-wrap gap-2">
            {conversation.tags.length > 0 ? (
              conversation.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex rounded-full border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tag.label}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Aucune étiquette
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-3 text-sm font-semibold">Notes internes</p>
          <p className="text-sm text-muted-foreground">
            {conversation.notes?.trim() || "Aucune note disponible."}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-4 text-sm font-semibold">Actions</p>

          <div className="flex flex-col gap-3">
            <HandoffButton
              onHandoff={onHandoff}
              isLoading={isHandoffLoading}
              disabled={!botIsActive}
            />

            <ReactivateBotButton
              onReactivate={onReactivateBot}
              isLoading={isReactivatingBot}
              disabled={botIsActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}