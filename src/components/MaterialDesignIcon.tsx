import classNames from "classnames";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  icon: string;
};

// Refer to https://fonts.google.com/icons for a list of icons
// and details as to how they work and can be used.
const MaterialDesignIcon: React.FC<Props> = ({
  icon,
  children,
  className,
  ...rest
}) => {
  return (
    <span
      className={classNames("material-symbols-outlined", className)}
      {...rest}
    >
      {children}
      {icon}
    </span>
  );
};

export default MaterialDesignIcon;
