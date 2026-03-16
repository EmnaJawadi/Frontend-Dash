// src/features/conversations/hooks/use-conversation-details.ts

"use client";

import { useCallback, useEffect, useState } from "react";
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
      console.error("Failed to load conversation details:", err);
      setError("Failed to load conversation details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
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
      console.error("Failed to handoff conversation:", err);
      setError("Failed to handoff conversation. Please try again.");
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
      console.error("Failed to reactivate bot:", err);
      setError("Failed to reactivate bot. Please try again.");
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