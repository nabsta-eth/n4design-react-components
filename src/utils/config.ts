import { NetworkDetails } from "./web3";
import { NetworkMap } from "handle-sdk";

export type Config = {
  walletConnectProjectId: string;
  privateRpcAddresses: NetworkMap<string>;
  publicNetworkDetails: NetworkMap<
    NetworkDetails & {
      rpcUrls: string[];
    }
  >;
  magicKey: string;
  dynamicEnvironmentIds: {
    sandbox: string;
    live: string;
  };
};

let configInstance: Config | undefined;

export const setConfig = (config: Config) => {
  configInstance = config;
};

export const getConfig = (): Config => {
  if (!configInstance) {
    throw new Error("config is not initialised");
  }
  return configInstance;
};
