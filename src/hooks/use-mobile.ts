import { useEffect, useMemo, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function getViewportWidth() {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.innerWidth;
}

function getDeviceState(width: number) {
  return {
    width,
    isMobile: width > 0 && width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
    isDesktop: width >= TABLET_BREAKPOINT,
  };
}

export function useMobile() {
  const [width, setWidth] = useState<number>(getViewportWidth);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mobileQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );
    const tabletQuery = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${
        TABLET_BREAKPOINT - 1
      }px)`
    );
    const desktopQuery = window.matchMedia(
      `(min-width: ${TABLET_BREAKPOINT}px)`
    );

    const handleChange = () => {
      setWidth(window.innerWidth);
    };

    handleChange();

    mobileQuery.addEventListener("change", handleChange);
    tabletQuery.addEventListener("change", handleChange);
    desktopQuery.addEventListener("change", handleChange);

    window.addEventListener("orientationchange", handleChange);

    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      tabletQuery.removeEventListener("change", handleChange);
      desktopQuery.removeEventListener("change", handleChange);
      window.removeEventListener("orientationchange", handleChange);
    };
  }, []);

  return useMemo(() => {
    const device = getDeviceState(width);

    return {
      mobileBreakpoint: MOBILE_BREAKPOINT,
      tabletBreakpoint: TABLET_BREAKPOINT,
      ...device,
    };
  }, [width]);
}