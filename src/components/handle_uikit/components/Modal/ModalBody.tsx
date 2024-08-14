import { ModalProps } from "../../types";

type Props = Omit<
  ModalProps,
  | "id"
  | "show"
  | "onClose"
  | "closeButton"
  | "full"
  | "scroll"
  | "escClose"
  | "backgroundClose"
  | "stack"
  | "closeSelectors"
>;

export function ModalBody(props: Props) {
  return (
    <div className="uk-modal-dialog uk-animation-slide-top-small uk-modal-body uk-margin-auto-vertical uk-padding-small">
      <div
        className={`${
          props.titleClass ? "uk-" + props.titleClass : "uk-h4"
        } uk-margin-small-bottom`}
      >
        {props.title}
      </div>
      {props.children}
    </div>
  );
}
