import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import _classNames from "classnames";
import { FormInputProps } from "../../types";
const classNames = _classNames;

export class Checkbox extends React.Component<FormInputProps, any> {
  render() {
    return (
      <input
        id={this.props.id}
        style={this.props.style ? this.props.style : { opacity: 1 }}
        className={this.setClassNames()}
        type="checkbox"
        name={this.props.name ? this.props.name : ""}
        checked={this.props.checked}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        uk-tooltip={this.props.tooltip}
        disabled={this.props.disabled}
      />
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-checkbox`]: true,
      [`uk-form-${this.props.color}`]: !!this.props.color,
      [`uk-form-${this.props.width}`]: !!this.props.width,
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
