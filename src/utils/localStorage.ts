import { WalletChoice } from "../context/UserWallet";

export type VersionedLocalStorageItem<T> = {
  value: T;
  version: number;
};

export interface LocalStorageItem<T> {
  remove: () => void;
  get: () => T | undefined;
  set: (value: T) => void;
}

export const createLocalStorageVersioned = <T>(
  key: string,
  version: number,
): LocalStorageItem<T> => ({
  remove: () => window.localStorage.removeItem(key),
  get: (): T | undefined => getVersionedLocalStorageItem(key, version),
  set: (value: T) => {
    const versionedItem: VersionedLocalStorageItem<T> = {
      version,
      value,
    };
    window.localStorage.setItem(key, JSON.stringify(versionedItem));
  },
});

export const createStorage = <T>(key: string) => {
  return {
    remove: () => window.localStorage.removeItem(key),
    get: (): T | undefined => {
      const item = window.localStorage.getItem(key);

      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          // previous vue app didnt save data as JSON
          // this try catch stops users moving between apps seeing issues.
          console.error("Failed to parse local storage item", key);
        }
      }
    },
    set: (value: T) => window.localStorage.setItem(key, JSON.stringify(value)),
  };
};

const getVersionedLocalStorageItem = <T>(
  key: string,
  version: number,
): T | undefined => {
  const storage = createStorage<VersionedLocalStorageItem<T>>(key);
  const versionedItem = storage.get();
  if (!versionedItem) {
    return undefined;
  }
  if (versionedItem.version < version) {
    storage.remove();
    return undefined;
  }
  return versionedItem.value;
};

const setVersionedLocalStorageItem = <T>(
  key: string,
  version: number,
  value: T,
) => {
  const storage = createStorage<VersionedLocalStorageItem<T>>(key);
  storage.set({ version, value });
};

const removeVersionedLocalStorageItem = <T>(key: string) => {
  const storage = createStorage<VersionedLocalStorageItem<T>>(key);
  storage.remove();
};

const getStorageItem = <T>(key: string): T | undefined => {
  const item = window.localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch {
      // previous vue app didnt save data as JSON
      // this try catch stops users moving between apps seeing issues.
      console.error("Failed to parse local storage item", key);
    }
  }
};

export const walletChoiceLocalStorage =
  createStorage<WalletChoice>("walletChoice");

export const translationLocalStorage =
  createStorage<Record<string, string | undefined>>("translation");

const IS_WALLET_CONNECT_MODAL_OPEN_LS_KEY = "isWalletConnectModalOpen";
export const isWalletConnectModalOpenLocalStorage = createStorage<boolean>(
  IS_WALLET_CONNECT_MODAL_OPEN_LS_KEY,
);

export const DYNAMIC_ENVIRONMENT_ID_LOCAL_STORAGE_KEY = "dynamicEnvironmentId";
