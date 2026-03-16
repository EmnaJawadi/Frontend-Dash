// src/components/conversations/reactivate-bot-button.tsx
"use client";

type ReactivateBotButtonProps = {
  onReactivate: () => Promise<boolean> | boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

export function ReactivateBotButton({
  onReactivate,
  isLoading = false,
  disabled = false,
}: ReactivateBotButtonProps) {
  const handleClick = async () => {
    if (disabled || isLoading) return;
    await onReactivate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Reactivating..." : "Réactiver bot"}
    </button>
  );
}