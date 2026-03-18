// src/components/conversations/handoff-button.tsx

"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/src/components/shared/confirm-dialog";

type HandoffButtonProps = {
  onHandoff: () => Promise<boolean> | boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

export function HandoffButton({
  onHandoff,
  isLoading = false,
  disabled = false,
}: HandoffButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    if (disabled || isLoading) return;
    await onHandoff();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled || isLoading}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Prise en charge..." : "Prendre la main"}
      </button>

      <ConfirmDialog
        open={open}
        title="Confirmer la prise en charge"
        description="Voulez-vous vraiment prendre la main sur cette conversation ?"
        confirmText="Oui, confirmer"
        cancelText="Annuler"
        isLoading={isLoading}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}