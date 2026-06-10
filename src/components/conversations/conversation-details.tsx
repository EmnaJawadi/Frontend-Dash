// src/components/conversations/conversation-details.tsx

import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { HandoffButton } from "./handoff-button";
import { ReactivateBotButton } from "./reactivate-bot-button";
import type { ConversationDetails as ConversationDetailsType } from "@/src/features/conversations/types/conversations.types";

type ConversationDetailsProps = {
  conversation: ConversationDetailsType;
  onHandoff: () => Promise<boolean> | boolean;
  onReactivateBot: () => Promise<boolean> | boolean;
  onCreateArticleFromReply?: () => void;
  canCreateArticleFromReply?: boolean;
  isHandoffLoading?: boolean;
  isReactivatingBot?: boolean;
};

function getStatusLabel(status: ConversationDetailsType["status"]) {
  switch (status) {
    case "bot_active":
      return "Bot actif";
    case "human_assigned":
      return "Prise en charge humaine";
    case "waiting_customer":
      return "En attente du client";
    case "closed":
      return "Clôturée";
    default:
      return status;
  }
}

function getStatusVariant(
  status: ConversationDetailsType["status"]
): "success" | "warning" | "neutral" {
  switch (status) {
    case "bot_active":
      return "success";
    case "human_assigned":
      return "warning";
    case "waiting_customer":
    case "closed":
    default:
      return "neutral";
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

function getPriorityVariant(
  priority: ConversationDetailsType["priority"]
): "success" | "warning" | "danger" {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
    default:
      return "success";
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

type ConversationAiRun = ConversationDetailsType["aiRuns"][number];

const SITUATION_LABELS: Record<string, string> = {
  acknowledgement: "Confirmation du client",
  customer_acknowledgement: "Confirmation du client",
  request_missing_info: "Informations manquantes",
  missing_customer_info: "Informations manquantes",
  missing_customer_details: "Informations manquantes",
  kb_price_answer: "Question sur les prix",
  price_query: "Question sur les prix",
  pricing_query: "Question sur les prix",
  kb_menu_answer: "Question sur le menu",
  menu_query: "Question sur le menu",
  kb_product_answer: "Question sur un produit",
  product_query: "Question sur un produit",
  product_availability_query: "Disponibilité produit",
  availability_query: "Disponibilité produit",
  delivery_coverage_query: "Question sur la livraison",
  delivery_query: "Question sur la livraison",
  order_intent: "Demande de commande",
  order_request: "Demande de commande",
  order_confirmation: "Confirmation de commande",
  booking_request: "Demande de réservation",
  reservation_request: "Demande de réservation",
  greeting: "Message d'accueil",
  smalltalk: "Message général",
  complaint: "Réclamation client",
  escalation: "Intervention humaine recommandée",
  handoff_required: "Intervention humaine recommandée",
};

const TECHNICAL_TEXT_PATTERN =
  /\b(rag|intent|confidence|ai_run|provider|fallback|reason|acknowledgement|request_missing_info|cananswer|needsrag|handoffrequired)\b|kb_[a-z_]+|_/i;

const REASON_EXPLANATIONS: Record<string, string> = {
  no_reliable_knowledge_base_answer:
    "La base de connaissances ne contient pas encore assez d'informations pour répondre automatiquement.",
  ai_no_reliable_answer:
    "Les informations disponibles ne suffisent pas pour préparer une réponse automatique fiable.",
  ai_handoff_required:
    "Une intervention humaine est recommandée pour traiter cette demande.",
  handoff_required:
    "Une intervention humaine est recommandée pour traiter cette demande.",
  backend_error:
    "La réponse automatique n'a pas pu être préparée. Une vérification par l'équipe est nécessaire.",
  empty_reply_text:
    "Aucune réponse automatique claire n'a été préparée pour ce message.",
  empty_response:
    "Aucune réponse automatique claire n'a été préparée pour ce message.",
  duplicate_inbound_message:
    "Ce message semble déjà avoir été traité. Aucune nouvelle réponse automatique n'est nécessaire.",
  request_missing_info:
    "Certaines informations sont encore nécessaires pour finaliser la demande.",
  missing_customer_details:
    "Certaines informations sont encore nécessaires pour finaliser la demande.",
};

function normalizeDecisionKey(value?: string | null) {
  return (value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function getSituationLabel(intent?: string | null) {
  const key = normalizeDecisionKey(intent);

  if (!key || key === "unknown") {
    return "Situation à vérifier";
  }

  if (SITUATION_LABELS[key]) {
    return SITUATION_LABELS[key];
  }

  if (key.includes("acknowledg") || key.includes("confirmation")) {
    return "Confirmation du client";
  }

  if (key.includes("missing") || key.includes("manquante")) {
    return "Informations manquantes";
  }

  if (key.includes("price") || key.includes("prix")) {
    return "Question sur les prix";
  }

  if (key.includes("delivery") || key.includes("livraison")) {
    return "Question sur la livraison";
  }

  if (key.includes("availability") || key.includes("disponibil")) {
    return "Disponibilité produit";
  }

  if (key.includes("order") || key.includes("commande")) {
    return "Demande de commande";
  }

  if (key.includes("booking") || key.includes("reservation")) {
    return "Demande de réservation";
  }

  if (key.includes("complaint") || key.includes("reclamation")) {
    return "Réclamation client";
  }

  return "Situation à vérifier";
}

function getContextIntentLabel(intent?: string | null) {
  return intent ? getSituationLabel(intent) : "A analyser";
}

function formatYesNo(value?: boolean | null) {
  return value ? "oui" : "non";
}

function formatFrenchList(items: string[]) {
  const uniqueItems = Array.from(new Set(items));

  if (uniqueItems.length <= 1) {
    return uniqueItems[0] ?? "";
  }

  return `${uniqueItems.slice(0, -1).join(", ")} et ${
    uniqueItems[uniqueItems.length - 1]
  }`;
}

function getMissingFields(reason: string) {
  const lowerReason = reason.toLowerCase();
  const fields: string[] = [];

  if (/\b(customer\s*)?name\b|\bfull name\b|\bnom\b/.test(lowerReason)) {
    fields.push("nom");
  }

  if (/phone|telephone|téléphone|num[eé]ro/.test(lowerReason)) {
    fields.push("numéro de téléphone");
  }

  if (/address|adresse/.test(lowerReason)) {
    fields.push("adresse");
  }

  if (/delivery date|date de livraison|\bdate\b/.test(lowerReason)) {
    fields.push("date de livraison");
  }

  if (/quantity|quantit[eé]/.test(lowerReason)) {
    fields.push("quantité");
  }

  return Array.from(new Set(fields));
}

function getExplanationFromReason(reason: string, run: ConversationAiRun) {
  const key = normalizeDecisionKey(reason);

  if (REASON_EXPLANATIONS[key]) {
    return REASON_EXPLANATIONS[key];
  }

  const lowerReason = reason.toLowerCase();
  const parts: string[] = [];

  if (/customer acknowledged|acknowledged|client a confirm|confirmed/.test(lowerReason)) {
    parts.push("Le client a confirmé sa demande.");
  }

  if (/still to confirm|to confirm|reste.*confirm|à confirmer/.test(lowerReason)) {
    parts.push("Certains éléments restent à confirmer avant de finaliser la réponse.");
  }

  const missingFields = getMissingFields(reason);

  if (
    missingFields.length > 0 ||
    /missing|still need|required details|required fields|need missing/.test(
      lowerReason,
    )
  ) {
    const fieldsText = formatFrenchList(missingFields);
    parts.push(
      fieldsText
        ? `Certaines informations sont encore nécessaires : ${fieldsText}.`
        : "Certaines informations sont encore nécessaires pour finaliser la demande.",
    );
  }

  if (
    !run.canAnswer &&
    /no reliable|not enough|insufficient|knowledge base|evidence|source|rag|kb_/.test(
      lowerReason,
    )
  ) {
    parts.push(
      "La base de connaissances ne contient pas encore assez d'informations pour répondre automatiquement.",
    );
  }

  if (/handoff|human|agent|escalat|manual|takeover/.test(lowerReason)) {
    parts.push("Une intervention humaine est recommandée pour traiter cette demande.");
  }

  if (/backend|provider|fallback|quota|error|failed|empty/.test(lowerReason)) {
    parts.push(
      "La réponse automatique n'a pas pu être préparée. Une vérification par l'équipe est nécessaire.",
    );
  }

  return Array.from(new Set(parts)).join(" ");
}

function isPlainFrenchExplanation(value: string) {
  if (TECHNICAL_TEXT_PATTERN.test(value)) {
    return false;
  }

  return /\b(le|la|les|des|une|un|client|demande|commande|réponse|information|nécessaire|adresse|téléphone)\b/i.test(
    value,
  );
}

function getDecisionExplanation(run: ConversationAiRun) {
  const reason = run.reason?.trim();

  if (reason) {
    const explanation = getExplanationFromReason(reason, run);

    if (explanation) {
      return explanation;
    }

    if (isPlainFrenchExplanation(reason)) {
      return reason;
    }
  }

  if (run.handoffRequired) {
    return "Une intervention humaine est recommandée pour traiter cette demande.";
  }

  if (run.canAnswer && run.outputText) {
    return "L'IA dispose des informations nécessaires pour proposer une réponse automatique.";
  }

  if (run.needsRag && !run.canAnswer) {
    return "La base de connaissances ne contient pas encore assez d'informations pour répondre automatiquement.";
  }

  if (run.canAnswer) {
    return "Une réponse automatique peut être proposée avec les informations disponibles.";
  }

  return "La situation a été analysée. Une vérification humaine peut être nécessaire.";
}

export function ConversationDetails({
  conversation,
  onHandoff,
  onReactivateBot,
  onCreateArticleFromReply,
  canCreateArticleFromReply = false,
  isHandoffLoading = false,
  isReactivatingBot = false,
}: ConversationDetailsProps) {
  const botIsActive = conversation.activity.botActive;

  return (
    <SectionCard contentClassName="space-y-6">
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
        <p className="mb-3 text-sm font-semibold">Demande client</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Article / service</span>
            <span className="text-right">
              {conversation.context?.requestedProductService ?? "A renseigner"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Date souhaitee</span>
            <span className="text-right">
              {conversation.context?.requestedDeliveryDate ?? "A renseigner"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Type de demande</span>
            <span className="text-right">
              {getContextIntentLabel(conversation.context?.customerIntent)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Prochaine action</span>
            <span className="text-right">
              {conversation.context?.nextAction ?? "A definir"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-4">
        <p className="mb-3 text-sm font-semibold">Statut et priorité</p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge variant={getStatusVariant(conversation.status)}>
            {getStatusLabel(conversation.status)}
          </StatusBadge>

          <StatusBadge variant={getPriorityVariant(conversation.priority)}>
            {getPriorityLabel(conversation.priority)}
          </StatusBadge>

          <StatusBadge variant={botIsActive ? "success" : "warning"}>
            {botIsActive ? "Bot actif" : "Bot en pause"}
          </StatusBadge>
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
            <span>{formatDateTime(conversation.activity.lastBotMessageAt)}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">
              Dernière réponse de l’agent
            </span>
            <span>{formatDateTime(conversation.activity.lastAgentReplyAt)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-4">
        <p className="mb-3 text-sm font-semibold">Tags</p>

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
            <span className="text-sm text-muted-foreground">Aucun tag</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-4">
        <p className="mb-3 text-sm font-semibold">Suivi des réponses IA</p>

        {conversation.aiRuns.length > 0 ? (
          <div className="space-y-3">
            {conversation.aiRuns.slice(0, 5).map((run) => (
              <div key={run.id} className="rounded-xl border bg-muted/20 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">
                    {getSituationLabel(run.intent)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatDateTime(run.createdAt)}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Message client
                    </p>
                    <p className="mt-1 whitespace-pre-line">
                      {run.normalizedMessage?.trim() || "Message client non disponible."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Réponse proposée par l'IA
                    </p>
                    <p className="mt-1 line-clamp-4 whitespace-pre-line text-muted-foreground">
                      {run.outputText?.trim() || "Aucune réponse automatique proposée."}
                    </p>
                  </div>

                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <p>
                      Base de connaissances utilisée :{" "}
                      <span className="font-semibold text-foreground">
                        {formatYesNo(run.usedKb ?? run.needsRag)}
                      </span>
                    </p>
                    <p>
                      Réponse automatique possible :{" "}
                      <span className="font-semibold text-foreground">
                        {formatYesNo(run.canAnswer)}
                      </span>
                    </p>
                  </div>

                  <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                    Explication : {getDecisionExplanation(run)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Aucune analyse IA.</span>
        )}
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
          <button
            type="button"
            onClick={onCreateArticleFromReply}
            disabled={!canCreateArticleFromReply}
            className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Transformer la reponse humaine en article
          </button>

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
    </SectionCard>
  );
}
