import { Signer, ethers } from "ethers";
import { Network, config as sdkConfig, NetworkMap } from "handle-sdk";
import { walletChoiceLocalStorage } from "./localStorage";
import {
  JsonRpcProvider,
  Provider,
  Web3Provider,
} from "@ethersproject/providers";
import { providers as multicall } from "@0xsequence/multicall";
import {
  connect as connectPrivateKey,
  switchNetwork as switchNetworkPrivateKey,
} from "./privateKey";
import { FallbackProvider } from "handle-sdk/dist/utils/fallbackProvider";
import { getConfig } from "./config";

export type WalletName = "dynamic" | "gnosis" | "private_key";
export type MapWalletName<T> = { [key in WalletName]: T };
export type NetworkDetails = {
  chainName: string;
  chainId: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};

let currentWeb3: any = undefined;
export const DEFAULT_NETWORK: Network = "arbitrum";

const getRpcProvider = (network: Network): Provider =>
  new multicall.MulticallProvider(
    new JsonRpcProvider(getConfig().privateRpcAddresses[network]),
    {
      batchSize: 1000,
      timeWindow: 200,
      contract: "0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E",
    },
  );

const getMockRpcSigner = (provider: Provider): Signer =>
  new ethers.VoidSigner(
    "0x000000000000000000000000000000000000dEaD", // random address
    provider,
  );

const getProviders = (): NetworkMap<Provider> => ({
  ethereum: getRpcProvider("ethereum"),
  arbitrum: getRpcProvider("arbitrum"),
  polygon: getRpcProvider("polygon"),
  "arbitrum-sepolia": getRpcProvider("arbitrum-sepolia"),
});

// This calls getConfig, so it must be wrapped in a lazy init function.
const getFallbackProviders = (): NetworkMap<FallbackProvider> => {
  const providers = getProviders();
  const fallbackProviderConfig = {
    ethereum: [
      {
        provider: providers.ethereum,
        priority: 1,
      },
      {
        provider: sdkConfig.providers.ethereum,
        priority: 2,
      },
    ],
    arbitrum: [
      {
        provider: providers.arbitrum,
        priority: 1,
      },
      {
        provider: sdkConfig.providers.arbitrum,
        priority: 2,
      },
    ],
    polygon: [
      {
        provider: providers.polygon,
        priority: 1,
      },
      {
        provider: sdkConfig.providers.polygon,
        priority: 2,
      },
    ],
    "arbitrum-sepolia": [
      {
        provider: providers["arbitrum-sepolia"],
        priority: 1,
      },
    ],
  };
  return {
    ethereum: new FallbackProvider(fallbackProviderConfig.ethereum, 1),
    arbitrum: new FallbackProvider(fallbackProviderConfig.arbitrum, 1),
    polygon: new FallbackProvider(fallbackProviderConfig.polygon, 1),
    "arbitrum-sepolia": new FallbackProvider(
      fallbackProviderConfig["arbitrum-sepolia"],
      1,
    ),
  };
};

export const getProvider = (network: Network): Provider =>
  getFallbackProviders()[network];

export const getMockSigner = (network: Network): Signer =>
  getMockRpcSigner(getRpcProvider(network));

export const connectSigner = async (
  wallet: Exclude<WalletName, "gnosis" | "dynamic">,
  network: Network,
): Promise<ethers.Signer> => {
  type Map<T> = Omit<MapWalletName<T>, "gnosis" | "dynamic">;
  const walletToGetSignerMap: Map<() => Promise<ethers.Signer>> = {
    private_key: connectPrivateKey,
  };

  const signer = await walletToGetSignerMap[wallet]();
  walletChoiceLocalStorage.set({ walletName: wallet });
  window.dispatchEvent(new Event("storage"));
  return signer;
};

/**
 * @return The signer connected at the new network, or undefined if network
 * switching has failed.
 */
export const switchNetwork = async (
  newNetwork: Network,
): Promise<Signer | undefined> => {
  const wallet = walletChoiceLocalStorage.get();
  if (wallet?.walletName === "private_key") {
    return switchNetworkPrivateKey(newNetwork);
  }
  return undefined;
};

export const setupWeb3Listeners = (
  connectCurrentWallet: () => void,
  disconnectCurrentWallet: () => void,
): void => {
  if (currentWeb3) {
    currentWeb3.removeAllListeners("accountsChanged");
    currentWeb3.removeAllListeners("chainChanged");
    currentWeb3.removeAllListeners("disconnect");
  }

  currentWeb3 = (window as any).ethereum;
  currentWeb3.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectCurrentWallet();
      return;
    }
    connectCurrentWallet();
  });
  currentWeb3.on("chainChanged", connectCurrentWallet);
  currentWeb3.on("disconnect", disconnectCurrentWallet);
};

export const getEventData = <
  T extends {
    interface: {
      parseLog: (log: {
        topics: string[];
        data: string;
      }) => ethers.utils.LogDescription;
    };
  },
>(
  eventName: string,
  contract: T,
  txResult: ethers.ContractReceipt,
): any => {
  if (!Array.isArray(txResult.logs)) return null;
  for (let log of txResult.logs) {
    try {
      const decoded = contract.interface.parseLog(log);
      if (decoded.name === eventName)
        return {
          ...decoded,
          ...decoded.args,
        };
    } catch (error) {}
  }
  return null;
};

/// Checks whether the app is running within Gnosis safe.
export const isWithinGnosisApp = () =>
  document.referrer.includes("gnosis-safe.io") ||
  document.referrer.includes("app.safe.global");

export const trySwitchWeb3ProviderNetwork = async (
  provider: Web3Provider,
  network: Network,
) => {
  if (!provider.provider.request) {
    console.error("provider does not have request method");
    return;
  }
  const config = getConfig();
  try {
    await provider.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.publicNetworkDetails[network].chainId }],
    });
  } catch (e) {
    const error = e as { code: number; message: string };
    if (error.code === 4902) {
      try {
        await provider.provider.request({
          method: "wallet_addEthereumChain",
          params: [config.publicNetworkDetails[network]],
        });
      } catch (e) {
        console.error("Error adding network during switch:", network, e);
      }
    } else {
      throw new Error(error.message);
    }
  }
};
