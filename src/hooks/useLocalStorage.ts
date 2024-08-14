import { useEffect, useMemo, useState } from "react";
import { LocalStorageItem, createStorage } from "../utils/localStorage";

export type LocalStorageHook<T> = [T, (value: T) => void, boolean];

export const useLocalStorage = <T>(
  key: string,
  initialValueIfEmpty: T,
): LocalStorageHook<T> => {
  const [storage] = useState(createStorage<T>(key));
  return useLocalStorageItemInterface(storage, initialValueIfEmpty);
};

export const useLocalStorageItemInterface = <T>(
  item: LocalStorageItem<T>,
  initialValueIfEmpty: T,
): LocalStorageHook<T> => {
  const initialStored = useMemo(() => item.get(), []);
  const isUninitialised = initialStored === undefined;
  const [state, setState] = useState<T>(
    isUninitialised ? initialValueIfEmpty : initialStored,
  );
  useEffect(() => {
    if (state === undefined) {
      item.remove();
      return;
    }
    item.set(state);
  }, [state]);

  return [state, setState, isUninitialised];
};
