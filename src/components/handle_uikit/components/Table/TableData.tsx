import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { TableDataProps } from "../../types";

export function TableData(props: TableDataProps) {
  const _setClassNames = (): string => {
    if (props.shrink && props.expand) {
      console.error("Please use only one width modfier on table components");
    } else if (props.expand && props.width) {
      console.error("Please use only one width modfier on table components");
    } else if (props.shrink && props.width) {
      console.error("Please use only one width modfier on table components");
    } else {
      const isWidth = props.width ? true : false;
      return _classNames({
        [`uk-table-expand`]: props.expand,
        [`uk-table-shrink`]: props.shrink,
        [`uk-table-${props.width}`]: isWidth,
        [`${setClassNames(props)}`]: true,
      });
    }
    return "";
  };

  return (
    <td
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={_setClassNames()}
      colSpan={props.colSpan}
      data-label={props.label}
    >
      {props.children}
    </td>
  );
}

export default TableData;
