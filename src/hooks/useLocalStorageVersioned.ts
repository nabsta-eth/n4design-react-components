import { useState } from "react";
import { createLocalStorageVersioned } from "../utils/localStorage";
import {
  LocalStorageHook,
  useLocalStorageItemInterface,
} from "./useLocalStorage";

export const useLocalStorageVersioned = <T>(
  key: string,
  version: number,
  initialValueIfEmpty: T,
): LocalStorageHook<T> => {
  const [storage] = useState(createLocalStorageVersioned<T>(key, version));
  return useLocalStorageItemInterface(storage, initialValueIfEmpty);
};
