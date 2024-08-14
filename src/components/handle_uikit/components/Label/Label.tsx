import React from "react";
import _classNames from "classnames";
import { LabelProps } from "../../types";

export function Label(props: LabelProps) {
  const _setClassNames = (): string => {
    return _classNames("uk-label", {
      [`uk-label-${props.color}`]: !!props.color,
    });
  };

  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${_setClassNames()}`}
    >
      {props.content}
    </div>
  );
}

export default Label;
