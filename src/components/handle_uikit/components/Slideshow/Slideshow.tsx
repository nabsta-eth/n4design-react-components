import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { SlideshowProps } from "../../types";

export function Slideshow(props: SlideshowProps) {
  const setNavigation = () => {
    if (props.navigation) {
      return (
        <div
          className={`uk-position-relative uk-visible-toggle ${setNavigationStyle()}`}
        >
          <ul className="uk-slideshow-items">{props.children}</ul>
          <a
            className="uk-position-center-left uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-previous=""
            uk-slideshow-item="previous"
          />
          <a
            className="uk-position-center-right uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-next=""
            uk-slideshow-item="next"
          />
        </div>
      );
    }
    return <ul className="uk-slideshow-items">{props.children}</ul>;
  };

  const setNavigationStyle = () => {
    if (props.navigation && props.navigationStyle) {
      return `uk-${props.navigationStyle}`;
    }

    return `uk-dark`;
  };

  return (
    <div
      id={props.id ? props.id : ""}
      style={props.style ? props.style : undefined}
      className={`${setClassNames(props)}`}
      data-uk-slideshow={props.options ? props.options : ""}
    >
      {setNavigation()}
    </div>
  );
}

export default Slideshow;
