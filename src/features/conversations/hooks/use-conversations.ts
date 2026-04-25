"use client";

import { useCallback, useEffect, useState } from "react";
import { isApiError } from "@/src/lib/api-error";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";
import type {
  ConversationFilters,
  ConversationListItem,
} from "@/src/features/conversations/types/conversations.types";

const defaultFilters: ConversationFilters = {
  search: "",
  status: "all",
  priority: "all",
  assignedTo: "all",
  botState: "all",
};

export function useConversations(initialPageSize = 10) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [filters, setFilters] = useState<ConversationFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await conversationsService.getConversations(filters, page, pageSize);

      setConversations(response.data);
      setTotal(response.total);
    } catch (err) {
      if (isApiError(err)) {
        setError(
          err.status === 401
            ? "Session expiree. Veuillez vous reconnecter."
            : err.message || "Impossible de charger les conversations. Veuillez reessayer.",
        );
      } else {
        console.error("Echec du chargement des conversations:", err);
        setError("Impossible de charger les conversations. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  const updateFilters = (nextFilters: Partial<ConversationFilters>) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  };

  const resetFilters = () => {
    setPage(1);
    setFilters(defaultFilters);
  };

  return {
    conversations,
    filters,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    isLoading,
    error,
    setPage,
    setFilters: updateFilters,
    resetFilters,
    refetch: fetchConversations,
  };
}
