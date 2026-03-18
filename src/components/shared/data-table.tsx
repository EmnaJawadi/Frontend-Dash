// src/components/shared/data-table.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  render: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyMessage?: string;
  rowKey: (item: T, index: number) => string;
};

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "Aucune donnée disponible.",
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-background">
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-5 text-left text-sm font-semibold text-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={rowKey(item, index)}
                  className="border-b transition hover:bg-muted/20"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-4 align-top", column.className)}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}