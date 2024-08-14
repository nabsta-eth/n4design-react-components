import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { NavItemProps } from "../../types";

export function NavItem(props: NavItemProps) {
  const _setClassNames = (): string => {
    return _classNames({
      [`uk-nav-${props.type}`]: !!props.type,
      [`uk-parent`]: props.parent,
      [`${setClassNames(props)}`]: true,
    });
  };

  return (
    <li
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${_setClassNames()}`}
    >
      {props.children}
    </li>
  );
}

export default NavItem;
