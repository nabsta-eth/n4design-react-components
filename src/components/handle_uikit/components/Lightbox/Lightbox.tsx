import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { LightboxProps } from "../../types";

export function Lightbox(props: LightboxProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={setClassNames(props)}
      data-uk-lightbox={props.options ? props.options : ""}
    >
      {props.children}
    </div>
  );
}

export default Lightbox;
