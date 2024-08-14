import _classNames from "classnames";
import React, { ForwardedRef } from "react";
import { setClassNames } from "../../utils/set-class-names";
import { GridProps } from "../../types";

export const Grid = React.forwardRef(
  (props: GridProps, ref: ForwardedRef<HTMLDivElement>) => {
    const _setClassNames = (): string => {
      return _classNames({
        [`uk-grid-${props.gutter}`]: !!props.gutter,
        [`uk-grid-divider`]: props.divider,
        [`uk-grid-match`]: props.match,
        [`${setClassNames(props)}`]: true,
      });
    };

    return (
      <div
        id={props.id}
        style={props.style}
        className={`${_setClassNames()}`}
        uk-grid={props.options ? props.options : ""}
        uk-sortable={props.sortable}
        ref={ref}
      >
        {props.children}
      </div>
    );
  },
);

export default Grid;
