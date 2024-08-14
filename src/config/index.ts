import { SocialSignInProviderEnum } from "@dynamic-labs/sdk-api";
import {
  AuthModeType,
  EvmNetwork,
  LocaleResource,
} from "@dynamic-labs/sdk-react-core";
import { NetworkMap } from "handle-sdk";
import { getConfig } from "../utils/config";

export const TRADE_LP_DEFAULT_CURRENCY_SYMBOL = "USD";
export const USD_CURRENCY_LOGO_URI = "/assets/images/currency/usd-logo.png";
export const TOKEN_ICON_PLACEHOLDER_URL =
  "/assets/images/token-placeholder.png";

export const NETWORK_NAME_TO_LOGO_URL: NetworkMap<string> = {
  ethereum: "/assets/images/network/ethereum-logo.svg",
  arbitrum: "/assets/images/network/arbitrum-logo.svg",
  polygon: "/assets/images/network/polygon-logo.svg",
  "arbitrum-sepolia": "/assets/images/network/testnet-logo.svg",
};

export const BLOCK_EXPLORER_URL_MAP: NetworkMap<string> = {
  ethereum: "https://etherscan.io",
  arbitrum: "https://arbiscan.io",
  polygon: "https://polygonscan.com",
  "arbitrum-sepolia": "https://sepolia.arbiscan.io",
};

// Note this will still only show those that are configured in the dashboard.
// Any not activated will be filtered out.
type SocialProvider = `${SocialSignInProviderEnum}`;
export const DYNAMIC_SOCIAL_PROVIDER_ORDER: SocialProvider[] = [
  "google",
  "farcaster",
  "twitter",
  "discord",
  "github",
];
export const DYNAMIC_LOG_LEVEL = "DEBUG";
export const DYNAMIC_INITIAL_AUTHENTICATION_MODE: AuthModeType = "connect-only";
export const DYNAMIC_LOCALE_OBJECT: LocaleResource = {
  en: {
    dyn_login: {
      title: {
        all: "",
        all_wallet_list: "select your wallet",
      },
      email_form: {
        email_field: {
          label: "email",
        },
        submit_button: {
          label: "continue",
        },
      },
    },
  },
};

// Requires the RPC URLs to be in local storage
// set in the using app code.
export const getDynamicEvmNetworks = (): EvmNetwork[] => {
  const config = getConfig();
  return [
    {
      blockExplorerUrls: [BLOCK_EXPLORER_URL_MAP.arbitrum],
      chainId: 42161,
      iconUrls: ["https://app.dynamic.xyz/assets/networks/arbitrum.svg"],
      name: "Arbitrum",
      nativeCurrency: {
        decimals: 18,
        name: "Arbitrum Ether",
        symbol: "ETH",
      },
      networkId: 42161,
      privateCustomerRpcUrls: [config.privateRpcAddresses.arbitrum],
      rpcUrls: [config.publicNetworkDetails.arbitrum.rpcUrls[0]],
      vanityName: "Arbitrum One",
    },
    {
      blockExplorerUrls: [BLOCK_EXPLORER_URL_MAP.ethereum],
      chainId: 1,
      iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
      name: "Ethereum Mainnet",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      networkId: 1,
      privateCustomerRpcUrls: [config.privateRpcAddresses.ethereum],
      rpcUrls: [config.publicNetworkDetails.ethereum.rpcUrls[0]],
      vanityName: "Ethereum",
    },
    {
      blockExplorerUrls: [BLOCK_EXPLORER_URL_MAP.polygon],
      chainId: 137,
      iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
      name: "Polygon Mainnet",
      nativeCurrency: {
        decimals: 18,
        name: "MATIC",
        symbol: "MATIC",
      },
      networkId: 137,
      privateCustomerRpcUrls: [config.privateRpcAddresses.polygon],
      rpcUrls: [config.publicNetworkDetails.polygon.rpcUrls[0]],
      vanityName: "Polygon",
    },
    {
      blockExplorerUrls: [BLOCK_EXPLORER_URL_MAP["arbitrum-sepolia"]],
      chainId: 421614,
      iconUrls: ["https://app.dynamic.xyz/assets/networks/arbitrum.svg"],
      name: "Arbitrum Sepolia",
      nativeCurrency: {
        decimals: 18,
        name: "Arbitrum Ether",
        symbol: "ETH",
      },
      networkId: 421614,
      privateCustomerRpcUrls: [config.privateRpcAddresses["arbitrum-sepolia"]],
      rpcUrls: [config.publicNetworkDetails["arbitrum-sepolia"].rpcUrls[0]],
      vanityName: "Arbitrum Sepolia",
    },
  ];
};

export const WALLET_DROPDOWN_ID = "header-wallet-dropdown";
