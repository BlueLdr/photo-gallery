import { createContext } from "react";
import type { ImageMetadata } from "~/model";

import { ImageGalleryLayout, ImageThumbnailSize } from "~/utils";

import type { WithStateHook } from "~/utils";

//================================================

export type ViewState = WithStateHook<"layout", ImageGalleryLayout> &
  WithStateHook<"size", ImageThumbnailSize> &
  WithStateHook<"selectedImage", ImageMetadata | undefined>;

export const ViewContext = createContext<ViewState>({
  layout: ImageGalleryLayout.Grid,
  setLayout: () => undefined,
  size: ImageThumbnailSize.md,
  setSize: () => undefined,
  selectedImage: undefined,
  setSelectedImage: () => undefined,
});
