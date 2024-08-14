import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { LightboxItemProps } from "../../types";

export function LightboxItem(props: LightboxItemProps) {
  return (
    <a
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={setClassNames(props)}
      href={props.href}
      data-caption={props.caption}
    >
      {props.children}
    </a>
  );
}

export default LightboxItem;
