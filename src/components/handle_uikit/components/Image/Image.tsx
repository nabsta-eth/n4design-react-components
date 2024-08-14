import { ImageProps } from "../../types";

export function Image(props: ImageProps) {
  return (
    <img
      id={props.id ? props.id : ""}
      alt={props.alt ? props.alt : "image"}
      className={props.className}
      width={props.width}
      height={props.height}
      style={props.style ? props.style : undefined}
      data-src={props.src}
      data-uk-img={props.options ? props.options : ""}
      onLoad={props.onLoad}
    />
  );
}
