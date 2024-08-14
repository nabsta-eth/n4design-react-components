import "./modal.scss";
import classNames from "classnames";
import { ModalClose } from "./ModalClose";
import { CSSProperties, createRef, useEffect } from "react";
import { useOpenModals } from "../../context/OpenModals";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import {
  deactivateAllElementsBehindModal,
  reactivateAllElementsBehindModal,
} from "../../utils/ui";

type Props = {
  show: boolean;
  width?: number;
  onClose: () => void;
  title?: string | React.ReactNode;
  children?: any;
  classes?: string;
  style?: CSSProperties;
  modalClasses?: string;
  isChooseWalletModal?: boolean;
  showChooseWalletModal: boolean;
  closeClasses?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  animation?: string;
  closeIcon?: IconName;
};

const Modal = ({
  show,
  onClose,
  width,
  title,
  children,
  classes,
  style,
  modalClasses,
  isChooseWalletModal,
  showChooseWalletModal,
  closeClasses,
  onKeyDown,
  animation,
  closeIcon,
}: Props) => {
  const { pushCloseModal } = useOpenModals();
  const chooseWalletModalIsOpenAndIsNotChooseWalletModal =
    showChooseWalletModal && !isChooseWalletModal;

  useEffect(() => {
    if (!show) {
      return;
    }
    if (modalRef?.current) {
      deactivateAllElementsBehindModal();
      modalRef?.current.focus();
    }
    pushCloseModal(onClose);
  }, [show]);

  const onKeyDownInternal = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
    onKeyDown?.(e);
  };

  const onCloseInternal = () => {
    reactivateAllElementsBehindModal();
    onClose();
  };

  const modalClass = animation === "none" ? "uk-modal-override" : "uk-modal";
  const modalDialogClass =
    animation === "none" ? "uk-modal-dialog-override" : "uk-modal-dialog";
  const animationClass = `uk-animation-${animation ?? "slide-top-small"}`;
  const modalRef = createRef<HTMLDivElement>();

  return (
    <div
      className={classNames(modalClass, classes, {
        show: show && !chooseWalletModalIsOpenAndIsNotChooseWalletModal,
      })}
      style={style}
      tabIndex={-1}
      onKeyDown={onKeyDownInternal}
      ref={modalRef}
    >
      <div
        className="
        uk-flex
        uk-width-expand
        uk-height-1-1
        uk-flex-center
        uk-flex-middle"
      >
        <div
          className={classNames(
            modalDialogClass,
            "uk-position-fixed",
            "uk-padding-small",
            modalClasses,
            {
              [animationClass]: animation !== "none",
            },
          )}
          style={{ width: width ? `${width}px` : "" }}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-modal="true"
        >
          <ModalClose
            className={closeClasses}
            onClose={onCloseInternal}
            icon={closeIcon}
          />
          {title && (
            <h4 className="uk-h4 uk-margin-remove-top uk-margin-small-bottom">
              {title}
            </h4>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
