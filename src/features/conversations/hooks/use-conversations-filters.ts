// src/features/conversations/hooks/use-conversations-filters.ts

"use client";

import { useMemo, useState } from "react";
import type {
  ConversationPriority,
  ConversationStatus,
} from "@/src/features/conversations/types/conversations.types";

export type ConversationFilters = {
  search: string;
  status: ConversationStatus | "all";
  priority: ConversationPriority | "all";
  assignedTo: string | "all";
  botState: "all" | "active" | "paused";
};

export const defaultConversationFilters: ConversationFilters = {
  search: "",
  status: "all",
  priority: "all",
  assignedTo: "all",
  botState: "all",
};

export function useConversationsFilters(
  initialFilters: Partial<ConversationFilters> = {}
) {
  const [filters, setFilters] = useState<ConversationFilters>({
    ...defaultConversationFilters,
    ...initialFilters,
  });

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim() !== "" ||
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.assignedTo !== "all" ||
      filters.botState !== "all"
    );
  }, [filters]);

  const updateFilter = <K extends keyof ConversationFilters>(
    key: K,
    value: ConversationFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateFilters = (nextFilters: Partial<ConversationFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultConversationFilters);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}