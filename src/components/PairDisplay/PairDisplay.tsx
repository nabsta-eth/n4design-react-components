import classNames from "classnames";
import { CSSProperties } from "react";
import classes from "./PairDisplay.module.scss";
import { Instrument } from "handle-sdk/dist/components/trade";
import { SpritesheetIcon } from "../SpritesheetIcon/SpritesheetIcon";

type DisplayPair = {
  baseSymbol: string;
  quoteSymbol: string;
};

export type PairDisplayProps = {
  pair: DisplayPair;
  noAssets?: boolean;
  noIcons?: boolean;
  className?: string;
  style?: CSSProperties;
  size?: "1.5x" | "2x" | "3x" | string;
  assetsFontSize?: number;
  isPosition?: boolean;
  firstAssetStyle?: CSSProperties;
  slashStyle?: CSSProperties;
  secondAssetStyle?: CSSProperties;
  tooltip?: string;
  tabIndex?: number;
  instrument: Instrument;
  onLoadBaseSymbolLogo?: () => void;
  onLoadQuoteSymbolLogo?: () => void;
};

const DEFAULT_PAIR_ICON_SIZE = 26;
const QUOTE_ICON_SCALE_FACTOR = 0.7;

const PairDisplay = (props: PairDisplayProps) => {
  let classNameSuffix = "";
  if (props.size) {
    if (props.size === "1.5x") {
      classNameSuffix = "1Halfx";
    } else {
      classNameSuffix = props.size;
    }
  }

  const showQuoteIcon =
    props.pair.quoteSymbol && !props.instrument?.hideQuoteSymbolLogo;
  const showQuoteSymbol =
    props.pair.quoteSymbol && !props.instrument?.hideQuoteSymbol;

  const isUsdBase = props.pair.baseSymbol === "USD";
  const fontSizeFactor = 0.8;
  const quoteFontSizeFactor = isUsdBase ? 1 : fontSizeFactor;
  const quoteFontSize = props.assetsFontSize
    ? props.assetsFontSize * quoteFontSizeFactor
    : undefined;
  const baseFontSizeFactor = isUsdBase ? fontSizeFactor : 1;
  const baseFontSize = props.assetsFontSize
    ? props.assetsFontSize * baseFontSizeFactor
    : undefined;
  const usdOpacityFactor = 0.675;

  const slashFontSize = () => {
    if (quoteFontSize && baseFontSize)
      return quoteFontSize < baseFontSize ? quoteFontSize : baseFontSize;
  };

  const baseIconSize =
    !!props.size && !isNaN(+props.size) ? +props.size : DEFAULT_PAIR_ICON_SIZE;
  const quoteIconSize = baseIconSize * QUOTE_ICON_SCALE_FACTOR;
  const yAxisTranslatePx = (baseIconSize - quoteIconSize) / 5;

  return (
    <div
      className={classNames(
        "uk-flex uk-position-relative",
        classes.pairWrapper,
        classes[`pair${classNameSuffix}`],
        {
          "uk-flex-bottom": props.noIcons,
          [classes.position]: props.isPosition,
          "uk-flex-middle":
            !props.noIcons && !props.className?.includes("uk-flex-top"),
        },
        props.className,
      )}
      style={props.style}
      uk-tooltip={props.tooltip}
      tabIndex={props.tabIndex}
    >
      {!props.noIcons && (
        <div
          style={{ width: baseIconSize * 1.4 }}
          className={classNames(classes.icons, "uk-flex uk-flex-middle", {
            [classes.reverse]: isUsdBase,
          })}
        >
          <div
            className={classNames(classes.baseToken, classes.instrumentSymbol)}
          >
            <SpritesheetIcon
              sizePx={baseIconSize}
              iconName={props.pair.baseSymbol}
              onLoad={props.onLoadBaseSymbolLogo}
              className={classNames("uk-position-relative", classes.firstIcon, {
                [classes.isUsd]: isUsdBase,
                [classes.noQuoteIcon]: !showQuoteSymbol,
              })}
            />
          </div>

          {showQuoteIcon && (
            <div className={classes.quoteToken}>
              <SpritesheetIcon
                sizePx={quoteIconSize}
                wrapperStyle={{
                  transform: `translate(-32px, ${yAxisTranslatePx}px)`,
                }}
                iconName={props.pair.quoteSymbol}
                onLoad={props.onLoadQuoteSymbolLogo}
                className={classNames(
                  "uk-position-relative",
                  classes.secondIcon,
                  {
                    [classes.isUsd]: !isUsdBase,
                  },
                )}
              />
            </div>
          )}
        </div>
      )}

      {!props.noAssets && (
        <div
          className={classNames(classes[`assets${classNameSuffix}`], {
            [classes.reverse]: isUsdBase,
          })}
        >
          <span
            className={classNames({
              [classes.isUsd]: isUsdBase,
            })}
            style={
              baseFontSize
                ? {
                    fontSize: baseFontSize,
                    opacity: isUsdBase ? usdOpacityFactor : 1,
                    ...props.firstAssetStyle,
                  }
                : { ...props.firstAssetStyle }
            }
          >
            {props.pair.baseSymbol}
          </span>

          {showQuoteSymbol && (
            <>
              <span
                style={{
                  fontSize: slashFontSize(),
                  opacity: usdOpacityFactor,
                  ...props.slashStyle,
                }}
              >
                /
              </span>

              <span
                className={classNames(classes.secondAsset, {
                  [classes.isUsd]: !isUsdBase,
                })}
                style={
                  quoteFontSize
                    ? {
                        fontSize: quoteFontSize,
                        opacity: isUsdBase ? 1 : usdOpacityFactor,
                        ...props.secondAssetStyle,
                      }
                    : { ...props.secondAssetStyle }
                }
              >
                {props.pair.quoteSymbol}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PairDisplay;
