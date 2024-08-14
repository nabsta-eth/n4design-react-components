import { setClassNames } from "../../utils/set-class-names";
import { TableTitleProps } from "../../types";

export function TableTitle(props: TableTitleProps) {
  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`uk-table-title ${setClassNames(props)}`}
    >
      {props.children}
    </div>
  );
}

export default TableTitle;
