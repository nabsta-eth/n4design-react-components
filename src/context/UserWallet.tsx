import { Provider, Web3Provider } from "@ethersproject/providers";
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { ethers, Signer } from "ethers";
import { Network, NETWORK_NAME_TO_CHAIN_ID } from "handle-sdk";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  DEFAULT_TRANSACTION_SPEED_NETWORK_MAP,
  GasStore,
  isValidTransactionSpeedMap,
  SLIPPAGE_KEY,
  TransactionSpeed,
  TRANSACTION_SPEED_KEY,
  DEFAULT_TRANSACTION_SPEED,
} from "../utils/transactionSpeed";
import { sendAnalyticsEvent } from "../utils/analytics";
import { translationLocalStorage } from "../utils/localStorage";
import {
  closeAllNotifications,
  Notification,
  showNotification,
} from "../utils/notifications";
import {
  getProvider,
  connectSigner,
  setupWeb3Listeners,
  switchNetwork as switchWalletNetwork,
} from "../utils/web3";
import { queryStringToObject } from "../utils/url";
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { setPrivateKeyToWindowObject } from "../utils/privateKey";
import { CHAIN_ID_TO_NETWORK_NAME } from "handle-sdk/dist/constants";
import { getDynamicWalletChoice, setTimeoutAsync } from "../utils/general";
import {
  useDynamicContext,
  useIsLoggedIn,
  useUserWallets,
  useWalletConnectorEvent,
  WalletConnector,
} from "@dynamic-labs/sdk-react-core";
import { DYNAMIC_INITIAL_AUTHENTICATION_MODE } from "../config";

const DEFAULT_NETWORK: Network = "arbitrum";
const unsafeWindow = window as any;
export type ChainConnection =
  | {
      isConnected: false;
      isConnecting: true;
    }
  | {
      isConnected: true;
      isConnecting: false;
      isSupportedNetwork: true;
      chainId: number;
      provider: ethers.providers.Provider;
      network: Network;
    }
  | {
      isConnected: true;
      isConnecting: false;
      isSupportedNetwork: false;
      chainId: number;
      provider: ethers.providers.Provider;
    };
export type UserConnection =
  | {
      isConnected: false;
      isConnecting: false;
    }
  | {
      isConnected: false;
      isConnecting: true;
    }
  | {
      isConnected: true;
      isConnecting: false;
      address: string;
      signer: ethers.Signer;
    };
export type Connection = {
  user: UserConnection;
  chain: ChainConnection;
};
export type WalletName = "gnosis" | "private_key" | "dynamic";
export type DynamicWalletType =
  | "embedded"
  | "browser"
  | "walletConnect"
  | undefined;
export type WalletChoice =
  | {
      walletName: "gnosis" | "private_key";
    }
  | {
      walletName: "dynamic";
      dynamicWalletType: DynamicWalletType;
    }
  | undefined;
export type CodeConnectableWalletName = Exclude<WalletName, "dynamic">;

export type UserWalletValue = {
  connection: Connection;
  userStoreInitialising: boolean;
  currentGasPrice: ethers.BigNumber | undefined;
  slippage: number;
  transactionSpeed: TransactionSpeed;
  isDev: boolean;
  walletChoice: WalletChoice;
  setWalletChoice(walletChoice: WalletChoice): void;
  connectWallet(
    wallet: CodeConnectableWalletName,
    network?: Network,
  ): Promise<void>;
  disconnectWallet(): void;
  fetchGasPrice(): Promise<void>;
  setSlippage(slippage: number): void;
  setTransactionSpeed(transactionSpeed: TransactionSpeed): void;
  switchNetwork(network: Network): Promise<void>;
  setIsDev(isDev: boolean): void;
};

const UserWalletContext = createContext<UserWalletValue | undefined>(undefined);

let walletNotification: Notification | undefined = undefined;

const INITIAL_CONNECTION: Connection = {
  chain: { isConnecting: true, isConnected: false },
  user: { isConnecting: false, isConnected: false },
};

export const UserWalletProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isInitialising, setIsInitialising] = useState<boolean>(true);
  // TODO move this to connection?
  const [currentGasPrice, setCurrentGasPrice] = useState<ethers.BigNumber>();
  const [isDev, setIsDev] = useState<boolean>(false);
  const { sdk: gnosisSdk, safe: gnosisSafe } = useSafeAppsSDK();
  const gnosisProvider = useMemo(
    () => new Web3Provider(new SafeAppProvider(gnosisSafe, gnosisSdk)),
    [gnosisSdk, gnosisSafe],
  );
  const {
    isAuthenticated,
    primaryWallet: dynamicWallet,
    walletConnector,
    handleLogOut,
  } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [walletChoice, setWalletChoice] = useLocalStorage<WalletChoice>(
    "walletChoice",
    undefined,
  );
  const [connection, dispatchConnection] = useReducer(
    reduceConnection,
    INITIAL_CONNECTION,
  );
  const connectionRef = useRef(connection);
  const t = translationLocalStorage.get();
  const unlockYourWalletMessage =
    t?.unlockYourWalletMessage ?? "unlock your wallet to get started";
  const isConnectedViaDynamic = useMemo(
    () =>
      (isLoggedIn && DYNAMIC_INITIAL_AUTHENTICATION_MODE === "connect-only") ||
      (isAuthenticated &&
        DYNAMIC_INITIAL_AUTHENTICATION_MODE === "connect-and-sign"),
    [isLoggedIn, isAuthenticated],
  );

  useWalletConnectorEvent(
    dynamicWallet?.connector,
    "chainChange",
    async ({ chain }, connector) => {
      setIsInitialising(true);
      const provider = await connector.ethers?.getRpcProvider();
      if (!provider) {
        console.debug(
          "[UserWallet] chainChange: provider not found",
          provider,
          chain,
          connector,
        );
        return setIsInitialising(false);
      }
      const ethersNetwork: ethers.providers.Network =
        await provider.getNetwork();
      dispatchConnection({
        type: "set-chain-connection",
        provider: provider,
        ethersNetwork,
      });
    },
  );

  useWalletConnectorEvent(
    dynamicWallet?.connector,
    "accountChange",
    async (newAccount, connector) => {
      if (!connector.ethers) {
        console.error(
          "[UserWallet] no connector.ethers @ dynamic accountChange",
        );
        return;
      }
      const signer = await connector.ethers.getSigner();
      const provider = await connector.ethers.getRpcProvider();
      const ethersNetwork = await provider.getNetwork();
      if (!dynamicWallet || !signer || !provider || !ethersNetwork) {
        console.error(
          "[UserWallet] accountChange: address changed to",
          newAccount.accounts[0],
          "with connector; unable to set user connection -- missing a value:",
          {
            connector,
            dynamicWallet,
            signer,
            provider,
            ethersNetwork,
          },
        );
        return;
      }
      dispatchConnection({
        type: "set-user-connection",
        address: newAccount.accounts[0].toLowerCase(),
        signer,
        provider,
        ethersNetwork,
      });
    },
  );

  const wallets = useUserWallets();
  const walletsConnectors = wallets.map(({ connector }) => connector);
  useWalletConnectorEvent(walletsConnectors, "disconnect", _connector => {
    disconnectWallet();
  });

  useEffect(() => {
    if (connection.user.isConnected) {
      // Should not connect again; user can:
      // 1. disconnect and re-connect
      // 2. switch accounts
      // 3. switch networks
      return;
    }
    if (walletChoice?.walletName !== "dynamic") {
      return;
    }
    if (!dynamicWallet && connection.user.isConnected) {
      return disconnectWallet();
    }
    if (!walletConnector || !walletConnector.ethers) {
      console.error("[UserWallet] no dynamic wallet connector");
      return;
    }
    const setUpUserConnection = async (connector: WalletConnector) => {
      if (!connector.ethers) {
        console.error("[UserWallet] no dynamic wallet connector");
        return;
      }
      const signer = await connector.ethers.getSigner();
      const provider = await connector.ethers.getRpcProvider();
      const ethersNetwork = await provider?.getNetwork();
      setIsInitialising(true);
      setWalletChoice({
        walletName: "dynamic",
        dynamicWalletType: getDynamicWalletChoice(connector),
      });
      dispatchConnection({
        type: "set-user-connection",
        signer,
        address: await signer.getAddress(),
        provider,
        ethersNetwork,
      });
    };

    setUpUserConnection(walletConnector);
  }, [dynamicWallet, isConnectedViaDynamic, connection.user]);

  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  const disconnectWallet = useCallback(() => {
    dispatchConnection({
      type: "clear-user-connection",
    });
    handleLogOut();
    setIsInitialising(false);
    setWalletChoice(undefined);
  }, []);

  const connectWallet = useCallback(
    async (
      wallet: CodeConnectableWalletName,
      connectNetwork: Network = DEFAULT_NETWORK,
    ) => {
      setIsInitialising(true);
      try {
        const { signer: newSigner, address: newAddress } =
          await connectSignerWithAddress(
            wallet,
            gnosisProvider,
            gnosisSafe,
            connectNetwork,
          );
        const provider = newSigner.provider;
        if (!provider) {
          throw new Error("connected signer has no provider");
        }
        const ethersNetwork = await provider.getNetwork();
        dispatchConnection({
          type: "set-user-connection",
          signer: newSigner,
          address: newAddress.toLowerCase(),
          provider,
          ethersNetwork,
        });
        setWalletChoice({ walletName: wallet });
        setupWeb3Listeners(() => connectWallet(wallet), disconnectWallet);
        if (walletNotification) {
          walletNotification.close();
        }
        sendAnalyticsEvent("login", {
          method: wallet,
        });
      } catch (err) {
        const error = err as { code?: number };
        if (error.code === -32002) {
          console.warn("already attempting to unlock wallet");
          closeAllNotifications();
          walletNotification = showNotification({
            status: "pending",
            message: unlockYourWalletMessage,
          });
        } else {
          console.error(error);
        }
      } finally {
        setIsInitialising(false);
      }
    },
    [gnosisSafe, gnosisSdk],
  );

  useEffect(() => {
    unsafeWindow.connectPrivateKeyString = (key: string) => {
      setPrivateKeyToWindowObject(key);
      setWalletChoice({ walletName: "private_key" });
      connectWallet("private_key");
    };
  }, [connectWallet]);

  const switchNetwork = async (newNetwork: Network) => {
    try {
      setIsInitialising(true);
      const action = await handleSwitchNetwork(
        newNetwork,
        connection,
        walletConnector ?? undefined,
      );
      if (action) {
        dispatchConnection(action);
      }
    } catch (e) {
      console.error("[UserWallet] error switching network", e);
    } finally {
      setIsInitialising(false);
    }
  };

  useEffect(() => {
    if (connection.user.isConnected && connection.user.address) {
      setIsInitialising(false);
    }
  }, [connection.user]);

  const [slippage, setSlippage] = useLocalStorage(SLIPPAGE_KEY, 0.5);
  const [transactionSpeedNetworkMap, setTransactionSpeedNetworkMap] =
    useLocalStorage<GasStore>(
      TRANSACTION_SPEED_KEY,
      DEFAULT_TRANSACTION_SPEED_NETWORK_MAP,
    );

  const setTransactionSpeed = useCallback(
    (transactionSpeed: TransactionSpeed) => {
      if (connection.chain.isConnecting) {
        console.warn("cannot set transaction speed without network");
        return;
      }
      if (!connection.chain.isSupportedNetwork) {
        console.warn("cannot set transaction speed without network");
        return;
      }
      setTransactionSpeedNetworkMap({
        ...transactionSpeedNetworkMap,
        [connection.chain.network]: transactionSpeed,
      });
    },
    [connection.chain],
  );

  const transactionSpeedForNetwork =
    !connection.chain.isConnecting && connection.chain.isSupportedNetwork
      ? transactionSpeedNetworkMap[connection.chain.network]
      : DEFAULT_TRANSACTION_SPEED;

  const transactionSpeed = isValidTransactionSpeedMap(
    transactionSpeedForNetwork,
  )
    ? transactionSpeedForNetwork
    : DEFAULT_TRANSACTION_SPEED;

  useEffect(() => {
    // Remove legacy gas storage.
    if (window.localStorage.getItem("userSetGasPrice")) {
      window.localStorage.removeItem("userSetGasPrice");
    }
    // Replace corrupted transaction speed storage.
    if (!isValidTransactionSpeedMap(transactionSpeedNetworkMap)) {
      setTransactionSpeedNetworkMap(DEFAULT_TRANSACTION_SPEED_NETWORK_MAP);
    }
  }, [transactionSpeedNetworkMap]);

  const initialise = useCallback(async () => {
    const previousWalletChoice = walletChoice;
    // Allow some time to ensure connection attempts are successful.
    await setTimeoutAsync(250);
    if (connectionRef.current.chain.isConnected) {
      return;
    }
    // Connect to chain without user connection.
    console.debug("init without user wallet", previousWalletChoice);
    switchNetwork("arbitrum").catch(console.error);
  }, [connectWallet]);

  const fetchGasPrice = useCallback(async () => {
    if (!connection.chain.isConnected) {
      return;
    }
    try {
      const newGasPrice = await connection.chain.provider.getGasPrice();
      setCurrentGasPrice(newGasPrice);
    } catch (error) {
      console.error(`Failed to fetch gas price`, error);
    }
  }, [connection.chain]);

  useEffect(() => {
    setIsInitialising(true);
    initialise()
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setIsInitialising(false);
      });
  }, [initialise]);

  const spyAccount = queryStringToObject<{ spy?: string }>().spy;

  // TODO: re-implement spyAccount with `Connection` struct.
  const value = useMemo(
    () => ({
      userStoreInitialising: isInitialising,
      connection,
      currentGasPrice,
      slippage,
      transactionSpeed,
      setSlippage,
      setTransactionSpeed,
      disconnectWallet,
      connectWallet,
      fetchGasPrice,
      switchNetwork,
      isDev,
      setIsDev,
      walletChoice,
      setWalletChoice,
    }),
    [
      isInitialising,
      connection,
      currentGasPrice,
      slippage,
      transactionSpeed,
      disconnectWallet,
      connectWallet,
      fetchGasPrice,
      isDev,
      switchNetwork,
      spyAccount,
      walletChoice,
    ],
  );

  useEffect(() => {
    console.debug("[UserWallet] value", value, {
      dynamicWallet,
      isConnectedViaDynamic,
    });
  }, [value]);

  return (
    <UserWalletContext.Provider value={value}>
      {children}
    </UserWalletContext.Provider>
  );
};

export const useUserWalletStore = () => {
  const context = useContext(UserWalletContext);
  if (context === undefined) {
    throw new Error("useUserWallet must be used within a UserWalletProvider");
  }
  return context;
};

export const useConnectedAccount = (): string | undefined => {
  const { connection } = useUserWalletStore();
  return connection.user.isConnected ? connection.user.address : undefined;
};

export const useConnectedNetwork = (): Network | undefined => {
  const { connection } = useUserWalletStore();
  return !connection.chain.isConnecting && connection.chain.isSupportedNetwork
    ? connection.chain.network
    : undefined;
};

export const useSigner = (): ethers.Signer | undefined => {
  const { connection } = useUserWalletStore();
  return connection.user.isConnected ? connection.user.signer : undefined;
};

const connectSignerWithAddress = async (
  wallet: Exclude<WalletName, "dynamic">,
  gnosisProvider: Web3Provider,
  gnosisSafe: SafeInfo,
  network: Network = DEFAULT_NETWORK,
): Promise<{ signer: Signer; address: string }> => {
  if (wallet === "gnosis")
    return {
      signer: gnosisProvider.getSigner(),
      address: gnosisSafe.safeAddress,
    };
  const signer = await connectSigner(wallet, network);
  return {
    signer,
    address: await signer.getAddress(),
  };
};

type ConnectionAction =
  | {
      type: "init";
    }
  | {
      type: "clear-user-connection";
    }
  | SetUserConnectionAction
  | SetChainConnectionAction;

type SetUserConnectionAction = {
  type: "set-user-connection";
  signer: Signer;
  address: string;
} & ProviderDispatch;

type SetChainConnectionAction = {
  type: "set-chain-connection";
} & ProviderDispatch;

type ProviderDispatch = {
  provider: Provider;
  ethersNetwork: ethers.providers.Network;
};

const reduceConnection = (
  connection: Connection,
  action: ConnectionAction,
): Connection => {
  connection = { ...connection };
  const setChainConnection = (dispatch: ProviderDispatch) => {
    const network: Network | undefined =
      CHAIN_ID_TO_NETWORK_NAME[dispatch.ethersNetwork.chainId];
    const isSupportedNetwork = network !== undefined;
    connection.chain = !isSupportedNetwork
      ? {
          isConnected: true,
          isConnecting: false,
          isSupportedNetwork: false,
          chainId: dispatch.ethersNetwork.chainId,
          provider: dispatch.provider,
        }
      : {
          isConnected: true,
          isConnecting: false,
          isSupportedNetwork: true,
          chainId: dispatch.ethersNetwork.chainId,
          provider: dispatch.provider,
          network,
        };
  };
  const clearUserConnection = () => {
    connection.user = {
      isConnected: false,
      isConnecting: false,
    };
  };
  switch (action.type) {
    case "set-user-connection":
      connection.user = {
        isConnecting: false,
        isConnected: true,
        address: action.address,
        signer: action.signer,
      };
      setChainConnection(action);
      break;
    case "set-chain-connection":
      setChainConnection(action);
      // Setting a chain connection by itself disconnects the user.
      clearUserConnection();
      break;
    case "clear-user-connection":
      clearUserConnection();
      break;
  }
  return connection;
};

const handleSwitchNetwork = async (
  newNetwork: Network,
  connection: Connection,
  dynamicConnector?: WalletConnector,
): Promise<ConnectionAction | undefined> => {
  if (!connection.user.isConnected && !connection.user.isConnecting) {
    // Not connected; simply set provider to new network.
    const defaultProvider = getProvider(newNetwork);
    const ethersNetwork = await defaultProvider.getNetwork();
    return {
      type: "set-chain-connection",
      provider: defaultProvider,
      ethersNetwork,
    };
  }
  if (!connection.user.isConnected) {
    // This is only reachable if the user is connecting but not connected yet.
    // In which case, they'd have to switch network after connecting.
    throw new Error("failed to switch, user was not connected");
  }
  if (dynamicConnector) {
    // When connecting via dynamic, the context should not
    // update the connection here, as it may cause a mismatch
    // between the provider and the actual wallet.
    // Once the dynamic wallet network is updated, the "chainChange"
    // event will be fired and the connection will be updated there.
    await switchDynamicNetwork(dynamicConnector, newNetwork);
    return undefined;
  }
  // Switching non-dynamic wallet network.
  // This is entirely managed by this package rather than third parties.
  // At the moment, this only switches network for private key connections
  // used for debugging or cypress tests.
  const connectionProvider = connection.user.signer.provider;
  if (!connectionProvider) {
    throw new Error("signer did not have a provider");
  }
  const signer = await switchWalletNetwork(newNetwork);
  if (!signer) {
    throw new Error("failed to switch, no signer");
  }
  if (!signer.provider) {
    throw new Error("failed to switch, no provider");
  }
  const ethersNetwork = await signer.provider.getNetwork();
  return {
    type: "set-user-connection",
    signer: signer,
    address: await signer.getAddress(),
    provider: signer.provider,
    ethersNetwork,
  };
};

const switchDynamicNetwork = async (
  connector: WalletConnector,
  network: Network,
) => {
  if (!connector.supportsNetworkSwitching()) {
    throw new Error("wallet connector does not support network switching");
  }
  await connector.switchNetwork({
    networkChainId: NETWORK_NAME_TO_CHAIN_ID[network],
  });
};
