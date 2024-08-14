import { useContext, useMemo, useState } from "react";
import * as React from "react";
export type OpenModalsValue = {
  closeAll: () => void;
  pushCloseModal: (fn: () => void) => void;
};

export const OpenModalsContext = React.createContext<OpenModalsValue>({
  closeAll: () => {},
  pushCloseModal: () => {},
});

export const OpenModalsProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [closeFunctions, setCloseFunctions] = useState<(() => void)[]>([]);
  const value: OpenModalsValue = useMemo(
    () => ({
      closeAll: () => {
        closeFunctions.forEach(fn => fn());
        setCloseFunctions([]);
      },
      pushCloseModal: fn => {
        setCloseFunctions(fns => [...fns, fn]);
      },
    }),
    [closeFunctions],
  );
  return (
    <OpenModalsContext.Provider value={value}>
      {props.children}
    </OpenModalsContext.Provider>
  );
};

export const useOpenModals = (): OpenModalsValue =>
  useContext(OpenModalsContext);
