"use client";

import { useCallback, useEffect, useState } from "react";
import { isApiError } from "@/src/lib/api-error";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";
import type { ConversationDetails } from "@/src/features/conversations/types/conversations.types";

export function useConversationDetails(conversationId: string) {
  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHandoffLoading, setIsHandoffLoading] = useState(false);
  const [isReactivatingBot, setIsReactivatingBot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await conversationsService.getConversationById(conversationId);
      setConversation(data);
    } catch (err) {
      if (isApiError(err)) {
        setError(
          err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible de charger les details de la conversation.",
        );
      } else {
        console.error("Echec du chargement des details de la conversation:", err);
        setError("Impossible de charger les details de la conversation. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void fetchConversation();
  }, [fetchConversation]);

  const handoffToAgent = async () => {
    if (!conversationId) return false;

    try {
      setIsHandoffLoading(true);
      setError(null);

      await conversationsService.handoffConversation(conversationId);
      await fetchConversation();

      return true;
    } catch (err) {
      if (isApiError(err)) {
        setError(
          err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible de transferer la conversation.",
        );
      } else {
        console.error("Echec du transfert de la conversation:", err);
        setError("Impossible de transferer la conversation. Veuillez reessayer.");
      }
      return false;
    } finally {
      setIsHandoffLoading(false);
    }
  };

  const reactivateBot = async () => {
    if (!conversationId) return false;

    try {
      setIsReactivatingBot(true);
      setError(null);

      await conversationsService.reactivateBot(conversationId);
      await fetchConversation();

      return true;
    } catch (err) {
      if (isApiError(err)) {
        setError(
          err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible de reactiver le bot.",
        );
      } else {
        console.error("Echec de la reactivation du bot:", err);
        setError("Impossible de reactiver le bot. Veuillez reessayer.");
      }
      return false;
    } finally {
      setIsReactivatingBot(false);
    }
  };

  return {
    conversation,
    isLoading,
    isHandoffLoading,
    isReactivatingBot,
    error,
    refetch: fetchConversation,
    handoffToAgent,
    reactivateBot,
  };
}
