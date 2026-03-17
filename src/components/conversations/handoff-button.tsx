// src/components/conversations/handoff-button.tsx

"use client";

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
  const handleClick = async () => {
    if (disabled || isLoading) return;
    await onHandoff();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Prise en charge..." : "Prendre la main"}
    </button>
  );
}