import styles from "./SpritesheetIcon.module.scss";
import pairDisplayStyles from "../PairDisplay/PairDisplay.module.scss";
import {
  SPRITESHEET_DIMENSION,
  useSpritesheet,
} from "../../context/SpritesheetProvider";
import { CSSProperties, ReactEventHandler, memo, useMemo } from "react";
import classNames from "classnames";
import { deepEquals } from "../../utils/general";

const didEmitWarningForIcon: Record<string, boolean | undefined> = {};
const SOLID_DISC_BACKGROUND_ICON_FONT_SIZE_SCALE_FACTOR = 0.42;

type Props = {
  sizePx: number;
  iconName: string;
  onLoad?: ReactEventHandler<HTMLDivElement>;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  className?: string;
  // URI of fallback icon to show instead of solid disc background
  // when icon is missing from the spritesheet set,
  // e.g. token placeholder image URI.
  fallbackSrc?: string;
};

export const SpritesheetIcon: React.FC<Props> = memo(props => {
  const {
    iconName,
    sizePx,
    onLoad,
    style,
    wrapperStyle,
    className,
    fallbackSrc,
    ...rest
  } = props;
  const { getSpritesheetIconStyle } = useSpritesheet();
  const iconStyle = useMemo(
    () => getSpritesheetIconStyle(iconName.toLowerCase()),
    [iconName, getSpritesheetIconStyle],
  );
  const iconSize = useMemo(() => sizePx ?? SPRITESHEET_DIMENSION, [sizePx]);
  const wrapperStyleInternal = useMemo((): CSSProperties => {
    return {
      transform: `scale(${iconSize / SPRITESHEET_DIMENSION}) ${
        wrapperStyle?.transform ?? ""
      }`,
      transformOrigin: "top left",
    };
  }, [iconSize, wrapperStyle]);
  const rootStyle = useMemo(
    (): CSSProperties => ({
      width: `${iconSize}px`,
      height: `${iconSize}px`,
      ...style,
    }),
    [iconSize, style],
  );

  if (!didEmitWarningForIcon[iconName]) {
    console.warn(`[SpritesheetIcon] missing icon for "${iconName}"`);
    didEmitWarningForIcon[iconName] = true;
  }

  // Show the fallback icon if specified or
  // default icon in case the logo is missing.
  if (!iconStyle) {
    if (fallbackSrc) {
      return (
        <div style={style} className={classNames(styles.iconRoot, className)}>
          <img
            className={styles.fallbackImg}
            width={iconSize}
            height={iconSize}
            src={fallbackSrc}
            alt={iconName}
            onLoad={onLoad}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          ...rootStyle,
          fontSize:
            iconSize * SOLID_DISC_BACKGROUND_ICON_FONT_SIZE_SCALE_FACTOR,
        }}
        className={pairDisplayStyles.instrumentSymbolBackground}
      >
        <span>{iconName}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...rootStyle,
      }}
      className={classNames(styles.iconRoot, className)}
    >
      <div
        style={{
          ...wrapperStyleInternal,
        }}
        className={styles.iconTransformer}
      >
        <div
          className={styles.icon}
          style={iconStyle}
          onLoad={onLoad}
          {...rest}
        ></div>
      </div>
    </div>
  );
}, deepEquals);
