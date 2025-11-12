import { useMemo, useState } from "react";

import { FilterMode } from "~/model";
import { ImageGalleryLayout, ImageThumbnailSize } from "~/utils";

import { ViewContext } from "./context";

import type { FilterState, ImageMetadata } from "~/model";
import type { WithChildren } from "~/utils";

//================================================

export type ViewStateProviderProps = WithChildren;

export function ViewStateProvider({ children }: ViewStateProviderProps) {
  const [layout, setLayout] = useState(ImageGalleryLayout.Grid);
  const [size, setSize] = useState(ImageThumbnailSize.md);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata>();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ mode: FilterMode.Any });

  const value = useMemo(
    () => ({
      layout,
      setLayout,
      size,
      setSize,
      selectedImage,
      setSelectedImage,
      search,
      setSearch,
      filters,
      setFilters,
    }),
    [layout, size, selectedImage, search, filters],
  );

  return <ViewContext value={value}>{children}</ViewContext>;
}
