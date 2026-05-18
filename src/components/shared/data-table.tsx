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
    <div className="app-table-shell fade-up-delay-1">
      <div className="overflow-x-auto">
        <table className="app-table min-w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={rowKey(item, index)}>
                  {columns.map((column) => (
                    <td key={column.key} className={cn("align-middle", column.className)}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">
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
