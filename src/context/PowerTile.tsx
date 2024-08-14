import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { WALLET_DROPDOWN_ID } from "../config";
import UIkit from "uikit";

export type PowerTileValue = {
  isPowerTileOpen: boolean;
  setIsPowerTileOpen: Dispatch<SetStateAction<boolean>>;
  onClickWalletButton: () => void;
};

export const PowerTileContext = createContext<PowerTileValue | null>(null);

export const PowerTileProvider: FC = props => {
  const [isPowerTileOpen, setIsPowerTileOpen] = useState(false);
  const onClickWalletButton = () => {
    setIsPowerTileOpen(true);
  };

  UIkit.util.on(`#${WALLET_DROPDOWN_ID}`, "show", () => {
    setIsPowerTileOpen(true);
  });

  UIkit.util.on(`#${WALLET_DROPDOWN_ID}`, "hide", () => {
    setIsPowerTileOpen(false);
  });

  const value = useMemo(
    (): PowerTileValue => ({
      isPowerTileOpen,
      setIsPowerTileOpen,
      onClickWalletButton,
    }),
    [isPowerTileOpen],
  );
  return (
    <PowerTileContext.Provider value={value}>
      {props.children}
    </PowerTileContext.Provider>
  );
};

export const usePowerTileStore = () => {
  const context = useContext(PowerTileContext);
  if (!context) {
    throw new Error(
      "usePowerTileStore must be used within a PowerTileProvider",
    );
  }
  return context;
};
