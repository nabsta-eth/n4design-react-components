import { ethers } from "ethers";
import { Network } from "handle-sdk";
import { trySwitchWeb3ProviderNetwork } from "./web3";

const unsafeWindow = window as any;

const getWeb3Provider = () =>
  new ethers.providers.Web3Provider(unsafeWindow.ethereum);

export const connect = async (): Promise<ethers.Signer> => {
  const provider = getWeb3Provider();
  await unsafeWindow.ethereum.request({ method: "eth_requestAccounts" });
  return provider.getSigner();
};

export const switchNetwork = async (network: Network) => {
  const provider = getWeb3Provider();
  await trySwitchWeb3ProviderNetwork(provider, network);
};

export type NewWalletAsset = {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
};

export const addAssetToWallet = async (asset: NewWalletAsset) => {
  const provider = getWeb3Provider();
  if (!provider?.provider.isMetaMask || !provider.provider.request) return;

  try {
    await provider.provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          ...asset,
        },
      } as any,
    });
  } catch (e) {
    console.log("Error adding asset to wallet:", e);
  }
};
