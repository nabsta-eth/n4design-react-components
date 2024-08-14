import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { SectionProps } from "../../types";

export function Section(props: SectionProps) {
  const _setClassNames = (): string => {
    return _classNames({
      [`uk-section`]: props.padding,
      [`uk-section-${props.color}`]: !!props.color,
      [`uk-section-${props.size}`]: !!props.size,
      [`uk-preserve-color`]: props.preserveColor,
      [setClassNames(props)]: true,
      [`uk-position-${props.position}`]: !!props.position,
    });
  };
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${_setClassNames()}`}
    >
      {props.children}
    </div>
  );
}

export default Section;
