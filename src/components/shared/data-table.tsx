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
  emptyMessage = "Aucune donnee disponible.",
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm fade-up-delay-1">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground",
                    column.className,
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
                <tr key={rowKey(item, index)} className="border-b border-border/60 transition hover:bg-muted/35">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-4 align-top", column.className)}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
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
