import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { BaseProps } from "../../types";
const classNames = _classNames;

export class Legend extends React.Component<BaseProps, any> {
  render() {
    return (
      <legend
        id={this.props.id}
        style={this.props.style}
        className={this.setClassNames()}
      >
        {this.props.children}
      </legend>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-legend`]: true,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
