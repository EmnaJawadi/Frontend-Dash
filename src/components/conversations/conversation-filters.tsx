// src/components/conversations/conversation-filters.tsx

"use client";

import type { ConversationFilters } from "@/src/features/conversations/hooks/use-conversations-filters";

type ConversationFiltersProps = {
  filters: ConversationFilters;
  onChange: (filters: Partial<ConversationFilters>) => void;
  onReset: () => void;
};

export function ConversationFilters({
  filters,
  onChange,
  onReset,
}: ConversationFiltersProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-medium">Search</label>
            <input
              type="text"
              value={filters.search ?? ""}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search by contact, phone, or message..."
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none ring-0 transition placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              value={filters.status ?? "all"}
              onChange={(e) =>
                onChange({
                  status: e.target.value as ConversationFilters["status"],
                })
              }
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="bot_active">Bot Active</option>
              <option value="human_assigned">Human Assigned</option>
              <option value="waiting_customer">Waiting Customer</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Priority</label>
            <select
              value={filters.priority ?? "all"}
              onChange={(e) =>
                onChange({
                  priority: e.target.value as ConversationFilters["priority"],
                })
              }
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Bot State</label>
            <select
              value={filters.botState ?? "all"}
              onChange={(e) =>
                onChange({
                  botState: e.target.value as ConversationFilters["botState"],
                })
              }
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}