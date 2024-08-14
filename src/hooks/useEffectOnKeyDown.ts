import { DependencyList, EffectCallback, useEffect, useMemo } from "react";

export const useEffectOnKeyDown = (
  keyCode: string | string[],
  effect: EffectCallback,
  deps: DependencyList = [effect],
) => {
  const keyCodes = useMemo(
    () => (Array.isArray(keyCode) ? keyCode : [keyCode]),
    [],
  );
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!keyCodes.includes(event.code)) {
        return;
      }
      event.preventDefault();
      effect();
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, deps);
};
