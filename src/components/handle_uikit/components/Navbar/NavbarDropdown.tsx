import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";

export function NavbarDropdown(props: BaseContainerProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-navbar-dropdown ${setClassNames(props)}`}
    >
      <ul className="uk-nav uk-navbar-dropdown-nav">{props.children}</ul>
    </div>
  );
}

export default NavbarDropdown;
