"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  PERIOD_CHANGE_EVENT,
  PERIOD_QUERY_KEY,
  getPeriodFromSearch,
  getPeriodLabel,
  isPeriodFilter,
  type PeriodFilter,
} from "@/src/lib/period-filter";

function readPeriodFromLocation(fallback: PeriodFilter): PeriodFilter {
  if (typeof window === "undefined") return fallback;
  return getPeriodFromSearch(window.location.search, fallback);
}

export function usePeriodFilter(defaultPeriod: PeriodFilter = "30d") {
  const router = useRouter();
  const pathname = usePathname();
  const [period, setPeriodState] = useState<PeriodFilter>(defaultPeriod);

  const readPeriod = useCallback(
    () => readPeriodFromLocation(defaultPeriod),
    [defaultPeriod],
  );

  useEffect(() => {
    setPeriodState(readPeriod());

    const handlePopState = () => setPeriodState(readPeriod());
    const handlePeriodChange = (event: Event) => {
      const nextPeriod = (event as CustomEvent<PeriodFilter>).detail;
      setPeriodState(isPeriodFilter(nextPeriod) ? nextPeriod : readPeriod());
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener(PERIOD_CHANGE_EVENT, handlePeriodChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener(PERIOD_CHANGE_EVENT, handlePeriodChange);
    };
  }, [pathname, readPeriod]);

  const setPeriod = useCallback(
    (nextPeriod: PeriodFilter) => {
      setPeriodState(nextPeriod);

      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      params.set(PERIOD_QUERY_KEY, nextPeriod);

      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
      window.dispatchEvent(new CustomEvent(PERIOD_CHANGE_EVENT, { detail: nextPeriod }));
    },
    [pathname, router],
  );

  return {
    period,
    periodLabel: getPeriodLabel(period),
    setPeriod,
  };
}
