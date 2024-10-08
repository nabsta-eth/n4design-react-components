import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { PanelProps } from "../../types";

export function Panel(props: PanelProps) {
  const _setClassNames = (): string => {
    return _classNames("uk-panel", {
      [`uk-panel-scrollable`]: props.isScrollable,
      [setClassNames(props)]: true,
    });
  };

  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={_setClassNames()}
    >
      {props.children}
    </div>
  );
}

export default Panel;
