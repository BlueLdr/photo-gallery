import { ImageThumbnailSize } from "~/utils";

import type { TypographyProps } from "@mui/material/Typography";

//================================================

export const THUMBNAIL_SIZE_STYLES: Record<
  ImageThumbnailSize,
  { image: number; padding: number; radius: number; font: TypographyProps["variant"] }
> = {
  [ImageThumbnailSize.xs]: {
    image: 128,
    padding: 8,
    radius: 6,
    font: "caption",
  },
  [ImageThumbnailSize.sm]: {
    image: 160,
    padding: 10,
    radius: 8,
    font: "body2",
  },
  [ImageThumbnailSize.md]: {
    image: 192,
    padding: 12,
    radius: 10,
    font: "body1",
  },
  [ImageThumbnailSize.lg]: {
    image: 256,
    padding: 16,
    radius: 14,
    font: "h6",
  },
  [ImageThumbnailSize.xl]: {
    image: 384,
    padding: 20,
    radius: 18,
    font: "h5",
  },
};
