import classNames from "classnames";
import { setClassNames } from "../../utils/set-class-names";
import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { ButtonProps } from "../../types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const isRouterLink = () => {
      return (!!props.to && !props.disabled) || props.noBorder;
    };
    const isLink = () => {
      return (!!props.href && !props.disabled) || props.noBorder;
    };
    const setClassNamesInternal = (): string => {
      return classNames(
        "uk-button",
        {
          [`uk-button-${props.type}`]: props.type !== "primary",
          [`uk-icon-button`]: !!props.icon,
          [`uk-button-${props.size}`]: !!props.size,
          [`uk-width-expand`]: !!props.expand,
          [`${setClassNames(props)}`]: true,
          [`hfi-${props.icon ? "icon-" : ""}error-button`]:
            !!props.alert || props.color === "error" || props.color === "red",
          [`hfi-${props.icon ? "icon-" : ""}warning-button`]:
            props.color === "warning" ||
            props.color === "alert" ||
            props.color === "yellow",
          [`hfi-${props.icon ? "icon-" : ""}orange-button`]:
            props.color === "orange",
          [`hfi-up-button`]: props.color === "up",
          [`hfi-down-button`]: props.color === "down",
          [`uk-active`]: !!props.active && !props.disabled,
          [`cursor-default`]: !!props.active,
        },
        props.className,
      );
    };

    const onClick = (e: React.MouseEvent<any>) => {
      e.preventDefault();

      if (props.onClick) {
        props.onClick(e);
      }
    };

    const tooltipParms = props.tooltip
      ? `title: ${props.tooltip.text}; pos: ${props.tooltip.position}; cls: uk-active ${props.tooltip.classes};`
      : props.presetTooltip;

    if (isRouterLink()) {
      return (
        <Link
          id={props.id ? props.id : ""}
          style={props.style ? props.style : undefined}
          data-uk-toggle={props.toggleOptions}
          to={props.to ?? "/"}
          onClick={onClick}
          className={setClassNamesInternal()}
          data-uk-tooltip={tooltipParms}
          tabIndex={0}
        >
          {props.children}
        </Link>
      );
    }

    if (isLink()) {
      return (
        <a
          id={props.id ? props.id : ""}
          style={props.style ? props.style : undefined}
          data-uk-toggle={props.toggleOptions}
          href={props.href}
          target={props.target ?? "_blank"}
          className={setClassNamesInternal()}
          data-uk-tooltip={tooltipParms}
          tabIndex={0}
        >
          {props.children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={props.submit ? "submit" : undefined}
        id={props.id ? props.id : ""}
        style={props.style ? props.style : undefined}
        data-uk-toggle={props.toggleOptions}
        disabled={props.disabled}
        onClick={onClick}
        onMouseDown={props.onMouseDown}
        onKeyDown={props.onKeyDown}
        className={setClassNamesInternal()}
        data-uk-tooltip={tooltipParms}
        tabIndex={props.active ? -1 : 0}
      >
        {props.children}
      </button>
    );
  },
);
