import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { FormSelectProps } from "../../types";
const classNames = _classNames;

export class Select extends React.Component<FormSelectProps, any> {
  render() {
    return (
      <select
        id={this.props.id}
        placeholder={this.props.placeholder}
        style={this.props.style}
        className={this.setClassNames()}
        value={this.props.value}
        onChange={this.props.onChange}
      >
        {this.props.children}
      </select>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-select`]: true,
      [`uk-form-${this.props.color}`]: !!this.props.color,
      [`uk-form-${this.props.width}`]: !!this.props.width,
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
