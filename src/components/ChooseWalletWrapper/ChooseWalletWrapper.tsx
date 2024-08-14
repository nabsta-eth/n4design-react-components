import {
  CodeConnectableWalletName,
  useConnectedAccount,
  useUserWalletStore,
} from "../../context/UserWallet";
import classes from "./ChooseWalletWrapper.module.scss";
import classNames from "classnames";
import { isWithinGnosisApp, WalletName } from "../../utils/web3";
import { Network } from "handle-sdk";
import { Button } from "../handle_uikit/components/Button";
import Loader from "../Loader";
import {
  FC,
  Fragment,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useState,
} from "react";
import {
  DynamicEmbeddedWidget,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";

type Props = {
  isMobile: boolean;
  showHeader?: boolean;
  setShowChooseWalletModal: (value: boolean) => void;
  primaryColor: string;
};

type MagicLoginOptions = {
  isEmail?: boolean;
};

type ChooseWalletOptions = {
  method?: WalletName;
  magicOptions?: MagicLoginOptions;
};

const ChooseWalletWrapper: FC<Props> = ({
  isMobile,
  showHeader,
  setShowChooseWalletModal,
  primaryColor,
}) => {
  const { connectWallet } = useUserWalletStore();

  const connectWalletWrapper = async (
    wallet: CodeConnectableWalletName,
    network?: Network,
  ) => {
    await connectWallet(wallet, network);
    setShowChooseWalletModal(false);
  };

  return (
    <div className="uk-width-expand">
      <ChooseWallet
        isMobile={isMobile}
        showHeader={showHeader}
        connectWalletWrapper={connectWalletWrapper}
        primaryColor={primaryColor}
        setShowChooseWalletModal={setShowChooseWalletModal}
      />
    </div>
  );
};

export default ChooseWalletWrapper;

type ChooseWalletProps = {
  isMobile: boolean;
  showHeader?: boolean;
  connectWalletWrapper: (
    walletName: CodeConnectableWalletName,
    network?: Network,
  ) => Promise<void>;
  primaryColor: string;
  setShowChooseWalletModal: (value: boolean) => void;
};

const ChooseWallet = ({
  isMobile,
  showHeader,
  connectWalletWrapper,
  primaryColor,
  setShowChooseWalletModal,
}: ChooseWalletProps) => {
  const { userStoreInitialising, walletChoice } = useUserWalletStore();
  const connectedAccount = useConnectedAccount();
  const [connectingWallet, setConnectingWallet] = useState<ChooseWalletOptions>(
    {},
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    // Must indicate that the modal has been closed.
    // TODO: ensure this works for all options, including gnosis.
    // If the modals do not open after connecting with gnosis,
    // this approach has to be refactored with more reliability.
    setShowChooseWalletModal(false);
  }, [isLoggedIn]);

  const connectWalletInternal = (walletOptions: ChooseWalletOptions) => {
    setConnectingWallet(walletOptions);
    if (walletOptions.method === "gnosis") {
      connectWalletWrapper(walletOptions.method);
    }
  };

  const onLoginAction = (wallet: ChooseWalletOptions) => {
    connectWalletInternal(wallet);
  };

  const onMouseDownInternal = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    wallet: ChooseWalletOptions,
  ) => {
    if (e.button === 0) {
      onLoginAction(wallet);
    }
  };

  const onKeyDownInternal = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    wallet: ChooseWalletOptions,
  ) => {
    if (e.code === "Space" || e.code === "Enter") onLoginAction(wallet);
  };

  useEffect(() => {
    setIsConnecting(userStoreInitialising);
  }, [userStoreInitialising, connectedAccount, walletChoice]);

  const twoPanelModal = !isMobile;
  const isWithinGnosis = isWithinGnosisApp();

  return (
    <div
      className={classNames("uk-grid uk-grid-collapse", classes.modalWrapper, {
        "uk-child-width-1-2 uk-grid-collapse": twoPanelModal,
      })}
    >
      <Fragment>
        <div
          className={classNames(classes.leftHandBox, {
            [classes.desktop]: !isMobile && !isWithinGnosis,
          })}
        >
          {(!isMobile || showHeader) && (
            <div
              className={classNames(
                "uk-padding-small uk-padding-remove-bottom",
              )}
            >
              <div
                className={classNames(
                  "uk-h4 uk-margin-small-bottom",
                  classes.title,
                )}
              >
                login to handle.fi
              </div>
            </div>
          )}

          <div
            data-uk-grid
            className={classNames("uk-grid-small uk-child-width-1-1", {
              "uk-height-1-1": isWithinGnosis,
            })}
          >
            {isWithinGnosis && (
              <div className=" uk-flex uk-flex-1 uk-flex-middle uk-margin-medium-bottom">
                <ChooseWalletButton
                  wallet={{ method: "gnosis" }}
                  isConnecting={isConnecting}
                  connectingWallet={connectingWallet}
                  onMouseDown={onMouseDownInternal}
                  onKeyDown={onKeyDownInternal}
                  primaryColor={primaryColor}
                >
                  <img
                    width="20"
                    height="20"
                    src="/assets/images/wallets/gnosis_safe_logo_green.png"
                    alt="gnosis safe"
                  />
                  <h5 className="uk-margin-remove">login with gnosis safe</h5>
                </ChooseWalletButton>
              </div>
            )}

            {!isWithinGnosis && <DynamicEmbeddedWidget />}
          </div>
        </div>

        {!isMobile && (
          <div
            className={classNames(
              "uk-flex uk-flex-column uk-padding-small",
              classes.rightHandBox,
            )}
          >
            <h4
              className={classNames("uk-margin-remove-bottom", classes.textBox)}
            >
              the global defi FX protocol
            </h4>
            <div className={classes.imageBox}>
              <img
                src="/assets/images/other/multiDeviceMockUp.png"
                alt="multi-device mockup"
              />
            </div>
            <div className={classes.textBox}>
              trade, convert or borrow multi-currency stablecoins backed by
              ethereum and more.
            </div>
          </div>
        )}
      </Fragment>
    </div>
  );
};

const ChooseWalletButton: FC<{
  wallet: ChooseWalletOptions;
  isConnecting: boolean;
  connectingWallet: ChooseWalletOptions;
  onMouseDown: (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    wallet: ChooseWalletOptions,
  ) => void;
  onKeyDown: (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    wallet: ChooseWalletOptions,
  ) => void;
  primaryColor: string;
  disabled?: boolean;
}> = ({
  wallet,
  isConnecting,
  connectingWallet,
  onMouseDown,
  onKeyDown,
  children,
  primaryColor,
  disabled,
}) => (
  <Button
    type="secondary"
    onMouseDown={e => onMouseDown(e, wallet)}
    onKeyDown={e => onKeyDown(e, wallet)}
    expand={true}
    className={classNames(classes.choiceButton, {
      [classes.active]: isConnecting && !!connectingWallet.method,
      [classes.gnosisButton]: wallet.method === "gnosis",
    })}
    disabled={disabled || (isConnecting && !!connectingWallet.method)}
  >
    {isConnecting && connectingWallet.method === wallet.method && (
      <Loader color={primaryColor} />
    )}
    {(!isConnecting || connectingWallet.method !== wallet.method) && (
      <>{children}</>
    )}
  </Button>
);

const MagicEmailSent: FC<{
  email: string;
  isMobile: boolean;
  back: () => void;
}> = ({ email, isMobile, back }) => {
  return (
    <Fragment>
      {!isMobile && (
        <div className={classNames("uk-h4", classes.title)}>
          login with email
        </div>
      )}

      <p className={classNames({ "uk-margin-small-top": !isMobile })}>
        an email has been sent to {email} with login instructions. please keep
        this window open.
      </p>
      <Button className="uk-margin-small-top" onClick={back} expand={true}>
        wrong email?
      </Button>
    </Fragment>
  );
};
