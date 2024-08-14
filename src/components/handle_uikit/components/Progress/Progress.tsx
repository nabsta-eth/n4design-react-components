import React, { useState } from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { ProgressProps } from "../../types";

export function Progress(props: ProgressProps) {
  const [state, setState] = useState({ value: props.value });

  const _setClassNames = (): string => {
    return _classNames("uk-progress", {
      [`${setClassNames(props)}`]: true,
    });
  };

  return (
    <progress
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${_setClassNames()}`}
      value={state.value}
      max={props.max}
    />
  );
}

export default Progress;
