import classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { CardProps } from "../../types";

export function Card(props: CardProps) {
  const _setClassNames = () => {
    return classNames("uk-card", {
      [`uk-card-default`]: !props.color,
      [`uk-card-${props.color}`]: !!props.color,
      [`uk-card-hover`]: props.hover,
      [`uk-card-${props.size}`]: !!props.size,
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

export default Card;
