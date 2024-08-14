import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { BaseProps } from "../../types";
const classNames = _classNames;

export class Fieldset extends React.Component<BaseProps, any> {
  render() {
    return (
      <fieldset
        id={this.props.id}
        style={this.props.style}
        className={this.setClassNames()}
      >
        {this.props.children}
      </fieldset>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-fieldset`]: true,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
