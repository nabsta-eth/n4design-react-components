import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { FormTextareaProps } from "../../types";
const classNames = _classNames;

export class Textarea extends React.Component<FormTextareaProps, any> {
  render() {
    return (
      <textarea
        id={this.props.id}
        placeholder={this.props.placeholder}
        style={this.props.style}
        className={this.setClassNames()}
        name={this.props.name}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      >
        {this.props.children}
      </textarea>
    );
  }

  private setClassNames(): string {
    return classNames({
      [`uk-textarea`]: true,
      [`uk-form-${this.props.color}`]: !!this.props.color,
      [`uk-form-${this.props.width}`]: !!this.props.width,
      [`uk-form-${this.props.layout}`]: !!this.props.layout,
      [`${setClassNames(this.props)}`]: true,
    });
  }
}
