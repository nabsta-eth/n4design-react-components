import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function CardTitle(props: BaseContainerProps) {
  return (
    <h3
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-card-title ${setClassNames(props)}`}
    >
      {props.children}
    </h3>
  );
}

export default CardTitle;
