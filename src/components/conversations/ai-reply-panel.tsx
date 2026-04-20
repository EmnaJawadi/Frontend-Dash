"use client";

import { useMemo, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";
import type {
  AiReplyDecision,
  ConversationDetails,
  ConversationMessage,
} from "@/src/features/conversations/types/conversations.types";

type AiReplyPanelProps = {
  conversation: ConversationDetails;
  onSent: () => Promise<void> | void;
};

function DecisionPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const classes = {
    neutral: "border-border bg-muted text-muted-foreground",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes[tone]}`}
    >
      {children}
    </span>
  );
}

function findLatestCustomerMessage(
  messages: ConversationMessage[],
): ConversationMessage | null {
  return (
    messages
      .slice()
      .reverse()
      .find(
        (message) =>
          message.senderType === "customer" &&
          message.direction === "inbound" &&
          Boolean(message.content.trim()),
      ) ?? null
  );
}

function splitTemplateParameters(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AiReplyPanel({ conversation, onSent }: AiReplyPanelProps) {
  const latestCustomerMessage = useMemo(
    () => findLatestCustomerMessage(conversation.messages),
    [conversation.messages],
  );

  const [decision, setDecision] = useState<AiReplyDecision | null>(null);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateLanguage, setTemplateLanguage] = useState(
    conversation.contact.language ?? "fr",
  );
  const [templateParameters, setTemplateParameters] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSendText =
    Boolean(decision?.canSendFreeForm) &&
    !decision?.templateRequired &&
    !decision?.handoffRequired &&
    Boolean(draftAnswer.trim());

  const generateReply = async () => {
    if (!latestCustomerMessage) {
      setError("Aucun message client inbound a analyser.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setNotice(null);

      const result = await conversationsService.generateAiReply({
        conversationId: conversation.id,
        messageId: latestCustomerMessage.id,
        message: latestCustomerMessage.content,
        direction: latestCustomerMessage.direction,
        messageType: latestCustomerMessage.type,
        channel: "whatsapp",
      });

      setDecision(result);
      setDraftAnswer(result.answer || result.reply || "");

      if (result.templateRequired) {
        setNotice(
          "Fenetre WhatsApp fermee: un template approuve est requis pour envoyer.",
        );
      } else if (result.handoffRequired) {
        setNotice("L'agent IA recommande un transfert humain.");
      } else if (result.needsClarification) {
        setNotice("L'agent IA propose une question de clarification.");
      }
    } catch (err) {
      console.error("Echec de generation IA:", err);
      setError("Impossible de generer une reponse IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendTextReply = async () => {
    if (!draftAnswer.trim()) return;

    try {
      setIsSending(true);
      setError(null);
      setNotice(null);

      const result = await conversationsService.sendWhatsappReply({
        conversationId: conversation.id,
        message: draftAnswer.trim(),
        automated: false,
        senderType: "agent",
      });

      if (!result.sent && result.templateRequired) {
        setNotice("Envoi bloque: template WhatsApp requis.");
        return;
      }

      await onSent();
      setNotice("Reponse envoyee via WhatsApp.");
    } catch (err) {
      console.error("Echec d'envoi WhatsApp:", err);
      setError("Impossible d'envoyer la reponse WhatsApp.");
    } finally {
      setIsSending(false);
    }
  };

  const sendTemplateReply = async () => {
    if (!templateName.trim()) {
      setError("Le nom du template est requis.");
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      setNotice(null);

      const result = await conversationsService.sendWhatsappReply({
        conversationId: conversation.id,
        templateName: templateName.trim(),
        language: templateLanguage.trim() || "fr",
        parameters: splitTemplateParameters(templateParameters),
        automated: false,
        senderType: "agent",
      });

      if (!result.sent) {
        setNotice(result.reason ?? "Le template n'a pas ete envoye.");
        return;
      }

      await onSent();
      setNotice("Template envoye via WhatsApp.");
    } catch (err) {
      console.error("Echec d'envoi template:", err);
      setError("Impossible d'envoyer le template WhatsApp.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-teal-50 p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-600 p-2 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold">Agent IA</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Genere une reponse fondee sur la base de connaissances, avec
            decision n8n et verification de la fenetre WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={generateReply}
          disabled={isGenerating || !latestCustomerMessage}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generation..." : "Generer avec l'IA"}
        </button>
      </div>

      {latestCustomerMessage ? (
        <div className="mt-4 rounded-xl border bg-background/80 p-3 text-sm">
          <p className="font-medium">Dernier message client analyse</p>
          <p className="mt-1 text-muted-foreground">
            {latestCustomerMessage.content}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-amber-700">
          Aucun message client inbound disponible.
        </p>
      )}

      {decision ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <DecisionPill tone="neutral">
              Intent: {decision.intent || "unknown"}
            </DecisionPill>
            <DecisionPill
              tone={decision.confidence >= 0.7 ? "success" : "warning"}
            >
              Confiance: {Math.round((decision.confidence ?? 0) * 100)}%
            </DecisionPill>
            <DecisionPill
              tone={decision.canSendFreeForm ? "success" : "warning"}
            >
              Free-form: {decision.canSendFreeForm ? "autorise" : "bloque"}
            </DecisionPill>
            <DecisionPill
              tone={decision.templateRequired ? "warning" : "success"}
            >
              Template: {decision.templateRequired ? "requis" : "non requis"}
            </DecisionPill>
            <DecisionPill
              tone={decision.handoffRequired ? "danger" : "success"}
            >
              Handoff: {decision.handoffRequired ? "oui" : "non"}
            </DecisionPill>
            <DecisionPill
              tone={decision.needsClarification ? "warning" : "success"}
            >
              Clarification: {decision.needsClarification ? "oui" : "non"}
            </DecisionPill>
          </div>

          {decision.reason ? (
            <p className="text-sm text-muted-foreground">
              Raison: {decision.reason}
            </p>
          ) : null}

          {decision.sources.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Sources KB: {decision.sources.join(", ")}
            </p>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ai-draft-answer">
              Brouillon IA
            </label>
            <textarea
              id="ai-draft-answer"
              value={draftAnswer}
              onChange={(event) => setDraftAnswer(event.target.value)}
              rows={5}
              className="min-h-32 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
              placeholder="La reponse IA apparaitra ici."
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={sendTextReply}
              disabled={!canSendText || isSending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Envoi..." : "Envoyer la reponse"}
            </button>
          </div>

          {decision.templateRequired ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-800">
                Template WhatsApp requis
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px]">
                <input
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-amber-500"
                  placeholder="Nom du template, ex: follow_up_support"
                />
                <input
                  value={templateLanguage}
                  onChange={(event) => setTemplateLanguage(event.target.value)}
                  className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-amber-500"
                  placeholder="fr"
                />
              </div>
              <input
                value={templateParameters}
                onChange={(event) => setTemplateParameters(event.target.value)}
                className="mt-3 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Parametres separes par virgule: Emna, votre demande SAV"
              />
              <button
                type="button"
                onClick={sendTemplateReply}
                disabled={isSending || !templateName.trim()}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Envoi..." : "Envoyer le template"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {notice ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {notice}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
