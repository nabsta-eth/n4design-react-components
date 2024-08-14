import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
const classNames = _classNames;

export class FormLabel extends React.Component<
  React.HTMLProps<HTMLLabelElement>,
  any
> {
  render() {
    return (
      <label
        id={this.props.id}
        style={this.props.style}
        className={this.setClassNames()}
        htmlFor={this.props.htmlFor}
      >
        {this.props.children}
      </label>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-form-label`]: true,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
