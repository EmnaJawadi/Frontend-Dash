import { useEffect, useMemo, useRef, useState } from "react";

type UseDebounceOptions = {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
};

export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 400, leading = false, trailing = true } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isFirstCallRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!leading && !trailing) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (leading && isFirstCallRef.current) {
      setDebouncedValue(value);
      isFirstCallRef.current = false;
    }

    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        isFirstCallRef.current = false;
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedValue;
}

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  options: UseDebounceOptions = {}
) {
  const { delay = 400, leading = false, trailing = true } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCalledLeadingRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useMemo(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      hasCalledLeadingRef.current = false;
    },
    []
  );

  const debounced = useMemo(() => {
    return (...args: TArgs) => {
      if (!leading && !trailing) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (leading && !hasCalledLeadingRef.current) {
        callbackRef.current(...args);
        hasCalledLeadingRef.current = true;
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (!leading || trailing) {
            callbackRef.current(...args);
          }
          timeoutRef.current = null;
          hasCalledLeadingRef.current = false;
        }, delay);
      }
    };
  }, [delay, leading, trailing]);

  useEffect(() => cancel, [cancel]);

  return {
    debounced,
    cancel,
  };
}