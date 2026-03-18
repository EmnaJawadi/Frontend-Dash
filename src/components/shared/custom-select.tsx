// src/components/shared/custom-select.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CustomSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  colorClass?: string;
};

type CustomSelectProps = {
  label?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Sélectionner...",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {label ? (
        <label className="mb-2 block text-sm font-semibold">{label}</label>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border bg-background px-4 text-left text-sm transition",
          open && "border-primary"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {selectedOption?.icon ? (
            <span
              className={cn(
                "shrink-0 text-muted-foreground",
                selectedOption.colorClass
              )}
            >
              {selectedOption.icon}
            </span>
          ) : null}

          <span className={cn("truncate", selectedOption?.colorClass)}>
            {selectedOption?.label ?? placeholder}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border bg-background shadow-lg">
          <div className="py-1.5">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-muted",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {option.icon ? (
                      <span
                        className={cn(
                          "shrink-0",
                          isSelected
                            ? "text-primary-foreground"
                            : option.colorClass ?? "text-muted-foreground"
                        )}
                      >
                        {option.icon}
                      </span>
                    ) : null}

                    <span className={cn(!isSelected && option.colorClass)}>
                      {option.label}
                    </span>
                  </div>

                  {isSelected ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}