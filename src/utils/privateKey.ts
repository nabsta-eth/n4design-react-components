import { ethers, Signer, Wallet } from "ethers";
import { Network } from "handle-sdk";
import { getProvider } from "./web3";

const unsafeWindow = window as any;
// This is not supposed to be a production authentication method,
// therefore the default network is the primary testnet.
const DEFAULT_NETWORK: Network = "arbitrum-sepolia";
let wallet: Wallet | undefined;

export const connect = async (): Promise<ethers.Signer> => {
  const provider = getProvider(DEFAULT_NETWORK);
  const privateKey = getPrivateKeyFromWindowObject();
  wallet = new Wallet(privateKey, provider);
  return wallet;
};

export const switchNetwork = async (
  network: Network,
): Promise<Signer | undefined> => {
  if (!wallet) {
    return undefined;
  }
  wallet = wallet.connect(getProvider(network));
  return wallet;
};

export const getPrivateKeyFromWindowObject = (): string => {
  const privateKey = unsafeWindow.WALLET_CONNECTION_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("window.WALLET_CONNECTION_PRIVATE_KEY not set");
  }
  return privateKey;
};

export const setPrivateKeyToWindowObject = (key: string) => {
  if (!key.startsWith("0x")) key = `0x${key}`;
  if (key.length != 66) {
    throw new Error("invalid key length");
  }
  unsafeWindow.WALLET_CONNECTION_PRIVATE_KEY = key;
};
