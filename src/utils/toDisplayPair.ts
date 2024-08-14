import { pairFromString } from "handle-sdk/dist/utils/general";
import { TokenInfo } from "handle-sdk";
import { TOKEN_ICON_PLACEHOLDER_URL, USD_CURRENCY_LOGO_URI } from "../config";

export const formatDisplaySymbol = (symbol: string) => {
  if (symbol === "WETH") return "ETH";
  if (isPair(symbol)) {
    return pairFromString(symbol).baseSymbol;
  }
  return symbol;
};

/**
 * @returns whether the string can be parsed as a pair.
 */
export const isPair = (symbol: string) => {
  return symbol.split("/").length === 2;
};

export const getSymbolLogoUri = (symbol: string, token?: TokenInfo) => {
  if (symbol === "USD") {
    return USD_CURRENCY_LOGO_URI;
  }
  return token?.logoURI || TOKEN_ICON_PLACEHOLDER_URL;
};
