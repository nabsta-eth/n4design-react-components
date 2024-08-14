import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { FormInputProps } from "../../types";
const classNames = _classNames;

export class Radio extends React.Component<FormInputProps, any> {
  render() {
    return (
      <input
        id={this.props.id}
        placeholder={this.props.placeholder}
        style={this.props.style}
        className={this.setClassNames()}
        type="radio"
        name={this.props.name}
        checked={this.props.currentValue === this.props.value}
        value={this.props.value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      />
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-form-${this.props.color}`]: !!this.props.color,
      [`uk-form-${this.props.width}`]: !!this.props.width,
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
