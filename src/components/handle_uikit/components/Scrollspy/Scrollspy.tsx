import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { ScrollspyProps } from "../../types";

export function Scrollspy(props: ScrollspyProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${setClassNames(props)}`}
      data-uk-scrollspy={props.options ? props.options : ""}
    >
      {props.children}
    </div>
  );
}

export default Scrollspy;
