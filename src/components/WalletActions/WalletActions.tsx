import React from "react";
import copy from "copy-to-clipboard";
import {
  useConnectedAccount,
  useConnectedNetwork,
} from "../../context/UserWallet";
import { getExplorerMetadata } from "../../utils/general";
import classes from "./WalletActions.module.scss";
import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import classNames from "classnames";
import { Link } from "../handle_uikit/components/Link";
import { translationLocalStorage } from "../../utils/localStorage";

const WalletActions = (
  props: React.HTMLProps<HTMLDivElement> & { isMobile: boolean },
) => {
  const { className, isMobile, ...rest } = props;
  const connectedAccount = useConnectedAccount();
  const network = useConnectedNetwork();
  const t = translationLocalStorage.get();

  const explorerMetadata =
    connectedAccount && network
      ? getExplorerMetadata(connectedAccount, "address", network)
      : undefined;

  const copyToClipboard = () => {
    if (connectedAccount) {
      copy(connectedAccount);
    }
  };

  return (
    <div
      className={classNames(className, classes.walletActionWrapper)}
      {...rest}
    >
      <Link
        tooltip={
          isMobile
            ? undefined
            : {
                text: t?.copyToClipboard ?? "",
                position: "bottom",
              }
        }
        onClick={copyToClipboard}
      >
        <FontAwesomeIcon icon={["fal", "copy"]} />
      </Link>

      <Link
        className="hfi-link"
        href={explorerMetadata?.url ?? "#"}
        target="_blank"
        rel="noreferrer"
        tooltip={
          isMobile
            ? undefined
            : {
                text: t?.viewAddressOnBlockExplorer ?? "",
                position: "bottom",
              }
        }
      >
        <FontAwesomeIcon icon={["fal", "external-link-square"]} />
      </Link>

      {connectedAccount && (
        <input
          value={connectedAccount}
          id="header-account"
          readOnly
          className="off-screen"
        />
      )}
    </div>
  );
};

export default WalletActions;
