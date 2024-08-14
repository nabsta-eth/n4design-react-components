import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { BreadcrumbProps } from "../../types";

export function Breadcrumb(props: BreadcrumbProps) {
  return (
    <ul
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-breadcrumb ${setClassNames(props)}`}
    >
      {props.children}
    </ul>
  );
}

// export class Breadcrumb extends React.Component<BreadcrumbProps, any> {
//   render() {
//     return (
//       <ul
//         id={this.props.id ? this.props.id : null}
//         style={this.props.style}
//         className={`uk-breadcrumb ${setClassNames(this.props)}`}
//       >
//         {this.props.children}
//       </ul>
//     )
//   }
// }

export default Breadcrumb;
