import { useMemo, useState } from "react";

import { ImageGalleryLayout, ImageThumbnailSize } from "~/utils";

import { ViewContext } from "./context";

import type { ImageMetadata } from "~/model";
import type { WithChildren } from "~/utils";

//================================================

export type ViewStateProviderProps = WithChildren;

export function ViewStateProvider({ children }: ViewStateProviderProps) {
  const [layout, setLayout] = useState(ImageGalleryLayout.Grid);
  const [size, setSize] = useState(ImageThumbnailSize.md);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata>();

  const value = useMemo(
    () => ({ layout, setLayout, size, setSize, selectedImage, setSelectedImage }),
    [layout, size, selectedImage],
  );

  return <ViewContext value={value}>{children}</ViewContext>;
}
