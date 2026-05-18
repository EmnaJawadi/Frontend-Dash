"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type ThemeToggleProps = {
  showLabel?: boolean;
};

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Activer mode clair" : "Activer mode sombre";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`app-control inline-flex items-center justify-center text-card-foreground transition hover:bg-accent ${
        showLabel ? "gap-2 px-3.5" : "w-10"
      }`}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {showLabel ? <span className="hidden text-sm font-medium xl:inline">{label}</span> : null}
    </button>
  );
}
