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
    <div className="app-control flex items-center gap-3 px-3.5 transition focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/20">
      <Search className="h-4 w-4 text-muted-foreground" />

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
