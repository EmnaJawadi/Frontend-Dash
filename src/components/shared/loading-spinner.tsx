// src/components/shared/loading-spinner.tsx

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
};

export function LoadingSpinner({
  size = "md",
  label = "Chargement...",
}: LoadingSpinnerProps) {
  const sizeClass =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
      ? "h-10 w-10 border-[3px]"
      : "h-6 w-6 border-2";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-muted border-t-primary ${sizeClass}`}
        role="status"
        aria-label={label}
      />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  );
}