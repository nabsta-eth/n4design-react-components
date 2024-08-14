import _classNames from "classnames";
const classNames = _classNames;

export function setClassNames(props: any) {
  const isClassNameSet = !!props.className;
  const isHeightSet = !!props.height;
  const isWidthSet = !!props.width;
  const isAlignSet = !!props.align;
  const isTextAlignSet = !!props.textAlign;
  const isBackgroundSet = !!props.background;
  const isPositionSet = !!props.position;
  return classNames({
    [`${props.className}`]: isClassNameSet,
    [`uk-align-${props.align}`]: isAlignSet,
    [`uk-text-${props.textAlign}`]: isTextAlignSet,
    [`uk-height-${props.height}`]: isHeightSet,
    [`uk-width-${props.width}`]: isWidthSet,
    [`uk-background-${props.background}`]: isBackgroundSet,
    [`uk-position-${props.position}`]: isPositionSet,
  });
}
