import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { TableRowProps } from "../../types";

export function TableRow(props: TableRowProps) {
  return (
    <tr
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${setClassNames(props)}`}
      onClick={props.onClick ? props.onClick : undefined}
    >
      {props.children}
    </tr>
  );
}

export default TableRow;
