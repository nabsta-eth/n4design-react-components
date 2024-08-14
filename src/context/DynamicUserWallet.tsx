import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  DYNAMIC_INITIAL_AUTHENTICATION_MODE,
  DYNAMIC_LOCALE_OBJECT,
  DYNAMIC_LOG_LEVEL,
  DYNAMIC_SOCIAL_PROVIDER_ORDER,
  getDynamicEvmNetworks,
} from "../config";
import { UserWalletProvider } from "./UserWallet";
import { SocialSignInProviderEnum } from "@dynamic-labs/sdk-api";
import { useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getConfig } from "../utils/config";
import { PowerTileProvider } from "./PowerTile";

export const DynamicUserWallet: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isMobile = window.localStorage.getItem("isMobile") === "true";
  const config = getConfig();
  const [shouldUseDynamicSandbox] = useLocalStorage<boolean | undefined>(
    "shouldUseDynamicSandbox",
    undefined,
  );
  const dynamicEnvironmentId = useMemo(() => {
    const dynamicEnvironmentId = !!shouldUseDynamicSandbox
      ? config.dynamicEnvironmentIds.sandbox
      : config.dynamicEnvironmentIds.live;

    console.debug(
      "[DynamicUserWallet] dynamic environment id for",
      shouldUseDynamicSandbox ? "sandbox" : "live",
      "environment id in use:",
      dynamicEnvironmentId,
    );
    return dynamicEnvironmentId;
  }, [shouldUseDynamicSandbox]);
  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectorExtensions: [EthersExtension],
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: getDynamicEvmNetworks(),
        },
        cssOverrides: <CssOverrides isMobile={isMobile} />,
        initialAuthenticationMode: DYNAMIC_INITIAL_AUTHENTICATION_MODE,
        logLevel: DYNAMIC_LOG_LEVEL,
        defaultNumberOfWalletsToShow: 5,
        socialProvidersFilter,
      }}
      locale={DYNAMIC_LOCALE_OBJECT}
    >
      <UserWalletProvider>
        <PowerTileProvider>{children}</PowerTileProvider>
      </UserWalletProvider>
    </DynamicContextProvider>
  );
};

const CssOverrides = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <link href="/assets/styles/dynamic.css" rel="stylesheet" />
    {!isMobile && (
      <link href="/assets/styles/dynamicDesktop.css" rel="stylesheet" />
    )}
    {isMobile && (
      <link href="/assets/styles/dynamicMobile.css" rel="stylesheet" />
    )}
  </>
);

const socialProvidersFilter = (
  socialProviders: SocialSignInProviderEnum[],
): SocialSignInProviderEnum[] => {
  // Reorder the providers into view order
  // filtering out any that are not configured yet.
  return DYNAMIC_SOCIAL_PROVIDER_ORDER.filter(socialProvider =>
    socialProviders.some(p => p === socialProvider),
  ).map(socialProvider =>
    socialProviders.find(p => p === socialProvider),
  ) as SocialSignInProviderEnum[];
};
