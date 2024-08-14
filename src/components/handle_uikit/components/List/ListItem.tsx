import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function ListItem(props: BaseContainerProps) {
  return (
    <li
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={setClassNames(props)}
    >
      {props.children}
    </li>
  );
}
