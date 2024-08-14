import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function CardHeader(props: BaseContainerProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-card-header ${setClassNames(props)}`}
    >
      {props.children}
    </div>
  );
}

export default CardHeader;
