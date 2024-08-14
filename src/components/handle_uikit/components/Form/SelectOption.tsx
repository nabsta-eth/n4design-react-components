import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";

export class SelectOption extends React.Component<
  React.HTMLProps<HTMLOptionElement>,
  any
> {
  render() {
    return (
      <option
        id={this.props.id}
        style={this.props.style}
        className={`${setClassNames(this.props)}`}
        value={this.props.value}
      >
        {this.props.children}
      </option>
    );
  }
}
