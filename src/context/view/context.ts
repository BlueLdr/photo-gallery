import { createContext } from "react";

import { ImageGalleryLayout, ImageThumbnailSize } from "~/utils";

import type { FilterState, ImageMetadata } from "~/model";
import type { WithStateHook } from "~/utils";

//================================================

export type ViewState = WithStateHook<"layout", ImageGalleryLayout> &
  WithStateHook<"size", ImageThumbnailSize> &
  WithStateHook<"selectedImage", ImageMetadata | undefined> &
  WithStateHook<"search", string> &
  WithStateHook<"filters", FilterState>;

export const ViewContext = createContext<ViewState>({
  layout: ImageGalleryLayout.Grid,
  setLayout: () => undefined,
  size: ImageThumbnailSize.md,
  setSize: () => undefined,
  selectedImage: undefined,
  setSelectedImage: () => undefined,
  search: "",
  setSearch: () => undefined,
  filters: {},
  setFilters: () => undefined,
});
