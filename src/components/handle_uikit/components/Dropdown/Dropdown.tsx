import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { DropdownProps } from "../../types";

export function Dropdown(props: DropdownProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      className={`${setClassNames(props)}`}
      uk-dropdown={props.options ? props.options : ""}
      onKeyDown={props.onKeyDown}
      style={props.style ? props.style : {}}
    >
      {props.children}
    </div>
  );
}

export default Dropdown;
