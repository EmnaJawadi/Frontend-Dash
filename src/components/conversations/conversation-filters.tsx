// src/components/conversations/conversation-filters.tsx

"use client";

import {
  CircleCheck,
  CircleDashed,
  CirclePause,
  CircleX,
} from "lucide-react";
import { FiltersBar } from "@/src/components/shared/filters-bar";
import { SearchInput } from "@/src/components/shared/search-input";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@/src/components/shared/custom-select";
import type { ConversationFilters } from "@/src/features/conversations/hooks/use-conversations-filters";

type ConversationFiltersProps = {
  filters: ConversationFilters;
  onChange: (filters: Partial<ConversationFilters>) => void;
  onReset: () => void;
};

const statusOptions: CustomSelectOption[] = [
  {
    value: "all",
    label: "Tous les statuts",
    colorClass: "text-foreground",
  },
  {
    value: "bot_active",
    label: "Bot actif",
    icon: <CircleCheck className="h-4 w-4" />,
    colorClass: "text-green-600",
  },
  {
    value: "human_assigned",
    label: "Prise en charge humaine",
    icon: <CircleDashed className="h-4 w-4" />,
    colorClass: "text-amber-600",
  },
  {
    value: "waiting_customer",
    label: "En attente du client",
    icon: <CirclePause className="h-4 w-4" />,
    colorClass: "text-slate-500",
  },
  {
    value: "closed",
    label: "Fermée",
    icon: <CircleX className="h-4 w-4" />,
    colorClass: "text-zinc-500",
  },
];

const priorityOptions: CustomSelectOption[] = [
  {
    value: "all",
    label: "Toutes les priorités",
    colorClass: "text-foreground",
  },
  {
    value: "high",
    label: "Haute",
    colorClass: "text-red-600",
  },
  {
    value: "medium",
    label: "Moyenne",
    colorClass: "text-amber-600",
  },
  {
    value: "low",
    label: "Basse",
    colorClass: "text-green-600",
  },
];

const botStateOptions: CustomSelectOption[] = [
  {
    value: "all",
    label: "Tous les états",
    colorClass: "text-foreground",
  },
  {
    value: "active",
    label: "Actif",
    colorClass: "text-green-600",
  },
  {
    value: "paused",
    label: "En pause",
    colorClass: "text-amber-600",
  },
];

export function ConversationFilters({
  filters,
  onChange,
  onReset,
}: ConversationFiltersProps) {
  return (
    <FiltersBar
      actions={
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          Réinitialiser les filtres
        </button>
      }
    >
      <div className="xl:col-span-2">
        <label className="mb-2 block text-sm font-semibold">Recherche</label>
        <SearchInput
          value={filters.search ?? ""}
          onChange={(value) => onChange({ search: value })}
          placeholder="Rechercher par contact, téléphone ou message..."
        />
      </div>

      <CustomSelect
        label="Statut"
        value={filters.status ?? "all"}
        options={statusOptions}
        onChange={(value) =>
          onChange({
            status: value as ConversationFilters["status"],
          })
        }
      />

      <CustomSelect
        label="Priorité"
        value={filters.priority ?? "all"}
        options={priorityOptions}
        onChange={(value) =>
          onChange({
            priority: value as ConversationFilters["priority"],
          })
        }
      />

      <CustomSelect
        label="État du bot"
        value={filters.botState ?? "all"}
        options={botStateOptions}
        onChange={(value) =>
          onChange({
            botState: value as ConversationFilters["botState"],
          })
        }
      />
    </FiltersBar>
  );
}