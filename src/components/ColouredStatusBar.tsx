import classNames from "classnames";
import classes from "./ColouredStatusBar.module.scss";
import { calculateIntermediateColour } from "../utils/statusBar";
import { clamp } from "../utils/general";

type CSSModuleClasses = { readonly [key: string]: string };

type Props = {
  id: string;
  outerBarClasses?: string;
  innerBarClasses?: string;
  // from 0 to 1
  valueFraction: number;
  tooltip?: string;
  themeFile: CSSModuleClasses;
};

const ColouredStatusBar: React.FC<Props> = ({
  id,
  outerBarClasses,
  innerBarClasses,
  valueFraction,
  tooltip,
  themeFile,
}) => {
  const barWidth = `${valueFraction * 100}%`;
  const barColour = calculateBarColour(valueFraction, themeFile);

  return (
    <span
      id={id}
      className={classNames(classes.outerBar, outerBarClasses)}
      uk-tooltip={tooltip}
    >
      <span
        style={{
          width: barWidth,
          backgroundColor: barColour,
        }}
        className={classNames(
          "uk-tooltip-content",
          classes.innerBar,
          innerBarClasses,
        )}
      />
    </span>
  );
};

const getColourSectionFraction = (valueFraction: number) => {
  if (valueFraction < 0.33)
    return {
      sector: 1,
      sectorFraction: clamp(valueFraction * 3, 0, 1),
    };
  if (valueFraction < 0.66)
    return {
      sector: 2,
      sectorFraction: clamp((valueFraction - 0.33) * 3, 0, 1),
    };
  return {
    sector: 3,
    sectorFraction: clamp((valueFraction - 0.67) * 3, 0, 1),
  };
};

const calculateBarColour = (
  valueFraction: number,
  themeFile: CSSModuleClasses,
) => {
  const { sector, sectorFraction } = getColourSectionFraction(valueFraction);
  const sectors: Record<number, { colourFrom: string; colourTo: string }> = {
    1: {
      colourFrom: themeFile.upColor,
      colourTo: themeFile.warningColor,
    },
    2: {
      colourFrom: themeFile.warningColor,
      colourTo: themeFile.orangeColor,
    },
    3: {
      colourFrom: themeFile.orangeColor,
      colourTo: themeFile.downColor,
    },
  };
  return calculateIntermediateColour({
    colourFrom: sectors[sector].colourFrom,
    colourTo: sectors[sector].colourTo,
    colourFraction: sectorFraction,
    hasHash: true,
  });
};

export default ColouredStatusBar;
