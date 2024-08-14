import { PulseLoader } from "react-spinners";
import { CSSProperties } from "react";

type Props = React.BaseHTMLAttributes<HTMLDivElement> & {
  size?: number;
  color: string;
};

const overrides: CSSProperties = {
  display: "inline-flex",
};

const Loader = (props: Props) => {
  const { color, size, ...rest } = props;
  return (
    <PulseLoader
      color={color}
      // TODO
      // color={color || getThemeFile(activeTheme).primaryColor}
      size={`${size ? size : 8}px`}
      cssOverride={overrides}
      {...rest}
    />
  );
};

export default Loader;
