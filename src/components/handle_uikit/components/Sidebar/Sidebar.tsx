import _classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { SidebarProps } from "../../types";

export function Sidebar(props: SidebarProps) {
  const _setClassNames = (): string => {
    return _classNames({
      [`uk-overflow-auto`]: true,
      [`uk-${props.visibility}`]: !!props.visibility,
      [setClassNames(props)]: true,
    });
  };

  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={_setClassNames()}
    >
      {props.children}
    </div>
  );
}

export default Sidebar;
