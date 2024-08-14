import { Network } from "handle-sdk";
import { BLOCK_EXPLORER_URL_MAP } from "../config";
import { WalletConnector } from "@dynamic-labs/sdk-react-core";
import { DynamicWalletType } from "src/context/UserWallet";

export const clamp = (num: number, min?: number, max?: number) =>
  Math.min(Math.max(num, min ?? 0), max ?? Infinity);

export const isFxToken = (symbol: string) => {
  return symbol.startsWith("fx") && symbol.length === 5;
};

export const setTimeoutAsync = (waitTimeMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, waitTimeMs));

export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object")
    return a === b;
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const key in a) {
    if (!b.hasOwnProperty(key) || !deepEquals(a[key], b[key])) return false;
  }
  return true;
};

export const shortenAddress = (
  address: string,
  prefixDigitsToShow = 6,
  suffixDigitsToShow = 4,
) => {
  if (address.length === 40 && !address.startsWith("0x")) {
    address = `0x${address}`;
  }
  if (address.length !== 42) {
    throw new Error("Invalid address");
  }
  return `${address.substring(0, prefixDigitsToShow)}...${address.substring(
    42 - suffixDigitsToShow,
  )}`;
};

export const networkNameToShow = (network: Network | undefined): string => {
  if (network === "arbitrum-sepolia") {
    return "testnet";
  }
  if (!network) {
    return "unknown";
  }
  return network;
};

export type ExplorerEntity = "tx" | "address" | "token" | "contract";

export const getExplorerUrl = (
  data: string,
  type: ExplorerEntity,
  network: Network,
) => `${BLOCK_EXPLORER_URL_MAP[network]}/${type}/${data}`;

export const getExplorerName = (network: Network) =>
  BLOCK_EXPLORER_URL_MAP[network]?.split("https://")?.pop()?.split(".")[0];

export const getExplorerMetadata = (
  data: string,
  type: ExplorerEntity,
  network: Network,
) => {
  const name = getExplorerName(network);
  const url = getExplorerUrl(data, type, network);

  return {
    name,
    url,
    prompt: `view ${type} on ${name}`,
  };
};

export const getDynamicWalletChoice = (
  dynamicWalletConnector: WalletConnector | null,
): DynamicWalletType => {
  if (!dynamicWalletConnector) {
    return undefined;
  }
  if (dynamicWalletConnector.isEmbeddedWallet) {
    return "embedded";
  }
  if (dynamicWalletConnector.isWalletConnect) {
    return "walletConnect";
  }
  return "browser";
};
