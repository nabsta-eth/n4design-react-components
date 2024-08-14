import classNames from "classnames";
import classes from "./ModalClose.module.scss";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { ModalProps } from "../handle_uikit/types";
import { Button } from "../handle_uikit/components/Button";
import FontAwesomeIcon from "../FontAwesomeIcon";

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
> & {
  icon?: IconName;
};

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
      <FontAwesomeIcon icon={["fal", props.icon ?? "times"]} />
    </Button>
  );
}
