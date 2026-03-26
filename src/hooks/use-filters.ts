import { useCallback, useMemo, useState } from "react";

type Primitive = string | number | boolean | null | undefined;
type FilterValue = Primitive | Primitive[];

type FiltersRecord = Record<string, FilterValue>;

type UseFiltersOptions<TFilters extends FiltersRecord> = {
  initialFilters: TFilters;
};

type ActiveFilterEntry = {
  key: string;
  value: FilterValue;
};

function isEmptyFilterValue(value: FilterValue): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return value === "" || value === null || value === undefined;
}

export function useFilters<TFilters extends FiltersRecord>({
  initialFilters,
}: UseFiltersOptions<TFilters>) {
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  const setFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const setMultipleFilters = useCallback((nextFilters: Partial<TFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const replaceFilters = useCallback((nextFilters: TFilters) => {
    setFilters(nextFilters);
  }, []);

  const clearFilter = useCallback(<K extends keyof TFilters>(key: K) => {
    setFilters((prev) => {
      const initialValue = initialFilters[key];

      return {
        ...prev,
        [key]: initialValue,
      };
    });
  }, [initialFilters]);

  const activeFilters = useMemo<ActiveFilterEntry[]>(() => {
    return Object.entries(filters)
      .filter(([, value]) => !isEmptyFilterValue(value))
      .map(([key, value]) => ({
        key,
        value,
      }));
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return activeFilters.length;
  }, [activeFilters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    setFilters,
    setFilter,
    setMultipleFilters,
    replaceFilters,
    clearFilter,
    resetFilters,
    activeFilters,
    activeFiltersCount,
    hasActiveFilters,
  };
}

type SearchableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SearchableValue[]
  | { [key: string]: SearchableValue };

function normalizeValue(value: SearchableValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(normalizeValue).join(" ");
  }

  return "";
}

type ApplyFiltersOptions<TItem, TFilters extends FiltersRecord> = {
  items: TItem[];
  filters: TFilters;
  searchKeys?: (keyof TItem)[];
};

export function applyFilters<TItem extends Record<string, unknown>, TFilters extends FiltersRecord>({
  items,
  filters,
  searchKeys = [],
}: ApplyFiltersOptions<TItem, TFilters>) {
  return items.filter((item) => {
    for (const [rawKey, rawValue] of Object.entries(filters)) {
      const key = rawKey as keyof TFilters;
      const value = rawValue as FilterValue;

      if (isEmptyFilterValue(value)) {
        continue;
      }

      if (key === "search") {
        const query = String(value).toLowerCase().trim();

        if (!query) {
          continue;
        }

        const haystack = searchKeys
          .map((searchKey) => normalizeValue(item[searchKey] as SearchableValue))
          .join(" ");

        if (!haystack.includes(query)) {
          return false;
        }

        continue;
      }

      const itemValue = item[rawKey as keyof TItem];

      if (Array.isArray(value)) {
        const normalizedItemValue = normalizeValue(itemValue as SearchableValue);

        const hasMatch = value.some((entry) => {
          const normalizedEntry = normalizeValue(entry as SearchableValue);
          return normalizedItemValue.includes(normalizedEntry);
        });

        if (!hasMatch) {
          return false;
        }

        continue;
      }

      const normalizedFilterValue = normalizeValue(value as SearchableValue);
      const normalizedItemValue = normalizeValue(itemValue as SearchableValue);

      if (!normalizedItemValue.includes(normalizedFilterValue)) {
        return false;
      }
    }

    return true;
  });
}