import { format } from "date-fns";

import type { ImageFileMetadata } from "~/model";

//================================================

export type ImageDisplayableMetadataKey =
  | keyof Omit<ImageFileMetadata, "rotation" | "width" | "height" | "keywords" | "rawCategories">
  | "dimensions"
  | "tags";

export const getMetadataDisplayValue = (
  meta: ImageFileMetadata,
  key: ImageDisplayableMetadataKey,
) => {
  if (key === "tags") {
    return meta.tags.map(tag => tag.name).join(", ");
  }
  if (key === "dimensions") {
    return meta.width != null && meta.height != null ? `${meta.width} x ${meta.height}` : undefined;
  }
  if (key === "dateCreated" || key === "lastModified") {
    const value = meta[key];
    return value != null && !isNaN(value) ? format(new Date(value), "PPpp") : undefined;
  }
  if (meta[key] != null) {
    return `${meta[key]}`;
  }
};
