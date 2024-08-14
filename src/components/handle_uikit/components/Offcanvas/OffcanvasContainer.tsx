import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function OffcanvasContainer(props: BaseContainerProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-offcanvas-content ${setClassNames(props)}`}
    >
      {props.children}
    </div>
  );
}

export default OffcanvasContainer;
