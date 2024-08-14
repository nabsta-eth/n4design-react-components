import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

type FontAwesomeIconProps = {
  icon: [IconPrefix, IconName];
  className?: string;
  style?: React.CSSProperties;
  size?: "xs" | "sm" | "lg" | "2x" | "3x" | "5x" | "7x" | "10x";
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const FontAwesomeIcon: React.FC<FontAwesomeIconProps> = props => {
  const { icon, className, style, size, onClick, ...rest } = props;
  const sizeClass = size ? `fa-${size}` : "";
  return (
    <span style={{ verticalAlign: "center" }} onClick={onClick}>
      <i
        className={classNames(
          className,
          sizeClass,
          props.icon[0],
          `fa-${props.icon[1]}`,
        )}
        style={props.style}
        {...rest}
      />
    </span>
  );
};

export default FontAwesomeIcon;
