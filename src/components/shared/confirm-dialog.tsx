// src/components/shared/confirm-dialog.tsx

"use client";

import type { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  icon?: ReactNode;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isLoading = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {icon ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                {icon}
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">{title}</h2>

              {description ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Chargement..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}