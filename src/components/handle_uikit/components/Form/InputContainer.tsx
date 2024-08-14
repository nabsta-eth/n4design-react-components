import React from "react";
import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { BaseContainerProps } from "../../types";
const classNames = _classNames;

export class InputContainer extends React.Component<BaseContainerProps, any> {
  render() {
    return (
      <div
        id={this.props.id}
        style={this.props.style}
        className={`uk-form-controls ${setClassNames(this.props)}`}
      >
        {this.props.children}
      </div>
    );
  }
}
