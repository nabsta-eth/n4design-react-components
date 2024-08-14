import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Button } from "../handle_uikit/components/Button";
import { shortenAddress } from "../../utils/general";
import classes from "./DynamicWalletButton.module.scss";
import FontAwesomeIcon from "../FontAwesomeIcon";
import {
  useConnectedAccount,
  useUserWalletStore,
} from "../../context/UserWallet";
import { DYNAMIC_INITIAL_AUTHENTICATION_MODE } from "../../config";
import { translationLocalStorage } from "../../utils/localStorage";
import { useEffect } from "react";
import classNames from "classnames";
import Blockies from "react-blockies";

export type DynamicWalletButtonProps = {
  themeFile: { [key: string]: string };
  isMobile: boolean;
  setShowChooseWalletModal: (show: boolean) => void;
  showChooseWalletModal?: boolean;
  onClick: () => void;
};

const id = "header-wallet-button";

const DynamicWalletButton = ({
  themeFile,
  isMobile,
  showChooseWalletModal,
  setShowChooseWalletModal,
  onClick,
}: DynamicWalletButtonProps) => {
  const { isAuthenticated, primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const { walletChoice, setWalletChoice, connection, userStoreInitialising } =
    useUserWalletStore();
  const connectedAccount = useConnectedAccount();
  const t = translationLocalStorage.get();
  useEffect(() => {
    if (!t) {
      console.warn("[UserWallet] translation not found in local storage");
    }
  }, []);

  const isUserLoggedInOrAuthenticated =
    (isLoggedIn && DYNAMIC_INITIAL_AUTHENTICATION_MODE === "connect-only") ||
    (isAuthenticated &&
      DYNAMIC_INITIAL_AUTHENTICATION_MODE === "connect-and-sign");
  const isUsingDynamic = walletChoice?.walletName === "dynamic";
  const isConnected =
    (isUserLoggedInOrAuthenticated && primaryWallet?.address) ||
    (!isUsingDynamic && !!connectedAccount);

  const getAddress = (short?: boolean) => {
    if (primaryWallet?.address) {
      const prefixDigitsToShow = isMobile ? 4 : 5;
      const suffixDigitsToShow = isMobile ? 3 : 4;
      return short
        ? shortenAddress(
            primaryWallet.address.toLowerCase(),
            prefixDigitsToShow,
            suffixDigitsToShow,
          )
        : primaryWallet.address.toLowerCase();
    }
    if (connectedAccount) {
      return short ? shortenAddress(connectedAccount) : connectedAccount;
    }
    return "";
  };
  const buttonText =
    !showChooseWalletModal &&
    !connection.user.isConnected &&
    !userStoreInitialising
      ? t?.connect ?? "connect"
      : `${t?.connecting ?? "connecting"}...`;

  const onClickInternal = () => {
    setWalletChoice({ walletName: "dynamic", dynamicWalletType: undefined });
    setShowChooseWalletModal(true);
  };

  return (
    <Button
      id={id}
      type="secondary"
      size="small"
      className="hfi-metamask-button uk-flex uk-flex-middle uk-flex-center"
      onClick={isConnected ? onClick : onClickInternal}
    >
      {!isConnected && (
        <FontAwesomeIcon icon={["far", "wallet"]} className={classes.icon} />
      )}
      {isConnected && connectedAccount && (
        <Blockies
          seed={connectedAccount}
          bg={themeFile.primaryColor}
          fg={themeFile.backgroundColor}
          spotColor={themeFile.errorColor}
          size={6}
          className={classNames("uk-margin-small-right", classes.identicon)}
        />
      )}
      <span className={classes.address}>
        {isConnected ? getAddress(true) : buttonText}
      </span>
    </Button>
  );
};

export default DynamicWalletButton;
