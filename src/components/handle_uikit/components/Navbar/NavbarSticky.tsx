import { useEffect } from "react";
import { setClassNames } from "../../utils/set-class-names";
import UIkit from "uikit";
import { NavbarStickyProps } from "../../types";

export function NavbarSticky(props: NavbarStickyProps) {
  useEffect(() => {
    if (props.onActive) {
      UIkit.util.on(props.id, "active", props.onActive);
    }
    if (props.onInactive) {
      UIkit.util.on(props.id, "active", props.onInactive);
    }
  }, [props.id, props.onActive, props.onInactive]);

  return (
    <div
      id={props.id}
      style={props.style ? props.style : undefined}
      className={`${setClassNames(props)}`}
      data-uk-sticky={`
        sel-target: .uk-navbar-container;
        cls-active: uk-navbar-sticky;
        ${props.options ? props.options : ""}
      `}
    >
      {props.children}
    </div>
  );
}
