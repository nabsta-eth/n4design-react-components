import { NetworkMap, NETWORK_NAME_TO_CHAIN_ID } from "handle-sdk";

export const DEFAULT_TRANSACTION_SPEED: TransactionSpeed = "fast";

export const TRANSACTION_SPEED_KEY = "transactionSpeed";
export const SLIPPAGE_KEY = "slippage";
export const transactionSpeeds = ["fast", "fastest"] as const;
export type TransactionSpeedPreset = typeof transactionSpeeds[number];
export type TransactionSpeed = TransactionSpeedPreset | number;
export type GasStore = NetworkMap<TransactionSpeed>;
export const isCustomGasPrice = (
  transactionSpeed: TransactionSpeed,
): transactionSpeed is number => {
  return typeof transactionSpeed === "number";
};
export const DEFAULT_TRANSACTION_SPEED_NETWORK_MAP: GasStore = {
  arbitrum: DEFAULT_TRANSACTION_SPEED,
  ethereum: DEFAULT_TRANSACTION_SPEED,
  polygon: DEFAULT_TRANSACTION_SPEED,
  "arbitrum-sepolia": DEFAULT_TRANSACTION_SPEED,
};
export const isValidTransactionSpeedMap = (object: unknown) => {
  if (typeof object !== "object" || object === null) {
    return false;
  }
  for (const network of Object.keys(NETWORK_NAME_TO_CHAIN_ID)) {
    if (!(network in object)) {
      return false;
    }
    const value = (object as any)[network];
    if (typeof value === "string") {
      if (!(transactionSpeeds as readonly string[]).includes(value)) {
        return false;
      }
    } else if (typeof value !== "number") {
      return false;
    }
  }
  return true;
};
