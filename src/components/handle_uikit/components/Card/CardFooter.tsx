import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function CardFooter(props: BaseContainerProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-card-footer ${setClassNames(props)}`}
    >
      {props.children}
    </div>
  );
}

export default CardFooter;
