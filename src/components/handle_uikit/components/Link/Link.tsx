import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { LinkProps } from "../../types";

export function Link(props: LinkProps) {
  const _setClassNames = (): string => {
    return _classNames({
      [`uk-link-${props.type}`]: !!props.type,
      [`${setClassNames(props)}`]: true,
    });
  };

  return (
    <a
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      data-uk-toggle={props.toggleOptions ? props.toggleOptions : null}
      href={props.href}
      tabIndex={0}
      target={props.target || undefined}
      className={`hfi-link ${_setClassNames()}`}
      data-uk-tooltip={
        props.tooltip
          ? `title: ${props.tooltip.text}; pos: ${props.tooltip.position};`
          : undefined
      }
      onClick={props.onClick || undefined}
    >
      {props.children}
    </a>
  );
}
