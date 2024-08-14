import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { TableHeadProps } from "../../types";

export function TableHead(props: TableHeadProps) {
  return (
    <thead
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-table-header ${setClassNames(props)}`}
    >
      {props.children}
    </thead>
  );
}

export default TableHead;
