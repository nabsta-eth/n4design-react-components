import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { FormInputProps } from "../../types";
const classNames = _classNames;

export class Range extends React.Component<FormInputProps, any> {
  render() {
    return (
      <input
        id={this.props.id}
        placeholder={this.props.placeholder}
        style={this.props.style}
        className={this.setClassNames()}
        type="range"
        name={this.props.name}
        value={this.props.value}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      />
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-range`]: true,
      [`uk-form-${this.props.color}`]: !!this.props.color,
      [`uk-form-${this.props.width}`]: !!this.props.width,
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
