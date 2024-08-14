type ColourRatioProps = {
  colourFrom: string;
  colourTo: string;
  colourFraction: number;
  hasHash?: boolean;
};

export const calculateIntermediateColour = ({
  colourFrom,
  colourTo,
  colourFraction,
  hasHash,
}: ColourRatioProps): string => {
  const colourFromToUse =
    colourFrom.startsWith("#") || hasHash
      ? colourFrom.replace("#", "")
      : colourFrom;
  const colourToToUse =
    colourFrom.startsWith("#") || hasHash
      ? colourTo.replace("#", "")
      : colourTo;

  const hexValueFromNumber = (colour: number) => {
    const colourString = colour.toString(16);
    return colourString.length === 1 ? `0${colourString}` : colourString;
  };

  const redColourCode = Math.ceil(
    parseInt(colourToToUse.substring(0, 2), 16) * colourFraction +
      parseInt(colourFromToUse.substring(0, 2), 16) * (1 - colourFraction),
  );
  const greenColourCode = Math.ceil(
    parseInt(colourToToUse.substring(2, 4), 16) * colourFraction +
      parseInt(colourFromToUse.substring(2, 4), 16) * (1 - colourFraction),
  );
  const blueColourCode = Math.ceil(
    parseInt(colourToToUse.substring(4, 6), 16) * colourFraction +
      parseInt(colourFromToUse.substring(4, 6), 16) * (1 - colourFraction),
  );

  return `${hasHash ? "#" : ""}${hexValueFromNumber(
    redColourCode,
  )}${hexValueFromNumber(greenColourCode)}${hexValueFromNumber(
    blueColourCode,
  )}`;
};
