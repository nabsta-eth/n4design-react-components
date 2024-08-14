import * as React from "react";
import { FunctionComponent } from "react";
import classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import ReactDOM from "react-dom";
import { ModalBody } from "./ModalBody";
import { ModalClose } from "./ModalClose";
import UIkit from "uikit";
import { ModalProps } from "../../types";

// @ts-ignore
export const Modal: FunctionComponent<ModalProps> = (props: ModalProps) => {
  const escClose = `escClose: ${props.escClose ? "true" : "false"}; `;
  const bgClose = `bgClose: ${props.backgroundClose ? "true" : "false"}; `;
  const stack = `stack: ${props.stack ? "true" : "false"}; `;

  const modalRoot = document.createElement("div");
  modalRoot.id = props.id;
  modalRoot.setAttribute("class", `${setClassNamesInternal(props)}`);
  modalRoot.setAttribute(
    "data-uk-modal",
    `
      ${escClose}
      ${bgClose}
      ${stack}
    `,
  );

  React.useEffect(() => {
    document.body.appendChild(modalRoot);
    return () => {
      document.body.removeChild(modalRoot);
    };
  });

  const { id, show } = props;

  React.useEffect(() => {
    const component = UIkit.modal(`#${id}`);
    if (show) {
      component.show();
    } else {
      component.hide();
    }
  }, [id, show]);

  return ReactDOM.createPortal(
    <React.Fragment>
      <ModalBody title={props.title}>
        {props.closeButton && <ModalClose onClose={props.onClose} />}
        {props.children}
      </ModalBody>
    </React.Fragment>,
    modalRoot,
  );
};

const setClassNamesInternal = (props: ModalProps): string => {
  return classNames("uk-modal", {
    "uk-modal-full": !!props.full,
    [`${setClassNames(props)}`]: true,
  });
};
