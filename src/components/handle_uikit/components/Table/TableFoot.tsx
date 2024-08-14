import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function TableFoot(props: BaseContainerProps) {
  return (
    <tfoot
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${setClassNames(props)}`}
    >
      {props.children}
    </tfoot>
  );
}

export default TableFoot;
