import * as React from "react";
import classes from "./ChooseWalletModal.module.scss";
import classNames from "classnames";
import ChooseWalletWrapper from "../ChooseWalletWrapper/ChooseWalletWrapper";
import Modal from "../Modal";
import { useConnectedAccount } from "../../context/UserWallet";

type Props = {
  showChooseWalletModal: boolean;
  setShowChooseWalletModal: (value: boolean) => void;
  isMobile: boolean;
  primaryColor: string;
  showHeader?: boolean;
};

const ChooseWalletModal: React.FC<Props> = ({
  showChooseWalletModal,
  setShowChooseWalletModal,
  isMobile,
  primaryColor,
  showHeader,
}: Props) => {
  const connectedAccount = useConnectedAccount();

  const onCloseInternal = () => {
    setShowChooseWalletModal(false);
  };

  return (
    <Modal
      show={!connectedAccount && showChooseWalletModal}
      isChooseWalletModal={true}
      showChooseWalletModal={showChooseWalletModal}
      classes={classNames(classes.maxWidth, {
        [classes.fullHeight]: isMobile,
      })}
      width={800}
      onClose={onCloseInternal}
      style={isMobile ? { height: "var(--true-viewport-height)" } : undefined}
      modalClasses={classNames(classes.modal, "uk-padding-remove")}
      closeClasses={classNames(classes.modalClose)}
    >
      <ChooseWalletWrapper
        isMobile={isMobile}
        showHeader={showHeader}
        setShowChooseWalletModal={setShowChooseWalletModal}
        primaryColor={primaryColor}
      />
    </Modal>
  );
};

export default ChooseWalletModal;
