import type { PaletteOptions } from "@mui/material/styles";

//================================================

export interface PgBackgroundColors {
  layer: string;
}

export const colors = {
  common: {},
  primary: {
    main: "#219bfc",
  },
  background: {
    paper: "#202020",
    default: "#121212",
    layer: "rgba(255,255,255,0.04)",
  },
} as const satisfies PaletteOptions;
