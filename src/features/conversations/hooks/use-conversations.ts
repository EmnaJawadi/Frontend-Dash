// src/features/conversations/hooks/use-conversations.ts

"use client";

import { useCallback, useEffect, useState } from "react";
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

      const response = await conversationsService.getConversations(
        filters,
        page,
        pageSize
      );

      setConversations(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchConversations();
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