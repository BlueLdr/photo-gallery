import { useCallback, useMemo } from "react";

import { debounce } from "~/utils";

//================================================

export const useDebounce = <Args extends unknown[], Return>(
  func: (...args: Args) => Return,
  delay: number,
) => useMemo(() => debounce(func, delay), [func, delay]);

export const useDebouncedCallback = <Args extends unknown[], Return>(
  func: (...args: Args) => Return,
  inputs: unknown[] = [],
  delay: number,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(func, inputs);
  return useDebounce<Args, Return>(callback, delay);
};
