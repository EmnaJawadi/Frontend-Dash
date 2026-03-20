"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ConversationDetails } from "@/src/components/conversations/conversation-details";
import { ConversationMessages } from "@/src/components/conversations/conversation-messages";
import { LoadingSpinner } from "@/src/components/shared/loading-spinner";
import { SectionCard } from "@/src/components/shared/section-card";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";
import type { ConversationDetails as ConversationDetailsType } from "@/src/features/conversations/types/conversations.types";

export default function ConversationDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [conversation, setConversation] =
    useState<ConversationDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversation = useCallback(async () => {
    if (!id) {
      setConversation(null);
      setError("Conversation introuvable.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await conversationsService.getConversationById(id);

      if (!data) {
        setConversation(null);
        setError("Conversation introuvable.");
        return;
      }

      setConversation(data);
    } catch {
      setConversation(null);
      setError("Impossible de charger les détails de la conversation.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  const handleHandoff = useCallback(async (): Promise<boolean> => {
    if (!conversation) return false;

    try {
      setIsActing(true);
      setError(null);
      await conversationsService.handoffConversation(conversation.id);
      await loadConversation();
      return true;
    } catch {
      setError("Impossible de transférer la conversation.");
      return false;
    } finally {
      setIsActing(false);
    }
  }, [conversation, loadConversation]);

  const handleReactivateBot = useCallback(async (): Promise<boolean> => {
    if (!conversation) return false;

    try {
      setIsActing(true);
      setError(null);
      await conversationsService.reactivateBot(conversation.id);
      await loadConversation();
      return true;
    } catch {
      setError("Impossible de réactiver le bot.");
      return false;
    } finally {
      setIsActing(false);
    }
  }, [conversation, loadConversation]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Conversation</h1>
          <p className="text-sm text-muted-foreground">
            Chargement des détails de la conversation...
          </p>
        </div>

        <SectionCard contentClassName="py-14">
          <LoadingSpinner
            size="lg"
            label="Chargement des détails de la conversation..."
          />
        </SectionCard>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="space-y-6">
        <Link
          href="/conversations"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux conversations
        </Link>

        <SectionCard contentClassName="flex flex-col items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">Conversation introuvable</h2>
            <p className="text-sm text-muted-foreground">
              {error || "Impossible d'afficher cette conversation."}
            </p>
          </div>

          <button
            type="button"
            onClick={loadConversation}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Réessayer
          </button>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/conversations"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux conversations
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Détails de la conversation
          </h1>
          <p className="text-sm text-muted-foreground">ID : {conversation.id}</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <SectionCard>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Messages</h2>
              <p className="text-sm text-muted-foreground">
                Historique complet de la conversation.
              </p>
            </div>

            <ConversationMessages messages={conversation.messages} />
          </div>
        </SectionCard>

        <SectionCard>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Détails</h2>
              <p className="text-sm text-muted-foreground">
                Informations générales et statut actuel.
              </p>
            </div>

            <ConversationDetails
              conversation={conversation}
              onHandoff={handleHandoff}
              onReactivateBot={handleReactivateBot}
            />

            {isActing ? (
              <p className="text-sm text-muted-foreground">
                Mise à jour de la conversation...
              </p>
            ) : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}