/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { ThemeAdditions } from "~/theme";
import type { PgBackgroundColors } from "./theme/colors";

//================================================

declare module "@mui/material/styles" {
  interface TypeBackground extends PgBackgroundColors {}

  interface Theme extends ThemeAdditions {}
}
