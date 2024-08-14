import * as React from "react";
import { CSSProperties, useContext, useMemo, useCallback } from "react";
import z from "zod";
import usePromise from "../hooks/usePromise";
import axios from "axios";

const SPRITESHEET_BASE_URL =
  "https://handle.blr1.cdn.digitaloceanspaces.com/spritesheet";
const SPRITESHEET_ICONS_URL = `${SPRITESHEET_BASE_URL}/icons.json`;
export const SPRITESHEET_DIMENSION = 60;

const SpritesheetIconsSchema = z.object({
  hash: z.string(),
  icons: z.array(z.array(z.string())),
});

export type SpritesheetIcons = z.infer<typeof SpritesheetIconsSchema>;

export type Spritesheet = {
  getSpritesheetIconStyle: (iconName: string) => CSSProperties | undefined;
};

export type SpritesheetState = {
  metadata: SpritesheetIcons;
  spritesheetUrl: string;
};

export const SpritesheetContext = React.createContext<Spritesheet>({
  getSpritesheetIconStyle: (_iconName: string) => undefined,
});

export const SpritesheetProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [spritesheet] = usePromise(() => fetchSpritesheetState(), []);
  const getSpritesheetIconStyle = useCallback(
    (iconName: string): CSSProperties | undefined => {
      if (!spritesheet) {
        return undefined;
      }
      return getSpritesheetIconStyleInternal(spritesheet, iconName);
    },
    [spritesheet],
  );
  const value: Spritesheet = useMemo(
    () => ({
      getSpritesheetIconStyle,
    }),
    [getSpritesheetIconStyle],
  );
  return (
    <SpritesheetContext.Provider value={value}>
      {props.children}
    </SpritesheetContext.Provider>
  );
};

export const useSpritesheet = (): Spritesheet => useContext(SpritesheetContext);

const fetchSpritesheetState = async (): Promise<SpritesheetState> => {
  const response = await axios.get(SPRITESHEET_ICONS_URL);
  const icons = SpritesheetIconsSchema.parse(response.data);
  const spritesheetUrl = getSpritesheetImageUrl(icons.hash);
  return {
    metadata: icons,
    spritesheetUrl,
  };
};

const getSpritesheetImageUrl = (hash: string): string =>
  `${SPRITESHEET_BASE_URL}/sheets/spritesheet-${hash}.png`;

const getSpritesheetIconStyleInternal = (
  state: SpritesheetState,
  iconName: string,
): CSSProperties | undefined => {
  const indices = state.metadata.icons
    .map((row, i) => {
      const j = row.findIndex(icon => icon === iconName);
      if (j === -1) {
        return undefined;
      }
      return {
        i,
        j,
      };
    })
    .filter(v => !!v)?.[0];
  if (!indices) {
    return undefined;
  }
  const x = indices.j * SPRITESHEET_DIMENSION;
  const y = indices.i * SPRITESHEET_DIMENSION;
  const styles = {
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${x}px -${y}px`,
    backgroundImage: `url("${state.spritesheetUrl}")`,
  };
  return styles;
};
