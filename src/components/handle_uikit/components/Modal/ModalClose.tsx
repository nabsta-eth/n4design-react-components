import classNames from "classnames";
import FontAwesomeIcon from "../../../FontAwesomeIcon";
import { Button } from "../Button";
import classes from "./ModalClose.module.scss";
import { ModalProps } from "../../types";

type Props = Omit<
  ModalProps,
  | "id"
  | "title"
  | "show"
  | "titleClass"
  | "closeButton"
  | "scroll"
  | "escClose"
  | "backgroundClose"
  | "stack"
  | "closeSelectors"
  | "children"
>;

export function ModalClose(props: Props) {
  return (
    <Button
      type="default"
      className={classNames(
        classes.close,
        props.className,
        "uk-button-no-hover",
        {
          "uk-modal-close-full uk-close-large": props.full,
          "uk-modal-close-default": !props.full,
        },
      )}
      onClick={props.onClose}
      noBorder={true}
    >
      <FontAwesomeIcon icon={["fal", "times"]} />
    </Button>
  );
}
