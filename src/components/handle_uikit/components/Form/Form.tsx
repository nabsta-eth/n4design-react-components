import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { FormProps } from "../../types";
const classNames = _classNames;

export class Form extends React.Component<FormProps, any> {
  render() {
    return (
      <div
        id={this.props.id}
        style={this.props.style}
        className={this.setClassNames()}
        data-uk-form-custom={this.props.custom ? "" : null}
      >
        {this.props.children}
      </div>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
