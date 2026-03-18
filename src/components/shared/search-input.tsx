// src/components/shared/search-input.tsx

"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher...",
  disabled = false,
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3">
      <Search className="h-5 w-5 text-muted-foreground" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}